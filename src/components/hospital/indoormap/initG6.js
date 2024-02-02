import G6 from '@antv/g6';

const tempNode = 'temp_node';

const loadTime = Date.now();

G6.registerNode('position', {
  options: {
    style: {
      x: 0,
      y: 0,
      text: '\ue707',
      fontSize: 36,
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
      }
    }
  },
  draw(cfg, group) {
    let fill = this.options.stateStyles[cfg.state]
      || this.options.stateStyles.default;
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
      fontSize: 36,
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
        fill: '#add8e6'
      }
    }
  },
  draw(cfg, group) {
    let fill = this.options.stateStyles[cfg.state]
      || this.options.stateStyles.default;
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
  },
  getAnchorPoints() {
    return [
      [0.5, 0.5]
    ];
  },
});

export default ({
  elm, width, height, map, data, canvasClick, nodeClick, nodeMove, nodeMouseenter, nodeMouseleave
}) => {

  let maporigin = { x: width / 2, y: height / 2 }
  let showTemp = false;
  let nodeTemp = null;

  let modes = ['drag-canvas', 'zoom-canvas'];
  if (nodeMove) {
    modes.push('drag-node');
  }

  const grid = new G6.Grid({ img: map });
  const graph = new G6.Graph({
    container: elm,
    width: width,
    height: height,
    plugins: [ grid ],
    modes: {
      default: modes,
    },
  });
  graph.on('node:click', evt => {
    const item = evt.item;
    if (item.get('id') === tempNode) {
      graph.addItem('node', {
        id: `temp${loadTime - Date.now()}`,
        x: evt.x,
        y: evt.y,
        ox: evt.x - maporigin.x,
        oy: evt.y - maporigin.y,
        type: 'position',
        form: { ...item.get('model').form }
      });
      console.log(evt);
      nodeTemp?.toFront();
    } else {
      typeof nodeClick === 'function' && nodeClick(evt.item);
    }
  });

  graph.on('node:contextmenu', evt => {
    const item = evt.item;
    const nodeId = item.get('id');
    if (nodeId === tempNode) {
      return item.changeVisibility((showTemp = false));
    }
    const states = item.getStates();
    if (states.length === 0 && nodeId.startsWith('temp')) {
      graph.removeItem(item);
    }
  });

  graph.on('canvas:mousemove', evt => {
    if (!showTemp) {
      return;
    }
    nodeTemp?.updatePosition({
      x: evt.x,
      y: evt.y
    });
  });

  typeof canvasClick === 'function' && graph.on('canvas:click', canvasClick);

  graph.on('node:mousemove', evt => {
    if (!showTemp) {
      return;
    }
    nodeTemp?.updatePosition({
      x: evt.x,
      y: evt.y
    });
  });

  typeof nodeMove === 'function' && graph.on('node:drag', evt => {
    const item = evt.item;
    const model = item.getModel();
    item.update({
      ox: model.x - maporigin.x,
      oy: model.y - maporigin.y
    });
    nodeMove(item);
  });

  typeof nodeMouseenter === 'function' && graph.on('node:mouseenter', evt => {
    nodeMouseenter(evt.item);
  });

  typeof nodeMouseleave === 'function' && graph.on('node:mouseleave', evt => {
    nodeMouseleave(evt.item);
  });

  graph.data(data);
  graph.render();

  return {
    changeVisibility() {
      nodeTemp = graph.findById(tempNode);
      nodeTemp?.updatePosition({
        x: Number.MAX_VALUE,
        y: Number.MAX_VALUE
      });
      nodeTemp?.toFront();
      nodeTemp?.changeVisibility((showTemp = !showTemp));
    },
    destroy() {
      graph.destroy();
    },
    update(item, model) {
      graph.update(item, model);
    },
    updateState(item, state) {
      try {
        graph.setItemState(item, state, true);
      } catch (err) {
        console.error(item, err);
      }
    },
    removeItem(item) {
      graph.removeItem(item)
    },
    zoomTo(toRatio) {
      maporigin.x = width / toRatio / 2;
      maporigin.y = height / toRatio / 2;
      graph.zoomTo(toRatio);
      graph.getNodes().forEach(node => {
        const model = node.getModel();
        node.update({
          x: model.ox + maporigin.x,
          y: model.oy + maporigin.y,
          style: {
            fontSize: 36 / toRatio
          }
        });
      });
      graph.getEdges().forEach(edge => {
        edge.refresh();
      });
    },
    getZoom() {
      return graph.getZoom();
    }
  };
};
