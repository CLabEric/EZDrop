<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/login">Login</router-link> |
      <router-link to="/dashboard">Dashboard</router-link> |
      <router-link to="/register">Register</router-link> |
      <a href="" @click.prevent="logout">Logout</a>
    </div>
    <router-view/>
  </div>
</template>

<script>
import axios from "axios";

export default {
  methods: {
    logout() {
      axios({
        method: 'get',
        url: 'http://localhost:3000/logout',
        responseType: 'text',
        withCredentials: true
      })
      .then(() => {
        this.$router.push('/');
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
.submit {
  margin-top: 15px;
  text-align: center;
}
.submit > button { width: 100%; }
</style>
