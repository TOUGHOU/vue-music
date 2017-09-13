<template>
  <scroll @scroll="scroll"
          :data="data"
          :listen-scroll="listenScroll"
          :probe-type="probeType"
          ref="listview"
          class="listview" >
    <ul>
      <li v-for="group in data" class="singer-group" ref="singerGroup">
        <h3 class="singer-group-title">{{group.title}}</h3>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" class="singer-group-item">
            <img :src="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="sidebar">
      <ul>
        <li
            v-for="(item, index) in _sideBar"
            class="item"
            @touchstart.stop.prevent="onSideBarTouchStart"
            @touchmove="onSideBarTouchMove"
            :data-index="index"
            :class="{'current' : currentIndex == index}">{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" ref="listFixed" v-show="fixTitle">
      <h3 class="fixed-title">{{fixTitle}}</h3>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom'

const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30

export default {
  created() {
    this.touches = {}
    this.listenScroll = true
    this.listHieght = []
    this.probeType = 3
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  computed: {
    _sideBar() {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
    onSideBarTouchStart(e) {
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touches.anchorIndex = anchorIndex
      this.touches.y1 = firstTouch.pageY
      this.currentIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onSideBarTouchMove(e) {
      let firstTouch = e.touches[0]
      this.touches.y2 = firstTouch.pageY
      let skewing = (this.touches.y2 - this.touches.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = parseInt(this.touches.anchorIndex) + skewing
      this.currentIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    _scrollTo(index) {
      if (index < 0) {
        this.currentIndex = 0
      } else if (index > this.listHieght.length - 2) {
        this.currentIndex = this.listHieght.length - 2
      }
      this.$refs.listview.scrollToElement(this.$refs.singerGroup[index], 0)
    },
    _calculateHeight() {
      this.listHieght = []
      let groups = this.$refs.singerGroup
      let len = groups.length
      let height = 0
      this.listHieght.push(height)
      for (let i = 0; i < len; i++) {
        let item = groups[i]
        height += item.clientHeight
        this.listHieght.push(height)
      }
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newY) {
      // console.log(newY)
      let listHieght = this.listHieght
      let len = listHieght.length
      for (let i = 0; i < len; i++) {
        let height1 = listHieght[i]
        let height2 = listHieght[i + 1]
        if ((-newY) < height2 && (-newY) > height1) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
        this.currentIndex = 0
      }
    },
    diff(newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? (newVal - TITLE_HEIGHT) : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.listFixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  },
  components: {
    scroll
  }
}
</script>

<style lang="stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    height: 100%
    width: 100%
    overflow: hidden
    .singer-group
      padding-bottom: 30px
      .singer-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .singer-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .sidebar
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
</style>
