<template>
  <el-container class="main">
    <el-header class="header">
      <div class="logo">
        <img src="../assets/ht_ysgly@2x.png" alt srcset width="325px" height="47px" />
      </div>
      <div class="user">
        <el-dropdown>
          <span class="el-dropdown-link name">
            <span class="welcome">欢迎用户：</span>
            {{account}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="onUserSet">账号信息</el-dropdown-item>
            <el-dropdown-item @click.native="outLogin" divided>
              <i class="fa fa-sign-out"></i>退出
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container class="main__body">
      <el-aside class="menu" width="200px">
        <el-menu :default-active="$route.path" router>
          <el-submenu
            v-for="(item, index) in menuList"
            :key="item.name"
            :index="item.path"
            v-show="!item.notShow"
            :class="item.group && item.group.length ? ''  : 'menu_item-hideIcon'"
          >
            <template slot="title">
              <div @click="onMenu(item.path, index, item)" ref="titleMenuItem">
                <i :class="[item.icon]" :style="item.color ? 'color:' + item.color : ''"></i>
                <span :style="item.color ? 'color:' + item.color : ''">{{item.name}}</span>
              </div>
            </template>
            <el-menu-item
              v-show="!it.notShow"
              v-for="(it, idx) in item.group"
              :key="it.name"
              :index="it.path"
              @click="onMenu(it.path, (index+1)+''+(idx+1), item)"
              :class="isActive(it)"
            >{{it.name}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container class="box">
        <el-main class="app-el-main">
          <keep-alive>
            <router-view class="view" />
          </keep-alive>
        </el-main>
        <el-footer class="footer">Copyright © www.wavewisdom.com, All Rights Reserved.</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
let notAllowedMenus = [];
export default {
  data() {
    let _this = this;
    return {
      account: "",
      menuList: []
    };
  },

  activated() {
    console.log("main activated!");
    this.userInfo = this.cache.get("userInfo");
    this.account = this.userInfo.account;
    this.initMenu();
    this.initColor();
  },

  methods: {
    isActive(d) {
      let itemPath = d.path;
      let path = this.$route.path;
      let tempItemPath = itemPath.split("/");
      let tempPath = path.split("/");
      if (tempItemPath[2] == tempPath[2] && tempPath[2] != "statistics") {
        return "is-active";
      }
    },
    // 初始化菜单
    initMenu() {
      let menuConfig = [
        {
          icon: "fa fa-users",
          name: "人员管理",
          menuId: 1,
          path: "/main/user/list",
          isTop: true,
          group: [
            {
              name: "人员管理",
              menuId: 1,
              path: "/main/user/list"
            },
            {
              name: "通行记录",
              menuId: 2,
              path: "/main/record/list"
            },
            {
              name: "部门管理",
              menuId: 2,
              path: "/main/department/list"
            }
          ]
        },
        {
          icon: "fa fa-desktop",
          name: "设备管理",
          menuId: 4,
          path: "/main/device/list",
          isTop: true,
          group: [
            {
              icon: "fa fa-user",
              name: "设备列表",
              menuId: 3,
              path: "/main/device/list"
            },
            {
              icon: "",
              name: "发货管理",
              menuId: 4,
              path: "/delivery/list"
            }
          ]
        },
        {
          icon: "fa fa-rocket",
          name: "门组列表",
          menuId: 5,
          path: "/main/doorGroup/list",
          isTop: true,
          group: [
            {
              icon: "fa fa-user",
              name: "门组列表",
              menuId: 9,
              path: "/main/doorGroup/list"
            }
          ]
        },
        {
          icon: "fa fa-newspaper-o",
          name: "考勤管理",
          menuId: 26,
          path: "/main/plan/list",
          isTop: true,
          group: [
            {
              name: "考勤方案",
              menuId: 22,
              path: "/main/plan/list"
            },
            {
              name: "考勤组管理",
              menuId: 23,
              path: "/main/attendance/list"
            },
            {
              name: "考勤组统计",
              menuId: 24,
              path: "/main/statistics/attendanceList"
            },
            {
              name: "打卡记录列表",
              menuId: 25,
              path: "/main/statistics/cardList"
            }
          ]
        },
        // {
        //   icon: "fa fa-picture-o",
        //   name: "广告管理",
        //   menuId: 6,
        //   path: "/main/advertising/list",
        //   isTop: true,
        //   group: [
        //     {
        //       icon: "fa fa-user",
        //       name: "广告列表",
        //       menuId: 13,
        //       path: "/main/advertising/list"
        //     },
        //     {
        //       icon: "fa fa-user",
        //       name: "发布记录",
        //       menuId: 15,
        //       path: "/main/adRelease/list"
        //     }
        //   ]
        // }

        {
          icon: "fa fa-upload",
          name: "软件升级",
          menuId: 20,
          path: "/main/softwareUpdate/list",
          isTop: true,
          group: [
            {
              name: "版本管理",
              menuId: 21,
              path: "/main/softwareUpdate/list"
            }
          ]
        },

        // {
        //   icon: "fa fa-rocket",
        //   name: "登录日志",
        //   menuId: 8,
        //   path: "/main/log/list"
        // }
        {
          icon: "fa fa-cog",
          name: "系统管理",
          menuId: 8,
          path: "/main/sysUser",
          isTop: true,
          group: [
            {
              name: "租户管理",
              menuId: 20,
              path: "/main/tenant/list"
            },
            {
              name: "用户管理",
              menuId: 20,
              path: "/main/sysUser/list"
            },
            {
              name: "角色管理",
              menuId: 21,
              path: "/main/sysRole/list"
            },
            {
              name: "菜单列表",
              menuId: 22,
              path: "/main/sysMenu/list"
            }
          ]
        }
      ];
      let userMenuList = this.userInfo.menuList;
      let _menuList = JSON.parse(JSON.stringify(menuConfig));
      for (let i = 0; i < _menuList.length; i++) {
        let item = _menuList[i];
        let is = checkMenu(item.name);
        if (is) {
          if (item.group) {
            for (let j = 0; j < item.group.length; j++) {
              let it = item.group[j];
              let _is = checkMenu(it.name);
              if (!_is) {
                item.group.splice(j, 1);
                j--;
              }
            }
          }
        } else {
          _menuList.splice(i, 1);
          i--;
        }
      }

      this.menuList = _menuList;
      // this.menuList = menuConfig;
      this.cache.set("menuList", _menuList);
      function checkMenu(name) {
        for (let i = 0; i < userMenuList.length; i++) {
          const item = userMenuList[i];
          if (name == item.title) {
            return true;
          }
        }
        return false;
      }
    },
    initColor(item) {
      this.menuList.forEach((item, index) => {
        if (item.path == this.$route.path) {
          item.color = "#409eff";
        } else {
          item.color = "#666";
        }
      });
    },
    onMenu(path, idx, item) {
      if (item.group && item.group.length) {
        this.menuList.forEach((item, index) => {
          item.color = "#666";
        });
        if (!item.isTop) {
          this.$router.push(path);
        }
        return;
      }
      this.$router.push(path, () => {
        this.initColor(item);
      });
    },
    onUserSet() {
      this.$router.push("/main/userSet/main");
    },
    outLogin() {
      this.$confirm("确认退出当前用户", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            message: "退出成功！",
            type: "success"
          });
          this.cache.del("userInfo");
          this.$router.push("/login");
        })
        .catch(function() {});
    }
  }
};
</script>
<style lang="scss">
.main {
  height: 100%;

  .main__body {
    height: calc(100vh - 60px);
  }

  .header {
    position: relative;
    background-color: #4170e9;

    .logo {
      overflow: hidden;

      img {
        margin-top: 8px;
        float: left;
      }

      div {
        float: left;
        margin-left: 5px;
        margin-top: 15px;
      }
    }

    .user {
      position: absolute;
      top: 0;
      right: 20px;
      padding-top: 19px;
      height: 100%;

      .welcome {
        color: #fff;
      }

      .name {
        color: #ffffff;
        cursor: pointer;
      }
    }
  }

  .menu {
    border-right: solid 1px #dcdfe6;

    .el-submenu__title {
      i {
        margin-right: 8px;
        margin-left: 8px;
        width: 18px;
        font-size: 18px;
        text-align: center;
      }
    }

    .el-submenu.is-active .el-submenu__title {
      i {
        color: rgba(31, 72, 177, 1) !important;
      }

      span {
        color: rgba(31, 72, 177, 1) !important;
      }
    }

    .el-menu-item {
      min-width: auto;
      text-indent: 13px;
    }
  }

  .footer {
    line-height: 60px;
    text-align: center;
    font-size: 12px;
    color: #c0c4cc;
    border-top: solid 1px #dcdfe6;
  }

  .menu_item-hideIcon .el-submenu__icon-arrow {
    display: none;
  }

  .inlet {
    color: rgba(255, 255, 255, 0.9);
    position: relative;
    font-size: 26px;
    width: 200px;
  }

  .inlet:before,
  .inlet:after {
    content: attr(title);
    color: rgba(255, 255, 255, 0.3);
    position: absolute;
    display: block;
    left: 0;
    right: 0;
    margin: auto;
  }

  .inlet:before {
    top: 1px;
    left: 1px;
  }

  .inlet:after {
    top: 1px;
    left: 1px;
  }

  .app-el-main {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .box {
    overflow-x: hidden;
    overflow-y: auto;
    max-height: calc(100vh - 60px);
  }

  .view {
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;
  }
}
</style>