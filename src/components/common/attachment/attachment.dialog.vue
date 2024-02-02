<style lang="scss">
.attachment-dialog {
  user-select: none;

  .el-dialog {
    width: 100%;
    transform: none;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    box-shadow: none;
    margin-bottom: 0;
  }

  .el-dialog__header {
    padding: 10px 20px;
    position: relative;
    z-index: 200;
    background: #fff;

    .el-dialog__headerbtn {
      display: block;
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);

    }
  }

  .el-dialog__body {
    position: absolute;
    top: 37px;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0;

    .dialog-image-rap {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      overflow: hidden;
      text-align: center;

      > div {
        position: absolute;
        left: 0;
        top: 0;
        min-width: 100%;
        min-height: 100%;
        text-align: center;
        display: flex;
        align-items: center;
      }

      img {
        max-width: 95vw;
        max-height: 95vh;
        margin: 0 auto;
        cursor: pointer;
      }
    }

    .img-tools {
      position: absolute;
      bottom: 35px;
      right: 35px;
    }

    .img-button {
      position: absolute;
      width: 300px;
      height: 150px;
      bottom: 0;
      left: 50%;
      margin-left: -100px;
    }

    .attachment-doc-body {
      height: 100%;
    }
  }

  .attachment-dialog-head {
    display: flex;
    justify-content: space-between;
    margin-right: 25px;

    a {
      font-size: 16px;
      display: inline-block;
      margin-left: 8px;
      cursor: pointer;
      color: #999;

      &:hover {
        color: #333
      }

      user-select: none;
    }
  }
}

</style>
<template>
  <el-dialog :before-close="close" :class="{'docview':type=='doc','img-view':type=='image'}" :fullscreen="true"
             :visible.sync="dialogVisible"
             class="attachment-dialog" ondragstart="return false" top="0">
    <div slot="title" class="attachment-dialog-head">
      <div>{{ Attachment.attachmentFileName }}</div>
      <a class="download-link" @click.stop="$downloadFile(Attachment)">
        <i class="el-icon-t-download"></i> 下载
      </a>
    </div>
    <transition name="el-fade-in">
      <div style="height:100%;width:100%;" @click.stop="closeDialog">
        <div v-if="type=='image'" class="dialog-image-rap">
          <div id="dialog-image-rap" :style="style">
            <compressed-img id="dialog-image" :src="fileUrl" @click.native.stop=""/>
          </div>
        </div>
        <div v-if="groupLen>1" class="img-button">
          <!--<el-tooltip content="前一个资源">-->
          <!--<a @click.prevent.stop="goPrev()">-->
          <!--<f-a name="prev"></f-a>-->
          <!--</a>-->
          <!--</el-tooltip>-->
          <!--<el-tooltip content="后一个资源">-->
          <!--<a @click.prevent.stop="goPrev()">-->
          <!--<f-a name="next"></f-a>-->
          <!--</a>-->
          <!--</el-tooltip>-->
          <el-button-group>
            <el-button :plain="true" type="primary" @click.prevent.stop="goPrev()"><i
              class="el-icon-arrow-left el-icon--left"></i>上一页
            </el-button>
            <el-button :disabled="false" :plain="true" type="info">{{ currentIndex + 1 }}/{{ groupLen }}</el-button>
            <el-button :plain="true" type="primary" @click.prevent.stop="goNext()">下一页<i
              class="el-icon-arrow-right el-icon--right"></i></el-button>
          </el-button-group>
        </div>
        <div v-if="type=='image'" class="img-tools" @click.stop="stop">
          <el-button type="default" @click.stop="changeZ(1)"><i class="el-icon-t-rotate"></i>
          </el-button>

          <el-button type="default" @click.stop="changeScale(1.2)"><i class="el-icon-zoom-in"></i>
          </el-button>
          <el-button type="default" @click.stop="changeScale(0.8)"><i class="el-icon-zoom-out"></i>
          </el-button>
        </div>
        <div v-if="type=='doc'" class="attachment-doc-body" @click.stop="stop">
          <iframe :src="docViewUrl" frameborder="0" height="100%" width="100%"></iframe>
        </div>
      </div>
    </transition>
  </el-dialog>
</template>
<script>
import {http} from '@/resources';
import utils from '@/tools/utils';

