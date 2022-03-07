<template>
  <div >
    <v-overlay :value="overlay"></v-overlay>
    <v-row>
      <v-col cols="9" fluid>
        <v-textarea
          outlined
          name="input-7-4"
          label="请输入表达式"
          v-model="textareaValue"
          height="300px"
          style="margin: 5px 5px;"
        ></v-textarea>
        <div class="d-flex">
          <v-textarea
          outlined
          name="input-url"
          label="url"
          v-model="textareaUrl"
          height="10px"
          class="ml-2"
       
        ></v-textarea>
        <v-btn 
        v-clipboard:copy="textareaUrl"
        color="primary" 
        style="margin:0px 5px;"  
        height="56px">
          复制
        </v-btn>
        <v-btn @click="parseBtn" style="margin:0px 5px"  height="56px">
          解析
        </v-btn>
        </div>
        <v-card class="flex-grow-0 flex-shrink-0 align-self-start ml-2" >
          <v-img
          contain
          max-height=200px
         :src="graphUrl"
        />
       </v-card>    
      </v-col>
      <v-col cols="3">
        <v-virtual-scroll 
        :items="graphData.nodeList"
        height="650"
        item-height="105"
       >
        <template v-slot:default="{ item }">
          <v-card 
            :key="item.id"
            class="d-flex
            flex-nowrap
            justify-space-between
            mr-4 ml-1 mt-2
            align-center
            "
          >
            <IconPicker :ref="'icon-picker-' + item.id" :node="item"
                @refrech="refreshData" 
                @menuOverlay="changeOverlay"
           
            >
              <template v-slot:menuActivator="{ on, attrs }">
                <v-img
                  style="flex-basis: 50px;
                         flex-grow: 0;
                         flex-shrink: 0;"
                  class="ml-7"
                  contain
                  v-bind="attrs"
                  v-on="on"
                  :src="item.avatar"
                  @click="imgClick(item)"
                />
              </template>
            </IconPicker >
            <v-card flat class="d-flex flex-column">
              <p class="font-weight-bold mb-0" 
                 style="width:180px;overflow: hidden;white-space:nowrap;text-overflow:ellipsis;font-size:30px;color:#764157">
                {{item.id}}
              </p> 
              <div class="d-flex mr-2">
                <v-text-field
                dense
                class="mr-3"
                label="别名"
                v-model="item.text"
                single-line
                @input="nodeTextInput"
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
        edgeList: [],
      },
      curPicture: "",
      graphUrl: "",
      menuInfo: {},
      options: { FontAwesome: false, ElementUI: false },
      pickeredIconInfo: {},
      captchaInputLastTime: null,
      zIndex: 3500,
      highLightColor: "#fc1944",
      textareaUrl: "",
      overlay: false,
    };
  },
  mounted() {
    if ("textareaUrl" in this.$route.query) {
      this.textareaUrl =  this.GLOBAL.BASE_URL +"/graph/parseBase64?data=" + this.$route.query.textareaUrl;
      this.parseBtn();
    }
  },
  watch: {
    textareaValue: function (val) {
      this.refreshData();
    },
  },
  methods: {
    nodeTextInput(input) {
      console.log(this.graphData);
      this.refreshData();


    },
    changeOverlay(data) {
      this.overlay=data;
    },
    parseBtn() {
      this.axios({
        url: this.textareaUrl + "&type=parse",
        method: "GET"
      }).then(res =>{
        this.getPng(res);
        this.textareaValue = res.data.rawData;
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
    getPng(res) {
      this.graphData = res.data.graphData;
      // 向 menuInfo 中注入 node id 和是否打开
      this.graphData.nodeList.forEach((node) => {
        this.$set(this.menuInfo, node.id, false);
      });
      // 向 pickeredIconInfo 中注入 node id 和已挑选图片
      this.graphData.nodeList.forEach((node) => {
        this.$set(this.pickeredIconInfo, node.id, "");
      });
      this.axios({
        url: "/graph/getPng",
        method: "POST",
        data: this.graphData,
        responseType: "blob",
      }).then((res) => {
        const blob = new Blob([res.data], { type: "img/png" });
        const url = window.URL.createObjectURL(blob);
        this.graphUrl = url;
      });
    },
    async refreshData() {
      var delay = 500; //延迟 500 毫秒执行
      this.captchaInputLastTime = new Date().valueOf();
      await this.sleep(delay);
      var nowTime = new Date().valueOf();
      var gap = nowTime - this.captchaInputLastTime;
      if (gap < delay) {
        return;
      }
      this.axios({
        url: "/graph/parse",
        method: "POST",
        data: { rawData: this.textareaValue, jsonData: this.graphData },
      }).then((res) => {
        // 若数据没有更新，则不进行后续操作
        if (
          res.status != 200 ||
          res.data.success == false
        ) {
          return;
        }
        this.textareaUrl = this.GLOBAL.BASE_URL +"/graph/parseBase64?data=" + res.data.graphData.Base64;
        this.getPng(res);
      });
    },
  },
  components: { IconPicker },
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