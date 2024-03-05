import { G6, Grid } from './g6custom';

let graph;

const emptyData = {
  nodes: [],
  edges: []
};
const CENTER = 'Center_Node';

export default {
  props: {
    img: String,
    data: {
      type: Object,
      default: function() {
        return emptyData;
      }
    },
    focus: String,
    nodeMove: Function,
    nodeClick: Function,
    nodeMousemove: Function,
    nodeMouseenter: Function,
    nodeMouseleave: Function,
    nodeContextmenu: Function,
    canvasClick: Function,
    canvasMousemove: Function,
  },
  data() {
    return {
      width: 0,
      height: 0,
      ratio: 0.01,
      dragzoom: {
        ratio: 0.01,
        top: 0,
        left: 0,
        minZoom: 0.5,
        maxZoom: 2,
        currZoom: 1,
        fixedSize: true
      },
      showEmpty: true,
      floorClass: 'floor-empty'
    };
  },
  computed: {
    map() {
      return {
        img: this.img,
        width: this.width,
        height: this.height
      };
    },
    coordWidth() {
      return this.width / this.dragzoom.currZoom;
    },
    coordHeight() {
      return this.height / this.dragzoom.currZoom;
    },
    center() {
      return {
        id: CENTER,
        x: this.coordWidth / 2,
        y: this.coordHeight / 2,
        $x: 0,
        $y: 0,
        visible: false
      };
    },
  },
  watch: {
    img(img) {
      graph?.destroy();
      if (img) {
        this.createG6();
        this.showEmpty = false;
      } else {
        graph = null;
        this.showEmpty = true;
      }
    },
    data: {
      deep: true,
      handler(data) {
        this.renderData(this.buildData(data));
      }
    },
    focus(ni, oi) {
      if (!ni) {
        return graph.focusItem(CENTER, true);
      }
      graph.focusItem(ni, true);
      graph.setItemState(ni, 'focus', true);
      graph.setItemState(oi, 'focus', false);
    }
  },
  created() {
    console.log('created', this);
  },
  mounted() {
    console.log('mounted');
    this.width = this.$el.offsetWidth;
    this.height = this.$el.offsetHeight;
  },
  methods: {
    deepClone(object) {
      if (!object) {
        return object;
      } else if (Array.isArray(object)) {
        return object.map(
          item => this.deepClone(item)
        );
      } else if (typeof object !== 'object') {
        return object;
      }
      let clone = {};
      Object.keys(object).forEach(key => {
        clone[key] = this.deepClone(object[key]);
      })
      return clone;
    },
    createG6() {
      graph = new G6.Graph({
        container: this.$el,
        width: this.width,
        height: this.height,
        plugins: [ Grid.create(this.map) ],
        linkCenter: true,
        modes: {
          default: [{
            type: 'drag-zoom',
            width: this.width,
            height: this.height,
            ...this.dragzoom
          }],
        },
        defaultEdge: {
          style: {
            endArrow: {
              lineWidth: 5,
              path: G6.Arrow.triangle(10, 15, 8)
            }
          }
        }
      });
      this.bindEvent();
      this.renderData(this.buildData(this.data));
    },
    bindEvent() {
      typeof this.nodeClick === 'function' && graph.on('node:click', this.nodeClick);
      typeof this.nodeMousemove === 'function' && graph.on('node:mousemove', this.nodeMousemove);
      typeof this.nodeMouseenter === 'function' && graph.on('node:mouseenter', this.nodeMouseenter);
      typeof this.nodeMouseleave === 'function' && graph.on('node:mouseleave', this.nodeMouseleave);
      typeof this.nodeContextmenu === 'function' && graph.on('node:contextmenu', this.nodeContextmenu);
      typeof this.canvasClick === 'function' && graph.on('canvas:click', this.canvasClick);
      typeof this.canvasMousemove === 'function' && graph.on('canvas:mousemove', this.canvasMousemove);

      graph.on('zoomHandler', this.zoomHandler);
      graph.on('translateHandler', this.translateHandler);
    },
    buildData(data) {
      let nodes = [{
        ...this.center
      }], edges = [];
      let cx = this.width / 2;
      let cy = this.height / 2;
      if (Array.isArray(data?.nodes)) {
        data.nodes.forEach(node => {
          let clone = this.deepClone(node.model);
          let record = this.deepClone(node.record);
          if (record) {
            clone.record = record;
            clone.x = this.width * record.xPoint;
            clone.y = this.height * record.yPoint;
            clone.$x = clone.x - cx;
            clone.$y = clone.y - cy;
            clone.$model = node.model;
            nodes.push(clone);
          }
        });
      }
      if (Array.isArray(data?.edges)) {
        data.edges.forEach(edge => {
          let clone = this.deepClone(edge.model);
          clone.record = this.deepClone(edge.record);
          edges.push(clone);
        });
      }
      return { nodes, edges }
    },
    renderData(data) {
      console.log(data);
      graph?.clear();
      graph?.data(data);
      graph?.render();
      // graph.zoom(this.dragzoom.currZoom);
      // graph.translate(this.dragzoom.left, this.dragzoom.top);
    },
    zoomHandler(zoom) {
      this.dragzoom.currZoom = zoom;
    },
    translateHandler(move) {
      this.dragzoom.top = move.top;
      this.dragzoom.left = move.left;
    },
    indoorToolbar(event) {
      const className = event.target?.className;
      if (className === 'el-icon-zoom-in') {
        if (this.dragzoom.currZoom > this.dragzoom.maxZoom) {
          return;
        }
        graph.zoom(1 + this.dragzoom.ratio);
      } else if (className === 'el-icon-zoom-out') {
        if (this.dragzoom.currZoom < this.mapzoomdragzoom) {
          return;
        }
        graph.zoom(1 - this.dragzoom.ratio);
      } else {
        graph.zoom(1 / this.dragzoom.currZoom);
        graph.focusItem(CENTER, true);
      }
    },



    changeVisibility(nodeId, visible) {
      if (visible) {
        graph.showItem(nodeId);
      } else {
        graph.hideItem(nodeId);
      }
    },
    addNode(node) {
      let cx = this.width / 2;
      let cy = this.height / 2;
      graph.addItem('node', Object.assign({
        ox: node.x - cx,
        oy: node.y - cy
      }, node));
    },
    updateModel(itemId, model) {
      graph.update(itemId, model);
    },
    updateState(itemId, state) {
      try {
        graph.setItemState(itemId, state, true);
      } catch (err) {
        console.error(itemId, err);
      }
    },
    updatePosition(itemId, coordinate) {
      let item = graph.findById(itemId);
      item.updatePosition(coordinate);
    },
    removeItem(itemId) {
      graph.removeItem(itemId);
    },
    highlightTrajectory(trajectories) {
      graph.getNodes().forEach(node => {
        let model = node.getModel();
        let cfg = { ...model };
        let nodeId = node.get('id');
        let curr = trajectories.find(item => `${item.currentId}` === nodeId);
        if (curr) {
          if (curr.index) {
            cfg.label = '';
            cfg.size = 25 / this.dragzoom.currZoom;
          } else {
            cfg.size = 3 / this.dragzoom.currZoom;
            cfg.label = curr.index;
          }
          cfg.label = `${curr.index || ''}`;
          cfg.style.fill = '#01a7f0';
          cfg.style.stroke = '#01a7f0';
        } else {
          cfg.label = '';
          cfg.size = cfg.labelCfg ? 25 / this.dragzoom.currZoom : 3 / this.dragzoom.currZoom;
          cfg.style.fill = '#aadef8';
          cfg.style.stroke = '#aadef8';
        }
        node.update(cfg);
      });

      let len = trajectories.length;
      let edges = {}, trajectoryId;
      let last = trajectories[len - 1];
      for (let i = 1; i < len; i++) {
        let key = `${trajectories[i].previouId}-${trajectories[i].currentId}`;
        edges[key] = trajectories[i].id;
      }

      graph.getEdges().forEach(edge => {
        let model = edge.getModel();
        let cfg = { ...model };
        trajectoryId = edges[`${model.source}-${model.target}`];
        if (model.record?.some(id => id === trajectoryId)) {
          edge.toFront();
          cfg.style.stroke = '#01a7f0';
          if (`${last.currentId}` === model.target) {
            cfg.style.endArrow = {
              lineWidth: 5 / this.dragzoom.currZoom,
              path: G6.Arrow.triangle(10 / this.dragzoom.currZoom, 15 / this.dragzoom.currZoom, 8 / this.dragzoom.currZoom)
            }
          } else {
            cfg.style.endArrow = false;
          }
        } else {
          cfg.style.stroke = '#aadef8'
        }
        edge.update(cfg);
      });
    }
  }
}
