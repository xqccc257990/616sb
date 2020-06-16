<template>
  <div class="user-detail-batchAdd">
    <app-detail :opt="opt">
      <template v-slot:excel>
        <el-button @click="getExcle">下载</el-button>
      </template>
    </app-detail>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    let _this = this;
    return {
      opt: {
        title: "批量添加",
        form: [
          {
            label: "模板下载：",
            key: "excel",
            type: "slot",
            opt: {
              slotName: "excel"
            }
          },
          {
            label: "上传人员表格：",
            key: "employeeInfoExcel",
            type: "upload-file",
            rules: [{ required: true }],
            opt: {
              beforeUploadFile(file) {
                let item = _this.opt.form[1]["opt"];
                if (item && item.accept && item.mustAccept) {
                  let acceptList = item.accept.split(",");
                  let testmsg = file.name.substring(file.name.lastIndexOf("."));
                  if (
                    acceptList.find(x => {
                      return x == testmsg;
                    }) == undefined
                  ) {
                    this.$message({
                      message: "上传文件格式有误!",
                      type: "warning"
                    });

                    return false;
                  } else {
                    return true;
                  }
                }
              },
              mustAccept: true,
              accept: ".xls",
              upload: true,
              name: "files",
              limit: 1,
              url: _this.BASE_URL + "/upload/image"
            }
          }
          //   {
          //     label: "上传头像压缩文件：",
          //     key: "picsZipFile",
          //     type: "upload-file",
          //     rules: [{ required: false }],
          //     opt: {
          //       beforeUploadFile(file) {
          //         let item = _this.opt.form[2]["opt"];
          //         if (item && item.accept && item.mustAccept) {
          //           let acceptList = item.accept.split(",");
          //           let testmsg = file.name.substring(file.name.lastIndexOf("."));
          //           if (
          //             acceptList.find(x => {
          //               return x == testmsg;
          //             }) == undefined
          //           ) {
          //             this.$message({
          //               message: "上传文件格式有误!",
          //               type: "warning"
          //             });
          //             return false;
          //           } else {
          //             return true;
          //           }
          //         }
          //       },
          //       mustAccept: true,
          //       accept: ".zip",
          //       upload: true,
          //       name: "files",
          //       limit: 1,
          //       url: _this.BASE_URL + "/upload/image"
          //     }
          //   }
        ],
        buttons: [
          {
            name: "提交",
            show: ["add", "edit"],
            cb(form) {
              let dto = {
                employeeInfoExcel: form.employeeInfoExcel[0]
                // picsZipFile: form.picsZipFile[0]
              };

              var form = new FormData();
              for (var key in dto) {
                form.append(key, dto[key]);
              }
              dto = form;

              let url = "/employee/excelBatchAdd";
              let message = "批量添加用户成功";

              const loading = _this.$loading({
                lock: true,
                text: "正在导入中，请稍等",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
              });
              axios
                .post(_this.BASE_URL + url, dto, {
                  headers: {
                    accessToken:
                      localStorage.getItem("token") ||
                      sessionStorage.getItem("token"),
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  timeout: 6000 * 60 * 10
                })
                .then(res => {
                  res = res.data;
                  loading.close();
                  if (res.code != 0) {
                    _this.$message({
                      message: res.msg,
                      type: "warning"
                    });
                  }

                  //   if (res.code == 5001) {
                  //     _this.$message({
                  //       message: res.msg,
                  //       type: "warning"
                  //     });
                  //   }
                  //   if (res.code == 5005) {
                  //     if (res && res.data) {
                  //       let errorList = res.data;
                  //       let errorStr = [];
                  //       for (let k in errorList) {
                  //         errorStr.push(errorList[k]["workNo"]);
                  //       }
                  //       _this.$message({
                  //         showClose: true,
                  //         duration: 6000 * 60,
                  //         message:
                  //           "无法识别以下编号用户照片：" + errorStr.join(","),
                  //         type: "warning"
                  //       });
                  //     }
                  //   }
                  //   if (res.code == 5009) {
                  //     if (res && res.data) {
                  //       let errorList = res.data;
                  //       let errorStr = [];
                  //       for (let k in errorList) {
                  //         errorStr.push(errorList[k]["workNo"]);
                  //       }
                  //       _this.$message({
                  //         showClose: true,
                  //         duration: 6000 * 60,
                  //         message:
                  //           "无法识别以下编号用户照片：" + errorStr.join(","),
                  //         type: "warning"
                  //       });
                  //     }
                  //   }
                  else {
                    _this.$message({
                      showClose: true,
                      message: message,
                      type: "success"
                    });
                    _this.$back();
                  }
                })
                .catch(data => {
                  loading.close();
                  if (data && data.data && data.data.data) {
                    let errorList = data.data.data;
                    let errorStr = [];
                    for (let k in errorList) {
                      errorStr.push(errorList[k]["workNo"]);
                    }
                    if ((data.data.code = 5005)) {
                      _this.$message({
                        showClose: true,
                        duration: 6000 * 60,
                        message:
                          "无法识别以下编号用户照片：" + errorStr.join(","),
                        type: "warning"
                      });
                    }
                  } else {
                    _this.$message({
                      showClose: true,
                      message: data.data.msg,
                      type: "warning"
                    });
                  }
                });
            }
          }
        ],
        get(opt) {}
      }
    };
  },
  activated() {
    console.log("user-detail created!!");
  },
  methods: {
    getExcle() {
      window.open(this.BASE_URL + "/file/人员信息导入模板.xls");
    }
  }
};
</script>


<style lang="scss">
.user-detail-batchAdd {
  .el-form {
    max-width: 1400px;
  }
}
</style>
