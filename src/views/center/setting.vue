<template>
  <el-col :span="18" class="right-component">
    <h4 class="welcome">尊敬的 {{clientInfo.clientName}} ，您好！</h4>
    <div class="setting-body">
      <h3>个人信息设置</h3>
      <el-form ref="clientInfo" :rules="rules" :model="clientInfo" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
        <el-form-item label="账号">
          {{clientInfo.clientId | idFilter}}
        </el-form-item>
        <el-form-item label="姓名" prop="clientName">
          <el-input v-model="clientInfo.clientName"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="clientInfo.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="clientInfo.phone"></el-input>
        </el-form-item>
        <el-form-item label="家庭住址" prop="address">
          <el-input v-model="clientInfo.address"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native.prevent="updateInfo('clientInfo')">立即修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-col>
</template>

<script type="text/ecmascript-6">
import { get as getClientInfo, update as updateClientInfo } from '@/services/info'
import storage from '@/utils/storage'

export default {
  data() {
    var validateName = (rule, value, callback) => {
      if (value.length > 10) {
        callback(new Error('名字必须在十个字以内'))
      } else {
        callback()
      }
    }
    var validatePhone = (rule, value, callback) => {
      value = value.toString().split("")
      if (value.length !== 11) {
        callback(new Error('请输入正确的手机号码'))
      } else if(value[0] !== "1") {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    return {
      clientInfo: {},
      updateForm: {
        name: '',
        address: '',
        sex: '',
        phone: ''
      },
      rules: {
        clientName: [{
          required: true,
          message: '请输入姓名',
          trigger: 'blur'
        }, {
          validator: validateName,
          trigger: 'blur'
        }],
        sex: [{
          required: true,
          message: '请选择性别',
          trigger: 'blur'
        }],
        address: [{
          required: true,
          message: '请输入家庭住址',
          trigger: 'blur'
        }],
        phone: [{
          required: true,
          message: '请输入手机号码',
          trigger: 'blur'
        }, {
          validator: validatePhone,
          trigger: 'blur'
        }]
      }
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
    async updateInfo(formName) {
      const token = storage.getSession('token')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否确认修改个人信息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            const res = await updateClientInfo(this.clientInfo, token)
            if (res.resultcode === 0) {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
            } else {
              this.$message({
                type: 'success',
                message: res.message
              })

            }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消修改'
            })
          })
        }
      })

    }
  },
  mounted() {
    this.getInfo()
  },
  filters: {
    idFilter(value) {
      if (value)
        return value.slice(0,6) + '********' + value.slice(14, 18)
      else
        return value
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/_vars.scss';

.setting {
  &-body {
    background-color: #fff;
    padding-bottom: 30px;
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
li {
  padding: 20px;
  height: 60px;
  line-height: 60px;
  background-color: #fff;
  text-align: center;
  // & + li {
  //   border-top: 1px solid $border-color;
  // }
}
.left {
  float: left;
  font-size: 18px;
}
</style>
