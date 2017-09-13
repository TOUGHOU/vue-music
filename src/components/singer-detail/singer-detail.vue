<template>
  <transition name="slide">
    <div class="singer-details">
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {}
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
