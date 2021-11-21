<template>
  <div id="app">
    <div id="nav">
      <div class="nav-links">
        <router-link v-if="currentRoute !== 'Home'" to="/">Back to Home</router-link>
        <router-link v-if="loggedIn && currentRoute == 'Home'" to="/dashboard">Dashboard</router-link>
        <!-- <router-link to="/register">Register</router-link> -->
      </div>
      <div class="nav-auth">
        <router-link v-if="!loggedIn" to="/login">Login</router-link>
        <a href="" v-if="loggedIn" @click.prevent="logout">Logout</a>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
import axios from "axios";
const backendUrl = process.env.NODE_ENV === 'production' ? 'https://easydrop.herokuapp.com/' : process.env.VUE_APP_BACKEND_URL;

export default {
  computed: {
    loggedIn() {
      return this.$store.state.loggedIn;
    },
    currentRoute() {
      return this.$route.name;
    }
  },
  methods: {
    logout() {
      axios({
        method: 'get',
        url: `${backendUrl}logout`,
        responseType: 'text',
        withCredentials: true
      })
      .then(() => {
        this.$store.state.loggedIn = false;
        if (this.$route.name === 'Dashboard') {
          this.$router.push('/');
        }
      })
      .catch(error => {
        console.error('throw error:', error)
      });
    }
  }
}
</script>

<style>
#app {
  align-items: center;
  display: flex;
  flex-direction: column;
}
form {
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  margin-top: 5px;
  padding: 5px 15px 15px 15px;
}
form > label {
  margin-top: 10px;
}
#nav {
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 90%;
}
.nav-auth {
}
.submit {
  margin-top: 15px;
  text-align: center;
}
.submit > button { width: 100%; }
</style>
