import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

//  需要维护的状态
const state = {
  uploadUrl: 'https:// jsonplaceholder.typicode.com/posts/',
  user: {},
  dict: {},
  permissions: [],
  allMenuList: {},
  roleList: {},
  attachmentDialog: {attachmentId: 0, open: false, attachmentList: []},
  dev: {},
  bodySize: {left: '200px'},
  setBodyHeight: 0,
  print: {
    isPrinting: false,
    text: '拼命打印中'
  },
  bodyHeight: 0,
  isShowGoodsList: false,
  bottomLoading: false,
  menuParentIds: [], // 所有非叶子节点菜单
  requestingDictAry: [],
  orgCode: '',
  unitId: '',
  devCode: '',
  findPath: true,
  times: [],
  isShowTemp: false,
  medicalDevType: [
    {key: '0', label: '未知'},
    {key: '1', label: '医用'},
    {key: '2', label: '非医用'}
  ],
  doorDevType: [
    {key: '0', label: '未知'},
    {key: '1', label: '玻璃门'},
    {key: '2', label: '避光门'}
  ],
  handleTypeList: [
    {key: '0', label: '整理疫苗'},
    {key: '1', label: '冷链设备故障'},
    {key: '2', label: '监控设备故障(探头)'},
    {key: '3', label: '电源接电故障（冷链设备）'},
    {key: '4', label: ' 冷链设备门没关'},
    {key: '5', label: '报警敏感（处置时已恢复正常）'},
    {key: '6', label: '误报警'},
    {key: '8', label: '市电断电'},
    {key: '9', label: '单位内部断电'},
    {key: '10', label: '冷链室电器故障'},
    {key: '11', label: '电源接电故障(监控设备)'},
    {key: '12', label: '设备维修未及时关闭报警'},
    {key: '7', label: '其他'}
  ],
  weChatInfo: {},
  logisticsCenterList:[]
};

const mutations = {
  initUser: function (state, data) {
    try {
      if (data && data.userId) {
        window.localStorage.setItem('user', JSON.stringify(data));
        state.user = data;
      }
    } catch (e) {

    }
  },
  initCode(state, orgCode) {
    try {
      if (orgCode) {
        window.localStorage.setItem('orgCode', JSON.stringify(orgCode));
        state.orgCode = orgCode;
      }
    } catch (e) {

    }
  },
  initDev(state, data) {
    state.dev = data;
  },
  initDict(state, data) {
    state.dict = data;
  },
  initPermissions(state, data) {
    state.permissions = data;
  },
  initPermList(state, data) {
    state.allMenuList = data;
  },
  changeBodyLeft(state,data){
    state.bodySize.left = data;
  },
  changeAttachment(state, data) {
    let currentId;
    if (typeof data === 'object') {
      currentId = data.currentId;
      state.attachmentDialog.attachmentList = data.attachmentList;
    } else {
      currentId = data;
      state.attachmentDialog.attachmentList = [];
    }
    if (state.attachmentDialog.attachmentId === currentId) {
      state.attachmentDialog.open = true;
    } else {
      state.attachmentDialog.attachmentId = currentId;
    }
  },
  closeAttachmentDialog(state) {
    state.attachmentDialog.open = false;
  },
  setBodyHeight(state, data) {
    state.bodyHeight = data;
  },
  initPrint(state, data) {
    data.text = data.text || '拼命打印中';
    state.print = data;
  },
  initIsShowGoodsList(state, data) {
    state.isShowGoodsList = data;
  },
  initMenuParentIds(state, data) {
    state.menuParentIds = data;
  },
  initBottomLoading(state, data) {
    state.bottomLoading = data;
  },
  initRequestingDictAry(state, data) {
    state.requestingDictAry = data;
  },
  initUnitId(state, data) {
    state.unitId = data;
  },
  initDevCode(state, data) {
    state.devCode = data;
  },
  initFindPath(state, data) {
    state.findPath = data;
  },
  initTimes(state, data) {
    state.times = data;
  },
  initShowTemp(state, data) {
    state.isShowTemp = data;
  },
  initWeChatInfo(state, data) {
    try {
      if (typeof data === 'object') {
        window.localStorage.setItem('weChatInfo', JSON.stringify(data));
        state.weChatInfo = data;
      }
    } catch (e) {

    }
  }
};

export default new Vuex.Store({
  state,
  mutations
});
