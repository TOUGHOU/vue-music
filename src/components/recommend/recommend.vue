<template>
  <div class="recommend" ref="recommend">
    <scroll :data="discList" class="recommend-content">
      <div>
        <div class="swiper-wrapper" v-if="swiper.length">
          <slider>
            <div v-for="item in swiper">
              <a :href="item.linkUrl">
                <img :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="songlist-wrapper">
          <h1 class="list-title">热门歌单推荐</h1>
            <ul class="songlist">
              <li v-for="item in discList" class="disc-item">
                <div class="left-part">
                  <img v-lazy="item.imgurl" width="60" height="60">
                </div>
                <div class="right-part">
                  <p class="name">{{item.creator.name}}</p>
                  <p class="dissname">{{item.dissname}}</p>
                </div>
              </li>
            </ul>
        </div>
      </div>
      <div class="loading-wrapper" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/babel">
  import scroll from 'base/scroll/scroll'
  import loading from 'base/loading/loading'
  import {getRecommend, getDiscList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import slider from 'base/slider/slider'

  export default {

    data() {
      return {
        swiper: [],
        discList: []
      }
    },
    created() {
      this._getRecommend()
      this._getDiscList()
    },
    methods: {
      _getRecommend() {
        // 这里的getRecommend是Promise对象
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.swiper = (res.data.slider)
          }
        })
      },
      _getDiscList() {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          }
        })
      }
    },
    components: {
      slider,
      scroll,
      loading
    }
}
</script>

<style lang="stylus">
@import "~common/stylus/variable"
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height 100%
      overflow hidden
      .swiper-wrapper
        position: relative
        overflow: hidden
      .songlist-wrapper
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .songlist
          .disc-item
            display: flex
            box-sizing: border-box
            align-items: center
            padding: 0 20px 20px 20px
            .left-part
              flex: 0 0 60px
              width: 60px
              padding-right: 20px
            .right-part
              display: flex
              flex-direction: column
              justify-content: center
              flex: 1
              line-height: 20px
              overflow: hidden
              font-size: $font-size-medium
              .name
                margin-bottom: 10px
                color: $color-text
              .dissname
                width: 100%
                color: $color-text-d
      .loading-wrapper
        position absolute
        top 50%
        left 50%
        transform translateX(-50%)

</style>
