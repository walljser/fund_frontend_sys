<template>
  <section class="fundInfo-page">
    <section class="container">
      <header>
        <el-row>
          <el-col :span="12" class="left-content">
            <h3 style="position:relative">
              {{holdings.fundName}}
              <el-button
                class="simulation-button"
                type="danger"
                size="small"
                @click.native.prevent="simulation"
              >点击这里过了一天</el-button>
            </h3>
            <h4>
              年转化率：
              <span class="rate">{{holdings.fundRate | filterRate}}</span>
            </h4>
            <h4>
              万元收益：
              <span class="earns">{{holdings.fundRate | filterEarns}}</span>
            </h4>
            <h4>
              基金类型：
              <span class="normal">{{holdings.fundType}}</span>
            </h4>
            <h4>
              持仓总价值：
              <span class="normal">{{holdings.totolHold | filterPrice(3)}}</span>
            </h4>
            <h4>
              昨日收益：
              <span class="normal">{{holdings.yestodayEarn | filterPrice(4)}}</span>
            </h4>
            <h4 class="buy">
              赎回金额：
              <el-row class="buy-input">
                <el-col :span="8">
                  <el-input type="number" v-model="price" placeholder="请输入购买金额"></el-input>
                </el-col>
                &nbsp;&nbsp;元
              </el-row>
            </h4>
            <h4>
              <el-button type="warning" size="large" @click.native.prevent="handleRemove">赎回基金</el-button>
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
import { detail as getClientHold } from '@/services/order'
import { remove as removeFundHoldings } from '@/services/order'
import { simulation as simulationChange } from '@/services/order'
export default {
  data() {
    return {
      chartLine: null,
      rateRecords: [],
      min: 1.0,
      max: 1.5,
      fundType: '',
      price: '',
      holdings: {},
      fundId: ''
    }
  },
  methods: {
    async drawChart() {
      const res = await getRates(this.fundId)
      if (!res.resultcode && res.resultcode === 0) {
        this.rateRecords = []
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
          text: '过去七天万元收益（元）'
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
          data: ['第一天', '第二天', '第三天', '第四天', '第五天', '第六天', '第七天']
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
      })
    },
    async getHolder() {
      const hid = this.$route.params.id
      const token = storage.getSession('token')
      const clientId = storage.getSession('clientId')
      const res = await getClientHold({ clientId, hid, token })
      if (res.resultcode === 0 ) {
        this.holdings = res.data
        this.fundId = res.data.fundId
        this.drawChart()
      } else {
        this.$message({
          message: res.message,
          type: 'info'
        })
      }
    },
    // 基金赎回
    handleRemove() {
      const token = storage.getSession('token')
      const clientId = storage.getSession('clientId')
      if (this.price === '') {
        this.$message({
          message: '请输入您要赎回的金额',
          type: 'info'
        })
      } else if (this.price <= 0) {
        this.$message({
          message: '赎回的金额必须大于0',
          type: 'info'
        })
      } else {
        const price = this.price
        this.$confirm(`您将赎回此款基金 ${price} 元, 是否继续?`, '提示', {
          confirmButtonText: '赎回',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await removeFundHoldings({
            clientId,
            fundId: this.fundId,
            price: this.price,
            token
          })
          if (res.resultcode === 0) {
            this.$message({
              message: `成功赎回基金 ${price} 元`,
              type: 'success'
            })
            this.price = ''
            this.getHolder()
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消赎回'
          })
        })
      }
    },
    // 模拟过一天
    async simulation() {
      const res = await simulationChange()
      if (res.resultcode === 0) {
        this.$message({
          message: '崭新的一天到来了',
          type: 'success'
        })
        this.getHolder()
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    }
  },
  mounted() {
    this.getHolder()
  },
  update() {
    this.getHolder()
  },
  filters: {
    filterRate (value) {
      let rate = (value * 100).toFixed(4)
      return rate + '%'
    },
    filterEarns (value) {
      return (value * 10000 / 365).toFixed(4) + ' 元'
    },
    filterPrice (value, number) {
      if (value)
        return value.toFixed(number) + ' 元'
      else
        return value
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
    &:nth-child(6) {
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
.simulation-button {
  position: absolute;
  right: 10px;
  bottom: 20px;
  width: 150px;
  height: 30px;
}
</style>
