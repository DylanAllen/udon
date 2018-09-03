<template>
  <div class="accountdeets">
    <h3>Account Details</h3>
    <span class="label">EMAIL</span>
    <span class="email">{{ email }}</span>
    <span class="label">DISPLAY NAME</span>
    <input type="text" v-model="uname">
    <span class="label">TITLE</span>
    <input type="text" v-model="title">
    <span class="label">DEPARTMENT</span>
    <input type="text" v-model="department">
    <span class="label">PHONE NUMBER</span>
    <input type="text" v-model="phone">
    <button v-on:click="updateProfile">Update Profile</button>
  </div>
</template>

<script>
import firebase from 'firebase'
import { db } from '../main'
export default {
  name: 'account',
  data () {
    return {
      'userdata': [],
      'email': firebase.auth().currentUser.email,
      'uname': firebase.auth().currentUser.displayName,
      'title': '',
      'department': '',
      'phone': '',
      'theuid': ''
    }
  },
  methods: {
    updateProfile () {
      var self = this
      firebase.auth().currentUser.updateProfile({
        displayName: this.uname
      }).then(
        function (user) {
          db.collection('users').doc(self.theuid).update({
            name: self.uname,
            department: self.department,
            phone: self.phone,
            title: self.title
          }).then(function (docRef) {
            self.logActivity('', '', 'users', docRef, 'update')
          })
        }
      )
      alert('Your Profile has been Updated')
    }
  },
  created () {
    var self = this
    db.collection('users').where('email', '==', this.email)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          var user = doc.data()
          self.title = user.title
          self.department = user.department
          self.phone = user.phone
          self.theuid = doc.id
        })
      })
      .catch(function (error) {
        console.log('Error getting documents:', error)
      })
  }
}
</script>

<style scoped>
  .accountdeets {
    margin-top: 40px;
    max-width: 100%;
    width: 600px;
    margin: auto;
  }
  .label {
    text-align: center;
    min-width: 200px;
    border-bottom: 2px solid #528c6d;
    padding-top: 20px;
  }
  .email {
    padding-top: 8px;
    display: block;
  }
  input {
    margin: 10px auto;
    width: 20%;
    display: block;
    min-width: 250px;
    padding: 15px;
    border: 1px solid #eaeaea;
    font-size: 16px;
  }
  button {
    margin: 20px auto 0;
    display: block;
    cursor: pointer;
    background-color: #eaeaea;
    color: #6F8896;
    padding: 20px;
    text-transform: uppercase;
    font-size: 22px;
  }
  p {
    margin-top: 40px;
    font-size: 13px;
  }
  p a {
    text-decoration: underline;
    cursor: pointer;
  }
  span {
    display: block;
    margin: auto;
    max-width: 250px;
  }
  @media (max-width: 767px) {
    input {
      padding: 10px;
      margin: 5px auto;
    }
  }
</style>
