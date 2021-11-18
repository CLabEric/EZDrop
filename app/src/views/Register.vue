<template>
    <div id="register">
        <div class="register">
            <h1>register page</h1>
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
                <button>Register</button>
            </div>
        </form>
    </div>
</template>

<script>
import axios from "axios";

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
    created() {
        this.checkAuth();
    },
    // brush up on lifecycle hooks
    mounted() {
    },
    methods: {
        handleForm(event) {
            this.passwordError = this.password.length > 5 ? '' : 'Password must be at least 6 characters long';
            fetch(`${process.env.BACKEND_URL}register`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    uname: event.target[0].value,
                    email: event.target[1].value,
                    pw: event.target[2].value
                })
            })
            .then(async (response) => {
                const text = await response.text();
                if (!response.ok) {
                    throw text;
                } else {
                    this.$router.push('login');
                }
            })
            .catch((error) => {
                console.error("throw error", error);
            });
        },
        checkAuth() {
            axios({
                method: 'get',
                url: `${process.env.BACKEND_URL}register`,
                responseType: 'text',
                withCredentials: true
            })
            .then(async (response) => {
                const text = await response.data;
                if (!response.statusText === "OK") {
                    throw text;
                } else {
                    if (text === 'already logged in') {
                        this.$router.push('dashboard');
                    }
                }
            })
            .catch(error => {
                console.error("throw error", error);
            });
        }
    }
}
</script>

<style scoped>
#register {
    align-items: center;
    display: flex;
    flex-direction: column;
}
</style>