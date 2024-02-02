<template>
  <el-dialog :title="titleDetail" :visible="addEditVisible" width="450px" :close-on-click-modal="false"
             :before-close="closeDetail">
    <el-form :model="formData" ref="form" :rules="rules" :disabled="!edit">
      <el-form-item label="产品类型" prop="productType" label-width="80px">
        <el-select v-model="formData.productType"
                   placeholder="请选择产品类型"
                   remote
                   filterable
                   :remote-method="getProductTypeList"
                   @clear="clearProductTypeList"
                   clearable>
          <el-option
            v-for="(item,index) in productTypeList"
            :key="index"
            :label="item.productName"
            :value="item.productKey"
          />
          <!--&lt;!&ndash;          如果productTypeList循环对比的值是空值，需要在el-option中添加 :label="productName" &ndash;&gt;-->
          <!--          <el-option v-if="!productTypeList.some(list=> list.productKey === formData.productType)"-->
          <!--                     :value="formData.productType"-->
          <!--                     :label="productNameKey"-->
          <!--          ></el-option>-->
        </el-select>
      </el-form-item>
      <el-form-item label="标签类型" prop="tagType" label-width="80px">
        <el-select v-model="formData.tagType" placeholder="请选择产品类型" clearable>
          <el-option
            v-for="(item,index) in labelTypeList"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="标签名称" prop="tagName" label-width="80px">
        <el-input v-model="formData.tagName" maxlength="20" show-word-limit placeholder="请输入标签名称"></el-input>
      </el-form-item>
      <el-form-item label="标签SN号" prop="tagSnNumber" label-width="80px">
        <el-input v-model="formData.tagSnNumber" maxlength="20" show-word-limit placeholder="请输入标签SN号"
                  @change="handleTagSnNumberMacAddress($event,1)"></el-input>
      </el-form-item>
      <el-form-item label="MAC地址" prop="macAddress" label-width="80px">
        <el-input v-model="formData.macAddress" maxlength="12" show-word-limit placeholder="请输入MAC地址"
                  @change="handleTagSnNumberMacAddress($event,2)"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button v-if="!edit" @click="closeDetail">关闭</el-button>
      <template v-else>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="closeDetail">返回</el-button>
      </template>
    </div>
  </el-dialog>
</template>

<script>
import {sinopharmDictDataType} from '@/api/system/dict/data'
import labelTagList from '@/api/label/label'

export default {
  name: 'formLabel',
  props: {
    titleDetail: {
      type: String,
    },
    addEditVisible: {
      type: Boolean,
    },
    detailForm: {
      type: Object
    },
    edit: Boolean,
  },
  watch: {
    detailForm: {
      handler(val) {
        if (val.id) {
          this.formData = {...val}
          if (this.formData.productType) {
            this.getProductTypeByKey(this.formData.productType);
          }
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      tagSnNumberMacError: '',
      formData: {
        id: '',
        productType: '',           //产品类型
        tagType: "",               //标签类型
        tagName: "",               //标签名称
        tagSnNumber: "",           //SN号
        macAddress: ""             //MAC地址
      },
      rules: {
        productType: [{required: true, message: '产品类型不能为空', trigger: 'change'}],
        tagType: [{required: true, message: '标签类型不能为空', trigger: 'change'}],
        tagName: [{required: true, message: '标签名称不能为空', trigger: 'blur'}],
        tagSnNumber: [{required: true, message: '标签SN号不能为空', trigger: 'blur'}],
        macAddress: [{required: true, message: 'MAC地址不能为空', trigger: 'blur'}],
      },
      productTypeList: [],//产品类型
      labelTypeList: [],//标签类型
      productName: '',
      productKey: '',
    }
  },
  created() {
    //获取标签类型列表
    this.getLabelTypeList();
    //产品类型
    this.getProductTypeList("");
  },
  methods: {
    /* 查询产品类型 */
    getProductTypeByKey(status) {
      let params = {
        productKey: status
      }
      // this.productTypeList = [];
      labelTagList.productTypeByKey(params).then(res => {
        this.productName = res.data.productName;
        this.productKey = res.data.productKey;

        if (this.formData.productType) {
          if (!this.productTypeList.some(list => list.productKey === this.formData.productType)) {
            //如果不存在的，用this.$set往productTypeList数组中增加this.productName和this.productKey
            this.$set(this.productTypeList, this.productTypeList.length, {
              productKey: this.productKey,
              productName: this.productName
            });
          }
        }
      }).catch(err => {

      })
    },
    /* 产品类型 */
    getProductTypeList(query) {
      const params = {
        productName: query === "" ? " " : query,
      }
      this.productTypeList = [];
      labelTagList.productTypeList(params).then(res => {
        this.productTypeList = res.data.map(item => {
          return {
            productKey: item.productKey,
            productName: item.productName,
          }
        })
        // if(this.formData.productType){
        //   if(!this.productTypeList.some(list=>list.productKey===this.formData.productType)){
        //     //如果不存在的，用this.$set往productTypeList数组中增加this.productName和this.productKey
        //     this.$set(this.productTypeList,this.productTypeList.length,{productKey:this.productKey,productName:this.productName});
        //   }
        // }
      }).catch(err => {
      })
    },
    clearProductTypeList(query) {

    },
    /* 标签sn mac地址 */
    handleTagSnNumberMacAddress(event, state) {
      const params = {
        param: event,
        type: state
      }
      labelTagList.verifyTagLabel(params).then(res => {
        if (state === 1) {
          if (res.data.tagCode === '3') {
            this.$nextTick(() => {
              this.$notify.error(res.data.tip)
              this.tagSnNumberMacError = res.data.tip;
              this.formData.tagSnNumber = '';
            })
          } else {
            this.tagSnNumberMacError = res.data.tip;
          }
        }
        if (state === 2) {
          if (res.data.tagCode === '3') {
            this.$nextTick(() => {
              this.$notify.error(res.data.tip);
              this.tagSnNumberMacError = res.data.tip;
              this.formData.macAddress = '';
            })
          } else {
            this.tagSnNumberMacError = res.data.tip;
          }
        }
      }).catch(err => {

      })
    },
    getLabelTypeList() {
      sinopharmDictDataType('tag_type').then(res => {
        this.labelTypeList = res.data.map(item => {
          return {
            dictLabel: item.dictLabel,
            dictValue: item.dictValue,
            dictSort: item.dictSort,
            id: item.id,
            remark: item.remark,
          }
        })
      }).catch(err => {

      })
    },
    closeDetail() {
      this.formData = {
        productType: '',
        tagType: "",
        tagName: "",
        tagSnNumber: "",
        macAddress: ""
      }
      this.$refs.form.resetFields();
      this.$emit('closeDetail')
    },
    /* 提交 */
    submit() {
      this.$refs.form.validate((validate) => {
        if (validate) {
          this.submitMsg();
        }
      })
    },
    // 提交
    submitMsg() {
      let params = {
        ...this.formData
      }
      if (this.formData.id) {
        labelTagList.editTagLabel(params).then(res => {
          if (res.code === 200) {
            this.$notify.success('编辑成功');
            this.closeDetail();
          }
        })
      } else {
        labelTagList.addTagLabel(params).then(res => {
          if (res.code === 200) {
            this.$notify.success('新增成功');
            this.closeDetail();
          }
        }).catch(err => {

        })
      }

    }
  }

}
</script>

<style lang="scss" scoped>
.el-form .el-form-item ::v-deep .el-form-item__content {
  .el-select {
    width: 100%;

    .el-input.is-disabled .el-input__suffix .el-select__caret {
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
