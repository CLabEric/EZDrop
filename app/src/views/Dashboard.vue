<template>
  <div id="dashboard">
    <h1>{{ dropName }} dashboard</h1>
    <section id="content">
      <div>
        <div v-if="dropId">
          <form @submit.prevent="addPiece">
            <div
              class="imagePreviewWrapper"
              :style="{ 'background-image': `url(${previewImage})` }"
              @click="selectImage">
            </div>
            <!-- <label for="file">Choose file to upload</label> -->
            <input type="file" ref="fileInput" @input="pickFile">
            <label>Name</label>
            <input type="text" required v-model="name">
            <label>Description</label>
            <input type="text" required v-model="description">
            <label>Price in Eth</label>
            <input type="number" step="any" required v-model="price">
            <div class="submit">
              <button>Submit</button>
            </div>
          </form>
        </div>
        <div v-if="dropId" class="withdraw">
          <button @click="withdrawFunds">withdraw funds</button>
        </div>
        <div v-if="!dropId">
          <div class="drop">
            <h1>Create your Drop</h1>
          </div>
          <form @submit.prevent="createDrop">
            <label>Name</label>
            <input type="text" required v-model="dropName">
            <div class="submit">
              <button>Submit</button>
            </div>
          </form>
        </div>
      </div>
      <div class="images">
        <div class="image" v-for="nft in metaData" :key="nft.itemData.name">
          <img v-bind:src="'data:image/png;base64,' + nft.itemData.image" />
          <div class="name">
            {{ nft.itemData.name }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import Web3 from "web3";
import ezDropArtifact from "../../../build/contracts/EZDrop.json";
import ezDropArtifactRinkeby from "../../contracts/ezDrop.json";
const backendUrl = process.env.NODE_ENV === 'production' ? 'https://easydrop.herokuapp.com/' : process.env.VUE_APP_BACKEND_URL;
axios.defaults.withCredentials = true;

export default {
  data() {
    return {
      dropId: null,
      dropName: null,
      currentImage: null,
      previewImage: null,
      name: null,
      description: null,
      price: null,
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
    selectImage () {
      this.$refs.fileInput.click()
    },
    pickFile (event) {

      this.currentImage = event.target.files[0]; // same as this.$refs.fileInput?

      let input = this.$refs.fileInput
      let file = input.files
      if (file && file[0]) {
        let reader = new FileReader
        reader.onload = e => {
          this.previewImage = e.target.result
        }
        reader.readAsDataURL(file[0])
        this.$emit('input', file[0])
      }
    },
    addPiece(event) {
      const formData = new FormData();
      formData.append('file', this.currentImage);
      formData.append('name', this.name);
      formData.append('description', this.description);
      formData.append('price', this.price);
      formData.append('dropId', this.dropId);
      axios.post( `${backendUrl}upload`,
        formData,
        {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
        }
      ).
      then( response => {
        this.getMetadata();
        this.previewImage = null;
      })
      .catch(function(error){
        console.error('FAILURE!!', error);
      });
    },
    createDrop(event) {
      const name = this.dropName;
      const urlParam = name.replace(/'/g, '').replace(/\s/g , "-").toLowerCase();
      axios.post(`${backendUrl}create-drop`,
        {name, urlParam }
      )
      .then(response => {
        this.dropId = response.data._id;
      })
      .catch(error => console.error('FAILURE!!', error));
    },
    getMetadata() {
      axios({
        method: 'get',
        url: `${backendUrl}dashboard`,
        responseType: 'text',
        withCredentials: true
      })
      .then( response => {
        console.log(response);
        if (response.data === 'empty') {
          console.log('no drops for this user yet');
        } else {
          this.$store.state.metaData = response.data.nfts.reverse();
          this.dropId = response.data.drop.id;
          this.dropName = response.data.drop.name;
          this.$store.state.loggedIn = true;
        }
      }).catch(error => {
        this.$router.push('/');
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
          '0x253307D78eA869f60C32d1d2eeb6753aB6fb7643'
        );
      } else {
        this.contract = new web3.eth.Contract(
          ezDropArtifact.abi,
          deployedNetwork.address
        );
      }

      // console.log(this.contract);
      this.account = accounts[0];
    },
    async withdrawFunds() {
      console.log('withdrawing');

      const { withdraw } = this.contract.methods;
      
      await withdraw()
        .send({ from: this.account })
        .on("receipt", (receipt) => {
          console.log(receipt);
          // 'on' something else?
        });

    }
  }
}
</script>

<style scoped>
#dashboard {
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 90%;
}
#content {
  display: flex;
  width: 100%;
}
.drop {
    align-items: center;
    display: flex;
    flex-direction: column;
}
.images {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin-left: 15px;
  width: 100%;
}
.image {
  border: 1px solid black;
  height: 200px;
  margin: 5px;
  width: 200px;
  padding: 10px;
  position: relative;
}
img {height: unset;}
.imagePreviewWrapper {
  border: 1px solid black;
  width: 300px;
  height: 300px;
  margin: 10px 0;
  background-size: cover;
  background-position: center center;
}
.name {
  position: absolute;
  bottom: 5px;
}
</style>
