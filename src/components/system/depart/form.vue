<template>
  <el-dialog :title="titleDetail" :visible="addEditVisible" width="450px" :close-on-click-modal="false" :before-close="closeDetail">
    <el-form :model="formData"  ref="form"  :rules="rules">
      <el-form-item label="科室名称" prop="departmentName" label-width="80px">
        <el-input  v-model="formData.departmentName" maxlength="20" show-word-limit placeholder="请输入科室名称"></el-input>
      </el-form-item>
      <el-form-item label="所属楼栋" prop="buildFloorId" label-width="80px">
        <el-select v-model="formData.buildFloorId"
                   placeholder="请选择所属楼栋"
                   remote
                   :remote-method="getLayerList"
                   @change="handleLayerList"
                   clearable
                   @clear="clearLayerList"
                   filterable
                    >
          <el-option
            v-for="(item,index) in buildFloorList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属楼层" prop="centerFloorId" label-width="80px">
        <el-select v-model="formData.centerFloorId"
                   placeholder="请选择所属楼层"
                   remote
                   filterable
                   clearable >
          <el-option
            v-for="(item,index) in centerFloorList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="submit">提交</el-button>
      <el-button  @click="closeDetail">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {departmentApi} from '@/resources';
export default {
  name: "addForm",
  props:{
    addEditVisible: {
      type: Boolean,
    },
    titleDetail: {
      type: String,
    },
    editForm:{
      type: Object,
    },
  },
  watch:{
    editForm:{
      handler(val){
        if(val){
          this.formData = {...val}
          if(this.formData.buildFloorId){
            this.handleLayerList(this.formData.buildFloorId)
          }
        }
      },
    },
    addEditVisible:{
      handler(val){
        if(val){
          this.formData = {
            departmentName:'',
            buildFloorId:'',
            centerFloorId:'',
          }

          this.$nextTick(() => {
            this.$refs.form.clearValidate()
          });
        }
      }
    }
  },
  data() {
    return {
      formData: {
        departmentName:'',
        buildFloorId:'',
        centerFloorId:'',
      },
      rules: {
        departmentName:[{required: true, message: '请输入科室名称', trigger: 'blur'}],
        buildFloorId:[{required: true, message: '请选择楼栋', trigger: 'change'}],
        centerFloorId:[{required: true, message: '请选择楼层', trigger: 'change'}],
      },
      //楼栋列表
      buildFloorList:[],
      //楼层列表
      centerFloorList:[],
    }
  },
  created() {
    this.getBuildFloorList()
  },
  methods:{
    /*提交*/
    submit(){
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitMsg();
        }
      })
    },
    submitMsg(){
      if(this.formData.id){
        let params = {
          ...this.formData
        }
        departmentApi.updateDept(params).then(res => {
          if (res.code === 200) {
            this.$notify.success('编辑成功');
            this.$emit('closeDetail')
          }
        }).catch(error => {
          this.$notify.error(error.response.data.msg)
        })
      }else{
        departmentApi.addDept(this.formData).then(res => {
          if (res.code === 200) {
            this.$notify.success('添加成功');
            this.$emit('closeDetail')
          }
        }).catch(error => {
          this.$notify.error(error.response.data.msg)
        })
      }
    },
    closeDetail(){
      this.$refs.form.resetFields();
      this.$emit('closeDetail')
    },
    getBuildFloorList(){
      let params = {
        type:"1", //1楼栋 2楼层
        up_floor:''//楼栋id
      }
      departmentApi.getFloorList(params).then(res=>{
        this.buildFloorList = res.data.map(item=>{
          return{
            label:item.floorName,
            value:item.id,
          }
        })
      }).catch(error=>{})
    },
    getLayerList(row){
      this.handleLayerList(row);
    },
    handleLayerList(row){
      //如果row发生变化,则清空centerFloorList
      if(row !== this.editForm.buildFloorId){
        this.centerFloorList = [];
        this.formData.centerFloorId = '';
      }
      let params = {
        type:"2", //1楼栋 2楼层
        upFloor:row//楼栋id
      }
      departmentApi.getFloorList(params).then(res=>{
        //如果 row 是空值，this.centerFloorList是空数组
        if(!row){
          this.centerFloorList = [];
          return;
        }
        this.centerFloorList = res.data.map(item=>{
          return{
            label:item.floorName,
            value:item.id,
          }
        })
      }).catch(error=>{})
    },
    clearLayerList(){
      this.centerFloorList = [];
      this.formData.centerFloorId = '';
    }
  },

}
</script>

<style scoped lang="scss">
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
