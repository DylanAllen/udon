<template>
  <div>
    <h1>Time Log</h1>
    <div id="filters">
      <div class="filterlabel">
        Sort By:
      </div>
      <v-select class="sortselect" :options="sortBy" v-model="sortLabel" placeholder="Sort By" @input="sortLog()"></v-select>
      <button class="button transitions" id="togglesort" v-on:click="toggleSortDir">^</button>
      <div class="filterlabel">
        Start:
      </div>
      <input type="date" class="startdatepicker" v-model="startdate" />
      <div class="filterlabel">
        &nbsp;End:
      </div>
      <input type="date" class="enddatepicker" v-model="enddate" />
    </div>
    <div class="hourlog">
      <div class="entry">
        <div class="label customer">
          <span class="staticlabel" v-on:click="toggleActive">Client</span>
          <div class="headingfilter">
            <v-select class="sortselect" :options="customers" v-model="clientFilter" placeholder="Client" @input="sortLog()"></v-select>
          </div>
        </div>
        <div class="label project">
          <span class="staticlabel" v-on:click="toggleActive">Project</span>
          <div class="headingfilter">
            <v-select class="sortselect" :options="projects" v-model="projectFilter" placeholder="Project" @input="sortLog()"></v-select>
          </div>
        </div>
        <div class="label task">
          <span class="staticlabel" v-on:click="toggleActive">Task</span>
          <div class="headingfilter">
            <v-select class="sortselect" :options="tasks" v-model="taskFilter" placeholder="Task" @input="sortLog()"></v-select>
          </div>
        </div>
        <div class="label hours">
          <span class="staticlabel">Hrs</span>
        </div>
        <div class="label date">
          <span class="staticlabel">Date</span>
        </div>
        <div class="label user">
          <span class="staticlabel" v-on:click="toggleActive">User</span>
          <div class="headingfilter">
            <v-select class="sortselect" :options="users" v-model="userFilterB" placeholder="User" @input="sortLog()"></v-select>
          </div>
        </div>
        <div class="label comments">
          <span class="staticlabel" v-on:click="toggleActive">Description</span>
          <div class="headingfilter">
            <v-select class="sortselect" :options="descs" v-model="descFilter" placeholder="Description" @input="sortLog()"></v-select>
          </div>
        </div>
        <div class="label edit">
          <span class="staticlabel">Edit</span>
        </div>
      </div>
      <div class="entry" v-for="(entry, idx) in filteredLog" :key="idx">
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
        <div class="date">
          {{dateView(entry.activityDate)}}
        </div>
        <div class="user">
          {{entry.username}}
        </div>
        <div class="comments">
          {{entry.comments}}
        </div>
        <div class="edit">
          <div class="editbutton" v-if="entry.userid == uid" v-on:click="openModal(entry.id, entry.projectName, entry.clientName, entry.taskId)">
            <img data-v-8dc7cce2="" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTk4LjIgNTk4LjIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDU5OC4yIDU5OC4yOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj4uc3Qwe2ZpbGw6IzU4NTk1Qjt9PC9zdHlsZT48Zz48cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjkuNiwzODguOUwzMjQuOCw5My43TDUwNCwyNzIuOUwyMDguOCw1NjguMUwyOS42LDM4OC45eiIvPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01ODYuMywxMzMuNWMxNS44LDE1LjcsMTUuOCw0MS4zLDAuMSw1Ny4xYzAsMC0wLjEsMC4xLTAuMSwwLjFsLTYxLjEsNjEuMUwzNDYuMSw3Mi41bDYxLjEtNjEuMmMxNS44LTE1LjgsNDEuMy0xNS44LDU3LjEtMC4xYzAsMCwwLDAsMC4xLDAuMUw1ODYuMywxMzMuNXoiLz48cGF0aCBjbGFzcz0ic3QwIiBkPSJNMCw0NzUuOXYxMjIuOGgxMjIuOEwwLDQ3NS45eiIvPjwvZz48L3N2Zz4=" class="editicon">
          </div>
        </div>
      </div>
      <div class="entry" id="totals">
        <div class="customer">
        </div>
        <div class="project">
        </div>
        <div class="task">
        </div>
        <div class="hours">
          {{ hourstotal }}
        </div>
        <div class="date">
        </div>
        <div class="user">
        </div>
        <div class="comments">
        </div>
        <div class="edit">
        </div>
      </div>
    </div>
    <div id="exportbutton" v-on:click="exportToCSV">
      <span>Export Data to CSV</span>
    </div>
    <div class="modal">
      <div class="modalinner">
        <div id="loghour" v-if="this.modalForm == 'loghours'">
          <LogHour v-bind:timeEntryID="timeEntryID" v-bind:activeProject="activeProject" v-bind:activeTask="activeTask" v-bind:client="client" v-bind:budget="budget" v-bind:logged="logged" v-bind:activeTaskId="activeTaskId" v-bind:activeClientID="activeClientID" v-bind:activeProjectId="activeProjectId"/>
        </div>
        <div id="modalcloser" v-on:click="deactivateModal">
          <img src="../assets/plus-ico.svg" id="addprojecticon" class="closer">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../main'
