<template>
  <div>
    <!-- 搜索 -->
    <el-row class="search-container">
      <el-col :span="4">
        <el-input v-model="search.keyword" clearable placeholder="基站名称/SN号/MAC"/>
      </el-col>
      <el-col :span="3">
        <el-select v-model="search.stationType" placeholder="基站类型">
          <el-option v-for="item in baseStationTypes"
                     :key="item.key" :value="item.key" :label="item.label"/>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="search.status" placeholder="基站状态">
          <el-option v-for="item in baseStationStatus"
                     :key="item.key" :value="item.key" :label="item.label"/>
        </el-select>
      </el-col>
      <el-col :span="7">
        <el-button type="primary" icon="el-icon-search" @click="queryList(1)">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-col>
      <el-col :span="7" style="text-align: right;">
        <el-button v-has="permPage.addBasestation" type="primary" icon="el-icon-plus" @click="create">添加基站</el-button>
      </el-col>
    </el-row>

    <!-- 列表 -->
    <el-table ref="listTbl" :data="dataList" style="width: 100%">
      <el-table-column type="index" align="center">
        <template slot="header">序号</template>
      </el-table-column>
      <el-table-column label="基站名称" prop="stationName"/>
      <el-table-column label="基站SN号" prop="tagSn"/>
      <el-table-column label="MAC地址" prop="macAddr"/>
      <el-table-column label="基站类型" align="center">
        <template v-slot="scope">
          {{ formatDictLabel(scope.row.stationType, baseStationTypes) }}
        </template>
      </el-table-column>
      <el-table-column label="基站状态" align="center">
        <template v-slot="scope">
          <span :style="scope.row.status === 1 ? 'color: green' : 'color: red'">
              {{ formatDictLabel(scope.row.status, baseStationStatus) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="基站位置" min-width="200" prop="pointName" align="center"/>
      <el-table-column label="操作" align="center">
        <template v-slot="scope">
          <el-button v-has="permPage.viewBasestation" icon="el-icon-search" size="mini" circle
                     @click.stop="detail(scope.row)"></el-button>
          <el-button v-has="permPage.editBasestation" type="primary" icon="el-icon-edit" size="mini" circle
                     @click.stop="modify(scope.row)"></el-button>
          <el-button v-has="permPage.delBasestation" type="danger" icon="el-icon-delete" size="mini" circle
                     @click.stop="remove(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="text-center" v-show="dataList.length>0">
      <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                     :page-sizes="[10,20,50,100]"
                     :total="pager.count" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <!-- 弹框 -->
    <structure-form :show.sync="show" :edit="edit" :form="form"
                    :index="showIndex"
                    :title="formTitle"
                    @refresh="refresh"/>
  </div>
</template>

<script>
import StructureForm from './form';
import {deleteBaseStation, queryBaseStation} from '@/api/hospital/equipment';
import CommonMixin from '@/mixins/commonMixin'

export default {
  name: 'BaseStation',
  components: {StructureForm},
  mixins: [CommonMixin],
  data() {
    return {
      search: {
        keyword: null,
        stationType: null,
        status: null
      },
      dataList: [],
      form: null,
      formTitle: '',
      show: false,
      edit: false,
      updateRow: null,
    };
  },
  computed: {
    baseStationTypes() {
      return this.$getDict('base_station_type')
    },
    baseStationStatus() {
      return this.$getDict('base_station_status')
    }
  },
  created() {
    this.queryList(1);
  },
  mounted() {
    // console.log(this.dict);
  },
  methods: {
    refresh() {
      this.queryList(1);
    },

    queryList(pageNo) {
      let params = Object.assign({}, this.search, {
        page: pageNo,
        pageSize: this.pager.pageSize
      });

      // console.log(params,'list.params')
      queryBaseStation(params).then(res => {
        this.dataList = res.data.list;
        this.pager.count = res.data.total;
      });
    },
    reset() {
      this.search = {
        keyword: null,
        stationType: null,
        status: null
      };
      this.refresh();
    },
    create() {
      this.form = null;
      this.show = true;
      this.edit = true;
      this.formTitle = '添加基站';
      this.showIndex = 0;
    },
    detail(row) {
      this.form = row;
      this.show = true;
      this.edit = false;
      this.formTitle = '基站详情';
      this.showIndex = 2;
    },
    modify(row, updateRow) {
      this.form = row;
      this.show = true;
      this.edit = true;
      this.formTitle = '修改基站';
      this.updateRow = updateRow;
      this.showIndex = 1;
    },
    remove(row, updateRow) {
      this.updateRow = updateRow;
      this.$confirm('确定删除该条记录？', '删除', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定'
      }).then(() => {
        deleteBaseStation({
          id: row.id,
          deleteFlag: 1
        }).then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.msg || '基站删除失败');
          }
          this.refresh();
          this.$message.success(res.msg || '基站删除成功');
        });
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);

  ::v-deep .el-table__cell.el-table__expanded-cell {
    padding: 0;
    border-bottom: none;
  }

  .el-pagination {
    text-align: right;
    padding: 20px 0 0 0;

    ::v-deep .btn-next {
      margin: 0 0 0 5px;
    }
  }
}

.search-container .el-col {
  margin-bottom: 20px;
}

.search-container .el-col:not(:first-child) {
  padding-left: 10px;
}

.el-row .el-col:not(:first-child) {
  ::v-deep .el-form-item {
    padding-left: 10px;
  }
}
</style>
