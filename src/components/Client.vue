<template>
  <div>
    <div id="sidebar">
      <ul id="clientlist">
        <li class="client" v-for="(client, idx) in clients" :key="idx" v-bind:class="{ active:activeClient == client.id }" v-on:click="displayClient( client.id, this)">{{ client.name }}</li>
      </ul>
    </div>
    <div class="contentright">
      <div class="rightinner">
        <div class="clientdetails">
          <h2>Client Info</h2>
          <span class="label">NAME</span><br/>
          <span class="name">{{ name }}</span><br/><br/>
          <span class="label">CONTACT NAME</span><br/>
          <span class="name">{{ contact }}</span><br/><br/>
          <button id="triggermodal" v-bind:class="{visible:activeClient != ''}" v-on:click="updateModal">Update Client Info</button>
        </div>
        <div id="editclient" v-on:click="deactivateMe">
          <form>
            <input v-model="name" autocomplete="organization" placeholder="Client Name">
            <input v-model="contact" autocomplete="name" placeholder="Contact Name">
            <input v-model="email" autocomplete="email" placeholder="Contact Email">
            <input type="checkbox" v-model="active">
            <button type="button" v-on:click="updateClient(activeClient, name, contact, email, active)">Update</button>
          </form>
        </div>
      </div>
    </div>
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
      active: '',
      activeClient: ''
    }
  },
  firestore () {
    return {
      clients: db.collection('clients').orderBy('createdAt')
    }
  },
  methods: {
    displayClient (id) {
      var pastState = this.activeClient
      this.activeClient = id
      db.collection('clients').doc(id).get()
        .then(doc => {
          if (!doc.exists) {
            console.log('No such document!')
            this.activeClient = pastState
          } else {
            this.name = doc.data().name
            this.contact = doc.data().contact
            this.email = doc.data().email
            this.active = doc.data().active
          }
        })
        .catch(err => {
          console.log('Error getting document', err)
        })
    },
    updateModal () {
      var modal = document.getElementById('editclient')
      modal.classList.toggle('active')
    },
    deactivateMe () {
      event.target.classList.toggle('active')
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
li.client.active {
  font-weight: 700;
  background-color: #528c6d;
  color: #ffffff;
}

#editclient {
  position: absolute;
  opacity: 0;
  top: -500px;
}

#editclient.active {
  opacity: 1;
  top: 0;
  background-color: rgba(0,0,0,0.2);
  left: 0;
  right: 0;
  bottom: 0;
  padding-top: calc(50vh - 200px);
}

#editclient form {
  background-color: #ffffff;
  padding: 50px;
  max-width: 400px;
  margin: auto;
}

#triggermodal {
  display: none;
}

#triggermodal.visible {
  display: block;
}
span.label {
    font-weight: 800;
    font-size: 26px;
    margin-bottom: 10px;
}
</style>
