<template>
  <v-menu
    v-model="menuVisible"
    :close-on-content-click="false"
    max-width="230px"
    max-height="300px"
    offset-x
  >  
    <template v-slot:activator="{ on, attrs,}">
        <slot name="menuActivator" :on="on" :attrs="attrs"> </slot>
    </template>
    <v-card>
        <v-text-field
            v-model="searchPictureName"
            label="Search"
            clearable
        ></v-text-field>
        <v-list class="overflow-y-auto" height="180px">
            <v-row dense>
            <v-col
                v-for="picture in this.pictures"
                :key="picture.name"
                cols="3"
            >
                <v-img 
                  height="25px"
                  contain
                  :src="picture.avatar"
                  class="img-padding" 
                  :class="{'img-border': pickedPicture.avatar == picture.avatar}"
                  @click=iconClick(picture)>
              
                </v-img>
            </v-col>
            <v-col 
              class="d-flex justify-center mb-10"
            >
              <v-btn height="28px" @click="loadMore" :disabled="loadMoreBtnDisabled">
                {{loadMoreBtnText}}
              </v-btn>   
            </v-col>
            </v-row>
        </v-list>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="menuVisible=false"> Cancel </v-btn>
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
      searchPictureName: function(x) {
          this.node.searchPictureName=this.searchPictureName;
          this.destoryIcon();
          this.$emit("search");
          this.loadMoreBtnDisabled=false;
      },
  },
  data() {
    return {
      pictures: [],
      menuVisible: false,
      pickedPicture: null,
      searchPictureName: null,
      curPage:1,
      totalPage:1,
      loadMoreBtnText: "再来点"
    };
  },
  methods: {
    async addIcon() {
      var delay = 500;
      this.captchaInputLastTime = new Date().valueOf();
      await new Promise((resolve) => setTimeout(resolve, delay));
      var nowTime = new Date().valueOf();
      var gap = nowTime - this.captchaInputLastTime;
      if (gap < delay || this.curPage > this.totalPage) {
        return;
      }
      this.axios({
        url:
          "https://iconsapi.com/api/search?appkey=620271bee4b06f79691875ea&page="+ this.curPage +"&query=" +
          this.searchPictureName,
        method: "GET",
      }).then((res) => {
        this.totalPage=res.data.pages.pageCount;
        res.data.pages.elements.forEach((element) => {
          this.pictures.push({avatar: element.url, pictureName: element.iconName});
        });
        this.curPage += 1;
        
        });
      
      
    },

    destoryIcon() {
        this.pictures = [];
    },

    iconClick(picture) {
        this.pickedPicture=picture;
    },
    saveButton() {
      this.node.avatar=this.pickedPicture.avatar;
      this.$emit("refrech");
      this.menuVisible=false;
    },
    setPickedPicture(url, pictureName) {
      this.pickedPicture={avatar: url, pictureName: pictureName};
    },
    loadMore() {
      this.addIcon();
    }
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
