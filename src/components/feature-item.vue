<template>
  <div class="item">
    <h3>{{feature.title}}</h3>
    <div class="feature-info">
      <span v-for="item in feature.info">{{item}}</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    feature: {
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/_vars.scss';

.item {
  flex: 0 0 33.33333%;
  display: flex;
  padding: 10px;
  background-color: #fff;
  box-sizing: border-box;
  border-left: 2px solid #eee;
  border-right: 2px solid #eee;
  h3 {
    width: 40%;
    height: 55px;
    line-height: 55px;
    display: inline-block;
    font-size: 33px;
    text-align: center;
    color: $primary;
  }
}
.feature-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  span {
    font-size: 12px;
    padding: 3px;
    color: $feature-font-color;
  }
}
</style>
