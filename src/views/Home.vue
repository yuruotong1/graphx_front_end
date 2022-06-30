<template>
  <div>
    <v-overlay :value="overlay"></v-overlay>
    <v-row>
      <v-col cols="9" fluid>
        <p style="margin: 15px 5px">邮箱：1256305343@qq.com</p>
        <v-textarea area
          outlined
          name="input-7-4"
          v-model="textareaValue"
          label="请输入表达式"
          height="300px"
          style="margin: 5px 5px"
          @input="mainTextareaChange"
        ></v-textarea>
        <div class="d-flex">
          <v-textarea
            outlined
            name="input-url"
            label="url"
            v-model="getPngUrl"
            height="10px"
            class="ml-2"
          ></v-textarea>
          <v-btn
            v-clipboard:copy="getPngUrl"
            color="primary"
            style="margin: 0px 5px"
            height="56px"
          >
            复制
          </v-btn>
        </div>
        
        <v-card class="flex-grow-0 flex-shrink-0 align-self-start ml-2" flat >
            <img style="max-width:900px" :src="graphUrl">
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-virtual-scroll
          :items="iconPickerList"
          height="650"
          item-height="105"
        >
          <template v-slot:default="{ item }">
            <v-card
              :key="item.id"
              class="
                d-flex
                flex-nowrap
                justify-space-between
                mr-4
                ml-1
                mt-2
                align-center
              "
            >
              <IconPicker
                :ref="'icon-picker-' + item.id"
                :node="item"
                @refrech="iconPickerRefresh"
                @menuOverlay="changeOverlay"
              >
                <template v-slot:menuActivator="{ on, attrs }">
                  <v-img
                    style="flex-basis: 50px; flex-grow: 0; flex-shrink: 0"
                    class="ml-7"
                    contain
                    v-bind="attrs"
                    v-on="on"
                    :src="item.avatar"
                    @click="imgClick(item)"
                  />
                </template>
              </IconPicker>
              <v-card flat class="d-flex flex-column">
                <p
                  class="font-weight-bold mb-0"
                  style="
                    width: 180px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    font-size: 30px;
                    color: #764157;
                  "
                >
                  {{ item.id }}
                </p>
                <div class="d-flex mr-2">
                  <v-text-field
                    dense
                    class="mr-3"
                    :label=item.text
                    single-line
                    @input="nodeTextInput($event, item)"
                  ></v-text-field>
                </div>
              </v-card>
            </v-card>
          </template>
        </v-virtual-scroll>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import IconPicker from "../components/IconPicker";
export default {
  name: "Home",
  data() {
    return {
      textareaValue: "",
      graphData: {
        nodeList: [],
      },
      iconPickerList: [],
      curPicture: "",
      graphUrl: "",
      options: { FontAwesome: false, ElementUI: false },
      captchaInputLastTime: null,
      zIndex: 3500,
      highLightColor: "#fc1944",
      base64Data: "",
      getPngUrl: "",
      overlay: false,
    };
  },
  mounted() {
    if ("base64Data" in this.$route.query) {
      this.base64Data = this.$route.query.base64Data;
      this.getPngUrl =
        this.GLOBAL.BASE_URL + "/graph/png?data=" + this.base64Data;
      this.$router.push({ query: {} });
      this.parseBtn();
    }
  },
  methods: {
    iconPickerRefresh() {
      this.graphData.nodeList = this.iconPickerList;
      this.refreshData({ rawData: this.textareaValue, jsonData: this.graphData });
    },
    mainTextareaChange(input) {
      const res = this.refreshData({ rawData: input, jsonData: this.graphData })
      if(res != null){
        res.then(x=> {
         this.iconPickerList=this.graphData.nodeList
      }); 
      }
     
    },
    nodeTextInput(input, item) {
      item.text = input;
      this.graphData.nodeList = this.iconPickerList
      this.refreshData({ rawData: this.textareaValue, jsonData: this.graphData });
    },
    changeOverlay(data) {
      this.overlay = data;
    },
    parseBtn() {
      this.axios({
        url:
          this.GLOBAL.BASE_URL + "/graph/parseBase64?data=" + this.base64Data,
        method: "GET",
      }).then((res) => {
        this.saveData(res);
        this.iconPickerList = res.data.graphData.nodeList
        this.textareaValue = res.data.graphData.rawData;
      });
    },
    sleep(ms = 1000) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    imgClick(node) {
      let refPicker = this.$refs["icon-picker-" + node.id];
      refPicker.searchPictureName = node.searchPictureName;
      //使用服务器传回的图片
      refPicker.setPickedPicture(node.avatar, node.text);
    },
    async refreshData(data) {
      var delay = 1500; //延迟 1.5 秒执行
      this.captchaInputLastTime = new Date().valueOf();
      await this.sleep(delay);
      var nowTime = new Date().valueOf();
      var gap = nowTime - this.captchaInputLastTime;
      if (gap < delay) {
        return null;
      }
      return this.axios({
        url: "/graph/parseData",
        method: "POST",
        data: data,
      }).then((res) => {
        this.saveData(res);
        this.getPngUrl =
          this.GLOBAL.BASE_URL + "/graph/png?data=" + res.data.graphData.Base64;
      });
    },
    saveData(res) {
      // 若数据没有更新，则不进行后续操作
      if (res.status != 200 || res.data.success == false) {
        return;
      }
      this.graphUrl = "data:image/png;base64, " + res.data.graphData.img;
      this.graphData.nodeList = res.data.graphData.nodeList;
    },
  },
  components: { IconPicker},
};
</script>

<style scoped>
.my-custom-dialog {
  position: absolute;
  bottom: 50;
  right: 50;
  margin-left: 0px;
}
</style>