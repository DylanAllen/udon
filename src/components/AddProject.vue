<template>
  <div>
    <h1>Add New Project</h1>
    <form>
      <select v-model="client" v-on:change="checkClient()">
        <option v-for="(client, idx) in clients" :key="idx" :value="client.id">{{ client.name }}</option>
      </select>
      <input v-model="projectname" placeholder="Project Name">
      <select v-model="type" placeholder="Project Type">
        <option value="print">Print</option>
        <option value="web design">Web Design</option>
        <option value="">SEO</option>
        <option value="">Web Development</option>
      </select>
      <input v-model="start" type="date" placeholder="Start Date">
      <input v-model="due" type="date" placeholder="Due Date">
      <input v-model="budget" type="number" placeholder="Budget (Hours)">
      <input v-model="status" placeholder="Open">
      <div class="checkcontainer">
        <label for="retainer">Retainer</label>
        <input class="checkinput" name="retainer" type="checkbox" v-model="retainer">
      </div>
      <button type="button" v-on:click="addProject(client, clientName, projectname, start, due, budget, status, retainer, type)">Add Project</button>
    </form>
  </div>
</template>

<script>
import { db } from '../main'
import writeFunctions from '../mixins/writeFunctions'
export default {
  mixins: [writeFunctions],
  props: ['addProjCallback()'],
  name: 'AddProject',
  data () {
    return {
      clients: [],
      projectname: '',
      client: '',
      clientName: '',
      start: '',
      due: '',
      budget: '',
      status: 'Open',
      retainer: '',
      type: ''
    }
  },
  methods: {
    checkClient () {
      var self = this
      db.collection('clients').doc(this.client).get().then(function (documentSnapshot) {
        self.clientName = documentSnapshot.data().name
      })
    },
    projCallback () {
      this.$emit('projCallback')
    }
  },
  created: function () {
    db.collection('clients').get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        var record = doc.data()
        record.id = doc.id
        this.clients.push(record)
      }.bind(this))
    }.bind(this))
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
select {
    display: block;
    margin: auto;
    padding: 5px;
    font-family: 'Montserrat';
    border: 1px solid #eaeaea;
    font-size: 17px;
    background-color: #ffffff;
    width: 284px;
}
@media (max-width: 767px) {
  input {
    margin: 10px auto;
    display: block;
    min-width: 200px;
    padding: 10px;
  }
  select {
    width: 222px;
  }
}
</style>
