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
      <input v-model="hours" type="number" placeholder="0" autofocus v-on:keydown.13="logHours(activeClientId, client, project, projectName, activeProject, activeTask, activeTaskId, hours, comments)">
      <button type="button" v-if="!this.timeEntryID" v-on:click="logHours(activeClientId, client, clientName, project, projectName, activeProject, activeTask, activeTaskId, hours, comments, date)">Submit</button>
      <button type="button" v-if="this.timeEntryID" v-on:click="updateHours(timeEntryID, hours, comments, date, projectId, clientId, activeTaskId)">Edit</button>
    </div>
  </div>
</template>

<script>
import { db } from '../main'
import writeFunctions from '../mixins/writeFunctions'
export default {
  mixins: [writeFunctions],
  props: ['activeProject', 'activeTask', 'toggleModal()', 'client', 'budget', 'logged', 'activeTaskId', 'activeClientId', 'timeEntryID'],
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
      var self = this
      db.collection('tasks').doc(this.activeTaskId)
        .onSnapshot(function (querySnapshot) {
          self.task = querySnapshot.data()
          self.task.id = querySnapshot.id
        })
    }
  },
  created: function () {
    var self = this
    if (this.timeEntryID) {
      db.collection('timelog').doc(this.timeEntryID).get().then(function (documentSnapshot) {
        var data = documentSnapshot.data()
        self.editEntryData = data
        self.editEntryData.id = documentSnapshot.id
        self.clientName = data.clientName
        self.projectName = data.projectName
        self.projectId = data.project.id
        self.project = data.project
        self.clientId = data.clientId
        self.date = self.formatDate(data.activityDate)
        self.comments = data.comments
        self.hours = data.hours
        self.queryTasks()
      })
    } else {
      db.collection('projects').doc(this.activeProject).get().then(function (documentSnapshot) {
        self.projectName = documentSnapshot.data().name
        self.clientName = documentSnapshot.data().clientName
        self.queryTasks()
      })
      this.project = db.collection('projects').doc(this.activeProject)
    }
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
