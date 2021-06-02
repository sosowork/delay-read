<template>
  <div class="history">
    <!-- <el-button slot="reference" type="text"
      ><i class="el-icon-tickets"></i> 添加到提醒清单</el-button
    > -->
    <div class="picker-wrap">
      <h2 class="site-title">
        <!-- <span>当前页面：</span> -->
        <img class="site-icon" :src="curTabInfo.favIconUrl" alt="" />
        <span>{{ curTabInfo.title | sliceStr }}</span>
      </h2>
      <!-- <el-date-picker
        v-model="time"
        type="datetime"
        placeholder="选择提醒时间"
        value-format="timestamp"
        size="mini"
      >
      </el-date-picker> -->
      <el-date-picker
        v-model="time"
        type="datetime"
        placeholder="选择提醒时间"
        align="right"
        :picker-options="pickerOptions"
        value-format="timestamp"
        size="mini"
        class="datepicker"
      >
      </el-date-picker>
      &nbsp;&nbsp;
      <!-- <el-button type="text" @click="save" :disabled="!time">保存</el-button> -->
      <el-button
        type="primary"
        icon="el-icon-check"
        @click="save"
        :disabled="!time"
        size="mini"
      ></el-button>
    </div>
    <el-divider content-position="left">延迟阅读清单</el-divider>
    <!-- <h1 class="history-title"></h1> -->
    <el-container style="height: 500px;">
          <el-scrollbar class="page-scroll">
        <el-table :data="urlList" :show-header="false">
          <el-table-column width="315px">
            <template slot-scope="scope">
              <div class="div-icon">
                <img class="site-icon" :src="scope.row.favIconUrl" alt="" />
              </div>
              <!-- <h2 class="site-title"> -->
              <div style="width: 90%; float: left">
                <p>{{ scope.row.title | sliceStr }}</p>
                <p class="site-url">
                  {{ scope.row.url | getHost }} - remind:
                  {{ scope.row.time | formatTime }}
                </p>
              </div>
              <!-- </h2> -->
            </template>
          </el-table-column>
          <!-- <el-table-column
        prop="url"
        width="230px"
        :show-overflow-tooltip="true"
      ></el-table-column> -->
          <el-table-column width="50px">
            <template slot-scope="scope">
              <el-button
                class="el-icon-delete"
                type="text"
                @click="deleteUrl(scope.$index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </el-container>
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: "App",
  components: {},
  data() {
    return {
      curTabInfo: {
        title: "",
        url: "",
        favIconUrl: "",
      },
      time: "",
      urlList: [], //保存的链接列表
      pickerOptions: {
        shortcuts: [
          {
            text: "30s later",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 30 * 1000);
              picker.$emit("pick", date);
            },
          },
          {
            text: "1min later",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 60 * 1000);
              picker.$emit("pick", date);
            },
          },
          {
            text: "5min ``",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 5 * 60 * 1000);
              picker.$emit("pick", date);
            },
          },
          {
            text: "10min ``",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 10 * 60 * 1000);
              picker.$emit("pick", date);
            },
          },
          {
            text: "30min ``",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 30 * 60 * 1000);
              picker.$emit("pick", date);
            },
          },
          {
            text: "1h later",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000);
              picker.$emit("pick", date);
            },
          },
          {
            text: "2h ``",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 2 * 3600 * 1000);
              picker.$emit("pick", date);
            },
          },
          {
            text: "6h ``",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 6 * 3600 * 1000);
              picker.$emit("pick", date);
            },
          },
          {
            text: "12h ``",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 12 * 3600 * 1000);
              picker.$emit("pick", date);
            },
          },
          {
            text: "1d later",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 24 * 3600 * 1000);
              picker.$emit("pick", date);
            },
          },
        ],
      },
    };
  },
  beforeMount() {
    this.getCurTabInfo();
    this.getUrlListFromStorage();
  },
  filters: {
    formatTime(val) {
      return dayjs(val).format("MM-DD HH:mm:ss");
    },
    getHost(val) {
      var reg = /^.*?:\/\/(.*?)\//;
      var data = reg.exec(val);
      if (data && data.length >= 2) {
        return data[1];
      } else {
        return val;
      }
    },
    sliceStr(val) {
      if (val.length > 23) {
        return val.slice(0, 23) + "..";
      }
      return val;
    },
  },
  methods: {
    getCurTabInfo() {
      const _this = this;
      chrome.tabs.getSelected(null, function (tab) {
        console.log("tab============", tab);
        Object.keys(_this.curTabInfo).forEach((k) => {
          _this.curTabInfo[k] = tab[k] || "";
        });
      });
    },
    //从本地存储获取urlList
    getUrlListFromStorage() {
      setInterval(() => {
        const _this = this;
        chrome.storage.sync.get(
          "urlList",
          function (items) {
            _this.urlList = items.urlList || [];
            console.log(items.urlList);
          }.bind(this)
        );
      }, 1000);
    },
    // urlList保存到本地
    setUrlListToStorage() {
      const _this = this;
      chrome.storage.sync.set({ urlList: _this.urlList });
    },
    save() {
      const _this = this;
      chrome.tabs.getSelected(null, function (tab) {
        const { title, url, favIconUrl } = tab;
        const item = {
          url,
          title,
          favIconUrl,
          time: _this.time,
          id: `${Date.now()}`,
        };
        _this.urlList.unshift(item);
        _this.time = "";
        _this.$message.success("保存成功");
        _this.setUrlListToStorage();
      });
    },
    deleteUrl(index) {
      this.urlList.splice(index, 1);
      this.setUrlListToStorage();
    },
    gotoUrl(url) {
      window.open(url);
    },
    clear() {
      this.urlList = [];
      chrome.storage.clear();
    },
  },
};
</script>
<style lang="scss" scoped>
.history {
  padding: 16px;
  // background-color: ;
  .site-title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .site-icon {
    display: inline-block;
    position: relative;
    top: -1px;
    width: 15px;
    height: 15px;
    margin-right: 8px;
  }
  .site-url {
    color: #9195a3;
    font-size: 6px;
  }
  .div-icon {
    display: table-cell;
    float: left;
    vertical-align: middle;
    text-align: center;
    line-height: 46px;
    height: 46px;
    // margin: 0px 5px;
    width: 10%;
  }
  // .datepicker{
  //   width: 100%;
  // }
}
</style>
<style lang="scss">
html {
  width: 400px;
  height: 500px;
  background: transparent;
}
.el-date-picker .el-picker-panel__content {
  width: 260px !important;
}
.el-date-picker.has-sidebar.has-time {
  width: 380px !important;
  margin: 10px 10px !important;
}
.page-scroll {
  height: 100%;
}

.page-scroll .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
