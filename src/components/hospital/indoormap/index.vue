<template>
  <div class="indoor-map">
    <!-- 按钮 -->
    <div v-if="editable" class="indoor-button">
      <el-button type="primary"
        icon="el-icon-location-information"
        :disabled="!map || !map.url"
        @click="clickPoint">标点</el-button>
      <oms-el-upload
        accept="image/*"
        :action="action"
        :on-error="uploadError"
        :on-success="uploadSuccess"
        :show-file-list="false"
        style="float: right;"
      >
        <el-button type="primary" class="el-upload"
          slot="trigger"><icon :style="iconStyle"/>上传地图</el-button>
        <div slot="tip">地图上传将替换原有地图，原有标点将失效</div>
      </oms-el-upload>
    </div>

    <!-- 地图 -->
    <div ref="floorMap" :class="floorClass">
      <div v-if="!map || !map.url">
        <img src="@/assets/img/map_icon.png" style="height: 30vh;"/>
      </div>
    </div>

    <!-- 工具 -->
    <div v-if="map && map.url" @click="indoorToolbar"
      class="indoor-toolbar">
      <el-icon name="zoom-in"/>
      <el-icon name="zoom-out"/>
      <el-icon name="full-screen"/>
    </div>

    <!-- 表单 -->
    <el-form :model="form" :class="['indoor-formedit', editopen ? 'opened' : 'closed']">
      <el-form-item :label="detail ? '详情' : '标点'">
        <el-button type="text" icon="el-icon-close" @click="canvasClick"></el-button>
      </el-form-item>
      <el-form-item v-if="storey" label="所在楼层：">
        {{ storey.name }}
      </el-form-item>
      <el-form-item label="点位类型：">
        <el-radio-group v-model="form.pointType" :disabled="form.id && detail">
          <el-radio :label="0">定位点</el-radio>
          <el-radio :label="1">途径点</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="横轴坐标：" label-width="82px">
        <el-input v-model.number="form.xPoint" readonly/>
      </el-form-item>
      <el-form-item label="纵轴坐标：" label-width="82px">
        <el-input v-model.number="form.yPoint" readonly/>
      </el-form-item>
      <el-form-item label="标注区域（点位）名称：">
        <el-input v-model="form.pointName" :readonly="form.id && detail" maxlength="10" placeholder="标注区域（点位）名称"/>
      </el-form-item>
      <el-form-item>
        <template v-if="form.id && detail">
          <el-button type="danger" @click="delPoint" style="float: left">删除</el-button>
          <el-button type="primary" @click="detail = false">编辑</el-button>
        </template>
        <template v-else>
          <el-button :type="marking ? 'info' : 'success'" @click="markPoint" style="float: left">{{ marking ? '结束标注' : '关联标注'}}</el-button>
          <el-button @click="canvasClick">取消</el-button>
          <el-button type="primary" @click="savePoint">保存</el-button>
        </template>
      </el-form-item>
    </el-form>

    <!-- 详情 -->
    <el-form :model="form" :class="tipClass" :style="tipPosition">
      <el-form-item :label="tipTitle" label-width="40px">{{ form.collectionTime }}</el-form-item>
      <el-form-item label="设备名称：">{{ form.devName }}</el-form-item>
      <el-form-item label="设备编号：">{{ form.devNo }}</el-form-item>
      <el-form-item label="标签SN号：">{{ form.tagSnNumber }}</el-form-item>
      <el-form-item label="所属科室：">{{ form.departmentName }}</el-form-item>
    </el-form>
  </div>
</template>

