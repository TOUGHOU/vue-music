<template>
  <div class="loading">
    <img src="./loading.gif" width="40" height="40">
    <p class="text">{{text}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      text: {
        type: String,
        default: '正在载入中...'
      }
    }
  }
</script>

<style lang="stylus">
  @import "~common/stylus/variable"
  .loading
    text-align center
    .text
      line-height: 20px
      font-size: $font-size-medium-x
      color: $color-text-l
</style>
