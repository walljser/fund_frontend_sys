<template>
  <li class="card-item">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="line-height: 36px;">{{cardData.fundName}}</span>
      </div>
      <div class="text item">
        <p class="card-title">年转化率</p>
        <div class="card-rate">{{cardData.rate | rateFilter}}%</div>
        <button class="card-button" @click="handlClick">立即查看</button>
      </div>
    </el-card>
  </li>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    cardData: {
      required: true,
      type: Object
    }
  },
  methods: {
    handlClick() {
      this.$emit('look', this.cardData.fundNo)
    }
  },
  filters: {
    rateFilter(val) {
      if (val)
        return (val * 100).toFixed(2)
      else
        return val
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/assets/scss/_vars.scss';

.card {
  &-title {
    text-align: center;
    margin-bottom: 10px;
  }
  &-rate {
    color: $red;
    font-size: 48px;
    text-align: center;
    margin-bottom: 10px;
  }
  &-button {
    width: 100%;
    height: 50px;
    background-color: #fff;
    font-weight: 400;
    color: $red;
    border: 1px solid $red;
    &:hover {
      background-color: $red;
      border-color: $red;
      color: #fff;
    }
    &:focus {
      background-color: $red;
      border-color: $red;
      color: #fff;
      outline: none;
    }
  }
}
</style>
