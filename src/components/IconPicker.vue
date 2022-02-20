<template>
  <v-menu
    v-model="menuVisible"
    :close-on-content-click="false"
    max-width="230px"
    max-height="200px"
    offset-x
  >
    <template v-slot:activator="{ on, attrs,}">
        <slot name="menuActivator" :on="on" :attrs="attrs"> </slot>
    </template>
    <v-card>
        <v-list>
            <v-row dense class="flex">
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
      // 清除 icon
      menuVisible: function(x) {
          if (!x) {
              this.pictures=[];
          }
      }

  },
  data() {
    return {
      pictures: [],
      menuVisible: false,
      pickedPicture: null,
    };
  },
  methods: {
    addIcon(url, pictureName) {
      this.pictures.push({avatar: url, pictureName: pictureName});
    },

    destoryIcon() {
        this.pictures = [];
    },

    iconClick(picture) {
        this.pickedPicture=picture;
    },
    saveButton() {
        this.node.avatar=this.pickedPicture.avatar;
        this.$emit("saveButton");
        console.log(this.node);
        this.menuVisible=false;
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
