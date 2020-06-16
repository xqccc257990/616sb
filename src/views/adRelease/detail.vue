<template>
  <div class="device-detail">
    <app-detail :opt="opt"></app-detail>
  </div>
</template>
<script>
import { debuglog } from "util";
export default {
  data() {
    let _this = this;
    return {
      opt: {
        title: "发布广告",
        form: [
          {
            label: "选择广告",
            key: "adId",
            type: "select",
            rules: [{ required: true }],
            opt: {
              list: [],
              change(arr, cb, form) {
                if (form && form.hasOwnProperty("apartmentIds")) {
                  if (arr.length > 0 && arr[arr.length - 1] == 0) {
                    form["apartmentIds"] = ["0"];
                  } else if (arr.length > 1 && arr[0] == 0) {
                    arr.shift();
                    form["apartmentIds"] = arr;
                  }
                } else {
                  console.warn("属性不存在：fapartmentIds");
                }
              }
            }
          },
          {
            label: "选择门",
            key: "doorGroupIdList",
            type: "select-filterable",
            rules: [{ required: true }],
            opt: {
              list: [],
              change(arr, cb, form) {
                if (form && form.hasOwnProperty("apartmentIds")) {
                  if (arr.length > 0 && arr[arr.length - 1] == 0) {
                    form["apartmentIds"] = ["0"];
                  } else if (arr.length > 1 && arr[0] == 0) {
                    arr.shift();
                    form["apartmentIds"] = arr;
                  }
                } else {
                  console.warn("属性不存在：fapartmentIds");
                }
              }
            }
          },
          {
            label: "轮播图停留时长",
            key: "carouselTime",
            type: "select",
            rules: [{ required: true }],
            opt: {
              list: [
                {
                  value: 1,
                  label: "1秒"
                },
                {
                  value: 2,
                  label: "2秒"
                },
                {
                  value: 3,
                  label: "3秒"
                },
                {
                  value: 4,
                  label: "4秒"
                },
                {
                  value: 5,
                  label: "5秒"
                }
              ]
            }
          }
        ],
        get(opt) {
          //   let dto = {
          //     roleId: opt.id
          //   };
          //   _this
          //     .post("user-service/apartmentuser/queryRoleInfo", dto)
          //     .then(data => {
          //       opt.cb(data);
          //     });
        },
        buttons: [
          {
            name: "提交",
            show: ["add", "edit"],
            cb(form) {
              let dto = {
                adId: form.adId,
                doorGroupIdList: form.doorGroupIdList,
                carouselTime: form.carouselTime
              };
              let url = "/adPostRecord/add";
              let message = "发布广告成功";
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
    // this.userId = this.$route.params.id || "";
    this.getDoorList();
    this.getAdList();
  },
  methods: {
    getDoorList() {
      //   POST /doorGroup/page/query
      let dto = {
        pageNum: 1,
        pageSize: 99999999
      };
      let _this = this;
      this.post("/doorGroup/page/query", dto).then(res => {
        res.list.forEach(item => {
          item.label = item.name;
          item.value = item.id;
        });
        _this.opt.form[1]["opt"]["list"] = res.list;
      });
    },

    getAdList() {
      //   POST /doorGroup/page/query
      let dto = {
        pageNum: 1,
        pageSize: 99999999
      };
      let _this = this;
      this.post("/guangwave/page/query", dto).then(res => {
        res.list.forEach(item => {
          item.label = item.name;
          item.value = item.id;
        });
        _this.opt.form[0]["opt"]["list"] = res.list;
      });
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
      flex: 0.45;
      overflow: auto;
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
            top: 10px;
            color: #949494;
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


