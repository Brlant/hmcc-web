<template>
  <div class="app-container">
    <!-- 搜索 -->
    <el-form :model="search" inline>
      <el-form-item>
        <el-date-picker v-model="daterange"
          type="datetimerange"
          unlink-panels
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="search.devType" clearable placeholder="设备类型" @change="typeChange">
          <el-option
            v-for="(item, index) in deviceTypes"
            :key="index"
            :value="item.key"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="search.deviceId" clearable placeholder="设备">
          <el-option v-for="item in devices" :key="item.value" :value="item.value" :label="item.label"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <treeselect v-model="search.storeyId" :options="storeies" :load-options="loadOptions"
          no-children-text="暂无楼层数据" :disable-branch-nodes="true" placeholder="楼层"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="query">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="trajectory-container">
      <el-radio-group v-model="floor" @input="floorInput" class="floor-tabs">
        <el-radio-button v-for="(item, index) in data" :key="index" :label="index">{{ item.floorName }}</el-radio-button>
      </el-radio-group>
      <IndoorMap :map="map" style="border: none;"/>
    </div>



<!--    <div style="height: calc(100% - 60px)">-->
<!--      <IndoorMap :map="map" :storey="storey"/>-->
<!--    </div>-->
  </div>
</template>

<script>
  import IndoorMap from '../../indoormap/index';
  import { sinopharmDictDataType } from '@/api/system/dict/data';
  import { queryDeviceByType, queryFloorStructure, queryDeviceTrack } from '@/api/hospital/equipment';

  export default {
    name: 'EquipmentTrajectory',
    components: { IndoorMap },
    data() {
      return {
        search: {
          startDate: null,
          endDate: null,
          devType: null,
          deviceId: null,
          storeyId: null
        },
        devices: [],
        deviceTypes:[],
        storeies: [],
        data: [],
        floor: null,
        map: {
          id: null,
          url: null,
          points: null,
          edges: null
        },
        pickerOptions: {
          start: '00:00',
          step: '00:01',
          end: '23:59'
        }
      };
    },
    computed: {
      daterange: {
        get() {
          if (this.search.startDate && this.search.endDate) {
            return [this.search.startDate, this.search.endDate];
          }
          return [];
        },
        set(values) {
          this.search.startDate = values[0];
          this.search.endDate = values[1];
        }
      }
    },
    created() {
      this.getDeviceTypes();
      queryFloorStructure({
        type: 1
      }).then(res => {
        this.storeies = res.data.map(item => ({
          id: item.id,
          label: item.floorName,
          children: item.children?.length ? item.children : null
        }));
      });
    },
    methods: {
      getDeviceTypes(){
        sinopharmDictDataType('device_type').then(res=>{
          this.deviceTypes = res.data.map(item=>{
            return {
              key:item.key,
              label:item.label
            }
          })
        })
      },
      typeChange(typeId) {
        if (!typeId) {
          this.search.deviceId = null;
          return (this.devices = []);
        }
        queryDeviceByType({ typeId }).then(res => {
          this.devices = res.data.map(item => ({
            value: item.id,
            label: item.devName
          }));
          this.search.deviceId = null;
        });
      },
      loadOptions({ parentNode, callback }) {
        queryFloorStructure({
          type: 2,
          upFloor: parentNode.id
        }).then(res => {
          parentNode.children = res.data.map(item => ({
            id: item.id,
            label: item.floorName
          }));
          callback();
        });
      },
      query() {
        queryDeviceTrack(this.search).then(res => {
          this.data = res.data;
          this.floorInput((this.floor = 0));
        });
      },
      reset() {
        this.search = {
          startDate: null,
          endDate: null,
          devType: null,
          deviceId: null,
          storeyId: null
        };
        this.devices = [];
      },
      floorInput(val) {
        const storey = this.data[val];
        if (!storey) {
          return (this.map = {
            id: null,
            url: null,
            points: null,
            edges: null
          });
        }
        this.map.id = storey.id;
        this.map.url = storey.mapUrl;
        this.map.points = [];
        this.map.edges = [];
        const nodes = new Set();
        const edges = new Set();
        let prev;
        this.data[val]?.locationPointLocusList?.forEach(item => {
          if (prev) {
            let leid = `${prev.nowPoint}-${item.nowPoint}`;
            let reid = `${item.nowPoint}-${prev.nowPoint}`;
            if (!edges.has(leid) && !edges.has(reid)) {
              edges.add(leid);
              edges.add(reid);
              this.map.edges.push({
                source: `${prev.nowPoint}`,
                target: `${item.nowPoint}`,
                style: {
                  stroke: '#d8001b',
                  lineWidth: 4
                }
              })
            }
          }
          // if (!nodes.has(item.beforePoint)) {
          //   nodes.add(item.beforePoint);
          //   this.map.points.push({
          //     id: `${item.beforePoint}`,
          //     x: item.beforePointX,
          //     y: item.beforePointY,
          //     type: 'solidpoint',
          //     state: 'red'
          //   });
          // }
          if (!nodes.has(item.nowPoint)) {
            nodes.add(item.nowPoint);
            this.map.points.push({
              id: `${item.nowPoint}`,
              x: item.nowPointX,
              y: item.nowPointY,
              type: 'solidpoint',
              state: 'red'
            });
          }
          prev = item;
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .app-container {
    height: calc(100vh - 70px);
    background-color: #ffffff;
    padding: 10px !important;

    ::v-deep .vue-treeselect {
      padding-top: 2px;
      .vue-treeselect__control, .vue-treeselect__value-container, .vue-treeselect__multi-value {
        width: auto;
        height: 36px;
        line-height: 36px;
      }
    }

    .trajectory-container {
      height: calc(100% - 60px);
      border: 1px solid #e6ebf5;
      border-radius: 5px;
      position: relative;

      .floor-tabs {
        position: absolute;
        top: 15px;
        left: 15px;
        z-index: 1;
      }
    }
  }
</style>
