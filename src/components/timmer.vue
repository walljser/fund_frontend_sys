<template>
  <span>
    {{time}} s
    <slot></slot>
  </span>
</template>

<script>
export default {
  data() {
    return {
      time: 60,
      flag: false
    }
  },
  mounted() {
    this.timmer()
  },
  props: {
    endTime: {
      type: String
    },
  },
  methods: {
    timmer() {
      setInterval(() => {
        if (this.flag == true) {
          clearInterval(this.timemer)
        }
        this.timeDown()
      }, 1000)
    },
    timeDown() {
      if (this.time <= 0) {
        this.flag = true
        this.$emit('time-end')
      } else {
        this.time = this.time - 1
      }
    },
    formate(time) {
      if (time >= 10) {
        return time
      } else {
        return `0${time}`
      }
    }
  }
}
</script>
