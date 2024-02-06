<template>
  <el-row class="app-container">
    <el-col :span="4">
      <el-tree ref="floorTree" :data="floors" lazy :load="loadChildren" :props="treeProps" node-key="id" :default-expanded-keys="expandedKeys"
        :expand-on-click-node="false" highlight-current @current-change="currentChange"/>
    </el-col>
    <el-col :span="20">
      <IndoorMap :map="map" :storey="storey" :action="action" :headers="headers"
        editable @upload-success="uploadSuccess" @upload-error="uploadError"/>
    </el-col>
  </el-row>
</template>

<script>
  import { mapState } from 'vuex'
  import IndoorMap from '../indoormap/index';
  import { createFloorPlat, findFloorPlat, queryFloorStructure } from '@/api/hospital/equipment';

  export default {
    name: 'FloorMap',
    components: { IndoorMap },
    data() {
      return {
        floors: [],
        treeProps: {
          label: 'floorName',
          isLeaf(data) {
            return data.type !== 1;
          }
        },
        map: {
          id: null,
          url: null,
          points: null
        },
        storey: {
          id: null,
          parentId: null,
          name: null
        },
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
      }
    },
    created() {
    },
    methods: {
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
            this.map = {
              id: res.data?.id,
              url: res.data?.mapUrl,
              points: res.data?.floorPlatPoint?.map(it => ({
                id: `${it.id}`,
                x: it.xPoint,
                y: it.yPoint,
                type: 'position',
                state: 'blue',
                form: {
                  id: it.id,
                  platId: it.platId,
                  pointType: it.pointType,
                  pointName: it.pointName,
                  contactPoints: it.contactPoints
                }
              }))
            }
          });

          this.storey = {
            id: data?.id,
            parentId: parent?.id,
            name: `${parent?.floorName}${data?.floorName}`
          }
        } else {
          this.map = {
            id: null,
            url: null,
            points: null
          };
          this.storey = {
            id: null,
            parentId: null,
            name: null
          };
        }
      },
      uploadSuccess(res) {
        if (res.state !== 'SUCCESS') {
          return this.$message.error(res.message || '地图上传失败');
        }
        createFloorPlat({
          mapUrl: res.attachmentId,
          storeyId: this.storey.id,
          floorId: this.storey.parentId
        }).then(r => {
          if (r.code !== 200) {
            return this.$message.error(r.msg || '地图创建失败');
          }
          this.map.url = res.url;
          this.map.points = [];
        });
      },
      uploadError(err) {
        console.error(err);
        return this.$message.error('地图上传失败,请联系管理员');
      },
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
    }
  }
</style>
