<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="bgLayer"></div>
    <scroll class="list" ref="list"
            @scroll="scroll"
            :data="songs"
            :listenScroll="listenScroll"
            :probeType="probeType">
      <div class="song-list-wrapper" ref="songlist">
        <songlist @select="selectItem" :songs="songs"></songlist>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import scroll from 'base/scroll/scroll'
import songlist from 'base/song-list/song-list'
import {prefixStyle} from 'common/js/dom'
import {mapActions} from 'vuex'

const transform = prefixStyle('transform')
const TITLE_HEIGHT = 40

export default {
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      scrollY: -1
    }
  },
  created() {
    console.log(this)
    this.probeType = 3
    this.listenScroll = true
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImage})`
    }
  },
  methods: {
    random() {
      this.randomPlay({
        list: this.songs
      })
    },
    back() {
      this.$router.back()
    },
    scroll(scroll) {
      this.scrollY = scroll.y
    },
    selectItem(item, index) {
      this.selectPlayer({
        list: this.songs,
        index: index
      })
    },
    _bgLayer(y) {
      let zIndex = 0
      let translateY = Math.max(y, this.minTranslateY)
      let scale = 1
      let percent = Math.abs(y / this.bgHeight)

      if (y > 0) {
        zIndex = 10
        scale = 1 + percent
      }
      // 向上偏移
      this.$refs.bgLayer.style[transform] = `translate3d(0, ${translateY}px, 0)`
      // 控制背景图片样式
      if (y < this.minTranslateY) {
        zIndex = 10
        this.$refs.bgImage.style.height = `${TITLE_HEIGHT}px`
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.bgImage.style.height = 0
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.playBtn.style.display = ''
      }

      this.$refs.bgImage.style.transform = `scale(${scale})`
      // 当到达阈值时，图片的index
      this.$refs.bgImage.style.zIndex = zIndex
    },
    ...mapActions([
      'selectPlayer',
      'randomPlay'
    ])
  },
  mounted() {
    this.bgHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.bgHeight + TITLE_HEIGHT
    this.$refs.list.$el.style.top = `${this.bgHeight}px`
  },
  watch: {
    scrollY() {
      this._bgLayer(this.scrollY)
    }
  },
  components: {
    scroll,
    songlist
  }
}
</script>

<style lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      // z-index: -1
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
