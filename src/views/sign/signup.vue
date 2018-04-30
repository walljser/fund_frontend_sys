<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="100px" class="demo-ruleForm login-container">
      <h3 class="title">用户注册</h3>
      <el-form-item label="身份证号" prop="account">
        <el-input v-model="ruleForm.account"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="ruleForm.sex">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="ruleForm.address"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model.number="ruleForm.phone" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item
        prop="email"
        label="邮箱号"
        :rules="[
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
        ]"
      >
        <el-input v-model="ruleForm.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native.prevent="check('ruleForm')">获取验证码</el-button>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-input v-model="ruleForm5.code"></el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="register('ruleForm')">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
import storage from '@/utils/storage'
import {
  get as doLogin,
  check as checkEmail,
  create as doRegist
} from '@/services/user'
export default {
  data() {
    var validateAccount = (rule, value, callback) => {
      var reg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if(reg.test(value) === false)
      {
        callback(new Error("请输入正确的身份证号码！"))
      }
      else {
        callback()
      }
    }
    var validatePass1 = (rule, value, callback) => {
      if (value.length < 6 || value.length > 12) {
        callback(new Error('密码长度必须在6~12个字符之间'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
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
      logining: false,
      ruleForm: {
        account: '',
        name: '',
        pass: '',
        checkPass: '',
        email: '',
        sex: '男',
        phone: '',
        address: ''
      },
      ruleForm5: {
        code: ''
      },
      rules: {
        account: [{
            required: true,
            message: '请输入身份证号码',
            trigger: 'blur'
          },
          { validator: validateAccount, trigger: 'blur' }
        ],
        name: [{
          required: true, message: '请输入姓名', trigger: 'blur'
        }, {
          validator: validateName, trigger: 'blur'
        }],
        pass: [{
          required: true,
          message: '密码不能为空'
        }, {
          validator: validatePass1, trigger: 'blur'
        }],
        address: [{
          required: true,
          message: '地址不能为空'
        }],
        checkPass: [{
          required: true,
          message: '密码不能为空'
        }, {
          validator: validatePass2, trigger: 'blur'
        }],
        sex: [{
          required: true, trigger: 'blur'
        }],
        phone: [{
          required: true,
          message: '手机号码不能为空'
        }, {
          type: 'number',
          message: '手机号码必须是数字',
        }, {
          validator: validatePhone,
          trigger: 'blur'
        }]
      },
      checked: true
    }
  },
  methods: {
    register(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.ruleForm5.code === '') {
            this.$message({
              message: '请输入验证码',
              type: 'error'
            })
          } else {
            const res = await doRegist(this.ruleForm, this.ruleForm5.code)
            if (res.resultcode === 0) {
              const response = await doLogin(this.ruleForm.account, this.ruleForm.pass)
              const clientId = response.data.ClientId
              const token = response.data.token
              storage.setSession('clientId', clientId)
              storage.setSession('token', token)
              this.$message({
                message: '注册并登录成功',
                type: 'success'
              })
              this.$router.push({ name: 'home' })
            } else if (res.resultcode === -1) {
              this.$message({
                message: res.message,
                type: 'error'
              })
            }
          }
        }
      });
    },
    async check(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await checkEmail(this.ruleForm.name, this.ruleForm.email)
          if (res.resultcode === 0) {
            this.$message({
              message: '验证码发送成功，请到您的邮箱中查看验证码',
              type: 'success'
            })
          } else {
            this.$message({
              message: '发生未知错误，获取失败，请稍后再试',
              type: 'error'
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 50px auto;
    width: 450px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>
