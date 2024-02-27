import G6 from '@antv/g6';
import { createDom } from "@antv/dom-util";

const fontSize = 30;
const tempNode = 'temp_node';

class Grid extends G6.Grid {
  constructor(cfg) {
    super(cfg);
  }

  init() {
    let graph = this.get('graph');
    let graphContainer = graph.get('container');
    let canvas = graph.get('canvas').get('el');
    let map = this.get('map');
    let width = map.width ? `${map.width}px` : '100%';
    let height = map.height ? `${map.height}px` : '100%';
    let bkimg = `url('${map.img}')`;
    let style = `width:${width};height:${height};position:absolute;overflow:hidden;z-index:-1;`;
    let container = createDom(`<div class="g6-grid-container" style="${style}"></div>`);
    let gridContainer = createDom(`<div class="g6-grid" style="background-image:${bkimg};user-select:none;"></div>`);
    this.set('container', container);
    this.set('gridContainer', gridContainer);
    container.appendChild(gridContainer);
    graphContainer.insertBefore(container, canvas);
  }

  updateGrid(param) {
    super.updateGrid(param);
  }
}

G6.registerNode('position', {
  options: {
    style: {
      x: 0,
      y: 0,
      text: '\ue707',
      fontSize: fontSize,
      textAlign: 'center',
      fontFamily: 'element-icons',
      textBaseline: 'middle',
    },
    stateStyles: {
      blue: {
        fill: '#3765ff'
      },
      green: {
        fill: '#95f202'
      },
      default: {
        fill: '#7f7f7f'
      },
      lightgray: {
        fill: '#aaaaaa'
      },
      red: {
        fill: '#d8001b'
      },
      lightblue: {
        fill: '#add8e6'
      },
      orange: {
        fill: '#f59b22'
      },
      black: {
        fill: '#000000'
      }
    }
  },
  draw(cfg, group) {
    let fill = this.options.stateStyles[cfg.state]
      || this.options.stateStyles.default;
    // console.log(cfg, fill)
    return group.addShape('text', {
      attrs: {
        ...this.options.style,
        ...fill
      },
      name: 'text-shape'
    });
  },
  update(cfg, node) {
    const group = node.getContainer();
    const shape = group.get('children')[0];
    shape.attr(cfg.style);
  },
  setState(name, value, item) {
    item.clearStates(item.getStates());
    const group = item.getContainer();
    const shape = group.get('children')[0];
    if (value) {
      shape.attr(this.options.stateStyles[name]);
    } else {
      shape.attr(this.options.stateStyles.default);
    }
  }
});

G6.registerNode('solidpoint', {
  options: {
    style: {
      x: 0,
      y: 0,
      text: '●',
      fontSize: fontSize,
      textAlign: 'center',
      textBaseline: 'middle',
    },
    stateStyles: {
      blue: {
        fill: '#3765ff'
      },
      green: {
        fill: '#95f202'
      },
      default: {
        fill: '#7f7f7f'
      },
      lightgray: {
        fill: '#aaaaaa'
      },
      red: {
        fill: '#d8001b'
      },
      lightblue: {
        fill: '#aadef8'
      }
    }
  },
  draw(cfg, group) {
    let fill = this.options.stateStyles[cfg.state]
      || this.options.stateStyles.default;
    let style = Object.assign({}, this.options.style, cfg.style);
    return group.addShape('text', {
      attrs: {
        ...style,
        ...fill
      },
      name: 'text-shape'
    });
  },
  update(cfg, node) {
    const group = node.getContainer();
    const shape = group.get('children')[0];
    shape.attr(cfg.style);
  },
  setState(name, value, item) {
    item.clearStates(item.getStates());
    const group = item.getContainer();
    const shape = group.get('children')[0];
    if (value) {
      shape.attr(this.options.stateStyles[name]);
    } else {
      shape.attr(this.options.stateStyles.default);
    }
  },
  getAnchorPoints() {
    return [
      [0.5, 0.5]
    ];
  },
});

