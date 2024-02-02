<template>
  <svg :style="`left:${currentPos.x}px;top:${currentPos.y}px;height: ${iconScale !== 1 ? '30px' : '20px'}`"
       @click="goTo"
       @mousedown="dragPosition"
       @mouseenter="showDetail" @mouseleave="hideDetail" @mouseup="isDraging = false" class="tm-container">
    <circle :cx="r" :cy="r" :fill="color"
            :r="r"
            :stroke="color"
            stroke-linecap="round"
            stroke-width="0" v-show="item.devType === '3'"></circle>
    <use :height="getDevIconWH(item, 3)" :style="'fill:'+ color" :width="getDevIconWH(item, 2)"
         :xlink:href="getDevIcon(item)" v-show="item.devType !== '3'"></use>
    <text :font-size="12" :x="getDevIconOffset(item).x" :y="getDevIconOffset(item).y"
          fill="#333" text-anchor="start">
      <slot></slot>
    </text>
  </svg>
</template>

<script>
  import iconfont from '../../assets/fonts/iconfont';
  import Utils from '@/tools/utils';

  const {DevIcon} = Utils;
  export default {
    name: 'tm',
    data() {
      return {
        currentPos: {x: '', y: ''},
        currentScale: 1,
        isDraging: false,
        iconfont
      };
    },
    computed: {
      r() { // 半径
        return this.size / 2;
      },
      labelId() {
        return this.item.ccsWarehouseImageDevRelationId + this.iconScale + '';
      }
    },
    props: {
      size: {
        type: Number,
        default: 12
      },
      position: {
        type: Object,
        default: {x: 0, y: 0}
      },
      color: {
        type: String,
        default: '#333'
      },
      readOnly: {
        type: Boolean,
        default: true
      },
      scale: {
        type: Number,
        default: 1
      },
      item: Object,
      iconScale: {
        type: Number,
        default: 1
      },
      tmData: Array
    },
    methods: {
      getDevIcon(item) {
        return '#el-icon-t-' + DevIcon[item.devType][item.warnFlag ? 1 : 0];
      },
      getDevIconWH(item, index) {
        return DevIcon[item.devType][index] * this.iconScale;
      },
      getDevIconOffset(item) {
        if (item.devType === '3') return {x: 2 * this.r + 20, y: this.r + 5};
        // if (item.devType === '1') return {x: DevIcon[item.devType][2] * this.iconScale + 18, y: this.r + 8};
        return {x: 18, y: this.r + 8};
      },
      showDetail(e) {
        let event = event ? event : window.event;
        let target = e.target || event.srcElement;
        // let el = document.getElementById(this.labelId);
        let x = target.getBoundingClientRect().x;
        let y = target.getBoundingClientRect().y;
        if (!this.item._title) {
          let el = document.createElement('div');
          this.item._title = el;
          el.id = this.labelId;
          el.classList.add('temp-title');
          el.style.zIndex = 2004;
          if (this.iconScale === 1.2) {
            let parent = this.$parent.$el;
            el.style.zIndex = parent && parent.style.zIndex || 3000;
          }
          el.style.display = 'none';
          document.body.appendChild(el);
          this.setTitle(el, this.item, x, y);
        } else if (this.item._title.style.display === 'none') {
          this.setTitle(this.item._title, this.item, x, y);
        }
      },
      setTitle(el, item, x, y) {
        if (this.isDraging) {
          el.style.display = 'none';
          return;
        }
        let time = item.recordDate ? this.$moment(item.recordDate).format('YYYY-MM-DD HH:mm:ss') : '';
        el.innerHTML = `<div>名称:${item.ccsDevName}</div><div>编码:${item.devCode}</div><div>最新时间:${time}</div>`;
        el.style.display = 'block';
        let w = el.clientWidth;
        let cx = 0;
        let cy = 0;
        // if (x > 130) {
        //   cx = x - w - 5;
        //   cy = y - 6;
        // } else {
        //   cx = x - w / 2;
        //   cy = y - 42;
        // }
        cx = x - w - 5;
        cy = y - 6;
        el.style.left = cx + 'px';
        el.style.top = cy + 'px';
      },
      hideDetail(e) {
        let event = e ? e : window.event;
        let target = event.target || event.srcElement;
        let el = this.item._title || document.getElementById(this.labelId);
        el && (el.style.display = 'none');
        this.hiddenAllTitle();
      },
      hiddenAllTitle() {
        let eles = document.querySelectorAll('.temp-title');
        [...eles].forEach(i => (i.style.display = 'none'));
      },
      goTo() {
        if (!this.readOnly) {
          return false;
        }
        let el = this.item._title || document.getElementById(this.labelId);
        el && (el.style.display = 'none');
        this.$turnDevDate(this.item, this.devType === '4' ? '2' : '1');
      },
      getPos(e) {//这是一个 获取鼠标位置的函数
        let oEvent = e || event;
        return {
          x: oEvent.clientX + document.documentElement.scrollLeft || document.body.scrollLeft,
          y: oEvent.clientY + document.documentElement.scrollTop || document.body.scrollTop
        };
      },
      dragPosition(e) {
        if (this.readOnly) {
          return false;
        }
        let self = this;
        let oEvent = e || event;
        let rootNode = this.$el.parentNode;
        let oldPos = this.getPos(oEvent);
        oldPos = {
          x: oldPos.x - this.currentPos.x,
          y: oldPos.y - this.currentPos.y
        };
        this.isDraging = true;
        rootNode.onmousemove = function (e) {
          let oEvent = e || event;
          let dpos = self.getPos(oEvent);
          self.currentPos.x = dpos.x - oldPos.x;
          self.currentPos.y = dpos.y - oldPos.y;
        };
        document.onmouseup = function (e) {
          rootNode.onmousemove = null;
          this.onmouseup = null;
        };
      },
      getTmInfo() {
        return {
          id: this.item.ccsWarehouseImageDevRelationId,
          x: this.currentPos.x / this.currentScale,
          y: this.currentPos.y / this.currentScale
        };
      }
    },
    mounted() {
      // 去除减的半径
      let x = parseInt(this.position.x, 10) * this.scale;
      let y = parseInt(this.position.y, 10) * this.scale;
      this.currentPos = {
        x,
        y
      };
    }
  };
</script>
<style>
  .tm-container {
    position: absolute;
    width: 70px;
    height: 20px;
    cursor: pointer;
  }

  .temp-title {
    position: absolute;
    padding: 2px 5px;
    border-radius: 4px;
    background: #333;
    color: #fff;
    min-width: 100px;
  }

  .temp-title--block {
    display: block;
  }

  .temp-title--none {
    display: block;
  }
</style>
