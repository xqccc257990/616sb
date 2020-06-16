<template>
  <div class="doorGroup-detail">
    <app-detail :opt="opt" ref="detail">
      <template v-slot:device>
        <el-button size="small" type="primary" class="device_button" @click="showSelectDevice">选择</el-button>
        <span>当前{{selectledDevice.length}}台</span>
      </template>
      <template v-slot:user>
        <el-button size="small" type="primary" class="device_button" @click="showSelectUser">选择</el-button>
        <span>当前{{selectledUser.length}}人</span>
      </template>
    </app-detail>

    <el-dialog
      title="选择设备"
      :visible.sync="deviceDialogFlag"
      :close-on-click-modal="false"
      class="el-dialog-warrper"
    >
      <div class="dialog-left">
        <el-input placeholder="输入关键字进行过滤" v-model="filterTextDevice"></el-input>
        <el-tree
          @check="changeTreeDevice"
          class="filter-tree"
          :data="deviceData"
          node-key="id"
          show-checkbox
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          ref="deviceTree"
        ></el-tree>
      </div>
      <div class="dialog-right">
        <div class="dialog-right-tittle">
          <span>已选({{tempSelectDevice.length}}台)</span>
          <span class="dialog-right-tittle_btn" @click="resetDevice">清空</span>
        </div>
        <div class="dialog-right-list">
          <div
            class="dialog-right-list-item"
            v-for="(item, index) in tempSelectDevice"
            :key="index"
          >
            <span class="list-item-text">{{item.label ? item.label : item.name}}</span>
            <span class="fa fa-times list-item-btn" @click="deleteDevice(item)"></span>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deviceDialogFlag = false">取 消</el-button>
        <el-button type="primary" @click="sureDevice">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="关联用户"
      :visible.sync="userDialogFlag"
      :close-on-click-modal="false"
      class="el-dialog-warrper"
    >
      <div class="dialog-left">
        <el-input placeholder="输入关键字进行过滤" v-model="filterTextUser"></el-input>
        <el-tree
          @check="changeTreeUser"
          class="filter-tree"
          :data="userData"
          show-checkbox
          node-key="id"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          ref="userTree"
        ></el-tree>
        <!-- @scroll="userScroll()" -->
      </div>
      <div class="dialog-right">
        <div class="dialog-right-tittle">
          <span>已选({{tempSelectUser.length}}人)</span>
          <span class="dialog-right-tittle_btn" @click="resetUser">清空</span>
        </div>
        <div class="dialog-right-list">
          <div class="dialog-right-list-item" v-for="(item, index) in tempSelectUser" :key="index">
            <span
              class="list-item-text"
            >{{item.label ? item.label : item.name +' / ' + item.workNo}}</span>
            <span class="fa fa-times list-item-btn" @click="deleteUser(item)"></span>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userDialogFlag = false">取 消</el-button>
        <el-button type="primary" @click="sureUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
let _this;
let validaDevice = (rule, value, callback) => {
  if (_this.selectledDevice.length) {
    callback();
  } else {
    callback(new Error("请选择关联设备"));
  }
};

