<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn">
        <div class="progress-btn" @touchstart.prevent="touchStart"
                                  @touchmove.prevent="touchMove"
                                  @touchend.prevent="touchEnd">
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
const btnWidth = 16

export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    touchStart(e) {
      this.touch.initial = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    touchMove(e) {
      if (!this.touch.initial) {
        return
      }

      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - (btnWidth / 1.5), Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
    touchEnd(e) {
      this.touch.initial = false
      this._triggerPercentChange()
    },
    progressClick(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      this._offset(offsetWidth)
      this._triggerPercentChange()
    },
    _triggerPercentChange() {
      const barWidth = this.$refs.progressBar.clientWidth - btnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('triggerProgressBarChange', percent)
    },
    _offset(offset) {
      this.$refs.progress.style.width = `${offset}px`
      this.$refs.progressBtn.style['transform'] = `translate3d(${offset}px, 0, 0)`
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.initial) {
        const baseWidth = this.$refs.progressBar.clientWidth - btnWidth
        const offset = baseWidth * newPercent
        this._offset(offset)
      }
    }
  }
}
</script>

<style lang="stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