export default ({
  elm, map, width, height, canvasClick, canvasMousemove, nodeClick, nodeMove, nodeContextmenu, nodeMouseenter, nodeMousemove, nodeMouseleave
}) => {

  let fi = null;
  let iw = map.width || width;
  let ih = map.height || height;
  let maporigin = { x: iw / 2, y: ih / 2 }

  let modes = ['drag-canvas', {
    type: 'zoom-canvas',
    maxZoom: 2,
    minZoom: 0.5,
    sensitivity: 1
  }];
  if (nodeMove) {
    modes.push('drag-node');
  }

  const grid = new Grid({ map });
  const graph = new G6.Graph({
    container: elm,
    width: width,
    height: height,
    plugins: [ grid ],
    linkCenter: true,
    modes: {
      default: modes,
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

  typeof nodeContextmenu === 'function' && graph.on('node:contextmenu', nodeContextmenu);

  typeof canvasMousemove === 'function' && graph.on('canvas:mousemove', canvasMousemove);

  typeof nodeMove === 'function' && graph.on('node:drag', evt => {
    const item = evt.item;
    const model = item.getModel();
    item.update({
      ox: model.x - maporigin.x,
      oy: model.y - maporigin.y
    });
    nodeMove(item);
  });

  typeof nodeClick === 'function' && graph.on('node:click', nodeClick);

  typeof canvasClick === 'function' && graph.on('canvas:click', canvasClick);

  typeof nodeMouseenter === 'function' && graph.on('node:mouseenter', nodeMouseenter);

  typeof nodeMousemove === 'function' && graph.on('node:mousemove', nodeMousemove);

  typeof nodeMouseleave === 'function' && graph.on('node:mouseleave', nodeMouseleave);

  graph.on('wheelzoom', () => {
    const zoom = graph.getZoom();
    updateNodePosition(zoom);
  });

  const updateNodePosition = toRatio => {
    maporigin.x = iw / toRatio / 2;
    maporigin.y = ih / toRatio / 2;
    graph.getNodes().forEach(node => {
      const model = node.getModel();
      let cfg = { ...model };
      cfg.x = model.ox + maporigin.x;
      cfg.y = model.oy + maporigin.y;
      if (model.type === 'circle') {
        if (model.labelCfg) {
          cfg.size = 25 / toRatio;
          cfg.labelCfg.style.fontSize = 15 / toRatio
        } else {
          cfg.size = 3 / toRatio;
        }
      } else {
        cfg.style.fontSize = fontSize / toRatio
      }
      node.update(cfg);
    });
    graph.getEdges().forEach(edge => {
      const model = edge.getModel();
      let cfg = { ...model };
      cfg.style.lineWidth = 4 / toRatio;
      if (model.style.endArrow) {
        cfg.style.endArrow = {
          lineWidth: 5 / toRatio,
          path: G6.Arrow.triangle(10 / toRatio, 15 / toRatio, 8 / toRatio)
        }
      }
      edge.update(cfg);
    });
  };

  return {
    destroy() {
      graph.destroy();
    },
    render(data) {
      graph.data(data);
      graph.render();
    },
    addNode(node) {
      graph.addItem('node', Object.assign({
        ox: node.x - maporigin.x,
        oy: node.y - maporigin.y
      }, node));
    },
    changeVisibility(nodeId, visible) {
      let item  = graph.findById(nodeId);
      item?.changeVisibility(visible);
      item?.toFront();
    },
    update(itemId, model) {
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
      graph.removeItem(itemId)
    },
    zoomTo(toRatio) {
      graph.zoomTo(toRatio);
      updateNodePosition(toRatio);
      if (toRatio === 1) {
        graph.focusItem('Center_Node');
      }
    },
    focusItem(item) {
      if (!item) {
        return graph.fitCenter();
      }
      graph.focusItem(item);
      graph.setItemState(item,'focus', true);
      if (fi) {
        graph.setItemState(fi, 'focus', false);
      }
      fi = item;
    },
    highlightTrajectory(nodes) {
      graph.getNodes().forEach(node => {
        let model = node.getModel();
        let cfg = { ...model };
        let nodeId = node.get('id');
        let curr = nodes.find(item => item.id === nodeId);
        if (curr) {
          if (curr.index > 0) {
            cfg.label = `${curr.index}`;
          }
          cfg.style.fill = '#01a7f0';
          cfg.style.stroke = '#01a7f0';
        } else {
          cfg.label = '';
          cfg.style.fill = '#aadef8';
          cfg.style.stroke = '#aadef8';
        }
        node.update(cfg);
      });
      let prev = null;
      let edges = new Set();
      nodes.forEach(item => {
        if (prev) {
          edges.add(`${prev.id}-${item.id}`);
        }
        prev = item;
      });
      graph.getEdges().forEach(edge => {
        let model = edge.getModel();
        let cfg = { ...model };
        if (edges.has(`${model.source}-${model.target}`)) {
          edge.toFront();
          cfg.style.stroke = '#01a7f0';
        } else {
          cfg.style.stroke = '#aadef8'
        }
        edge.update(cfg);
      });
    }
  };
};
