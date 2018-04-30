<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">
      <img src="../../assets/image/logo.png" alt="" class="logo">
      建行官方理财平台
    </h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button type="danger" style="width:100%;" @click.native.prevent="register">注册</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
import axios from 'axios'
import storage from '@/utils/storage'
import { get as doLogin } from '@/services/user'
//import NProgress from 'nprogress'
export default {
  data() {
    return {
      logining: false,
      ruleForm2: {
        account: '510183199508161231',
        checkPass: '111111'
      },
      rules2: {
        account: [{
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          },
          //{ validator: validaePass }
        ],
        checkPass: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          //{ validator: validaePass2 }
        ]
      },
      checked: true
    };
  },
  methods: {
    handleReset2() {
      this.$refs.ruleForm2.resetFields();
    },
    async handleSubmit2(ev) {
      this.logining = true
      const res = await doLogin(this.ruleForm2.account, this.ruleForm2.checkPass)
      if (res.resultcode === 0) {
        const {
          token,
          ClientId
        } = res.data
        this.$store.dispatch('SIGNIN_ACTION', clientId, token)
        // this.$store.commit('RECORD_CLIENT', ClientId)
        // this.$store.commit('RECORD_TOKEN', token)
        this.logining = false
        this.$message({
          message: '登陆成功',
          type: 'success'
        })
        this.$router.push({ name: 'home' })
      } else {
        this.$message(res.message)
      }
    },
    register() {
      this.$router.push({ name: 'signup' })
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
  margin: 100px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  .remember {
    margin: 0px 0px 35px 0px;
  }
}
.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
  height: 32px;
  line-height: 32px;
  display: flex;
  // img {
  //   margin-left: 100px;
  //   height: 30px;
  //   margin-right: 5px;
  //   display: block;
  // }
}
</style>
