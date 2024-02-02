<template>
  <el-dialog title="基站详情" :visible.sync="visible" width="450px" :close-on-click-modal="false" @open="open" @closed="cloesd">
    <el-form ref="form" :model="model" :rules="rules" :disabled="!edit" label-width="90px">
      <el-form-item label="产品类型" prop="productId">
        <el-select v-model="model.productId" placeholder="产品类型">
          <el-option v-for="item in products" :key="item.productKey"
            :value="item.productKey" :label="item.productName"/>
        </el-select>
      </el-form-item>
      <el-form-item label="基站类型" prop="stationType">
        <el-select v-model="model.stationType" placeholder="基站类型">
          <el-option v-for="item in baseStationTypes"
            :key="item.key" :value="item.key" :label="item.label"/>
        </el-select>
      </el-form-item>
      <el-form-item label="基站名称" prop="stationName">
        <el-input v-model="model.stationName" maxlength="20" placeholder="基站名称"/>
      </el-form-item>
      <el-form-item label="标签SN号" prop="tagSn">
        <el-input v-model="model.tagSn" maxlength="20" placeholder="标签SN号"/>
      </el-form-item>
      <el-form-item label="MAC地址" prop="macAddr">
        <el-input v-model="model.macAddr" maxlength="12" placeholder="MAC地址"/>
      </el-form-item>
      <el-form-item label="所属楼栋" prop="floorId">
        <el-select v-model="model.floorId" @change="floorChange" placeholder="所属楼栋">
          <el-option v-for="item in floors" :key="item.id" :value="item.id" :label="item.floorName"/>
        </el-select>
      </el-form-item>
      <el-form-item label="所属楼层" prop="storeyId">
        <el-select v-model="model.storeyId" @change="storeyChange" placeholder="所属楼层">
          <el-option v-for="item in storeys" :key="item.id" :value="item.id" :label="item.floorName"/>
        </el-select>
      </el-form-item>
      <el-form-item label="所属区域" prop="pointId">
        <el-select v-model="model.pointId" placeholder="所属区域">
          <el-option v-for="point in points" :key="point.id" :value="point.id" :label="point.pointName"/>
        </el-select>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button v-if="!edit" @click="visible = false">关闭</el-button>
      <template v-else>
        <el-button type="info" @click="visible = false">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </template>
    </template>
  </el-dialog>
</template>

<script>
  import { createBaseStation, modifyBaseStation, queryProduct, queryFloorStructure, queryPointByFloorId } from '@/api/hospital/equipment';

  const model = {
    id: null,
    status: 1,
    productId: null,
    stationType: null,
    productName: null,
    stationName: null,
    tagSn: null,
    macAddr: null,
    floorId: null,
    storeyId: null,
    pointId: null
  };

  const rules = {
    productId: [{
      trigger: 'change',
      required: true,
      message: '产品类型不能为空'
    }],
    stationType: [{
      trigger: 'change',
      required: true,
      message: '基站类型不能为空'
    }],
    stationName: [{
      trigger: 'blur',
      required: true,
      message: '基站名称不能为空'
    }],
    tagSn: [{
      trigger: 'blur',
      required: true,
      message: '标签SN号不能为空'
    }, {
      trigger: 'blur',
      pattern: /^[0-9a-zA-Z]+$/,
      message: '标签SN号只能填写字母或者数字'
    }],
    macAddr: [{
      trigger: 'blur',
      required: true,
      message: 'MAC地址不能为空'
    }, {
      trigger: 'blur',
      pattern: /^[0-9a-zA-Z]+$/,
      message: 'MAC地址只能填写字母或者数字'
    }],
    floorId: [{
      trigger: 'change',
      required: true,
      message: '所属楼栋不能为空'
    }],
    storeyId: [{
      trigger: 'change',
      required: true,
      message: '所属楼层不能为空'
    }],
    pointId: [{
      trigger: 'change',
      required: true,
      message: '所属区域不能为空'
    }]
  };

  export default {
    props: {
      show: {
        type: Boolean,
        default: false
      },
      edit: Boolean,
      form: Object
    },
    name: 'BaseStationForm',
    data() {
      return {
        model: { ...model },
        rules: { ...rules },
        floors: [],
        storeys: [],
        products: [],
        points: []
      };
    },
    computed: {
      visible: {
        get() {
          return this.show;
        },
        set(visible) {
          this.$emit('update:show', visible);
        }
      },
      baseStationTypes() {
        return this.$getDict('base_station_type')
      },
      baseStationStatus() {
        return this.$getDict('base_station_status')
      }
    },
    watch: {
      'model.productId'(val) {
        this.model.productName = this.products.find(item => item.productKey === val)?.productName;
      },
      // 'model.floorId'(val) {
      //   queryFloorStructure({
      //     type: 2,
      //     upFloor: val
      //   }).then(res => {
      //     if (res.code !== 200) {
      //       return this.$message.error(res.msg || '查询楼层失败');
      //     }
      //     this.storeys = res.data;
      //   });
      // },
      // 'model.storeyId'(val) {
      //   queryPointByFloorId({
      //     id: val
      //   }).then(res => {
      //     if (res.code !== 200) {
      //       return this.$message.error(res.msg || '查询区域失败');
      //     }
      //     this.points = res.data;
      //   });
      // },
    },
    methods: {
      open() {
        this.queryProduct();
        this.queryFloorStructure();
        if (this.form) {
          Object.assign(this.model, this.form);
          this.form.floorId && this.floorChange(this.form.floorId, true);
          this.form.storeyId && this.storeyChange(this.form.storeyId, true);
        }
      },
      cloesd() {
        Object.assign(this.model, model);
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      },
      queryProduct() {
        queryProduct().then(res => {
          this.products = res.data;
        });
      },
      queryFloorStructure() {
        queryFloorStructure({
          type: 1
        }).then(res => {
          this.floors = res.data;
        });
      },
      floorChange(selected, flg) {
        if (!flg) {
          this.points = [];
          this.model.pointId = null;
          this.model.storeyId = null
        }
        queryFloorStructure({
          type: 2,
          upFloor: selected
        }).then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.msg || '查询楼层失败');
          }
          this.storeys = res.data;
        });
      },
      storeyChange(selected, flg) {
        if (!flg) {
          this.model.pointId = null;
        }
        queryPointByFloorId({
          id: selected
        }).then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.msg || '查询区域失败');
          }
          this.points = res.data;
        });
      },
      async submit() {
        try {
          await this.$refs.form.validate();
          if (this.model.id) {
            await modifyBaseStation(this.model);
          } else {
            await createBaseStation(this.model);
          }
          this.$message.success('基站保存成功');
          this.$emit('refresh');
          this.visible = false;
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-form .el-form-item ::v-deep .el-form-item__content {
    .el-select {
      width: 100%;

      .el-input.is-disabled .el-input__suffix .el-select__caret{
        cursor: default;
      }
    }

    input[disabled], .el-radio .el-radio__label {
      cursor: default;
      color: #606266;
      background-color: #ffffff;
    }

    .el-input-number.is-disabled {

      > span {
        cursor: default;
      }
    }

    .el-radio .el-radio__input.is-disabled {

      cursor: default;
      color: #606266;
      background-color: #ffffff;

      .el-radio__inner {
        cursor: default;
        color: #606266;
        background-color: #ffffff;

        &:after {
          cursor: default;
          background-color: #606266;
        }
      }
    }
  }
</style>
