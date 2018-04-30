<template>
  <section class="fund-list" v-if="listShow">
    <div class="left">
      <div class="left-title">
        {{typeObj.fundTypeName}}
      </div>
      <div class="left-desc">
        {{typeObj.fundTypeDescribe}}
      </div>
    </div>
    <div class="right">
      <el-table
        :data="funds"
        style="width: 100%"
        row-class-name="ele-row-style"
        stripe
      >
        <el-table-column
          prop="fundName"
          label="基金名称"
          width="230"
          rol-class-name="ele-row-style"
        />
        <el-table-column
          prop="rate"
          label="年转化率"
          width="150"
          :formatter="formatRate"
          sortable
        />
        <el-table-column
          prop="fundPrice"
          label="万元收益"
          align="right"
          :formatter="formatPrice"
          width="200"
          sortable
        />
        <el-table-column align="center">
          <template scope="scope">
            <button class="bt-primary" @click="fundDetail(scope.$index, scope.row)">申购基金</button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="total">
      </el-pagination>
      <button class="bt-primary change" @click="changeRate">
        模拟利率变化
      </button>
    </div>
  </section>
</template>

<script type="text/ecmascript-6">
import { get as getFundList, rateChanges as changeRateRecord } from '@/services/funds'
export default {
  props: {
    typeObj: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      funds: [],
      currentPage: 1,
      total: 5,
      pageSize: 4,
      listShow: false
    }
  },
  async created() {
    this.getFunds()
  },
  methods: {
  // const {
  //   fundId,
  //   fundName,
  //   status,
  //   typeId,
  //   currentPage
  // }
    async getFunds(pageNo = 1) {
      const res = await getFundList({
        typeId: this.typeObj.fundTypeId,
        status: '已上市',
        currentPage: pageNo
      })
      if (res.resultcode === 0) {
        this.funds = res.data.listHelper
        if (this.funds.length > 0) {
          this.listShow = true
        }
        this.total = res.data.total
      }
    },
    formatRate: function(row, column) {
      let rate = (row.rate * 100).toFixed(4)
      return rate + ' %'
    },
    formatPrice: function(row, column) {
      return (row.rate * 10000 / 365).toFixed(4)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getFunds(this.currentPage)
    },
    fundDetail(index, row) {
      this.$router.push({ name: 'fundInfo', params: {
        id: row.fundNo
      }})
    },
    async changeRate() {
      const res = await changeRateRecord()
      if (res.resultcode === 0) {
        this.getFunds(this.currentPage)
        this.$message({
          message: '利率变化成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '服务器错误，利率变化失败',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-pagination {
  position: absolute;
  right: 65px;
  bottom: 10px;
}
.right {
  position: relative
}
// .right {
//   position: relative;
// }
// button ~ button{
//   position: absolute;
//   top: 180px;
//   left: 0;
// }
//   .btn-next {
//     position: absolute;
//     top: 180px;
//     right: 0;
//   }
// }
</style>

<style lang="scss">
@import '~@/assets/scss/_vars';


.fund-list {
  display: flex;
  margin-top: 20px;
  .left {
    background-color: $primary;
    flex: 0 0 20%;
    height: 405px;
    margin-right: 10px;
    color: #fff;
    text-align: center;
    &-rate {
      background-color: $red;
      margin-top: 10px;
      border-radius: 1%;
      height: 511px;
    }
    &-title {
      display: inline-block;
      font-size: 28px;
      width: 80px;
      margin-top: 30px;
      font-weight: bold;
      line-height: 40px;
    }
    &-desc {
      margin-top: 20px;
      color: #cccccc;
    }
  }
  .right {
    overflow: hidden;
    flex: 0 0 80%;
    display: flex;
    position: relative;
    .change {
      position: absolute;
      right: 20px;
      top: 0;
    }
  }
}
.bt-primary {
  width: 120px;
  height: 40px;
  background-color: #fff;
  color: $primary;
  border: 1px solid $primary;
  outline: none;
  &:hover {
    background-color: $primary;
    color: #fff;
  }
}
</style>
