<template>
  <div class="delivery-detail">
    <app-header title="新增发货" :isShowBack="datas.isShowBack" v-if="1"></app-header>
    <div style="width:80%;display:flex;justify-content:center">
      <el-form
        :inline="false"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="租户名称" prop="tenantName">
          <el-col :span="22">
            <el-select filterable v-model="ruleForm.tenantName" placeholder="请选择设备名称">
              <el-option
                v-for="item in selectOps.AllTenants"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="设备型号" prop="DeviceModel">
          <el-col :span="22">
            <el-select filterable v-model="ruleForm.DeviceModel" placeholder="请选择设备型号">
              <el-option
                v-for="item in selectOps.AllDeviceModels"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item size="mini">
          提示：支持外接扫描枪
          (扫描设备SN号编码)
        </el-form-item>
        <el-form-item label="设备SN" prop="deviceSn">
          <el-col :span="22">
            <el-input v-model="ruleForm.deviceSn" palceholder="请输入设备SN"></el-input>
          </el-col>
          <el-col :span="2">
            <span class="el-icon-plus" @click="addItem"></span>
          </el-col>
        </el-form-item>

        <div v-for="(item, index) in  deviceSndatas.items" :key="index">
          <el-form-item label="设备SN" prop>
            <el-col :span="22">
              <el-input v-model="item.deviceSn" palceholder="请输入设备SN"></el-input>
            </el-col>
            <el-col :span="2">
              <i class="el-icon-delete" @click="deleteItem(item, index)"></i>
            </el-col>
          </el-form-item>
        </div>
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
    let _this = this;
    return {
      datas: {
        isShowBack: true
      },
      rules: {
        tenantName: [
          { required: true, message: "请输入输入名称", trigger: "blur" }
        ],
        deviceSn: [
          { required: true, message: "请输入设备SN", trigger: "blur" }
        ],
        DeviceModel: [
          { required: true, message: "请输入设备型号", trigger: "blur" }
        ]
      },
      ruleForm: {
        deviceName: "",
        deviceSn: "",
        DeviceModel: ""
      },
      selectOps: {
        AllTenants: [],
        AllDeviceModels: []
      },
      deviceSndatas: {
        items: []
      }
    };
  },
  created() {
    this.getAllTenants();
    this.getAllDeviceModels();
  },
  activated() {
    console.log("发货-add activated!!");

    this.ruleForm = {
      deviceName: "",
      deviceSn: ""
    };
    this.deviceSndatas = {
      items: []
    };
  },
  deactivated() {},
  methods: {
    submitForm(formName) {
      console.log("submitForm!", this.deviceSndatas, this.ruleForm);

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.adddeviceTenant();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    addItem() {
      this.deviceSndatas.items.push({
        deviceSn: ""
      });
    },
    deleteItem(item, index) {
      this.deviceSndatas.items.splice(index, 1);
    },

    /**
     * 获取设备型号
     */

    getAllDeviceModels() {
      this.get("/device/getAllDeviceModel", {
        isUseResponse: true
      }).then(res => {
        let tempArray = [];

        console.log("/device/getAllDeviceModel", res);
        for (var i = 0; i < res.length; i++) {
          tempArray.push({
            value: res[i],
            label: res[i]
          });
        }
        console.log("/device/getAllDeviceModel", tempArray);

        this.selectOps.AllDeviceModels = tempArray;
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

        console.log("/tenant/page/query", res);
      });
    },
    /**
     * 新增发货
     */

    adddeviceTenant() {
      let tempArray = this.deviceSndatas.items.map(item => item.deviceSn);
      let tempArray2 = tempArray.filter(item => item != "");
      tempArray2.push(this.ruleForm.deviceSn);

      let dto = {
        model: this.ruleForm.DeviceModel,
        serialNumberList: tempArray2,
        tenantId: this.ruleForm.tenantName
      };
      console.log("dto", dto, tempArray2, this.ruleForm.deviceSn);

      this.post("/deviceTenant/add", dto, {
        isUseResponse: true
      }).then(res => {
        console.log("/deviceTenant/add", res);
        if (res.data.code === 0) {
          this.$message({
            showClose: true,
            message: "新增发货成功",
            type: "success"
          });

          this.$back();
        }
      });
    }
  }
};
</script>

