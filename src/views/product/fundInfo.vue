<template>
  <section class="fundInfo-page">
    <section class="container">
      <header>
        <el-row>
          <el-col :span="12" class="left-content">
            <h3>{{fund.fundName}}</h3>
            <h4>
              年转化率：
              <span class="rate">{{fund.rate | filterRate}}</span>
            </h4>
            <h4>
              万元收益：
              <span class="earns">{{fund.rate | filterEarns}}</span>
            </h4>
            <h4>
              基金类型：
              <span class="normal">{{typeName}}</span>
            </h4>
            <h4>
              成立日期：
              <span class="normal">{{fund.fundCreateDate}}</span>
            </h4>
            <h4 class="buy">
              买入金额：
              <el-row class="buy-input">
                <el-col :span="8">
                  <el-input type="number" v-model="price" placeholder="请输入购买金额"></el-input>
                </el-col>
                &nbsp;&nbsp;元
              </el-row>
            </h4>
            <h4>
              <el-button type="warning" size="large" @click.native.prevent="handleBuy">申购</el-button>
            </h4>
          </el-col>
          <el-col :span="12">
            <div id="chartLine" style="width:100%; height:400px;"></div>
          </el-col>
        </el-row>
      </header>
    </section>
  </section>
</template>

<script type="text/ecmascript-6">
import echarts from 'echarts'
import storage from '@/utils/storage'
import { get as getRates } from '@/services/rate'
import { one as getFund } from '@/services/funds'
import { create as applyFund } from '@/services/order'
export default {
  data() {
    return {
      chartLine: null,
      rateRecords: [],
      fund: {},
      min: 1.0,
      max: 1.5,
      typeName: '',
      price: ''
    }
  },
  methods: {
    async drawChart() {
      const fundId = this.$route.params.id
      const res = await getRates(fundId)
      if (!res.resultcode && res.resultcode === 0) {
        res.data.rateRecords.map((item) => {
          let rate = ((item.rate * 10000) / 365).toFixed(4)
          this.rateRecords.push(rate)
          this.min = (Number(rate) - 0.3).toFixed(1)
          this.max = (Number(rate) + 0.3).toFixed(1)
        })
      }
      this.chartLine = echarts.init(document.getElementById('chartLine'));
      this.chartLine.setOption({
        title: {
          text: '万元收益（元）'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['万元收益']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value',
          min: this.min,
          max: this.max
        },
        series: [{
          name: '万元收益',
          type: 'line',
          stack: '总量',
          data: this.rateRecords
        }]
      });
    },
    async getFundInfo() {
      const fundId = this.$route.params.id
      const res = await getFund(fundId)
      if (res.resultcode === 0) {
        this.fund = res.data.fund
        this.typeName = this.fund.fundType.fundTypeName
      } else {
        this.$message({
          message: res.message,
          type: 'info'
        })
      }
    },
    // 基金购买
    handleBuy() {
      const token = storage.getSession('token')
      const clientId = storage.getSession('clientId')
      if (!clientId || !token) {
        this.$message({
          message: '您还未登录，请先登录',
          type: 'info'
        })
        return
      }
      const fundId = this.$route.params.id
      if (this.price === '') {
        this.$message({
          message: '请输入您要申购的金额',
          type: 'info'
        })
      } else if (this.price <= 0) {
        this.$message({
          message: '申购的金额必须大于0',
          type: 'info'
        })
      } else {
        this.$confirm('您将申购此款基金, 是否继续?', '提示', {
          confirmButtonText: '申购',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await applyFund({ clientId, price: this.price, fundId, token })
          if (res.resultcode === 0) {
            this.$message({
              message: '基金申购成功',
              type: 'success'
            })
            this.price = ''
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消申购'
          })
        })
      }
    }
  },
  mounted() {
    this.getFundInfo()
    this.drawChart()
  },
  update() {
    this.drawChart()
  },
  filters: {
    filterRate (value) {
      let rate = (value * 100).toFixed(4)
      return rate + '%'
    },
    filterEarns (value) {
      return (value * 10000 / 365).toFixed(4) + ' 元'
    }
  }
}
</script>

<style scoped lang="scss" scoped>
@import '~@/assets/scss/_vars.scss';
.fundInfo-page {
  margin-top: 20px;
}
header {
  background-color: #fff;
  padding: 20px;
  h3 {
    font-size: 28px;
    color: $dark-color;
    &:first-child {
      padding-bottom: 20px;
    }
  }
  h4 {
    height: 50px;
    line-height: 50px;
    color: $gray-dark;
    &:nth-child(5) {
      padding-bottom: 10px;
      border-bottom: 1px solid $border-color;
    }
  }
}
.rate {
  font-size: 24px;
  color: $red;
}
.earns {
  font-size: 24px;
  color: $dark-color;
}
.normal {
  font-size: 20px;
  color: $dark-color;
}
.buy {
  margin-top: 10px;
  display: flex;
}
.buy-input {
  margin-left: 5px;
  flex: auto;
}
button {
  margin-top: 20px;
  width: 300px;
}
</style>