let validaUser = (rule, value, callback) => {
  if (_this.selectledUser.length) {
    callback();
  } else {
    callback(new Error("请选择关联用户"));
  }
};
export default {
  data() {
    _this = this;
    return {
      getUserDoing: false,
      userPageNum: 1, // 关联用户请求页数
      userPageNothing: false,
      deviceDialogFlag: false,
      userDialogFlag: false,
      filterTextDevice: "",
      filterTextUser: "",
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 已选设备
      selectledDevice: [],
      // 右侧选择设备数据
      tempSelectDevice: [],
      // 已选用户
      selectledUser: [],
      // 右侧选择用户数据
      tempSelectUser: [],
      // 设备树形数据
      deviceData: [],
      // 用户树形数据
      userData: [],
      opt: {
        title: "门组详情",
        form: [
          {
            label: "门名称",
            rules: [{ required: true }],
            key: "name"
          },
          {
            label: "位置",
            key: "location"
          },
          {
            label: "关联设备",
            key: "device",
            rules: [
              { required: true, validator: validaDevice, trigger: "blur" }
            ],
            type: "slot",
            opt: {
              slotName: "device"
            }
          },
          {
            label: "关联用户",
            key: "user",
            // rules: [{ required: true, validator: validaUser, trigger: "blur" }],
            type: "slot",
            opt: {
              slotName: "user"
            }
          },
          {
            label: "终端设备识别模式",
            key: "identifyType",
            type: "select",
            rules: [{ required: true }],
            opt: {
              list: [
                {
                  value: 6,
                  label: "混合模式（同时支持IC卡、身份证、1:N人脸识别）"
                },
                {
                  value: 1,
                  label: "仅人脸检测模式"
                },
                {
                  value: 2,
                  label: "仅刷卡模式（身份证/ IC卡）"
                },

                {
                  value: 3,
                  label: "人证核验模式（身份证人脸对比）"
                },

                {
                  value: 4,
                  label: "IC卡人脸识别模式（需注册IC卡人脸照片,支持考勤）"
                },
                {
                  value: 5,
                  label: "1:N人脸识别模式（需提前注册人脸信息,支持考勤）"
                }
              ]
            }
          },
          {
            label: "启用状态",
            key: "state",
            type: "switch",
            opt: {
              activeText: "开",
              inactiveText: "关"
            }
          }
        ],
        get(opt) {
          _this.get("/doorGroup/detail/" + opt.id).then(data => {
            data.state = Boolean(data.state);
            _this.selectledDevice = data.deviceDTOList;
            _this.tempSelectDevice = JSON.parse(
              JSON.stringify(data.deviceDTOList)
            );
            _this.tempSelectUser = JSON.parse(
              JSON.stringify(data.employeeDTOList)
            );
            _this.selectledUser = data.employeeDTOList;
            opt.cb(data);
          });
        },
        buttons: [
          {
            name: "提交",
            show: ["add", "edit"],

            cb(form) {
              let dto = {
                // deviceIdList: _this.selectledDevice,
                // employeeSimpleAddDTOList: form.selectledUser,
                location: form.location,
                identifyType: form.identifyType,
                name: form.name,
                state: form.state ? 1 : 0
              };
              dto.deviceIdList = [];
              _this.selectledDevice.forEach(item => {
                dto.deviceIdList.push(item.id);
              });
              dto.employeeSimpleAddDTOList = [];
              _this.selectledUser.forEach(item => {
                dto.employeeSimpleAddDTOList.push({
                  employeeId: item.id,
                  employeeType: item.type
                });
              });

              let url = "/doorGroup/add";
              let message = "添加门组成功";
              if (form.id) {
                dto.id = form.id;
                url = "/doorGroup/update";
                message = "编辑门组成功";
              }
              _this.post(url, dto).then(function() {
                _this.$message({
                  showClose: true,
                  message: message,
                  type: "success"
                });
                _this.$back();
              });
            }
          }
        ]
      }
    };
  },
  watch: {
    filterTextDevice(val) {
      this.$refs.deviceTree.filter(val);
    },
    filterTextUser(val) {
      this.$refs.userTree.filter(val);
    }
  },
  activated() {
    console.log("doorGroup-detail created!!");
    // 监听关联用户的滚动条
    window.addEventListener("scroll", this.userScroll, true);
    this.deviceData = [];
    this.userData = [];
    this.tempSelectDevice = [];
    this.tempSelectUser = [];
    this.selectledUser = [];
    this.selectledDevice = [];
    this.userPageNothing = false;
    this.userPageNum = 1;
    this.getUserDetail();
    this.getDevice();
  },
  methods: {
    /**
     * 确定关联设备
     */
    sureDevice(e) {
      let selected = this.$refs.deviceTree.getCheckedNodes();
      selected = selected.filter(item => {
        return item.id && !/null/.test(item.id);
      });
      this.deviceDialogFlag = false;
      this.selectledDevice = [];
      this.selectledDevice = selected;
      this.$refs.detail.onAction(() => {});
    },
    /**
     * 确定关联用户
     */
    sureUser() {
      let selected = this.$refs.userTree.getCheckedNodes();
      selected = selected.filter(item => {
        if (!item.children) {
          return item.id && !/null/.test(item.id);
        }
      });
      this.userDialogFlag = false;
      this.selectledUser = [];
      this.selectledUser = selected;
      this.$refs.detail.onAction(() => {});
    },

    /**
     * 节点变动 - 选择设备
     */
    changeTreeDevice(e) {
      let selectData = this.$refs.deviceTree.getCheckedNodes();
      this.tempSelectDevice = [];
      selectData.forEach(item => {
        if (!item.children) {
          this.tempSelectDevice.push(item);
        }
      });
    },
    /**
     * 节点变动 - 选择用户
     */
    changeTreeUser(e) {
      let selectData = this.$refs.userTree.getCheckedNodes();
      this.tempSelectUser = [];
      selectData.forEach(item => {
        if (!item.children) {
          this.tempSelectUser.push(item);
        }
      });
    },

    /**
     * 过滤树形搜索
     */
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    /**
     * 删除已选设备
     */
    deleteDevice(data) {
      this.tempSelectDevice = this.tempSelectDevice.filter(item => {
        return item.id != data.id;
      });
      let temp = [];
      this.tempSelectDevice.forEach(item => {
        temp.push(item.id);
      });
      this.$refs.deviceTree.setCheckedKeys(temp);
    },

    /**
     * 删除已选用户
     */
    deleteUser(data) {
      this.tempSelectUser = this.tempSelectUser.filter(item => {
        return item.id != data.id;
      });
      let temp = [];
      this.tempSelectUser.forEach(item => {
        temp.push(item.id);
      });
      this.$refs.userTree.setCheckedKeys(temp);
    },

    /**
     * 清空已选 - 设备
     */
    resetDevice(data) {
      this.tempSelectDevice = [];
      this.$refs.deviceTree.setCheckedKeys([]);
    },

    /**
     * 清空已选 - 用户
     */
    resetUser(data) {
      this.tempSelectUser = [];
      this.$refs.userTree.setCheckedKeys([]);
    },

    /**
     * 显示选择用户
     */
    showSelectUser() {
      this.userDialogFlag = true;

      this.tempSelectUser = JSON.parse(JSON.stringify(this.selectledUser));

      console.log("this.tempSelectUser -----------", this.tempSelectUser);
      let temp = [];
      this.tempSelectUser.forEach(item => {
        temp.push(item.id);
      });

      this.$nextTick(() => {
        this.$refs.userTree.setCheckedKeys(temp);
      });
    },

    /**
     * 监听人员滚动条
     */
    userScroll($event) {
      if (this.userPageNothing) {
        return;
      }
      if (
        parseInt($event.target.clientHeight) +
          parseInt($event.target.scrollTop) >
        parseInt($event.target.scrollHeight) - 100
      ) {
        console.log("用户列表到底");
        this.userPageNum++;
        this.getUserDetail();
      }
    },
    /**
     * 显示选择设备框
     */
    showSelectDevice() {
      this.deviceDialogFlag = true;
      this.tempSelectDevice = JSON.parse(JSON.stringify(this.selectledDevice));
      let temp = [];
      this.tempSelectDevice.forEach(item => {
        temp.push(item.id);
      });
      this.$nextTick(() => {
        this.$refs.deviceTree.setCheckedKeys(temp);
      });
    },

    // 获取关联用户详情
    getUserDetail() {
      this.getUserDoing = true;

      this.get("/employee/queryByDepartmentGroup/").then(res => {
        // res = JSON.parse(JSON.stringify(res).replace(/name/g, "lable"));

        res.forEach((item, index) => {
          item.id = "null" + index;
          item.label = item.name;
          if (item["children"]) {
            item.children.forEach(items => {
              items.id = items.id;
              items.label = items.name + " / " + items.workNo;
            });
          }
        });
        res = res.filter(item => item.children && item.children.length);
        this.userData = res;
        this.getUserDoing = false;
        if (this.userDialogFlag) {
          let temps = [];
          this.tempSelectUser.forEach(item => {
            temps.push(item.id);
          });
          this.$nextTick(() => {
            this.$refs.userTree.setCheckedKeys(temps);
          });
        }
      });
    },
    // 获取关联设备列表
    getDevice() {
      let dto = {
        pageNum: 1,
        pageSize: 99999,
        sort: false
      };
      this.post("/device/list/queryByModel", dto).then(res => {
        let temp = [];
        for (var k in res) {
          temp.push({
            id: "null" + k,
            label: k
          });
          temp[temp.length - 1]["children"] = [];
          res[k].forEach(item => {
            temp[temp.length - 1]["children"].push({
              id: item.id.toString(),
              label: item.name
            });
          });
        }
        this.deviceData = temp;
      });
    }
  }
};
</script>
<style lang="scss">
.doorGroup-detail {
  .dialog-footer {
    text-align: center;
  }
  .device_button {
    margin-right: 20px;
  }
  .el-tabs {
    margin: 0 auto;
    margin-top: 10px;
    max-width: 900px;
  }
  .el-dialog-warrper {
    .el-dialog {
      width: 60% !important;
      height: 65% !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      top: 15% !important;
      margin: auto !important;
    }
    .el-dialog__body {
      height: 70%;
      display: flex;
      justify-content: space-between;
    }
    .dialog-left {
      flex: 0.5;
      border: 1px solid #eee;
      overflow: hidden;
      input {
        margin-bottom: 10px;
      }
    }
    .el-dialog__footer {
      width: 100%;
      text-align: center;
      bottom: 0;
      position: absolute;
    }
    .dialog-right {
      overflow: auto;
      flex: 0.45;
      border: 1px solid #eee;
      .dialog-right-tittle {
        height: 40px;
        text-align: center;
        background: #409eff;
        position: relative;
        line-height: 40px;
        color: #fff;
      }
      .dialog-right-tittle_btn {
        color: #fff;
        position: absolute;
        right: 10px;
        cursor: pointer;
      }
      .dialog-right-list {
        .dialog-right-list-item:hover {
          background: #eee;
        }
        .dialog-right-list-item {
          border-bottom: 1px solid #eee;
          height: 30px;
          line-height: 30px;
          position: relative;
          color: #949494;
          text-indent: 10px;
          .list-item-btn {
            position: absolute;
            right: 20px;
            color: #949494;
            cursor: pointer;
            top: 10px;
          }
          .list-item-btn:hover {
            color: #0188ff;
            cursor: pointer;
          }
        }
      }
    }
    .el-tree {
      height: 88%;
      overflow-y: auto;
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
  .doorGroup-detail_idcardWarrper {
    display: flex;
    justify-content: space-around;
  }
  .doorGroup-detail_idcard span {
    margin-top: 7px;
    display: block;
    text-align: center;
  }
  .doorGroup-detail .el-tabs--top {
    width: 100%;
    max-width: 100%;
  }
}
</style>


