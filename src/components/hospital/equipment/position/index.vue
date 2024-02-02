<template>
  <div class="app-container">
    <!-- 搜索 -->
    <el-form :model="search" inline>
      <el-form-item>
        <el-select
          v-model="search.deviceId"
          remote
          clearable
          filterable
          :loading="loading"
          :remote-method="remoteMethod"
          placeholder="设备编号/名称"
          >
          <el-option
            v-for="item in devices"
            :key="item.id"
            :label="item.devName"
            :value="item.id">
            <div>{{item.devName}}</div>
            <div>
              <span>设备编号：</span>
              <span>{{item.devNo}}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <treeselect v-model="search.storeyId" :options="storeies" :load-options="loadOptions" no-children-text="暂无楼层数据"
          :disable-branch-nodes="true" placeholder="楼层" @select="treeSelect"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="query">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
      <div class="search-view">
        <div>
          <span>设备总数：{{ statistics.total }}</span>
        </div>
        <div>
          <el-icon name="location-information" style="color: #95f202"/>
          <span>开机数：{{ statistics.opened }}</span>
        </div>
        <div>
          <el-icon name="location-information" style="color: #aaaaaa"/>
          <span>关机数：{{ statistics.closed }}</span>
        </div>
        <div>
          <el-icon name="location-information" style="color: #d8001b"/>
          <span>异常数：{{ statistics.abnormal }}</span>
        </div>
      </div>
    </el-form>

    <div style="height: calc(100% - 60px)">
      <IndoorMap :map="map" :storey="storey"/>
    </div>
  </div>
</template>

<script>
  import IndoorMap from '../../indoormap/index';
  import { queryDeviceByKeyWord, queryDevicePosition, queryFloorStructure, queryDeviceCountByFloor } from '@/api/hospital/equipment';

  export default {
    name: 'EquipmentPostion',
    components: { IndoorMap },
    data() {
      return {
        search: {
          storeyId: null,
          deviceId: null
        },
        statistics: {
          total: 0,
          opened: 0,
          closed: 0,
          abnormal: 0
        },
        map: {
          id: null,
          url: null,
          points: null
        },
        storey: {
          id: null,
          parentId: null,
          name: null
        },
        total: 10,
        data: [],
        loading: false,
        storeies: [],
        devices: [],
        loadTable: false,
        indoorZoom: 100
      };
    },
    computed: {
      indoorSize() {
        return `${this.indoorZoom}% ${this.indoorZoom}%`
      }
    },
    created() {
      let callback = () => {
        const first = this.storeies[0];
        if (!Array.isArray(first.children) || first.children.length < 1) {
          return;
        }
        this.search.storeyId = first.children[0].id;
        this.query();
      };
      if (this.$route.params?.id) {
        callback = () => {
          this.devices.push({ ...this.$route.params });
          this.search.deviceId = this.$route.params?.id;
          this.query();
        }
      }
      this.loadFloor(() => {
        if (!Array.isArray(this.storeies) || this.storeies.length < 1) {
          return;
        }
        const first = this.storeies[0];
        this.loadStorey(first, callback);
      });

      // //页面跳转获取参数
      // this.pageParameters();
    },
    methods: {
      /* 定位 */
      // pageParameters(){
      //   //页面跳转的传参
      //   if (this.$route.query.deviceId && this.$route.query.devName && this.$route.query.devNo) {
      //     if(!this.devices.some(list=>list.deviceId===this.$route.query.deviceId)){
      //       this.devices = [];
      //       this.$set(this.devices,this.devices.length,{devNo:this.$route.query.devNo,devName:this.$route.query.devName,id:Number(this.$route.query.deviceId)});
      //       this.search.deviceId = this.devices[0].id;
      //       this.query();
      //     }
      //   }
      // },
      loadFloor(callback) {
        queryFloorStructure({
          type: 1
        }).then(res => {
          this.storeies = res.data.map(item => ({
            id: item.id,
            label: item.floorName,
            children: item.children?.length ? item.children : null
          }));
          callback && callback();
        });
      },
      loadStorey(node, callback) {
        queryFloorStructure({
          type: 2,
          upFloor: node.id
        }).then(res => {
          node.children = res.data.map(item => ({
            id: item.id,
            label: item.floorName
          }));
          callback && callback();
        });
      },
      query() {
        queryDevicePosition({
          ...this.search
        }).then(res => {
          this.map.id = null;
          this.map.url = null;
          this.map.points = [];
          res.data?.forEach(item => {
            this.map.id = item.platId;
            this.map.url = item.mapUrl;
            this.map.points.push({
              id: `${item.deviceId}`,
              x: item.xPoint,
              y: item.yPoint,
              type: 'position',
              state: this.covertState(item.status),
              form: {
                id: item.pointId,
                platId: item.platId,
                pointType: 0,
                pointName: item.place,
                devName: item.devName,
                devNo: item.devNo,
                status: item.status,
                tagSnNumber: item.tagSnNumber,
                collectionTime: item.collectionTime
              }
            });
          });
        });
      },
      covertState(status) {
        switch (status) {
          case 'OFFLINE':
            return 'lightgray'
          case 'ONLINE':
            return 'green'
          case 'ALARM':
            return 'red'
        }
      },
      reset() {
        this.search = {
          storeyId: this.storeies?.[0].children?.[0]?.id,
          deviceId: null
        };
        this.devices = [];
        this.query();
      },
      remoteMethod(keyword) {
        this.loading = true;
        queryDeviceByKeyWord({
          keyword
        }).then(res => {
          if (res.code !== 200) {
            return (this.devices = []);
          }
          this.devices = res.data;
        }).finally(() => {
          this.loading = false;
        });
      },
      loadOptions({ parentNode, callback }) {
        this.loadStorey(parentNode, callback);
      },
      treeSelect(node) {
        queryDeviceCountByFloor({
          floorId: node.id
        }).then(res => {
          this.statistics.total = res.data?.totalCount || 0;
          this.statistics.opened = res.data?.onlineCount || 0;
          this.statistics.closed = res.data?.offlineCount || 0;
          this.statistics.abnormal = res.data?.alarmCount || 0;
        });
      },
      indoorToolbar(event) {
        const className = event.target?.className;
        if (className === 'el-icon-zoom-in') {
          this.indoorZoom = this.indoorZoom * 1.01;
        } else if (className === 'el-icon-zoom-out') {
          this.indoorZoom = this.indoorZoom * 0.99;
        } else {
          this.indoorZoom = 100;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .app-container {
    height: calc(100vh - 70px);
    background-color: #ffffff;
    padding: 10px !important;

    .search-view {
      display: inline;
      line-height: 36px;

      > div {
        padding-left: 20px;
        display: inline;

        > i {
          font-size: 20px;
          margin-right: 5px;
        }
      }
    }

    ::v-deep .vue-treeselect {
      padding-top: 2px;
      .vue-treeselect__control, .vue-treeselect__value-container, .vue-treeselect__multi-value {
        width: auto;
        height: 36px;
        line-height: 36px;
      }
    }
  }

  .el-select-dropdown__item {
    height: auto;

    div:first-child {
      font-weight: bold;
    }

    div:not(:first-child) {
      text-indent: 1em;
      color: #999999;
      font-size: 12px;
      margin-top: -15px;
    }
  }
</style>
