<template>
  <div>
    <h1>PROJECT DASHBOARD</h1>
    <div id="filters">
      <div class="filterlabel">Filter: </div>
      <v-select class="clientfilter" :options="clientSelect" @search:focus="loadit" label="name" v-model="clientFilter"></v-select>
      <div class="filterlabel">Sort: </div>
      <v-select class="sortselect" :options="sortBy" v-model="sortValue" placeholder="Sort By" @input="setProjects()"></v-select>
      <button class="button transitions" id="togglesort" v-on:click="toggleSortDir">^</button>
      <div class="filterlabel viewtoggle">View: </div>
      <v-select class="viewtoggle" :options="['Card', 'Report']" v-model="viewtoggle" @input="changeView()"></v-select>
    </div>
    <div id="articles">
      <article id="reportheading">
        <div class="reporttitle">
          Customer
        </div>
        <div class="reporttitle">
          Project
        </div>
        <div class="reporttitle">
          Status
        </div>
        <div class="reporttitle">
          Start
        </div>
        <div class="reporttitle">
          Due
        </div>
        <div class="reporttitle">
          Budget
        </div>
        <div class="reporttitle">
          Logged
        </div>
      </article>
      <article v-for="(project, idx) in filteredProjects" :key="idx" :id="project.id" v-if="showMe(project.client.id)">
        <h3>{{ project.clientName }}</h3>
        <h4 class="projecttitle"><router-link :to="'/project/' + project.id">{{ project.name }}</router-link></h4>
        <!-- <div class="projectdata"> -->
          <div class="datacontainer">
            <div class="datalabel">Status</div>
            <div class="statuli" v-on:click="statusBox(project.id, project.name, project.status)">{{ project.status }}</div>
          </div>
          <div class="datacontainer">
            <div class="datalabel">Start Date</div>
            <div>{{ dateView(project.start) }}</div>
          </div>
          <div class="datacontainer">
            <div class="datalabel">Due Date</div>
            <div>{{ dateView(project.due) }}</div>
          </div>
          <div class="datacontainer">
            <div class="datalabel">Budget</div>
            <div>{{ project.budget }}</div>
          </div>
          <div class="datacontainer">
            <div class="datalabel">Logged</div>
            <div>{{ project.logged }}</div>
          </div>
        <!-- </div> -->
        <div class="projectactions">
          <div class="clear"></div>
          <div class="projaction" v-on:click="editProject(project.id, project.clientId)">
            <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTk4LjIgNTk4LjIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDU5OC4yIDU5OC4yOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj4uc3Qwe2ZpbGw6IzU4NTk1Qjt9PC9zdHlsZT48Zz48cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjkuNiwzODguOUwzMjQuOCw5My43TDUwNCwyNzIuOUwyMDguOCw1NjguMUwyOS42LDM4OC45eiIvPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01ODYuMywxMzMuNWMxNS44LDE1LjcsMTUuOCw0MS4zLDAuMSw1Ny4xYzAsMC0wLjEsMC4xLTAuMSwwLjFsLTYxLjEsNjEuMUwzNDYuMSw3Mi41bDYxLjEtNjEuMmMxNS44LTE1LjgsNDEuMy0xNS44LDU3LjEtMC4xYzAsMCwwLDAsMC4xLDAuMUw1ODYuMywxMzMuNXoiLz48cGF0aCBjbGFzcz0ic3QwIiBkPSJNMCw0NzUuOXYxMjIuOGgxMjIuOEwwLDQ3NS45eiIvPjwvZz48L3N2Zz4=" class="projecticon" v-tooltip.top-center="'Edit Project'">
          </div>
          <router-link :to="'/project/' + project.id">
            <div class="projaction"><img src="../assets/doc-ico.svg" class="projecticon" v-tooltip.top-center="'Project Details'"></div>
          </router-link>
        </div>
      </article>
      <div class="flexcloser">
      </div>
    </div>
    <div class="cornerbutton" v-on:click="newProject()">
      <div class="cornerlabel">
          <div id="addprojecticon" class="icon plus-ico" v-tooltip.top-center="'Create a new Project'"></div>
      </div>
    </div>
    <div class="modal">
      <div class="modalinner">
        <div class="statusupdater" v-if="this.modalForm == 'status'">
          <h2>{{ this.activeProject }}</h2>
          <input v-model="status" placeholder="Status">
          <button type="button" v-on:click="updateStatus(activeProjectID, status)">Update Status</button>
        </div>
        <div id="addProject" v-if="this.modalForm == 'addProject'">
          <AddProject/>
        </div>
        <div id="editproject" v-if="this.modalForm == 'editProject'">
          <EditProject v-bind:activeProject="activeProject" v-bind:activeClientId="activeClientId"/>
        </div>
        <div id="addtask" v-if="this.modalForm == 'addtask'">
          <AddTask v-bind:activeProject="activeProject"/>
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
import AddProject from './AddProject'
import EditProject from './EditProject'
import AddTask from './AddTask'
import LogHour from './LogHour'
import writeFunctions from '../mixins/writeFunctions'
export default {
  mixins: [writeFunctions],
  name: 'Home',
  components: {
    'AddProject': AddProject,
    'EditProject': EditProject,
    'AddTask': AddTask,
    'LogHour': LogHour
  },
  data () {
    return {
      projects: [],
      filteredProjects: [],
      clients: [],
      statuses: [],
      client: '',
      status: '',
      activeProject: '',
      activeProjectID: '',
      activeClientId: '',
      clientFilter: {id: 'all', name: 'All Clients'},
      modalForm: '',
      clientSelect: [],
      sortValue: {id: 'clientName', label: 'Client'},
      sortBy: [{id: 'clientName', label: 'Client'}, {id: 'due', label: 'Due Date'}, {id: 'status', label: 'Status'}, {id: 'budget', label: 'Budget'}, {id: 'logged', label: 'Hours Logged'}],
      sortDir: 'asc',
      viewtoggle: 'Card'
    }
  },
  firestore () {
    return {
      projects: db.collection('projects').orderBy(this.sortValue.id),
      clients: db.collection('clients').orderBy('name')
    }
  },
  methods: {
    showMe (id) {
      if (this.clientFilter.id === null || this.clientFilter.id === 'all') {
        return true
      } else {
        if (this.clientFilter.id === id) {
          return true
        } else {
          return false
        }
      }
    },
    toggleModal () {
      var modal = document.getElementsByClassName('modal')[0]
      modal.classList.toggle('active')
    },
    statusBox (id, name, status) {
      this.activeProjectID = id
      this.activeProject = name
      this.status = status
      this.modalForm = 'status'
      this.toggleModal()
    },
    deactivateModal () {
      this.toggleModal()
      this.modalForm = ''
    },
    updateStatus (project, status) {
      db.collection('projects').doc(project).update({ status: status })
        .then(
          this.setProjects()
        )
      this.toggleModal()
    },
    editProject (id, clientId) {
      this.activeProject = id
      this.activeClientID = clientId
      this.modalForm = 'editProject'
      this.toggleModal()
    },
    filterStatus (status) {
      if (this.statusFilter.includes(status)) {
        return 'visible'
      } else {
        return 'hidden'
      }
    },
    newProject () {
      this.modalForm = 'addProject'
      this.toggleModal()
    },
    projCallback () {
      this.setProjects()
      this.toggleModal()
    },
    taskModal (project) {
      this.activeProject = project
      this.modalForm = 'addtask'
      this.toggleModal()
    },
    updateSelects () {
      var self = this
      db.collection('clients')
        .get()
        .then(function (querySnapshot) {
          self.clientSelect = []
          self.clientSelect.push({
            id: 'all',
            name: 'All Clients'
          })
          querySnapshot.forEach(function (doc) {
            var cl = {id: doc.id, name: doc.data().name}
            self.clientSelect.push(cl)
          })
        })
        .catch(function (error) {
          console.log('Error getting documents:', error)
        })
    },
    loadit () {
      return true
    },
    setProjects () {
      var self = this
      db.collection('projects')
        .limit(100)
        .orderBy(this.sortValue.id, this.sortDir)
        .onSnapshot(function (querySnapshot) {
          self.filteredProjects = []
          querySnapshot.forEach(function (doc) {
            var proj = []
            proj = doc.data()
            proj.id = doc.id
            self.filteredProjects.push(proj)
          })
        })
    },
    sortProjects (sort) {
      function compare (a, b) {
        if (a[sort] < b[sort]) {
          return -1
        } else if (a[sort] > b[sort]) {
          return 1
        } else {
          return 0
        }
      }
      this.projects.sort(compare)
    },
    toggleSortDir (e) {
      if (!e) e = window.event
      if (this.sortDir === 'asc') {
        this.sortDir = 'desc'
      } else {
        this.sortDir = 'asc'
      }
      e.target.classList.toggle('flip')
      this.setProjects()
    },
    changeView () {
      var arts = document.getElementById('articles')
      if (this.viewtoggle === 'Report' && !arts.classList.contains('reportview')) {
        arts.classList.add('reportview')
      } else {
        arts.className = ''
      }
    }
  },
  created: function () {
    if (localStorage.getItem('projects')) {
      this.projects = JSON.parse(localStorage.getItem('projects'))
    }
    if (localStorage.getItem('clientSelect')) {
      this.clientSelect = JSON.parse(localStorage.getItem('clientSelect'))
    }
    if (localStorage.getItem('clients')) {
      this.clients = JSON.parse(localStorage.getItem('clients'))
    }

    var self = this
    db.collection('meta').doc('projectmeta').get()
      .then(function (querySnapshot) {
        self.statuses = querySnapshot.data().status
        self.statuses.push('All')
        self.statuses.push('All Open')
      })
      .catch(function (error) {
        console.log('Error getting meta:', error)
        self.statuses.push('All')
        self.statuses.push('All Open')
      })
    this.setProjects()
    this.updateSelects()
  },
  watch: {
    projects: function () {
      localStorage.setItem('projects', JSON.stringify(this.projects))
    },
    clientSelect: function () {
      localStorage.setItem('clientSelect', JSON.stringify(this.clientSelect))
    },
    clients: function () {
      localStorage.setItem('clients', JSON.stringify(this.clients))
    }
  }
}
</script>

