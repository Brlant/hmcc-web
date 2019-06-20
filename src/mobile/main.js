import Vue from 'vue';
import router from './routers';
import tinyVue from '../lib/tinyVue';
import moment from 'moment';
import 'moment/locale/zh-cn';
import '@/assets/scss/index.scss';
import '@/assets/css/basic.css';
import '@/assets/fonts/iconfont.css';
import Vuex from 'vuex';
import store from '../store';
import {init} from '../tools/init';
import App from './App.vue';

import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import 'echarts/lib/component/markLine';
import 'echarts/lib/component/dataZoom';
import ECharts from 'vue-echarts/components/ECharts.vue';

Vue.component('ECharts', ECharts);
Vue.use(require('vue-moment'), {moment});
Vue.use(tinyVue);
Vue.use(Vuex);

init(Vue);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

