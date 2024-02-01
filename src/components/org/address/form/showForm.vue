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

$leftWidth: 220px;

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
      margin-bottom: 5px;
    }

    .el-form-item__label {
      font-size: 12px
    }
  }
}

.el-form .el-select {
  display: block;
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
      <div class="content-left">
        <h2 class="clearfix right-title">查看仓库信息</h2>
        <ul>
          <div v-if="form" class="btn-submit-save">
            <perm label="addressInfo-forbid">

            </perm>
            <div v-show="form.status==='0'||form.status==='1'" v-has="'address-manage-stop'"
                 style="margin-bottom: 10px">
              <el-button :plain="true" style="width: 100px" type="danger"
                         @click.prevent.stop="remove()"> 停用
              </el-button>
            </div>
            <div v-show="form.status==='0'||form.status==='1'" v-has="'address-manage-stop'"
                 style="margin-bottom: 10px">
              <el-button :plain="true" style="width: 100px" type="danger"
                         @click.prevent.stop="bizForbid()"> 业务停用
              </el-button>
            </div>
            <div v-show="form.status==='2'||form.status==='3'" v-has="'address-manage-start'"
                 style="margin-bottom: 10px">
              <el-button :plain="true" style="width: 100px" type="success"
                         @click.prevent.stop="start()">
                启用
              </el-button>
            </div>
            <div v-has="'address-manage-audit'">
              <div v-show="form.status==='0'&&form.auditedStatus==='0'" style="margin-bottom: 10px">
                <el-button :plain="true" style="width: 100px" type="warning"
                           @click.prevent.stop="audited()">审核通过
                </el-button>
              </div>
              <div v-show="form.status==='0'&&form.auditedStatus==='0'" style="margin-bottom: 10px">
                <el-button :plain="true" style="width: 100px" type="warning"
                           @click.prevent.stop="notAudited()">
                  审核不通过
                </el-button>
              </div>
            </div>
            <div style="margin-bottom: 10px">
              <el-button style="width: 100px" @click.prevent.stop="doClose">关闭</el-button>
            </div>
          </div>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <h3>查看仓库信息</h3>
        <div>
          <el-form ref="storeform" :model="form" :rules="rules" label-width="130px">
            <div :class="{'show-content' : index==0}" class="hide-content">
              <el-form-item label="仓库名称:">
                {{ form.name }}
                <el-tag v-show="form.default" type="primary">默认</el-tag>
              </el-form-item>
              <el-form-item label="仓库类型:">
                {{ warehouseType(form) }}
              </el-form-item>
              <el-form-item label="仓库地址类型:">
                <dict :dict-group="'orgAddress'" :dict-key="formatAddress(form)"></dict>
              </el-form-item>
              <el-form-item label="所属单位:">
                {{ form.orgName }}
              </el-form-item>
              <el-form-item v-if="form.warehouseType==='0'" label="所属物流公司:">
                {{ form.warehouseSourceFirmName }}
              </el-form-item>
              <el-form-item v-if="form.warehouseType==='0'" label="物流中心仓库名称:">
                {{ form.logisticsAddressName }}
              </el-form-item>
              <el-form-item v-if="form.warehouseType==='0'" label="物流中心仓库编码:">
                {{ form.logisticsAddressCode }}
              </el-form-item>

              <el-form-item v-if="form.warehouseType==='2'" label="物流中心名称:">
                {{ form.logisticsCentreName }}
              </el-form-item>
              <el-form-item v-if="form.warehouseType==='2'" label="物流中心编码:">
                {{ form.logisticsCentreCode }}
              </el-form-item>
              <el-form-item label="联系人:">
                {{ form.contact }}
              </el-form-item>
              <el-form-item label="联系人手机:">
                {{ form.telephone }}
              </el-form-item>
              <el-form-item label="所在地区:">
                {{ storeAddress(form) }}
              </el-form-item>
              <el-form-item label="详细地址:">
                {{ form.detail }}
              </el-form-item>
              <el-form-item v-show="form.accuracy" label="经纬度:">
                经度:{{ form.accuracy }} 维度:{{ form.dimension }}
              </el-form-item>
              <map-location ref="bdMap" :location="location" map-id="showMap"
                            @changeAddress="changeAddress"></map-location>
            </div>
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
        dimension: ''
      },
      orgList: [],
      customerList: [],
      options: utils.address,
      selectOptions: [],
      rules: {},
      doing: false,
      detailAddress: {},
      showMap: false,
      query: '',
      location: '',
      index: 0
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
    }
  },
  computed: {
    'dictAddress': function () {
      return this.$getDict('orgAddress');
    }
  },
  methods: {
    formatAddress: function (item) {
      if (item.type === null) return '';
      return item.type + '';
    },
    remove: function () {
      this.$confirm('确认停用仓库"' + this.form.name + '"?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Address.forbid(this.form.id).then(() => {
          this.$notify.success({
            title: '成功',
            message: '已成功停用仓库"' + this.form.name + '"'
          });
          this.$emit('change', this.form);
          this.$emit('right-close', this.form);
        }).catch(error => {
          this.$notify.error({
            duration: 2000,
            message: error.response && error.response.data && error.response.data.msg || '停用仓库失败'
          });
        });
      });
    },
    bizForbid: function () {
      this.$confirm('确认业务停用仓库"' + this.form.name + '"?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Address.bizForbid(this.form.id).then(() => {
          this.$notify.success({
            title: '成功',
            message: '已经业务停用仓库"' + this.form.name + '"'
          });
          this.$emit('change', this.form);
          this.$emit('right-close', this.form);
        }).catch(error => {
          this.$notify.error({
            duration: 2000,
            message: error.response && error.response.data && error.response.data.msg || '业务停用仓库失败'
          });
        });
      });
    },
    start: function () {
      this.$confirm('确认启用仓库"' + this.form.name + '"?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Address.start(this.form.id).then(() => {
          this.$notify.success({
            title: '成功',
            message: '已成功启用仓库"' + this.form.name + '"'
          });
          this.$emit('change', this.form);
          this.$emit('right-close', this.form);
        }).catch(error => {
          this.$notify.error({
            duration: 2000,
            message: error.response && error.response.data && error.response.data.msg || '启用仓库失败'
          });
        });
      });
    },
    audited: function () {
      this.$confirm('确认通过仓库"' + this.form.name + '"审核?', '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Address.check(this.form.id, {status: '1'}).then(() => {
          this.$notify.success({
            duration: 2000,
            title: '成功',
            message: '审核仓库"' + this.form.name + '"成功'
          });
          this.$emit('change', this.form);
          this.$emit('right-close', this.form);
        }).catch(() => {
          this.$notify.error({
            duration: 2000,
            message: '审核仓库"' + this.form.name + '"失败'
          });
        }).catch(error => {
          this.$notify.error({
            duration: 2000,
            message: error.response && error.response.data && error.response.data.msg || '审核仓库失败'
          });
        });
      }).catch(() => {
      });
    },
    notAudited: function () {
      this.$confirm('确认不通过仓库"' + this.form.name + '"的审核?', '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Address.check(this.form.id, {status: '2'}).then(() => {
          this.$notify.success({
            duration: 2000,
            title: '成功',
            message: '仓库"' + this.form.name + '审核未通过'
          });
          this.$emit('change', this.form);
          this.$emit('right-close', this.form);
        }).catch(() => {
          this.$notify.error({
            duration: 2000,
            message: '仓库"' + this.form.name + '"审核未通过失败'
          });
        });
      }).catch(() => {

      });
    },
    storeAddress(item) {
      let province = item.province;
      let city = item.city;
      let region = item.region;
      return utils.formatAddress(province, city, region);
    },
    warehouseType(item) {
      let w = this.$store.state.warehouseType.find(f => f.key === item.warehouseType);
      return w && w.label || w;
    },
    filterCustomer: function (query) {// 过滤客户
      let params = {
        keyWord: query
      };
      BaseInfo.query(params).then(res => {
        this.customerList = res.data.list;
      });
    },
    formatLocation() {
      this.location = this.form.city;
      this.clear();
    },
    clear() {
      const that = this.$refs['bdMap'];
      if (that) {
        that.markers = [];
        const elMapSearch = that.$refs['elMapSearch'];
        if (elMapSearch) {
          elMapSearch.keyword = '';
          elMapSearch.tips = [];
        }
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
      if (that) {
        that.getLgtAndLat(this.form.detail, result => {
          let geoCodes = result.geocodes;
          if (geoCodes.length) {
            that.onSearchResult([
              {lng: geoCodes[0].location.getLng(), lat: geoCodes[0].location.getLat()}
            ]);
          }
        });
      }
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
    initFormValue: function () {
      this.formatLocation();
      this.detailAddress = {};
      this.selectOptions = [];
      this.orgList = [];
      if (this.formItem.id) {
        this.orgList.push({
          id: this.formItem.warehouseSourceFirm,
          name: this.formItem.warehouseSourceFirmName
        });
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
          dimension: ''
        };
      }
    },
    doClose: function () {
      this.$emit('right-close');
      this.$refs['storeform'].resetFields();
    }
  }
};
</script>
