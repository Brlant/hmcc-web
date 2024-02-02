<style lang="scss" scoped>
.el-form .el-select {
  display: block;
}

.el-form .el-cascader {
  display: block;
}

@import "./../../../../assets/scss/mixins";

.margin-left {
  margin-left: 15px;
}

.margin-left-right {
  margin-left: 38px;
  margin-right: 38px;
}

.power-style-part {
  margin: 12px 0;
  background-color: rgb(238, 238, 238);
  padding: 12px 10px 10px 10px;
}

.el-form .el-checkbox__label {
  font-size: 12px;
  padding-left: 5px;
}

.el-form .el-checkbox__inner {
  width: 14px;
  height: 14px;
}

.customize-input {
  border: 1px solid #ffffff;
  border-radius: 5px;
  width: 240px;
  padding: 4px;

  &:hover {
    border-color: #cccccc;
  }

  &:focus {
    outline: none;
  }
}

.min-row {
  .el-row {
    margin-bottom: 10px;
  }
}

.bill-font {
  font-weight: bold;
}

.borderShow {
  height: 20px;
  border-bottom: 1px solid #777777;
  opacity: 0.2;
  margin-right: 20px;
  margin-bottom: 20px;
}

.title {
  margin-bottom: 5px;
  color: #999999;
  font-weight: normal;
}

.el-form .el-select {
  display: block;
}

.business-scope {
  border: 1px solid #cccccc;
  border-radius: 5px;
  width: 120px;
  height: 40px;
  text-align: center;
  margin-left: 20px;
  margin-bottom: 10px;
  float: left;

  .scope-span {
    position: relative;
    top: 10px;
  }

  .scope-icon {
    position: relative;
    top: 10px;
    right: -28px;
    color: #ffffff;

    &:hover {
      color: rgb(200, 0, 0)
    }
  }
}

.good-selects {
  .el-select-dropdown__item {
    height: auto;
    width: 430px;
  }
}

$leftWidth: 0;

.el-form .el-checkbox__label {
  font-size: 12px;
  padding-left: 5px;
}

.el-form .el-checkbox__inner {
  width: 14px;
  height: 14px;
}

.content-part {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: auto;

  .content-left {
    width: $leftWidth;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    text-align: center;
    background-color: #eef2f3;

    > ul {
      margin: 0;
    }

    > h2 {
      padding: 0;
      margin: 0;
      font-size: 18px;
      font-weight: bold;
      line-height: 55px;
      border-bottom: 1px solid #ddd;
      background-color: #eef2f3;
    }

    .list-style {
      cursor: pointer;
      padding: 10px;
      text-align: center;

      span {
        display: inline-block;
        padding: 8px 35px;
      }

      &.active {
        span {
          background-color: $activeColor;
          border-radius: 20px;
          color: $activeColorFont
        }
      }

      &:hover {
        background: #dee9eb
      }

    }

  }

  .content-right {
    > h3 {
      padding: 0;
      margin: 0 0 20px;
      font-size: 18px;
      font-weight: normal;
      line-height: 55px;
      border-bottom: 1px solid #ddd;
      text-align: center;
      position: fixed;
      top: 0;
      right: 0;
      left: $leftWidth;
      background: #fff;
      z-index: 2;
    }

    position: absolute;
    top: 0;
    left: $leftWidth;
    right: 0;
    bottom: 0;
    overflow: auto;
    padding-top: 75px;

    .hide-content {
      display: none;
    }

    .show-content {
      padding: 0 20px;
      display: block;
    }
  }

  .min-gutter {
    .el-form-item {
      margin-bottom: 20px;
    }

    .el-form-item__label {
      font-size: 12px
    }
  }
}

.el-form .el-select {
  display: block;
}

.table-product-list {
  font-size: 12px;

  > tbody > tr > td, > thead > tr > th {
    padding: 5px;
  }
}

.order-product-box {
  position: relative;
  border-radius: 10px;
  font-size: 12px;
  line-height: 26px;

  .product-info-fix {
    background: #f6f6f6;
    margin-top: 10px;
    padding: 5px;
    margin-bottom: 20px;
  }

  &:hover {
    border-color: #aaa
  }

  .product-remove {
    position: absolute;
    right: 0;
    top: 0;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    cursor: pointer;
    color: #666;

    &:hover {
      color: #333
    }
  }

  .order-goods-info {
    .col-label {
      padding-top: 4px;
    }
  }

}

.product-list-detail {
  margin-top: 20px;
  font-size: 12px;

  h3 {
    background: #eee;
    padding: 10px 15px;
    font-size: 14px;
    font-weight: normal;
  }
}

