<template>
  <div class="device-detail">
    <app-header :title="'查看详情'" :isShowRefresh="false" :isShowBack="true"></app-header>
    <app-overview :list="detailList" :title="'门组信息'"></app-overview>

    <el-button-group>
      <el-button
        size="small"
        :type="debs ? 'primary' : ''"
        class="device_button"
        @click="toggleTab()"
      >关联设备</el-button>

      <el-button
        size="small"
        :type="userdatas ? 'primary' : ''"
        class="device_button"
        @click="toggleTab()"
      >关联用户</el-button>
    </el-button-group>

    <app-list v-show="debs" :opt="opt1" @get="onGet1"></app-list>
    <app-list v-show="userdatas" :opt="opt2" @get="onGet2"></app-list>

    <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="关联设备" name="tab0">
        <app-list :opt="opt1" @get="onGet1"></app-list>
      </el-tab-pane>
      <el-tab-pane label="关联用户" name="tab1">
        <app-list :opt="opt2" @get="onGet2"></app-list>
      </el-tab-pane>
    </el-tabs>-->
  </div>
</template>
<script>
import userLogo from "@/assets/user_logo.png";

import { debuglog } from "util";
export default {
  data() {
    let _this = this;
    return {
      debs: true,
      userdatas: false,
      activeName: "tab0",
      deviceList: [],
      userList: [],

      detailList: [
        {
          label: "门名称",
          key: "name",
          value: ""
        },
        {
          label: "位置",
          key: "location",
          value: ""
        },
        {
          label: "关联设备数",
          key: "relationDeviceNums",
          value: ""
        },
        {
          label: "终端设备识别模式",
          key: "identifyTypeName",
          value: ""
        },
        {
          label: "关联用户数",
          key: "relationEmployeeNums",
          value: ""
        },
        {
          label: "启用状态",
          key: "state",
          value: ""
        }
      ],
      opt1: {
        search: [],
        columns: [
          {
            label: "设备名称",
            key: "name"
          },
          {
            label: "IP地址",
            key: "ip"
          },
          { label: "设备SN", key: "serialNumber" },
          { label: "设备型号", key: "model" },
          { label: "安装位置", key: "location" },
          {
            label: "启用状态",
            key: "stateStr"
          }
        ],
        buttons: []
      },
      opt2: {
        search: [],
        columns: [
          {
            label: "姓名",
            key: "name"
          },
          { label: "卡号", key: "idCard" },
          { label: "性别", key: "genderStr" },
          { label: "区域", key: "address" },
          {
            label: "头像",
            key: "picUrl",
            type: "img",
            on: row => {
              _this.$alert(`<img src="${row.picUrl}">`, "查看图片", {
                dangerouslyUseHTMLString: true,
                callback: action => {}
              });
            }
          },
          { label: "用户类型", key: "typeStr" }
        ],
        buttons: []
      }
    };
  },
  mounted() {
    // this.toggleTab();
  },
  activated() {
    console.log("device-detail created!!");
    this.userId = this.$route.params.id || "";
    this.detailList.forEach(item => {
      item["value"] = "";
    });
    this.getDoorDetail();
  },
  methods: {
    toggleTab: function() {
      this.debs = !this.debs;
      this.userdatas = !this.userdatas;
      //   this.currentTab = tab; // tab 为当前触发标签页的组件名
    },
    onGet1(opt) {
      let dto = {
        pageNum: opt.skip,
        pageSize: opt.limit,
        doorGroupId: this.$route.params.id
      };
      this.post("/doorGroup/page/queryRelationDevice", dto, {
        isUseResponse: true
      }).then(res => {
        res.data.data.list.forEach(item => {
          item.stateStr = ["离线", "在线", "禁用"][item.state];
        });
        res = JSON.parse(JSON.stringify(res).replace(/list/g, "data"));
        console.log("ggggggg", res.data.data);
        opt.cb(res.data.data);
      });
    },
    onGet2(opt) {
      let dto = {
        doorGroupId: this.$route.params.id,
        pageNum: opt.skip,
        pageSize: opt.limit,
        sort: false
      };
      this.post("/doorGroup/page/queryRelationEmployee", dto, {
        isUseResponse: true
      }).then(res => {
        res.data.data.list.forEach(item => {
          if (item.picUrl) {
            item.picUrl = this.BASE_URL + item.picUrl;
          } else {
            item.picUrl = userLogo;
            console.log("    item.picUrl ", item.picUrl);
          }
          item.genderStr = ["男", "女"][item.gender - 1];
          item.stateStr = Boolean(item.state);

          item.typeStr = item.type
            ? ["黑名单", "白名单"][item.type]
            : "普通用户";
        });

        // debugger;
        res = JSON.parse(JSON.stringify(res).replace(/list/g, "data"));
        console.log("ggggggg", res.data.data.data);

        opt.cb(res.data.data);

        // debugger;
      });
    },
    handleClick(tab, event) {
      switch (tab.paneName) {
        case "tab1":
          break;
        case "tab2":
          break;
        default:
          break;
      }
    },
    // 获取门组信息详情
    getDoorDetail() {
      this.get("/doorGroup/detail/" + this.$route.params.id).then(data => {
        data.state = ["禁用", "启用", "删除"][data.state];
        this.detailList.forEach(item => {
          item["value"] = data[item.key];
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


