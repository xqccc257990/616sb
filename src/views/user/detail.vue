<template>
  <div class="user-detail">
    <app-detail :opt="opt">
      <template v-slot:icCard>
        <el-input
          v-model="icCard"
          placeholder="请从读卡器刷IC卡读取"
          @keydown.native="keydownIcCard"
          @focus="foucus"
          @blur="blur"
          readonly
          ref="cardInput"
        ></el-input>
      </template>
    </app-detail>
  </div>
</template>
<script>
import Compressor from "compressorjs";
let validMobile = (rule, value, callback) => {
  let reg = /^1[345789]\d{9}$/;
  if (!value) {
    callback();
  } else if (!reg.test(value)) {
    callback(new Error("手机号码格式不对"));
  } else {
    callback();
  }
};
let validID = (rule, value, callback) => {
  let reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  if (!reg.test(value)) {
    callback(new Error("身份证号码不正确"));
  } else {
    callback();
  }
};
export default {
  data() {
    let _this = this;
    return {
      icCard: "",
      inputTimer: null,
      inputTime: 0,
      tempInputValue: "",
      opt: {
        title: "编辑用户",
        form: [
          {
            label: "编号",
            key: "workNo",
            rules: [{ required: true }]
          },
          {
            label: "姓名",
            key: "name",
            rules: [{ required: true }]
          },
          {
            label: "性别",
            key: "gender",
            type: "select",
            rules: [{ required: true }],
            opt: {
              list: [
                {
                  value: 1,
                  label: "男"
                },
                {
                  value: 2,
                  label: "女"
                }
              ]
            }
          },
          {
            label: "身份证号",
            key: "idCard"
          },
          {
            label: "IC卡号",
            key: "icNo",
            type: "slot",
            opt: {
              slotName: "icCard"
            }
          },
          {
            label: "手机号",
            key: "phoneNo",
            rules: [
              { required: false, validator: validMobile, trigger: "blur" }
            ]
          },
          {
            label: "部门",
            key: "departmentId",
            type: "select",
            opt: {
              list: []
            }
          },
          {
            label: "区域地址（省-市）",
            key: "address"
          },
          //   {
          //     label: "照片",
          //     key: "picUrlList",
          //     type: "upload-img-form",
          //     rules: [{ required: false }],
          //     urlKey: "0",
          //     opt: {
          //       isUseFileList: true,
          //       upload: true,
          //       name: "files",
          //       limit: 1,
          //       url: _this.BASE_URL + "/upload/image",
          //       remove(file, fileList) {
          //         console.log(file, fileList);
          //         return true;
          //       }
          //     }
          //   },
          {
            label: "备注",
            key: "remark",
            type: "textarea"
          }
        ],
        buttons: [
          {
            name: "提交",
            show: ["add", "edit"],
            cb(form) {
              let dto = {
                address: form.address,
                gender: form.gender,
                idCard: form.idCard,
                name: form.name,
                phoneNo:
                  form.phoneNo && form.phoneNo != "null" ? form.phoneNo : "",
                icNo: _this.icCard,
                remark: form.remark && form.remark != "null" ? form.remark : "",
                // status: form.status,
                workNo: form.workNo
              };
              if (form.departmentId || form.departmentId == 0) {
                dto.departmentId = form.departmentId;
              }

              //   let renderImg = function() {
              //     return ;
              //   };

              new Promise((resolve, reject) => {
                resolve(true);

                // let item = form.picUrlList[0];
                // console.log("form.picUrlList[0]", item);
                // if (item == undefined) {
                //   resolve(true);
                // }
                // if (item.response) {
                //   console.log("item.response", item.response);
                //   new Compressor(item.raw, {
                //     maxWidth: 1000,
                //     maxHeight: 1000,
                //     quality: 1,
                //     width: 1000,
                //     success(result) {
                //       const files = new window.File([result], result.name, {
                //         type: result.type
                //       });
                //       dto.imageFile = files;
                //       resolve(true);
                //     },
                //     error(err) {
                //       console.log(err.message);
                //       reject(false);
                //     }
                //   });
                // }
              })
                .then(() => {
                  let url = "/employee/webAdd";
                  let message = "添加用户成功";
                  if (form.id) {
                    url = "/employee/webUpdate";
                    dto.id = form.id;
                    message = "编辑用户成功";
                  }
                  _this
                    .post(url, dto, {
                      contentType: "application/x-www-form-urlencoded",
                      isNotShowError: true
                    })
                    .then(function() {
                      _this.$message({
                        showClose: true,
                        message: message,
                        type: "success"
                      });
                      _this.$back();
                    })
                    .catch(res => {
                      _this.$message({
                        message: res.data.data ? res.data.data : res.data.msg,
                        type: "warning"
                      });
                    });
                })
                .catch(() => {
                  _this.$message({
                    message: "图片压缩错误",
                    type: "warning"
                  });
                });
            }
          }
        ],
        get(opt) {
          _this.get("/employee/detail/" + _this.$route.params.id).then(data => {
            data.type = data.type ? data.type : 2;
            data.picUrlList = [];
            data.icCard = data.icNo;
            data.picUrlList.push({
              name: `1.jpg`,
              url: _this.BASE_URL + data.picUrl
            });
            _this.icCard = data.icNo;
            opt.cb(data);
          });
        }
      }
    };
  },
  activated() {
    console.log("user-detail created!!");
    this.icCard = "";
    this.getDepartment();
  },
  deactivated() {
    clearInterval(this.inputTimer);
    this.inputTime = 0;
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
        res.list.unshift({
          value: null,
          label: "无"
        });
        this.opt.form.forEach(item => {
          if (item.key == "departmentId") {
            item.opt.list = res.list;
          }
        });
      });
    },
    keydownIcCard(e) {
      if (e.keyCode == 13) {
        this.icCard = "";
        this.icCard = parseInt(this.tempInputValue);
        this.useInputBlur();
      } else {
        this.tempInputValue += e.key;
      }
    },
    useInputBlur() {
      this.$refs.cardInput.blur();
    },
    foucus(e) {},
    blur(e) {
      clearInterval(this.inputTimer);
      this.inputTimer = null;
      this.inputTime = 0;
      this.tempInputValue = "";
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

