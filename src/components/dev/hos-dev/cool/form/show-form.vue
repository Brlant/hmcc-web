<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">设备信息</template>
    <template slot="btn">
      <el-button @click="close" plain>关闭</el-button>
    </template>
    <template slot="content">
      <div v-if="loading">
        <oms-loading :loading="loading"></oms-loading>
      </div>
      <div class="empty-info" v-else-if="!formItem.id">暂无数据</div>
      <div v-else>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: pageSets[0].key === currentTab.key}" class="tit f-dib index-tit">
              {{pageSets[0].name}}</h3>
          </div>
          <div class="content">
            <oms-col :isShow="true" :rowSpan="span" label="编号">{{formItem.no}}</oms-col>
            <oms-col :isShow="true" :rowSpan="span" label="所属单位">{{formItem.orgName}}</oms-col>
            <oms-col :isShow="true" :rowSpan="span" label="类型">
              {{formatDictLabel(formItem.type, coolDevType)}}
            </oms-col>
            <oms-col :isShow="true" :rowSpan="span" label="品牌">{{formItem.brand}}</oms-col>
            <oms-col :isShow="true" :rowSpan="span" label="型号">{{formItem.version}}</oms-col>
            <oms-col :isShow="true" :rowSpan="span" label="是否医用设备">
              {{formatDictLabel(formItem.medicalFlag, medicalDevType)}}
            </oms-col>
            <oms-col :isShow="true" :rowSpan="span" label="门板类型">
              {{formatDictLabel(formItem.doorSheetType, doorDevType)}}
            </oms-col>
            <oms-col :isShow="true" :rowSpan="span" label="容积">{{formItem.volume}}</oms-col>
            <oms-col :isShow="true" :rowSpan="span" label="状态">
              {{parent.formatStatus(formItem.status, statusType)}}
            </oms-col>
            <oms-col :isShow="true" :rowSpan="span" label="备注">
              {{formItem.remark}}
            </oms-col>
            <oms-row :span="5" label="图片" class="clearfix">
              <div :class="{'base-pic-item':formItem.photoUrl,'base-pic-item-normal':!formItem.photoUrl} "
                   @click="handlePreview(formItem.photoId)">
                <compressed-img v-if="formItem.photoUrl"
                                :src="formItem.photoUrl?formItem.photoUrl+'?image&action=resize:w_380,m_0':'/static/img/userpic.png' "/>
                <img src="/static/img/userpic.png" v-else>
              </div>
            </oms-row>
          </div>
        </div>
      </div>
    </template>
  </dialog-template>
</template>
<script>
  import {formatDictLabel} from '@/tools/utils'
  export default {
    props: {
      index: Number,
      formItem: Object,
      statusType: Object
    },
    data() {
      return {
        span: 10,
        loading: false,
        pageSets: [
          {name: '基本信息', key: 0}
        ],
        currentTab: {},
        tempList: [],
        currentIndex: -1,
        parent: this.$parent.$parent,
        formatDictLabel
      };
    },
    computed: {
      medicalDevType () {
        return this.$store.state.medicalDevType;
      },
      doorDevType () {
        return this.$store.state.doorDevType;
      },
      coolDevType() {
        return this.$getDict('coolDevType')
      }
    },
    watch: {
      index(val) {
        this.currentIndex = -1;
        this.$nextTick(() => {
          this.currentIndex = val;
        });
      }
    },
    methods: {
      handlePreview: function (id) {
        this.$store.commit('changeAttachment', id);
      },
      showRecordDate: function (data) {
        return data ? this.$moment(data).format('YYYY-MM-DD HH:mm:ss') : '';
      },
      selectTab(item) {
        this.currentTab = item;
      },
      close() {
        this.$emit('right-close');
      },
      addBindRelation() {
        this.$refs['bindRelation'].isShowAddForm = true;
      }
    }
  };
</script>
