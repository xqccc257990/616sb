<template>
  <div class="role-detail">
    <app-detail :opt="opt" ref="detail"></app-detail>
  </div>
</template>
<script>
export default {
  data() {
    let _this = this;
    return {
      opt: {
        title: "角色详情",
        form: [
          {
            label: "角色名称",
            key: "rolename",
            rules: [{ required: true }]
          },
          {
            label: "角色类型",
            key: "roletype",
            type: "radio",
            filters: ()=>{
              let userInfo = this.cache.get("userInfo");
              return userInfo.tenantId == null || userInfo.tenantId == undefined;
            },
            opt: {
              list: [
                {
                  label: "系统角色",
                  id: '1'
                },
                {
                  label: "租户角色",
                  id: '2'
                }
              ]
            },
            rules: [{ required: true }]
          },
          {
            label: "租户可见",
            key: "isTenantVisible",
            type: "radio",
            filters: ()=>{
              let userInfo = this.cache.get("userInfo");
              return userInfo.tenantId == null || userInfo.tenantId == undefined;
            },
            opt: {
              list: [
                {
                  label: "是",
                  id: '1'
                },
                {
                  label: "否",
                  id: '0'
                }
              ]
            },
            rules: [{ required: true }]
          },
          {
            label: "添加时间",
            key: "addTimeStr",
            only: ["show"]
          },
          {
            label: "角色描述",
            key: "description",
            type: "textarea"
          }
        ],
        get(opt) {
          let url = `/role/detail/${opt.id}`;
          _this.get(url).then(data => {
            data.roletype = data.roletype.toString();
            opt.cb(data);
          });
        },
        buttons: [
          {
            name: "提交",
            show: ["add", "edit"],
            cb(form) {
              console.log(form);
              let dto = {
                rolename: form.rolename,
                description: form.description ? form.description : null,
                isTenantVisible: form.isTenantVisible
              };
              if (form.roletype) {
                dto.roletype = form.roletype;
              }
              let url = "/role/add";
              let message = "添加栏目成功";
              if (form.id) {
                url = "/role/update";
                dto.roleId = form.id;
                message = "编辑栏目成功";
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
  activated () {
    this.$refs.detail.title = ["添加角色", "编辑角色", "角色详情"][
      {
        add: 0,
        edit: 1,
        show: 2
      }[this.$route.params.type]
    ];
  },
  created: function() {
    console.log("role-detail created!!");
  }
};
</script>

