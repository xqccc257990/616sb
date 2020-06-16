<template>
  <div class="user-detail">
    <app-detail :opt="opt" ref="detail"></app-detail>
  </div>
</template>
<script>
export default {
  data() {
    let _this = this;
    let defPasswrod = '!@#$6767AM';
    return {
      opt: {
        title: "用户详情",
        form: [
          {
            label: "账号",
            key: "userName",
            rules: [{ required: true }]
          },
          {
            label: "密码",
            key: "password",
            type: "password",
            filters: () => {
              return _this.$route.params.type != 'show';
            },
            rules: [{ required: true }]
          },
          {
            label: "确认密码",
            key: "password2",
            type: "password",
            filters: () => {
              return _this.$route.params.type != 'show';
            },
            rules: [{ required: true }, { _validator: (form, rule, value, callback) => {
              if (!value) {
                callback();
              } else if (value !== form.password) {
                callback(new Error('两次输入密码不一致!'));
              } else {
                callback();
              }
            }}]
          },
          {
            label: "所属部门",
            key: "departmentId",
            type: "select-remote-filterable",
            filters: () => {
              let userInfo = _this.cache.get("userInfo");
              return userInfo.tenantId != null || userInfo.tenantId != undefined;
            },
            opt: {
              multiple: false,
              list: [],
              on(keyword, cb) {
                _this.getDepartmentList(keyword, cb);
              }
            },
            rules: [{ required: true }]
          },
          {
            label: "用户类型",
            key: "userType",
            type: 'select',
            defaultValue: 1,
            filters: () => {
              let userInfo = _this.cache.get("userInfo");
              return userInfo.tenantId == null || userInfo.tenantId == undefined;
            },
            opt: {
              list: [{
                label: '系统用户',
                value: 1
              }, {
                label: '租户',
                value: 2
              }],
              change(val){
                _this.userType = val;
                if (_this.$route.params.type != 'show') {
                  _this.getRoleList(null, data => {
                    for (let i = 0; i < _this.opt.form.length; i++) {
                      let item = _this.opt.form[i];
                      if(item.key == 'roleId'){
                        item.opt.list = data;
                        break;
                      }
                    }
                  });
                }
              }
            }
          },
          {
            label: "角色",
            key: "roleId",
            type: "select-remote-filterable",
            opt: {
              multiple: false,
              list: [],
              on(keyword, cb) {
                _this.getRoleList(keyword, cb);
              }
            },
            rules: [{ required: true }]
          },
          {
            label: "租户",
            key: "tenantId",
            type: "select-remote-filterable",
            filters: [
              {
                key: "userType",
                value: 2
              }
            ],
            opt: {
              multiple: false,
              list: [],
              on(keyword, cb) {
                _this.getTenantList(keyword, cb);
              }
            },
            rules: [{ required: true }]
          },
          {
            label: "姓名",
            key: "realName"
          },
          {
            label: "电话号码",
            key: "phoneNo",
            type: 'tel'
          },
          {
            label: "工号",
            key: "jobNumber",
            filters: () => {
              let userInfo = _this.cache.get("userInfo");
              return userInfo.tenantId == null || userInfo.tenantId == undefined;
            },
          },
          {
            label: "账号状态",
            key: "isDisabledStr",
            type: "switch"
          }
        ],
        buttons: [
          {
            name: "提交",
            show: ["add", "edit"],
            cb(form) {
              let dto = {
                userName: form.userName,
                roleId: form.roleId,
                realName: form.realName,
                phoneNo: form.phoneNo,
                isDisabled: !form.isDisabledStr
              }
              if (form.password != defPasswrod) {
                dto.password = form.password;
              }
              if (form.departmentId) {
                dto.departmentId = form.departmentId;
              }
              let userInfo = _this.cache.get("userInfo");
              if (!userInfo.tenantId) {
                dto.userType = form.userType;
              } else {
                dto.userType = 2;
              }
              if(form.userType == 2 && form.tenantId){
                dto.tenantId = form.tenantId;
              }
              let url = "/user/add";
              let message = "添加用户成功";
              if (form.userId) {
                url = "/user/update";
                dto.userId = form.userId;
                message = "编辑用户成功";
              }
              _this.post(url, dto).then(data => {
                _this.$message({
                  showClose: true,
                  message: message,
                  type: "success"
                });
                _this.$back();
              })
            }
          }
        ],
        get(opt) {
          _this.get("/user/detail/" + _this.$route.params.id).then(data => {
            if (data.userId == 1 || data.userName == 'admin') {
              opt.cb(data);
            } else {
              Promise.all([new Promise((resolve, reject) => {
                _this.get("/role/detail/" + data.roleId).then(role => {
                  resolve(role);
                })
              }), new Promise((resolve, reject) => {
                _this.get("/department/detail/" + data.departmentId).then(department => {
                  resolve(department);
                })
              }), new Promise((resolve, reject) => {
                if(data.tenantId){
                  _this.get("/tenant/detail/" + data.tenantId).then(tenant => {
                    resolve(tenant);
                  })
                } else {
                  resolve('');
                }
              })]).then(values => {
                for (let i = 0; i < _this.opt.form.length; i++) {
                  let item = _this.opt.form[i];
                  if(item.key == 'roleId'){
                    values[0].label = values[0].rolename;
                    values[0].value = values[0].id;
                    item.opt.list = [values[0]];
                  }
                  if(item.key == 'departmentId'){
                    values[1].label = values[1].name;
                    values[1].value = values[1].id;
                    item.opt.list = [values[1]];
                  }
                  if(values[2] && item.key == 'tenantId'){
                    values[2].label = values[2].tenantName;
                    values[2].value = values[2].id;
                    item.opt.list = [values[2]];
                  }
                }
                data.isDisabledStr = !data.isDisabled;
                data.password = defPasswrod;
                data.password2 = defPasswrod;
                opt.cb(data);
              })
            }
          });
        }
      },
      userType: 1
    };
  },
  activated() {
    console.log("sysUser-detail created!!");
    this.$refs.detail.title = ["添加用户", "编辑用户", "用户详情"][
      {
        add: 0,
        edit: 1,
        show: 2
      }[this.$route.params.type]
    ];

    let userInfo = this.cache.get("userInfo");
    if (userInfo.tenantId) {
      this.getRoleList('', data => {
        for (let i = 0; i < this.opt.form.length; i++) {
          let item = this.opt.form[i];
          if (item.key == 'roleId') {
            item.opt.list = data;
          }
        }
        
      })
    }
  },
  deactivated() {},
  methods: {
    /**
     * 获取部门列表
     */
    getDepartmentList(key, cb) {
      let dto = {
        pageNum: 1,
        pageSize: 20
      };
      if (key) {
        dto.name = key;
      }
      let userInfo = this.cache.get("userInfo");
      if (userInfo.tenantId) {
        dto.tenantId = userInfo.tenantId;
      }
      this.post("/department/page/query", dto).then(data => {
        let _data = data.list;
        _data = JSON.parse(JSON.stringify(_data).replace(/name/g, "label"));
        _data = JSON.parse(JSON.stringify(_data).replace(/id/g, "value"));
        data.data = data;
        cb(_data);
      });
    },

    /**
     * 获取角色列表
     */
    getRoleList(key, cb) {
      let dto = {
        pageNum: 1,
        pageSize: 20
      };
      if (key) {
        dto.rolename = key;
      }
      let userInfo = this.cache.get("userInfo");
      if (!userInfo.tenantId) {
        //角色类型 1： 系统角色 2：系统创建租户角色 3：租户创建角色
        dto.roletype = this.userType;
      } else {
        dto.roletype = 3; 
      }
      this.post("/role/page/query", dto).then(data => {
        let _data = data.list;
        _data = JSON.parse(JSON.stringify(_data).replace(/rolename/g, "label"));
        _data = JSON.parse(JSON.stringify(_data).replace(/id/g, "value"));
        data.data = data;
        cb(_data);
      });
    },

    /**
     * 获取租户
     */
    getTenantList(key, cb) {
      let dto = {
        pageNum: 1,
        pageSize: 20
      };
      if (key) {
        dto.name = key;
      }
      this.post("/tenant/page/query", dto).then(data => {
        let _data = data.list;
        _data = JSON.parse(JSON.stringify(_data).replace(/tenantName/g, "label"));
        _data = JSON.parse(JSON.stringify(_data).replace(/id/g, "value"));
        data.data = data;
        cb(_data);
      });
    }
  }
};
</script>

