<template>
  <el-dialog title="楼层详情" :visible.sync="visible" width="600px" :close-on-click-modal="false" @open="open" @closed="cloesd">
    <el-form ref="form" :model="model" :rules="rules" :disabled="!edit" label-width="80px">
      <el-form-item label="类型" prop="type">
        <el-radio v-model="model.type" :label="1">楼栋</el-radio>
        <el-radio v-model="model.type" :label="2">楼层</el-radio>
      </el-form-item>
      <el-form-item v-if="model.type === 2" label="所在楼栋" prop="upFloor">
        <el-select v-model="model.upFloor">
          <el-option v-for="floor in floors" :key="floor.id" :value="floor.id" :label="floor.floorName"/>
        </el-select>
      </el-form-item>
      <el-form-item label="名称" prop="floorName">
        <el-input v-model="model.floorName"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="model.sort" :min="1" :max="2147483647"
          @blur="numberBlur($event, 'sort')"></el-input-number>
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input v-model="model.memo"></el-input>
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
  import { createFloorStructure, modifyFloorStructure, queryFloorStructure } from '@/api/hospital/equipment';

  const model = {
    id: null,
    type: 1,
    upFloor: '',
    floorName: '',
    sort: '',
    memo: ''
  };

  const rules = {
    type: [{
      trigger: 'change',
      required: true,
      message: '类型不能为空'
    }],
    floorName: [{
      trigger: 'blur',
      required: true,
      message: '名称不能为空'
    }],
    upFloor: [{
      trigger: 'blur',
      required: true,
      message: '所在楼栋不能为空'
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
    name: 'StructureForm',
    data() {
      return {
        model: { ...model },
        rules: { ...rules },
        floors: []
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
      }
    },
    methods: {
      open() {
        this.queryFloorStructure();
        this.form && Object.assign(this.model, this.form);
      },
      cloesd() {
        Object.assign(this.model, model);
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      },
      numberBlur(event, field) {
        let elm = event.target;
        if (elm.value !== '') {
          return;
        }
        this.model[field] = Number(elm.attributes.min?.value || 0);
      },
      queryFloorStructure() {
        queryFloorStructure({
          type: 1
        }).then(res => {
          this.floors = res.data;
        });
      },
      async submit() {
        try {
          await this.$refs.form.validate();
          if (this.model.type === 1){
            this.model.upFloor = 0;
          }
          if (this.model.id) {
            await modifyFloorStructure(this.model);
          } else {
            await createFloorStructure(this.model);
          }
          this.$message.success('楼层保存成功');
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
