<style lang="scss" scoped>
  .m-part {
    padding: 0 10px;
    border: 1px solid #eee;
  }

  .second-part {
    @extend .m-part;
    margin-top: 10px;
    display: flex;
    align-items: center;
    height: 40px;

    .el-dropdown {
      width: 290px;
      line-height: 40px;
    }

    .el-dropdown-link {
      display: flex;
      align-items: center;

      .title {
        display: inline-block;
        width: 240px;
        -o-text-overflow: ellipsis; /*兼容opera*/
        text-overflow: ellipsis; /*这就是省略号喽*/
        overflow: hidden; /*设置超过的隐藏*/
        white-space: nowrap; /*设置不折行*/
      }
    }
  }

  .store-dropdown {
    position: relative;
  }
</style>
<template>
  <div class="order-page">
    <el-row class="second-part">
      <el-col :span="11" class="store-dropdown">
        <div v-loading="loading" v-show="loading" class="loading-part"></div>
        <el-dropdown trigger="click" @command="menuClick" v-if="logisticsCenterList.length">
          <div class="el-dropdown-link">
            <div class="title">
              <div style="display: inline-block">{{logisTitle}}</div>
            </div>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown" class="el-dropdown-menu-width">
            <el-dropdown-item :command="item" v-for="(item, index) in logisticsCenterList" :key="index">
              {{item.warehouseCode}}
            </el-dropdown-item>
            <el-dropdown-item v-has="'ccs-warehouse-add'" divided command="add" class="text-center" @click="add">
              添加物流中心
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!--<el-tag type="success" v-show="currentItem.warnStatus === '0'">正常</el-tag>-->
        <!--<el-tag type="danger" v-show="currentItem.warnStatus === '1'">告警</el-tag>-->
        <el-tag type="success" v-show="currentItem.activeFlag === '1'">启用</el-tag>
        <el-tag type="danger" v-show="currentItem.activeFlag === '0'">停用</el-tag>
      </el-col>
      <el-col :span="13" class="text-right">
        <des-btn icon="plus" v-has="'ccs-warehouse-add'" v-show="!logisticsCenterList.length" @click="add">添加物流中心
        </des-btn>
        <span v-if="logisticsCenterList.length">
            <des-btn icon="edit" v-has="'ccs-warehouse-edit'" @click="edit">编辑物流中心</des-btn>
          <!--<des-btn icon="delete" v-has="'show'" @click="deleteStore(currentItem, '0')">删除物流中心</des-btn>-->
            <des-btn icon="plus" v-has="'ccs-warehouse-add'" @click="addWareHouse">添加仓库</des-btn>
        </span>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import {CcsWarehouse} from '@/resources';

  export default {
    data() {
      return {
        logisticsCenterList: [],
        showRight: false,
        currentItem: {},
        deleteStore: this.$parent.deleteStore,
        loading: false
      };
    },
    computed: {
      logisTitle() {
        if (!this.logisticsCenterList.length) return '';
        let name = '';
        this.logisticsCenterList.forEach(i => {
          if (i.id === this.currentItem.id) {
            name = i.warehouseCode;
          }
        });
        return name;
      }
    },
    mounted() {
      this.getList(1);
    },
    methods: {
      getList: function () {
        let param = {
          warehouseType: '0',
          activeFlag: '1'
        };
        this.loading = true;
        CcsWarehouse.queryAllList(param).then(res => {
          this.logisticsCenterList = res.data.currentList;
          if (this.logisticsCenterList.length) {
            this.currentItem = this.logisticsCenterList[0];
            this.menuClick(this.logisticsCenterList[0]);
          }
          this.loading = false;
        });
      },
      menuClick(item) {
        if (item === 'add') {
          this.add();
        } else {
          this.currentItem = item;
          this.$router.push(`/monitoring/store/${this.currentItem.id}`);
          this.$emit('queryWareHouse', item);
        }
      },
      addWareHouse() {
        this.$emit('open', {}, '1');
      },
      add: function () {
        this.$emit('open', {}, '0');
      },
      edit: function () {
        this.$emit('open', this.currentItem, '0');
      }
    }
  };
</script>
