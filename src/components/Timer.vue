<template>
  <div>
    <div class="timercontainer" v-if="taskId.length > 0">
      <div id="closetimer" v-on:click="toggleModal()"></div>
      <div id="minimizetimer" v-on:click="minimize($event)"></div>
      <h4 class="hidemin">{{ projectName }}: {{ task }}  </h4>
      <div class="timerdata">
        <div class="label">Elapsed:</div>
        <div class="timecontainer inputstyled">
          <span>{{ displayHours }}</span>:<span>{{ minutes }}</span>:<span>{{ seconds }}</span>
        </div>
        <div class="label hidemin">Client:</div>
        <div class="inputstyled hidemin">{{ clientName }}</div>
      </div>
      <div class="inputcontainer hidemin">
        <div class="label">Comments</div>
        <textarea v-model="comments" placeholder="What are you doing?" class="inputstyled"></textarea>
      </div>
      <div class="timerbuttons">
        <button v-on:click="startTimer()">START</button>
        <button v-on:click="stopTimer()">STOP</button>
        <button v-on:click="resetTimer()">RESET</button>
        <button v-on:click="sumbmitTime()" class="submittime">SUBMIT</button>
      </div>
    </div>
  </div>
</template>

<script>
import writeFunctions from '../mixins/writeFunctions'
export default {
  mixins: [writeFunctions],
  name: 'Timer',
  data () {
    return {
      'client': '',
      'clientId': '',
      'clientName': '',
      'project': '',
      'projectName': '',
      'projectId': '',
      'task': '',
      'taskId': '',
      'date': 0,
      'comments': '',
      'interval': null,
      'startTime': Date.now(),
      'currentTime': Date.now(),
      'submitted': false
    }
  },
  computed: {
    elapsed: function () {
      return parseInt((this.currentTime - this.startTime) / 1000)
    },
    hours: function () {
      return Math.round(this.elapsed / 36) / 100
    },
    displayHours: function () {
      var hr = Math.floor(this.elapsed / 3600)
      if (hr > 9) {
        return hr
      } else {
        return '0' + hr.toString()
      }
    },
    minutes: function () {
      var mn = Math.floor(this.elapsed / 60) - this.displayHours * 60
      if (mn > 9) {
        return mn
      } else {
        return '0' + mn.toString()
      }
    },
    seconds: function () {
      var sec = Math.round(this.elapsed) - this.minutes * 60 - this.displayHours * 3600
      if (sec > 9) {
        return sec
      } else {
        return '0' + sec.toString()
      }
    }
  },
  methods: {
    sumbmitTime () {
      this.stopTimer()
      this.date = this.addDays(new Date(), -1)
      this.submitted = true
      this.logHours(this.clientId, this.client, this.clientName, this.project, this.projectName, this.projectId, this.task, this.taskId, this.hours, this.comments, this.date, true)
    },
    startTimer () {
      if (this.interval === null && this.elapsed === 0) {
        this.startTime = Date.now()
        this.currentTime = Date.now()
      } else {
        var timedif = Date.now() - this.currentTime
        this.startTime += timedif
      }
      this.updateTime()
      this.interval = setInterval(this.updateTime, 1000)
    },
    updateTime () {
      this.currentTime = Date.now()
    },
    stopTimer () {
      clearInterval(this.interval)
      this.interval = null
    },
    resetTimer () {
      this.stopTimer()
      this.startTime = Date.now()
      this.currentTime = Date.now()
      this.comments = ''
    },
    toggleModal () {
      if (this.elapsed > 0 && this.submitted === false) {
        if (confirm('Time has not been submitted, are you sure you want to close timer?')) {
          this.taskId = ''
          this.resetTimer()
        }
      } else {
        this.taskId = ''
        this.resetTimer()
        this.submitted = false
      }
    },
    minimize (ev) {
      ev.target.parentNode.classList.toggle('minimize')
    },
    projCallback () {
      this.$emit('projCallback')
    }
  },
  mounted () {
    this.$root.$on('timerStart', data => {
      if (data.taskId !== this.taskId) {
        this.resetTimer()
      }
      this.projectId = data.projectId
      this.clientId = data.clientId
      this.clientName = data.clientName
      this.taskId = data.taskId
      this.client = data.client
      this.project = data.project
      this.projectName = data.projectName
      this.task = data.task.task
    })
  }
}
</script>

<style scoped>
h4 {
  text-align: center;
  font-size: 19px;
  margin: 0 0 10px;
}
#closetimer {
  background-image: url(../assets/plus-ico.svg);
  transform: rotate(45deg);
  position: absolute;
  top: 5px;
  right: 5px;
  height: 30px;
  width: 30px;
  background-size: contain;
  background-position: center center;
  cursor: pointer;
}
#minimizetimer {
  position: absolute;
  border-bottom: 5px solid #58595B;
  top: 5px;
  right: 45px;
  height: 25px;
  width: 20px;
  cursor: pointer;
}
.minimize #minimizetimer {
  border-top: 5px solid #58595B;
  border-bottom: none;
  background-color: #eaeaea;
}
button {
  font-size: 16px;
  padding: 10px 35px;
  background-color: #f2f2f2;
  border: none;
  margin: 5px 0;
  cursor: pointer;
  color: #000000;
  transition: all 0.3s ease;
}
.timerbuttons {
  float: right;
}
.inputstyled {
  padding: 5px;
  margin-bottom: 15px;
  margin-right:10px;
}
textarea {
    font-size: 16px;
    font-weight: 200;
}
.timerdata {
    display: grid;
    grid-template-columns: auto 1fr auto 1fr;
}
.timerdata div {
  border-bottom: 1px solid #eaeaea
}
.timerdata .label {
  border-right: 1px solid #eaeaea;
}
.timerdata .label {
  padding: 5px;
  margin-bottom: 15px;
  font-weight: 600;
}
.inputcontainer .label {
  border: none;
}
.thin {
  font-weight: 200;
}
.minimize.timercontainer {
  padding: 3px;
  width: 331px;
}
.minimize .hidemin {
  display: none;
}
.minimize button {
  padding: 8px 15px;
}
</style>
