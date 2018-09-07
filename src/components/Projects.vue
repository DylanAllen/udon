<template>
  <div>
    <h1>Project - {{ projectname }}</h1>
    <div class="main">
      <div class="flex-content">
        <div class="projectdetails">
          <h2>Project Info</h2>
          <div class="projaction" v-on:click="updateModal">
            <img src="../assets/pencil-ico.svg" class="projecticon">
          </div>
          <div class="detailcontainer">
            <div class="label">Project</div>
            <div class="name">{{ projectname }}</div>
          </div>
          <div class="detailcontainer">
            <div class="label">Status</div>
            <div class="name">{{ status }}</div>
          </div>
          <div class="detailcontainer">
            <div class="label">Start Date</div>
            <div class="name">{{ dateView(start) }}</div>
          </div>
          <div class="detailcontainer">
            <div class="label">Due Date</div>
            <div class="name">{{ dateView(due) }}</div>
          </div>
          <div class="detailcontainer">
            <div class="label">Budget</div>
            <div class="name">{{ budget }}</div>
          </div>
          <div class="detailcontainer">
            <div class="label">Logged</div>
            <div class="name">{{ logged }}</div>
          </div>
          <div class="attachments">
            <div class="attachment" v-for="(file, idx) in files" :key="idx" :id="file.id">
              <a :href="file.url" target="_blank">{{file.filename}}</a>
            </div>
          </div>
        </div>
        <div id="tasklist">
          <h2>Tasks</h2>
          <div class="task" v-for="(task, idx) in tasks" :key="idx" :id="task.id">
            <div class="taskname">
              <div class="log-icon" v-on:click="hourModal(task, task.id)">
                <img src="../assets/plus-ico.svg" class="log-image">
              </div>
              <div class="log-icon" v-on:click="startTimer(task, task.id)">
                <img src="../assets/clock-ico.svg" class="log-image">
              </div>
              {{task.task}}
            </div>
            <div class="taskbudget">Budget: {{task.budget}}</div>
            <div class="tasklogged">Logged: {{task.logged}}</div>
          </div>
          <div class="addTaskDiv">
            <img src="../assets/plus-ico.svg" id="addtaskicon" class="roundbutton" v-on:click="addTaskModal()" v-tooltip.top-center="'Create task and add to project'">
          </div>
        </div>
      </div>
      <div class="flex-content">
        <div id="project-chat">
          <h2>Discussion</h2>
          <div id="chat-messages">
            <div :class="getChatClasses(message.uid)" v-for="(message, idx) in messages" :key="idx" :id="message.id">
              <span class="chatuser">{{message.user}}</span>
              <div class="chat-content" v-html="message.content">
              </div>
            </div>
          </div>
          <div id="chat-input" v-on:click="scrollDown()">
            <Vueditor ref="editor"></Vueditor>
            <button type="button" v-on:click="submitChat()">SUBMIT</button>
          </div>
        </div>
      </div>
      <div class="modal">
        <div class="modalinner">
          <div id="editproject" v-if="this.modalForm == 'editProject'">
            <EditProject v-bind:activeProject="activeProject" v-bind:logged="logged" v-bind:activeClientId="activeClientId"/>
          </div>
          <div id="addtask" v-if="this.modalForm == 'createTask'">
            <AddTask v-bind:activeProject="activeProject" v-bind:activeClientId="activeClientId"/>
          </div>
          <div id="loghour" v-if="this.modalForm == 'loghours'">
            <LogHour v-bind:activeProject="activeProject" v-bind:activeTask="activeTask" v-bind:client="client" v-bind:budget="budget" v-bind:logged="logged" v-bind:activeTaskId="activeTaskId" v-bind:activeClientId="activeClientId" v-bind:activeProjectId="activeProject"/>
          </div>
          <div id="modalcloser" v-on:click="deactivateModal">
            <img src="../assets/plus-ico.svg" id="addprojecticon" class="closer">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../main'
