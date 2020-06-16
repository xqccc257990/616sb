<template>
  <div class="auth-device-list">
    <app-list :opt="opt" @get="onGet" ref="app_list"></app-list>

    <el-dialog
      title="修改"
      :visible.sync="editDialogFlag"
      :close-on-click-modal="false"
      class="el-dialog-warrper edit_dialog"
    >
      <div class="edit_dialog-content">
        <el-form ref="form" :model="editFormData" label-width="100px">
          <el-form-item label="打卡记录">
            <el-input v-model="editFormData.recordList" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="打卡范围">
            <el-input v-model="editFormData.RangeDate" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="修正后的时间">
            <el-input v-model="editFormData.standardDate" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="editFormData.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFlag = false">取 消</el-button>
        <el-button type="primary" @click="editTime">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="修改记录"
      :visible.sync="detailDialogFlag"
      :close-on-click-modal="false"
      class="el-dialog-warrper"
    >
      <div class="edit_dialog-content">
        <el-form ref="form" :model="detailFormData" label-width="80px">
          <el-form-item label="打卡记录">
            <el-input v-model="detailFormData.recordList" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="修改后">
            <el-input v-model="detailFormData.standardDate" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="detailFormData.remark" type="textarea" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="修改人">
            <el-input v-model="detailFormData.updatedName" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailDialogFlag = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    let _this = this;
    return {
      searchData: {},
      editFormData: {
        name: 1,
        name2: 1,
        name3: 1,
        name: 4
      },
      detailFormData: {
        name: 1,
        name2: 1,
        name3: 1,
        name: 4
      },
      detailDialogFlag: false,
      editDialogFlag: false,
      nowDate: [],
      opt: {
        title: '考勤统计列表',
        beforeSearch(opt) {
          if (
            opt &&
            opt.searchForm &&
            opt.searchForm["date"] &&
            opt.searchForm["date"][0] &&
            opt.searchForm["date"][1] &&
            moment(opt.searchForm["date"][1]).diff(
              opt.searchForm["date"][0],
              "day"
            ) > 30
          ) {
            _this.$message({
              showClose: true,
              message: "日期范围不能超过一个月",
              type: "warning"
            });
            return false;
          } else {
            return true;
          }
        },
        search: [
          {
            key: "departmentName",
            label: "考勤组名称",
            type: "select",
            opt: {
              list: []
            }
          },
          {
            key: "content",
            label: "姓名/编号"
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
                  label: "正常",
                  value: 0
                },
                {
                  label: "异常",
                  value: 1
                }
              ]
            }
          },
          {
            key: "date",
            label: "时间范围",
            type: "daterange",
            timeType: "yyyy-MM-dd"
          }
        ],
        columns: [
          {
            label: "姓名",
            key: "employeeName",
            fixed: "left"
          },
          { label: "卡号", key: "workNo", fixed: "left" },
          { label: "部门", key: "departmentName", fixed: "left", width: 100 },
          { label: "异常次数", key: "exceptionCount", fixed: "left" }
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
    // 默认获取本月第一天和第最后一天
    this.nowDate = [
      moment()
        .startOf("month")
        .format("YYYY-MM-DD"),
      moment()
        .endOf("month")
        .format("YYYY-MM-DD")
    ];
    this.getAttendanceList();
  },
  methods: {
    /**获取考勤组 */
    getAttendanceList() {
      let dto = {
        pageNum: 1,
        pageSize: 9999
      };
      this.post("/attendanceGroup/page/query", dto).then(res => {
        res = JSON.parse(JSON.stringify(res).replace(/name/g, "label"));
        res = JSON.parse(JSON.stringify(res).replace(/id/g, "value"));
        this.opt.search[0]["opt"]["list"] = res.list;
      });
    },
    //** 获取选择日期 */
    getDate(dateArray) {
      let _this = this;
      this.opt.columns.splice(4, this.opt.columns.length);
      let diff;
      let hasDate = dateArray[0] ? true : false;
      if (hasDate) {
        diff = moment(dateArray[1]).diff(dateArray[0], "day") + 1;
      } else {
        diff = moment(this.nowDate[1]).diff(this.nowDate[0], "day") + 1;
      }
      for (var i = 0; i < diff; i++) {
        let weeke, days;
        if (hasDate) {
          weeke = ["天", "一", "二", "三", "四", "五", "六"][
            moment(dateArray[0])
              .add(i, "days")
              .day()
          ];
          days = moment(dateArray[0])
            .add(i, "days")
            .format("YYYY-MM-DD");
        } else {
          weeke = ["天", "一", "二", "三", "四", "五", "六"][
            moment(this.nowDate[0])
              .add(i, "days")
              .day()
          ];
          days = moment(this.nowDate[0])
            .add(i, "days")
            .format("YYYY-MM-DD");
        }
        this.opt.columns.push({
          type: "list-group",
          label: `${days} 星期${weeke}`,
          width: 160,
          align: "center",
          opt: {
            on(item) {
              if (item.state != 1 || item.isCorrect == 1) {
                _this.getTimeDetail(item);
              }
            }
          },
          key: days
        });
      }
    },
    onGet(opt) {
      let _this = this;
      this.searchData = opt;
      let dto = {
        pageNum: opt.skip,
        pageSize: opt.limit,
        attendanceGroupId: opt.searchForm.departmentName,
        state: opt.searchForm.state,
        content: opt.searchForm.content,
        startDate: opt.searchForm["date"] ? opt.searchForm["date"][0] : null,
        endDate: opt.searchForm["date"] ? opt.searchForm["date"][1] : null
      };
      this.post("/attendanceRecord/statistics", dto, {
        isUseResponse: true
      }).then(res => {
        res.data.data.list.forEach(item => {
          if (item.attendanceRecordStatisticsDayDTOList) {
            item.attendanceRecordStatisticsDayDTOList.forEach(items => {
              item[items.day] = [];
              if (items.attendanceRecordDTOList) {
                items.attendanceRecordDTOList.forEach((itemss, indexss) => {
                  itemss = JSON.parse(
                    JSON.stringify(itemss).replace(/logTime/g, "label")
                  );
                  if (itemss.label) {
                    itemss.label = itemss.label.slice(
                      0,
                      itemss.label.length - 3
                    );
                  }
                  switch (itemss.state) {
                    case 1:
                      break;
                    case 2:
                    case 3:
                    case 4:
                      itemss.style = "color:red;cursor: pointer;";
                      break;
                    default:
                  }

                  // 修改过后的状态
                  if (itemss.isCorrect == 1) {
                    itemss.style = "color:#007cff;cursor: pointer;";
                  }
                  if (itemss.state == 4) {
                    itemss.label = "异常";
                  }
                  itemss.date = items.day;
                  itemss.employeeId = item.employeeId;

                  // 将数据进行分组 [[数据1，数据2],[数据3，数据4]]
                  if ((indexss + 1) % 2 == 0) {
                    item[items.day].forEach((itemsss, indexsss) => {
                      if (itemsss.length < 2) {
                        itemsss.push(itemss);
                      }
                    });
                  } else {
                    item[items.day].push([itemss]);
                  }
                });
              } else if (moment().isAfter(moment(items.day))) {
                item[items.day].push([
                  {
                    state: 1,
                    date: items.day,
                    employeeId: item.employeeId,
                    label: "假"
                  }
                ]);
              }
            });
          }
        });

        res = JSON.parse(JSON.stringify(res).replace(/list/g, "data"));
        this.getDate([
          opt.searchForm["date"] ? opt.searchForm["date"][0] : null,
          opt.searchForm["date"] ? opt.searchForm["date"][1] : null
        ]);
        opt.cb(res.data.data);
      });
    },

    exportExcel() {
      let opt = this.searchData;
      let dto = {
        attendanceGroupId: opt.searchForm.departmentName,
        state: opt.searchForm.state,
        content: opt.searchForm.content,
        startDate: opt.searchForm["date"] ? opt.searchForm["date"][0] : null,
        endDate: opt.searchForm["date"] ? opt.searchForm["date"][1] : null
      };
      this.post("/attendanceRecord/exprotStatistics", dto, {
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
          "考勤组统计表" +
          (dto.startDate ? dto.startDate + "~" + dto.endDate : "");
        a.click();
        document.body.removeChild(a);
      });
    },

    /**
     * 修改异常时间
     */
    editTime(item) {
      this.post("/attendanceChangeRecord/update", {
        date: this.editFormData.date,
        employeeId: this.editFormData.employeeId,
        index: this.editFormData.index,
        recordId: this.editFormData.recordId,
        remark: this.editFormData.remark
      }).then(res => {
        this.editDialogFlag = false;
        this.$refs.app_list.get();
      });
    },

    /**
     * 获取单个考勤记录详情*/
    getTimeDetail(item) {
      let isCorrect = item.isCorrect;
      if (isCorrect) {
        this.detailDialogFlag = true;
      } else {
        this.editDialogFlag = true;
      }
      this.post("/attendanceChangeRecord/detail", {
        date: item.date,
        employeeId: item.employeeId,
        index: item.index,
        recordId: item.recordId
      }).then(res => {
        let recordList = res.recordList.join(",");
        if (isCorrect) {
          this.detailFormData = {
            recordList: recordList.length ? recordList : "异常",
            RangeDate: res.startRangeDate + "~" + res.endRangeDate,
            standardDate: res.standardDate,
            date: item.date,
            employeeId: item.employeeId,
            index: item.index,
            recordId: item.recordId,
            updatedName: res.updatedName + " / " + res.changeLogTime,
            remark: res.remark
          };
        } else {
          this.editFormData = {
            recordList: recordList.length ? recordList : "异常",
            RangeDate: res.startRangeDate + "~" + res.endRangeDate,
            standardDate: res.standardDate,
            date: item.date,
            employeeId: item.employeeId,
            index: item.index,
            recordId: item.recordId,
            remark: res.remark
          };
        }
      });
    }
  }
};
</script>

<style lang="scss" >
.auth-device-list {
  .el-table__body-wrapper {
    min-height: 480px !important;
  }
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
}
</style>
