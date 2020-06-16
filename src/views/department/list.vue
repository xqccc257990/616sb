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
        title: '部门列表',
        search: [
          {
            key: "name",
            label: "部门名称"
          }
        ],
        columns: [
          {
            label: "部门名称",
            key: "name",
            on: row => {
              _this.$router.push("/main/department/detail/show/" + row.id);
            }
          },
          { label: "部门人数", key: "personCount" },
          { label: "描述", key: "remark" }
        ],
        buttons: [
          {
            type: 0,
            on(data) {
              _this.$router.push("/main/department/detail/add/0");
            }
          },
          {
            type: 1,
            on(data) {
              _this.$router.push(
                "/main/department/detail/edit/" + data.data.id
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
                    .get("/department/delete/" + data.data.id)
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
        orderByField: "update_time",
        sort: false,
        ...opt.searchForm
      };
      this.post("/department/page/query", dto, {
        isUseResponse: true
      }).then(res => {
        res = JSON.parse(JSON.stringify(res).replace(/list/g, "data"));
        opt.cb(res.data.data);
      });
    }
  }
};
</script>