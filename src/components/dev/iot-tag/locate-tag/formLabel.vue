<template>
  <dialog-template :btnSavePosition="100">
    <template slot="title">{{ titleDetail }}</template>
    <template slot="btnSave">
      <el-button v-if="index==2" @click="closeDetail">关闭</el-button>
      <template v-else>
        <el-button type="primary" @click="submit" :loading="doing">提交</el-button>
        <el-button @click="closeDetail">返回</el-button>
      </template>
    </template>
    <template slot="content">
      <el-form :model="formData" ref="form" :rules="rules" :disabled="!edit" label-width="140px">
        <el-form-item label="产品类型" prop="productType">
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
        <el-form-item label="标签类型" prop="tagType">
          <el-select v-model="formData.tagType" placeholder="请选择产品类型" clearable>
            <el-option
              v-for="(item,index) in labelTypeList"
              :key="index"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标签名称" prop="tagName">
          <el-input v-model="formData.tagName" maxlength="20" show-word-limit placeholder="请输入标签名称"></el-input>
        </el-form-item>
        <el-form-item label="标签SN号" prop="tagSnNumber">
          <el-input v-model="formData.tagSnNumber" maxlength="20" show-word-limit placeholder="请输入标签SN号"
                    @change="handleTagSnNumberMacAddress($event,1)" :disabled="index===1"></el-input>
        </el-form-item>
        <el-form-item label="MAC地址" prop="macAddress">
          <el-input v-model="formData.macAddress" maxlength="12" show-word-limit placeholder="请输入MAC地址"
                    @change="handleTagSnNumberMacAddress($event,2)"></el-input>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>

<script>
import {sinopharmDictDataType} from '@/api/system/dict/data'
import labelTagList from '@/api/label/label'
import methodsMixin from '@/mixins/methodsMixin';

export default {
  name: 'formLabel',
  mixins: [methodsMixin],
  props: {
    titleDetail: {
      type: String,
    },
    detailForm: {
      type: Object
    },
    edit: Boolean,
    index: Number,
  },
  watch: {
    detailForm: {
      handler(val) {
        this.doing = false;

        if (val.id) {
          this.formData = {...val}
          if (this.formData.productType) {
            this.getProductTypeByKey(this.formData.productType);
          }
        }else{
          this.formData = {
            id: '',
            productType: '',           //产品类型
            tagType: "",               //标签类型
            tagName: "",               //标签名称
            tagSnNumber: "",           //SN号
            macAddress: ""             //MAC地址
          }

          this.$nextTick(() => {
            this.$refs.form.clearValidate()
          });
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      doing: false,
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
            label: item.label,
            key: item.key,
            dictSort: item.dictSort,
            id: item.id,
            remark: item.remark,
          }
        })
      }).catch(err => {

      })
    },
    closeDetail() {
      this.$refs.form.resetFields();
      this.$emit('closeDetail')
    },
    /* 提交 */
    submit() {
      this.doing = true;
      this.$refs.form.validate((validate) => {
        if (validate) {
          this.submitMsg();
        }else {
          this.doing = false;
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
          } else {
            this.$notify.error(res.msg);
          }
        }).catch(err => {
          this.$notify.error(err.response.data.msg || '提交失败');
        }).finally(() => {
          this.doing = false;
        })
      } else {
        labelTagList.addTagLabel(params).then(res => {
          if (res.code === 200) {
            this.$notify.success('新增成功');
            this.closeDetail();
          } else {
            this.$notify.error(res.msg);
          }
        }).catch(err => {
          this.$notify.error(err.response.data.msg || '提交失败');
        }).finally(() => {
          this.doing = false;
        })
      }
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
