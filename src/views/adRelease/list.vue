<template>
  <div class="auth-device-list">
    <app-list :opt="opt" @get="onGet" ref="app_list"></app-list>
  </div>
</template>
<script>
export default {
  data() {
    let _this = this;
    return {
      opt: {
        title: '发布记录',
        search: [
          {
            key: "passTime",
            label: "时段",
            type: "time-range",
            defaultValue: ["00:00:00", "23:59:59"]
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
                }
              ]
            }
          }
        ],
        columns: [
          {
            label: "广告名称",
            key: "adName"
          },
          { label: "门信息", key: "doorGroupNameListStr" },
          { label: "关联设备数", key: "adRelationDeviceNums" },
          { label: "在播", key: "adOnAirDeviceNums" },
          { label: "发布时间", key: "postTime" },
          {
            label: "操作",
            key: "adName",
            type: "action",
            opt: {
              list: [
                {
                  label: "重新发布",
                  on(row) {
                    _this
                      .$confirm("确定重新发布?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "info"
                      })
                      .then(() => {
                        _this
                          .post("/adPostRecord/update", {
                            id: row.id,
                            state: 1
                          })
                          .then(() => {
                            _this
                              .$confirm("广告重新发布成功", {
                                confirmButtonText: "确定",
                                showCancelButton: false,
                                type: "success"
                              })
                              .then(() => {
                                _this.$refs.app_list.get();
                              });
                          });
                      })
                      .catch(function() {});
                  }
                }
              ]
            }
          }
        ],
        buttons: [
          {
            type: 0,
            on() {
              _this.$router.push("/main/adRelease/detail/add/0");
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
                    .get("/adPostRecord/delete/" + data.data.id)
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
        startDate: opt.searchForm["passTime"]
          ? this.format(opt.searchForm["passTime"][0])
          : null,
        endDate: opt.searchForm["passTime"]
          ? this.format(opt.searchForm["passTime"][1])
          : null,
        ...opt.searchForm
      };
      this.post("/adPostRecord/page/query", dto, {
        isUseResponse: true
      }).then(res => {
        res.data.data.list.forEach(item => {
          item.state = ["离线", "在线", "禁用"][item.state];
          item.doorGroupNameListStr = item.doorGroupNameList.join(",");
        });
        res = JSON.parse(JSON.stringify(res).replace(/list/g, "data"));
        opt.cb(res.data.data);
      });
    }
  }
};
</script>