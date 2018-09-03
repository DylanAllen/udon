<template>
  <div>
    <div class="regform padtop">
      <h2>Sign In</h2>
      <input type="text" v-model="email" autocomplete="email" placeholder="Email">
      <input type="password" v-model="password" v-on:keyup.enter="login" autocomplete="current-password" placeholder="Password">
      <button v-on:click="login">Login</button>
      <p>Login here or <router-link to="/signup">Create an Account</router-link></p>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import router from '../router'
export default {
  name: 'login',
  data () {
    return {
      'email': '',
      'password': ''
    }
  },
  methods: {
    login: function () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
        function (user) {
          router.replace('/')
        },
        function (err) {
          alert('Oops. ' + err.message)
        }
      )
    }
  }
}
</script>

<style scoped>
  .padtop {
    margin-top: 40px;
  }
  p {
    margin-top: 40px;
    font-size: 13px;
    text-align: center;
  }
  p a {
    text-decoration: underline;
    cursor: pointer;
  }
</style>
