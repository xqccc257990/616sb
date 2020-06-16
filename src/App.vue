<template>
  <div class="app">
    <keep-alive>
      <router-view v-if="!$route.meta.isNotKeep"></router-view>
    </keep-alive>
    <router-view v-if="$route.meta.isNotKeep"></router-view>
  </div>
</template>
<script>
export default {
  created() {
    console.log("App created!!");
  }
};
</script>
<style lang="scss">
.danger-rows {
  background: #ff8282 !important;
  color: #000;
}
.app {
  height: 100%;

  .action-but {
    padding-left: 120px;
    text-align: center;
  }

  .action-but {
    .el-button {
      width: 180px;
    }
  }

  .el-table__row:hover {
    background-color: #e3f2fd;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: initial;
  }
  .el-switch__label {
    color: #909399;
  }
  .el-form-item__label {
    padding: 0 8px 0 0;
  }

  .el-input.is-disabled .el-input__inner,
  .el-textarea.is-disabled .el-textarea__inner {
    border-color: #dcdfe6;
    color: #303133;
    cursor: default;
  }

  .el-button.is-disabled {
    -webkit-user-select: text;
    cursor: default;
  }

  .upload-disabled {
    .el-upload--picture-card {
      display: none;
    }
  }

  .el-upload-list__item {
    -webkit-transition: none;
    transition: none;
  }

  .el-switch.is-disabled {
    opacity: initial;
  }

  .el-tag--info,
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #409eff;
  }

  .el-select .el-tag {
    background-color: #e4e7ed;
  }

  .el-checkbox.is-bordered.is-checked {
    border-color: #409eff;
  }

  .el-checkbox.is-bordered.is-checked,
  .el-checkbox__input.is-checked + .el-checkbox__label,
  .el-checkbox__input.is-disabled .el-checkbox__inner,
  .el-select .el-input.is-disabled .el-input__inner,
  .el-cascader.is-disabled .el-cascader__label,
  .el-checkbox__input.is-disabled .el-checkbox__inner::after {
    cursor: default;
  }

  .el-select {
    display: block;
  }

  .el-checkbox.is-bordered.el-checkbox--small {
    margin-right: 10px;
  }

  .el-checkbox.is-bordered + .el-checkbox.is-bordered {
    margin-left: 0;
  }

  .el-cascader {
    width: 100%;
  }

  .el-cascader.is-disabled .el-cascader__label {
    color: #303133;
  }

  .success-row {
    background: #f0f9eb !important;
  }

  .danger-row:hover {
    background: #e8ffdc !important;
  }

  .warning-row {
    background-color: #fdf5e6 !important;
  }

  .warning-row {
    background-color: #fff2da !important;
  }

  .danger-row {
    background-color: #fdebeb !important;
  }

  .danger-row:hover {
    background-color: #ffe2e2 !important;
  }
}
.el-message-box__message {
  img {
    width: 100% !important;
  }
}
</style>