<script>
  import initG6 from './initG6'
  import mapIcon from '@/assets/img/map_icon.png';
  import OmsElUpload from '@/components/common/upload/upload/src/index.vue';
  import { createFloorPlatPoint, modifyFloorPlatPoint, deleteFloorPlatPoint } from '@/api/hospital/equipment';

  const point = {
    id: null,
    platId: null,
    xPoint: null,
    yPoint: null,
    pointType: null,
    pointName: null,
    contactPoints: []
  };

  export default {
    name: 'IndoorMap',
    components: { OmsElUpload },
    props: {
      map: {
        type: Object,
        default: function() {
          return {
            id: null,
            url: null,
            points: [],
            edges: []
          };
        }
      },
      editable: {
        type: Boolean,
        default: false
      },
      storey: {
        type: Object,
        default: function() {
          return {
            id: null,
            name: null
          };
        }
      },
      /**
       * 地图上传相关
       */
      action: String,
      headers: Object,
    },
    data() {
      return {
        g6: null,
        nodeId: null,
        form: { ...point },
        graph: null,
        width: 800,
        height: 600,
        detail: true,
        editopen: false,
        showTemp: false,
        tipX: 0,
        tipY: 0,
        marking: false,
        relationPoints: [],
        floorClass: 'floor-empty',
        mapzoom: 1,
        ratio: 0.01,
        iconStyle: {
          width: '16px',
          height: '16px',
          display: 'inline-block',
          verticalAlign: 'top',
          marginRight: '5px',
          background: `url(${mapIcon}) center/100% 100%`
        }
      };
    },
    computed: {
      dataPoint() {
        const nodes = this.map?.points?.map(it => Object.assign({
          ...it,
        }, {
          x: this.width * it.x,
          y: this.height * it.y,
          ox: this.width * it.x - this.width / 2,
          oy: this.height * it.y - this.height / 2
        })) || [];
        const edges = this.map?.edges?.map(it => ({ ...it })) || [];
        return {
          nodes: [{
            id: 'temp_node', // String，该节点存在则必须，节点的唯一标识
            x: 0, // Number，节点位置的 x 值
            y: 0, // Number，节点位置的 y 值
            visible: false,
            type: 'position',
            state: 'default',
            form: {
              ...point,
              platId: this.map?.id
            }
          },
          ...nodes],
          edges: [ ...edges ]
        };
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
          case 'OFFLINE':
            return 'indoor-formtips lightgray'
          case 'ONLINE':
            return 'indoor-formtips green'
          case 'ALARM':
            return 'indoor-formtips red'
          default:
            return 'indoor-formtips blue';
        }
      },
      tipPosition() {
        return {
          display: this.tipX && this.tipY ? 'block' : 'none',
          left: `${this.tipX}px`,
          top: `${this.tipY}px`
        }
      }
    },
    watch: {
      map: {
        handler(map) {
          const floorMap = this.$refs.floorMap;
          if (!floorMap) {
            this.floorClass = 'floor-empty';
            return;
          }
          const maparea = floorMap.parentElement;
          this.width = maparea.offsetWidth - 2;
          this.height = maparea.offsetHeight - (this.editable ? 66 : 0) - 2;
          this.canvasClick();
          if (this.g6) {
            this.g6.destroy();
          }
          if (map && map.url) {
            this.floorClass = 'floor-container';
            this.g6 = initG6({
              elm: floorMap,
              width: this.width,
              height: this.height,
              map: map.url,
              data: this.dataPoint,
              canvasClick: this.editable ? this.canvasClick : null,
              nodeClick: this.editable ? this.nodeClick : null,
              nodeMove: this.editable ? this.nodeMove : null,
              nodeMouseenter: this.editable ? null : this.nodeMouseenter,
              nodeMouseleave: this.editable ? null : this.nodeMouseleave
            });
          } else {
            this.floorClass = 'floor-empty';
          }
        },
        deep: true
      },
      'form.contactPoints'(val) {
        if (val && val.length) {
          this.relationPoints = val.map(id => `${id}`);
        } else {
          this.relationPoints = [];
        }
      },
      relationPoints(nval, oval) {
        const narr = Array.isArray(nval);
        const oarr = Array.isArray(oval);
        if (narr) {
          if (oarr) {
            nval.filter(v => oval.indexOf(v) < 0).forEach(v => {
              this.g6.updateState(v, 'lightblue');
            });
          } else {
            nval.forEach(v => {
              this.g6.updateState(v, 'lightblue');
            });
          }
        }
        if (oarr) {
          if (narr) {
            oval.filter(v => nval.indexOf(v) < 0).forEach(v => {
              this.g6.updateState(v, 'blue');
            });
          } else {
            oval.forEach(v => {
              this.g6.updateState(v, 'blue');
            });
          }
        }
      }
    },
    created() {
      document.addEventListener('contextmenu', evt => {
        if (this.findClass(evt.target, 'indoor-map')) {
          evt.preventDefault();
        }
      });
    },
    methods: {
      findClass(elm, cls) {
        if (elm.nodeName.toLowerCase() === 'body') {
          return false;
        }
        return elm.classList.contains(cls)
          || this.findClass(elm.parentElement, cls);
      },
      clickPoint() {
        this.g6?.changeVisibility();
      },
      uploadSuccess(res) {
        this.$emit('upload-success', res);
      },
      uploadError(err) {
        this.$emit('upload-error', err);
      },
      markPoint() {
        this.marking = !this.marking;
      },
      canvasClick() {
        this.detail = true;
        this.marking = false;
        this.editopen = false;
        this.form = { ...point };
        this.relationPoints = [];
      },
      nodeClick(item) {
        const model = item?.get('model');
        const nodeId = model.id;
        if (this.marking) {
          if (this.nodeId !== nodeId && !nodeId.startsWith('temp')) {
            this.relationPoints = this.relationPoints.concat(`${model.form.id}`);
          }
          return;
        }
        Object.assign(this.form, model.form, {
          xPoint: (model.x / this.width).toFixed(4),
          yPoint: (model.y / this.height).toFixed(4)
        });
        this.nodeId = nodeId;
        this.editopen = true;
      },
      nodeMove(item) {
        const model = item?.get('model')
        Object.assign(this.form, {
          xPoint: (model.x / this.width).toFixed(4),
          yPoint: (model.y / this.height).toFixed(4)
        });
      },
      nodeMouseenter(item) {
        const model = item?.get('model')
        if (model.type !== 'position') {
          return;
        }
        const bbox = item.get('group').getCanvasBBox();
        this.form = model.form;
        this.tipX = bbox.x + 36;
        this.tipY = bbox.y;
      },
      nodeMouseleave() {
        this.tipX = 0;
        this.tipY = 0;
        this.form = { ...point };
      },
      indoorToolbar(event) {
        const className = event.target?.className;
        if (className === 'el-icon-zoom-in') {
          if (this.mapzoom > 2) {
            return;
          }
          this.g6?.zoomTo((this.mapzoom += this.ratio));
        } else if (className === 'el-icon-zoom-out') {
          if (this.mapzoom < 0.5) {
            return;
          }
          this.g6?.zoomTo((this.mapzoom *= (1 - this.ratio)));
        } else {
          this.g6?.zoomTo((this.mapzoom = 1));
        }
      },
      async savePoint() {
        try {
          let res = this.form.id ? await modifyFloorPlatPoint({
            ...this.form,
            contactPoints: [ ...this.relationPoints ]
          }) : await createFloorPlatPoint({
            ...this.form,
            contactPoints: [ ...this.relationPoints ]
          });
          if (res.code !== 200) {
            return this.$message.error(res.msg || '标点保存失败');
          }
          if (res.data?.id) {
            this.form.id = res.data.id;
          }
          this.g6.update(this.nodeId, {
            form: { ...this.form }
          });
          this.g6.updateState(this.nodeId, 'blue');
          this.$message.success('标点保存成功');
        } catch (err) {
          console.error(err);
        }
      },
      delPoint() {
        this.$confirm('确定删除该标点？', '删除', {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定'
        }).then(() => {
          deleteFloorPlatPoint({
            id: this.form.id
          }).then(res => {
            if (res.code !== 200) {
              return this.$message.error(res.msg || '标点删除失败');
            }
            this.canvasClick();
            this.g6.removeItem(this.nodeId);
            this.$message.success('标点删除成功');
          });
        });
      }
    }
  }
