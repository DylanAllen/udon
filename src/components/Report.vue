<template>
  <div>
    <h1>Project Report</h1>
    <div class="hourlog">
      <div class="reporthead">
        <div class="reportheading col1">
          Customer
        </div>
        <div class="reportheading col2">
          Project
        </div>
        <div class="reportheading col2">
          Budget
        </div>
        <div class="reportheading col2">
          Logged
        </div>
        <div class="reportheading col2">
          Status
        </div>
        <div class="reportheading col2">
          Start
        </div>
        <div class="reportheading col2">
          Due
        </div>
        <div class="reportheading col2">
          PM
        </div>
      </div>
      <div class="entry" v-for="(entry, idx) in log" :key="idx">
        <div class="customer">
          {{entry.clientName}}
        </div>
        <div class="project">
          {{entry.projectName}}
        </div>
        <div class="task">
          {{entry.task}}
        </div>
        <div class="hours">
          {{entry.hours}}
        </div>
        <div class="user">
          {{entry.username}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../main'
import firebase from 'firebase/app'
import writeFunctions from '../mixins/writeFunctions'
export default {
  mixins: [writeFunctions],
  props: ['projectId', 'taskId', 'customerId'],
  name: 'Report',
  data () {
    return {
      'log': [],
      'email': firebase.auth().currentUser.email,
      'uid': ''
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
    queryProjects () {
      var projects = db.collection('projects')
      projects
        .get()
        .then(function (querySnapshot) {
          this.log = []
          querySnapshot.forEach(function (doc) {
            var hour = doc.data()
            hour.id = doc.id
            this.log.push(hour)
          })
        }.bind(this))
    }
  },
  created: function () {
    this.queryProjects()
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
.entry div {
    border: 1px solid;
    width: 18%;
    float: left;
    border-collapse: collapse;
    padding: 5px;
    margin-bottom: 10px;
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
