import { db } from '../main'
import firebase from 'firebase'
const writeFunctions = {
  methods: {
    addProject (client, clientName, projectname, start, due, budget, status, retainer, type) {
      const createdAt = new Date()
      var self = this
      var projectValues = {
        'name': projectname,
        'client': db.collection('clients').doc(client),
        'clientId': client,
        'clientName': clientName,
        'createdAt': createdAt,
        'start': this.addDays(new Date(start), 1),
        'due': this.addDays(new Date(due), 1),
        'budget': parseFloat(budget),
        'status': status,
        'retainer': retainer,
        'type': type
      }
      db.collection('projects').add(projectValues)
        .then(
          function (docRef) {
            self.logActivity(client, docRef.id, 'projects', projectValues, 'create')
            self.projectname = ''
            self.start = ''
            self.due = ''
            self.budget = ''
            self.status = 'Open'
            self.retainer = ''
            self.type = ''
            self.$parent.projCallback()
          },
          function (err) {
            alert('Oops. ' + err.message)
          }
        )
    },
    deleteClient (id) {
      var self = this
      db.collection('clients').doc(id).delete()
        .then(function () {
          self.logActivity(id, '', 'clients', '', 'delete')
        })
    },
    updateClient (client, name, contact, email, active) {
      var self = this
      var clientData = {'name': name, 'email': email, 'contact': contact, 'active': active}
      db.collection('clients').doc(client).update(clientData)
        .then(function () {
          self.logActivity(client, '', 'clients', clientData, 'update')
        })
      var modal = document.getElementById('editclient')
      modal.classList.toggle('active')
    },
    createTask (client, clientName, projectId, project, projectName, taskName, budget, category) {
      var self = this
      var taskData = {
        'task': taskName,
        'client': client,
        'clientName': clientName,
        'project': project,
        'projectName': projectName,
        'budget': parseFloat(budget),
        'category': category
      }
      db.collection('tasks').add(taskData)
        .then(
          function () {
            self.logActivity(client, projectId, 'tasks', taskData, 'create')
            self.$parent.toggleModal()
            self.clearInputs()
          },
          function (err) {
            alert('Oops. ' + err.message)
          }
        )
    },
    logHours (clientId, client, clientName, project, projectName, projectId, task, taskId, hours, comments, date) {
      var self = this
      var user = firebase.auth().currentUser
      var logData = {
        'client': client,
        'clientId': clientId,
        'clientName': clientName,
        'project': project,
        'projectName': projectName,
        'task': task,
        'taskId': taskId,
        'username': user.displayName,
        'userid': user.uid,
        'hours': parseFloat(hours),
        'date': new Date(),
        'comments': comments,
        'activityDate': new Date(date)
      }
      db.collection('timelog').add(logData)
        .then(
          function () {
            self.logActivity(clientId, projectId, 'timelog', logData, 'create')
            self.updateProjectLog(projectId, taskId)
            self.$parent.toggleModal()
            self.clearInputs()
          },
          function (err) {
            alert('Oops. ' + err.message)
          }
        )
    },
    updateHours (timeEntryID, hours, comments, date, projectId, clientId, activeTaskId) {
      var self = this
      var logData = {
        'hours': parseFloat(hours),
        'comments': comments,
        'activityDate': new Date(date)
      }
      db.collection('timelog').doc(timeEntryID).update(logData)
        .then(function (docRef) {
          logData.timeId = timeEntryID
          self.logActivity(clientId, projectId, 'timelog', logData, 'update')
          self.updateProjectLog(projectId, activeTaskId)
          self.$parent.toggleModal()
          self.$parent.queryHours()
        })
    },
    updateProjectLog (projectId, taskId) {
      var theproject = db.collection('projects').doc(projectId)
      db.collection('timelog').where('project', '==', theproject)
        .get()
        .then(function (querySnapshot) {
          var logged = 0
          querySnapshot.forEach(function (doc) {
            logged += parseInt(doc.data().hours, 10)
          })
          db.collection('projects').doc(projectId).update({
            logged: logged
          })
          db.collection('timelog').where('taskId', '==', taskId)
            .get()
            .then(function (querySnapshot) {
              var taskHours = 0
              querySnapshot.forEach(function (doc) {
                taskHours += parseInt(doc.data().hours, 10)
              })
              db.collection('tasks').doc(taskId).update({
                logged: taskHours
              })
            })
        })
        .catch(function (error) {
          console.log('Error getting documents: ', error)
        })
    },
    getProjectLoggedHours (projectId) {
      var theproject = db.collection('projects').doc(projectId)
      db.collection('timelog').where('project', '==', theproject)
        .get()
        .then(function (querySnapshot) {
          var logged = 0
          querySnapshot.forEach(function (doc) {
            logged += parseInt(doc.data().hours, 10)
          })
          console.log(logged)
          return logged
        })
        .catch(function (error) {
          console.log('Error getting documents: ', error)
        })
    },
    submitChat () {
      var self = this
      var chatData = {
        content: this.$refs.editor.getContent(),
        project: this.project,
        projectId: this.activeProject,
        timeStamp: Date.now(),
        user: firebase.auth().currentUser.displayName,
        uid: firebase.auth().currentUser.uid
      }
      db.collection('chats').add(chatData)
        .then(function () {
          self.$refs.editor.setContent('')
        })
    },
    logActivity (clientId, projectId, collection, info, type) {
      var logData = {}
      logData.projectId = projectId
      logData.client = clientId
      logData.type = type
      logData.time = Date.now()
      logData.collection = collection
      logData.info = info
      db.collection('log').add(logData)
    },
    dateView (dateobj) {
      if (typeof dateobj.getMonth === 'function') {
        return dateobj.toLocaleDateString('en-US')
      } else if (typeof dateobj === 'object') {
        dateobj = dateobj.toDate().toLocaleDateString('en-US')
        return dateobj
      } else {
        return dateobj
      }
    },
    formatDate (theDate) {
      if (theDate instanceof Date) {
      } else {
        theDate = theDate.toDate()
      }
      var dtstring = new Date(theDate).getFullYear() + '-' + ('0' + ((new Date(theDate)).getMonth() + 1)).slice(-2) + '-' + ('0' + (new Date(theDate).getDate())).slice(-2)
      return dtstring
    },
    convertArrayOfObjectsToCSV (args) {
      var result, ctr, keys, columnDelimiter, lineDelimiter, data
      data = args.data || null
      if (data == null || !data.length) {
        return null
      }
      columnDelimiter = args.columnDelimiter || ','
      lineDelimiter = args.lineDelimiter || '\n'
      keys = Object.keys(data[0])
      result = ''
      result += keys.join(columnDelimiter)
      result += lineDelimiter
      data.forEach(function (item) {
        ctr = 0
        keys.forEach(function (key) {
          if (ctr > 0) result += columnDelimiter

          result += item[key]
          ctr++
        })
        result += lineDelimiter
      })
      return result
    },
    downloadCSV (arraydata, args) {
      var data, filename, link
      var csv = this.convertArrayOfObjectsToCSV({
        data: arraydata
      })
      if (csv == null) return
      filename = args.filename || 'export.csv'
      if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv
      }
      data = encodeURI(csv)
      link = document.createElement('a')
      link.setAttribute('href', data)
      link.setAttribute('download', filename)
      link.click()
    },
    addDays (date, days) {
      var result = new Date(date)
      result.setDate(result.getDate() + days)
      return result
    }
  }
}

export default writeFunctions
