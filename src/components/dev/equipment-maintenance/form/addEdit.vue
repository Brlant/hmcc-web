<template>
  <dialog-template :btnSavePosition="120">
    <template slot="title">{{actionType}}</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save" plain type="primary">保存</el-button>
      <el-button  >取消</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="120px" ref="tempForm">
        <el-form-item label="设备类型" prop="hospitalDeviceType">
          <el-select v-model="form.hospitalDeviceType" placeholder="请选择设备类型" @change="handlerDeviceType">
            <el-option v-for="(item,index) in hospitalDeviceTypeList"
                       :key="item.id"
                       :value="item.key"
                       :label="item.label"/>
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称" prop="deviceId">
          <el-select v-model="form.deviceId" clearable filterable placeholder="请选择设备名称">
<!--            <el-option v-for="(item,index) in hospitalDeviceTypeList"-->
<!--                       :key="item.id"-->
<!--                       :value="item.key"-->
<!--                       :label="item.label"/>-->
          </el-select>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>

<script>
import {sinopharmDictDataType} from "@/api/system/dict/data";

export default {
  name: "addEdit",
  props: {
    formItem: Object,
    index: Number
  },
  data() {
    return{
      actionType: '添加',
      form:{},
      doing: false,
      rules:{
        hospitalDeviceType:[
          {required: true, message: '请选择设备类型', trigger: 'blur'}
        ],
        deviceId:[
          {required: true, message: '请选择设备名称', trigger: 'blur'}
        ]
      },
      hospitalDeviceTypeList:[],//设备类型
    }
  },
  watch: {

  },
  created() {
    this.getDeviceTemplateType();
  },
  methods: {
    save(){

    },
    getDeviceTemplateType() {
      sinopharmDictDataType('hospitalDeviceType').then(res => {
        this.hospitalDeviceTypeList = res.data
      });
    },
    //设备类型
    handlerDeviceType(row){
      console.log(row,'====')
    },
  },
}
</script>

<style scoped>

</style>