.ml15 {
  margin-left: 40px;
}

.combinatioon-product {
  color: #777
}

.el-select-dropdown__item {
  height: auto;
}

.productItem-info {
  float: left;
}

.order-good-selects {
  .el-select-dropdown__item {
    height: auto;
    width: 680px;
  }
}

.ar {
  text-align: right;
}

.btn-submit-save {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  text-align: center;
  padding: 15px;
}
</style>
<template>
  <div>
    <div class="content-part">
      <div class="content-right min-gutter">
        <h3>{{ title }}仓库信息</h3>
        <div>
          <el-form ref="storeform" :model="form" :rules="rules" label-width="120px"
                   style="padding-right: 10px;padding-left: 10px">
            <el-form-item label="仓库名称" prop="name">
              <oms-input v-model="form.name" placeholder="请输入仓库名称" type="text"></oms-input>
            </el-form-item>
            <el-form-item label="仓库类型" prop="warehouseType">
              <el-select v-model="form.warehouseType" placeholder="请选择仓库类型" @change="warehouseTypeChange">
                <el-option v-for="item in warehouseTypeList" :key="item.key" :label="item.label" :value="item.key">
                  {{ item.label }}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属单位" prop="orgId">
              <el-select v-model="form.orgId" :clearable="true" :remote-method="filterCustomer" filterable
                         placeholder="请输入名称/拼音首字母缩写/系统代码搜索单位信息" popperClass="good-selects"
                         remote style="width: 100%"
                         @change="orgIdChange" @click.native="filterCustomer('')">
                <el-option v-for="org in customerList" :key="org.id" :label="org.name" :value="org.id">
                  <div style="overflow: hidden">
                    <span class="pull-left" style="clear: right">{{ org.name }}</span>
                  </div>
                  <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                        <span>系统代码:</span>{{ org.manufacturerCode }}
                      </span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <div v-if="form.warehouseType==='0'">
              <el-form-item label="所属物流公司" prop="warehouseSourceFirm">
                <el-select v-model="form.warehouseSourceFirm" :clearable="true" :remote-method="getOrgs" filterable
                           placeholder="请输入关键字搜索物流公司" popperClass="good-selects" remote
                           @change="warehouseSourceFirmChange" @click.native.once="getOrgs('')">
                  <el-option v-for="item in orgList" :key="item.id" :label="item.name"
                             :value="item.id">
                    <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">{{ item.name }}</span>
                    </div>
                    <div style="overflow: hidden">
                    <span v-show="item.followManufacturerCode" class="select-other-info pull-left">
                      <span>系统代码:</span>{{ item.followManufacturerCode }}
                    </span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :rules="[{required: true, message: '请选择物流中心', trigger: 'change'}]" label="物流中心"
                            prop="logisticsAddressId">
                <el-select v-model="form.logisticsAddressId" :clearable="true" :remote-method="queryLogisticsList"
                           filterable
                           placeholder="请输入关键字搜索物流中心" popperClass="good-selects"
                           remote @click.native.once="queryLogisticsList('')">
                  <el-option v-for="item in logisticsCentreList" :key="item.id" :label="item.name"
                             :value="item.id">
                    <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">{{ item.name }}</span>
                    </div>
                    <div style="overflow: hidden">
                      <span v-show="item.logisticsCentreName" class="select-other-info pull-left">
                      <span>物流中心名称:</span>{{ item.logisticsCentreName }}
                    </span>
                      <span v-show="item.logisticsCentreCode" class="select-other-info pull-left">
                      <span>物流中心编码:</span>{{ item.logisticsCentreCode }}
                    </span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div v-if="form.warehouseType==='2'">
              <el-form-item :rules="[{required: true, message: '请输入物流中心名称', trigger: 'blur'}]" label="物流中心名称"
                            prop="logisticsCentreName">
                <oms-input v-model="form.logisticsCentreName" placeholder="请输入物流中心名称" type="text"></oms-input>
              </el-form-item>
              <el-form-item :rules="[{required: true, message: '请输入物流中心编码', trigger: 'blur'}]" label="物流中心编码"
                            prop="logisticsCentreCode">
                <oms-input v-model="form.logisticsCentreCode" placeholder="请输入物流中心编码" type="text"></oms-input>
              </el-form-item>
            </div>
            <el-form-item label="联系人">
              <oms-input v-model="form.contact" placeholder="请输入联系人" type="text"></oms-input>
            </el-form-item>
            <el-form-item label="联系人手机">
              <oms-input v-model="form.telephone" placeholder="请输入联系人手机" type="text"></oms-input>
            </el-form-item>
            <el-form-item label="所在地区">
              <el-cascader v-model="selectOptions" :options="options" placeholder="请选择省市区"></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="detail">
              <oms-input v-model="form.detail" placeholder="建议您如实填写详细地址,例如街道名称,门牌号码等信息" type="text" @blur="isShowMap">
                <el-button slot="append" class="search-button" icon="el-icon-search" type="primary"
                           @click="isShowMap"></el-button>
              </oms-input>
              <span v-show="form.accuracy">经度:{{ form.accuracy }} 维度:{{ form.dimension }}</span>
            </el-form-item>
            <map-location ref="bdMap" :location="location" map-id="editMap"
                          @changeAddress="changeAddress"></map-location>
            <el-form-item label="仓库地址类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择仓库地址类型">
                <el-option v-for="item in dictAddress" :key="item.key" :label="item.label" :value="item.key*1"/>
              </el-select>
            </el-form-item>
            <el-form-item label="默认地址" prop="isuse">
              <el-switch v-model="form.default" active-color="#13ce66" active-text="是" inactive-color="#ff4949"
                         inactive-text="否"></el-switch>
            </el-form-item>
            <el-form-item>
              <el-button :disabled="doing" type="primary" @click="onSubmit('storeform')">保存</el-button>
              <el-button @click="doClose">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {Address, BaseInfo} from '@/resources';
