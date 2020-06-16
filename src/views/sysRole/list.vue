<template>
  <div class="role-list">
    <app-tree :opt="opt" ref="appTree">
      <template slot="info">
        <el-button
          class="role_list_save"
          @click="saveRoleMenu"
          v-if="activeName == 'tree' && menuData.length"
        >保存</el-button>
        <el-tabs v-model="activeName" class="info-box">
          <el-tab-pane label="角色信息" name="form">
            <el-form :model="form" label-width="80px" disabled>
              <el-form-item label="角色名称">
                <el-input v-model="form.rolename"></el-input>
              </el-form-item>
              <!-- <el-form-item label="上级角色">
                <el-input v-model="form.parent"></el-input>
              </el-form-item>-->
              <!-- <el-form-item label="角色类型">
                <el-input v-model="form.roleTypeStr"></el-input>
              </el-form-item>-->
              <el-form-item label="添加时间">
                <el-input v-model="form.createTime"></el-input>
              </el-form-item>
              <el-form-item label="角色描述">
                <el-input type="textarea" v-model="form.description"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane class="role-menu-tree" label="操作权限" name="tree">
            <el-tree
              default-expand-all
              ref="menuTree"
              :data="menuData"
              node-key="id"
              show-checkbox
              :props="{
                children: 'children',
                label: 'title'
              }"
            ></el-tree>
          </el-tab-pane>
        </el-tabs>
      </template>
    </app-tree>
  </div>
</template>
<script>
export default {
  data() {
    let _this = this;
    return {
      nowRoleId: "", // 当前选中角色id
      opt: {
        title: "角色管理",
        table: {
          isNotShowSelection: true,
          isShowHighliht: true,
          columns: [{ label: "角色名称", key: "rolename" }],
          buttons: [
            {
              type: 0,
              on() {
                _this.$router.push("/main/sysRole/detail/add/0");
              }
            },
            {
              type: 1,
              on(data) {
                _this.$router.push("/main/sysRole/detail/edit/" + data.data.id);
              }
            },
            {
              type: 2,
              on(data) {
                _this
                  .$confirm("此操作将删除选择项, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                  })
                  .then(() => {
                    let url = `/role/delete/${data.list[0].id}`;
                    _this.get(url).then(() => {
                      _this.$message({
                        showClose: true,
                        message: "删除成功!",
                        type: "success"
                      });
                      data.refresh();
                    });
                  })
                  .catch(function() {});
              }
            }
          ],
          get(opt) {
            let dto = {
              pageNum: opt.skip,
              pageSize: opt.limit
            };
            _this.post("/role/page/query", dto).then(data => {
              _this.checkedKeys = [];
              _this.form = {};
              data.data = data.list;
              opt.cb(data);
            });
          },
          onRow(data) {
            _this.nowRoleId = data.id;
            let menuGetList = [];

            let url = `/role/detail/${data.id}`;
            // 获取角色信息
            _this.get(url).then(data => {
              data.roleTypeStr = [
                "系统角色",
                "系统创建租户角色",
                "租户创建角色"
              ][data.roletype - 1];
              _this.form = data;
            });

            let url2 = `/menu/queryMenuByRoleId/${data.id}`;
            // 获取操作权限
            _this.get(url2).then(data => {
              let _checkedKeys = [];
              for (let i = 0; i < data.length; i++) {
                const item = data[i];
                _checkedKeys.push(item.menuId);
              }
              // _this.checkedKeys = _checkedKeys;
              _this.$refs.menuTree.setCheckedKeys(_checkedKeys);
            });
          }
        }
      },
      activeName: "form",
      form: {
        rolename: "",
        roleTypeStr: "",
        createTime: "",
        description: ""
      },
      // 操作权限列表
      menuData: [],
      menuList: []
    };
  },
  activated() {
    console.log("role-list activated!!");

    //this.$refs.appTree.initList();
    this.nowRoleId = "";
    this.$refs.menuTree.setCheckedKeys([]);
  },
  created() {
    this.getAllMenu();
  },
  methods: {
    getAllMenu() {
      let dto = {
        pageNum: 1,
        pageSize: 9999
      };
      this.post("/menu/page/query", dto).then(data => {
        for (let i = 0; i < data.list.length; i++) {
          let item = data.list[i];
          item.label = item.title || item.name;
          item.actiontypeStr = ["菜单", "叶子节点"][item.actiontype];
        }
        this.menuList = data.list;
        this.menuData = this.listToTree(data.list);
      });
    },
    saveRoleMenu() {
      if (!this.nowRoleId) {
        this.$message({
          showClose: true,
          message: "请选择角色",
          type: "warning"
        });
        return;
      }
      let checkedKeys = this.$refs.menuTree.getCheckedKeys();
      checkedKeys.forEach(data => {
        data = data.toString();
      });
      let dto = {
        roleId: this.nowRoleId,
        menuIdList: checkedKeys,
        rolename: this.form.rolename,
        roletype: this.form.roletype
      };
      this.post("/role/update", dto).then(data => {
        this.$message({
          showClose: true,
          message: "保存成功!",
          type: "success"
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.role-menu-tree {
  max-height: 500px;
  overflow-y: auto;
}
.role_list_save {
  position: absolute;
  right: 20px;
  top: 10px;
  z-index: 1111;
}
</style>>

