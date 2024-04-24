<style lang="scss" scoped>
.el-form .el-select {
  display: block;
}
</style>
<template>
  <div>
    <h2 class="clearfix">{{title}}</h2>
    <el-form ref="userForm" :model="form" label-width="100px" :rules="rules"
             onsubmit="return false">
      <el-form-item label="模板名称" prop="templateName">
        <oms-input type="text" v-model="form.templateName" placeholder="请输入模板名称"></oms-input>
      </el-form-item>
      <el-form-item label="设备类型" prop="hospitalDeviceType">
        <el-select v-model="form.hospitalDeviceType" placeholder="请选择设备类型">
          <el-option v-for="(item,index) in hospitalDeviceTypeList"
                     :key="item.id"
                     :value="item.key"
                     :label="item.label"/>
        </el-select>
      </el-form-item>
      <el-form-item label="维保内容" >
        <div>
          <el-button  icon="el-icon-plus" type="success" circle size="mini" @click="handleAdd"></el-button>
          <el-button  icon="el-icon-edit" type="primary" circle size="mini" @click="handleEdit"></el-button>
          <el-button  icon="el-icon-delete" type="danger" circle size="mini" @click="handleDelete"></el-button>
        </div>
        <div>
          <el-tree
            ref="tree"
            :data="maintenanceInterposeDetailList"
            show-checkbox
            check-strictly
            default-expand-all
            highlight-current
            :props="defaultProps"
            @node-click="handleNodeClick"
            @check-change="handleCheckChange"
            :default-checked-keys="defaultCheckedKeys"
            node-key="id"
          ></el-tree>
        </div>
      </el-form-item>
      <el-form-item label-width="100px">
        <el-button type="primary" @click="onSubmit()" native-type="submit" :disabled="doing">保存</el-button>
        <el-button @click="doClose">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {Access} from "@/resources";
import {sinopharmDictDataType} from "@/api/system/dict/data";
import {postMaintenanceApi,putMaintenanceApi} from "@/api/maintenance/maintenance";

export default {
  props: {
    title: {
      type: String,
      default: '增加'
    },
    action: {
      type: String,
      default: ''
    },
    actionType: {
      type: Boolean,
      default: true
    },
    formData:{
      type: Object,
      default:''
    }
  },
  watch:{
    formData:{
      handler(newValue,oldValue){
        if(newValue.id){
          this.defaultCheckedKeys = [];
          this.form = newValue;
          this.maintenanceInterposeDetailList = newValue.maintenanceInterposeDetailList;


          this.maintenanceInterposeDetailList.forEach(node => {
            if (node.checkStatus) {
              this.defaultCheckedKeys.push(node.id);
            }
            // 如果二级节点twoInterposeDetailList当中的checkStatus为true,也push到 this.defaultCheckedKeys中
            if (node.twoInterposeDetailList && node.twoInterposeDetailList.length > 0) {
              node.twoInterposeDetailList.forEach(twoNode => {
                if (twoNode.checkStatus) {
                  this.defaultCheckedKeys.push(twoNode.id);
                }
              });
            }
          });

        }else{
          this.form = {}
          this.maintenanceInterposeDetailList = [];
        }
      },
      deep:true,
      immediate:true,
    }
  },
  data(){
    return{

      form:{},
      rules:{
        templateName:[
          {required: true, message: '请输入模板名称', trigger: 'blur'}
        ],
        hospitalDeviceType:[
          {required: true, message: '请选择设备编号', trigger: 'blur'}
        ]
      },
      maintenanceInterposeDetailList: [], // 初始树形数据
      defaultCheckedKeys:[],
      selectedNode: null,
      defaultProps: { children: 'twoInterposeDetailList', label: 'maintenanceName'},
      nextNodeId: 1, // 新增计数器
      doing: false,
      hospitalDeviceTypeList:[]
    }
  },
  mounted() {

  },
  created() {
    this.getDeviceTemplateType();
  },
  methods:{
    getDeviceTemplateType() {
      sinopharmDictDataType('hospitalDeviceType').then(res => {
        this.hospitalDeviceTypeList = res.data
      });
    },
    doClose(){
      this.$emit('handlerRefresh');
    },
  //提交事件
    onSubmit() {
      if (this.doing) return;
      this.doing = true;
      this.$refs.userForm.validate((valid) => {
        if (!valid) {
          this.doing = false;
          return false;
        }
        this.doing = true;
        // this.form.maintenanceInterposeDetailList = this.maintenanceInterposeDetailList
        // console.log(this.form,'值')
        if(this.formData.id){
          this.form.maintenanceInterposeDetailList = this.maintenanceInterposeDetailList
          putMaintenanceApi(this.form).then(res => {
            this.doing = false;
            this.$notify.success({
              duration: 2000,
              name: '成功',
              message: '编辑维保类型成功'
            });
            this.$emit('handlerRefresh');
          }).catch(error=>{
            this.$notify.error({
              duration: 2000,
              message: '编辑维保类型失败'
            });
            this.doing = false;
          });
        }else{
          this.form.maintenanceInterposeDetailList = this.maintenanceInterposeDetailList
          postMaintenanceApi(this.form).then(res => {
            this.doing = false;
            this.$notify.success({
              duration: 2000,
              name: '成功',
              message: '新增维保类型成功'
            });
            this.$emit('handlerRefresh');
          }).catch(error=>{
            this.$notify.error({
              duration: 2000,
              message: '新增维保类型失败'
            });
            this.doing = false;
          });
        }
      });
    },
    handleAdd() {
      if (!this.selectedNode) {
        this.$prompt("请输入新的节点名称", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }).then(({ value }) => {
          this.maintenanceInterposeDetailList.push({
            // id: this.getNextId(),
            maintenanceName: value,
            checkStatus:null,
            twoInterposeDetailList: [],
          });
        }).catch(err=>{});
      } else if (this.selectedNode.twoInterposeDetailList) {
        this.$prompt("请输入新的节点名称", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }).then(({ value }) => {
          this.selectedNode.twoInterposeDetailList.push({
            // id: this.getNextId(),
            checkStatus:null,
            maintenanceName: value,
          });
        }).catch(err=>{});
      }
    },
    handleEdit() {
      if (this.selectedNode) {
        this.$prompt("请输入新的节点名称", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }).then(({ value }) => {
          this.selectedNode.maintenanceName = value;
        }).catch(err=>{});
      }
    },
    handleDelete() {
      if (this.selectedNode ) {
        this.$confirm('确认要删除该节点吗?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const parentNode = this.getParentNode(this.selectedNode);
          if (parentNode) {
            const index = parentNode.twoInterposeDetailList.findIndex((child) => child.id === this.selectedNode.id);
            parentNode.twoInterposeDetailList.splice(index, 1);
          } else {
            this.maintenanceInterposeDetailList.splice(this.maintenanceInterposeDetailList.indexOf(this.selectedNode), 1);
          }
          this.selectedNode = null;
        }).catch(err=>{});
      }
    },
    handleNodeClick(node,event) {
      this.selectedNode = node;

    },

    handleCheckChange(data, checked) {
      data.checkStatus = checked;
      // console.log(data,checked,'====');
    },

    getNextId() {
      return Date.now();
    },
    getParentNode(node) {
      return this.maintenanceInterposeDetailList.find((parent) => parent.twoInterposeDetailList.includes(node));
    },
  },
}
</script>

<style scoped>

</style>