<style scoped>
h1, h2 {
  text-align: center;
}

article h3 {
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 5px;
  margin-bottom: 0;
}
.projecttitle a {
  color: #000000;
  text-decoration: none;
}
div.modal {
  position: fixed;
  opacity: 0;
  left: 0;
  right: 0;
  top: 0;
  z-index: -99;
}
.clientfilter /deep/ button {
  display: none;
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
.projecttitle {
  text-align: center;
  margin: 10px 0 15px;
}
i.open-indicator {
  margin-right: 6px;
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
.transitions {
  transition: all 0.3s ease;
}
.datacontainer div {
  padding: 3px 5px;
  min-height: 19px;
}
.datacontainer {
  display: flex;
  border-bottom: 1px solid #d8d8d8;
}
#filters {
  display: flex;
}
#filters > div, #filters > select {
  max-width: 300px;
  padding-right: 10px;
}
.projecticon {
  height: 22px;
  float: right;
  padding-left: 10px;
  cursor: pointer;
}
.projectactions {
  padding-top: 11px;
}
.datalabel {
  min-width: 100px;
  font-weight: 600;
  border-right: 1px solid #d8d8d8;
}
.statuli {
  font-weight: 600;
  cursor: pointer;
}
#articles {
  transition: all 0.3s ease;
  display: inline-flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-bottom: 100px;
}
article {
  margin: 10px;
  padding: 20px;
  background-color: #f7f7f7;
  flex-grow: 1;
}
.cornerbutton {
    right: 15px;
    position: fixed;
    bottom: 15px;
    background-color: #eaeaea;
    border-radius: 100px;
    height: 50px;
    width: 50px;
}
.cornerlabel {
    vertical-align: middle;
    text-align: center;
    cursor: pointer;
}
.flip {
    transform: rotate(180deg);
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
  margin: 0 10px 0 0;
}
.filterlabel {
    padding-top: 9px;
}
.ve-design {
    min-height: 61px;
}
@media (max-width: 650px) {
  .flexcloser {
    display: none;
  }
}
@media (max-width: 767px) {
  div.modal.active {
    padding-top: 0;
  }
  div.modal .modalinner {
    width: 90%;
    max-width: 90%;
    padding: 0 0 20px 0;
    margin-top: 5%;
    padding-top: 5px;
  }
  #filters {
    display: grid;
    grid-template-columns: 49px calc(100% - 102px) 41px;
  }
  #filters > div {
    margin: 6px 0;
  }
  #togglesort {
    margin: 6px 0 6px 4px!important;
  }
  #filters .dropdown {
    grid-column: 2 / 4;
    padding-right: 0!important;
  }
  #filters .dropdown.sortselect {
    grid-column: 2 / 2;
  }
  .filterlabel {
    grid-column-start: 1;
  }
  .dropdown.v-select.single.searchable {
    width: auto;
  }
  div.modal .modalinner {
    padding: 5px;
  }
  article {
    margin: 5px;
    padding: 6px 10px;
  }
  article h3 {
    margin-top: 10px;
  }
  .viewtoggle {
    display: none;
  }
}
.flexcloser {
  flex-grow:10;
}
#filters div#statusfilterer {
  width: 700px;
  max-width: 700px;
}
#articles.transitioning {
  opacity: 0.2;
}
.v-select /deep/ input[type=search] {
  max-width: 0!important;;
}
.v-select.open /deep/ input[type=search] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    line-height: 1.42857143;
    font-size: 1em;
    height: 34px;
    display: inline-block;
    border: none;
    outline: none;
    margin: 0;
    padding: 0 .5em;
    width: 10em;
    max-width: 100%!important;
    background: none;
    position: relative;
    box-shadow: none;
}
.plus-ico {
  background-image: url(data:image/svg+xml;base64,PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1OTguMiA1OTguMiIgdmlld0JveD0iMCAwIDU5OC4yIDU5OC4yIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxjaXJjbGUgY3g9IjI5OS4xIiBjeT0iMjk5LjEiIGZpbGw9IiM1ODU5NWIiIHI9IjI5OS4xIi8+PHBhdGggZD0ibTM1NS44IDExNC4yaC0xMTMuNHYxMjguMmgtMTI4LjJ2MTEzLjRoMTI4LjJ2MTI4LjJoMTEzLjR2LTEyOC4yaDEyOC4ydi0xMTMuNGgtMTI4LjJ6IiBmaWxsPSIjZmZmIi8+PC9zdmc+);
  height: 50px;
}

