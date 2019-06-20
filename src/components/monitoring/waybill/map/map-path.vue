<style scoped>
  .map-path {
    margin-bottom: 10px;
  }

  h3 {
    padding-left: 10px;
  }

  .map-btn {
    position: absolute;
    right: 5px;
    top: 5px;
    background: #fff;
  }
</style>
<template>
  <div>
    <h3 v-show="vid==='waybillMap'">
      轨迹信息
      <span @click="showBigMap(vhList)" class="des-btn">
            <a href="#" class="btn-circle" @click.prevent="">
                 <i class="el-icon-zoom-in"></i></a>查看大图
      </span>
    </h3>

    <!--<div v-show="!isHasPath" class="empty-info mini">暂无轨迹信息</div>-->
    <div style="position: relative">
      <el-amap ref="pathMap" :vid="vid" :amap-manager="amapManager"
               :zoom="10" :center="center" class="map-path" :style="mapStyle">
      </el-amap>
      <el-checkbox v-show="vid!=='waybillMap'" class="map-btn" size="mini" v-model="isShowTemp" label="1" border>温度
      </el-checkbox>
    </div>
  </div>
</template>
<script>
  import {AMapManager} from 'vue-amap';
  import MapMixin from '@/mixins/mapMixin';
  import StorageMixin from '@/mixins/StorageMixin';

  window.$mapInit();
  const StartIndex = 'StartIndex';
  const CurrentIndex = 'CurrentIndex';
  const EndIndex = 'EndIndex';
  const markerIconLabel = {
    StartIndex: '起',
    CurrentIndex: '',
    EndIndex: '终'
  };
  const markerIconLabelColor = {
    StartIndex: 'lightgreen',
    CurrentIndex: 'darkblue',
    EndIndex: 'darkblue'
  };
  export default {
    props: {
      vhList: Array,
      tempDataList: Array,
      isLoaded: Boolean,
      formItem: Object,
      showBigMap: Function,
      mapStyle: {
        type: Object,
        default() {
          return {
            height: '200px'
          };
        }
      },
      vid: {
        type: String,
        default: 'pathMap'
      }
    },
    mixins: [MapMixin, StorageMixin],
    data() {
      return {
        center: [121.5273285, 31.21515044],
        amapManager: new AMapManager(),
        pathSimplifierIns: null,
        isHasPath: false,
        points: false,
        isShowTemp: false
      };
    },
    computed: {
      stateIsShowTemp() {
        return this.$store.state.isShowTemp;
      }
    },
    watch: {
      isLoaded(val) {
        this.points = [];
        this.amapManager._map && this.amapManager._map.clearMap();
        this.pathSimplifierIns && this.pathSimplifierIns.setData([]);
        if (!val) return;
        this.isShowTemp = !!JSON.parse(window.localStorage.getItem('isShowTemp'));
        this.queryPath();
      },
      isShowTemp(val) {
        this.amapManager._map && this.amapManager._map.clearMap();
        this.$store.commit('initShowTemp', val);
        window.localStorage.setItem('isShowTemp', val);
        this.drawPoint(this.points);
      },
      stateIsShowTemp(val) {
        this.isShowTemp = val;
      }
    },
    mounted() {
      this.addMapTools();
    },
    methods: {
      queryPath() {
        if (!this.vhList[0]) return;
        if (!this.formItem.departTime) return;
        let params = {
          devNo: this.vhList[0].devs[0].devCode,
          startDate: this.formItem.departTime,
          endDate: this.formItem.arriveTime
        };
        this.$http.get('/location-data', {params}).then(res => {
          const points = res.data.filter(f => f.longitude && f.latitude).map((m, index) => {
            return {
              lnglat: [m.longitude, m.latitude],
              time: this.$moment(m.collectionTime).format('YYYY-MM-DD HH:mm:ss'),
              name: this.formItem.arriveAddress,
              positioningTime: m.collectionTime
            };
          });
          this.drawHandler(points);
          // 转换坐标
          // this.convertForm(points, this.drawHandler, points);
        });
      },
      drawHandler(points) {
        this.points = points;
        this.isHasPath = !!points.length;
        this.amapManager._map.clearMap();
        // 轨迹
        this.drawPath(points);
        this.drawPoint(points);
      },
      // 转换坐标
      convertForm(prePoints, cb, totalPoints) {
        if (!prePoints.length) {
          cb(totalPoints);
          return;
        }
        let points = [];
        let nextPoints = [];
        const limit = 40;
        points = prePoints.slice(0, prePoints.length > limit ? limit : prePoints.length);
        nextPoints = prePoints.length > limit ? prePoints.slice(limit) : [];
        window.AMap.convertFrom(points.map(m => m.lnglat), 'baidu', (status, result) => {
          if (result.info === 'ok') {
            points.forEach((i, index) => {
              i.lnglat = [result.locations[index].lng, result.locations[index].lat];
            });
          }
          this.convertForm(nextPoints, cb, totalPoints);
        });
      },
      // 画线
      drawPath(points) {
        if (!points.length) return;
        window.$lazyAMapApiLoaderInstance().then(() => {
          if (!window.AMapUI) {
            this.drawPath(points);
            return;
          }
          window.AMapUI.loadUI(['misc/PathSimplifier'], PathSimplifier => {
            const pathSimplifierIns = this.pathSimplifierIns ? this.pathSimplifierIns : this.createPathSimplifier(PathSimplifier);
            pathSimplifierIns.setData([{points}]);
            pathSimplifierIns.setSelectedPathIndex(0);
            // 点自适应窗口
            this.amapManager._map.setFitView();
          });
        });
      },
      // 创建轨迹线对象
      createPathSimplifier(PathSimplifier) {
        const that = this;
        const pathSimplifierIns = new PathSimplifier({
          zIndex: 100,
          map: this.amapManager._map, //所属的地图实例
          getPath: function (pathData, pathIndex) {
            let points = pathData.points;
            let lnglatList = [];
            for (let i = 0, len = points.length; i < len; i++) {
              lnglatList.push(points[i].lnglat);
            }
            return lnglatList;
          },
          getHoverTitle: function (pathData, pathIndex, pointIndex) {
            // 勾选温度标签
            if (that.stateIsShowTemp) return '';
            // 不在点上
            if (!pointIndex) return '';
            return that.getPointLabel(pathData.points[pathIndex]);
          },
          renderOptions: {
            hoverTitleStyle: {
              classNames: 'marker-hover-title'
            }
          }
        });
        this.pathSimplifierIns = pathSimplifierIns;
        return pathSimplifierIns;
      },
      getPointLabel(point) {
        let ary = this.getStorageItem('tempVhDataList') || [];
        point.devTempList = ary.map(t => {
          let cyt = JSON.parse(JSON.stringify(t));
          cyt.pointTempDataAry = t.tempData.filter(f => f.createTime === point.positioningTime);
          return cyt;
        });
        return this.formatLabel(point);
      },
      drawPoint(points, isNotFirst) {
        if (this.vid === 'waybillMap') return;
        if (!points.length) return;
        let prePoints = [];
        let nextPoints = [];
        const limit = 10;
        prePoints = points.slice(0, points.length > limit ? limit : points.length);
        nextPoints = points.length > limit ? points.slice(limit) : [];
        const makers = prePoints.map(m => {
          let ary = this.getStorageItem('tempVhDataList') || [];
          m.devTempList = ary.map(t => {
            let cyt = JSON.parse(JSON.stringify(t));
            cyt.pointTempDataAry = t.tempData.filter(f => f.createTime === m.positioningTime);
            return cyt;
          });
          return m;
        });
        makers.forEach((i, index) => {
          if (index === 0 && !isNotFirst) {
            this.createSimpleMarker(i, StartIndex);
          } else if (!nextPoints.length && index === makers.length - 1) {
            this.createSimpleMarker(i, this.formItem.arriveTime ? EndIndex : CurrentIndex);
          } else {
            this.createSvgMarker(i, false);
          }
        });
        setTimeout(() => {
          this.drawPoint(nextPoints, true);
        }, 100);
      },
      createSimpleMarker(i, iconIndex) {
        window.$lazyAMapApiLoaderInstance().then(() => {
          if (!window.AMapUI) {
            this.createSimpleMarker(i, iconIndex);
            return;
          }
          window.AMapUI.loadUI(['overlay/SimpleMarker'], SimpleMarker => {
            const m = new SimpleMarker({
              //前景文字
              iconLabel: {
                innerHTML: `<div>${markerIconLabel[iconIndex]}</div>`,
                style: {
                  color: '#fff'
                }
              },
              //图标主题
              iconTheme: 'default',
              //背景图标样式
              iconStyle: markerIconLabelColor[iconIndex],
              map: this.amapManager._map,
              showPositionPoint: false, //显示定位点
              position: i.lnglat,
              label: this.isShowTemp ? {
                content: this.formatLabel(i),
                offset: new window.AMap.Pixel(36, -5)
              } : null
            });
          });
        });
      },
      createSvgMarker(i) {
        window.$lazyAMapApiLoaderInstance().then(() => {
          if (!window.AMapUI) {
            this.createSvgMarker(i);
            return;
          }
          window.AMapUI.loadUI(['overlay/SvgMarker'], SvgMarker => {
            //创建一个shape实例，比如水滴状
            const shape = new SvgMarker.Shape.Circle({
              radius: 5, //高度
              fillColor: 'orange', //填充色
              strokeWidth: 1, //描边宽度
              strokeColor: '#666' //描边颜色
            });
            //利用该shape构建SvgMarker
            const marker = new SvgMarker(
              //第一个参数传入shape实例
              shape,
              //第二个参数为SimpleMarker的构造参数（iconStyle除外）
              {
                // showPositionPoint: true, //显示定位点
                map: this.amapManager._map,
                position: i.lnglat,
                label: this.isShowTemp ? {
                  content: this.formatLabel(i),
                  offset: new window.AMap.Pixel(16, -12)
                } : null
              }
            );
          });
        });

      },
      formatTempLevel(temp) {
        if (temp === '无数据') return '';
        temp = parseFloat(temp);
        if (temp > 8 || temp < 2) return 'data_error';
        if (temp < 4) return 'data_0';
        else if (temp < 6) return 'data_1';
        else return 'data_2';
      },
      formatLabel(i) {
        let time = `<div class="time">${i.time.slice(5, i.time.length - 3)}</div>`;
        let content = i.devTempList.map((t, index) => {
          if (t.pointTempDataAry.length > 1) {
            t.pointTempDataAry = [t.pointTempDataAry[0]];
          }
          let tempData = t.pointTempDataAry.map(pt => pt.devActval).join('');
          tempData = tempData ? tempData + '℃' : '无数据';
          return `<div class="${tempData === '无数据' ? 'no-data' : ''} content">
                    <div class="name">${t.name}</div><div class="data ${this.formatTempLevel(tempData)}">${tempData}</div></div>`;
        }).join('');
        return `<div class="marker-title">${content}${time}</div>`;
      }
    }
  };
</script>
