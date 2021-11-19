<template>
  <div id="home">
    <div class="home">
      <h1>home page</h1>
    </div>
    <!-- <form @submit.prevent="burn">
      <input type="number" name="number" id="number">
      <button type="submit">Burn</button>
    </form> -->
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
            <a href="#" :class="{ sold: !nft.itemData.txhash, hash: true }">{{ nft.itemData.txhash }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// should I try to not make another fetch when navigating back from another route??
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import axios from "axios";
import Web3 from "web3";
import { create } from "ipfs-http-client";
import ezDropArtifact from "../../../build/contracts/EZDrop.json";
// import ezDropArtifact from "../../contracts/ezDrop.json";

export default {
  name: 'Home',
  data () {
    return {
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
const huh = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_PROD_BACKEND_URL : process.env.VUE_APP_BACKEND_URL;
console.log(process.env.NODE_ENV);
console.log(huh);
      axios({
        method: 'get',
        url: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_PROD_BACKEND_URL : process.env.VUE_APP_BACKEND_URL,
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

      this.contract = new web3.eth.Contract(
        ezDropArtifact.abi,
        // ezDropArtifact,
        deployedNetwork.address
        // '0x29B187A37781c0EB193EA25A9feF2ade80Fd7b72'
      );
      // console.log(this.contract);
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
      await mint(tokenURI)
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
      axios.post( `${process.env.BACKEND_URL}setHash`,
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
    },
    async burn(e) {
      // const { _burn } = this.contract.methods;
      // const number = parseInt(e.target.number.value);
      // await _burn(number)
      //   .send({ from: this.account })
      //   .on('receipt', () => {
      //     console.log('burned?');
      //   });
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
