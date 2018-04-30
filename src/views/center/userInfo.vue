<template>
  <el-col :span="18" class="right-component">
    <h4 class="welcome">尊敬的 {{clientInfo.clientName}} ，您好！</h4>
    <div class="financial-body">
      <h3 style="position: relative;">
        资产信息
        <el-button
          type="danger" style="position:absolute; right: 0; bottom: 5px;"
          @click.native.prevent="simulation"
        >点击这里过一天</el-button>
      </h3>
      <div v-if="clientInfo.active" class="balance">
        账户余额：
        <h4 class="price">
          {{clientInfo.balance | formatPrice(2)}}&nbsp;元
        </h4>
      </div>
      <div v-if="!clientInfo.active" class="balance balance-disabled">
        <h4 class="price">
          您的账户已被冻结，请联系客服解冻，call: 13075970590
        </h4>
      </div>
      <div class="earns" v-if="clientInfo.active">
        您的总固定收益为：
        <h4>
          {{clientInfo.totolEarnings | formatPrice(4)}} 元
        </h4>
      </div>
    </div>
    <ul class="holders">
      <h4>
        您的持仓情况：
      </h4>
      <el-table
      :data="holdings"
      style="width: 100%"
      >
        <el-table-column
          prop="fundName"
          label="基金名称"
          width="180"
        />
        <el-table-column
          prop="fundTypeName"
          label="基金类型"
          width="180"
        />
        <el-table-column
          prop="amount"
          label="持仓总价"
          width="180"
          :formatter="amountFormatter"
        />
        <el-table-column
          prop="yestodayEarn"
          label="昨日收益"
          width="130"
          :formatter="earnsFormatter"
        />
        <el-table-column label="操作">
          <template scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleDetail(scope.$index, scope.row)"
            >
            查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </ul>
  </el-col>
</template>

<script type="text/ecmascript-6">
import { get as getClientInfo} from '@/services/info'
import { one as getClientHold } from '@/services/order'
import { simulation as simulationChange } from '@/services/order'
import storage from '@/utils/storage'

export default {
  data() {
    return {
      clientInfo: {},
      rechargePrice: '',
      payMethods: '',
      checked: false,
      holdings: []
    }
  },
  methods: {
    async getInfo() {
      const clientId = storage.getSession('clientId')
      const token = storage.getSession('token')
      const res = await getClientInfo({ clientId, token })
      if (res.resultcode === 0) {
        this.clientInfo = res.data.clientUser
        this.payMethods = this.clientInfo.active ? '1' : ''
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    },
    async getHolder() {
      const clientId = storage.getSession('clientId')
      const token = storage.getSession('token')
      const res = await getClientHold({ clientId, token })
      if (res.resultcode === 0 ) {
        this.holdings = res.data.fundHolds
      }
    },
    async simulation() {
      const res = await simulationChange()
      if (res.resultcode === 0) {
        this.$message({
          message: '崭新的一天到来了',
          type: 'success'
        })
        this.getInfo()
        this.getHolder()
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    },
    amountFormatter(row, column) {
      if (row.amount)
        return row.amount.toFixed(2) + ' 元'
      else
        return row.amount
    },
    earnsFormatter(row, column) {
      if (row.yestodayEarn)
        return row.yestodayEarn.toFixed(6) + ' 元'
      else
        return 0.00 + ' 元'
    },
    handleDetail(index, row) {
      this.$router.push({ name: 'holdingInfo', params: {
        id: row.HID
      }})
    }
  },
  mounted() {
    this.getInfo()
    this.getHolder()
  },
  filters: {
    formatPrice(val, number) {
      if (val)
        return Number(val).toFixed(number)
      else
        return val
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/_vars.scss';

.financial {
  &-body {
    background-color: #fff;
  }
}
h3 {
  border-bottom: 1px solid $border-color;
  padding: 10px;
  font-size: 24px;
  color: $financial-title-color;
}
.welcome {
  font-size: 16px;
  background-color: #f6f6f6;
  color: #666;
  padding: 10px;
  text-align: right;
  span {
    float: right;
  }
}
.balance {
  background-color: $primary;
  padding: 10px;
  font-size: 16px;
  color: #fff;
  background-image: url("~@/assets/image/balance_bg.png");
  background-repeat: no-repeat;
  background-position: 475px -35px;
  .price {
    padding: 10px 0;
    font-size: 48px;
  }
  &-disabled {
    text-align: center;
    .price {
      padding: 10px 0;
      font-size: 30px;
    }
  }
}
.earns {
  padding: 30px 10px;
  h4 {
    font-size: 30px;
    padding-top: 10px;
  }
}
ul {
  // padding: 10px;
  h4 {
    padding: 10px;
  }
  margin-top: 10px;
  height: 100px;
  background-color: #fff;
}
</style>
