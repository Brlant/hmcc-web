<style lang="scss" scoped>
.depart-content {
  margin-top: 20px;
}
</style>
<template>
  <div class="app-container depart-content">
    <el-form :model="queryParams" ref="queryForm" onsubmit="return false"
             :inline="true" v-show="showSearch" label-width="68px" :rules="rules" >
      <el-row>
        <el-col :span="22">
          <el-form-item >
            <el-input
              v-model="queryParams.departmentName"
              placeholder="科室名称"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search" >搜索</el-button>
            <el-button icon="el-icon-refresh" @click="reset" >重置</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" v-has="'system-depart-manager-add'" icon="el-icon-plus" @click="addDepart">添加科室</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!--    查询列表-->
    <el-table v-loading="loading" :data="departList">
      <el-table-column label="序号" align="center" type="index"/>
      <el-table-column label="科室名称" prop="departmentName" align="center"></el-table-column>
      <el-table-column label="科室位置" prop="departmentPosition" align="center">
        <template v-slot="{row}">
          <span>{{row.buildFloorName}},{{row.centerFloorName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="" align="center">
        <template v-slot="{row}">
          <el-button type="primary" icon="el-icon-edit" v-has="'system-depart-manager-edit'" size="mini" @click="detailEdit(row)" circle ></el-button>
          <el-button type="danger" icon="el-icon-delete" v-has="'system-depart-manager-delete'" size="mini" @click="remove(row)" circle></el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="text-center" >
      <el-pagination
        v-show="queryParams.total>0"
        :total="queryParams.total"
        :page-sizes="[10,20,50,100]"
        layout="total, sizes, prev, pager, next, jumper"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
      />
    </div>
    <edit-form :addEditVisible="addEditVisible" :titleDetail="titleDetail" @closeDetail="closeDetail" :editForm="editForm"></edit-form>
  </div>
</template>

<script>
import {departmentApi} from '@/resources';
import editForm from  './form';
export default {
  name: "index",
  components: {
    editForm
  },
  data(){
    return {
      addEditVisible:false,
      titleDetail:'添加科室',
      loading:false,
      showSearch:true,
      // 查询参数
      queryParams: {
        departmentName:'',//科室名称
        //分页
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
      // 表单校验
      rules: {},
      departList:[],//查询列表
      editForm:{},
    }
  },
  created() {

  },
  mounted() {
    this.queryDepartList(1);
  },
  methods:{
    //查询列表
    async queryDepartList(page){
      try{
        let params = {
          page:this.queryParams.pageNum || page,
          size:this.queryParams.pageSize,
          departmentName:this.queryParams.departmentName
        }
        const res = await departmentApi.getDeptQueryList(params);
        if(res.status === 200){
          this.queryParams.total = res.data.total;
          this.departList = res.data.list;
        }
      }catch (error){
        console.log(error)
      }
    },
    /*添加科室*/
    addDepart(){
      this.addEditVisible = true;
    },
    /*搜索*/
    search(){
      this.queryDepartList(1);
    },
    /*重置*/
    reset(){
      this.queryParams.departmentName = '';
      this.$refs.queryForm.resetFields();
      this.queryDepartList(1);
    },
    /*编辑*/
    detailEdit(row){
      this.titleDetail = '编辑科室';
      this.addEditVisible = true;
      this.formId = row.id;
      departmentApi.getDeptDetail({id:row.id}).then(res=>{
        this.editForm = res.data
      }).catch(err=>{})
    },
    /*删除*/
    async remove(row){
      this.$confirm(`删除后不可恢复，确认删除${row.departmentName}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton:true,
        showConfirmButton:true,
        type: 'warning'
      }).then(() => {
        departmentApi.deleteDept({id:row.id}).then(res=>{
          if(res.code === 200){
            this.$notify.success('删除成功');
            this.queryDepartList(1);
          }
        }).catch(err=>{

        })
      }).catch(err=>{})
    },
    closeDetail(){
      this.addEditVisible = false;
      this.titleDetail = '添加科室';
      this.queryDepartList(1);
    }
  }
}
</script>

<style scoped>

</style>