</script>

<style lang="scss" scoped>

  .indoor-map {
    height: 100%;
    border: 1px solid #e6ebf5;
    border-radius: 5px;
    background-color: #ffffff00;
    position: relative;
    overflow: hidden;

    ::v-deep {
      canvas {
        display: block;
        position: relative;
      }

      .g6-grid-container {
        z-index: auto !important;

        .g6-grid {
          background-size: 100% 100%;
          background-repeat: no-repeat;
          width: 100% !important;
          height: 100% !important;
          position: static !important;
          filter: brightness(103.5%) contrast(134%) hue-rotate(180deg) saturate(0%);
        }
      }
    }

    .indoor-button {
      padding: 15px;

      ::v-deep .el-upload {
        float: right;
        & + div {
          float: left;
          line-height: 36px;
          margin-right: 10px;
          color: #d8001b;
        }
      }
    }

    .floor-container {
      position: relative;
    }

    .floor-empty {
      height: 100%;
      font-size: 16px;
      display: flex;
      text-align: center;
      flex-direction: column;
      justify-content: center;
    }

    .indoor-toolbar {
      width: 36px;
      position: absolute;
      right: 15px;
      bottom: 15px;
    }

    .indoor-formedit {
      width: 350px;
      position: absolute;
      top: 81px;
      right: 15px;
      display: none;
      background-color: #ffffff;
      border: 1px solid #797979;
      border-radius: 5px;
      box-shadow: 0 0 3px 3px #797979;

      .el-form-item {
        padding: 0 15px;

        &:first-child {
          padding-right: 0;
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
          background-color: #3765ff;

          ::v-deep {

            & > label {
              color: #ffffff;
              line-height: 40px;
              font-size: 18px;
            }

            .el-button {
              float: right;
              padding: 0;
              display: block;

              & > i {
                color: #ffffff;
                font-size: 38px;
              }
            }
          }
        }

        &:last-child {
          text-align: right;
        }
      }

      &.opened {
        display: block;
      }

      &.closed {
        display: none;
      }
    }

    .indoor-formtips {
      width: 250px;
      position: absolute;
      top: 81px;
      right: 15px;
      display: none;
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

    .indoor-button > i, .indoor-toolbar > i {
      font-size: 36px;
      cursor: pointer;

      &:hover {
        transform: scale(1.5, 1.5);
      }

      &:not(:first-child) {
        margin-top: 15px;
      }
    }
  }
</style>
