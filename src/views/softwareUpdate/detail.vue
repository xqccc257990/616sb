<template>
  <div class="user-detail">
    <app-detail :opt="opt">
      <template slot="filesize">
        <span style="color: #666;margin-right: 50px">{{fileSizes}}</span>
        <span style="color: #666;display:none">{{progress}}</span>
      </template>
    </app-detail>
  </div>
</template>
<script>
export default {
  data() {
    let _this = this;
    return {
      fileSize: 0,
      fileSizes: " ",
      progress: " ",
      opt: {
        title: "发布新版",
        form: [
          {
            label: "设备型号",
            key: "deviceType",
            type: "select-filterable",
            rules: [
              {
                required: true
              }
            ],
            opt: {
              list: [],
              multiple: true
            }
          },

          {
            label: "软件名称",
            key: "softwareName",
            rules: [
              {
                required: true
              }
            ]
          },
          {
            label: "版本号",
            key: "version",
            rules: [
              {
                required: true
              }
            ]
          },

          {
            label: "上传软件文件",
            key: "downloadUrl",
            type: "upload-file",
            rules: [
              {
                required: true
              }
            ],
            opt: {
              beforeUploadFile(file) {
                let item = _this.opt.form[3]["opt"];
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
              onProgress(evt) {
                console.log(evt.percent.toFixed(0) + "%"); //文件上传进度
                console.log((evt.total / 1024).toFixed(0) + "kb");
                _this.fileSize = Math.floor(evt.total / 1024);
                if (evt.percent == 100) {
                  _this.fileSizes = _this.fileSize + "KB";
                }
                _this.progress = evt.percent.toFixed(0) + "%";
              },
              mustAccept: true,
              // accept: ".exe",
              upload: true,
              name: "files",
              limit: 1,
              url: _this.BASE_URL + "/upload/file" //上传版本的地址
            }
          },
          {
            label: "       ",
            key: "filesize",
            type: "slot",
            opt: {
              slotName: "filesize"
            }
          },
          {
            label: "版本描述",
            key: "description",
            type: "textarea"
          }
        ],
        buttons: [
          {
            name: "提交",
            show: ["add"],
            cb(form) {
              let dto = {
                deviceType: form.deviceType.toString(),
                softwareName: form.softwareName,
                version: form.version,
                description: form.description,
                downloadUrl: form.downloadUrl[0].response.data,
                fileSize: _this.fileSize
              };

              let url = "/softwareVersion/add"; //上传版本提交按钮触发的接口
              let message = "上传版本成功";

              _this.post(_this.BASE_URL + url, dto).then(function() {
                _this.$message({
                  showClose: true,
                  message: message,
                  type: "success"
                });
                _this.$back();
              });
            }
          }
        ]
      }
    };
  },
  activated() {
    console.log("user-detail created!!");
    this.geteQuipmentList();
    this.fileSizes = "";
    this.progress = "";
  },
  methods: {
    /**设备型号 */
    geteQuipmentList() {
      let dto = {};
      this.get("/device/getAllDeviceModel", dto).then(res => {
        var deviceList = [];
        for (let index in res) {
          deviceList.push({
            label: res[index],
            value: res[index]
          });
        }
        this.opt.form[0]["opt"]["list"] = deviceList;
      });
    }
  }
};
</script>