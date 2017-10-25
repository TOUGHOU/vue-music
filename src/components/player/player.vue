<template>
  <div class="player" v-show="playlist.length>0">
  <transition name="normal"
              @enter="enter"
              @afterenter="afterEnter"
              @leave="leave"
              @afterleave="afterLeave"
  >
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img width="100%" height="100%" :src="currentSong.image">
      </div>
      <div class="top">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="currentSong.name"></h1>
        <h2 class="subtitle" v-html="currentSong.singer"></h2>
      </div>
      <div class="middle">
        <div class="middle-l">
          <div class="cd-wrapper">
            <div class="cd" :class="cdPlay">
              <img class="image" :src="currentSong.image">
            </div>
          </div>
        </div>
        <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
          <div class="lyric-wrapper">
            <div v-if="currentLyric">
              <p ref="lyricLine"
                 class="text"
                 :class="{'current' : currentLine === index}"
                 v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
            </div>
          </div>
        </scroll>
      </div>
      <div class="bottom">
        <div class="progress-wrapper">
          <span class="time time-l">{{formatTime(currentTime)}}</span>
          <div class="progress-bar-wrapper">
            <progress-bar :percent="percent"
                          @triggerProgressBarChange="progressBarChange">
            </progress-bar>
          </div>
          <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
        </div>
        <div class="operators">
          <div class="icon i-left">
            <i :class="modeIcon" @click="modeChange"></i>
          </div>
          <div class="icon i-left" :class="disableCls">
            <i class="icon-prev" @click="prevSong"></i>
          </div>
          <div class="icon i-center" :class="disableCls">
            <i :class="playIcon" @click="togglePlay"></i>
          </div>
          <div class="icon i-right" :class="disableCls">
            <i class="icon-next"  @click="nextSong"></i>
          </div>
          <div class="icon i-right">
            <i class="icon-not-favorite "></i>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img  width="40" height="40" :src="currentSong.image" :class="cdPlay">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progressCircle :radius="radius" :percent="percent">
            <i :class="iconMini" class="icon-mini" @click.stop="togglePlay"></i>
          </progressCircle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
    </div>
  </transition>
  <audio ref="audio" :src="currentSong.url"
          @canplay="ready"
          @ended="end"
          @timeupdate="updateTime"
  ></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapMutations} from 'vuex'
import progressCircle from 'base/progress-circle/progress-circle'
import progressBar from 'base/progress-bar/progress-bar'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import Lyric from 'lyric-parser'
import scroll from 'base/scroll/scroll'
// import animations from 'create-keyframe-animation'

export default {
  updated() {
    // console.log(this)
  },
  data() {
    return {
      songsReady: false,
      currentTime: 0,
      radius: 32,
      currentLyric: null,
      currentLine: 0
    }
  },
  mounted() {
    this.spaceControlPlay()
  },
  computed: {
    modeIcon() {
      const mode = this.mode % 3
      return mode === 1 ? 'icon-loop' : mode === 2 ? 'icon-random' : 'icon-sequence'
    },
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    iconMini() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdPlay() {
      return this.playing ? 'play' : 'play pause'
    },
    disableCls() {
      return this.songsReady ? '' : 'disable'
    },
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'fullScreen',
      'playlist',
      'playing',
      'currentIndex',
      'currentSong',
      'mode',
      'sequenceList'
    ])
  },
  methods: {
    getLyric() {
      this.currentSong.getLyric().then((lyc) => {
        this.currentLyric = new Lyric(lyc, this.lycHandle)

        if (this.playing) {
          this.currentLyric.play()
        }
      })
    },
    lycHandle(lyc) {
      this.currentLine = lyc.lineNum
      if (lyc.lineNum > 5) {
        let line = this.$refs.lyricLine[lyc.lineNum - 5]
        this.$refs.lyricList.scrollToElement(line, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
    },
    spaceControlPlay() {
      document.addEventListener('keyup', (e) => {
        if (e.keyCode === 40) {
          this.turnDown()
        }
        if (e.keyCode === 38) {
          this.turnUp()
        }
        if (e.keyCode === 32) {
          this.togglePlay()
        }
      }, false)
    },
    turnDown() {
      let volume = this.$refs.audio.volume.toFixed(1)
      // console.log(volume)
      if (volume <= 0) {
        return
      }
      this.$refs.audio.volume -= 0.1
    },
    turnUp() {
      let volume = this.$refs.audio.volume.toFixed(1)
      // console.log(volume)
      if (volume >= 1) {
        return
      }
      this.$refs.audio.volume += 0.1
    },
    modeChange() {
      let mode = (this.mode + 1) % 3
      this.setPlayMode(mode)

      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    progressBarChange(percent) {
      this.$refs.audio.currentTime = this.currentSong.duration * percent
      // if (!this.playing) {
      //   this.togglePlay()
      // }
    },
    formatTime(time) {
      let interval = time | 0
      const min = interval / 60 | 0
      const sec = this._pad(interval % 60)
      /**
       * 这是我写的，上面是滴滴大神写的逻辑，高下立判
       */
      // let min = 0
      // let sec = 0
      // if (time>= 60) {
      //   min = Math.floor(time/ 60)
      // }
      // sec = time- min * 60
      // if (sec === 0) {
      //   sec = '00'
      // } else if (sec < 10) {
      //   sec = '0' + sec
      // }
      // if (min === 0) {
      //   min = '0'
      // }
      return `${min}:${sec}`
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime
    },
    prevSong() {
      if (!this.songsReady) {
        return
      }

      let index = this.currentIndex - 1
      if (index < 0) {
        index = this.playlist.length - 1
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlay()
      }

      this.songsReady = false
    },
    nextSong() {
      if (!this.songsReady) {
        return
      }

      let index = this.currentIndex + 1
      if (index === this.playlist.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlay()
      }

      this.songsReady = false
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.setPlayingState(true)
    },
    back() {
      this.setFullScreen(false)
    },
    open() {
      this.setFullScreen(true)
    },
    enter(el, done) {

    },
    afterEnter() {

    },
    leave() {

    },
    afterLeave() {

    },
    end() {
      if (this.mode === playMode.loop) {
        this.loop()
        return
      }
      this.nextSong()
    },
    ready() {
      this.songsReady = true
    },
    error() {

    },
    togglePlay() {
      if (!this.songsReady) {
        return
      }
      this.setPlayingState(!this.playing)
    },
    _pad(s, n = 2) {
      let len = s.toString().length
      let num = s
      while (len < n) {
        num = '0' + s
        len++
      }

      return num
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    })
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (newSong === oldSong) {
        return
      }
      this.$nextTick(() => {
        this.$refs.audio.play()
        this.getLyric()
      })
    },
    playing(newPlaying) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  components: {
    progressBar,
    progressCircle,
    scroll
  }
}
</script>

<style lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                // position: absolute
                // left: 0
                // top: 0
                width: 100%
                height: 100%
                border-radius: 50%
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