import EditProject from './EditProject'
import writeFunctions from '../mixins/writeFunctions'
import AddTask from './AddTask'
import LogHour from './LogHour'
import firebase from 'firebase/app'
export default {
  mixins: [writeFunctions],
  name: 'Project',
  components: {
    'EditProject': EditProject,
    'AddTask': AddTask,
    'LogHour': LogHour
  },
  data () {
    return {
      project: [],
      projectname: '',
      client: '',
      start: '',
      due: '',
      budget: '',
      logged: '',
      status: '',
      retainer: '',
      files: [],
      activeProject: '',
      activeTask: '',
      activeTaskId: '',
      activeClientId: '',
      modalForm: '',
      clientName: '',
      tasks: [],
      messages: [],
      chatInput: '',
      currentuser: ''
    }
  },
  watch: {
    messages: function () {
      this.$nextTick(function () {
        var chatwindow = document.getElementById('chat-messages')
        chatwindow.scrollTop = chatwindow.scrollHeight
      })
    }
  },
  firestore () {
    return {
    }
  },
  methods: {
    addTaskModal () {
      this.modalForm = 'createTask'
      this.toggleModal()
    },
    updateModal () {
      this.modalForm = 'editProject'
      this.toggleModal()
    },
    toggleModal () {
      var modal = document.getElementsByClassName('modal')[0]
      if (modal.classList.contains('active')) {
        this.modalForm = ''
      }
      modal.classList.toggle('active')
    },
    projCallback () {
      this.deactivateModal()
      this.displayProject(this.$route.params.project)
    },
    deactivateModal () {
      this.toggleModal()
      this.modalForm = ''
    },
    deactivateMe (e) {
      if (!e) e = window.event
      e.target.classList.toggle('active')
    },
    displayProject (id) {
      var pastState = this.activeProject
      this.activeProject = id
      db.collection('projects').doc(id)
        .onSnapshot(function (doc) {
          if (!doc.exists) {
            console.log('No such document!')
            this.activeClient = pastState
          } else {
            this.project = doc.data()
            this.projectname = doc.data().name
            this.status = doc.data().status
            this.start = doc.data().start
            this.due = doc.data().due
            this.budget = doc.data().budget
            this.retainer = doc.data().retainer
            this.files = doc.data().files
            this.client = doc.data().client
            this.clientName = doc.data().clientName
            this.activeClientId = doc.data().clientId
            this.logged = doc.data().logged
            this.queryTasks()
          }
        }.bind(this))
    },
    queryTasks () {
      var project = db.collection('projects').doc(this.activeProject)
      db.collection('tasks').where('project', '==', project)
        .onSnapshot(function (querySnapshot) {
          this.tasks = []
          querySnapshot.forEach(function (doc) {
            var thetask = doc.data()
            thetask.id = doc.id
            this.tasks.push(thetask)
          }.bind(this))
        }.bind(this))
    },
    hourModal (task) {
      this.activeTask = task.task
      this.activeTaskId = task.id
      this.modalForm = 'loghours'
      this.toggleModal()
    },
    startTimer (task, taskId) {
      var timerData = {
        projectId: this.activeProject,
        clientId: this.activeClientId,
        clientName: this.clientName,
        taskId: taskId,
        client: this.client,
        project: this.project,
        projectName: this.project.name,
        task: task
      }
      this.$root.$emit('timerStart', timerData)
    },
    displayChats (projectId) {
      db.collection('chats').where('projectId', '==', projectId).orderBy('timeStamp')
        .onSnapshot(function (querySnapshot) {
          this.messages = []
          querySnapshot.forEach(function (doc) {
            var themessage = doc.data()
            themessage.id = doc.id
            this.messages.push(themessage)
          }.bind(this))
        }.bind(this))
    },
    getChatClasses (uid) {
      if (uid === this.currentuser) {
        return 'my-chat chat-message'
      } else {
        return 'chat-message'
      }
    },
    scrollDown () {
      window.scrollTo(0, document.body.scrollHeight)
    }
  },
  created: function () {
    this.displayProject(this.$route.params.project)
    this.displayChats(this.$route.params.project)
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        this.currentuser = user.uid
      }
    }.bind(this))
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active {
  transition: all 0.2s;
  transition-delay: 0.2s;
}

.list-leave-active {
  transition: all 0.2s;
}
.list-enter, .list-leave-to {
  opacity: 0;
}
.main {
  max-width: 1700px;
  margin: auto;
}
h1, h2 {
  font-weight: normal;
  text-align: center;
}
img {
  display: block;
  margin: 20px auto;
}
.task {
  margin: 5px 0;
}
.task div {
  border: 1px solid #eaeaea;
  padding: 1%;
  display: inline-block;
  margin: -3px -2px;
}
.taskname {
  width: 53%;
}
.taskbudget {
  width: 20%;
}
.tasklogged {
  width: 20%;
}
#projectlist {
  background-color: #f9f9f9;
  padding: 20px;
  float: left;
  list-style-type: none;
  width: calc(100% - 40px);
  transition: all 0.2s ease;
  transform-origin: top;
}
#projectlist.transitioning {
  transform: scaleY(0);
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
img.projecticon {
    width: 25px;
    margin-right: 0;
    position: absolute;
    right: 0;
    top: 34px;
}
.projectdetails {
    position: relative;
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
  width: 100%;
}
.detailcontainer {
    display: flex;
    flex-wrap: wrap;
}
img#addtaskicon {
    width: 40px;
    margin-right: 0;
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
.label {
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
.log-icon {
  height: 15px;
  padding: 0!important;
  width: 18px;
  margin: 0!important;
  border: none!important;
}
img.log-image {
  margin: 0;
}
div#chat-messages {
  height: 350px;
  overflow: scroll;
  border: 1px solid #f2f2f2;
  margin-bottom: 10px;
}
div.chat-message {
  border: 1px solid #eaeaea;
  margin: 6px;
  padding: 5px;
  border-radius: 4px;
  background-color: #f2f2f2;
}

div.chat-message.my-chat {
  background-color: #c3d8cc;
}
.my-chat span.chatuser {
  float: right;
}
span.chatuser {
  font-size: 12px;
  color: #666666;
}
.chat-content {
  margin: 0 0 0 70px;
}
.my-chat .chat-content {
  margin: 0 70px 0 0;
}
button:hover {
  background-color: #528c6d;
  color: #ffffff;
}
button {
    font-size: 18px;
    float: right;
    padding: 15px 45px;
    background-color: #f2f2f2;
    border: none;
    margin: 15px 0;
    cursor: pointer;
    color: #000000;
    transition: all 0.3s ease;
}
.main {
  display: flex;
  flex-wrap: wrap;
}
.flex-content {
  width: 500px;
  margin: 15px;
  flex-grow: 1;
  flex-wrap: wrap;
}
@media (max-width: 767px) {

}
</style>
