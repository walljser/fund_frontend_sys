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
    <section class="transfer" v-if="clientInfo.active">
      <h3>转账</h3>
      <div class="transfer-price">
        <div class="content">
          <span>
            对方账户：
          </span>
          <el-input size="small" v-model="account" placeholder="请输入对方账号"></el-input>
        </div>
        <div class="content">
          <span>
            对方姓名：
          </span>
          <el-input size="small" v-model="name" placeholder="请输入对方姓名"></el-input>
        </div>
        <div class="content">
          <span>
            金额：
          </span>
          <el-input type="number" size="small" v-model="transferPrice" placeholder="请输入金额"></el-input>
        </div>
      </div>
    </section>

    <section class="account" v-if="clientInfo.active">
      <div class="total">
        转账金额： <div class="price-icon">￥</div>
        <span>{{transferPrice | formatPrice}}</span>
      </div>
      <div class="button-holder">
        <el-button type="warning" size="large" @click.native.prevent="pay">确认支付</el-button>
      </div>
    </section>
  </el-col>
</template>

<script type="text/ecmascript-6">
import { get as getClientInfo } from '@/services/info'
import { transfer as transferBlance } from '@/services/trans'
import storage from '@/utils/storage'

export default {
  data() {
    return {
      clientInfo: {},
      transferPrice: '',
      account: '',
      name: '',
      payMethods: ''
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
      const price = Number(this.transferPrice)
      const account = this.account
      const name = this.name
      if (price <= 0) {
        this.$message({
          message: '转账金额必须大于0',
          type: 'info'
        })
      } else if (price > this.clientInfo.balance) {
        this.$message({
          message: '输入金额超过您的余额，最多只能转账 ' + this.clientInfo.balance + ' 元',
        })
      } else if (account === '') {
        this.$message({
          message: '对方账号不能为空',
          type: 'info'
        })
      } else if (name === '') {
        this.$message({
          message: '对方姓名不能为空',
          type: 'info'
        })
      } else if (account.length != 18) {
        this.$message({
          message: '请输入正确的对方账号，账号都是18位',
          type: 'info'
        })
      } else {
        const res = await transferBlance({ clientId, price, account, name, token })
        if (res.resultcode === 0) {
          this.getInfo()
          this.$message({
            message: '转账成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: res.message,
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
.transfer {
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
      width: 350px;
      span {
        text-align: right;
        padding-right: 5px;
        width: 40%;
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
