<template>
  <div class="device-detail">
    <app-header :title="'查看详情'" :isShowRefresh="false" :isShowBack="true"></app-header>
    <img :src="img" alt />
    <app-overview :list="detailList" :title="'设备详情'"></app-overview>
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
      detailList: [
        {
          label: "租户名称",
          key: "tenantName",
          value: ""
        },
        {
          label: "设备名称",
          key: "name",
          value: ""
        },
        {
          label: "设备型号",
          key: "model",
          value: ""
        },
        {
          label: "IP地址",
          key: "ip",
          value: ""
        },
        {
          label: "设备SN",
          key: "serialNumber",
          value: ""
        },
        {
          label: "终端设备识别模式",
          key: "identifyTypeName",
          value: ""
        },
        {
          label: "安装位置",
          key: "location",
          value: ""
        },
        {
          label: "关联门信息",
          key: "doorGroupName",
          value: ""
        },
        {
          label: "密码",
          key: "password",
          value: ""
        },
        {
          label: "终端软件版本",
          key: "firmwareVersion",
          value: ""
        },
        {
          label: "状态",
          key: "state",
          value: ""
        }
      ]
    };
  },
  activated() {
    console.log("device-detail created!!");
    this.userId = this.$route.params.id || "";
    this.detailList.forEach(item => {
      item["value"] = "";
    });
    this.getUserDetail();
  },
  methods: {
    // 获取关联用户详情
    getUserDetail() {
      this.get("/device/detail/" + this.$route.params.id).then(res => {
        //   this.get("/device/detail/" + "1245307241704198146").then(res => {
        res.genderStr = ["男", "女"][res.gender - 1];
        res.state = ["离线", "在线"][res.state];
        this.detailList.forEach(item => {
          item["value"] = res[item.key];
        });
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
</style>


