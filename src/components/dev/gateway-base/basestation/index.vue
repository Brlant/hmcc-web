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
                     :key="item.value" :value="item.value" :label="item.label"/>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="search.status" placeholder="基站状态">
          <el-option v-for="item in baseStationStatus"
                     :key="item.value" :value="item.value" :label="item.label"/>
        </el-select>
      </el-col>
      <el-col :span="7">
        <el-button type="primary" icon="el-icon-search" @click="query">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-col>
      <el-col :span="7" style="text-align: right;">
        <el-button type="primary" icon="el-icon-plus" @click="create">添加基站</el-button>
      </el-col>
    </el-row>

    <!-- 列表 -->
    <el-table ref="listTbl" :data="data" :empty-text="emptyText" height="100%">
      <el-table-column type="index" align="center">
        <template slot="header">序号</template>
      </el-table-column>
      <el-table-column label="基站名称" prop="stationName"/>
      <el-table-column label="基站SN号" prop="tagSn" />
      <el-table-column label="MAC地址" prop="macAddr" />
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
          <el-button icon="el-icon-search" size="mini" circle @click.stop="detail(scope.row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" circle @click.stop="modify(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" circle @click.stop="remove(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page.sync="page" :total="total" background
                   layout="prev, pager, next" @current-change="query"/>

    <!-- 弹框 -->
    <structure-form :show.sync="show" :edit="edit" :form="form" @refresh="refresh"/>
  </div>
</template>

<script>
import StructureForm from './form';
import {deleteBaseStation, queryBaseStation} from '@/api/hospital/equipment';
import {formatDictLabel} from '@/tools/utils'

export default {
  name: 'BaseStation',
  components: {StructureForm},
  data() {
    return {
      search: {
        keyword: null,
        stationType: null,
        status: null
      },
      total: 0,
      data: [],
      page: 1,
      form: null,
      show: false,
      edit: false,
      uprow: null,
      emptyText: '加载中...',
      formatDictLabel
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
    this.query();
  },
  mounted() {
    console.log(this.dict);
  },
  methods: {
    refresh() {
      this.pageNum = 1;
      this.query();
    },
    query() {
      this.emptyText = '基站加载中...';
      queryBaseStation({
        ...this.search
      }).then(res => {
        this.data = res.data.list;
        this.total = res.data.total;
      }).finally(() => {
        setTimeout(() => {
          this.emptyText = '暂无基站数据';
        }, 300);
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
    },
    detail(row) {
      this.form = row;
      this.show = true;
      this.edit = false;
    },
    modify(row, uprow) {
      this.form = row;
      this.show = true;
      this.edit = true;
      this.uprow = uprow;
    },
    remove(row, uprow) {
      this.uprow = uprow;
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
