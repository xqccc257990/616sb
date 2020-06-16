<template>
  <div class="user-list">
    <app-list :opt="opt" @get="onGet"></app-list>
  </div>
</template>
<script>
export default {
  data() {
    let _this = this;
    return {
      form: {
        date: ""
      },
      opt: {
        title: "登录日志",
        search: [
          {
            key: "date",
            label: "起止时间",
            type: "time-range",
            defaultValue: ["00:00:00", "23:59:59"]
          },
          {
            type: "btnGroup",
            key: "btnGroup",
            buts: [
              {
                type: "success",
                label: "今日",
                timeType: "day"
              },
              {
                type: "primary",
                label: "本周",
                timeType: "week"
              },
              {
                type: "primary",
                label: "本月",
                timeType: "month"
              }
            ]
          }
        ],
        columns: [
          { label: "登录时间", key: "loginTimeStr" },
          { label: "IP", key: "loginIp" },
          { label: "地区", key: "region" },
          {
            label: "浏览器",
            key: "browser",
            opt: {
              isUserPopover: true
            }
          },
          { label: "退出时间", key: "exitTimeStr" }
        ]
      }
    };
  },
  created() {
    console.log("user-list created!");
  },
  methods: {
    onRefresh() {
      console.log("refresh");
    },
    onSubmit() {
      console.log(this.form);
      for (let i = 0; i < this.buts.length; i++) {
        let item = this.buts[i];
        item.type = "primary ";
      }
      this.onGet();
    },
    onGet(opt) {
      var dto = {
        pageNum: opt.skip,
        pageSize: opt.limit,
        beginTime: opt.searchForm["date"]
          ? this.format(opt.searchForm["date"][0])
          : this.format(
              new Date(new Date(new Date().toLocaleDateString()).getTime())
            ),
        endTime: opt.searchForm["date"]
          ? this.format(opt.searchForm["date"][1])
          : this.format(new Date())
      };
      this.post("user-service/login/listLogPage", dto, {
        isUseResponse: true
      }).then(res => {
        if (res.data.code == 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            var item = res.data.data[i];
            item.loginTimeStr = item.loginTime
              ? this.format(item.loginTime)
              : "";
            item.exitTimeStr = item.exitTime ? this.format(item.exitTime) : "";
          }
        }
        opt.cb(res.data);
      });
    }
  }
};
</script>