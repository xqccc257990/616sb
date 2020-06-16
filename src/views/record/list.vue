<template>
  <div class="user-list">
    <app-list :opt="opt" @get="onGet"></app-list>
    <el-dialog title="通行记录" :visible.sync="dialogFormVisible">
      <app-list :opt="opt2" @get="onGet" ref="list" v-if="dialogFormVisible" class="fullTable"></app-list>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    let _this = this;
    return {
      dialogFormVisible: false,
      opt2: {
        columns: [
          {
            label: "通行时间",
            key: "passTime",
            align: "center",
            width: 160
          },
          { label: "编号", key: "workNo", align: "center" },
          { label: "姓名", key: "name", align: "center" },
          { label: "性别", key: "gender" },
          { label: "卡号", key: "cardNo", width: 200, align: "center" },
          {
            label: "身份证地址（省-市）",
            key: "address",
            width: 400,
            align: "center"
          },
          { label: "体温", key: "temperature", align: "center" },
          { label: "是否带口罩", key: "isMasks", align: "center" },
          {
            label: "通行照片",
            key: "authPicUrl",
            width: 200,
            type: "img",
            on: row => {
              _this.$alert(`<img src="${row.authPicUrl}">`, "查看图片", {
                dangerouslyUseHTMLString: true,
                callback: action => {}
              });
            }
          }
        ]
      },
      opt: {
        title: "通行记录",
        custom: [
          {
            label: "全屏",
            on() {
              _this.initSocket();
              _this.dialogFormVisible = true;
              _this.$nextTick(() => {
                _this.$refs.list.get();
              });
            }
          }
        ],
        search: [
          {
            key: "passTime",
            label: "通行时段",
            type: "time-range",
            defaultValue: ["00:00:00", "23:59:59"]
          },
          {
            key: "workNo",
            label: "编号"
          },
          {
            key: "name",
            label: "姓名"
          },
          {
            key: "cardNo",
            label: "身份证号/IC卡号"
          }
        ],
        columns: [
          {
            label: "姓名",
            key: "name",
            align: "center",
            on: row => {
              _this.$router.push("/main/record/detail/show/" + row.id);
            }
          },
          { label: "编号", key: "workNo", align: "center" },
          {
            label: "通行时间",
            key: "passTime",
            align: "center",
            width: 160
          },
          { label: "性别", key: "gender" },
          { label: "卡号", key: "cardNo", width: 200, align: "center" },
          {
            label: "身份证地址（省-市）",
            key: "address",
            width: 400,
            align: "center"
          },
          { label: "体温", key: "temperature", align: "center" },
          { label: "是否带口罩", key: "isMasks", align: "center" },
          {
            label: "通行照片",
            width: 200,
            key: "authPicUrl",
            type: "img",
            on: row => {
              _this.$alert(`<img src="${row.authPicUrl}">`, "查看头像", {
                dangerouslyUseHTMLString: true,
                callback: action => {}
              });
            }
          }
        ]
      },
      tableData: {},
      socketData: [],
      buttons: [],
      webSocket: null,
      types: ""
    };
  },
  created() {
    console.log("user-list created!!");
  },
  methods: {
    // 建立连接
    initSocket() {
      // 有参数的情况下：
      let userId = this.cache.get("userInfo")["userId"];
      let url = `ws://${this.SOCKET_URL}/webSocket/${userId}`;
      // 没有参数的情况:接口
      // let url1 = 'ws://localhost:9998'
      this.webSocket = new WebSocket(url);
      this.webSocket.onopen = this.webSocketOnOpen;
      this.webSocket.onclose = this.webSocketOnClose;
      this.webSocket.onmessage = this.webSocketOnMessage;
      this.webSocket.onerror = this.webSocketOnError;
    },
    // 建立连接成功后的状态
    webSocketOnOpen() {
      console.log("websocket连接成功");
    },
    // 获取到后台消息的事件，操作数据的代码在onmessage中书写
    webSocketOnMessage(res) {
      // res就是后台实时传过来的数据
      //   console.log(res.data);
      //给后台发送数据
      //   this.webSocket.send("发送数据");
      //   this.socketData.push(res.data);
      //   console.log("接收的数据", res.data);
      if (this.$refs.list) {
        this.$refs.list.get();
      }
    },
    // 关闭连接
    webSocketOnClose() {
      console.log("websocket连接已关闭");
    },
    //连接失败的事件
    webSocketOnError(res) {
      console.log("websocket连接失败");
      // 打印失败的数据
      console.log(res);
    },
    onGet(opt) {
      let _this = this;
      let dto = {
        pageNum: opt.skip,
        pageSize: opt.limit,
        orderByField: "pass_time",
        sort: false,
        startDate: opt.searchForm["passTime"]
          ? this.format(opt.searchForm["passTime"][0])
          : null,
        endDate: opt.searchForm["passTime"]
          ? this.format(opt.searchForm["passTime"][1])
          : null,
        name: opt.searchForm["name"],
        workNo: opt.searchForm["workNo"],
        cardNo: opt.searchForm["cardNo"]
      };
      this.post("/identifyRecord/page/query", dto, {
        isUseResponse: true
      }).then(res => {
        res.data.data.list.forEach(item => {
          item.isMasks = ["--", "是"][item.isMasks];
          item.address = item.address ? item.address : "--";
          item.name = item.name ? item.name : "匿名";
          item.type = item.type
            ? ["普通用户", "黑名单", "白名单"][item.type]
            : "普通用户";

          //
          if (item.resultState != 1 && item.temperature != "--") {
            item.bk = 4;
          }
          item.authPicUrl = this.BASE_URL + item.authPicUrl;
        });
        res = JSON.parse(JSON.stringify(res).replace(/list/g, "data"));
        this.tableData = res.data.data;
        opt.cb(res.data.data);
      });
    },
    getSocket(opt) {
      opt.cb(this.tableData);
    }
  },
  destroyed() {
    // 页面销毁关闭连接
    if (this.webSocket) {
      this.webSocket.close();
    }
  },
  deactivated() {
    if (this.webSocket) {
      this.webSocket.close();
    }
  }
};
</script>

<style  lang="scss">
.user-list {
  .el-dialog {
    margin: 0 !important;
    width: 100% !important;
    height: 100% !important;
  }
  .el-message-box {
    width: 780px;
    p {
      width: 100%;
    }
    img {
      width: 100%;
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
  .fullTable {
    .el-table__row {
      height: 100px;
    }
    .el-table {
      max-height: 750px;
      overflow: auto;
    }
    img {
      width: 80% !important;
      height: 93% !important;
      left: initial;
    }
  }
}
</style>
