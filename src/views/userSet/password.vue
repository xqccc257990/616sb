<template>
  <div class="user-set-password">
    <div class="box">
      <div class="row">
        <div class="label">用户名：</div>
        <div class="inp-box">
          <el-input class="inp" v-model="username" type="text" placeholder="请输入" :disabled="true" />
        </div>
      </div>
      <div class="row" v-if="roleType == '2'">
        <div class="label">原密码：</div>
        <div class="inp-box">
          <el-input class="inp" v-model="originPassword" type="password" placeholder="请输入原密码" />
        </div>
      </div>
      <div class="row">
        <div class="label">新密码：</div>
        <div class="inp-box">
          <el-input class="inp" v-model="newPassword" type="password" placeholder="请输入新密码" />
        </div>
      </div>
      <div class="row">
        <div class="label">确认密码：</div>
        <div class="inp-box">
          <el-input class="inp" v-model="password" type="password" placeholder="请再次输入新密码" />
        </div>
      </div>
      <div class="row">
        <div class="inp-box txt">密码必须最少包含字母、数字、1个大写字母、1个小写字母,长度8-16位</div>
      </div>
      <div class="row">
        <el-button class="submit" type="primary" @click="onSubmit">提交</el-button>
      </div>
      <div class="row">
        <el-button class="back" type="text" @click="onBack">返回登录页</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      username: "",
      newPassword: "",
      password: "",
      originPassword: "",
      roleType: "" // 角色类型
    };
  },
  activated() {
    console.log("user-set-main created!!");
    this.roleType = this.cache.get("userInfo")["roleType"];
    this.username = this.cache.get("userInfo")["account"];
  },
  methods: {
    onSubmit() {
      if (!this.validate()) {
        return;
      }
      var dto = {
        newPassword: this.newPassword
      };

      this.post("user/changePwd", dto, {
        isUseResponse: true
      }).then(res => {
        if (res.data.code == 0) {
          this.$router.push("/login");
          this.$message({
            message: "修改密码成功，自动返回登录页",
            type: "success"
          });
        }
      });
    },
    validate() {
      if (!this.username) {
        this.$message({
          message: "请输入正确的用户名",
          type: "warning"
        });
        return false;
      }
      var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
      if (this.roleType == "2" && !this.originPassword) {
        this.$message({
          message: "请输入原密码",
          type: "warning"
        });
        return false;
      }
      if (!this.newPassword) {
        this.$message({
          message: "请输入新密码",
          type: "warning"
        });
        return false;
      }
      if (!re.test(this.newPassword)) {
        this.$message({
          message: "新密码格式错误，请重新输入",
          type: "warning"
        });
        return false;
      }
      if (this.newPassword !== this.password) {
        this.$message({
          message: "两次密码输入不一致，请重新输入",
          type: "warning"
        });
        return false;
      }
      return true;
    },
    onBack() {
      this.$router.push("/login");
    }
  }
};
</script>
<style lang="scss">
.user-set-password {
  .box {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -250px;
    margin-left: -150px;
    width: 300px;
    height: 500px;
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

    .txt {
      line-height: 20px;
      font-size: 12px;
      color: #999999;
    }

    .submit {
      width: 230px;
    }

    .back {
      position: relative;
      top: -8px;
      left: 79px;
    }
  }
}
</style>


