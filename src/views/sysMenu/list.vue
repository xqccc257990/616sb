<template>
  <div class="auth-device-list">
    <!-- <app-list :opt="opt" @get="onGet"></app-list> -->
    <!-- <app-tree :opt="opt" ref="appTree">
    </app-tree> -->
    <!-- <app-tree-list :opt='opt'></app-tree-list> -->
    <app-tree :opt="opt">
      <template slot="info">
        <el-tabs v-model="activeName" class="info-box">
          <el-tab-pane label="菜单信息" name="form">
            <el-form :model="form" label-width="80px" disabled>
              <el-form-item label="菜单名称">
                <el-input v-model="form.title"></el-input>
              </el-form-item>
              <el-form-item label="资源路径">
                <el-input v-model="form.apiUrl"></el-input>
              </el-form-item>
              <el-form-item label="菜单类型">
                <el-input v-model="form.menuType"></el-input>
              </el-form-item>
              <el-form-item label="添加时间">
                <el-input v-model="form.createTime"></el-input>
              </el-form-item>
              <el-form-item label="菜单描述">
                <el-input type="textarea" v-model="form.remark"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </template>
    </app-tree>
  </div>
</template>
<script>
import userLogo from "@/assets/user_logo.png";
export default {
  data() {
    let _this = this;
    return {
      opt: {
        title: "菜单列表",
        get(opt){
          let dto = {
            pageNum: 1,
            // pageSize: opt.limit,
            pageSize: 9999,
          };
          _this.post("/menu/page/query", dto).then(data => {
            for (let i = 0; i < data.list.length; i++) {
              let item = data.list[i];
              item.label = item.title || item.name;
              item.actiontypeStr = ['菜单', '叶子节点'][item.actiontype];
            }
            data.data =  _this.listToTree(data.list);
            opt.cb(data.data);
          });
        },
        on(data) {
          _this.form.title = data.title;
          _this.form.createTime = data.createTime;
          _this.form.actiontypeStr = ['菜单', '叶子节点'][data.actiontype];
          _this.form.remark = data.remark;
          _this.form.apiUrl = data.apiUrl;
        }
      },
      activeName: "form",
      form: {
        title: "",
        apiUrl: '',
        menuType: '',
        createTime: '',
        remark: ''
      },
    };
  },
  created() {
    console.log("sysMenu-list created!!");
  },
  activated() {},
  methods: {
    onGet(opt) {
      let _this = this;
      
    }
  }
};
</script>

<style lang="scss" >
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
</style>
