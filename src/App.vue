<template>
  <div id="app">
    <header>
      <div class="title-row">
        <a href="#" @click="toggleMenu" id="hamburger">
            <span></span>
        </a>
        <router-link to="/">
          <img src="./assets/udonlogo-white.png" id="logo">
        </router-link>
      </div>
    </header>
    <div class="nav-contain">
      <nav>
        <router-link class="" @click.native="toggleMenu" to="/">Home</router-link>
        <router-link class="" @click.native="toggleMenu" to="/account">Account Details</router-link>
        <router-link class="" @click.native="toggleMenu" to="/clients">Clients</router-link>
        <router-link class="" @click.native="toggleMenu" to="/addclient">Add Client</router-link>
        <router-link class="" @click.native="toggleMenu" to="/mytimelog">My Time Log</router-link>
        <router-link class="" @click.native="toggleMenu" to="/timelog">Time Log</router-link>
        <span class="" @click="logout">Sign Out</span>
      </nav>
    </div>
    <div id="content">
      <transition name="fade">
        <router-view/>
      </transition>
    </div>
    <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
  </div>
</template>

<script>
import { db } from './main'
import firebase from 'firebase'
export default {
  name: 'App',
  data () {
    return {
      'email': firebase.auth().currentUser.email,
      'uid': ''
    }
  },
  methods: {
    logout: function () {
      firebase.auth().signOut().then(() => {
        this.$router.replace('login')
        this.toggleMenu()
      })
    },
    toggleMenu: function () {
      document.getElementById('app').classList.toggle('menu-active')
    }
  },
  created: function () {
    var self = this
    db.collection('users').where('email', '==', this.email)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          self.uid = doc.id
        })
      })
  }
}
</script>

<style lang="scss">
   @import './assets/style.scss'
</style>