import utils from '@/tools/utils';
import MapLocation from '@/components/common/map-location';

export default {
  components: {MapLocation},
  data: function () {
    let checkPhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号码'));
      } else {
        let re = /^\d{11}$/;
        if (!re.test(value)) {
          callback(new Error('请输入正确的手机号码'));
        } else {
          callback();
        }
      }
    };
    return {
      form: {
        orgId: '',
        name: '',
        contact: '',
        telephone: '',
        warehouseType: '',
        warehouseSourceFirm: '',
        default: false,
        detail: '',
        type: '',
        accuracy: '',
        dimension: '',
        logisticsAddressId: '',
        logisticsCentreCode: '',
        logisticsCentreName: '',
      },
      orgList: [],
      customerList: [],
      options: utils.address,
      selectOptions: [],
      rules: {
        orgId: [
          {required: true, message: '请选择单位', trigger: 'change'}
        ],
        name: [
          {required: true, message: '请输入仓库名称', trigger: 'blur'}
        ],
        contact: [
          {required: true, message: '请输入联系人', trigger: 'blur'}
        ],
//          telephone: [
//            {required: true, message: '请选输入联系人手机', trigger: 'blur'},
//            {validator: checkPhone, trigger: 'blur'}
//          ],
        detail: [
          {required: true, message: '请输入详细地址', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请选择仓库地址类型', trigger: 'change'}
        ],
        warehouseType: [
          {required: true, message: '请选择仓库类型', trigger: 'blur'}
        ],
        warehouseSourceFirm: [
          {required: true, message: '请选择所属物流公司', trigger: 'blur'}
        ]
      },
      doing: false,
      detailAddress: {},
      showMap: false,
      query: '',
      location: '',
      logisticsCentreList: []
    };
  },
  props: ['formItem', 'action', 'actionType'],
  watch: {
    formItem: function () {
      this.initFormValue();
      this.showMap = false;
      this.query = 'search';
      this.$nextTick(() => {
        this.query = '';
      });
      this.location = '';
      if (this.action === 'edit') {
        this.filterCustomer(this.form.orgName);
      }
    },
    selectOptions() {
      this.form.province = this.selectOptions[0];
      this.form.city = this.selectOptions[1];
      this.form.region = this.selectOptions[2];
      this.formatLocation();
    },
    actionType: function (val) {
      if (!val) {
        this.$refs['storeform'].resetFields();
      }
    }
  },
  computed: {
    'dictAddress': function () {
      return this.$getDict('orgAddress');
    },
    title: function () {
      let title = '';
      if (this.action === 'add') {
        title = '新增';
      } else {
        title = '编辑';
      }
      return title;
    },
    warehouseTypeList() {
      return this.$store.state.warehouseType;
    }
  },
  methods: {
    warehouseTypeChange() {
      this.form.warehouseSourceFirm = '';
      this.form.logisticsCentreCode = '';
      this.form.logisticsCentreName = '';
    },
    filterCustomer: function (query) {// 过滤客户
      let params = {
        keyWord: query
      };
      BaseInfo.query(params).then(res => {
        this.customerList = res.data.list;
      });
    },
    orgIdChange(val) {
      this.form.warehouseSourceFirm = '';
      this.orgList = [];
      this.getOrgs();
    },
    formatLocation() {
      this.location = this.form.city;
      this.clear();
    },
    clear() {
      const that = this.$refs['bdMap'];
      that.markers = [];
      const elMapSearch = that.$refs['elMapSearch'];
      if (elMapSearch) {
        elMapSearch.keyword = '';
        elMapSearch.tips = [];
      }
    },
    isShowMap() {
      this.query = '';
      this.$nextTick(() => {
        this.query = this.form.detail;
      });
      this.showMap = true;
      this.getLocation();
    },
    getLocation() {
      const that = this.$refs['bdMap'];
      that.getLgtAndLat(this.form.detail, result => {
        let geoCodes = result.geocodes;
        if (geoCodes.length) {
          that.onSearchResult([
            {lng: geoCodes[0].location.getLng(), lat: geoCodes[0].location.getLat()}
          ]);
        }
      });
    },
    setMarker() {
      const that = this.$refs['bdMap'];
      that.onSearchResult([
        {lng: this.form.accuracy, lat: this.form.dimension}
      ]);
    },
    changeAddress(poi) {
      if (poi[0]) {
        this.form.accuracy = poi[0].lng;
        this.form.dimension = poi[0].lat;
      }
    },
    getOrgs: function (query) {// 过滤销售商商名称列表
      if (this.form.warehouseType !== '0') return;
      let params = {
        keyWord: query,
        orgAuditStatus: '1'
      };
      this.$http.get('/orgs/pager', {params}).then(res => {
        this.orgList = res.data.list;
      });
    },
    warehouseSourceFirmChange(val) {
      this.logisticsCentreList = [];
      this.form.logisticsAddressId = '';
      this.queryLogisticsList()
    },
    queryLogisticsList(query) {
      if (!this.form.warehouseSourceFirm) return this.$notify.info('请选择所属物流公司');
      let params = {
        keyWord: query,
        warehouseType: '2',
        pageSize: 1000,
        orgId: this.form.warehouseSourceFirm
      };
      Address.query(params).then(res => {
        this.logisticsCentreList = res.data.list;
      });
    },
    initFormValue: function () {
      this.formatLocation();
      this.detailAddress = {};
      this.selectOptions = [];
      this.orgList = [];
      if (this.formItem.id) {
        this.orgList = [{
          id: this.formItem.warehouseSourceFirm,
          name: this.formItem.warehouseSourceFirmName
        }];
        this.form = Object.assign({}, this.formItem);
        this.selectOptions.push(this.form.province);
        this.selectOptions.push(this.form.city);
        this.selectOptions.push(this.form.region);
        this.$nextTick(() => {
          if (!this.form.accuracy) {
            this.form.detail && this.getLocation();
          } else {
            this.setMarker();
          }
        });
      } else {
        this.form = {
          orgId: '',
          name: '',
          contact: '',
          telephone: '',
          warehouseType: '1',
          warehouseSourceFirm: '',
          default: false,
          detail: '',
          type: '',
          accuracy: '',
          dimension: '',
          logisticsAddressId: '',
          logisticsCentreCode: '',
          logisticsCentreName: '',
        };
      }
    },
    onSubmit: function (formName) {
      if (!this.form.accuracy) {
        this.$notify.info({
          message: '请搜索详细地址的经纬度'
        });
        return;
      }
      this.$refs[formName].validate((valid) => {
          if (!valid || this.doing) return;
          this.doing = true;
          if (this.action === 'add') {
            Address.save(this.form).then(res => {
              this.doing = false;
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '新增单位地址成功'
              });
              this.$emit('change', this.form);
              this.$emit('right-close', this.form);
            }).catch(error => {
              this.$notify.error({
                duration: 2000,
                message: error.response && error.response.data && error.response.data.msg || '新增单位地址失败'
              });
              this.doing = false;
            });
          } else {
            Address.update(this.form).then(res => {
              this.doing = false;
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '编辑单位仓库地址成功'
              });
              this.$emit('change', this.form);
              this.$emit('right-close', this.form);
            }).catch(error => {
              this.$notify.error({
                duration: 2000,
                message: error.response && error.response.data && error.response.data.msg || '编辑单位仓库地址失败'
              });
              this.doing = false;
            });
          }
        }
      );
    },
    doClose: function () {
      this.$emit('right-close');
      this.$refs['storeform'].resetFields();
    }
  }
};
</script>
