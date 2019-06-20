<template>
  <div>
    <div class="add-info-part" v-show="isShowAddForm">
      <el-form :model="form" :rules="rules" label-width="110px" ref="tempForm">
        <el-form-item label="备用设备编号" prop="devCode">
          <oms-input placeholder="请输入备用设备编号" type="text" v-model="form.devCode"/>
        </el-form-item>
        <!--<el-form-item label="绑定关系" prop="bindFlag">-->
        <!--<el-radio-group v-model.number="form.bindFlag" size="small" placeholder="请输入编码">-->
        <!--<el-radio-button :label="1">启用</el-radio-button>-->
        <!--<el-radio-button :label="0">停用</el-radio-button>-->
        <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <el-form-item label="绑定时间" prop="createTime">
          <el-date-picker placeholder="请选择" type="date" v-model="form.createTime"/>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="doing" @click="save('tempForm')" size="small" type="primary">保存</el-button>
          <el-button @click="cancel" plain size="small">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="order-list clearfix">
      <el-row class="order-list-header">
        <el-col :span="8">备用设备编号</el-col>
        <el-col :span="8">绑定时间</el-col>
        <el-col :span="8">操作</el-col>
      </el-row>
      <div class="order-list-body flex-list-dom">
        <el-row v-if="loading">
          <el-col :span="24">
            <oms-loading :loading="loading"></oms-loading>
          </el-col>
        </el-row>
        <div class="empty-text" v-else-if="!relationDevs.length">暂无设备绑定关系信息</div>
        <div :key="index" class="order-list-item no-pointer order-list-item-bg" v-else
             v-for="(item, index) in relationDevs">
          <el-row>
            <el-col :span="8">{{item.devCode}}</el-col>
            <el-col :span="8">{{item.createTime | date}}</el-col>
            <el-col :span="8">
              <des-btn @click="stop(item)" icon="forbidden" v-has="'show'" v-show="item.bindFlag === '1'">停用</des-btn>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="text-center" v-show="relationDevs.length">
        <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                       :page-sizes="[10,20,50,100]"
                       :total="pager.count" @current-change="handleCurrentChange"
                       @size-change="handleSizeChange"
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import {DevBackUp} from '@/resources';

  export default {
    props: {
      formItem: Object,
      index: Number
    },
    data() {
      return {
        form: {
          devCode: '',
          bindFlag: 1,
          createTime: Date.now()
        },
        rules: {
          devCode: [
            {required: true, message: '请输入备用设备编号', trigger: 'blur'}
          ],
          createTime: [
            {required: true, message: '请选择绑定时间', trigger: 'change'}
          ]
        },
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10
        },
        relationDevs: [],
        isShowAddForm: false,
        doing: false,
        loading: false
      };
    },
    watch: {
      index(val) {
        this.relationDevs = [];
        this.cancel();
        if (val !== 1) return;
        this.queryRelationDevs();
      }
    },
    methods: {
      cancel() {
        this.isShowAddForm = false;
        this.$refs['tempForm'].resetFields();
      },
      start(item) {
        this.$confirmOpera(`是否启用备用设备"${item.devCode}"`, () => {
          this.$httpRequestOpera(DevBackUp.update(item.id, {bindFlag: '1'}), {
            successTitle: '启用成功',
            errorTitle: '启用失败',
            success: () => {
              this.queryRelationDevs(this.pager.currentPage);
            }
          });
        });
      },
      stop(item) {
        this.$confirmOpera(`是否停用备用设备"${item.devCode}"`, () => {
          this.$httpRequestOpera(DevBackUp.update(item.id, {bindFlag: '0'}), {
            successTitle: '停用成功',
            errorTitle: '停用失败',
            success: () => {
              this.queryRelationDevs(this.pager.currentPage);
            }
          });
        });
      },
      handleSizeChange(val) {
        this.pager.pageSize = val;
        window.localStorage.setItem('currentPageSize', val);
        this.queryRelationDevs(1);
      },
      handleCurrentChange(val) {
        this.queryRelationDevs(val);
      },
      queryRelationDevs(pageNo) {
        const params = {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          ccsDevId: this.formItem.id
        };
        this.pager.currentPage = pageNo;
        this.loading = true;
        DevBackUp.query(params).then(res => {
          this.relationDevs = res.data.currentList || [];
          this.pager.count = res.data.count;
          this.loading = false;
        });
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && !this.doing) {
            this.form.ccsDevId = this.formItem.id;
            if (!this.form.id) {
              this.doing = true;
              this.$httpRequestOpera(DevBackUp.save(this.form), {
                successTitle: '添加成功',
                errorTitle: '添加失败',
                success: res => {
                  this.doing = false;
                  this.$refs['tempForm'].resetFields();
                  this.queryRelationDevs(1);
                },
                error: () => {
                  this.doing = false;
                }
              });
            } else {
              this.$httpRequestOpera(DevBackUp.update(this.form.id, this.form), {
                successTitle: '修改成功',
                errorTitle: '修改失败',
                success: res => {
                  this.doing = false;
                  this.$emit('change', res.data);
                },
                error: () => {
                  this.doing = false;
                }
              });
            }
          }
        });
      }
    }
  };
</script>
