<template>
  <div id="app">
    <m-header></m-header>
    <m-tab></m-tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <m-plaer></m-plaer>
  </div>
</template>

<script type="text/ecmascript-6">
  import MHeader from 'components/mhead/mhead'
  import MTab from 'components/tab/tab'
  import MPlaer from 'components/player/player'

  export default {
    components: {
      MHeader,
      MTab,
      MPlaer
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

  @import '~common/stylus/variable'

  #id
    color: $color-theme
</style>
