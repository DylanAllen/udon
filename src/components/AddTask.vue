<template>
  <div>
    <h1>Add New Task</h1>
    <form>
      <h3>{{clientName}}</h3>
      <h3>{{projectName}}</h3>
      <input v-model="taskName" placeholder="task Name">
      <input v-model="category" type="text" placeholder="task Category">
      <input v-model="budget" type="number" placeholder="Budget (Hours)">
      <button type="button" v-on:click="createTask(activeClientId, clientName, activeProject, project, projectName, taskName, budget, category)">Add task</button>
    </form>
  </div>
</template>

<script>
import { db } from '../main'
import writeFunctions from '../mixins/writeFunctions'
export default {
  mixins: [writeFunctions],
  props: ['activeProject', 'toggleModal()', 'activeClientId'],
  name: 'AddTask',
  data () {
    return {
      project: '',
      projectName: '',
      clientName: '',
      budget: '',
      taskName: '',
      category: ''
    }
  },
  firestore () {
    return {
    }
  },
  methods: {
    projCallback () {
      this.$emit('projCallback')
    },
    clearInputs () {
      this.project = ''
      this.projectName = ''
      this.client = ''
      this.clientName = ''
      this.budget = ''
      this.taskName = ''
      this.category = ''
    }
  },
  created: function () {
    db.collection('projects').doc(this.activeProject).get().then(function (documentSnapshot) {
      this.projectName = documentSnapshot.data().name
      this.clientName = documentSnapshot.data().clientName
    }.bind(this))
    this.project = db.collection('projects').doc(this.activeProject)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this task only -->
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
