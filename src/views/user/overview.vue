<template>
  <div class="device-detail">
    <app-header :title="'查看详情'" :isShowRefresh="false" :isShowBack="true"></app-header>
    <app-overview :list="detailList" title="用户信息"></app-overview>
    <div class="device-detail-img" @click="showImg">
      <img :src="img" alt />
      <div>证件头像</div>
    </div>
  </div>
</template>
<script>
import { debuglog } from "util";
import userLogo from "@/assets/user_logo.png";

export default {
  data() {
    let _this = this;
    return {
      activeName: "tab0",
      img: "",
      detailList: [
        {
          label: "编号",
          key: "workNo",
          value: ""
        },
        {
          label: "姓名",
          key: "name",
          value: ""
        },
        {
          label: "身份证",
          key: "idCard",
          value: ""
        },
        {
          label: "IC卡",
          key: "icNo",
          value: ""
        },
        {
          label: "手机号",
          key: "phoneNo",
          value: ""
        },
        {
          label: "部门",
          key: "departmentName",
          value: ""
        },
        {
          label: "性别",
          key: "genderStr",
          value: ""
        },
        {
          label: "身份证地址（省-市）",
          key: "address",
          value: ""
        },
        // {
        //   label: "用户类型",
        //   key: "status",
        //   value: ""
        // },
        {
          label: "用户添加日期",
          key: "createTime",
          value: ""
        },
        {
          label: "照片状态",
          key: "picStateStr",
          value: ""
        }
      ]
    };
  },
  activated() {
    console.log("device-detail created!!");
    this.userId = this.$route.params.id || "";
    this.getUserDetail();
  },
  methods: {
    // 获取关联用户详情
    getUserDetail() {
      this.get("/employee/detail/" + this.$route.params.id).then(res => {
        res.genderStr = ["男", "女"][res.gender - 1];
        // res.status = res.status
        //   ? ["普通用户", "黑名单", "白名单"][res.status]
        //   : "普通用户";
        res.typeStr = ["身份证", "IC卡"][res.type - 1];
        res.picStateStr = ["照片不可用", "照片可用"][res.picState];

        if (res.picUrl) {
          this.img = this.BASE_URL + res.picUrl;
        } else {
          this.img = userLogo;
          console.log("   this.img =", this.img);
        }
        this.detailList.forEach(item => {
          item["value"] = res[item.key];
        });
      });
    },

    showImg() {
      this.$alert(`<img src="${this.img}">`, "查看头像", {
        dangerouslyUseHTMLString: true,
        callback: action => {}
      });
    }
  }
};
</script>
<style lang="scss">
.device-detail {
  .el-tabs {
    margin: 0 auto;
    margin-top: 10px;
    max-width: 900px;
  }
}
.shenfen {
  margin-right: 81px;
  margin-left: 99px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
  cursor: pointer;
}

.row-nav {
  cursor: pointer;
  color: #409eff;
}
.device-detail_idcardWarrper {
  display: flex;
  justify-content: space-around;
}
.device-detail_idcard span {
  margin-top: 7px;
  display: block;
  text-align: center;
}
.device-detail .el-tabs--top {
  width: 100%;
  max-width: 100%;
}
.device-detail-img {
  width: 50%;
  text-align: center;
  //   margin: 0 auto;
  padding: 20px;
  cursor: pointer;
  img {
    border: 1px solid #eee;
    padding: 20px;
    width: 200px;
    margin-bottom: 20px;
  }
}
.el-message-box {
  width: 70vh;
  p {
    width: 100%;
  }
  img {
    width: 100%;
  }
}
</style>


