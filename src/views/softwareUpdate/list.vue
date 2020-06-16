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
        title: "版本管理",
        search: [
          {
            label: "版本号",
            key: "version"
          },
          {
            label: "发布日期",
            key: "startDate",
            type: "date",
            timeType: "yyyy-MM-dd"
          }
        ],
        columns: [
          {
            label: "设备型号",
            key: "deviceType"
          },
          {
            label: "软件名称",
            key: "softwareName"
          },
          {
            label: "版本号",
            key: "version"
          },
          {
            label: "版本描述",
            key: "description"
          },
          {
            label: "文件大小",
            key: "fileSize"
          },
          {
            label: "升级次数",
            key: "downloadTimes"
          },
          {
            label: "发布人",
            key: "createdBy"
          },
          {
            label: "发布时间",
            key: "createTime"
          },
          {
            label: "操作",
            key: "downloadUrl",
            type: "action-but",
            opt: {
              list: [
                {
                  label: "下载",
                  on(row) {
                    //下载文件
                    window.open(_this.BASE_URL + row.downloadUrl);
                  }
                }
              ]
            }
          }
        ],

        buttons: [
          {
            type: 0,
            on() {
              _this.$router.push("/main/softwareUpdate/detail/add/0");
            }
          },
          {
            type: 1,
            color: "danger",
            name: "删除",
            on(data) {
              _this
                .$confirm("此操作将删除选择项, 是否继续?", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                .then(() => {
                  _this
                    .get("/softwareVersion/delete/" + data.data.id)
                    .then(function() {
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
        ]
      }
    };
  },
  created() {
    console.log("softwareUpdate-list created!!");
  },
  activated() {},
  methods: {
    onGet(opt) {
      let dto = {
        pageNum: opt.skip,
        pageSize: opt.limit,
        version: opt.searchForm.version,
        startDate: opt.searchForm.startDate
      };
      this.post("/softwareVersion/page/query", dto, {
        isUseResponse: true
      }).then(res => {
        res.data.data.list.forEach(item => {
          if (item.fileSize != null) {
            item.fileSize = item.fileSize + "KB";
          }
        });
        res = JSON.parse(JSON.stringify(res).replace(/list/g, "data"));
        opt.cb(res.data.data);
      });
    }
  }
};
</script>