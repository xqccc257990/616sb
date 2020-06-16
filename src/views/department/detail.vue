<template>
  <div class="department-detail">
    <app-detail :opt="opt" ref="detail">
      <template v-slot:user>
        <el-button size="small" type="primary" class="device_button" @click="showSelectUser">选择</el-button>
        <span>当前{{selectledUser.length}}人</span>
      </template>
    </app-detail>
    <app-header :title="'部门人员'" :isShowRefresh="false" v-if="type == 'show'"></app-header>
    <app-list :opt="listOpt" @get="onGet" v-show="type == 'show'"></app-list>
    <el-dialog
      title="关联用户"
      :visible.sync="userDialogFlag"
      :close-on-click-modal="false"
      class="el-dialog-warrper"
    >
      <div class="dialog-left">
        <el-input placeholder="输入关键字进行过滤" v-model="filterTextUser"></el-input>
        <el-tree
          :load="loadNode"
          lazy
          @check="changeTreeUser"
          class="filter-tree"
          :data="userData"
          show-checkbox
          node-key="id"
          :props="defaultProps"
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
            >{{item.label ? item.label : item.name + ' / ' + item.workNo}}</span>
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
import userLogo from "@/assets/user_logo.png";

let validaUser = (rule, value, callback) => {
  if (_this.selectledUser.length) {
    callback();
  } else {
    callback(new Error("请选择人员"));
  }
};
export default {
  data() {
    _this = this;
    return {
      type: "",
      opt: {
        label: "name",
        children: "zones",
        isLeaf: "leaf",
        title: "部门详情",
        form: [
          {
            label: "部门名称",
            key: "name",
            rules: [{ required: true }]
          },
          {
            label: "人员",
            key: "user",
            rules: [{ required: true, validator: validaUser, trigger: "blur" }],
            type: "slot",
            opt: {
              slotName: "user"
            }
          },
          //   {
          //     label: "状态",
          //     key: "state",
          //     type: "select",
          //     rules: [{ required: true }],
          //     opt: {
          //       list: [
          //         {
          //           value: 1,
          //           label: "启用"
          //         },
          //         {
          //           value: 0,
          //           label: "禁用"
          //         }
          //       ]
          //     }
          //   },
          {
            label: "描述",
            key: "remark",
            type: "textarea"
          }
        ],
        buttons: [
          {
            name: "提交",
            show: ["add", "edit"],
            cb(form) {
              let dto = {
                name: form.name,
                employeeIdList: [],
                remark: form.remark ? form.remark : "",
                state: 1
              };
              _this.selectledUser.forEach(item => {
                dto.employeeIdList.push(item.id);
              });

              let url = "/department/add";
              let message = "添加部门成功";
              if (form.id) {
                url = "/department/update";
                dto.id = form.id;
                message = "编辑部门成功";
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
        ],
        get(opt) {
          _this
            .get("/department/detail/" + _this.$route.params.id)
            .then(data => {
              if (data.employeeDTOList) {
                data.personCount = data.employeeDTOList.length;
                _this.tempSelectUser = JSON.parse(
                  JSON.stringify(data.employeeDTOList)
                );
                _this.selectledUser = data.employeeDTOList;
              } else {
                data.personCount = 0;
                _this.tempSelectUser = [];
                _this.selectledUser = [];
              }
              opt.cb(data);
            });
        }
      },
      listOpt: {
        search: [],
        columns: [
          {
            label: "姓名",
            key: "name"
          },
          { label: "编号", key: "workNo" },
          { label: "身份证号", key: "idCard" },
          { label: "性别", key: "genderStr" },
          { label: "区域址（省-市）", key: "address" },
          {
            label: "头像",
            key: "picUrlListStr",
            type: "img",
            on: row => {
              _this.$alert(`<img src="${row.picUrlListStr}">`, "查看头像", {
                dangerouslyUseHTMLString: true,
                callback: action => {}
              });
            }
          }
        ],
        buttons: []
      },
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
      // 已选用户
      selectledUser: [],
      // 右侧选择用户数据
      tempSelectUser: [],
      // 用户树形数据
      userData: []
    };
  },
  watch: {
    filterTextUser(val) {
      this.$refs.userTree.filter(val);
    }
  },
  activated() {
    console.log("user-detail created!!");
    this.type = this.$route.params.type;
    this.userData = [];
    this.tempSelectUser = [];
    this.selectledUser = [];
    this.userPageNum = 1;
    this.userPageNothing = false;
    // window.addEventListener("scroll", this.userScroll, true);
    this.getUserDetail();
  },
  methods: {
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

    // 获取关联用户详情
    getUserDetail() {
      this.getUserDoing = true;
      let dto = {
        pageNum: this.userPageNum,
        pageSize: 999,
        sort: false
      };

      this.getUserDoing = true;

      this.get("/employee/queryByDepartmentGroup/").then(res => {
        // res = JSON.parse(JSON.stringify(res).replace(/name/g, "lable"));

        res.forEach((item, index) => {
          item.id = index;
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
      });
    },
    //   this.post("/employee/page/query", dto).then(res => {
    //     let temp = [];
    //     // 后台可能最能只会返回200个
    //     if (res.list.length < 200) {
    //       this.userPageNothing = true;
    //     }
    //     if (!this.userData.length) {
    //       temp.push({
    //         id: "",
    //         label: "全部用户",
    //         children: []
    //       });
    //       res.list.forEach(item => {
    //         temp[0]["children"].push({
    //           id: item.id.toString(),
    //           type: item.type,
    //           label: `${item.name} / ${item.workNo ? item.workNo : ""}`
    //         });
    //       });
    //       this.userData = temp;
    //     } else {
    //       res.list.forEach(item => {
    //         this.userData[0]["children"].push({
    //           id: item.id.toString(),
    //           type: item.type,
    //           label: `${item.name} / ${item.workNo ? item.workNo : ""}`
    //         });
    //       });
    //     }
    //     this.getUserDoing = false;
    //     if (this.userDialogFlag) {
    //       let temps = [];
    //       this.tempSelectUser.forEach(item => {
    //         temps.push(item.id);
    //       });
    //       this.$nextTick(() => {
    //         this.$refs.userTree.setCheckedKeys(temps);
    //       });
    //     }
    //   });
    // },
    onGet(opt) {
      if (this.$route.params.type != "show") {
        opt.cb();
        return;
      }
      let dto = {
        pageNum: opt.skip,
        pageSize: opt.limit,
        orderByField: "update_time",
        sort: false,
        departmentId: this.$route.params.id
      };
      this.post("/employee/page/query", dto, {
        isUseResponse: true
      }).then(res => {
        res.data.data.list.forEach(item => {
          item.genderStr = ["男", "女"][item.gender - 1];

          if (item.picUrlList.length) {
            item.picUrlListStr = _this.BASE_URL + item.picUrlList[0];
          } else {
            item.picUrlListStr = [userLogo];
            // console.log("    item.picUrl ", item.picUrl);
          }
          //   if (
          //     item.picUrlList.length > 0 &&
          //     item.picUrlList[0].indexOf(_this.BASE_URL) == -1
          //   ) {
          //     item.picUrlListStr = _this.BASE_URL + item.picUrlList[0];
          //   } else {
          //     item.picUrlListStr = item.picUrlList[0];
          //   }
          item.type = item.type ? ["黑名单", "白名单"][item.type] : "普通用户";
        });
        res = JSON.parse(JSON.stringify(res).replace(/list/g, "data"));
        opt.cb(res.data.data);
      });
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: "region" }]);
      }
      if (node.level > 1) return resolve([]);

      setTimeout(() => {
        const data = [
          {
            name: "leaf",
            leaf: true
          },
          {
            name: "zone"
          }
        ];

        resolve(data);
      }, 500);
    }
  }
};
</script>

<style lang="scss" >
.department-detail .el-form {
  max-width: 95% !important;
}
.department-detail {
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
  .dodepartment-detail_idcardWarrper {
    display: flex;
    justify-content: space-around;
  }
  .dodepartment-detail_idcard span {
    margin-top: 7px;
    display: block;
    text-align: center;
  }
  .dodepartment-detail .el-tabs--top {
    width: 100%;
    max-width: 100%;
  }
}
</style>