@media (min-width: 768px) {
  .reportview article {
      display: grid;
      grid-template-columns: 3fr 3fr 2fr 1fr 1fr 1fr 1fr;
      width: 100%;
      margin: 0;
      padding: 0;
      border-left: 1px solid #666666;
  }
  #articles.reportview {
    border-bottom: 1px solid #666666;
    padding-bottom: 0;
  }
  .reportview .datalabel {
      display: none;
  }
  .reportview .projectactions {
      display: none;
  }

  .reportview h3, .reportview h4, .reportview div.datacontainer, .reportview div.datacontainer div {
      text-align: left;
      font-size: 15px;
      border: none;
      padding: 2px;
      margin: 0;
      font-weight: 200;
  }

  .reportview h3, .reportview h4, .reportview div.datacontainer, div.reporttitle {
    border-right: 1px solid #999999;
    padding-left: 2px;
  }
  .reportview #reportheading {
    display: grid;
    border-bottom: 1px solid #666666;
    border-top: 1px solid #666666;
    margin-top: 10px;
  }

  .reportview #reportheading .reporttitle {
    font-weight: 800;
  }
  .reportview article:nth-child(2n+1) {
      background-color: #eaeaea;
  }
}

#reportheading {
  display: none;
}

@media (max-width: 1200px) {
  .reportview article {
      grid-template-columns: 3fr 3fr 2fr 99px 99px 70px 70px;
  }
}
</style>
