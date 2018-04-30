<template>
  <section class="financial-page">
    <section class="container">
      <el-row>
      <el-col :span="6" class="left-component">
        <ul class="left-content">
<!--           <input class="file" name="file" type="file" accept="image/png,image/gif,image/jpeg" @change="update"/>
          <el-form v-model="fileData">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :data="form"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form> -->
          <router-link to="/userCenter/userInfo">
            <li :class="$route.name === 'userInfo'? 'active' : ''">资产信息</li>
          </router-link>
          <router-link to="/userCenter/transRecord">
            <li :class="$route.name === 'transRecord'? 'active' : ''">基金交易记录</li>
          </router-link>
          <router-link to="/userCenter/bill">
            <li :class="$route.name === 'bill'? 'active' : ''">账单</li>
          </router-link>
          <router-link to="/userCenter/recharge">
            <li :class="$route.name === 'recharge'? 'active' : ''">充值</li>
          </router-link>
          <router-link to="/userCenter/transfer">
            <li :class="$route.name === 'transfer'? 'active' : ''">转账</li>
          </router-link>
          <router-link to="/userCenter/withdraw">
            <li :class="$route.name === 'withdraw'? 'active' : ''">提现</li>
          </router-link>
          <router-link to="/userCenter/setting">
            <li :class="$route.name === 'setting'? 'active' : ''">个人信息</li>
          </router-link>
        </ul>
      </el-col>
      <router-view></router-view>
      </el-row>
    </section>
  </section>
</template>

<script type="text/ecmascript-6">
import axios from 'axios'
import storage from '@/utils/storage'
export default {
  data() {
      return {
        imageUrl: '',
        fileData: '',
        form: {}
      };
    },
    methods: {
      async handleAvatarSuccess(res, file) {
        const token = storage.getSession('token')
        const clientId = storage.getSession('clientId')
        this.imageUrl = URL.createObjectURL(file.raw)
        await axios.post('http://localhost:8080/FMS/client/upload.action', {
          params: {
            image: this.imageUrl,
            clientId,
            token
          }
        })
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      update(e) {
        let file = e.target.files[0];
        let d = new Date();
        let type = file.name.split('.');
        let tokenParem = {
          'putPolicy': '{\"name\":\"$(fname)\",\"size\":\"$(fsize)\",\"w\":\"$(imageInfo.width)\",\"h\":\"$(imageInfo.height)\",\"hash\":\"$(etag)\"}',
          'key': 'orderReview/' + d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.valueOf() + '.' + type[type.length - 1],
          'bucket': this.domain, //七牛的地址，这个是你自己配置的（变量）
        };
        let param = new FormData(); //创建form对象
        param.append('chunk', '0'); //断点传输
        param.append('chunks', '1');
        param.append('file', file, file.name)
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        this.uploading(param, config, file.name); //然后将参数上传七牛
      },
      uploading(param, config, pathName) {
        axios.post('http://localhost:8080/FMS/client/upload.action', param, config)
          .then(response => {
            let localArr = this.images.map((val, index, arr) => {
              return arr[index].localSrc;
            })
            if (!~localArr.indexOf(pathName)) {
              this.images.push({
                'src': this.showUrl + response.data.key,
                'localSrc': pathName
              });
            } else {
              alert('已上传该图片');
            }
          })
      }
    },
    watch: {
      file(val) {
        // console.log(val)
      }
    },
    created() {
      const clientId = storage.getSession('clientId')
      if (!clientId) {
        this.$router.push({ name: 'home'})
      }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/_vars.scss';

.financial {
  &-page {
    margin-top: 10px;
  }
}
.left-component {
  padding-right: 10px;
  padding-top: 36px;
  ul {
    padding-top: 40px;
    background-color: $gray;
    height: 500px;
  }
  li {
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 16px;
  }
  li.active {
    background-color: $html-bg-color;
    border-left: 2px solid $primary;
    color: $primary;
  }
}
</style>

<style>
.el-radio {
  font-size: 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
