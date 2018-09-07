<template>
  <div>
    <h1>Edit Project</h1>
    <form>
      <input v-model="projectname" placeholder="Project Name">
      <input v-model="start" type="date" placeholder="Start Date">
      <input v-model="due" type="date" placeholder="Due Date">
      <input v-model="budget" type="number" placeholder="Budget (Hours)">
      <input v-model="status" placeholder="Open">
      <div>
        <input type="file" accept="image/*" @change="detectFiles($event.target.files)">
        <div class="progress-bar" :style="{ width: progressUpload + '%'}">{{ progressUpload }}%</div>
      </div>
      <div class="attachments">
        <div class="attachment" v-for="(file, idx) in files" :key="idx" :id="file.id">
          <div class="delete-button" @click="deleteFile(file)">DELETE</div>
          <span class="deleteFile">{{file.filename}}</span>
        </div>
      </div>
      <div class="checkcontainer">
        <label for="retainer">Retainer</label>
        <input class="checkinput" name="retainer" type="checkbox" v-model="retainer">
      </div>
      <button type="button" v-on:click="updateProject(projectname, start, due, budget, status, retainer)">Update Project</button>
    </form>
  </div>
</template>

<script>
import { db, storage } from '../main'
import writeFunctions from '../mixins/writeFunctions'
export default {
  name: 'EditProject',
  mixins: [writeFunctions],
  props: ['activeProject', 'projCallback()', 'logged', 'activeClientId'],
  data () {
    return {
      projectname: '',
      client: '',
      start: '',
      due: '',
      budget: '',
      status: '',
      retainer: '',
      progressUpload: 0,
      file: File,
      uploadTask: '',
      downloadURL: '',
      files: []
    }
  },
  methods: {
    updateProject (projectname, start, due, budget, status, retainer) {
      var projectData = {
        'name': projectname,
        'start': this.addDays(new Date(start), 1),
        'due': this.addDays(new Date(due), 1),
        'budget': parseFloat(budget),
        'status': status,
        'retainer': retainer
      }
      db.collection('projects').doc(this.activeProject).update(projectData)
        .then(function (docRef) {
          this.logActivity(this.activeClientId, this.activeProject, 'projects', projectData, 'update')
        }.bind(this))
      this.$parent.projCallback()
    },
    displayProject (id) {
      var pastState = this.activeProject
      this.activeProject = id
      db.collection('projects').doc(id).get()
        .then(doc => {
          if (!doc.exists) {
            console.log('No such document!')
            this.activeClient = pastState
          } else {
            this.projectname = doc.data().name
            this.status = doc.data().status
            this.start = this.formatDate(doc.data().start)
            this.due = this.formatDate(doc.data().due)
            this.budget = doc.data().budget
            this.retainer = doc.data().retainer
            this.files = doc.data().files
          }
        })
        .catch(err => {
          console.log('Error getting document', err)
        })
    },
    detectFiles (fileList) {
      Array.from(Array(fileList.length).keys()).map(x => {
        db.collection('media').doc(fileList[x].name).get()
          .then((doc) => {
            if (doc.exists) {
              if (!confirm('A file by that name is already on the server. Would you like to overwrite this file?')) {
                console.log('Upload Aborted')
              } else {
                this.overWriteUpload(fileList[x])
              }
            } else {
              this.newUpload(fileList[x])
            }
          })
      })
    },
    overWriteUpload (file) {
      this.uploadTask = storage.ref('projects/' + file.name).put(file)
      this.uploadTask.then(snapshot => {
        this.downloadURL = this.uploadTask.snapshot.downloadURL
        this.updateMediaToDatabase(this.uploadTask.snapshot.metadata.name, this.uploadTask.snapshot.downloadURL, this.activeProject, this.uploadTask.snapshot.metadata.size)
      })
    },
    newUpload (file) {
      this.uploadTask = storage.ref('projects/' + file.name).put(file)
      this.uploadTask.then(snapshot => {
        snapshot.ref.getDownloadURL().then(function (downloadURL) {
          this.downloadURL = downloadURL
          this.addMediaToDatabase(this.uploadTask.snapshot.metadata.name, this.downloadURL, this.activeProject, this.uploadTask.snapshot.metadata.size)
        }.bind(this))
      })
    },
    addMediaToDatabase (name, download, projectid, filesize) {
      var mediaData = ''
      var fileData = []
      var fileupdate = {
        filename: name,
        downloadURL: download,
        projects: [projectid],
        fileSize: filesize
      }
      db.collection('media').doc(name).set(fileupdate)
        .then(function (docRef) {
          mediaData = {
            id: name,
            url: download,
            filename: name,
            filesize: filesize
          }
          if (this.files !== undefined) {
            fileData = this.files
            fileData.push(mediaData)
          } else {
            fileData = [mediaData]
          }
          db.collection('projects').doc(projectid).update({
            files: fileData
          }).then(function () {
            this.logActivity(this.activeClientId, projectid, 'media', fileData, 'create')
            this.$parent.projCallback()
          }.bind(this))
        }.bind(this))
    },
    updateMediaToDatabase (name, download, projectid, path) {
      var mediaData = ''
      var fileupdate = {
        filename: name,
        downloadURL: download,
        projects: [projectid]
      }
      db.collection('media').doc(name).set(fileupdate)
        .then(function (docRef) {
          this.logActivity(this.activeClientId, projectid, 'media', fileupdate, 'update')
          mediaData = {
            id: name,
            url: download,
            filename: name
          }
          var newfiles = []
          for (var i = 0; i < this.files.length; i++) {
            if (this.files[i].id !== mediaData.id) {
              newfiles.push(this.files[i])
            }
          }
          newfiles.push(mediaData)
          db.collection('projects').doc(projectid).update({
            files: newfiles
          }).then(function () {
            this.$parent.projCallback()
          }.bind(this))
        }.bind(this))
    },
    deleteFile (file) {
      var fileRef = storage.ref().child('projects/' + file.filename)
      var mediaRef = db.collection('media').doc(file.id)
      var newfiles = []
      for (var i = 0; i < this.files.length; i++) {
        if (this.files[i].id !== file.id) {
          newfiles.push(this.files[i])
        }
      }
      fileRef.delete().then(function () {
        mediaRef.delete().then(function () {
          this.logActivity(this.activeClientId, this.activeProject, 'media', file, 'delete')
          db.collection('projects').doc(this.activeProject).update({
            files: newfiles
          }).then(function () {
            this.$parent.projCallback()
          })
        }.bind(this)).catch(function (error) {
          console.error('Error removing document: ', error)
        })
      }.bind(this)).catch(function (error) {
        alert('File Not Deleted: ' + error)
      })
    }
  },
  watch: {
    uploadTask: function () {
      this.uploadTask.on('state_changed', sp => {
        this.progressUpload = Math.floor(sp.bytesTransferred / sp.totalBytes * 100)
      })
    }
  },
  created: function () {
    this.$parent.$on('active-proj-update', this.displayProject(this.activeProject))
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
.progress-bar {
  margin: 10px 0;
}
.list-leave-active {
  transition: all 0.2s;
}
.list-enter, .list-leave-to {
  opacity: 0;
}

h1, h2 {
  font-weight: normal;
  text-align: center;
}
img {
  display: block;
  margin: 20px auto;
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

#editproject {
  position: absolute;
  opacity: 0;
  top: -500px;
  bottom: 100vh;
}

#editproject.active {
  opacity: 1;
  top: 0;
  background-color: rgba(0,0,0,0.2);
  left: 0;
  right: 0;
  bottom: 0;
  padding-top: calc(50vh - 200px);
}
#editproject form {
  background-color: #ffffff;
  padding: 50px;
  max-width: 400px;
  margin: auto;
}
#triggermodal {
  display: none;
}
.delete-button {
    display: block;
    float: left;
    margin: 0 10px 0 0;
    cursor: pointer;
    background-color: #eaeaea;
    padding: 5px;
    border: 1px solid #999999;
    box-shadow: 0 0 3px #eaeaea;
}

div.attachment {
    padding: 9px;
    border: 1px solid #eaeaea;
    overflow: auto;
}
#triggermodal.visible {
  display: block;
}

@media (max-width: 767px) {
  #editproject form {
    padding: 20px;
  }
  .modalinner input {
    padding: 10px;
  }
}
</style>
