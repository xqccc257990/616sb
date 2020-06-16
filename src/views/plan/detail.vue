<template>
  <div class="user-detail">
    <app-detail :opt="opt"></app-detail>
  </div>
</template>
<script>
export default {
  data() {
    let _this = this;
    return {
      opt: {
        title: "添加考勤方案",
        form: [
          {
            label: "名称：",
            key: "name",
            rules: [{ required: true }]
          },
          {
            label: "考勤类型：",
            type: "radio",
            key: "type",
            defaultValue: 1,
            opt: {
              list: [
                {
                  id: 1,
                  label: "一天一次上下班"
                },
                {
                  id: 2,
                  label: "一天两次上下班"
                },
                {
                  id: 3,
                  label: "一天三次上下班"
                }
              ]
            },
            rules: [{ required: true }]
          },
          {
            label: "上班时间：",
            key: "firstWorkTime",
            type: "time",
            filters: {
              key: "type",
              value: "1"
            },
            opt: {
              change(v) {
                _this.opt.form.forEach(item => {
                  if (item.key == "firstOffTime" && item.filters.value == 1) {
                    _this.changeDateRange(v, item);
                  }
                });
              }
            },
            rules: [{ required: true }]
          },
          {
            label: "下班时间：",
            key: "firstOffTime",
            type: "time",
            rules: [{ required: true }],
            filters: {
              key: "type",
              value: "1"
            },
            opt: {
              parent: "firstWorkTime",
              change(v) {
                _this.opt.form.forEach(item => {
                  if (item.key == "secondWorkTime") {
                    _this.changeDateRange(v, item);
                  }
                });
              }
            }
          },
          {
            label: "第一次上班时间：",
            key: "firstWorkTime",
            rules: [{ required: true }],
            type: "time",
            filters: {
              key: "type",
              value: "2"
            },
            opt: {
              change(v) {
                _this.opt.form.forEach(item => {
                  if (item.key == "firstOffTime") {
                    _this.changeDateRange(v, item);
                  }
                });
              }
            }
          },
          {
            label: "第一次下班时间：",
            key: "firstOffTime",
            type: "time",
            rules: [{ required: true }],
            filters: {
              key: "type",
              value: "2"
            },
            opt: {
              parent: "firstWorkTime",
              change(v) {
                _this.opt.form.forEach(item => {
                  if (item.key == "secondWorkTime") {
                    _this.changeDateRange(v, item);
                  }
                });
              }
            }
          },
          {
            label: "第二次上班时间：",
            key: "secondWorkTime",
            rules: [{ required: true }],
            type: "time",
            filters: {
              key: "type",
              value: "2"
            },
            opt: {
              parent: "firstOffTime",

              change(v) {
                _this.opt.form.forEach(item => {
                  if (item.key == "secondOffTime") {
                    _this.changeDateRange(v, item);
                  }
                });
              }
            }
          },
          {
            label: "第二次下班时间：",
            key: "secondOffTime",
            type: "time",
            rules: [{ required: true }],
            filters: {
              key: "type",
              value: "2"
            },
            opt: {
              parent: "secondWorkTime",
              change(v) {
                _this.opt.form.forEach(item => {
                  if (item.key == "thirdWorkTime") {
                    _this.changeDateRange(v, item);
                  }
                });
              }
            }
          },
          {
            label: "第一次上班时间：",
            key: "firstWorkTime",
            rules: [{ required: true }],
            type: "time",
            filters: {
              key: "type",
              value: "3"
            },
            opt: {
              change(v) {
                _this.opt.form.forEach(item => {
                  if (item.key == "firstOffTime") {
                    _this.changeDateRange(v, item);
                  }
                });
              }
            }
          },
          {
            label: "第一次下班时间：",
            key: "firstOffTime",
            type: "time",
            rules: [{ required: true }],
            filters: {
              key: "type",
              value: "3"
            },
            opt: {
              parent: "firstWorkTime",
              change(v) {
                _this.opt.form.forEach(item => {
                  if (item.key == "secondWorkTime") {
                    _this.changeDateRange(v, item);
                  }
                });
              }
            }
          },
          {
            label: "第二次上班时间：",
            key: "secondWorkTime",
            rules: [{ required: true }],
            type: "time",
            filters: {
              key: "type",
              value: "3"
            },
            opt: {
              parent: "firstOffTime",
              change(v) {
                _this.opt.form.forEach(item => {
                  if (item.key == "secondOffTime") {
                    _this.changeDateRange(v, item);
                  }
                });
              }
            }
          },
          {
            label: "第二次下班时间：",
            key: "secondOffTime",
            rules: [{ required: true }],
            filters: {
              key: "type",
              value: "3"
            },
            type: "time",
            opt: {
              parent: "secondWorkTime",
              change(v) {
                _this.opt.form.forEach(item => {
                  if (item.key == "thirdWorkTime") {
                    _this.changeDateRange(v, item);
                  }
                });
              }
            }
          },
          {
            label: "第三次上班时间：",
            key: "thirdWorkTime",
            rules: [{ required: true }],
            type: "time",
            filters: {
              key: "type",
              value: "3"
            },
            opt: {
              parent: "secondOffTime",
              change(v) {
                _this.opt.form.forEach(item => {
                  if (item.key == "thirdOffTime") {
                    _this.changeDateRange(v, item);
                  }
                });
              }
            }
          },
          {
            label: "第三次下班时间：",
            key: "thirdOffTime",
            type: "time",
            rules: [{ required: true }],
            filters: {
              key: "type",
              value: "3"
            },
            opt: {
              parent: "thirdWorkTime"
            }
          }
        ],
        buttons: [
          {
            name: "提交",
            show: ["add", "edit"],
            cb(form) {
              for (let k in form) {
                if (!form[k]) {
                  delete form[k];
                }
                switch (form.type) {
                  case 1:
                    delete form.secondOffTime;
                    delete form.secondWorkTime;
                    delete form.thirdWorkTime;
                    delete form.thirdOffTime;
                    break;
                  case 2:
                    delete form.thirdWorkTime;
                    delete form.thirdOffTime;
                    break;
                  default:
                }
                delete form.createTime;
                delete form.isDefault;
                delete form.updateTime;
              }
              let dto = {
                ...form
              };
              let url = "/attendanceProgram/add";
              let message = "添加考勤方案成功";
              if (form.id) {
                url = "/attendanceProgram/update";
                dto.id = form.id;
                message = "编辑考勤方案成功";
              }
              _this.post(url, dto).then(function() {
                _this.$message({
                  showClose: true,
                  message: message,
                  type: "success"
                });
                _this.$back();
              });
            }
          }
        ],
        get(opt) {
          _this
            .get("/attendanceProgram/detail/" + _this.$route.params.id)
            .then(data => {
              opt.cb(data);
            });
        }
      }
    };
  },
  activated() {
    console.log("user-detail created!!");
  },
  methods: {
    changeDateRange(v, item) {
      v = moment().format("YYYY-MM-DD") + " " + v;
      v = moment(v)
        .add(10, "minutes")
        .format("HH:mm:ss");
      // 要求打卡时间至少比上次时间延后10分钟
      item["opt"]["min"] = v;
      item["opt"]["max"] = "23:59:59";
    }
    // getRole() {
    //   let _this = this;
    //   return this.post(
    //     "user-service/apartmentuser/selectRoleList",
    //     {
    //       roleType: "1"
    //     },
    //     {
    //       contentType: "application/x-www-form-urlencoded"
    //     }
    //   ).then(res => {
    //     res = JSON.parse(JSON.stringify(res).replace(/roleName/g, "label"));
    //     res = JSON.parse(JSON.stringify(res).replace(/roleId/g, "value"));
    //     _this.opt.form[4].opt.list = res;
    //     return res;
    //   });
    // }
  }
};
</script>

