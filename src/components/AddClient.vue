<template>
  <div>
    <h1>Add New Client</h1>
    <form id="newclient">
      <input v-model="name" placeholder="Client Name">
      <input v-model="contact" placeholder="Contact Name">
      <input v-model="email" placeholder="Contact Email">
      <div class="checkcontainer">
        <label for="activeclient">Active</label>
        <input class="checkbox" name="activeclient" type="checkbox" v-on:click="whatHappend(activeclient)" v-model="activeclient">
      </div>
      <button type="button" v-on:click="addClient(name, contact, email, activeclient)">Add New Client</button>
    </form>
  </div>
</template>

<script>
import { db } from '../main'
import writeFunctions from '../mixins/writeFunctions'
export default {
  mixins: [writeFunctions],
  name: 'Clients',
  data () {
    return {
      clients: [],
      name: '',
      contact: '',
      email: '',
      activeclient: ''
    }
  },
  firestore () {
    return {
      clients: db.collection('clients').orderBy('createdAt')
    }
  },
  methods: {
    addClient (name, contact, email, activeclient) {
      var self = this
      const createdAt = new Date()
      var clientData = {
        'name': name,
        'contact': contact,
        'createdAt': createdAt,
        'active': activeclient,
        'email': email
      }
      db.collection('clients').add(clientData).then(function (docRef) {
        alert('New Client: ' + self.name + ' added.')
        self.logActivity(docRef.id, '', 'clients', docRef, 'create')
        self.name = ''
        self.contact = ''
        self.email = ''
      }).catch(function (error) {
        alert('Error: ' + error)
      })
    },
    whatHappend (message) {
      console.log(message)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
  text-align: center;
}
img {
  display: block;
  margin: 20px auto;
}
ul#clientlist {
  background-color: #f9f9f9;
  padding: 20px;
  float: left;
  list-style-type: none;
}
li {
  margin: 0;
  padding:8px;
  cursor: pointer;
}
a {
  color: #42b983;
}
.checkcontainer {
    text-align: center;
}
.checkcontainer label, .checkcontainer input {
  display: inline;
  text-align: center;
}
#newclient {
  display: flex;
  flex-wrap: wrap;
  width: 400px;
  max-width: 90%;
  margin: auto;
}
#newclient input {
  flex-wrap: wrap;
  width: 100%;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 10px;
}
#newclient button {
    width: 100%;
    padding: 10px;
    font-size: 18px;
    background-color: #f2f2f2;
    color: #666666;
}
</style>
