<template>
  <div class="singer">
    <listview :data="singers"></listview>
  </div>
</template>

<script type="text/babel">
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'
import listview from 'base/listview/listview'

const HOT_NAME = '热门'
const HOT_LEN = 10

export default {
  data() {
    return {
      singers: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this.normalizeList(res.data.list)
        }
      })
    },
    normalizeList(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }

      for (let i = 0, len = list.length; i < len; i++) {
        if (i < HOT_LEN) {
          map.hot.items.push(
            new Singer({id: list[i].Fsinger_mid, name: list[i].Fsinger_name})
          )
        }

        const key = list[i].Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }

        map[key].items.push(
          new Singer({id: list[i].Fsinger_mid, name: list[i].Fsinger_name})
        )
      }

      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })

      return hot.concat(ret)
    }
  },
  components: {
    listview
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
