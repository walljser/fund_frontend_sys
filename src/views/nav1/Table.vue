<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="基金名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getFunds">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">基金上市</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="funds" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="fundNo" label="基金号" width="110" sortable>
			</el-table-column>
			<el-table-column prop="fundName" label="基金名" width="180" sortable>
			</el-table-column>
			<el-table-column prop="fundPrice" label="买入价(元/份)" width="160" sortable>
			</el-table-column>
			<el-table-column prop="fundStatus" label="基金状态" width="140" sortable>
			</el-table-column>
			<el-table-column prop="fundCreateDate" label="成立时间" width="150" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="基金名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="基金状态">
          <!-- <el-radio class="radio" v-model="editForm.status" label="已上市">已上市</el-radio> -->
					<el-radio-group v-model="editForm.status">
						<el-radio class="radio" label="已上市">上市</el-radio>
						<el-radio class="radio" label="未上市">未上市</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="价格">
					<el-input-number v-model="editForm.price" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="成立时间">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.date" disabled></el-date-picker>
				</el-form-item>
				<el-form-item label="描述">
					<el-input type="textarea" v-model="editForm.desc"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="添加基金" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="基金名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
<!-- 				<el-form-item label="基金状态">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">上市</el-radio>
						<el-radio class="radio" :label="0">未上市</el-radio>
					</el-radio-group>
				</el-form-item> -->
				<el-form-item label="价格">
					<el-input-number v-model="addForm.price" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.date"></el-date-picker>
				</el-form-item>
				<el-form-item label="描述">
					<el-input type="textarea" v-model="addForm.desc"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import util from '../../common/js/util'
import storage from '@/utils/storage'
import axios from 'axios'
import {
  add as addFund,
  get as getFund,
  remove as removeFund,
  update as updateFund,
  batchRemove as batchRemoveFund
} from '@/services/fund'

export default {
  data() {
    return {
      filters: {
        name: ''
      },
      funds: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{
          required: true,
          message: '请输入基金名',
          trigger: 'blur'
        }]
      },
      //编辑界面数据
      editForm: {
        id: 0,
        name: '',
        status: -1,
        price: 0,
        date: '',
        desc: ''
      },
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{
          required: true,
          message: '请输入基金名',
          trigger: 'blur'
        }]
      },
      //新增界面数据
      addForm: {
        name: '',
        status: -1,
        price: 0,
        date: '',
        desc: ''
      }

    }
  },
  methods: {
    //性别显示转换
    formatSex: function(row, column) {
      return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getFunds();
    },
    //获取用户列表
    async getFunds() {
      this.listLoading = false
      const token = storage.getSession('token')
      const res = await getFund(token)
      this.funds = res.data.FundList
    },
    //删除
    handleDel: function(index, row) {
      const fundNo = row.fundNo
      const token = storage.getSession('token')
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(async () => {
        this.listLoading = true
        const res = await removeFund(fundNo, token)
        if (res.resultcode === 0) {
          this.listLoading = false
          this.$message({
            message: '刪除成功',
            type: 'success'
          })
          this.getFunds()
        }
      }).catch(() => {

      });
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      const {
        fundNo,
        fundName,
        fundPrice,
        fundStatus,
        fundDescribe,
        fundCreateDate
      } = row

      var a = {
        c,
        d,
        b,
        e
      }
      this.editForm.id = fundNo
      this.editForm.name = fundName
      this.editForm.status = fundStatus
      this.editForm.price = fundPrice
      this.editForm.desc = fundDescribe
      this.editForm.date = fundCreateDate
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true
      this.addForm = {
        name: '',
        price: 0,
        date: '',
        desc: ''
      };
    },
    //编辑
    editSubmit: function() {
      const token = storage.getSession('token')
      this.$confirm('确认提交吗？', '提示', {}).then(async () => {
        this.editLoading = true;
        const res = await updateFund(this.editForm, token)
        if (res.resultcode === 0) {
          this.editLoading = false
          this.editFormVisible = false
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.getFunds()
        }
      }).catch(() => {

      })
    },
    //新增
    async addSubmit() {
      const token = storage.getSession('token')
      try {
        await this.$confirm('确认添加基金吗？', '提示', {})
        this.addLoading = true
        const res = await addFund(this.addForm, token)
        this.addLoading = false
        if (res.resultcode === 0) {
          this.$message('添加基金成功！')
          this.addFormVisible = false
          this.getFunds()
        } else if (res.resultcode === -1 && res.message === '基金名已经存在') {
          this.$message(res.message)
        } else if (res.resultcode === -1 && res.message === '您的token不合法或者过期了，请重新登陆') {
          this.$message('登录已过期，请重新登录，谢谢！')
          storage.removeSession('userNo')
          storage.removeSession('token')
          this.$router.push({
            path: 'login'
          })
        }
      } catch (error) {
        // console.log(error)
      }
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    //批量删除
    batchRemove: function() {
      const token = storage.getSession('token')
      var ids = this.sels.map(item => item.fundNo).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(async () => {
        this.listLoading = true;
        const res = await batchRemoveFund(ids, token)
        if (res.resultcode === 0) {
          this.listLoading = false
          this.$message({
            message: '刪除成功',
            type: 'success'
          })
        }
        this.getFunds()
      }).catch(() => {

      });
      this.getFunds()
    }
  },
  mounted() {
    this.getFunds()
  }
}
</script>

<style scoped>

</style>
