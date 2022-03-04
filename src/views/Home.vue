<template>
  <div>
    <v-row>
      <v-col cols="9" >
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
          style="margin:0px 5px"
        ></v-textarea>
        <v-btn 
        v-clipboard:copy="textareaUrl"
        color="primary" 
        style="margin:0px 5px"  
        height="56px">
          复制
        </v-btn>
        <v-btn @click="parseBtn" style="margin:0px 5px"  height="56px">
          解析
        </v-btn>
        </div>
      </v-col>
      <v-col cols="3">
          <v-card height="80px" v-for="node in graphData.nodeList"  :key="node.text" class="d-flex  justify-space-between mb-3">
            <IconPicker :ref="'icon-picker-' + node.id" :node="node"
             @refrech="refreshData" 
             style="margin-left:30px">
                <template v-slot:menuActivator="{ on, attrs }">
                  <v-img
                    width="0px"
                    v-bind="attrs"
                    contain
                    v-on="on"
                    :src="node.avatar"
                    @click="imgClick(node)"
                  />
                </template>
            </IconPicker>
            <p class="font-weight-bold" style="font-size:50px;padding:0 20px;color:#764157">
              {{node.id}}
            </p> 
            <v-text-field
            style="margin-top:20px;"
            label="别名"
            :value="node.text"
            single-line
            ></v-text-field>
            
          </v-card>                  
      </v-col>
    </v-row>
    <img
      :src="graphUrl"
      width="300px"
      style="margin-left: 400px; margin-top: 0px"
    />
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
      curNode: null,
      graphUrl: "",
      menuInfo: {},
      options: { FontAwesome: false, ElementUI: false },
      pickeredIconInfo: {},
      captchaInputLastTime: null,
      zIndex: 3500,
      highLightColor: "#fc1944",
      textareaUrl: "",
    };
  },
  mounted() {
    if ("textareaUrl" in this.$route.query) {
      this.textareaUrl =  this.GLOBAL.BASE_URL +"/graph/parseBase64?data=" + this.$route.query.textareaUrl;
      this.parseBtn();
    }
  },
  watch: {
    textareaValue: async function (val) {
      this.refreshData();
    },
  },
  methods: {
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
      this.curNode = node;
      let refPicker = this.$refs["icon-picker-" + node.id][0];
      refPicker.searchPictureName = node.searchPictureName;
      // this.searchPicture(node); 
      //使用服务器传回的图片
      refPicker.setPickedPicture(node.avatar, node.text);
    },
    getPng(res) {
      this.graphData = res.data.graphData;
      this.graphData.nodeList.forEach((node) => {
        this.$set(this.menuInfo, node.id, false);
      });
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
      var delay = 2000; //延迟2000 毫秒执行
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
        if (
          res.status != 200 ||
          res.data.success == false ||
          this.graphData == res.data.graphData
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