export default {
  data() {
    return {
      dialogVisible: false,
      Attachment: {},
      type: '',
      currentZ: 0,
      scale: 1,
      attachmentId: '',
      currentIndex: 1,
      attachmentIdList: [],
      tempAttachmentList: [],
      moveOpt: {
        moving: false,
        dpos: {x: 0, y: 0},
        imgPos: {x: 0, y: 0}
      }
    };
  },
  computed: {
    currentId: function () {
      return this.$store.state.attachmentDialog.attachmentId;
    },
    attachmentList: function () {
      return this.$store.state.attachmentDialog.attachmentList;
    },
    objectId: function () {
      return this.$store.state.attachmentDialog.objectId;
    },
    objectType: function () {
      return this.$store.state.attachmentDialog.objectType;
    },
    groupLen: function () {
      return this.$store.state.attachmentDialog.attachmentList.length;
    },
    fileUrl: function () {
      let compress = `?image&action=resize:h_${this.$store.state.windowSize.height - 42}`;
      return this.Attachment.attachmentStoragePath + compress;
    },
    docViewUrl: function () {
      return 'https://doc-view.sinopharm-bio.com/view/url?url=' + encodeURIComponent(this.Attachment.attachmentStoragePath);
    },
    dialogVisibleStatus: function () {
      return this.$store.state.attachmentDialog.open;
    },
    style() {
      let arr = [];
      arr.push('transform: rotate(' + this.currentZ + 'deg) scale(' + this.scale + ')');
      arr.push('top:' + this.moveOpt.imgPos.y + 'px');
      arr.push('left:' + this.moveOpt.imgPos.x + 'px');
      return arr.join(';');
    },
    windowSize: function () {
      return this.$store.state.windowSize;
    }

  },
  watch: {
    dialogVisibleStatus: function (val) {
      if (val === true) {
        this.showAttachment();
      }
    },
    currentId: function (val) {
      this.attachmentId = val;
      this.moveOpt = {
        moving: false,
        dpos: {x: 0, y: 0},
        imgPos: {x: 0, y: 0}
      };
      this.getAttachment();
    }
  },
  methods: {
    getAttachment: function () {
      this.currentZ = 0;
      this.scale = 1;
      let getServer = true;
      if (this.attachmentId) {
        if (this.attachmentList.length > 0) {
          this.attachmentList.forEach(item => {
            if (item.attachmentId === this.attachmentId) {
              getServer = false;
              this.Attachment = item;
              this.$nextTick(function () {
                this.showAttachment();
              });
            }
          });
          this.getCurrentIndex();
        } else {
          this.currentIndex = 1;
        }
        if (getServer) {
          http.get('/omsAttachment/' + this.attachmentId).then(res => {
            this.Attachment = res.data;
            this.$nextTick(function () {
              this.showAttachment();
            });
          });
        }
      }
    },
    showAttachment: function () {
      if (!this.Attachment.attachmentStoragePath) {
        return false;
      }
      this.type = this.getType();
      if (this.type === 'image' || this.type === 'doc') {
        this.dialogVisible = true;
        this.listenMove();
      } else {
        utils.download(this.Attachment.attachmentStoragePath, this.Attachment.attachmentFileName);
        this.$store.commit('closeAttachmentDialog');
      }
    },
    getType: function () {
      let type = '';
      let url = this.Attachment.attachmentStoragePath;
      let images = ['jpg', 'png', 'gif', 'jpeg', 'jfif'];
      let docs = ['txt', 'doc', 'docx', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx'];
      if (url) {
        // 去除签名
        url = url.split('?')[0];
        type = url.substring(url.lastIndexOf('.'));
      }
      if (type) {
        type = type.substring(1).toLowerCase();
      }
      if (docs.indexOf(type) !== -1) {
        type = 'doc';
      } else if (images.indexOf(type) !== -1) {
        type = 'image';
      }
      return type;
    },
    close: function () {
      this.$store.commit('closeAttachmentDialog');
      this.dialogVisible = false;
    },
    changeZ: function (type) {
      this.currentZ = (this.currentZ + type * 90) % 360;
    },
    changeScale(scale) {
      this.scale = this.scale * scale;
    },
    stop: function () {
    },
    closeDialog: function () {
      this.$store.commit('closeAttachmentDialog');
      this.dialogVisible = false;
      this.listenMove(true);
    },
    getCurrentIndex: function (type) {
      let currentIndex = 0;
      let len = this.attachmentList.length;
      this.attachmentList.forEach((item, index) => {
        if (item.attachmentId === this.attachmentId) {
          currentIndex = index;
        }
      });
      if (type === 'next') {
        currentIndex++;
      } else if (type === 'prev') {
        currentIndex--;
      } else if (type) {
        currentIndex = type;
      }
      if (len <= currentIndex) {
        currentIndex = 0;
      }
      if (currentIndex < 0) {
        currentIndex = len - 1;
      }
      this.currentIndex = currentIndex;
      return currentIndex;
    },
    goNext: function () {
      let targetIndex = this.getCurrentIndex('next');
      this.attachmentId = this.attachmentList[targetIndex].attachmentId;
      this.getAttachment();
    },
    goPrev: function () {
      let targetIndex = this.getCurrentIndex('prev');
      this.attachmentId = this.attachmentList[targetIndex].attachmentId;
      this.getAttachment();
    },
    startMove(e) {
      let self = this;
      let oEvent = e || event;
      this.moveOpt.dpos = utils.getPos(oEvent);
      document.onmousemove = function (e) {
        let oEvent = e || event;
        let dpos = utils.getPos(oEvent);

        self.moveOpt.imgPos.x += dpos.x - self.moveOpt.dpos.x;
        self.moveOpt.imgPos.y += dpos.y - self.moveOpt.dpos.y;
        self.moveOpt.dpos = dpos; // todo 边界处理
      };

      document.onmouseup = function (e) {
        this.onmousemove = null;
        this.onmouseup = null;
      };

      self.moveOpt.moving = true;
    },
    listenMove(isRemove = false) {

      setTimeout(() => {
        let self = this;
        let dom = document.getElementById('dialog-image');
        if (!dom) return;
        dom.onmousedown = null;

        if (!isRemove) {
          dom.onmousedown = function (e) {
            self.startMove(e);
          };
        }
      }, 300);
    }
  },
  mounted: function () {

  }
};
</script>
