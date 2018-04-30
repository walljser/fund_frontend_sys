<template>
  <div>
    <header>
      <el-menu theme="primary" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <div class="page-icon">
          <img src="../assets/image/logo.png" class="logo" alt="">
          <span style="margin-left: 35px">
            <span class="name">建财宝</span> | 建行官方理财平台
          </span>
        </div>
        <el-menu-item
          index="2"
          v-if="!logined"
          @click.native.prevent="signup"
        >注册</el-menu-item>
        <el-menu-item index="3" v-if="!logined" @click.native.prevent="signinDialog">登录</el-menu-item>
        <el-menu-item index="2" class="signout" v-if="logined" @click.native.prevent="signout">
          <i class="fa fa-sign-out" aria-hidden="true"></i>
        </el-menu-item>
        <el-menu-item index="3" v-if="logined" @click.native.prevent="goPage('userCenter')">用户中心</el-menu-item>
        <el-menu-item index="1" @click.native.prevent="goPage('home')">首页</el-menu-item>
      </el-menu>
    </header>
    <el-dialog
      v-model="signinVisible"
      :close-on-click-modal="false"
      :before-close="signinClose"
    >
      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
        <h3 class="title">
          <img src="../assets/image/logo.png" alt="" class="signin-logo">
          <span>建行官方理财平台</span>
        </h3>
        <el-form-item prop="account">
          <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-checkbox v-model="checked" class="remember">记住密码</el-checkbox>
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
          <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button type="danger" style="width:100%;" @click.native.prevent="register">注册</el-button>
          <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      v-model="signupVisible"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      :before-close="signupClose"
    >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="100px" class="demo-ruleForm login-container">
        <h3 class="title">
          <img src="../assets/image/logo.png" alt="" class="signin-logo">
          <span>用户注册</span>
        </h3>
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
          <el-button
            type="primary"
            disabled
            v-if="checking"
          >
            <timmer endTime="60s" @time-end="checking = false">
              后可以重新获取验证码
            </timmer>
          </el-button>
          <el-button
            type="primary"
            v-if="!checking"
            @click.native.prevent="check('ruleForm')"
          >获取验证码</el-button>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="ruleForm5.code"></el-input>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button
            type="primary"
            style="width:100%;"
            @click.native.prevent="handlerRegister('ruleForm')"
          >注册</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <router-view></router-view>
    <div class="patner">
      <img src="../assets/image/patner.png" alt="">
    </div>
    <faq/>
  </div>
</template>

<script type="text/ecmascript-6">
import faq from '@/components/faq'
import {
  get as doLogin,
  check as checkEmail,
  create as doRegist
} from '@/services/user'
import timmer from '@/components/timmer'
import { mapState } from 'vuex'
import storage from '@/utils/storage'
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
      checking: false,
      activeIndex: '1',
      ruleForm2: {
        account: '',
        checkPass: ''
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
      checked: false,
      signining: false,
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
          { validator: validateAccount }
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
          validator: validatePhone
        }]
      }
    }
  },
  computed: mapState([
    'signinVisible',
    'signupVisible',
    'logined'
  ]),
  methods: {
    goPage(pageName) {
      this.$router.push({ name: pageName })
    },
    handleSelect() {

    },
    signout() {
      const index = this.activeIndex
      this.$confirm('确定要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SIGN_OUT')
        this.$router.push({ name: 'home' })
        this.activeIndex = '1'
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
        this.activeIndex = index
      })
    },
    signinDialog() {
      if (this.$store.state.signinVisible === true) {
        this.$store.commit('CLOSE_SIGNIN')
      }
      else {
        this.$store.commit('OPEN_SIGNIN')
      }
    },
    signup() {
      this.checking = false
      this.$store.commit('OPEN_SIGNUP')
    },
    async handleSubmit2(ev) {
      this.logining = true
      const res = await doLogin(this.ruleForm2.account, this.ruleForm2.checkPass)
      if (res.resultcode === 0) {
        const {
          token,
          ClientId
        } = res.data
        this.$store.commit('RECORD_CLIENT', ClientId)
        this.$store.commit('RECORD_TOKEN', token)
        this.$store.commit('CLOSE_SIGNIN')
        this.logining = false
        this.$message({
          message: '登陆成功',
          type: 'success'
        })
        if (this.checked === true) {
          storage.setLocal('fundsys_account', this.ruleForm2.account)
          storage.setLocal('fundsys_pass', this.ruleForm2.checkPass)
        } else {
          storage.removeLocal('fundsys_account')
          storage.removeLocal('fundsys_pass')
        }
        this.$router.push({ name: 'home' })
        this.activeIndex = '1'
      } else {
        this.logining = false
        this.$message(res.message)
      }
    },
    register() {
      this.$store.commit('OPEN_SIGNUP')
    },
    signupClose() {
      this.$store.commit('CLOSE_SIGNUP')
    },
    signinClose() {
      this.$store.commit('CLOSE_SIGNIN')
    },
    fetchData () {
      let name = this.$route.path.split('')[1]
      if (name === 'userCenter')
        this.index = 3
      else
        this.index = 1
    },
    async check(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await checkEmail(this.ruleForm.name, this.ruleForm.email)
          if (res.resultcode === 0) {
            this.checking = true
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
    },
    handlerRegister(formName) {
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
              this.$message({
                message: '注册并登录成功',
                type: 'success'
              })
              this.$store.commit('CLOSE_SIGNUP')
              this.$store.commit('RECORD_CLIENT', clientId)
              this.$store.commit('RECORD_TOKEN', token)
              this.logined = true
              this.activeIndex = '1'
              this.$router.push({ name: 'home' })
            } else if (res.resultcode === -1) {
              this.$message({
                message: res.message,
                type: 'error'
              })
            }
          }
        }
      })
    }
  },
  created() {
    const account = storage.getLocal('fundsys_account')
    const password = storage.getLocal('fundsys_pass')
    if (account && password) {
      this.ruleForm2.account = account
      this.ruleForm2.checkPass = password
      this.checked = true
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'fetchData'
  },
  components: {
    faq,
    timmer
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/_vars.scss';
.logo {
  height: 30px;
  position: absolute;
  top: 14px;
}
.page-icon {
  float: left;
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  color: $page-icon-color;
  margin-left: 50px;
  .name {
    font-size: 20px;
    font-weight: 600;
  }
}
.el-menu {
  padding-right: 20px;
}
.el-menu-item {
  float: right;
  // &:nth-child(2) {
  //   margin-left: 780px;
  // }
}
.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
  height: 32px;
  line-height: 32px;
  display: flex;
  font-size: 20px;
  img {
    margin-left: 200px;
    height: 30px;
    margin-right: 5px;
    display: block;
  }
}
header {
  background-color: #FFF;
  border-bottom: 1px solid $border-color;
}
.patner {
  overflow: hidden;
  img {
    display: block;
    height: 100%;
    width: 100%;
  }
}
</style>

<style>

.ele-row-style {
  height: 60px;
  line-height: 60px;
}
.el-dialog--small {
  width: 40%;
}
.signin-dialog {
}
</style>
