<template>
  <div class="device-detail">
    <app-header :title="'查看详情'" :isShowRefresh="false" :isShowBack="true"></app-header>
    <div class="certificates_face-warrper"></div>
    <div class="overview-warrper">
      <app-overview :list="detailList" title="用户信息"></app-overview>
      <div class="certificates_face">
        <img :src="img" alt @click="showImg(img)" />
        <div>证件头像</div>
      </div>
    </div>
    <div class="overview-warrper">
      <app-overview :list="detailLists" title="通行信息"></app-overview>
      <div class="certificates_face">
        <img :src="recordImg" alt @click="showImg(recordImg)" />
        <div>通行照片</div>
      </div>
    </div>
    <app-overview :list="deviceLists" title="关联设备信息"></app-overview>
  </div>
</template>
<script>
import { debuglog } from "util";
export default {
  data() {
    let _this = this;
    return {
      activeName: "tab0",
      img: "",
      recordImg: "",
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
          label: "身份证号",
          key: "idCode",
          value: ""
        },
        {
          label: "IC卡号",
          key: "cardNo",
          value: ""
        },
        {
          label: "手机号码",
          key: "phoneNo",
          value: ""
        },
        {
          label: "性别",
          key: "gender",
          value: ""
        },
        {
          label: "区域地址（省-市）",
          key: "address",
          value: ""
        },
        {
          label: "用户类别",
          key: "employeeType",
          value: ""
        },
        {
          label: "部门",
          key: "departmentName",
          value: ""
        },
        {
          label: "用户添加日期",
          key: "createTime",
          value: ""
        }
      ],
      detailLists: [
        {
          label: "体温",
          key: "temperature",
          value: ""
        },
        {
          label: "是否戴口罩",
          key: "isMasks",
          value: ""
        },
        {
          label: "通行时间",
          key: "passTime",
          value: ""
        },
        {
          label: "验证结果",
          key: "resultDesc",
          value: ""
        }
      ],
      deviceLists: [
        {
          label: "设备名称",
          key: "deviceName",
          value: ""
        },
        {
          label: "设备型号",
          key: "deviceModel",
          value: ""
        },
        {
          label: "设备SN",
          key: "deviceSerialNumber",
          value: ""
        },
        {
          label: "安装位置",
          key: "deviceLocation",
          value: ""
        }
      ]
    };
  },
  activated() {
    console.log("device-detail created!!");
    this.img = "";
    this.recordImg = "";
    this.userId = this.$route.params.id || "";
    this.getUserDetail();
  },
  methods: {
    showImg(url) {
      this.$alert(`<img src="${url}">`, "查看图片", {
        dangerouslyUseHTMLString: true,
        callback: action => {}
      });
    },
    // 获取关联用户详情
    getUserDetail() {
      this.get("/identifyRecord/detail/" + this.$route.params.id).then(res => {
        //   this.get("/identifyRecord/detail/" + "1245323494523146242").then(res => {
        res.genderStr = ["男", "女"][res.gender - 1];
        res.type = res.type
          ? ["普通用户", "黑名单", "白名单"][res.type]
          : "普通用户";
        res.isMasks = ["--", "是"][res.isMasks];
        this.img = this.BASE_URL + res.cardHeadUrl;
        res.name = res.name ? res.name : "匿名";
        res.address = res.address ? res.address : "--";

        this.recordImg = this.BASE_URL + res.authPicUrl;
        this.detailList.forEach(item => {
          item["value"] = res[item.key];
        });
        this.detailLists.forEach(item => {
          item["value"] = res[item.key];
        });
        this.deviceLists.forEach(item => {
          item["value"] = res[item.key];
        });
      });
    }
  }
};
</script>
<style lang="scss">
.el-dialog {
  margin: 0 !important;
  width: 100% !important;
  height: 100% !important;
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
.device-detail {
  min-width: 900px;
  .el-tabs {
    margin: 0 auto;
    margin-top: 10px;
    max-width: 900px;
  }
  .overview-warrper {
    overflow: hidden;
  }
  .certificates_face-warrper {
    overflow: hidden;
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
.app-overview {
  width: 60%;
  float: left;
}
.certificates_face {
  width: 300px;
  height: 200px;
  margin-left: 30px;
  text-align: center;
  margin-top: 15px;
  float: left;
  border: 1px solid #eee;
  margin-bottom: 35px;
  cursor: pointer;
}
.certificates_face img {
  min-width: 300px;
  min-height: 200px;
  max-width: 300px;
  max-height: 200px;
  margin-bottom: 10px;
}
</style>


