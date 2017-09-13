<template>
  <div id="app">
    <m-header></m-header>
    <m-tab></m-tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import MHeader from 'components/mhead/mhead'
  import MTab from 'components/tab/tab'

  export default {
    components: {
      MHeader,
      MTab
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

  @import '~common/stylus/variable'

  #id
    color: $color-theme
</style>
