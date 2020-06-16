<template>
  <div class="auth-device-list">
    <app-list :opt="opt" @get="onGet"></app-list>
  </div>
</template>
<script>
export default {
  data() {
    let _this = this;
    return {
      opt: {
        title: "门组列表",
        search: [
          {
            key: "name",
            label: "门名称"
          },
          {
            key: "location",
            label: "位置"
          },
          {
            key: "state",
            label: "状态",
            type: "select",
            opt: {
              list: [
                {
                  label: "全部",
                  value: ""
                },
                {
                  label: "启用",
                  value: "1"
                },
                {
                  label: "禁用",
                  value: "0"
                },
                {
                  label: "删除",
                  value: "2"
                }
              ]
            }
          }
        ],
        columns: [
          {
            label: "门名称",
            key: "name",
            on: row => {
              _this.$router.push("/main/doorGroup/overview/show/" + row.id);
            }
          },
          { label: "位置", key: "location" },
          { label: "终端识别模式", key: "identifyTypeName" },
          { label: "关联设备", key: "relationDeviceNums" },
          { label: "关联用户", key: "relationEmployeeNums" },
          {
            label: "启用状态",
            key: "stateStr",
            type: "switch",
            opt: {
              on(form) {
                return _this
                  .post(
                    "/doorGroup/updateDoorGroupState",
                    {
                      id: form.id,
                      state: !form.stateStr ? "1" : "0"
                    },
                    {
                      isUseResponse: true,
                      isNotShowError: true
                    }
                  )
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
        ],
        buttons: [
          {
            type: 0,
            on(data) {
              _this.$router.push("/main/doorGroup/detail/add/0");
            }
          },
          {
            type: 1,
            on(data) {
              _this.$router.push("/main/doorGroup/detail/edit/" + data.data.id);
            //   _this.$router.push("/main/doorGroup/detail/edit/" + data.data.id);
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
                  _this
                    .get("/doorGroup/delete/" + data.data.id)
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
      let dto = {
        pageNum: opt.skip,
        pageSize: opt.limit,
        ...opt.searchForm
      };
      this.post("/doorGroup/page/query", dto, {
        isUseResponse: true
      }).then(res => {
        res.data.data.list.forEach(item => {
          item.stateStr = Boolean(item.state);
        });
        res = JSON.parse(JSON.stringify(res).replace(/list/g, "data"));
        opt.cb(res.data.data);
        // debugger;
      });
    }
  }
};
</script>