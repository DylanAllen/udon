<template>
  <div class="signup">
    <div id="resetpassword" v-if="emailSent == false">
      <h3>Reset Your Password</h3>
      <div class="regform">
        <input type="text" v-model="email" autocomplete="email" placeholder="Email" v-on:keyup.enter="resetPassword">
        <button v-on:click="resetPassword">Send Password Reset Email</button>
      </div>
      <span>Go back to <router-link to="/login">login</router-link> or <router-link to="/signup">Create an Account</router-link></span>
    </div>
    <div id="emailsent" v-if="emailSent == true">
      <h3>Password reset email has been sent!</h3>
      <p>Check your inbox, and then <router-link to="/login">login</router-link></p>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
export default {
  name: 'PasswordReset',
  data () {
    return {
      'email': '',
      'emailSent': false
    }
  },
  methods: {
    resetPassword () {
      firebase.auth().sendPasswordResetEmail(this.email).then(function () {
        this.emailSent = true
      }.bind(this)).catch(function (error) {
        alert('Oops: ' + error)
      })
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
  #emailsent p {
    text-align: center;
  }
</style>
