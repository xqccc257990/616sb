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
        title: '考勤方案列表',
        search: [
          {
            key: "name",
            label: "考勤名称"
          }
        ],
        columns: [
          {
            label: "名称",
            key: "name",
            on: row => {
              _this.$router.push("/main/plan/detail/show/" + row.id);
            }
          },
          { label: "考勤类型", key: "typeStr" },
          { label: "考勤时间", key: "timeStr" }
        ],
        buttons: [
          {
            type: 0,
            on(data) {
              _this.$router.push("/main/plan/detail/add/0");
            }
          },
          {
            type: 1,
            on(data) {
              _this.$router.push("/main/plan/detail/edit/" + data.data.id);
            }
          },
          {
            type: 1,
            color: "danger",
            name: "删除",
            on(data) {
              if (data.data.isDefault == 1) {
                _this.$message({
                  message: "不能删除默认考勤方案",
                  type: "warning"
                });
                return;
              }
              _this
                .$confirm("此操作将删除选择项, 是否继续?", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                .then(() => {
                  _this
                    .get("/attendanceProgram/delete/" + data.data.id)
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
      let _this = this;
      let dto = {
        pageNum: opt.skip,
        pageSize: opt.limit,
        orderByField: "update_time",
        sort: false,
        name: opt.searchForm.name
      };
      this.post("/attendanceProgram/page/query", dto, {
        isUseResponse: true
      }).then(res => {
        res.data.data.list.forEach(item => {
          item.typeStr = ["一天一次上下班", "一天两次上下班", "一天三次上下班"][
            item.type - 1
          ];
          item.timeStr = [
            `${item.firstWorkTime}~${item.firstOffTime}`,
            `${item.firstWorkTime}~${item.firstOffTime} \\ ${item.secondWorkTime}~${item.secondOffTime}`,
            `${item.firstWorkTime}~${item.firstOffTime} \\ ${item.secondWorkTime}~${item.secondOffTime} \\ ${item.thirdWorkTime}~${item.thirdOffTime}`
          ][item.type - 1];
        });
        res = JSON.parse(JSON.stringify(res).replace(/list/g, "data"));
        opt.cb(res.data.data);
      });
    }
  }
};
</script>
