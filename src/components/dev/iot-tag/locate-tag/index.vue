<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm"  :inline="true" v-show="showSearch" label-width="68px" >
      <el-row>
        <el-col :span="22">
          <el-form-item prop="selectText">
            <el-input
              v-model="queryParams.selectText"
              placeholder="标签名称/SN号/mac搜索"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item prop="tagType">
            <el-select  placeholder="标签类型" clearable v-model="queryParams.tagType">
              <el-option
                v-for="(item,index) in labelTypeList"
                :key="index"
                :label="item.label"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="bindStatus">
            <el-select  placeholder="绑定状态" clearable v-model="queryParams.bindStatus">
              <el-option
                v-for="(item,index) in bindingStateList"
                :key="index"
                :label="item.label"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="devNo">
            <el-input
              v-model="queryParams.devNo"
              placeholder="绑定设备编号"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item prop="">
            <el-select  placeholder="标签状态" clearable v-model="queryParams.status">
              <el-option
                v-for="(item,index) in labelStateList"
                :key="index"
                :label="item.label"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search" >搜索</el-button>
            <el-button icon="el-icon-refresh" @click="reset" >重置</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addLabel"
          >添加标签
          </el-button>
        </el-col>
      </el-row>
    </el-form>

<!--    查询列表-->
    <el-table v-loading="loading" :data="labelList">
      <el-table-column label="序号" align="center" type="index"/>
      <el-table-column label="标签名称" prop="tagName" align="center"></el-table-column>
      <el-table-column label="标签sn号" prop="tagSnNumber" align="center"></el-table-column>
      <el-table-column label="mac" prop="macAddress" align="center"></el-table-column>
      <el-table-column label="标签类型" prop="tagType" align="center">
        <template v-slot="{row}">
          <div v-for="(item,index) in labelTypeList" :key="index">
            <span v-if="item.key===row.tagType">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="绑定状态" prop="bindStatus" align="center">
        <template v-slot="{row}">
          <div v-for="(item,index) in bindingStateList" :key="index">
            <span v-if="item.key === row.bindStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="绑定设备编号" prop="devNo" align="center"></el-table-column>
      <el-table-column label="标签状态" prop="status" align="center">
        <template v-slot="{row}">
          <div v-if="labelStateFilter(row.status) === '脱落'" style="color:red">脱落</div>
          <div v-if="labelStateFilter(row.status) === '在线'" style="color:green">在线</div>
          <div v-if="labelStateFilter(row.status) === '不在线'" style="color:grey">不在线</div>
          <div v-if="labelStateFilter(row.status) === '未知'" style="color: black">未知</div>
        </template>
      </el-table-column>
      <el-table-column label="最后位置" prop="lastPositionStr" align="center"></el-table-column>
      <el-table-column label="操作" prop="" align="center">
        <template v-slot="{row}">
          <el-button icon="el-icon-search" size="mini" circle @click="detail(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="detailEdit(row)" circle ></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="remove(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="text-center" v-show="(dataList.length || pager.currentPage !== 1) && !loadingData">
      <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                     :page-sizes="[10,20,50,100]"
                     :total="pager.count" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>

  <!--新增标签-->
    <form-label :titleDetail="titleDetail" :detailForm="detailForm" :addEditVisible="addEditVisible" :edit="edit" @closeDetail="closeDetail"></form-label>
  </div>
</template>

<script>
import formLabel from './formLabel';
import { sinopharmDictDataType } from '@/api/system/dict/data'
import labelTagList from '@/api/label/label'
import CommonMixin from '@/mixins/commonMixin'
export default {
  name: 'LocateTag',
  components: {
    formLabel,
  },
  mixins: [CommonMixin],
  data() {
    return {
      edit:false,
      showSearch: true,
      titleDetail:'添加标签',
      addEditVisible:false,
      //详情信息
      detailForm:{},
      queryParams: {
        selectText:"",            //搜索框  标签名称/sn号/mac地址
        tagType:"",               //标签类型
        bindStatus: "",           //绑定状态  1已绑定 2未绑定
        devNo:"",                 //绑定设备编号
        status:"",                //标签状态 1在线 2不在线 3脱落
        //分页
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
      loading: false,
      labelTypeList: [],//标签类型
      bindingStateList: [
        {label:'已绑定',key:'1'},
        {label:'未绑定',key:'2'},
      ],//绑定状态
      labelStateList: [
        {label:'脱落',key:3},
        {label:'在线',key:1},
        {label:'不在线',key:2},
      ],//标签状态

      labelList:[],
    }
  },
  created() {
    this.getLabelQueryList();
    //获取标签类型列表
    this.getLabelTypeList();
  },
  mounted() {

  },
  filters:{

  },
  methods: {
    labelStateFilter(value){
      switch (value) {
        case 1:
          return '在线';
        case 2:
          return '不在线';
        case 3:
          return '脱落';
        default:
          return '未知';
      }
    },
    /* 获取标签类型列表 */
    getLabelTypeList(){
      sinopharmDictDataType('tag_type').then(res=>{
        this.labelTypeList = res.data.map(item=>{
          return {
            label:item.label,
            key:item.key,
            sort:item.sort,
            id:item.id,
            remark:item.remark,
          }
        })
      }).catch(err=>{

      })
    },
    /* 详情 */
    detail(row){
      labelTagList.detailTagLabel({id:row.id}).then(res=>{
        if(res.code === 200){
          this.addEditVisible = true;
          this.detailForm = res.data;
          this.edit = false;
        }
        console.log(res)
      }).catch(err=>{

      })
    },
    detailEdit(row){
      labelTagList.detailTagLabel({id:row.id}).then(res=>{
        if(res.code === 200){
          this.addEditVisible = true;
          this.detailForm = res.data;
          console.log(this.detailForm,'参数')
          this.edit = true;
        }
        console.log(res)
      }).catch(err=>{

      })
    },
    /* 删除 */
    remove(row){
      if(row.bindStatus === "1"){
        this.$confirm(`则弹窗提示设备被${row.tagName}设备绑定，请解绑后重新操作`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton:true,
          showConfirmButton:false,
          type: 'info'
        }).then(() => {}).catch(err=>{})
      }
      if(row.bindStatus === "2"){
        this.$confirm(`删除后不可恢复，确认删除吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton:true,
          showConfirmButton:true,
          type: 'warning'
        }).then(() => {
          labelTagList.deleteTagLabel({id:row.id}).then(res=>{
            if(res.code === 200){
              this.getLabelQueryList();
            }
          }).catch(err=>{

          })
        }).catch(err=>{})
      }
    },
    /* 搜索 */
    search() {
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = 10;
      this.getLabelQueryList();
    },
    /* 重置 */
    reset() {
      this.queryParams = {
        selectText:"",            //搜索框  标签名称/sn号/mac地址
        tagType:"",               //标签类型
        bindStatus: "",           //绑定状态  1已绑定 2未绑定
        devNo:"",                 //绑定设备编号
        status:"",                //标签状态 1在线 2不在线 3脱落

        total: 0,
        pageNum: 1,
        pageSize: 10,
      }
      this.$refs.queryForm.resetFields()
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = 10;
      this.getLabelQueryList();
    },
    queryList(pageNo){
      this.queryParams.pageNum = 1;
      this.getLabelQueryList();
    },
    getLabelQueryList(){
      if(this.loading){
        return
      }
      let params = {
        selectText:this.queryParams.selectText,            //搜索框  标签名称/sn号/mac地址
        tagType:this.queryParams.tagType,               //标签类型
        bindStatus: this.queryParams.bindStatus,           //绑定状态  1已绑定 2未绑定
        devNo:this.queryParams.devNo,                 //绑定设备编号
        status:this.queryParams.status,                //标签状态 1在线 2不在线 3脱落

        page:this.queryParams.pageNum,
        size:this.queryParams.pageSize,
      };
      labelTagList.listTagLabel(params).then(res=>{
        if(res.code === 200){
          this.loading = false;
          this.queryParams.total = res.data.total;
          this.labelList = res.data.list;
        }
      }).catch(err=>{

      })

    },
    /* 添加标签 */
    addLabel(){
      this.titleDetail='添加标签'
      this.addEditVisible = true;
      this.edit = true;
    },
    /* 关闭弹框 */
    closeDetail(){
      this.addEditVisible = false;
      this.getLabelQueryList();
    }

  }

}
</script>

<style scoped>

</style>
