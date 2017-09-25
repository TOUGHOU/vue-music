<template>
  <transition name="slide">
    <musiclist :title="this.singer.name"
               :bgImage="this.singer.avatar"
               :songs="this.songs">
    </musiclist>
  </transition>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
import {ERR_OK} from 'api/config'
import {getSingerDetail} from 'api/singer'
import {createSong} from 'common/js/song'
import musiclist from 'components/music-list/music-list'

export default {
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  data() {
    return {
      songs: []
    }
  },
  created() {
    this._getSingerDetail()
  },
  methods: {
    _getSingerDetail() {
      if (!this.singer.id) {
        return
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list)
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((item) => {
        let {musicData} = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  components: {
    musiclist
  }
}
</script>

<style lang="stylus">
  @import '~common/stylus/variable'

  .singer-details
    position: fixed
    z-index: 100
    top 0px
    left 0px
    width: 100%
    height 100%
    background $color-background
  .slide-enter-active, .slide-leave-active
    transition: all .3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
