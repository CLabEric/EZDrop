<template>
  <div id="home">
    <div class="home">
      <h1>{{ this.drop.name }}</h1>
    </div>
    <div class="gallery">
      <div class="piece" v-for="(nft, index) in metaData" :key="nft.itemData.name">
        <img :src="'data:image/png;base64,' + nft.itemData.image" />
        <div class="wrapper">
          <label>{{ nft.itemData.name }}</label>
          <div class="price">{{ nft.itemData.price }} ETH 
            <span :class="{ sold: !nft.itemData.txhash }"> -<b> SOLD</b></span>
          </div>
          <div class="transaction">
            <button
              :class="{ sold: nft.itemData.txhash }"
              @click="mintNft($event, index)" 
              :data-name="nft.itemData.name"
              :data-description="nft.itemData.description"
              :data-price="nft.itemData.price"
              :data-image="nft.itemData.image"
              :data-hash="nft.itemData.txhash"
            >Mint
            </button>
            <a :href="'https://rinkeby.etherscan.io/tx/' + nft.itemData.txhash" :class="{ sold: !nft.itemData.txhash, hash: true }" target="_blank">See Transaction</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// should I try to not make another fetch when navigating back from another route??
// @ is an alias to /src
import axios from "axios";
import Web3 from "web3";
import { create } from "ipfs-http-client";
import ezDropArtifact from "../../../build/contracts/EZDrop.json";
import ezDropArtifactRinkeby from "../../contracts/ezDrop.json";
const backendUrl = process.env.NODE_ENV === 'production' ? 'https://easydrop.herokuapp.com/' : process.env.VUE_APP_BACKEND_URL;

export default {
  name: 'Home',
  data () {
    return {
      drop: this.$route.params.drop,
      web3: null,
      contract: null,
      account: null
    }
  },
  created() {
    this.getMetadata();
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      this.web3 = web3;
      this.web3stuff();
    } else {
      console.warn(
        "No web3 detected."
      );
    }
  },
  computed: {
    metaData() {
      return this.$store.state.metaData;
    }
  },
  methods: {
    getMetadata() {
      axios({
        method: 'get',
        url: `${backendUrl}${this.drop}`,
        responseType: 'text'
      })
      .then( response => {
        this.$store.state.metaData = response.data;
      });
    },
    async web3stuff() {
      const web3 = this.web3;
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ezDropArtifact.networks[networkId];
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      // if rinkeby
      if (networkId == 4) {
        this.contract = new web3.eth.Contract(
          ezDropArtifactRinkeby,
          '0xAA8Ac4e956508708218B6c01f21781873421533c'
        );
      } else if (deployedNetwork) {
        this.contract = new web3.eth.Contract(
          ezDropArtifact.abi,
          deployedNetwork.address
        );
      }
      // ELSE display notice to connect wallet

      this.account = accounts[0];
    },
    async mintNft(e, index) {
      const { mint } = this.contract.methods;
      const ipfs = create('https://ipfs.infura.io:5001');
      const weiValue = Web3.utils.toWei(e.target.dataset.price, 'ether');
      const image = new Buffer.from(e.target.dataset.image, 'base64');
      const fileHash = await ipfs.add(image);
      const tokenMeta = {
          "name": e.target.dataset.name,
          "description": e.target.dataset.description,
          "image": "https://ipfs.io/ipfs/" + fileHash.path
      };
      const tokenURI = await ipfs.add(JSON.stringify(tokenMeta));
      await mint(tokenURI.path)
        .send({ from: this.account, value: parseInt(weiValue) })
        .on("receipt", (receipt) => {
          this.metaData[index].itemData.txhash = receipt.transactionHash;
          this.setTxHash(
            this.metaData[index]._id, 
            this.metaData[index].itemData.txhash
          );
        });
    },
    async setTxHash(id, txHash) {
      axios.post( `${backendUrl}setHash`,
        {id, txHash}
      ).
      then( response => {
        if (response.data.ok === 1) {
          console.log('db updated with tx hash');
        }
      })
      .catch(function(error){
        console.error('FAILURE!!', error);
      });
    }
  }
}
</script>

<style>
button {
  margin: 5px 0;
}
#home {
    align-items: center;
    display: flex;
    flex-direction: column;
    width: 90%;
}
.gallery {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: inherit;
}
.hash { word-wrap: break-word; }
.piece {
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  margin: 5px;
  height: 325px;
  width: 300px;
  padding: 10px;
}
.price { font-size: 20px; }
img {
  height: 300px;
  object-fit: contain;
  width: 100%;
}
input {
  margin: 5px 0;
}
label {
  display: block;
  margin: 5px 0px;
}
.sold { display: none; }
.transaction { height: 32px; }
.wrapper {
  background-color: white;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
}

</style>
