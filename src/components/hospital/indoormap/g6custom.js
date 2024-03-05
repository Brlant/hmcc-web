import G6 from '@antv/g6';
import { createDom } from "@antv/dom-util";

const fontSize = 30;

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
}

Grid.create = map => {
  return new Grid({ map });
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

G6.registerBehavior('drag-zoom', {
  getDefaultCfg() {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      drag: false,
      ratio: 0.01,
      minZoom: 0.5,
      maxZoom: 2,
      currZoom: 1,
      top: 0,
      left: 0,
      fixedSize: false,
      afterrender: false
    };
  },
  getEvents() {
    return {
      wheel: 'wheelHandler',
      afterrender: 'afterrenderHandler',
      viewportchange: 'viewportchangeHandler',
      mouseup: 'mouseupHandler',
      mousedown: 'mousedownHandler',
      mousemove: 'mousemoveHandler',
      mouseenter: 'mouseenterHandler'
    };
  },
  mouseupHandler(evt) {
    this.x = evt.x;
    this.y = evt.y;
    this.drag = false;
  },
  mousedownHandler(evt) {
    if (evt.originalEvent.button !== 0) {
      return;
    }
    this.x = evt.x;
    this.y = evt.y;
    this.drag = true;
  },
  mousemoveHandler(evt) {
    if (!this.drag) {
      return;
    }
    let mx = evt.x - this.x;
    let my = evt.y - this.y;
    this.graph.translate(mx, my);
  },
  mouseenterHandler() {
    this.drag = false;
  },
  wheelHandler(evt) {
    let ratio = 1;
    switch (evt.deltaY) {
      case -100:
        ratio += this.ratio;
        if (this.currZoom * ratio  > this.maxZoom) {
          return;
        }
        break;
      case 100:
        ratio -= this.ratio;
        if (this.currZoom * ratio < this.minZoom) {
          return;
        }
    }
    this.graph.zoom(ratio);
  },
  afterrenderHandler() {
    this.afterrender = true;
    let zoom = this.graph.getZoom();
    if (this.currZoom !== zoom) {
      this.graph.zoom(this.currZoom);
    }
    if (this.top !== 0 || this.left !== 0) {
      this.graph.translate(this.left, this.top);
    }
    this.afterrender = false;
  },
  viewportchangeHandler(evt) {
    if (!this.afterrender) {
      let matrix = evt.matrix;
      this.top = matrix[7];
      this.left = matrix[6];
      this.currZoom = matrix[0] || matrix[4];
    }
    switch (evt.action) {
      case 'zoom':
        return this.zoomHandler();
      case 'translate':
        return this.translateHandler();
    }
  },
  zoomHandler() {
    let cx = this.width / this.currZoom / 2;
    let cy = this.height / this.currZoom / 2;
    this.graph.getNodes().forEach(node => {
      let model = node.getModel();
      if (this.fixedSize) {
        let cfg = { ...model };
        cfg.x = model.$x + cx;
        cfg.y = model.$y + cy;
        if (model.type === 'circle') {
          if (model.labelCfg) {
            cfg.size = 25 / this.currZoom;
            cfg.labelCfg.style.fontSize = 15 / this.currZoom
          } else {
            cfg.size = 3 / this.currZoom;
          }
        } else {
          cfg.style.fontSize = fontSize / this.currZoom
        }
        return node.update(cfg);
      }
      node.updatePosition({
        x: model.$x + cx,
        y: model.$y + cy
      });
    });
    this.graph.getEdges().forEach(edge => {
      if (this.fixedSize) {
        const model = edge.getModel();
        let cfg = { ...model };
        cfg.style.lineWidth = 4 / this.currZoom;
        if (model.style.endArrow) {
          cfg.style.endArrow = {
            lineWidth: 5 / this.currZoom,
            path: G6.Arrow.triangle(10 / this.currZoom, 15 / this.currZoom, 8 / this.currZoom)
          }
        }
        return edge.update(cfg);
      }
      edge.refresh();
    });
    this.graph.emit('zoomHandler', this.currZoom);
  },
  translateHandler() {
    this.graph.emit('translateHandler', {
      top: this.top,
      left : this.left
    });
  }
});

export { G6, Grid };
