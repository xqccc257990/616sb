<template>
  <div class="device-delivery-list">
    <app-list :opt="opt" @get="onGet"></app-list>
  </div>
</template>
<script>
export default {
  data() {
    let _this = this;
    return {
      opt: {
        title: "发货管理",

        search: [
          {
            key: "tenantName",
            label: "租户名称",
            type: "select",
            opt: {
              list: [
                // {
                //   label: "全部",
                //   value: ""
                // },
              ]
            }
          },
          {
            key: "serialNumber",
            label: "设备SN"
          },

          {
            key: "deliveryTime",
            label: "发货时间",
            type: "time-range",
            defaultValue: ["00:00:00", "23:59:59"]
          },
          {
            key: "deviceState",
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
        buttons: [
          {
            type: 0,
            on(data) {
              _this.$router.push("/main/delivery/detail/add/0");
            }
          }
        ],
        columns: [
          {
            label: "设备SN",
            key: "serialNumber",
            on: row => {
              //   _this.$router.push("/main/delivery/");
            }
          },
          { label: "设备型号", key: "model" },
          { label: "mac地址", key: "mac" },
          {
            label: "设备IP",
            key: "ip"
          },
          { label: "租户名称", key: "tenantName" },

          { label: "发货时间", key: "createTime" },
          { label: "设备状态", key: "deviceState" }
        ]
        // buttons: [123]
      }
    };
  },
  created() {
    console.log("delivery-list created!!");

    this.gettenantDates();
  },
  activated() {},
  methods: {
    onGet(opt) {
      let dto = {
        orderByField: "tdt.update_time",
        pageNum: opt.skip,
        pageSize: opt.limit,
        searchCount: false,
        sort: false,
        startDate: opt.searchForm["deliveryTime"]
          ? this.format(opt.searchForm["deliveryTime"][0])
          : null,
        endDate: opt.searchForm["deliveryTime"]
          ? this.format(opt.searchForm["deliveryTime"][1])
          : null,
        tenantId: opt.searchForm["tenantName"],
        deviceState: opt.searchForm["deviceState"],
        serialNumber: opt.searchForm["serialNumber"]
      };

      // ...opt.search

      this.post("/deviceTenant/page/query", dto, {
        isUseResponse: true
      }).then(res => {
        res.data.data.list.forEach(item => {
          switch (item.deviceState) {
            case 0:
              item.bk = 2;
              break;
            case 2:
              item.bk = 3;
              break;
            default:
          }
          item.deviceState = ["离线", "在线", "禁用"][item.deviceState];
        });
        res = JSON.parse(JSON.stringify(res).replace(/list/g, "data"));
        opt.cb(res.data.data);
      });
    },
    gettenantDates() {
      //   let dto = {
      //     // orderByField: "",
      //     pageNum: "",
      //     pageSize: "",
      //     searchCount: false,
      //     sort: false
      //   };

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

        this.opt.search[0].opt["list"] = res.data.data.list;

        console.log("/tenant/page/query", res);
      });
    }
  }
};
</script>