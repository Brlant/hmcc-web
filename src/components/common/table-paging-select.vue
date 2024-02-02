<style lang="scss" scoped>
.no-select-list {
  padding-right: 10px;
}

.select-list {
  padding-left: 10px;
}

.table-header {
  border: 1px solid #eee;
  padding: 2px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .table-header-title {
    font-weight: bold;
    font-size: 16px;
  }
}
</style>
<template>
  <el-row>
    <el-col v-show="showNoSelect" :span="24">
      <div class="no-select-list">
        <div class="table-header">
          <span class="table-header-title">{{ noSelectTitle }}</span>
          <el-button size="mini" type="primary" @click="addAll">全部添加</el-button>
        </div>
        <el-table :data="currentData" :header-cell-style="{background: '#eee'}" :maxHeight="maxHeight">
          <el-table-column v-for="item in columnList" :key="item.prop" :label="item.label"
                           :min-width="item.width || 150" :prop="item.prop">
            <template v-slot="{row}">
              <span>{{ item.format && item.format(row[item.prop]) || row[item.prop] }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" prop="op" width="80px">
            <el-button slot-scope="{row}" size="mini" type="primary" @click="addOne(row)">添加</el-button>
          </el-table-column>
        </el-table>
        <div class="text-center mt-10">
          <el-pagination
            :current-page="pager.currentPage"
            :page-sizes="[10,20,50,100]"
            :pageSize="pager.pageSize" :total="pager.count"
            class="no-error-input"
            layout="sizes, prev, pager, next" @current-change="handleCurrentChange"
            @size-change="handleSizeChange">
          </el-pagination>
        </div>
      </div>
    </el-col>
    <el-col v-show="showSelect" :span="24">
      <div class="select-list">
        <div class="table-header">
          <span class="table-header-title">{{ selectTitle }}<span
            v-show="selectList.length">（{{ selectList.length }}）</span></span>
          <el-button size="mini" type="primary" @click="delAll">全部删除</el-button>
        </div>
        <el-table :data="selectList" :header-cell-style="{background: '#eee'}" :maxHeight="maxHeight">
          <el-table-column v-for="item in columnList" :key="item.prop" :label="item.label"
                           :min-width="item.width || 150" :prop="item.prop">
            <template slot-scope="{row}">
              <span>{{ item.format && item.format(row[item.prop]) || row[item.prop] }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" prop="op" width="80px">
            <el-button slot-scope="{row}" size="mini" type="primary" @click="delOne(row)">删除</el-button>
          </el-table-column>
        </el-table>
      </div>
    </el-col>
  </el-row>
</template>
<script>
export default {
  props: {
    primaryKey: {
      required: true,
      type: String
    },
    columnList: {
      required: true,
      type: Array
    },
    httpRequest: {
      required: true,
      type: Function
    },
    filters: {
      type: Object
    },
    showNoSelect: {
      type: Boolean,
      default: true
    },
    showSelect: {
      type: Boolean,
      default: true
    },
    maxHeight: {
      type: String,
      default: '300px'
    },
    noSelectTitle: {
      type: String,
      default: '未选列表'
    },
    selectTitle: {
      type: String,
      default: '已选列表'
    }
  },
  data() {
    return {
      data: [],
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: 20
      },
      selectList: []
    };
  },
  computed: {
    currentData() {
      return this.data.filter(f => !this.selectList.some(s => s[this.primaryKey] === f[this.primaryKey]));
    }
  },
  methods: {
    init() {
      this.selectList = [];
      this.queryList(1);
    },
    queryList(pageNo) {
      if (!this.httpRequest) return;
      this.pager.currentPage = pageNo;
      let params = Object.assign({}, {
        pageSize: this.pager.pageSize,
        pageNo: pageNo
      }, this.filters || {});
      this.httpRequest(params).then(res => {
        this.pager.count = res.data.count;
        this.data = res.data.list;
      });
    },
    handleCurrentChange(val) {
      this.queryList(val);
    },
    handleSizeChange(val) {
      this.pager.pageSize = val;
      this.queryList(1);
    },
    addItem(item) {
      let isHas = this.selectList.some(s => s[this.primaryKey] === item[this.primaryKey]);
      if (isHas) return;
      this.selectList.push(item);
    },
    addOne(item) {
      this.addItem(item);
      this.change();
    },
    addAll() {
      this.data.forEach(i => {
        this.addItem(i);
      });
      this.change();
    },
    delOne(item) {
      this.selectList = this.selectList.filter(f => f !== item);
      this.change();
    },
    delAll(item) {
      this.selectList = [];
      this.change();
    },
    change() {
      this.$emit('change', this.selectList);
    }
  }
};
</script>
