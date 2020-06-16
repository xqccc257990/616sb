<template>
  <div class="device-edit">
    <app-header title="编辑设备" :isShowBack="datas.isShowBack" v-if="1"></app-header>
    <div style="width:80%;display:flex;justify-content:center">
      <el-form
        :inline="false"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item prop="tenantId" label="租户名称">
          <el-select v-model="ruleForm.tenantId" placeholder="请选择租户名称">
            <el-option
              v-for="item in selectOps.AllTenants"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="设备名称">
          <el-input disabled v-model="ruleForm.deviceName"></el-input>
        </el-form-item>

        <el-form-item label="设备型号">
          <el-input disabled v-model="ruleForm.deviceModel"></el-input>
        </el-form-item>
        <el-form-item label="IP地址">
          <el-input disabled v-model="ruleForm.deviceIp"></el-input>
        </el-form-item>
        <el-form-item label="设备SN">
          <el-input disabled v-model="ruleForm.deviceSn"></el-input>
        </el-form-item>
        <el-form-item label="安装位置">
          <el-input v-model="ruleForm.devicepPosition"></el-input>
        </el-form-item>

        <el-form-item label="关联门信息">
          <el-select v-model="ruleForm.doorGroupId" placeholder="请选择门组">
            <el-option
              v-for="item in selectOps.AllDoorGroups"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="ruleForm.devicePassward"></el-input>
        </el-form-item>

        <el-form-item style="text-align:center">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      datas: {
        isShowBack: true
      },
      rules: {
        deviceName: [
          { required: true, message: "请输入设备名称", trigger: "blur" }
        ],
        tenantId: [
          { required: true, message: "请选择租户名称", trigger: "blur" }
        ],
        deviceSn: [{ required: true, message: "请输入设备SN", trigger: "blur" }]
      },

      ruleForm: {
        tenantId: "",
        doorGroupId: "",
        beforetenantId: "",
        beforeTenantName: "",
        beforedoorGroupName: "",
        beforedoorGroupId: "",
        deviceSn: "",
        deviceIp: "",
        deviceModel: "",
        devicepPosition: "",
        deviceName: "",
        devicePassward: ""
      },
      selectOps: {
        AllTenants: [],
        AllDoorGroups: []
      }
    };
  },
  activated() {
    console.log("activated!!", this.$route.params);
    this.getAllTenants();
    this.getAllDoorGroups();
    this.getDeviceDetail();
  },
  methods: {
    getDeviceDetail() {
      this.get("/device/detail/" + this.$route.params.id).then(data => {
        console.log("/device/detail/", data);

        this.$set(this.ruleForm, "beforeTenantId", data.tenantId);
        this.$set(this.ruleForm, "beforedoorGroupId", data.doorGroupId);
        this.$set(this.ruleForm, "beforedoorGroupName", data.doorGroupName);
        this.$set(this.ruleForm, "beforeTenantName", data.tenantName);
        this.$set(this.ruleForm, "tenantName", data.tenantName);
        this.$set(this.ruleForm, "deviceName", data.name);
        this.$set(this.ruleForm, "deviceSn", data.serialNumber);
        this.$set(this.ruleForm, "deviceIp", data.ip);
        this.$set(this.ruleForm, "deviceModel", data.model);
        this.$set(this.ruleForm, "devicepPosition", data.location);
        this.$set(this.ruleForm, "doorGroupId", data.doorGroupName);
        this.$set(this.ruleForm, "devicePassward", data.password);
      });
    },
    /**
     * 获取所有门组
     */
    getAllDoorGroups() {
      let dto = {
        pageNum: 1,
        pageSize: 99999999
      };
      let _this = this;
      this.post("/doorGroup/page/query", dto).then(res => {
        console.log("/doorGroup/page/query", res);

        res.list.forEach(item => {
          item.label = item.name;
          item.value = item.id;
        });

        this.selectOps.AllDoorGroups = res.list;
        console.log("/doorGroup/page/query", res);
      });
    },

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

        this.selectOps.AllTenants = res.data.data.list;

        console.log("/tenant/page/query", res.data.data.list);
      });
    },
    /**
     *编辑设备
     */

    editDevice() {
      let tenantId =
        this.ruleForm.tenantId === this.ruleForm.beforetenantId
          ? this.ruleForm.beforetenantId
          : this.ruleForm.tenantId;
      //   console.log(
      //     "this.ruleForm.tenantId ",
      //     this.ruleForm.tenantId,
      //     this.ruleForm.beforetenantId
      //   );

      //   let doorGroupId =
      //     this.ruleForm.doorGroupId === this.ruleForm.beforedoorGroupId
      //       ? this.ruleForm.beforedoorGroupId
      //       : this.ruleForm.doorGroupId;

      //   undone 还需要增加关联门组字段，接口,修改租户不生效
      let dto = {
        id: this.$route.params.id,
        ip: this.ruleForm.deviceIp,
        location: this.ruleForm.devicepPosition,
        model: this.ruleForm.deviceModel,
        name: this.ruleForm.deviceName,
        password: this.ruleForm.devicePassward,
        serialNumber: this.ruleForm.deviceSn,
        tenantId: tenantId,
        doorGroupId: this.ruleForm.doorGroupId
      };

      console.log("dto", dto, this.ruleForm);

      this.post("/device/update", dto, {
        isUseResponse: true
      }).then(res => {
        console.log("/device/update", res);
        if (res.data.code === 0) {
          this.$message({
            showClose: true,
            message: "编辑设备成功",
            type: "success"
          });

          this.$back();
        }
      });
    },
    submitForm(formName) {
      console.log("submitForm!", this.ruleForm);

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editDevice();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="scss">
</style>


