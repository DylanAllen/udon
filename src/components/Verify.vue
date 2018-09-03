<template>
  <div class="verify">
    <h3>Verify Your Email</h3>
    <p>
      Please check you email for a verification link before you can begin using UDON Project Managment
    </p>
    <button v-on:click="sendVerification">Resend Verification Email</button>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'verify',
  methods: {
    sendVerification: function () {
      console.log(firebase.auth().currentUser)
      firebase.auth().currentUser.sendEmailVerification().then(function () {
        alert('Email sent!')
      }).catch(function (error) {
        alert('Error: ' + error)
      })
    }
  }
}
</script>

<style scoped>
  .login {
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
