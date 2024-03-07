<template>
  <el-row class="app-container">
    <el-col :span="4">
      <el-tree ref="floorTree" :data="floors" lazy :load="loadChildren" :props="treeProps" node-key="id" :default-expanded-keys="expandedKeys"
        :expand-on-click-node="false" highlight-current @current-change="currentChange"/>
    </el-col>
    <el-col :span="20" style="border: 1px solid #e6ebf5; border-radius: 5px; overflow: hidden;">

      <!-- 按钮 -->
      <div class="indoor-button">
        <el-button type="primary"
          icon="el-icon-location-information"
          :disabled="!img"
          @click="markPoint">标点</el-button>
<!--        <oms-el-upload-->
<!--          accept="image/*"-->
<!--          :action="action"-->
<!--          :on-error="uploadError"-->
<!--          :on-success="uploadSuccess"-->
<!--          :show-file-list="false"-->
<!--          style="float: right;"-->
<!--        >-->
<!--          <el-button type="primary" class="el-upload"-->
<!--            slot="trigger"><i :style="iconStyle"/>上传地图</el-button>-->
<!--          <div slot="tip">地图上传将替换原有地图，原有标点将失效</div>-->
<!--        </oms-el-upload>-->
        <el-upload
          style="float: right;"
          action="#"
          ref="upload"
          accept="image/*"
          :show-file-list="false"
          :http-request="uploadSectionFile"
        >
          <el-button type="primary" class="el-upload"
                     slot="trigger"><i :style="iconStyle"/>上传地图</el-button>
          <div slot="tip">地图上传将替换原有地图，原有标点将失效</div>
        </el-upload>
      </div>

      <div style="height: calc(100% - 66px)">
        <IndoorMap ref="indoorMap" :img="img" :data="mapData" :nodeClick="nodeClick" :nodeMousemove="nodeMousemove" :nodeContextmenu="nodeContextmenu"
          :canvasClick="canvasClick" :canvasMousemove="canvasMousemove"/>
      </div>
    </el-col>

    <!-- 表单 -->
    <el-form :model="form" :class="editClass">
      <el-form-item :label="detail ? '详情' : '标点'">
        <el-button type="text" icon="el-icon-close" @click="closeFrom"></el-button>
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
      <el-form-item label="定位编码：" label-width="82px">
        <el-input v-model="form.pointCode" :readonly="form.id && detail" maxlength="20" placeholder="定位编码"/>
      </el-form-item>
      <el-form-item label="标注区域（点位）名称：">
        <el-input v-model="form.pointName" :readonly="form.id && detail" maxlength="20" placeholder="标注区域（点位）名称"/>
      </el-form-item>
      <el-form-item>
        <template v-if="form.id && detail">
          <el-button type="danger" @click="delPoint" style="float: left">删除</el-button>
          <el-button type="primary" @click="detail = false">编辑</el-button>
        </template>
        <template v-else>
          <el-button :type="relating ? 'info' : 'success'" @click="relateMark"
            style="float: left">{{ relating ? '结束标注' : '关联标注'}}</el-button>
          <el-button @click="closeFrom">取消</el-button>
          <el-button type="primary" @click="savePoint">保存</el-button>
        </template>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script>
  import { mapState } from 'vuex'
  import IndoorMap from '../indoormap/index';
  import mapIcon from '@/assets/img/map_icon.png';
  import {
    createFloorPlat,
    uploadFileFloor,
    findFloorPlat,
    queryFloorStructure,
    createFloorPlatPoint,
    modifyFloorPlatPoint,
    deleteFloorPlatPoint
  } from '@/api/hospital/equipment';
  import OmsElUpload from '@/components/common/upload/upload/src/index.vue';

  const loadTime = Date.now();
  const tempNode = 'Temp_node';

  const formModel = {
    id: null,
    platId: null,
    xPoint: 0,
    yPoint: 0,
    pointType: 0,
    pointCode: null,
    pointName: null,
    contactPoints: []
  };

  const nodes = [{
    model: {
      id: tempNode, // String，该节点存在则必须，节点的唯一标识
      visible: false,
      type: 'position',
      state: 'default',
    },
    record: { ...formModel }
  }];

  export default {
    name: 'FloorMap',
    components: { IndoorMap, OmsElUpload },
    data() {
      return {
        floors: [],
        treeProps: {
          label: 'floorName',
          isLeaf(data) {
            return data.type !== 1;
          }
        },
        img: null,
        mapId: null,
        mapData: {
          nodes: []
        },
        nodeId: null,
        form: { ...formModel },
        storey: {
          id: null,
          pid: null,
          name: null
        },
        detail: true,
        relating: false,
        iconStyle: {
          width: '16px',
          height: '16px',
          display: 'inline-block',
          verticalAlign: 'top',
          marginRight: '5px',
          background: `url(${mapIcon}) center/100% 100%`
        },
        showTemp: false,
        first: true,
        second: true,
        expandedKeys: [],
        action: `${process.env.VUE_APP_API}/omsAttachment`,
      };
    },
    computed: {
      ...mapState(['user']),
      headers() {
        return {
          token: this.user.token
        };
      },
      editClass() {
        if (this.form.xPoint && this.form.yPoint) {
          return 'indoor-formedit opened';
        } else {
          return 'indoor-formedit closed';
        }
      },
      mapRef() {
        return this.$refs.indoorMap;
      },
      mapWidth() {
        return this.mapRef.width;
      },
      mapHeight() {
        return this.mapRef.height;
      },
      relationPoints() {
        let strs = this.form.contactPoints?.map(id => `${id}`);
        return Array.isArray(strs) ? strs: [];
      }
    },
    watch: {
      relationPoints(nval, oval) {
        const narr = Array.isArray(nval);
        const oarr = Array.isArray(oval);
        if (narr) {
          if (oarr) {
            nval.filter(v => oval.indexOf(v) < 0).forEach(v => {
              this.mapRef.updateState(v, 'lightblue');
            });
          } else {
            nval.forEach(v => {
              this.mapRef.updateState(v, 'lightblue');
            });
          }
        }
        if (oarr) {
          if (narr) {
            oval.filter(v => nval.indexOf(v) < 0).forEach(v => {
              this.mapRef.updateState(v, 'blue');
            });
          } else {
            oval.forEach(v => {
              this.mapRef.updateState(v, 'blue');
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
      //上传地图
      uploadSectionFile(params){
        const isLt10M = params.file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
          this.$notify.error({
            duration: 2000,
            message: '上传附件大小不能超过 10MB!'
          });
          return false;
        }
        // 如果上传的是图片类型文件，则进行过滤
        if (params.file.type === 'image/jpg' || params.file.type === 'image/jpeg' || params.file.type === 'image/png') {

        } else {
          this.$notify.error({
            duration: 2000,
            message: '请上传文件格式为JPG/JPEG/PNG的图片!'
          });
          return false;
        }

        const file = params.file;
        const form = new FormData();
        form.append("file", file);
        uploadFileFloor(form).then(res=>{
          const dataSource = res.data;
          this.uploadSuccess(dataSource);
        }).catch(err => {

        })
      },
      findClass(elm, cls) {
        if (elm.nodeName.toLowerCase() === 'body') {
          return false;
        }
        return elm.classList.contains(cls)
          || this.findClass(elm.parentElement, cls);
      },
      loadChildren(node, resolve) {
        queryFloorStructure({
          type: node.level > 0 ? 2 : 1,
          upFloor: node.data?.id
        }).then(res => {
          if (this.first) {
            this.first = false;
            this.expandedKeys.push(res.data[0]?.id);
          } else {
            if (this.second) {
              this.second = false;
              this.$nextTick(() => {
                this.loadFirstStorey(res.data[0]);
              })
            }
          }
          resolve(res.data);
        }).catch(err => {
          resolve([]);
          console.error(err);
        })
      },
      loadFirstStorey(data) {
        let id = data?.id;
        let tree = this.$refs.floorTree;
        if (!id) {
          return;
        }
        let node = tree.getNode(id);
        this.currentChange(data, node);
        tree.setCurrentKey(id);
      },
      currentChange(item, node) {
        const data = node.data;
        const parent = node.parent.data;
        if (item.type !== 1) {
          findFloorPlat(data.id).then(res => {
            if (res.code !== 200) {
              return this.$message.error(res.msg || '服务端异常');
            }
            this.img = res.data?.mapUrl;
            this.mapData.nodes = [ ...nodes ];
            if (!res.data) {
              return;
            }
            this.mapId = res.data.id;
            res.data.floorPlatPoint?.forEach(item => {
              this.mapData.nodes.push({
                model: {
                  id: `${item.id}`,
                  type: 'position',
                  state: 'blue',
                },
                record: { ...item }
              });
            });
          });
          this.storey = {
            id: data?.id,
            pid: parent?.id,
            name: `${parent?.floorName}-${data?.floorName}`
          }
        } else {
          this.img = null;
          this.mapData.nodes = [];
          this.storey = {
            id: null,
            pid: null,
            name: null
          };
        }
        this.closeFrom();
      },
      nodeClick(evt, center) {
        const node = evt.item;
        const model = node.getModel();
        if (this.relating) {
          this.relateNode(node, model);
        } else {
          this.modifyNode(node, model, center);
        }
      },
      nodeMousemove(evt) {
        if (this.showTemp) {
          this.mapRef.updatePosition(tempNode, {
            x: evt.x,
            y: evt.y
          });
        }
      },
      nodeContextmenu(evt, center) {
        const item = evt.item;
        const nodeId = item.get('id');
        let temp = this.mapData.nodes[0];
        if (nodeId === tempNode) {
          return (temp.model.visible = this.showTemp = false);
        }
        const states = item.getStates();
        if (states.length === 0 && nodeId.startsWith(tempNode)) {
          if (this.form.id === null) {
            this.form = { ...formModel };
          }
          temp.record.xPoint = (0.5 - (center.x - evt.x) / this.mapWidth).toFixed(4);
          temp.record.yPoint = (0.5 - (center.y - evt.y) / this.mapHeight).toFixed(4);
          this.mapData.nodes = this.mapData.nodes.filter(item => item.model.id !== nodeId);
        }
      },
      relateNode(node, model) {
        let nodeId = node.get('id');
        if (nodeId?.startsWith(tempNode)
          || this.nodeId === nodeId) {
          return;
        }
        this.form.contactPoints.push(model.record.id);
      },
      modifyNode(node, model, center) {
        this.nodeId = node.get('id');
        if (this.nodeId === tempNode) {
          let xPoint = (0.5 - (center.x - model.x) / this.mapWidth).toFixed(4);
          let yPoint = (0.5 - (center.y - model.y) / this.mapHeight).toFixed(4);
          this.mapData.nodes.push({
            model: {
              id: `${tempNode}${loadTime - Date.now()}`,
              type: 'position',
            },
            record: Object.assign({ ...model.record }, {
              platId: this.mapId, xPoint, yPoint})
          });
          let temp = this.mapData.nodes[0];
          temp.record.xPoint = xPoint;
          temp.record.yPoint = yPoint;
          temp.model.visible = true;
        } else {
          this.form = { ...model.record };
          this.form.contactPoints = [ ...model.record.contactPoints ];
        }
        node.toFront();
      },
      canvasClick(evt) {
        this.closeFrom();
      },
      canvasMousemove(evt) {
        if (this.showTemp) {
          this.mapRef.updatePosition(tempNode, {
            x: evt.x,
            y: evt.y
          });
        }
      },
      closeFrom() {
        this.form = { ...formModel };
        this.detail = true;
        this.relating = false;
      },
      markPoint() {
        let temp = this.mapData.nodes[0];
        temp.record.xPoint = 0;
        temp.record.yPoint = 0;
        return (temp.model.visible = this.showTemp = !this.showTemp);
      },
      uploadError(err) {
        console.error(err);
        return this.$message.error('地图上传失败,请联系管理员');
      },
      uploadSuccess(res) {
        if (res.state !== 'SUCCESS') {
          return this.$message.error(res.message || '地图上传失败');
        }
        createFloorPlat({
          mapUrl: res.attachmentId,
          storeyId: this.storey.id,
          floorId: this.storey.pid
        }).then(r => {
          if (r.code !== 200) {
            return this.$message.error(r.msg || '地图创建失败');
          }
          this.img = res.url;
          this.mapId = r.data?.id;
          this.mapData.nodes = [ ...nodes ];
        });
      },
      relateMark() {
        this.relating = !this.relating;
      },
      async savePoint() {
        let id, res;
        try {
          if (this.form.id) {
            res = await modifyFloorPlatPoint(this.form);
          } else {
            res = await createFloorPlatPoint(this.form);
          }
          if (res.code !== 200) {
            return this.$message.error(res.msg || '标点保存失败');
          }
          if (res.data) {
            id = res.data.id;
            this.mapData.nodes = this.mapData.nodes
              .filter(item => item.model.id !== this.nodeId);
            this.mapData.nodes.push({
              model: {
                id: (this.nodeId = `${res.data.id}`),
                type: 'position',
                state: 'blue',
              },
              record: Object.assign(this.form, res.data)
            });
          } else {
            id = this.form.id;
          }
          let curr = this.mapData.nodes.find(item => item.model.id === `${id}`);
          curr.record = { ...this.form };
          curr.record.contactPoints = [ ...this.form.contactPoints ];
          this.form.contactPoints?.forEach(pointId => {
            curr = this.mapData.nodes.find(item => item.model.id === `${pointId}`);
            let contact = curr.record?.contactPoints;
            if (contact) {
              contact.push(id);
            } else {
              curr.record.contactPoints = [id];
            }
          });
          this.closeFrom();
          this.$message.success('标点保存成功');
        } catch (err) {
          console.error(err);
          this.$message.error(err?.response?.data?.msg || '标点保存失败');
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
            this.closeFrom();
            this.mapData.nodes = this.mapData.nodes
              .filter(item => item.model.id !== this.nodeId);
            this.$message.success('标点删除成功');
          }).catch(err => {
            console.error(err);
            this.$message.error(err?.response.data.msg || '标点删除失败');
          });
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .app-container {
    height: calc(100vh - 70px);
    background-color: #ffffff;
    padding: 10px !important;

    .el-col {
      height: 100%;

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
  }
</style>
