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
        <el-timeline-item v-for="(activity, index) in activities" v-if="activity.index > 0"
          :key="index" :timestamp="activity.timestamp" hide-timestamp>
          <template slot="dot">
            <div :class="['node-timeline-dot', activity.color]">{{ activity.index }}</div>
          </template>
          <div style="padding-top: 7px; cursor: pointer;" @click="timelineClick(activity, index)">
            <div>
              {{ activity.content }}
            </div>
            <div style="color: #cfd3d5; padding-top: 5px; font-size: 13px;">
              {{ activity.timestamp }}
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
        activities: [],
        search: {
          startDate: null,
          endDate: null,
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
          start: '00:00',
          step: '00:01',
          end: '23:59',
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
          this.medicals.push({
            key: '2-4',
            label: '【主流程】医疗设备类型'
          })
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
        queryDeviceTrack(this.search).then(res => {
          this.radios = res.data;
          this.radios?.forEach(storey => {
            let result = [], prev;
            storey.locationPointLocusList.forEach(item => {
              if (prev) {
                if (prev.nowPoint === item.nowPoint) {
                  prev = item;
                } else {
                  result.push(prev);
                  prev = item;
                }
              } else {
                prev = item;
              }
              prev = item;
            });
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
        this.img = storey.mapUrl;
        this.activities = [];
        this.mapData.nodes = [];
        this.mapData.edges = [];
        const nodes = new Set();
        const edges = new Set();
        let prev;
        let idx = 1, timeIdx = 1;

        this.radios[val]?.locationPointLocusList?.forEach(item => {
          if (item.pointType === 0) {
            this.activities.push({
              id: `${item.nowPoint}`,
              index: timeIdx++,
              color: 'lightgray',
              content: item.pointName,
              timestamp: item.createdTime,
            });
          } else {
            this.activities.push({
              id: `${item.nowPoint}`,
              color: 'lightgray',
              content: item.pointName,
              timestamp: item.createdTime,
            });
          }
          if (prev && prev.nowPoint !== item.nowPoint) {
            let edgeId = `${prev.nowPoint}-${item.nowPoint}`;
            if (!edges.has(edgeId)) {
              edges.add(edgeId);
              if (item.pointType === 0) {
                this.mapData.edges.push({
                  source: `${prev.nowPoint}`,
                  target: `${item.nowPoint}`,
                  style: {
                    stroke: '#aadef8',
                    lineWidth: 4
                  }
                })
              } else {
                this.mapData.edges.push({
                  source: `${prev.nowPoint}`,
                  target: `${item.nowPoint}`,
                  style: {
                    stroke: '#aadef8',
                    lineWidth: 4,
                    endArrow: false
                  }
                })
              }
            }
          }
          if (!nodes.has(item.nowPoint)) {
            nodes.add(item.nowPoint);
            if (item.pointType === 0) {
              this.mapData.nodes.push({
                id: `${item.nowPoint}`,
                x: item.nowPointX,
                y: item.nowPointY,
                type: 'circle',
                size: 25,
                label: `${idx++}`,
                style: {
                  fill: '#aadef8',
                  stroke: '#aadef8'
                },
                labelCfg: {
                  position: 'center',
                  style: {
                    fill: '#ffffff',
                    fontSize: 15
                  }
                }
              });
            } else {
              this.mapData.nodes.push({
                id: `${item.nowPoint}`,
                x: item.nowPointX,
                y: item.nowPointY,
                type: 'circle',
                size: 3,
                style: {
                  fill: '#aadef8',
                  stroke: '#aadef8'
                }
              });
            }
          }
          prev = item;
        });
      },
      timelineClick(curr, index) {
        let length = this.activities.length;
        let item = null, nodes = [];
        let flag = true;
        if (length === index) {
          nodes.push(this.activities[index]);
          for (let i = index - 1; i > 0; i--) {
            item = this.activities[i];
            if (flag) {
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
        } else {
          nodes.push(curr);
          for (let i = 0; i < length; i++) {
            item = this.activities[i];
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
        // console.log(nodes)
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
