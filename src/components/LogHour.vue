<template>
  <div>
    <h1>Log Time</h1>
    <div>
      <h3>{{clientName}}</h3>
      <h3>{{projectName}}</h3>
      <h4>Budget: {{task.budget}}</h4>
      <h4>Logged: {{task.logged}}</h4>
      <h4>Task: {{task.task}}</h4>
      <input v-model="date" type="date">
      <input v-model="comments" type="text" placeholder="What did you do?">
      <input v-model="hours" type="number" placeholder="0" autofocus v-on:keydown.13="submitTimeData()">
      <button type="button" v-if="!this.timeEntryID" v-on:click="submitTimeData()">Submit</button>
      <button type="button" v-if="this.timeEntryID" v-on:click="submitTimeData()">Edit</button>
    </div>
  </div>
</template>

<script>
import { db } from '../main'
import writeFunctions from '../mixins/writeFunctions'
export default {
  mixins: [writeFunctions],
  props: ['activeProject', 'activeTask', 'toggleModal()', 'client', 'budget', 'logged', 'activeTaskId', 'activeClientId', 'timeEntryID', 'activeProjectId'],
  name: 'LogHour',
  data () {
    return {
      project: '',
      projectName: '',
      projectId: {},
      clientName: '',
      clientId: '',
      tasks: [],
      task: {},
      hours: '',
      comments: '',
      editEntryData: [],
      date: ''
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
      this.clientName = ''
    },
    queryTasks () {
      db.collection('tasks').doc(this.activeTaskId)
        .onSnapshot(function (querySnapshot) {
          this.task = querySnapshot.data()
          this.task.id = querySnapshot.id
        }.bind(this))
    },
    submitTimeData () {
      if (!this.timeEntryID) {
        this.logHours(this.activeClientId, this.client, this.clientName, this.project, this.projectName, this.activeProjectId, this.activeTask, this.activeTaskId, this.hours, this.comments, this.date)
      } else {
        this.updateHours(this.timeEntryID, this.hours, this.comments, this.date, this.activeProjectId, this.clientId, this.activeTaskId)
      }
    }
  },
  created: function () {
    if (this.timeEntryID) {
      db.collection('timelog').doc(this.timeEntryID).get().then(function (documentSnapshot) {
        var data = documentSnapshot.data()
        this.editEntryData = data
        this.editEntryData.id = documentSnapshot.id
        this.clientName = data.clientName
        this.projectName = data.projectName
        this.projectId = data.project.id
        this.project = data.project
        this.clientId = data.clientId
        this.date = this.formatDate(data.activityDate)
        this.comments = data.comments
        this.hours = data.hours
        this.queryTasks()
      }.bind(this))
    } else {
      db.collection('projects').doc(this.activeProject).get().then(function (documentSnapshot) {
        this.projectName = documentSnapshot.data().name
        this.clientName = documentSnapshot.data().clientName
        this.queryTasks()
      }.bind(this))
      this.project = db.collection('projects').doc(this.activeProject)
    }
    this.date = this.formatDate(new Date())
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this task only -->
<style scoped>
h1 {
  font-weight: normal;
  text-align: center;
}

h2, h3, h4 {
  font-weight: normal;
  text-align: left;
}
img {
  display: block;
  margin: 20px auto;
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
form {
  max-width: 284px;
  margin: auto;
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
