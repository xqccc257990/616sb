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
        title: "用户列表",
        search: [
          {
            key: "name",
            label: "姓名"
          },
          {
            key: "workNo",
            label: "编号"
          },
          {
            key: "idCard",
            label: "身份证号/IC卡号"
          }
          //   {
          //     key: "type",
          //     label: "用户类型",
          //     type: "select",
          //     opt: {
          //       list: [
          //         {
          //           label: "全部",
          //           value: 0
          //         },
          //         {
          //           label: "黑名单",
          //           value: 1
          //         },
          //         {
          //           label: "白名单",
          //           value: 2
          //         }
          //       ]
          //     }
          //   }
        ],
        columns: [
          {
            label: "用户姓名",
            key: "name",
            on: row => {
              _this.$router.push("/main/user/overview/show/" + row.id);
            }
          },
          { label: "编号", key: "workNo" },
          { label: "身份证号", key: "idCard" },
          { label: "性别", key: "gender" },
          { label: "身份证地址（省-市）", key: "address" },
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
          },
          { label: "添加日期", key: "createTime" },
          { label: "照片状态", key: "picStateStr" }
          //   { label: "用户类型", key: "type" }
        ],
        buttons: [
          {
            type: 0,
            on(data) {
              _this.$router.push("/main/user/detail/add/0");
            }
          },
          {
            type: 1,
            on(data) {
              _this.$router.push("/main/user/detail/edit/" + data.data.id);
            }
          },
          //   {
          //     type: 1,
          //     color: "danger",
          //     name: "删除",
          //     on(data) {
          //       _this
          //         .$confirm("此操作将删除选择项, 是否继续?", "提示", {
          //           confirmButtonText: "确定",
          //           cancelButtonText: "取消",
          //           type: "warning"
          //         })
          //         .then(() => {
          //           console.log("data", data);
          //           var dto = {
          //             id: data.data.id,
          //             isDelete: 1
          //           };
          //           _this.post("/employee/update", dto).then(function() {
          //             _this.$message({
          //               showClose: true,
          //               message: "删除成功!",
          //               type: "success"
          //             });
          //             data.refresh();
          //           });
          //         })
          //         .catch(function() {});
          //     }
          //   },
          {
            type: 2,
            color: "danger",
            name: "批量删除",
            on(data) {
              _this
                .$confirm("此操作将删除选择项, 是否继续?", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                .then(() => {
                  console.log("data", data);
                  var dto = {
                    employeeIdList: data.ids
                    // isDelete: 1
                  };
                  _this.post("employee/batchDelete", data.ids).then(function() {
                    _this.$message({
                      showClose: true,
                      message: "批量删除成功!",
                      type: "success"
                    });
                    data.refresh();
                  });
                })
                .catch(function() {});
            }
          },
          {
            type: 0,
            name: "批量添加",
            on(data) {
              _this.$router.push("/main/user/batchAdd/add/0");
            }
          }
        ]
      }
    };
  },
  created() {
    console.log("authDevice-list created!!");
  },
  activated() {},
  methods: {
    onGet(opt) {
      let _this = this;
      let dto = {
        pageNum: opt.skip,
        pageSize: opt.limit,
        idCard: opt.searchForm.idCard,
        content: opt.searchForm.workNo,
        type: [null, "0", "1"][opt.searchForm.type],
        name: opt.searchForm.name,
        startDate: opt.searchForm["date"] ? opt.searchForm["date"][0] : null,
        endDate: opt.searchForm["date"] ? opt.searchForm["date"][1] : null
      };
      this.post("employee/page/query", dto, {
        isUseResponse: true
      }).then(res => {
        res.data.data.list.forEach(item => {
          item.gender = ["男", "女"][item.gender - 1];
          item.bk = [3, ""][item.picState];
          item.picStateStr = ["照片不可用", "照片可用"][item.picState];

          if (
            item.picUrlList[0] &&
            item.picUrlList[0].indexOf(_this.BASE_URL) == -1
          ) {
            item.picUrlListStr = _this.BASE_URL + item.picUrlList[0];
          } else {
            item.picUrlListStr = userLogo;
            console.log("picUrlListStr", item.picUrlListStr);
          }

          item.type = item.type ? ["黑名单", "白名单"][item.type] : "普通用户";
        });
        res = JSON.parse(JSON.stringify(res).replace(/list/g, "data"));
        opt.cb(res.data.data);
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
