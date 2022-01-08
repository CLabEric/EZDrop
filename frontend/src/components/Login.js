import { useState } from 'react'
import axios from 'axios'

const Login = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [passWord, setPassword] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();


        axios({
            method: 'post',
            url: `http://localhost:3000/login`,
            responseType: 'text',
            withCredentials: true,
            headers: {"Content-Type": "application/json"},
            data: JSON.stringify({
                uname: userName,
                email: email,
                pw: passWord
            })
        })
        .then(async (response) => {
            const text = await response.data;
            console.log(text);
            // if (!response.statusText === "OK") {
            //     throw text;
            // } else {
            //     if (text === 'success') {
            //         this.$store.state.loggedIn = true;
            //         this.$router.push('dashboard');
            //     } else {
            //         // console.log('login not successful');
            //     }   
            // }
        })
        .catch((error) => {
            console.error("throw error", error);
        });


    };

    return ( 
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label>User Name</label>
                <input 
                    type="text" 
                    required
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                />
                <label>Email</label>
                <input 
                    type="text" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <label>Password</label>
                <input 
                    type="text" 
                    required
                    value={passWord}
                    onChange={e => setPassword(e.target.value)}
                />

                <button>Login</button>
            </form>
        </div>
    );
}
 
export default Login;