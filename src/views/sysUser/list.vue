<template>
  <div class="auth-device-list">
    <app-list :opt="opt" @get="onGet"></app-list>
  </div>
</template>
<script>
import userLogo from "@/assets/user_logo.png";
export default {
  data() {
    let _this = this;
    return {
      opt: {
        title: "用户管理",
        search: [
          {
            key: "userName",
            label: "账号"
          },
          {
            key: "departmentId",
            label: "部门",
            type: "select-remote-filterable",
            opt: {
              multiple: false,
              list: [],
              on(keyword, cb) {
                _this.getDepartmentList(keyword, cb);
              }
            }
          },
          {
            key: "isDisabled",
            label: "账号状态",
            type: "select",
            opt: {
              list: [
                {
                  label: "全部",
                  value: 2
                },
                {
                  label: "未禁用",
                  value: 0
                },
                {
                  label: "已禁用",
                  value: 1
                }
              ]
            }
          }
        ],
        buttons: [
          {
            type: 0,
            on(data) {
              _this.$router.push("/main/sysUser/detail/add/0");
            }
          },
          {
            type: 1,
            on(data) {
              if (data.data.userId == 1 || data.data.userName == 'admin') {
                _this.$router.push("/main/sysUser/detail/show/" + data.data.userId);
              } else {
                _this.$router.push("/main/sysUser/detail/edit/" + data.data.userId);
              }
            }
          },
          {
            type: 1,
            color: "danger",
            name: "删除",
            on(data) {
              _this
                .$confirm("此操作将删除选择项, 是否继续?", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                .then(() => {
                  console.log("data", data);
                  _this
                    .get("/user/delete/" + data.data.userId)
                    .then(function() {
                      _this.$message({
                        showClose: true,
                        message: "删除成功!",
                        type: "success"
                      });
                      data.refresh();
                    });
                })
                .catch(function() {});
            }
          }
        ],
        columns: [
          {
            label: "账号",
            key: "userName",
            on: row => {
              _this.$router.push("/main/sysUser/detail/show/" + row.userId);
            }
          },
          { label: "姓名", key: "realName" },
          { label: "所属部门", key: "departmentName" },
          { label: "联系电话", key: "phoneNo" },
          { label: "角色", key: "roleName" },
          { label: "添加时间", key: "createTime" },
          {
            label: "账号状态",
            key: "isDisabledStr",
            type: "switch",
            opt: {
              on(form) {
                let dto = {
                  userId: form.userId,
                  isDisabled: !form.isDisabledStr ? "0" : "1"
                };
                return _this
                  .post("/user/updateState", dto, {
                    isUseResponse: true,
                    isNotShowError: true
                  })
                  .then(res => {
                    if (res.data.code == 0) {
                      return {
                        state: true
                      };
                    }
                  })
                  .catch(res => {
                    return {
                      state: false,
                      msg: res.data.msg
                    };
                  });
              }
            }
          }
        ]
      }
    };
  },
  created() {
    console.log("sysUser-list created!!");
  },
  activated() {},
  methods: {
    onGet(opt) {
      let _this = this;
      let dto = {
        pageNum: opt.skip,
        pageSize: opt.limit
      };
      if (opt.searchForm.userName) {
        dto.userName = opt.searchForm.userName;
      }
      if (opt.searchForm.departmentId) {
        dto.departmentId = opt.searchForm.departmentId;
      }
      if (opt.searchForm.isDisabled != undefined && opt.searchForm.isDisabled != 2) {
        dto.isDisabled = opt.searchForm.isDisabled;
      }
      this.post("/user/page/query", dto).then(data => {
        data.list.forEach(item => {
          item.isDisabledStr = [true, false][item.isDisabled];
        });
        data.data = data.list;
        opt.cb(data);
      });
    },

    /**
     * 获取部门
     */
    getDepartmentList(key, cb) {
      let dto = {
        pageNum: 1,
        pageSize: 20
      };
      if (key) {
        dto.name = key;
      }
      this.post("/department/page/query", dto).then(data => {
        let _data = data.list;
        _data = JSON.parse(JSON.stringify(_data).replace(/name/g, "label"));
        _data = JSON.parse(JSON.stringify(_data).replace(/id/g, "value"));
        data.data = data;
        cb(_data);
      });
    }
  }
};
</script>

<style lang="scss" >
.el-message-box {
  width: 70vh;
  p {
    width: 100% !important;
  }
  img {
    width: 100% !important;
  }
}

.guard-log {
  .danger {
    color: #f56c6c;
  }

  .info {
    padding: 10px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #606266;
    background-color: #e4e7ed;

    .txt {
      margin-right: 20px;
    }
  }
}
</style>
