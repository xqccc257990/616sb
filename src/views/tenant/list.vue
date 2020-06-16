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
        title: "租户管理",
        search: [
          {
            key: "tenantName",
            label: "租户"
          },
          {
            key: "cityId",
            label: "城市",
            type: "select-remote-filterable",
            opt: {
              multiple: false,
              list: [],
              on(keyword, cb) {
                _this.getCityList(keyword, cb);
              }
            }
          },
          {
            key: "state",
            label: "租户状态",
            type: "select",
            opt: {
              list: [
                {
                  label: "全部",
                  value: '2'
                },
                {
                  label: "禁用",
                  value: '0'
                },
                {
                  label: "启用",
                  value: '1'
                }
              ]
            }
          }
        ],
        buttons: [
          {
            type: 0,
            on(data) {
              _this.$router.push("/main/tenant/detail/add/0");
            }
          },
          {
            type: 1,
            on(data) {
              _this.$router.push("/main/tenant/detail/edit/" + data.data.id);
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
                    .get("/tenant/delete/" + data.data.id)
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
            label: "租户名称",
            key: "tenantName",
            on: row => {
              _this.$router.push("/main/tenant/detail/show/" + row.id);
            }
          },
          { label: "编号", key: "ttenantNo" },
          { label: "城市", key: "address" },
          { label: "联系人", key: "contactName" },
          { label: "联系电话", key: "contactPhone" },
          { label: "添加时间", key: "createTime" },
          {
            label: "租户状态",
            key: "stateStr",
            type: "switch",
            opt: {
              on(form) {
                let dto = {
                  id: form.id,
                  state: !form.stateStr ? 1 : 0
                };
                return _this
                  .post("/tenant/updateState", dto, {
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
    console.log("tenant-list created!!");
  },
  activated() {},
  methods: {
    onGet(opt) {
      let _this = this;
      let dto = {
        pageNum: opt.skip,
        pageSize: opt.limit
      };
      if (opt.searchForm.tenantName) {
        dto.tenantName = opt.searchForm.tenantName;
      }
      if (opt.searchForm.cityId) {
        dto.cityId = opt.searchForm.cityId;
      }
      if (opt.searchForm.state && opt.searchForm.state != 2) {
        dto.state = opt.searchForm.state;
      }
      this.post("/tenant/page/query", dto).then(data => {
        data.list.forEach(item => {
          item.stateStr = [false, true][item.state];
          item.address = '';
          item.address+= item.provinceName?item.provinceName+'/':'';
          item.address+= item.cityName?item.cityName+'/':'';
          item.address+= item.districtName?item.districtName:'';
        });
        data.data = data.list;
        opt.cb(data);
      });
    },

    /**
     * 获取城市
     */
    getCityList(key, cb) {
      let dto = {
        pageNum: 1,
        pageSize: 20
      };
      if (key) {
        dto.name = key;
      }
      this.post("/baseCity/page/query", dto).then(data => {
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
