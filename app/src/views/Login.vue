<template>
    <div id="login">
        <div class="login">
            <h1>login page</h1>
        </div>
        <form @submit.prevent="handleForm">
            <label>User Name</label>
            <input type="text" required v-model="name">
            <label>Email</label>
            <input type="email" required v-model="email">
            <label>Password</label>
            <input type="password" required v-model="password">
            <div class="error" v-if="passwordError">{{ passwordError }}</div>
            <div class="submit">
                <button>Login</button>
            </div>
        </form>
    </div>
</template>

<script>
import axios from "axios";
const backendUrl = process.env.NODE_ENV === 'production' ? 'https://easydrop.herokuapp.com/' : process.env.VUE_APP_BACKEND_URL;

export default {
    data() {
        return {
            name: '',
            email: '',
            password: '',
            passwordError: '',
            fetchResults: []
        }
    },
    // created() {
    //     this.checkAuth();
    // },
    // use mounted for web3?
    mounted() {
    },
    methods: {
        handleForm(event) {
            this.passwordError = this.password.length > 5 ? '' : 'Password must be at least 6 characters long';

            axios({
                method: 'post',
                url: `${backendUrl}login`,
                responseType: 'text',
                withCredentials: true,
                headers: {"Content-Type": "application/json"},
                data: JSON.stringify({
                    uname: event.target[0].value,
                    email: event.target[1].value,
                    pw: event.target[2].value
                })
            })
            .then(async (response) => {
                const text = await response.data;
                if (!response.statusText === "OK") {
                    throw text;
                } else {
                    if (text === 'success') {
                        this.$store.state.loggedIn = true;
                        this.$router.push('dashboard');
                    } else {
                        // console.log('login not successful');
                    }   
                }
            })
            .catch((error) => {
                console.error("throw error", error);
            });
        },
        // checkAuth() {
        //     axios({
        //         method: 'get',
        //         url: `${backendUrl}login`,
        //         responseType: 'text',
        //         withCredentials: true
        //     })
        //     .then(async (response) => {
        //         const text = await response.data;
        //         if (!response.statusText === "OK") {
        //             throw text;
        //         } else {
        //             if (text === 'already logged in') {
        //                 this.$router.push('dashboard');
        //             }
        //         }
        //     })
        //     .catch(error => {
        //         console.error("throw error", error);
        //     });
        // }
    }
}
</script>

<style scoped>
#login {
    align-items: center;
    display: flex;
    flex-direction: column;
}
</style>