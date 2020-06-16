<template>
  <div class="user-set-main">
    <div class="box">
      <!-- <i class="fa fa-user-circle-o" aria-hidden="true"></i> -->
      <!-- <div class="row" style="margin-top: 20px">
        <div class="label">单位名称：</div>
        <div class="inp-box">
          <el-input class="inp" v-model="departmentName"  disabled />
        </div>
      </div>
      <div class="row" style="margin-top: 20px">
        <div class="label">区域：</div>
        <div class="inp-box">
          <el-input class="inp" v-model="phone"  disabled />
        </div>
      </div>
      <div class="row" style="margin-top: 20px">
        <div class="label">详细地址：</div>
        <div class="inp-box">
          <el-input class="inp" v-model="phone"  disabled />
        </div>
      </div> -->
      <div class="row" style="margin-top: 20px">
        <div class="label">角色：</div>
        <div class="inp-box">
          <el-input class="inp" v-model="roleName"  disabled />
        </div>
      </div>
      <div class="row" style="margin-top: 20px">
        <div class="label">账号：</div>
        <div class="inp-box">
          <el-input class="inp" v-model="userName"  disabled />
        </div>
      </div>
      <!-- <div class="row">
        <div class="label">登录密码：</div>
        <div class="inp-box">
          <el-input class="inp" v-model="password" type="password"  disabled />
          <el-button class="edit" type="text" @click="onEditPassword">修改</el-button>
        </div>
      </div> -->
      <div class="row" style="margin-top: 20px">
        <div class="label">姓名：</div>
        <div class="inp-box">
          <el-input class="inp" v-model="realName"  disabled />
        </div>
      </div>
      <div class="row" style="margin-top: 20px">
        <div class="label">手机号码：</div>
        <div class="inp-box">
          <el-input class="inp" v-model="phoneNo"  disabled />
        </div>
      </div>
      <div class="row" style="margin-top: 20px">
        <div class="label">添加时间：</div>
        <div class="inp-box">
          <el-input class="inp" v-model="createTime"  disabled />
        </div>
      </div>
      <div class="row" style="margin-top: 20px">
        <div class="label">状态：</div>
        <div class="inp-box">
          <el-input class="inp" v-model="isDisabled"  disabled />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      roleName: '',
      userName: '',
      realName: '',
      phoneNo: '',
      createTime: '',
      isDisabled: '',
      phone: "",
      password: 12345678
    };
  },
  activated() {
    console.log("user-set-main created!!");
    this.getUserInfo();
  },
  methods: {
    getUserInfo(){
      let userInfo = this.cache.get('userInfo');
      this.get('/user/detail/' + userInfo.userId).then(data => {
        console.log(data);
        this.roleName = data.roleName;
        this.userName = data.userName;
        this.realName = data.realName;
        this.phoneNo = data.phoneNo;
        this.createTime = data.createTime;
        this.isDisabled = ['禁用', '启用'][data.isDisabled];
      })
    },
    onEditPassword() {
      this.$router.push("/main/userSet/password");
    }
  }
};
</script>
<style lang="scss">
.user-set-main {
  .box {
    position: absolute;
    top: 30%;
    left: 50%;
    margin-top: -250px;
    margin-left: -150px;
    width: 300px;
    height: 500px;
    text-align: center;
    overflow-x: visible;
    overflow-y: visible;

    .fa-user-circle-o {
      font-size: 160px;
      color: #666;
    }
  }

  .row {
    position: relative;
    height: 50px;
    line-height: 50px;

    .label {
      position: absolute;
      top: 0;
      left: -80px;
      width: 80px;
      font-size: 14px;
      color: #666;
      text-align: right;
    }

    .inp-box {
      position: relative;
      height: 100%;

      .el-input__inner {
        padding-right: 50px;
      }

      .edit {
        position: absolute;
        top: 5px;
        right: 8px;
      }
    }
  }
}
</style>


