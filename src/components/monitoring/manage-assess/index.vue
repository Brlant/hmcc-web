<style lang="scss" scoped>
  .record-content {
    background: #fff;
    padding: 20px 0;
  }

  .record-title {
    font-weight: bold;
    font-size: 18px;
    text-align: center;
  }

  .m-border {
    border-bottom: 1px solid #e7e7e7;
    display: inline-block;
    padding: 0 10px;
    min-width: 50px;
  }

  .record-label {
    text-align: center;
    margin-top: 15px;
  }

  .record-table {
    padding: 0 50px;
    margin-top: 15px;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }

  .table td {
    padding: 4px 8px;
    border: 1px solid #e7e7e7;
    text-align: center;
  }

  .table .header {
    font-weight: bold;

    td {
      background: #F5F5F6;
    }
  }

  .sign-img {
    width: auto;
    height: 24px;
    vertical-align: middle;
  }
</style>
<template>
  <div class="order-page">
    <search-part @search="searchResult">
      <template slot="btn">
        <el-button plain size="small" @click="exportExcel">
          <f-a class="icon-small" name="export"></f-a>
          导出Excel
        </el-button>
      </template>
    </search-part>
    <div class="record-content">
      <div class="record-table">
        <table class="table" v-loading="loading">
          <tr class="header">
            <td>序号</td>
            <td>类别</td>
            <td>单位</td>
            <td>冷链设备总数</td>
            <td>报警总数</td>
            <td>人为造成次数
              <el-tooltip effect="dark" placement="bottom" content="报警原因：冰箱门没有关好"><i
                class="el-icon-warning-outline ml-10"/></el-tooltip>
            </td>
            <td>未及时处理次数
              <el-tooltip effect="dark" placement="bottom" content="报警未及时处理，升级为2、3级报警"><i
                class="el-icon-warning-outline ml-10"/></el-tooltip>
            </td>
            <td>
              未按规定登录平台次数
              <el-tooltip effect="dark" placement="bottom" content="每天登录2次平台，没有合规的天数"><i
                class="el-icon-warning-outline ml-10"/></el-tooltip>
            </td>
            <td>
              冷链管理评估值
              <el-tooltip effect="dark" placement="bottom"
                          content="冷链管理评估的因素包括：冷链设备总数、报警总数、人为造成次数、未及时处理次数和未按规定登录次数，根据数学模型：冷链管理评估值=ε*冷链设备总数/(ε*冷链设备总数+η*报警总数+θ*人为造成次数+φ*未及时处理次数+β*未按规定登录平台次数)*100；">
                <i class="el-icon-warning-outline ml-10"/></el-tooltip>
            </td>
          </tr>
          <template v-for="(item, index) in dataList">
            <tr>
              <td>{{index + 1}}</td>
              <td>{{item.orgType}}</td>
              <td>{{item.orgName}}</td>
              <td>{{item.freezerDevCount}}</td>
              <td>{{item.alarmTotalCount}}</td>
              <td>{{item.manMistakeCount}}</td>
              <td>{{item.notTimelyHandlerCount}}</td>
              <td>{{item.notLoginCount}}</td>
              <td>{{item.evaluationValue}}</td>
            </tr>
          </template>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
  import SearchPart from './search';
  import {manageAssess} from '@/resources';
  import utils from '@/tools/utils'
  export default {
    components: {
      SearchPart
    },
    data() {
      return {
        filter: {
          orgName: '',
          orgId: '',
          freezerDevName: '',
          freezerDevId: '',
          freezerDevNo: '',
          monthDate: new Date(),
        },
        loading: false,
        dataList: []
      };
    },
    methods: {
      searchResult: function (search) {
        this.filter = Object.assign({}, this.filter, search);
        this.queryList();
      },
      resetRightBox() {
        this.showIndex = -1;
      },
      queryList() {
        let {orgId, monthDate} = this.filter;
        let date = new Date(this.$moment(monthDate).startOf('month'));
        let params = {
          orgId,
          date
        };
        this.loading = true;
        manageAssess.query(params).then(res => {
          this.loading = false;
          if (res.code === 200) {
            this.dataList = res.data;
          }
        });
      },
      format(time, str = 'YYYY') {
        return this.$moment(time).format(str);
      },
      exportExcel() {
        this.$store.commit('initPrint', {isPrinting: true, moduleId: this.$route.path, text: '拼命导出中'});
        let {orgId, monthDate} = this.filter;
        let date = new Date(this.$moment(monthDate).startOf('month'));
        let params = {
          orgId,
          date
        };
        manageAssess.export(params).then(res => {
          utils.download(res.data.path);
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path, text: '拼命导出中'});
        }).catch(error => {
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path, text: '拼命导出中'});
          this.$notify({
            duration: 2000,
            title: '导出失败',
            message: error.response.data.msg,
            type: 'error'
          });
        });
      }
    }
  };
</script>
