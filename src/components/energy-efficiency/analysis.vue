<template>
  <div class="report">
    <iframe :src="jumpUrl" importance="high" allowFullScreen
            :style="{height: scrollerHeight,width:'100%'}"></iframe>
  </div>
</template>

<script>
import {http} from '@/resources'

export default {
  name: 'energy-effciency-detail',
  data() {
    return {
      jumpUrl: '',
      key: 'web-energy-detail',
      id: '',
    }
  },
  computed: {
    scrollerHeight: function () {
      return (window.innerHeight - 60 - 56) + 'px';
    },
  },
  watch: {
    '$route': {
      handler(router) {
        // console.log(router)
        this.id = router.query.id
        this.jumpUrl = ''
        http.get(`/hengshi/getUrlByKeyAndId?key=${this.key}&id=${this.id}`).then(res => {
          this.jumpUrl = res.data
        })
      },
      deep: true,
      immediate: true
    }
  },
  created() {
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.report {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}
</style>
