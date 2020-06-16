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
      searchData: {},
      opt: {
        title: '打卡记录列表',
        search: [
          {
            key: "departmentId",
            label: "部门",
            type: "select",
            opt: {
              list: []
            }
          },
          {
            key: "date",
            label: "时间范围",
            type: "daterange",
            timeType: "yyyy-MM-dd"
          },
          {
            key: "name",
            label: "姓名/工号"
          }
        ],
        columns: [
          {
            label: "姓名",
            key: "employeeName",
            align: "center"
          },
          { label: "卡号", key: "workNo" },
          { label: "部门", key: "departmentName" },
          { label: "打卡时间", key: "logTime" },
          { label: "考勤设备", key: "deviceSN" },
          { label: "门组名称", key: "doorGroupName" },
          {
            label: "打卡照片",
            key: "picUrlListStr",
            type: "img",
            on: row => {
              _this.$alert(`<img src="${row.picUrlListStr}">`, "查看头像", {
                dangerouslyUseHTMLString: true,
                callback: action => {}
              });
            }
          },
          { label: "添加日期", key: "createTime" }
          //   { label: "用户类型", key: "type" }
        ],
        buttons: [],
        custom: [
          {
            label: "导出",
            type: "export",
            on(data) {
              _this.exportExcel();
            }
          }
        ]
      }
    };
  },
  created() {
    console.log("authDevice-list created!!");
  },
  activated() {
    this.getDepartment();
  },
  methods: {
    /**
     * 获取部门
     */
    getDepartment() {
      let dto = {
        pageNum: 1,
        pageSize: 999,
        orderByField: "update_time",
        sort: false
      };
      this.post("/department/page/query", dto).then(res => {
        res = JSON.parse(JSON.stringify(res).replace(/name/g, "label"));
        res = JSON.parse(JSON.stringify(res).replace(/id/g, "value"));
        this.opt.search[0]["opt"]["list"] = res.list;
      });
    },
    onGet(opt) {
      let _this = this;
      this.searchData = opt;
      let dto = {
        pageNum: opt.skip,
        pageSize: opt.limit,
        name: opt.searchForm.name,
        orderByField: "update_time",
        sort: false,
        departmentId: opt.searchForm.departmentId,
        startDate: opt.searchForm["date"] ? opt.searchForm["date"][0] : null,
        endDate: opt.searchForm["date"] ? opt.searchForm["date"][1] : null
      };
      this.post("/attendanceRecord/page/query", dto, {
        isUseResponse: true
      }).then(res => {
        res.data.data.list.forEach(item => {
          item.picUrlListStr = _this.BASE_URL + item.picUrl;
          item.employeeName = item.employeeName ? item.employeeName : "--";
        });
        res = JSON.parse(JSON.stringify(res).replace(/list/g, "data"));
        opt.cb(res.data.data);
      });
    },
    exportExcel() {
      let opt = this.searchData;
      let dto = {
        name: opt.searchForm.name,
        departmentId: opt.searchForm.departmentId,
        orderByField: "update_time",
        sort: false,
        startDate: opt.searchForm["date"] ? opt.searchForm["date"][0] : null,
        endDate: opt.searchForm["date"] ? opt.searchForm["date"][1] : null
      };
      this.post("/attendanceRecord/page/export", dto, {
        isUseResponse: true,
        responseType: "blob"
      }).then(res => {
        let blob = new Blob([res.data], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        var objectUrl = URL.createObjectURL(blob);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = objectUrl;
        a.download =
          "打卡记录统计表" +
          (dto.startDate ? dto.startDate + "~" + dto.endDate : "");
        a.click();
        document.body.removeChild(a);
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
