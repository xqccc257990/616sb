<template>
  <div class="device-detail">
    <app-detail :opt="opt"></app-detail>
  </div>
</template>
<script>
export default {
  data() {
    let _this = this;
    return {
      opt: {
        title: "广告详情",
        form: [
          {
            label: "广告名称",
            rules: [{ required: true }],
            key: "name"
          },
          {
            label: "启用状态",
            key: "state",
            type: "switch",
            opt: {
              activeText: "开",
              inactiveText: "关"
            }
          },
          {
            label: "详细描述",
            key: "description",
            type: "textarea"
          },
          {
            label: "照片",
            key: "picUrlList",
            type: "upload-img-form",
            rules: [{ required: true }],
            urlKey: "0",
            opt: {
              isUseFileList: true,
              upload: true,
              name: "files",
              url: _this.BASE_URL + "/upload/image",
              remove(file, fileList) {
                console.log(file, fileList);
                return true;
              }
            }
          }
        ],
        get(opt) {
          //opt.id
          _this
            .get("/guangwave/detail/" + _this.$route.params.id)
            .then(data => {
              data.state = Boolean(data.state);
              data.picUrlList = [];
              data.picUrls = JSON.parse(data.picUrls);
              if (data.picUrls) {
                data.picUrls.forEach((item, index) => {
                  data.picUrlList.push({
                    name: `${index}.jpg`,
                    url: _this.BASE_URL + item
                  });
                });
              }

              opt.cb(data);
            });
        },
        buttons: [
          {
            name: "提交",
            show: ["add", "edit"],
            cb(form) {
              let url = "/guangwave/add";
              let message = "添加广告成功";
              let dto = {
                description: form.description,
                name: form.name,
                state: form.state ? 1 : 0
              };
              dto.picUrlList = [];
              form.picUrlList.forEach(item => {
                if (!item.response) {
                  dto.picUrlList.push(item.url.replace(_this.BASE_URL, ""));
                } else {
                  dto.picUrlList.push(
                    item.response.data[0].replace(_this.BASE_URL, "")
                  );
                }
              });
              if (form.id) {
                dto.picUrls = dto.picUrlList;
                delete dto.picUrlList;
                dto.id = form.id;
                url = "/guangwave/update";
                message = "编辑广告成功";
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
        ]
      }
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  activated() {
    console.log("device-detail created!!");
    this.userId = this.$route.params.id || "";
  },
  methods: {
    /**
     * 节点变动
     */
    changeTree(e) {
      let selectData = this.$refs.tree.getCheckedNodes();
      this.selectledDevice = [];
      selectData.forEach(item => {
        if (!item.children) {
          this.selectledDevice.push(item);
        }
      });
    },
    /**
     * 过滤树形搜索
     */
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    /**
     * 显示选择用户
     */
    showSelectUser() {},
    /**
     * 显示选择设备框
     */
    showSelectDevice() {
      this.selectDeviceDialogFlag = true;
    }
  }
};
</script>
<style lang="scss">
.device-detail {
  .dialog-footer {
    text-align: center;
  }
  .device_button {
    margin-right: 20px;
  }
  .el-tabs {
    margin: 0 auto;
    margin-top: 10px;
    max-width: 900px;
  }
  .el-dialog-warrper {
    .el-dialog {
      width: 60%;
    }
    .el-dialog__body {
      display: flex;
      justify-content: space-between;
    }
    .dialog-left {
      flex: 0.5;
      border: 1px solid #eee;
      input {
        margin-bottom: 10px;
      }
    }
    .dialog-right {
      overflow: auto;
      flex: 0.45;
      border: 1px solid #eee;
      .dialog-right-tittle {
        height: 40px;
        text-align: center;
        background: #409eff;
        position: relative;
        line-height: 40px;
        color: #fff;
      }
      .dialog-right-tittle_btn {
        color: #fff;
        position: absolute;
        right: 10px;
        cursor: pointer;
      }
      .dialog-right-list {
        .dialog-right-list-item:hover {
          background: #eee;
        }
        .dialog-right-list-item {
          border-bottom: 1px solid #eee;
          height: 30px;
          line-height: 30px;
          position: relative;
          color: #949494;
          text-indent: 10px;
          .list-item-btn {
            position: absolute;
            right: 20px;
            color: #949494;
            top: 10px;
            cursor: pointer;
          }
          .list-item-btn:hover {
            color: #0188ff;
            cursor: pointer;
          }
        }
      }
    }
    .el-tree {
      height: 350px;
      overflow-y: auto;
    }
  }
}
.shenfen {
  margin-right: 81px;
  margin-left: 99px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
  cursor: pointer;
}

.row-nav {
  cursor: pointer;
  color: #409eff;
}
.device-detail_idcardWarrper {
  display: flex;
  justify-content: space-around;
}
.device-detail_idcard span {
  margin-top: 7px;
  display: block;
  text-align: center;
}
.device-detail .el-tabs--top {
  width: 100%;
  max-width: 100%;
}
</style>


