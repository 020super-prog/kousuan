// custom-tab-bar/index.js
Component({
  data: {
    selected: 0,
    color: '#95A5A6',
    selectedColor: '#4A90E2',
    list: [
      {
        pagePath: '/pages/home/index',
        text: '首页',
        icon: 'home',
        selectedIcon: 'home'
      },
      {
        pagePath: '/pages/camera/index',
        text: '拍照批改',
        icon: 'camera',
        selectedIcon: 'camera'
      },
      {
        pagePath: '/pages/mistakes/index',
        text: '错题本',
        icon: 'book-open',
        selectedIcon: 'book-open'
      },
      {
        pagePath: '/pages/profile/index',
        text: '我的',
        icon: 'user',
        selectedIcon: 'user'
      }
    ]
  },

  attached() {
    // 组件加载时，获取当前页面路径并设置选中状态
    this.updateSelected();
  },

  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      
      wx.switchTab({
        url,
        success: () => {
          this.setData({
            selected: data.index
          });
        }
      });
    },

    updateSelected() {
      const pages = getCurrentPages();
      if (!pages || pages.length === 0) {
        return;
      }
      
      const currentPage = pages[pages.length - 1];
      if (!currentPage || !currentPage.route) {
        return;
      }
      
      const route = '/' + currentPage.route;
      const selected = this.data.list.findIndex(item => item.pagePath === route);
      
      if (selected !== -1) {
        this.setData({
          selected
        });
      }
    }
  }
});
