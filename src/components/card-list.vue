<template>
  <ul class="card-list">
    <slot></slot>
  </ul>
</template>

<script type="text/ecmascript-6">

export default {

}
</script>

<style scoped lang="scss">
@import '~@/assets/scss/_vars.scss';

.card-list {
  display: flex;
  flex-wrap: wrap;
  .card-item {
    flex: 0 0 33.333333%;
    margin-top: 10px;
    max-width: 32.333333%;
    &:nth-child(3n){
      padding: 0 0 0 6.67px;
    }
    &:nth-child(3n + 1){
      padding: 0 6.67px 0 0;
    }
    // &:nth-child(3n + 2) {
    //   margin-top: 10px;
    // }
    // &:nth-child(6n) {
    //   margin-top: 10px;
    // }
    &:nth-child(3n - 1){
      padding: 0 3.33px 0;
    }
  }
}
</style>
