<template>
  <div class="user-detail">
    <app-detail :opt="opt" ref="detail"></app-detail>
  </div>
</template>
<script>
export default {
  data() {
    let _this = this;
    return {
      opt: {
        title: "租户详情",
        form: [
          {
            label: "租户名称",
            key: "tenantName",
            rules: [{ required: true }]
          },
          {
            label: "省市区",
            key: "address",
            type: "cascader",
            opt: {
              list: [],
              props: {
                lazy: true,
                lazyLoad(node, resolve) {
                  _this.onCascaderLazyLoad(node, data => {
                    resolve(data);
                  });
                }
              }
            },
            rules: [{ required: true }]
          },
          {
            label: "联系人",
            key: "contactName"
          },
          {
            label: "联系号码",
            key: "contactPhone",
            type: "tel"
          },
          {
            label: "租户状态",
            key: "stateBoolean",
            type: "switch",
            rules: [{ required: true }]
          }
        ],
        buttons: [
          {
            name: "提交",
            show: ["add", "edit"],
            cb(form) {
              let dto = {
                tenantName: form.tenantName,
                provinceId: form.address[0],
                cityId: form.address[1],
                districtId: form.address[2],
                contactName: form.contactName,
                contactPhone: form.contactPhone,
                state: form.stateBoolean ? 1 : 0
              };
              let url = "/tenant/add";
              let message = "添加租户成功";
              if (form.id) {
                url = "/tenant/update";
                dto.id = form.id;
                message = "编辑租户成功";
              }
              _this.post(url, dto).then(data => {
                _this.$message({
                  showClose: true,
                  message: message,
                  type: "success"
                });
                _this.$back();
              });
            }
          }
        ],
        get(opt) {
          _this.get("/tenant/detail/" + _this.$route.params.id).then(data => {
            Promise.all([new Promise((resolve, reject) => {
                _this.get("/baseCity/detail/" + data.cityId).then(city => {
                  resolve(city);
                })
            }), new Promise((resolve, reject) => {
                _this.get("/baseDistrict/detail/" + data.districtId).then(district => {
                  resolve(district);
                })
            })]).then(_values => {
              Promise.all([
                new Promise((resolve, reject) => {
                  _this.getProvinceList(provinceList => {
                    resolve(provinceList);
                  });
                }),
                new Promise((resolve, reject) => {
                  _this.getCityList(_values[0].provinceCode, cityList => {
                    resolve(cityList);
                  });
                }),
                new Promise((resolve, reject) => {
                  _this.getDistrictList(_values[1].cityCode, districtList => {
                    resolve(districtList);
                  });
                })
              ]).then(values => {
                for (let i = 0; i < values[0].length; i++) {
                  let item = values[0][i];
                  if (item.id == data.provinceId) {
                    item.children = values[1];
                  }
                }
                for (let i = 0; i < values[1].length; i++) {
                  let item = values[1][i];
                  if (item.id == data.cityId) {
                    item.children = values[2];
                  }
                }
                for (let i = 0; i < _this.opt.form.length; i++) {
                  let item = _this.opt.form[i];
                  if (item.key == "address") {
                    item.opt.list = values[0];
                  }
                }
                data.stateBoolean = !!data.state;
                data.address = [data.provinceId, data.cityId, data.districtId];
                opt.cb(data);
              });
            })
          });
        }
      }
    };
  },
  activated() {
    console.log("tenant-detail created!!");

    this.$refs.detail.title = ["添加租户", "编辑租户", "租户详情"][
      {
        add: 0,
        edit: 1,
        show: 2
      }[this.$route.params.type]
    ];

    if (this.$route.params.type == 'add') {
      this.getProvinceList(data => {
        this.setCascaderData(data);
      });
    }
  },
  methods: {
    /**
     * 获取省份列表
     */
    getProvinceList(cb) {
      let dto = {
        pageNum: 1,
        pageSize: 999
      };
      this.post("/baseProvince/page/query", dto).then(data => {
        for (let i = 0; i < data.list.length; i++) {
          let item = data.list[i];
          item.label = item.name;
          item.value = item.id;
        }
        cb(data.list);
      });
    },

    /**
     * 获取城市列表
     */
    getCityList(provinceCode, cb) {
      let dto = {
        pageNum: 1,
        pageSize: 999
      };
      if (provinceCode) {
        dto.provinceCode = provinceCode;
      }
      this.post("/baseCity/page/query", dto).then(data => {
        for (let i = 0; i < data.list.length; i++) {
          let item = data.list[i];
          item.label = item.name;
          item.value = item.id;
        }
        cb(data.list);
      });
    },

    /**
     * 获取区县列表
     */
    getDistrictList(cityCode, cb) {
      let dto = {
        pageNum: 1,
        pageSize: 999
      };
      if (cityCode) {
        dto.cityCode = cityCode;
      }
      this.post("/baseDistrict/page/query", dto).then(data => {
        for (let i = 0; i < data.list.length; i++) {
          let item = data.list[i];
          item.label = item.name;
          item.value = item.id;
          item.leaf = true;
        }
        cb(data.list);
      });
    },

    /**
     * 设置省市区数据
     */
    setCascaderData(data) {
      for (let i = 0; i < this.opt.form.length; i++) {
        let item = this.opt.form[i];
        if (item.key == "address") {
          item.opt.list = data;
        }
      }
    },

    /**
     * 省市区数据加载
     */
    onCascaderLazyLoad(node, cb) {
      switch (node.level) {
        case 1:
          this.getCityList(node.data.provinceCode, data => {
            cb(data);
          });
          break;
        case 2:
          this.getDistrictList(node.data.cityCode, data => {
            cb(data);
          });
          break;
        default:
          break;
      }
    }
  }
};
</script>

