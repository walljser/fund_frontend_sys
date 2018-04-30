<template>
  <footer class="page-faq">
    <img src="../assets/image/logo.png" class="page-faq-logo" alt="">
    <div class="page-faq-name">
      <span class="title">建财宝</span> | 建行官方理财平台
    </div>
    <div class="page-faq-help">
      <i class="fa fa-phone"></i>
      <span>系统开发人员： 余世杰和他的小伙伴任显聪、郭剑铭 | call: 13075970590</span>
    </div>
  </footer>
</template>

<style lang="scss">
@import '~@/assets/scss/_vars';
.page-faq {
  height: 150px;
  line-height: 150px;
  width: 100%;
  background-color: $faq-bg-color;
  display: flex;
  font-size: 24px;
  color: $faq-font-color;
  &-logo {
    margin: 45px 10px 0 30px;
    display: block;
    height: 50px;
  }
  &-name {
    width: 40%;
    height: 100%;
    .title {
      font-size: 30px;
      font-weight: 400;
    }
  }
  &-help {
    font-size: 20px;
    position: relative;
    .fa {
      position: absolute;
      font-size: 40px;
      top: 55px;
      left: -40px;
      color: $primary;
    }
  }
}
</style>
