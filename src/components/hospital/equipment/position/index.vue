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
            <div>{{ item.devName }}</div>
            <div>
              <span>设备编号：</span>
              <span>{{ item.devNo }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <treeselect v-model="search.storeyId" :options="stores" :load-options="loadOptions" no-children-text="暂无楼层数据"
                    :disable-branch-nodes="true" placeholder="楼层" @select="treeSelect"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="query">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
      <div class="search-view">
        <div>
          <span>设备总数：{{ statistics.totalCount }}</span>
        </div>
        <div>
          <el-icon name="location-information" style="color: #95f202"/>
          <span>开机：{{ statistics.onlineCount }}</span>
        </div>
        <div>
          <el-icon name="location-information" style="color: #aaaaaa"/>
          <span>关机：{{ statistics.offlineCount }}</span>
        </div>
        <div>
          <el-icon name="location-information" style="color: #ffdf25"/>
          <span>故障：{{ statistics.faultCount}}</span>
        </div>
        <div>
          <el-icon name="location-information" style="color: #d8001b"/>
          <span>异常：{{ statistics.alarmCount }}</span>
        </div>
        <div>
          <el-icon name="location-information" style="color: #000000"/>
          <span>未知：{{ statistics.otherCount}}</span>
        </div>
      </div>
    </el-form>

    <div ref="indoorContainer" style="height: calc(100% - 60px); position: relative;">
      <IndoorMap ref="indoorMap" :img="img" :data="mapData" :nodeMouseenter="nodeMouseenter" :nodeMouseleave="nodeMouseleave"/>
      <!-- 详情 -->
      <el-form :model="form" :class="tipClass" :style="tipPosition">
        <el-form-item :label="tipTitle" label-width="40px">{{ form.collectionTime }}</el-form-item>
        <el-form-item label="设备名称：">{{ form.devName }}</el-form-item>
        <el-form-item label="设备编号：">{{ form.devNo }}</el-form-item>
        <el-form-item label="所属科室：">{{ form.departmentName }}</el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
import IndoorMap from '../../indoormap/index';
import {
  queryDeviceByKeyWord,
  queryDeviceCountByFloor,
  queryDevicePosition,
  queryFloorStructure
} from '@/api/hospital/equipment';

const formModel = {
  deviceId: null,
  status: null,
  devNo: null,
  devName: null,
  departmentName: null,
  collectionTime: null,
};

export default {
  name: 'EquipmentPosition',
  components: {IndoorMap},
  data() {
    return {
      search: {
        storeyId: null,
        deviceId: null
      },
      statistics: {
        totalCount: 0,
        onlineCount: 0,
        offlineCount: 0,
        alarmCount: 0,
        faultCount: 0,
        otherCount: 0
      },

      img: null,
      mapData: {
        nodes: []
      },
      tipX: 0,
      tipY: 0,
      form: { ...formModel },

      loading: false,
      stores: [],
      devices: []
    };
  },
  computed: {
    fontX() {
      return 30 / this.$refs.indoorContainer.offsetWidth;
    },
    fontY() {
      return 36 / this.$refs.indoorContainer.offsetHeight;
    },
    tipTitle() {
      switch (this.form.status) {
        case 'OFFLINE':
          return '关机'
        case 'ONLINE':
          return '开机'
        case 'ALARM':
          return '异常'
        default:
          return '设备';
      }
    },
    tipClass() {
      switch (this.form.status) {
        case 'ONLINE':
          return 'indoor-formtips green';
        case 'OFFLINE':
          return 'indoor-formtips lightgray';
        case 'FAILURE':
          return 'indoor-formtips orange';
        case 'ALARM':
          return 'indoor-formtips red';
        default:
          return 'indoor-formtips black';
      }
    },
    tipPosition() {
      return {
        left: `${this.tipX}px`,
        top: `${this.tipY}px`,
        display: this.tipX && this.tipY ? 'block' : 'none'
      }
    }
  },
  created() {
    this.loadFloor(() => {
      if (this.$route.params?.id) {
        this.loadByRouter();
      } else if (Array.isArray(this.stores)) {
        this.loadDefault();
      }
    });
  },
  methods: {
    loadFloor(callback) {
      queryFloorStructure({
        type: 1
      }).then(res => {
        this.stores = res.data.map(item => ({
          id: item.id,
          label: item.floorName,
          children: item.children?.length ? item.children : null
        }));
        callback && callback();
      });
    },
    loadStorey(node, callback) {
      if (!node) {
        return;
      }
      if (Array.isArray(node.children)
        && node.children.length > 0) {
        return callback && callback();
      }
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
    loadDefault() {
      const first = this.stores[0];
      this.loadStorey(first, () => {
        if (Array.isArray(first.children)
          && first.children.length > 0) {
          this.search.storeyId = first.children[0].id;
          this.query();
        }
      });
    },
    loadByRouter() {
      this.devices.push({...this.$route.params});
      this.search.deviceId = this.$route.params?.id;
      this.query(this.singleStoreyBack);
    },
    singleStoreyBack(single) {
      let storey = this.stores?.find(item => item.id === single.floorId);
      if (storey) {
        this.loadStorey(storey, () => {
          this.search.storeyId = single.storeyId;
        });
      }
    },
    coordCalculate(points) {
      let len = points.length;
      let sqr = Math.sqrt(len);
      let col = Math.ceil(sqr);
      let row = Math.ceil(sqr);
      let cx = Math.floor(col / 2);
      let cy = Math.floor(row / 2);
      let item, result = [];
      loop:for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
          item = points[--len];
          if (!item) {
            break loop;
          }
          item.xPoint = item.xPoint + (j - cx) * this.fontX;
          item.yPoint = item.yPoint + (i - cy) * this.fontY
          result.push({
            model: {
              id: `${item.deviceId}`,
              type: 'position',
              state: this.covertState(item.status),
            },
            record: { ...item }
          });
        }
      }
      return result;
    },
    convertNodes(points) {
      if (!Array.isArray(points)) {
        return;
      }
      let groupTemp = {};
      this.img = null;
      this.mapData.nodes = [];
      points.forEach(item => {
        this.img = item.mapUrl;
        let key = `${item.xPoint}-${item.yPoint}`;
        let group = groupTemp[key];
        if (group) {
          group.push(item);
        } else {
          groupTemp[key] = [ item ];
        }
      });

      Object.keys(groupTemp).forEach(key => {
        this.mapData.nodes.push(...this.coordCalculate(groupTemp[key]));
      });
    },
    queryDevicePosition(singleBack){
      queryDevicePosition({
        ...this.search
      }).then(res => {
        this.convertNodes(res.data);
        if (res.data.length === 1) {
          singleBack && singleBack(res.data[0]);
        }
      });
    },
    query(singleBack) {
      this.queryDevicePosition(singleBack);
      this.queryDeviceCountByFloor()
    },
    covertState(status) {
      switch (status) {
        case 'ONLINE':
          return 'green'
        case 'OFFLINE':
          return 'lightgray'
        case 'FAILURE':
          return 'orange'
        case 'ALARM':
          return 'red'
        default:
          return 'black';
      }
    },
    reset() {
      this.search = {
        storeyId: this.stores?.[0].children?.[0]?.id,
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
    loadOptions({parentNode, callback}) {
      this.loadStorey(parentNode, callback);
    },
    treeSelect(node) {
      queryDeviceCountByFloor({
        floorId: node.id,
        deviceId: this.search.deviceId,
      }).then(res => {
        this.statistics.totalCount = res.data?.totalCount || 0;
        this.statistics.onlineCount = res.data?.onlineCount || 0;
        this.statistics.offlineCount = res.data?.offlineCount || 0;
        this.statistics.alarmCount = res.data?.alarmCount || 0;
        this.statistics.faultCount = res.data?.faultCount || 0;
        this.statistics.otherCount = res.data?.otherCount || 0;
      });
    },
    queryDeviceCountByFloor() {
      queryDeviceCountByFloor({
        floorId: this.search.storeyId,
        deviceId: this.search.deviceId,
      }).then(res => {
        this.statistics.totalCount = res.data?.totalCount || 0;
        this.statistics.onlineCount = res.data?.onlineCount || 0;
        this.statistics.offlineCount = res.data?.offlineCount || 0;
        this.statistics.faultCount = res.data?.faultCount || 0;
        this.statistics.alarmCount = res.data?.alarmCount || 0;
        this.statistics.otherCount = res.data?.otherCount || 0;
      });
    },
    nodeMouseenter(evt) {
      let item = evt.item;
      let model = item.getModel()
      let bbox = item.get('group').getCanvasBBox();
      this.form = model.record;
      this.tipX = bbox.x + 36;
      this.tipY = bbox.y;
    },
    nodeMouseleave() {
      this.tipX = 0;
      this.tipY = 0;
      this.form = { ...formModel };
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

  .indoor-formtips {
    width: 300px;
    position: absolute;
    background-color: #ffffff;
    border-radius: 5px;

    &.green {
      border: 1px solid #95f202;

      .el-form-item:first-child {
        background-color: #95f202;
      }
    }

    &.red {
      border: 1px solid #d8001b;

      .el-form-item:first-child {
        background-color: #d8001b;
      }
    }

    &.lightgray {
      border: 1px solid #aaaaaa;

      .el-form-item:first-child {
        background-color: #aaaaaa;
      }
    }

    &.blue {
      border: 1px solid #3765ff;

      .el-form-item:first-child {
        background-color: #3765ff;
      }
    }

    &.orange {
      border: 1px solid #f59b22;

      .el-form-item:first-child {
        background-color: #f59b22;
      }
    }

    &.black {
      border: 1px solid #000000;

      .el-form-item:first-child {
        background-color: #000000;
      }
    }

    .el-form-item {
      padding: 0 15px;
      margin-bottom: 5px;

      &:not(:first-child) {
        margin-bottom: 0;
      }

      &:first-child {
        padding-right: 0;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;

        ::v-deep {

          & > label {
            color: #ffffff;
            line-height: 40px;
            font-size: 14px;
          }

          .el-form-item__content {
            float: right;
            display: block;
            padding-right: 10px;
            color: #ffffff;
          }
        }
      }
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
