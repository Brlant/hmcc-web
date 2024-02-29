<template>
  <div ref="floorMap" :class="showEmpty ? floorClass : ''" class="indoor-map">
    <div v-if="showEmpty">
      <img src="@/assets/img/map_icon.png" style="height: 30vh;" alt="暂无数据"/>
    </div>

    <!-- 工具 -->
    <div v-if="!showEmpty" @click="indoorToolbar"
      class="indoor-toolbar">
      <el-icon name="zoom-in"/>
      <el-icon name="zoom-out"/>
      <el-icon name="full-screen"/>
    </div>
  </div>
</template>

<script>
  import initG6 from './initG6'

  export default {
    name: 'IndoorMap',
    props: {
      img: String,
      data: {
        type: Object,
        default: function() {
          return {
            nodes: [],
            edges: []
          };
        }
      },
      focus: String,
      nodeClick: Function,
      nodeMove: Function,
      canvasClick: Function,
      canvasMousemove: Function,
      nodeMouseenter: Function,
      nodeMousemove: Function,
      nodeMouseleave: Function,
      nodeContextmenu: Function
    },
    data() {
      return {
        g6: null,
        width: 800,
        height: 600,
        ratio: 0.01,
        mapzoom: 1,
        showEmpty: true,
        floorClass: 'floor-empty'
      };
    },
    computed: {
      dataG6() {
        const nodes = this.data?.nodes?.map(it => Object.assign({
          ...it,
        }, {
          x: this.width * it.x,
          y: this.height * it.y,
          ox: this.width * it.x - this.width / 2,
          oy: this.height * it.y - this.height / 2
        })) || [];
        const edges = this.data?.edges?.map(it => ({ ...it })) || [];
        return {
          nodes: [ ...nodes, {
            id: 'Center_Node',
            x: this.width / 2,
            y: this.height / 2,
            visible: false
          }],
          edges: [ ...edges ]
        };
      }
    },
    watch: {
      img(val) {
        this.g6?.destroy();
        this.g6 = null;
        if (val) {
          this.initG6();
          this.showEmpty = false;
        } else {
          this.showEmpty = true;
        }
      },
      dataG6(data) {
        this.g6?.render(data);
      },
      focus(focus) {
        this.g6?.focusItem(focus);
      }
    },
    methods: {
      initG6() {
        let elm = this.$refs.floorMap;
        this.width = elm.offsetWidth;
        this.height = elm.offsetHeight;

        this.g6 = initG6({
          elm: elm,
          map: {
            img: this.img
          },
          width: this.width,
          height: this.height,
          nodeClick: this.nodeClick,
          nodeMove: this.nodeMove,
          wheelzoom: this.wheelzoom,
          canvasClick: this.canvasClick,
          canvasMousemove: this.canvasMousemove,
          nodeMouseenter: this.nodeMouseenter,
          nodeMousemove: this.nodeMousemove,
          nodeMouseleave: this.nodeMouseleave,
          nodeContextmenu: this.nodeContextmenu
        });
        this.g6.render(this.dataG6);
      },
      changeVisibility(nodeId, visible) {
        this.g6.changeVisibility(nodeId, visible);
      },
      addNode(node) {
        this.g6.addNode(node);
      },
      updateModel(itemId, model) {
        this.g6.update(itemId, model);
      },
      updateState(itemId, state) {
        this.g6.updateState(itemId, state);
      },
      updatePosition(itemId, coordinate) {
        this.g6.updatePosition(itemId, coordinate);
      },
      removeItem(itemId) {
        this.g6.removeItem(itemId);
      },
      highlightTrajectory(nodes) {
        this.g6.highlightTrajectory(nodes);
      },
      indoorToolbar(event) {
        const className = event.target?.className;
        if (className === 'el-icon-zoom-in') {
          if (this.mapzoom > 2) {
            return;
          }
          this.g6.zoomTo((this.mapzoom += this.ratio));
        } else if (className === 'el-icon-zoom-out') {
          if (this.mapzoom < 0.5) {
            return;
          }
          this.g6.zoomTo((this.mapzoom *= (1 - this.ratio)));
        } else {
          this.g6.zoomTo((this.mapzoom = 1));
        }
      },
      wheelzoom(mapzoom) {
        this.mapzoom = mapzoom;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .indoor-map {
    height: 100%;
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
          width: 100%;
          height: 100%;
          background-size: 100% 100%;
          background-repeat: no-repeat;
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

    &.floor-container {
      position: relative;
    }

    &.floor-empty {
      height: 100%;
      font-size: 16px;
      display: flex;
      text-align: center;
      flex-direction: column;
      justify-content: center;
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
    }

    .indoor-toolbar {
      width: 36px;
      position: absolute;
      z-index: 1;
      right: 15px;
      bottom: 15px;

      > i {
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
  }
</style>