import firebase from 'firebase/app'
import LogHour from './LogHour'
import writeFunctions from '../mixins/writeFunctions'
export default {
  mixins: [writeFunctions],
  components: {
    'LogHour': LogHour
  },
  props: ['projectId', 'taskId', 'customerId'],
  name: 'HourLog',
  data () {
    return {
      'log': [],
      'email': firebase.auth().currentUser.email,
      'uid': '',
      'sortBy': ['Client', 'Project', 'Task', 'Hours', 'User', 'Date'],
      'sortLabel': 'Project',
      'sortValue': 'projectName',
      'sortDir': 1,
      'userFilter': '',
      'clientFilter': '',
      'projectFilter': '',
      'taskFilter': '',
      'userFilterB': '',
      'descFilter': '',
      'customers': [],
      'projects': [],
      'tasks': [],
      'users': [],
      'descs': [],
      'csvData': [],
      'modalForm': '',
      'timeEntryID': '',
      'activeProject': '',
      'activeProjectId': '',
      'activeTask': '',
      'client': '',
      'budget': '',
      'logged': '',
      'activeTaskId': '',
      'activeClientID': '',
      'startdate': this.formatDate(this.addDays(new Date(), -7)),
      'enddate': this.formatDate(new Date())
    }
  },
  computed: {
    filteredLog: function () {
      return this.log.filter(function (item) {
        var passing = ((this.clientFilter !== null) ? item.clientName.toLowerCase().indexOf(this.clientFilter.toLowerCase()) !== -1 : true) &&
          ((this.projectFilter !== null) ? item.projectName.toLowerCase().indexOf(this.projectFilter.toLowerCase()) !== -1 : true) &&
          ((this.taskFilter !== null) ? item.task.toLowerCase().indexOf(this.taskFilter.toLowerCase()) !== -1 : true) &&
          ((this.userFilterB !== null) ? item.username.toLowerCase().indexOf(this.userFilterB.toLowerCase()) !== -1 : true) &&
          ((this.descFilter !== null && item.comments !== undefined) ? item.comments.toLowerCase().indexOf(this.descFilter.toLowerCase()) !== -1 : true) &&
          ((this.descFilter === null) || !(this.descFilter.length && item.comments === undefined)) &&
          ((this.startdate !== '' && this.enddate !== '') && ((item.activityDate.toDate() >= new Date(this.startdate)) && (item.activityDate.toDate() <= this.addDays(new Date(this.enddate), 1))))
        return passing
      }.bind(this))
    },
    hourstotal: function () {
      var thetotal = 0
      for (var i = 0; i < this.filteredLog.length; i++) {
        thetotal += this.filteredLog[i].hours
      }
      return Math.round(thetotal * 100) / 100
    }
  },
  watch: {
    $route (to, from) {
      if (this.$route.path === '/timelog') {
        this.userFilter = ''
      } else {
        this.userFilter = this.uid
      }
      this.queryHours()
    }
  },
  methods: {
    projCallback () {
      this.$emit('projCallback')
    },
    queryHours () {
      if (this.userFilter === '') {
        db.collection('timelog')
          .get()
          .then(function (querySnapshot) {
            this.log = []
            querySnapshot.forEach(function (doc) {
              var hour = doc.data()
              hour.id = doc.id
              this.log.push(hour)
              if (!this.customers.includes(hour.clientName)) {
                this.customers.push(hour.clientName)
              }
              if (!this.projects.includes(hour.projectName)) {
                this.projects.push(hour.projectName)
              }
              if (!this.tasks.includes(hour.task)) {
                this.tasks.push(hour.task)
              }
              if (!this.users.includes(hour.username)) {
                this.users.push(hour.username)
              }
              if (!this.descs.includes(hour.comments) && (hour.comments !== undefined)) {
                this.descs.push(hour.comments)
              }
            }.bind(this))
          }.bind(this))
      } else {
        db.collection('timelog').where('userid', '==', this.userFilter)
          .get()
          .then(function (querySnapshot) {
            this.log = []
            querySnapshot.forEach(function (doc) {
              var hour = doc.data()
              hour.id = doc.id
              this.log.push(hour)
              if (!this.customers.includes(hour.clientName)) {
                this.customers.push(hour.clientName)
              }
              if (!this.projects.includes(hour.projectName)) {
                this.projects.push(hour.projectName)
              }
              if (!this.tasks.includes(hour.task)) {
                this.tasks.push(hour.task)
              }
              if (!this.users.includes(hour.username)) {
                this.users.push(hour.username)
              }
              if (!this.descs.includes(hour.comments) && (hour.comments !== undefined)) {
                this.descs.push(hour.comments)
              }
            }.bind(this))
          }.bind(this))
      }
    },
    sortLog () {
      switch (this.sortLabel) {
        case 'Client':
          this.sortValue = 'clientName'
          break
        case 'Project':
          this.sortValue = 'projectName'
          break
        case 'Task':
          this.sortValue = 'task'
          break
        case 'Hours':
          this.sortValue = 'hours'
          break
        case 'User':
          this.sortValue = 'username'
          break
        case 'Date':
          this.sortValue = 'activityDate'
          break
        default:
          this.sortValue = 'clientName'
      }
      function compare (a, b) {
        if (a[this.sortValue] < b[this.sortValue]) {
          return -1 * this.sortDir
        }
        if (a[this.sortValue] > b[this.sortValue]) {
          return 1 * this.sortDir
        }
        return 0
      }
      this.log.sort(compare.bind(this))
    },
    toggleSortDir (e) {
      if (!e) e = window.event
      if (this.sortDir === 1) {
        this.sortDir = -1
      } else {
        this.sortDir = 1
      }
      e.target.classList.toggle('flip')
      this.sortLog()
    },
    toggleActive (e) {
      if (!e) e = window.event
      e.target.parentNode.classList.toggle('active')
    },
    exportToCSV () {
      for (var i = 0; i < this.filteredLog.length; i++) {
        var logitem = {}
        for (var key in this.filteredLog[i]) {
          if (key === 'client' || key === 'project' || key === 'id' || key === 'taskId' || key === 'userid' || key === 'clientId') {
            // do nothing
          } else if (key === 'activityDate' || key === 'date') {
            logitem[key] = JSON.parse(JSON.stringify(this.formatDate(this.filteredLog[i][key].toDate())))
          } else {
            logitem[key] = JSON.parse(JSON.stringify(this.filteredLog[i][key]))
          }
        }
        logitem.comments = '"' + logitem.comments + '"'
        logitem.task = '"' + logitem.task + '"'
        logitem.projectName = '"' + logitem.projectName + '"'
        this.csvData.push(logitem)
      }
      this.downloadCSV(this.csvData, { filename: 'UdonLogData.csv' })
    },
    openModal (logId, projectName, clientName, taskId) {
      this.timeEntryID = logId
      this.activeProject = projectName
      this.activeTaskId = taskId
      db.collection('tasks').doc(taskId).get().then(function (documentSnapshot) {
        this.activeProjectId = documentSnapshot.data().project.id
      }.bind(this))
      this.modalForm = 'loghours'
      this.toggleModal()
    },
    toggleModal () {
      var modal = document.getElementsByClassName('modal')[0]
      if (modal.classList.contains('active')) {
        this.modalForm = ''
      }
      modal.classList.toggle('active')
    },
    deactivateModal () {
      this.toggleModal()
      this.modalForm = ''
    }
  },
  created: function () {
    db.collection('users').where('email', '==', this.email)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          this.uid = doc.id
          if (this.$route.path === '/timelog') {
            this.userFilter = ''
          } else {
            this.userFilter = this.uid
          }
        }.bind(this))
        this.queryHours()
      }.bind(this))
      .catch(function (error) {
        console.log('Error getting documents:', error)
      })
  }
}
</script>

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
.entry {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 60px 120px 1fr 1.5fr 50px;
}
.entry > div {
    border-right: 1px solid;
    border-top: 1px solid;
    border-collapse: collapse;
    padding: 5px;
}
.hourlog {
    border-bottom: 1px solid;
    border-left: 1px solid;
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
#togglesort {
  background-color: #ffffff;
  padding: 0 10px;
  font-size: 26px;
  font-family: 'Montserrat';
  font-weight: 900;
  appearance: none;
  color: #999999;
  cursor: pointer;
  border-color: rgba(60, 60, 60, 0.26);
  margin: 0 10px 0;
  transition: transform 0.3s ease;
}
.flip {
    transform: rotate(180deg);
}
#filters {
  display: grid;
  grid-template-columns: 70px 200px 60px 48px 170px 43px 170px;
  margin-bottom: 10px;
}
#filters input {
  font-size: 14px;
}
.filterlabel {
  font-weight: 800;
  text-align: right;
  padding: 9px 5px 0 0;
}

