<template>
  <div class="auth-device-list">
    <app-list :opt="opt" @get="onGet"></app-list>
  </div>
</template>
<script>
export default {
  data() {
    let _this = this;
    return {
      opt: {
        title: "设备列表",
        search: [
          {
            key: "tenantId",
            label: "租户名称",
            type: "select",
            opt: { list: [] }
          },
          {
            key: "serialNumber",
            label: "设备SN"
          },
          {
            key: "ip",
            label: "IP地址"
          },
          {
            key: "state",
            label: "设备状态",
            type: "select",
            opt: {
              list: [
                {
                  label: "全部",
                  value: ""
                },
                {
                  label: "在线",
                  value: "1"
                },
                {
                  label: "离线",
                  value: "0"
                }
              ]
            }
          }
        ],
        columns: [
          { label: "租户名称", key: "tenantName" },

          {
            label: "设备SN",
            key: "serialNumber",
            on: row => {
              _this.$router.push("/main/device/detail/show/" + row.id);
            }
          },
          { label: "设备名称", key: "name" },
          {
            label: "IP地址",
            key: "ip"
          },

          { label: "设备型号", key: "model" },
          { label: "安装位置", key: "location" },
          { label: "终端识别模式", key: "identifyTypeName" },
          //   { label: "密码", key: "password" },
          { label: "状态", key: "state" }
        ],

        buttons: [
          {
            type: 1,
            on(data) {
              _this.$router.push("/main/device/edit/" + data.data.id);
            }
          }
        ]
      }
    };
  },
  activated() {
    this.getAllTenants();
    console.log("Device-list activated!!");
  },
  methods: {
    /**
     * 获取所有租户
     */

    getAllTenants() {
      let dto = {
        cityId: 0,
        orderByField: "id",
        pageNum: 1,
        pageSize: 10000,
        searchCount: false,
        sort: false,
        state: 1
      };
      this.post("/tenant/page/query", dto, {
        isUseResponse: true
      }).then(res => {
        console.log("/tenant/page/query", res);

        res = JSON.parse(JSON.stringify(res).replace(/id/g, "value"));
        res = JSON.parse(JSON.stringify(res).replace(/tenantName/g, "label"));

        this.opt.search[0].opt.list = res.data.data.list;

        console.log("/tenant/page/query", res.data.data.list);
      });
    },
    onGet(opt) {
      let dto = {
        pageNum: opt.skip,
        pageSize: opt.limit,
        orderByField: " td.update_time",
        sort: false,
        ...opt.searchForm
      };
      this.post("/device/page/query", dto, {
        isUseResponse: true
      }).then(res => {
        console.log("dto", dto, res);
        res.data.data.list.forEach(item => {
          switch (item.state) {
            case 0:
              item.bk = 2;
              break;
            case 2:
              item.bk = 3;
              break;
            default:
          }
          item.state = ["离线", "在线", "禁用"][item.state];
        });
        res = JSON.parse(JSON.stringify(res).replace(/list/g, "data"));
        opt.cb(res.data.data);
      });
    }
  }
};
</script>