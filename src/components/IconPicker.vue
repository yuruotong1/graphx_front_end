<template>
  <v-menu
    v-model="menuVisible"
    :close-on-content-click="false"
    max-width="230px"
    max-height="300px"
    offset-x
  >
    <template v-slot:activator="{ on, attrs }">
      <slot name="menuActivator" :on="on" :attrs="attrs"> </slot>
    </template>
    <v-card>
      <v-text-field
        flat
        style="margin: 0px 8px 0 8px"
        hide-details
        v-model="searchPictureName"
        label="Search"
        clearable
        @input="changeSearch"
      ></v-text-field>
      <v-list color="#fafcff" class="overflow-y-auto" height="180px">
        <v-row dense>
          <v-col v-for="picture in this.pictures" :key="picture.name" cols="3">
            <v-menu open-on-hover left offset- offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-img
                  width="25px"
                  contain
                  v-on="on"
                  v-bind="attrs"
                  :src="picture.avatar"
                  class="img-padding"
                  :class="{
                    'img-border': pickedPicture.avatar == picture.avatar,
                  }"
                  @click="iconClick(picture)"
                >
                </v-img>
              </template>
              <v-card>
                <v-img width="100px" contain :src="picture.avatar"> </v-img>
              </v-card>
            </v-menu>
          </v-col>
        </v-row>
      
        <v-btn height="28px" style="display:block;margin:20px auto;" @click="loadMore">
          {{ loadMoreBtnText }}
        </v-btn>

      </v-list>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="menuVisible = false"> Cancel </v-btn>
        <v-btn color="primary" text @click="saveButton"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script >
export default {
  name: "IconPicker",
  props: {
    node: Object,
  },
  watch: {
    menuVisible: function (isVisiable) {
      this.$emit("menuOverlay", isVisiable);
      if(isVisiable) {
        this.destoryIcon();
        this.addIcon();
      }
    },
  },
  data() {
    return {
      pictures: [],
      menuVisible: false,
      pickedPicture: null,
      searchPictureName: null,
      curPage: 1,
      totalPage: 1,
      loadMoreBtnText: "再来点",
      captchaInputLastTime: null,
    };
  },
  methods: {
    changeSearch(input) {
      this.node.searchPictureName = input;
      this.destoryIcon();
      this.addIcon();
    },
    async addIcon() {
      var delay = 500;
      this.captchaInputLastTime = new Date().valueOf();
      await this.sleep(delay);
      var nowTime = new Date().valueOf();
      var gap = nowTime - this.captchaInputLastTime;
      if (gap < delay || this.curPage > this.totalPage) {
        return;
      }
      this.axios({
        url:
          "https://iconsapi.com/api/search?appkey=620271bee4b06f79691875ea&page=" +
          this.curPage +
          "&query=" +
          this.node.searchPictureName,
        method: "GET",
      }).then((res) => {
        if ("result" in res.data && res.data.result == "error") {
          return;
        }
        this.totalPage = res.data.pages.pageCount;
        res.data.pages.elements.forEach((element) => {
          this.pictures.push({
            avatar: element.url,
            pictureName: element.iconName,
          });
        });
        this.curPage += 1;
      });
    },
    sleep(ms = 1000) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    destoryIcon() {
      this.pictures = [];
      this.curPage = 1;
      this.totalPage = 1;
      // 将圆点作为默认图形，第一个推入
      this.pictures.push({
        avatar: "https://iconsapi.com/5ee262cde4b0b788a932ab9f.svg",
        pictureName: "圆点"
      });
    },

    iconClick(picture) {
      this.pickedPicture = picture;
    },
    saveButton() {
      this.node.avatar = this.pickedPicture.avatar;
      this.$emit("refrech");
      this.menuVisible = false;
    },
    setPickedPicture(url, pictureName) {
      this.pickedPicture = { avatar: url, pictureName: pictureName };
    },
    loadMore() {
      this.addIcon();
    },
  },
};
</script>
<style scoped>
.img-border {
  border: 3px solid red;
}
.img-padding {
  padding: 3px;
}
</style>
