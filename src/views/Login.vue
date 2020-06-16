<template>
  <div class="login">
    <div class="box">
      <div class="box_header">
        <img src="../assets/top_logo @3x.png" alt class="box_header-bg" />
      </div>
      <div class="box_content">
        <el-form :inline="true" :model="form" class="login_sub-form">
          <div class="form-box">
            <el-form-item>
              <span class="form-box—line">|</span>
              <el-input
                @keyup.enter.native="onSubmit"
                v-model="form.account"
                :autofocus="true"
                placeholder="请输入账号"
                class="login_form-account"
              >
                <img slot="prefix" class="input__icon" src="../assets/dl_yhm@2x.png" />
              </el-input>
            </el-form-item>
            <el-form-item>
              <span class="form-box—line">|</span>
              <el-input
                class="login_form-password"
                type="password"
                @keyup.enter.native="onSubmit"
                v-model="form.password"
                placeholder="请输入登录密码"
              >
                <img slot="prefix" class="input__icon" src="../assets/dl_srmm@2x.png" />
              </el-input>
            </el-form-item>
            <el-button class="login-but" type="text" @click="onSubmit">登录</el-button>
            <el-alert
              v-if="isShowFormAlt"
              class="login-alert"
              title="请输入正确的账号密码"
              style="position:relative;top: 20px;"
              type="error"
              show-icon
              :closable="false"
            ></el-alert>
          </div>
        </el-form>
      </div>
      <!-- <div class="des">
        <i class="fa fa-info-circle"></i>说明：首次登陆需要编辑初始密码
      </div>-->
    </div>

    <footer class="footer">
      <span>Copyright © www.wavewisdom.com, All Rights Reserved.</span>
      <br />
      <span>Email : business@wavewisdom.com</span>
      <br />
      <span>Version : 1.0.0</span>
    </footer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        account: "",
        password: ""
      },
      isShowFormAlt: false
    };
  },
  created() {
    console.log("login created!");
  },
  methods: {
    onSubmit() {
      if (!this.form.account || !this.form.password) {
        return (this.isShowFormAlt = true);
      }
      let dto = {
        userName: this.form.account,
        password: this.form.password
      };
      this.isShowFormAlt = false;

      this.post("/session/login", dto, {
        isUseResponse: true,
        isUnToken: true
      }).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: "登录成功",
            type: "success"
          });
          res.data.data.account = dto.userName;
          this.cache.set("userInfo", res.data.data);
          this.cache.setLS("userInfo", res.data.data);
          this.cache.setLS("token", res.data.data.accessToken);
          this.$store.commit("setLoginFalg", 1);
          this.$router.push("/main/record/list");
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    }
  }
};
</script>
<style lang="scss">
.login {
  position: relative;
  height: 100%;
  //   background: #42c5d9;
  background: url("../assets/login_bk.jpg") no-repeat 100% 100% currentColor;
  background-size: 100% 100%;

  .box {
    height: 511px;
    width: 606px;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    background: rgba(255, 255, 255, 1);
    border-radius: 20px;
    // background: url("../assets/dl_bjico@2x.png") no-repeat;
    background-size: cover;
    .box_header {
      text-align: center;
      height: 170px;
      .box_header-logo {
        width: 415px;
        height: 170px;
      }
      .box_header-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 606px;
        height: 189px;
      }
    }
    .box_content {
      .form-box {
        padding-top: 50px;
        box-sizing: border-box;
        text-align: center;
      }
      .el-form-item {
        position: relative;
        margin: auto;
        margin-bottom: 30px;
        width: 70%;
        height: 70px;
        border-radius: 10px;
        border: 1px solid #d2d2d2;
        display: block;
        .el-form-item__content {
          width: 100%;
        }
        input {
          border: 0;
          position: relative;
          left: -45px;
          top: 4px;
          width: 230px;
          height: 60px;
          font-size: 18px;
        }
        img {
          width: 21px;
          height: 22px;
        }
        .form-box—line {
          position: absolute;
          font-size: 24px;
          left: 57px;
          z-index: 11;
          color: #bfbfbf;
          top: 12px;
        }
        .el-input__prefix {
          top: 20px;
          left: 20px;
          img {
            width: 24px;
            height: 26px;
          }
        }
      }
      .login-but {
        width: 70% !important;
        margin: auto;
        background: rgba(31, 72, 177, 1) !important;
        color: #fff !important;
        font-size: 28px !important;
        text-align: center !important;
        border-radius: 10px;
      }
      .login-but:hover {
        background: #0637b5 !important;
      }
    }
  }

  .footer {
    // background: url("../assets/u_dbj@2x.png") no-repeat;
    position: absolute;
    padding: 50px 0;
    bottom: 20px;
    left: 0;
    width: 100%;
    height: 93px;
    box-sizing: border-box;
    font-size: 14px;
    text-align: center;
    color: #999;
    background-size: cover;
  }
  .login-alert {
    width: 90%;
    margin: 0 auto;
    background-color: #dadada !important;
    color: #ff1616 !important;
  }

  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px white inset;
  }
}
</style>