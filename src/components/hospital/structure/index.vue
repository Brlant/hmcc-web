<template>
  <div class="app-container">
    <!-- 搜索 -->
    <el-row class="search-container">
      <el-col :span="6">
          <el-input v-model="floorName" clearable placeholder="楼层名称"/>
      </el-col>
      <el-col :span="9">
          <el-button type="primary" icon="el-icon-search" @click="listQuery">搜索</el-button>
      </el-col>
      <el-col :span="9" style="text-align: right;">
          <el-button type="primary" icon="el-icon-plus" @click="create">添加</el-button>
      </el-col>
    </el-row>

    <!-- 列表 -->
    <el-table ref="listTbl" :data="data" :empty-text="emptyText" height="100%" @row-click="clickRow" @expand-change="expandChange">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.data" :empty-text="props.row.emptyText" :show-header="false">
            <el-table-column label="楼栋名称" width="248"/>
            <el-table-column label="楼层名称" prop="floorName" width="200"/>
            <el-table-column label="备注" prop="memo"/>
            <el-table-column label="排序" prop="sort" width="75" align="center"/>
            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="scope">
                <el-button icon="el-icon-search" size="mini" circle @click="detail(scope.row)"></el-button>
                <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="modify(scope.row, props.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="remove(scope.row, props.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="楼栋名称" prop="floorName" width="200"/>
      <el-table-column label="楼层名称" width="200"/>
      <el-table-column label="备注" prop="memo"/>
      <el-table-column label="排序" prop="sort" width="75" align="center"/>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button icon="el-icon-search" size="mini" circle @click.stop="detail(scope.row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" circle @click.stop="modify(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" circle @click.stop="remove(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹框 -->
    <structure-form :show.sync="show" :edit="edit" :form="form"  @refresh="refresh"/>
  </div>
</template>

<script>
  import StructureForm from './form';
  import { modifyFloorStructure, queryFloorStructure } from '@/api/hospital/equipment';

  export default {
    name: 'FloorStructure',
    components: { StructureForm },
    data() {
      return {
        floorName: null,
        data: [],
        form: null,
        show: false,
        edit: false,
        uprow: null,
        emptyText: '加载中...'
      };
    },
    created() {
      this.listQuery();
    },
    methods: {
      refresh() {
        if (this.uprow) {
          this.expandChange(this.uprow);
        } else {
          this.listQuery();
        }
      },
      listQuery() {
        this.emptyText = '楼层加载中...';
        queryFloorStructure({
          floorName: this.floorName,
          type: this.floorName ? 2 : 1,
          queryFlag: this.floorName ? 1 : null
        }).then(res => {
          this.data = res.data.map(row => ({
            ...row, data: [],
            emptyText: '楼层加载中...'
          }));
        }).finally(() => {
          setTimeout(() => {
            this.emptyText = '暂无楼层数据';
          }, 300);
        });
      },
      clickRow(row) {
        this.$refs.listTbl.toggleRowExpansion(row);
      },
      expandChange(row, expanded) {
        if (expanded && expanded.every(item => item.id !== row.id)) {
          return (row.data = [])
        }
        row.emptyText = '楼层加载中...';
        queryFloorStructure({
          floorName: this.floorName,
          type: 2,
          upFloor: row.id
        }).then(res => {
          row.data = res.data;
        }).finally(() => {
          setTimeout(() => {
            row.emptyText = '暂无楼层数据';
          }, 300);
        })
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
          modifyFloorStructure({
            id: row.id,
            deleteFlag: 1
          }).then(() => {
            this.refresh();
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
    height: calc(100vh - 70px);
    background-color: #ffffff;
    padding: 10px !important;

    ::v-deep .el-table__cell.el-table__expanded-cell {
      padding: 0;
      border-bottom: none;
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
