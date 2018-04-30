<template>
  <el-col :span="18" class="right-component">
    <h4 class="welcome">尊敬的 {{clientInfo.clientName}} ，您好！</h4>
    <ul class="holders">

      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item label="交易号">
            <el-input v-model="filters.transId" placeholder="交易号"></el-input>
          </el-form-item>
          <el-form-item label="交易类型">
            <el-select v-model="filters.transType" placeholder="请选择">
              <el-option label="全部" value=""/>
              <el-option label="申购" value="申购"/>
              <el-option label="赎回" value="赎回"/>
              <el-option label="存款" value="存款"/>
              <el-option label="取款" value="取款"/>
              <el-option label="转出" value="转出"/>
              <el-option label="转入" value="转入"/>
            </el-select>
          </el-form-item>
          <el-form-item label="对方账号">
            <el-input v-model="filters.targetId" placeholder="对方账号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="groupSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <h4>
        您的交易记录：
      </h4>
      <el-table
      :data="records"
      style="width: 100%"
      >
        <el-table-column
          prop="transId"
          label="交易号"
          width="120"
          sortable
          align="center"
        />
        <el-table-column
          prop="targetId"
          label="目标账户"
          sortable
          align="center"
        />
        <el-table-column
          prop="transPrice"
          label="交易金额"
          align="center"
          :formatter="amountFormatter"
          sortable
        />
        <el-table-column
          prop="transType"
          label="交易类型"
          width="120"
          sortable
          align="center"
        />
        <el-table-column
          prop="createDate"
          label="交易时间"
          :formatter="dateFormatter"
        />
<!--         <el-table-column label="操作">
          <template scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleDetail(scope.$index, scope.row)"
            >
            查看详情
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          :current-page="currentPage"
          :total="total"
          style="float:right;">
        </el-pagination>
      </el-col>
    </ul>
  </el-col>
</template>

<script type="text/ecmascript-6">
import { get as getBillList } from '@/services/trans'
import { get as getClientInfo } from '@/services/info'
import storage from '@/utils/storage'

export default {
  data() {
    return {
      filters: {
        transId: '',
        transType: '',
        targetId: ''
      },
      clientInfo: {},
      records: [],
      currentPage: 1,
      pageSize: 5,
      total: 5
    }
  },
  methods: {
    groupSearch() {
      this.getTransRecord(this.currentPage)
    },
    async getTransRecord(pageNo = 1) {
      const clientId = storage.getSession('clientId')
      const token = storage.getSession('token')
      const res = await getBillList({
        pageNo,
        transId: this.filters.transId,
        transType: this.filters.transType,
        clientId,
        targetId: this.filters.targetId,
        token
      })
      if (res.resultcode === 0 ) {
        this.records = res.data.listHelper
        this.total = res.data.total
      } else {
        this.$meesage({
          message: res.message,
          type: 'error'
        })
      }
    },
    dateFormatter(row, column) {
      if (row.createDate)
        return row.createDate.slice(0, 10)
      else
        return row.createDate
    },
    amountFormatter(row, column) {
      if (row.transPrice)
        return row.transPrice.toFixed(2) + ' 元'
      else
        return row.transPrice
    },
    handleDetail(index, row) {
      this.$router.push({ name: 'holdingInfo', params: {
        id: row.HID
      }})
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getTransRecord(this.currentPage)
    },
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
    }
  },
  mounted() {
    this.getInfo()
    this.getTransRecord()
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
}
</style>
