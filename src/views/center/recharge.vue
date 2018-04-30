<template>
  <el-col :span="18" class="right-component">
    <h4 class="welcome">尊敬的 {{clientInfo.clientName}} ，您好！</h4>
    <div class="financial-body">
      <h3>用户中心</h3>
      <div v-if="clientInfo.active" class="balance">
        账户余额：
        <h4 class="price">
          {{clientInfo.balance | formatPrice}}&nbsp;元
        </h4>
      </div>
      <div v-if="!clientInfo.active" class="balance balance-disabled">
        <h4 class="price">
          您的账户已被冻结，请联系客服解冻，call: 13075970590
        </h4>
      </div>
      <div style="height: 200px;" v-if="!clientInfo.active">

      </div>
    </div>
    <section class="recharge" v-if="clientInfo.active">
      <h3>立即存款</h3>
      <div class="recharge-price">
        <div class="content">
          <span>
            金额：
          </span>
          <el-input type="number" size="small" v-model="rechargePrice" placeholder="请输入金额"></el-input>
        </div>
      </div>
    </section>

    <section class="pay-methods" v-if="clientInfo.active">
      <h3>支付方式</h3>
      <ul class="methods">
        <li>
          <el-radio class="radio" v-model="payMethods" label="1">
            <i class="fa fa-wechat"></i>
            <span class="name">微信钱包支付</span>
            <span class="remarks">使用U盾/Ukey网银支付，最高1000万/笔，单日无限额</span>
          </el-radio>
        </li>
        <li>
          <el-radio class="radio" v-model="payMethods" label="2">
            <i class="fa fa-qq"></i>
            <span class="name">QQ钱包支付</span>
            <span class="remarks">仅支持QQ钱包中储蓄卡支付，大部分银行单笔单日最高5万元限额</span>
          </el-radio>
        </li>
        <li>
          <el-radio class="radio" v-model="payMethods" label="3">
            <i class="fa fa-credit-card-alt"></i>
            <span class="name">网银支付</span>
            <span class="remarks" id="esp">仅支持微信钱包中储蓄卡支付，大部分银行单笔单日最高5万元限额</span>
          </el-radio>
        </li>
      </ul>
    </section>

    <section class="account" v-if="clientInfo.active">
      <div class="total">
        支付金额： <div class="price-icon">￥</div>
        <span>{{rechargePrice | formatPrice}}</span>
      </div>
      <el-checkbox v-model="checked">同意 服务协议及风险提示</el-checkbox>
      <div class="button-holder">
        <el-button type="warning" size="large" @click.native.prevent="pay">确认支付</el-button>
      </div>
    </section>
  </el-col>
</template>

<script type="text/ecmascript-6">
import { get as getClientInfo } from '@/services/info'
import { recharge as rechargeBlance } from '@/services/trans'
import storage from '@/utils/storage'

export default {
  data() {
    return {
      clientInfo: {},
      rechargePrice: '',
      payMethods: '',
      checked: false
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
      } else if (res.resultcode === -2) {
        this.$message({
          message: '您的登录已过期，请重新登录',
          type: 'error'
        })
        this.$router.push({ name: 'signin' })
      }
    },
    async pay() {
      const token = storage.getSession('token')
      const clientId = storage.getSession('clientId')
      const price = Number(this.rechargePrice)
      if (price <= 0) {
        this.$message({
          message: '充值金额必须大于0',
          type: 'error'
        })
      } else if (this.checked === false) {
        this.$message({
          message: '请阅读并同意服务协议',
          type: 'error'
        })
      } else {
        const res = await rechargeBlance({ clientId, price, token })
        if (res.resultcode === 0) {
          this.getInfo()
          this.$message({
            message: '恭喜充值成功',
            type: 'success'
          })
        } else if (res.resultcode === -2) {
          this.$message({
            message: '您的登录已过期，请重新登录',
            type: 'error'
          })
        }
      }
    }
  },
  mounted() {
    this.getInfo()
  },
  filters: {
    formatPrice(val) {
      return Number(val).toFixed(2)
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
.recharge {
  h3 {
    padding: 0;
    padding-bottom: 10px;
  }
  margin-top: 20px;
  padding: 10px;
  background-color: #FFF;
  padding: 10px;
  &-price {
    .content {
      padding-top: 10px;
      display: flex;
      width: 250px;
      span {
        width: 35%;
        line-height: 30px;
      }
    }
  }
}
.pay-methods {
  margin-top: 20px;
  padding: 10px;
  background-color: #fff;
  h3 {
    padding: 0;
    padding-bottom: 10px;
  }
  ul {
    padding-top: 10px;
  }
  li {
    padding: 5px 0;
    font-size: 16px;
    display: flex;
  }
}
.methods-disable {

}
.name {
  display: inline-block;
  width: 150px;
}
.remarks {
  display: inline-block;
  width: 480px;
  color: #999;
  text-align: right;
}
.fa {
  margin: 0 10px;
  width: 18px;
}
.fa-wechat {
  color: $wechat-color;
}
.fa-credit-card-alt {
  color: $red-light;
}
.fa-qq {
  color: $primary;
}
.total {
  margin-bottom: 10px;
}
.account {
  margin-top: 20px;
  padding: 10px;
  font-size: 14px;
  span {
    font-size: 48px;
    color: $red-light;
  }
  .price-icon {
    font-size: 14px;
    color: $red-light;
    display: inline-block;
  }
}
.button-holder {
  margin-top: 10px;
}
.el-button--large {
  width: 250px;
}
</style>
