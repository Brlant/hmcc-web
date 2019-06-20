<style lang="scss" scoped>


</style>
<template>

  <dialog-template :btnSavePosition="90">
    <template slot="title">{{actionType}}{{title}}</template>
    <template slot="btnSave">
      <el-button type="primary" plain @click="onSubmit('wform')" :disabled="doing">保存</el-button>
    </template>
    <template slot="content">
      <el-form ref="wform" :model="form" :rules="rules" :label-width="labelWidth">
        <div v-show="!editBackgroundUrl">
          <el-form-item label="编码" prop="warehouseCode">
            <oms-input type="text" v-model="form.warehouseCode" placeholder="请输入编码"/>
          </el-form-item>
          <two-column>
            <template slot="left">
              <el-form-item label="状态">
                <el-switch active-text="启用" active-value="1" inactive-value="0" v-model="form.activeFlag"
                           inactive-text="停用"></el-switch>
              </el-form-item>
            </template>
          </two-column>
          <div v-show="type === '0' " class="mb-10">
            <el-form-item>
              <span v-show="form.longitude">经度:{{form.longitude}} 维度:{{form.latitude}}</span>
            </el-form-item>
            <map-location ref="bdMap" @changeAddress="changeAddress"></map-location>
          </div>
        </div>
      </el-form>
    </template>
  </dialog-template>
</template>

<script>
  import MapLocation from '@/components/common/map-location';
  import {CcsWarehouse} from '@/resources';

  export default {
    components: {MapLocation},
    data: function () {
      return {
        labelWidth: '90px',
        form: {
          warehouseCode: '',
          warehouseType: '',
          warnStatus: '0',
          latitude: '',
          longitude: '',
          activeFlag: '1'
        },
        rules: {
          warehouseCode: [
            {required: true, message: '请输入编码', trigger: 'blur'}
          ],
          warehouseType: [
            {required: true, message: '请选择类型', trigger: 'change'}
          ]
        },
        doing: false,
        typeList: [
          {label: '物流中心', key: '0'},
          {label: '仓库', key: '1'},
          {label: '库区', key: '2'}
        ],
        actionType: '添加',
        title: '物流中心'
      };
    },
    computed: {},
    props: {
      formItem: Object,
      type: String,
      editBackgroundUrl: Boolean
    },
    watch: {
      formItem: function (val) {
        this.$refs['wform'].clearValidate();
        if (val.id) {
          this.form = Object.assign({}, val);
          this.actionType = '编辑';
          if (this.type === '0') {
            this.setMarker();
          }
        } else {
          this.form = Object.assign({
            warehouseCode: '',
            warehouseType: '',
            warnStatus: '0',
            latitude: '',
            longitude: '',
            activeFlag: '1'
          }, val);
          this.actionType = '添加';
        }
      },
      type(val) {
        if (!val) return;
        this.title = this.typeList[val].label;
      }
    },
    methods: {
      setMarker() {
        if (!this.form.longitude) return;
        const that = this.$refs['bdMap'];
        that.onSearchResult([
          {lng: this.form.longitude, lat: this.form.latitude}
        ]);
      },
      changeAddress(poi) {
        if (poi[0]) {
          this.form.longitude = poi[0].lng;
          this.form.latitude = poi[0].lat;
        }
      },
      onSubmit: function (formName) {
        this.form.warehouseType = this.type;
        if (this.type === '1') {
          this.form.parentId = this.$route.params.id;
        }
        this.$refs[formName].validate((valid) => {
            if (!valid || this.doing) return;
            if (this.type === '0') {
              if (!this.form.longitude) {
                this.$notify.info({
                  message: '请选取经纬度'
                });
                return;
              }
            }
            if (!this.form.id) {
              this.doing = true;
              this.$httpRequestOpera(CcsWarehouse.save(this.form), {
                successTitle: '添加成功',
                errorTitle: '添加失败',
                success: res => {
                  this.doing = false;
                  this.$emit('refresh', this.form, this.type, 1);
                },
                error: () => {
                  this.doing = false;
                }
              });
            } else {
              this.$httpRequestOpera(CcsWarehouse.update(this.form.id, this.form), {
                successTitle: '修改成功',
                errorTitle: '修改失败',
                success: res => {
                  this.doing = false;
                  this.$emit('refresh', this.form, this.type, 0);
                },
                error: () => {
                  this.doing = false;
                }
              });
            }
          }
        );
      }
    }

  };
</script>
