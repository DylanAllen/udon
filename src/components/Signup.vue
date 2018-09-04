<template>
  <div class="signup">
    <h3>Create an Account</h3>
    <div class="regform">
      <input type="text" v-model="email" autocomplete="email" placeholder="Email">
      <input type="text" v-model="username" autocomplete="name" placeholder="Name">
      <input type="text" v-model="department" autocomplete="department" placeholder="Department">
      <input type="text" v-model="title" autocomplete="title" placeholder="Title">
      <input type="phone" v-model="phone" autocomplete="phone" placeholder="Phone Number">
      <input type="password" v-model="password" v-on:keyup.enter="signUp" autocomplete="new-password" placeholder="Password">
      <button v-on:click="signUp">Sign Up</button>
    </div>
    <span>or go back to <router-link to="/login">login</router-link></span>
  </div>
</template>

<script>
import firebase from 'firebase'
import router from '../router'
import { db } from '../main'
export default {
  name: 'signUp',
  data () {
    return {
      'email': '',
      'password': '',
      'username': '',
      'department': '',
      'phone': '',
      'title': ''
    }
  },
  methods: {
    signUp: function () {
      var theuname = this.username
      var self = this
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
        function (user) {
          db.collection('users').doc(user.uid).set({
            name: self.username,
            email: self.email,
            department: self.department,
            phone: self.phone,
            title: self.title
          }).then(user.updateProfile({
            displayName: theuname
          }).then(function () {
            user.sendEmailVerification().then(function () {
              alert('Please confirm your email address.')
            }).catch(function (error) {
              alert('Error: ' + error)
            })
            router.replace('home')
          }).catch(function (error) {
            alert('Error: ' + error.message)
          }))
        },
        function (err) {
          alert('Oops.' + err.message)
        }
      )
    }
  }
}
</script>

<style scoped>
  .signup {
    margin-top: 40px;
  }
  span {
    display: block;
    margin: 20px 0;
    text-align: center;
    font-size: 11px;
  }
</style>
