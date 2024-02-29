<template>
  <div class="app-container">
    <!-- 搜索 -->
    <el-form :model="search" inline>
      <el-form-item>
        <el-date-picker v-model="daterange"
          type="datetimerange"
          unlink-panels
          :editable="false"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-value="defaultDate"
          :default-time="['00:00:00', '23:59:59']"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          @focus="focusDaterange"
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
        <el-radio-button v-for="(item, index) in radios" :key="index" :label="index">{{ item.floorName }}</el-radio-button>
      </el-radio-group>

      <IndoorMap ref="indoorMap" :img="img" :data="mapData"/>

      <el-timeline class="node-timeline">
        <el-timeline-item v-for="(item, index) in timelines"
          :key="index" :timestamp="item.timestamp" hide-timestamp>
          <template slot="dot">
            <div :class="['node-timeline-dot', item.color]">{{ item.index }}</div>
          </template>
          <div style="padding-top: 7px; cursor: pointer;" @click="timelineClick(index)">
            <div>
              {{ item.content }}
            </div>
            <div style="color: #cfd3d5; padding-top: 5px; font-size: 13px;">
              {{ item.timestamp }}
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';
  import IndoorMap from '../../indoormap/index';
  import { sinopharmDictDataType } from '@/api/system/dict/data';
  import { queryDeviceByType, queryFloorStructure, queryDeviceTrack } from '@/api/hospital/equipment';

  export default {
    name: 'EquipmentTrajectory',
    components: { IndoorMap },
    data() {
      return {
        nodepoints: [],
        search: {
          startDate: moment().format('yyyy-MM-DD 00:00:00'),
          endDate: moment().format('yyyy-MM-DD 23:59:59'),
          devType: null,
          deviceId: null,
          storeyId: null
        },
        devices: [],
        coolDevs: [],
        medicals: [],
        storeies: [],
        radios: [],
        floor: null,
        img: null,
        mapData: {
          nodes: [],
          edges: []
        },
        minDate: 0,
        maxDate: Date.now(),
        pickerOptions: {
          onPick: ({minDate}) => {
            let min = 0, max = Date.now();
            if (minDate) {
              min = minDate.getTime() - this.searchRange;
              max = minDate.getTime() + this.searchRange;
            }
            this.minDate = min;
            this.maxDate = max;
          },
          disabledDate: date => {
            let timestamp = date.getTime();
            return timestamp < this.minDate || timestamp > this.maxDate;
          }
        },
        defaultDate: moment().subtract(1, "month").toDate(),
        searchRange: 1000 * 60 * 60 * 24 * 7
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
          this.search.startDate = values?.[0] || null;
          this.search.endDate = values?.[1] || null;
        }
      },
      mapRef() {
        return this.$refs.indoorMap;
      },
      deviceTypes() {
        return this.coolDevs.concat(this.medicals);
      },
      timelines() {
        return this.nodepoints.filter(item => item.index > 0);
      }
    },
    created() {
      this.getDeviceTypes();
      this.getCoolDevType();
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
      getCoolDevType() {
        sinopharmDictDataType('coolDevType').then(res => {
          this.coolDevs = res.data?.map(item => ({
            key: `1-${item.key}`,
            label: item.label
          }));
        });
      },
      getDeviceTypes(){
        sinopharmDictDataType('device_type').then(res=>{
          this.medicals = res.data?.map(item => ({
            key: `2-${item.key}`,
            label: item.label
          }));
        })
      },
      focusDaterange() {
        this.minDate = 0;
        this.maxDate = Date.now();
      },
      typeChange(deviceType) {
        if (!deviceType) {
          this.search.deviceId = null;
          return (this.devices = []);
        }
        const [deviceMode, typeId] = deviceType.split('-');
        queryDeviceByType({ deviceMode, typeId }).then(res => {
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
        this.nodepoints = [];
        queryDeviceTrack(this.search).then(res => {
          this.radios = res.data;
          this.radios?.forEach(storey => {
            let i = 0, result = [], nodeIds = new Set();
            storey.locationPointLocusList.forEach(item => {
              if (result[i]?.nowPoint !== item.nowPoint) {
                result[++i] = item;
              }
              nodeIds.add(item.nowPoint);
            });
            storey.nodeIds = nodeIds;
            storey.locationPointLocusList = result;
          });
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
        const storey = this.radios[val];
        if (!storey) {
          this.mapData = {
            nodes: [],
            edges: []
          }
          return (this.img = null);
        }

        let timeIdx = 1;
        const nodes = {}, edges = {};
        const nodeIds = storey.nodeIds;

        this.img = storey.mapUrl;
        this.nodepoints = [];
        storey.locationPointLocusList?.forEach(item => {

          let timeline = {
            id: `${item.nowPoint}`,
            color: 'lightgray',
            content: item.pointName,
            targetId: item.id,
            timestamp: item.reportTime,
          };
          if (item.pointType === 0) {
            timeline.index = timeIdx++;
          }
          this.nodepoints.push(timeline);

          if (item.nowPoint !== item.belongPoint
            && nodeIds.has(item.nowPoint)
            && nodeIds.has(item.belongPoint)) {

            let edgeKey = `${item.belongPoint}-${item.nowPoint}`;
            if (edges[edgeKey]) {
              edges[edgeKey].data.push(item.id);
            } else {
              let edge = {
                source: `${item.belongPoint}`,
                target: `${item.nowPoint}`,
                style: {
                  stroke: '#aadef8',
                  lineWidth: 4
                },
                data: [ item.id ]
              };
              if (item.pointType !== 0) {
                edge.style.endArrow = false;
              }
              edges[edgeKey] = edge;
            }
          }

          if (!nodes[item.nowPoint]) {
            let node = {
              id: `${item.nowPoint}`,
              x: item.nowPointX,
              y: item.nowPointY,
              type: 'circle',
              size: 3,
              style: {
                fill: '#aadef8',
                stroke: '#aadef8'
              }
            };

            if (item.pointType === 0) {
              node.size = 25;
              node.labelCfg = {
                position: 'center',
                style: {
                  fill: '#ffffff',
                  fontSize: 15
                }
              };
            }
            nodes[item.nowPoint] = node;
          }
        });
        this.mapData.nodes = Object.values(nodes);
        this.mapData.edges = Object.values(edges);
      },
      timelineClick(tlIndex) {
        let flag = true, curr, index = 0, cnt = 0;
        let length = this.nodepoints.length;
        for (; index < length; index++) {
          curr = this.nodepoints[index];
          if (!curr.index) {
            continue;
          }
          if (cnt++ === tlIndex) {
            break;
          }
        }
        let item = null, nodes = [];
        if (length === index + 1) {
          nodes.push(this.nodepoints[index]);
          for (let i = index - 1; i > -1; i--) {
            item = this.nodepoints[i];
            if (flag) {
              nodes.splice(0,0, item);
              if (item.index > 0) {
                flag = false;
                item.color = 'blue';
              }
            } else {
              if (item.index > 0) {
                item.color = 'lightgray';
              }
            }
          }
        } else {
          nodes.push(curr);
          for (let i = 0; i < length; i++) {
            item = this.nodepoints[i];
            if (i > index && flag) {
              nodes.push(item);
              if (item.index > 0) {
                flag = false;
                item.color = 'blue';
              }
            } else {
              if (item.index > 0) {
                item.color = 'lightgray';
              }
            }
          }
        }
        curr.color = 'blue';
        this.mapRef.highlightTrajectory(nodes);
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

      .node-timeline {
        position: absolute;
        left: 30px;
        bottom: 30px;
        max-height: 70%;
        padding: 0 10px;
        overflow-y: auto;

        .node-timeline-dot {
          width: 25px;
          color: #ffffff;
          border-radius: 13px;
          margin-left: -8px;
          text-align: center;
          line-height: 25px;

          &.blue {
            background-color: #01a7f0;
          }

          &.lightgray {
            background-color: #cfd3d5;
          }
        }
      }
    }
  }
</style>
