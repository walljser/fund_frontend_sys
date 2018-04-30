<template>
  <section class="financial-page">
    <section class="container">
      <el-row>
      <el-col :span="6" class="left-component">
        <ul class="left-content">
          <router-link to="/financial/transRecord">
            <li :class="$route.name === 'transRecord'? 'active' : ''">基金交易记录</li>
          </router-link>
          <router-link to="/financial/bill">
            <li :class="$route.name === 'bill'? 'active' : ''">账单</li>
          </router-link>
        </ul>
      </el-col>
      <router-view></router-view>
      </el-row>
    </section>
  </section>
</template>

<script type="text/ecmascript-6">
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/_vars.scss';

.financial {
  &-page {
    margin-top: 10px;
  }
}
.left-component {
  padding-right: 10px;
  padding-top: 36px;
  ul {
    padding-top: 40px;
    background-color: $gray;
    height: 500px;
  }
  li {
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 16px;
  }
  li.active {
    background-color: $html-bg-color;
    border-left: 2px solid $primary;
    color: $primary;
  }
}
</style>

<style>
.el-radio {
  font-size: 20px;
}
</style>