.label {
  font-weight: 600;
  border-bottom: solid black 2px;
}
.entry:nth-child(odd) {
  background-color: #eaeaea;
}
.active span.staticlabel {
    display: none;
}
.headingfilter {
    display: none;
    border: none!important;
}
.dropdown.v-select.single.searchable {
    border: none!important;
    width: auto;
    padding: 0;
}
.active .headingfilter {
    display: block;
}
.staticlabel {
    width: 100%;
    cursor: pointer;
    display: block;
    padding: 9px 0 8px;
}
.headingfilter {
    padding: 0!important;
}
#exportbutton {
    background-color: #eaeaea;
    width: 200px;
    text-align: center;
    padding: 20px 10px;
    margin-top: 20px;
    cursor: pointer;
    transition: all 0.2s linear;
}
#exportbutton:hover {
  background-color: #666666;
  color: #eaeaea;
}
img.editicon {
    width: 18px;
    margin: 0 auto;
    cursor: pointer;
}
div.modal {
  position: fixed;
  opacity: 0;
  left: 0;
  right: 0;
  top: 0;
  z-index: -99;
}
div.modal.active {
  transition: opacity 0.3s ease;
  opacity: 1;
  top: 0;
  background-color: rgba(0,0,0,0.2);
  bottom: 0;
  padding-top: 50px;
  z-index: 2;
  overflow: scroll;
}
div.modal .modalinner {
  position: relative;
  background-color: #ffffff;
  padding: 50px;
  max-width: 400px;
  margin: auto;
  box-shadow: 0px 0px 25px #999999;
}
#modalcloser {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 22px;
  border-radius: 100%;
  font-weight: 800;
  color: #ffffff;
  text-align: center;
  width: 27px;
  height:27px;
  cursor: pointer;
}
.closer {
  transform: rotate(45deg);
}
.modal .label {
    padding: 5px;
    font-weight: 600;
    border-bottom: solid 1px #eaeaea;
    border-right: solid 1px #eaeaea;
    margin: 5px 0;
    min-width: 83px;
}
.name {
    padding: 5px;
    border-bottom: solid 1px #eaeaea;
    margin: 5px 0;
    min-width: 83px;
    flex-grow: 1;
}
#triggermodal {
  display: none;
  margin: 20px auto 0;
  cursor: pointer;
  background-color: #eaeaea;
  color: #6F8896;
  padding: 20px;
  text-transform: uppercase;
  font-size: 22px;
  min-width: 250px;
}
#triggermodal.visible {
  display: block;
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
