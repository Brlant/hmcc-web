import {Access} from '@/resources';

export default {
  mounted() {

  },
  methods: {
    getRoleMenus(noCache = false) {
      return new Promise((resolve, reject) => {
        let menu = this.$store.state.allMenuList;
        if (noCache === false && menu && menu.length) {
          resolve(menu);
        } else {
          Access.getRoleMenus().then(res => {
            this.$store.commit('initPermList', JSON.parse(JSON.stringify(res)));
            resolve(res);
            let getParentIds = (menus, parentsIds) => {
              menus.forEach(i => {
                if (i.children) {
                  parentsIds.push(i.id);
                  getParentIds(i.children, parentsIds);
                }
              });
            };
            let setParentIds = (menus) => {
              let parentIds = [];
              getParentIds(menus, parentIds);
              this.$store.commit('initMenuParentIds', parentIds);
            };
            setParentIds(res.data);
          });
        }
      });
    }
  }
};
