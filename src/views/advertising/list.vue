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
        title: '广告列表',
        search: [
          {
            key: "name",
            label: "广告名称"
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
            label: "广告标题",
            key: "name",
            on: row => {
              _this.$router.push("/main/advertising/detail/show/" + row.id);
            }
          },
          {
            label: "头像",
            key: "picUrls",
            type: "img",
            on: row => {
              _this.$alert(`<img src="${row.picUrls}">`, "查看图片", {
                dangerouslyUseHTMLString: true,
                callback: action => {}
              });
            }
          },
          { label: "内容", key: "description" },
          { label: "在播数量", key: "onAirDeviceNums" },
          { label: "发布时间", key: "createTime" },
          {
            label: "启用状态",
            key: "stateStr",
            type: "switch",
            opt: {
              on(form) {
                return _this
                  .post(
                    "/guangwave/update",
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
            on() {
              _this.$router.push("/main/advertising/detail/add/0");
            }
          },
          {
            type: 1,
            on(data) {
              _this.$router.push(
                "/main/advertising/detail/edit/" + data.data.id
              );
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
                    .get("/guangwave/delete/" + data.data.id)
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
      this.post("/guangwave/page/query", dto, {
        isUseResponse: true
      }).then(res => {
        res.data.data.list.forEach(item => {
          item.stateStr = Boolean(Number(item.state));
          if (item.picUrls !== "null") {
            item.picUrls = this.BASE_URL + JSON.parse(item.picUrls)[0];
          }
        });
        res = JSON.parse(JSON.stringify(res).replace(/list/g, "data"));
        opt.cb(res.data.data);
      });
    }
  }
};
</script>