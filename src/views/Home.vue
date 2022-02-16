<template>

  <div>
    <v-row>
      <v-col cols="3">
        <v-list> 
          <v-list-item
            v-for="item in items"
            :key="item.title"
          >
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-avatar>
              <v-menu offset-y :close-on-content-click=false>
                <template v-slot:activator="{ on, attrs }">
                   <v-img  
                      :src="item.avatar" 
                      v-bind="attrs"
                      v-on="on"
                      @click="imgClick(item)"
                    />
                </template>
                <v-card>
                  <v-card-title>Select Country</v-card-title>
                  <v-divider></v-divider>
                  <v-card-text style="height: 300px;">
                    <e-icon-picker v-model="icon" :options="options"/>
                  </v-card-text>
                </v-card>
             </v-menu>
            </v-list-item-avatar>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col cols="7">
        <v-textarea
        outlined
        name="input-7-4"
        label="输入表达式"
        v-model="textareaValue"
        height="300px"
        style="margin:10px"
      ></v-textarea>

      </v-col>
    </v-row>
    <v-img :src="graphUrl"
            width="800"
            contain
            style="margin-left: 400px"
    ></v-img>
  
  </div>
</template>

<script>

  export default {
    name: 'Home',
    data(){
      return {
        textareaValue: "",
          graphData: "",
          graphUrl: "",
          items: [],
          dialogm1: '',
          dialog: false,
          options: {FontAwesome: false, ElementUI: false, addIconList: [], removeIconList: []},
          icon: "",
          curLeftListItem: null,
          
    }
    }, 
    mounted() {
    },
    watch: {
      textareaValue: function(val) {
        this.axios({url:"/graph/parse", method: "POST", data: {data: val}}).then((res) => {
        this.graphData=res.data;
        if(res.status != 200) {
          return;
        }
        console.log(this.graphData.nodeList);
        this.axios({url:"/graph/getPng", method: "POST", data: this.graphData,  responseType: 'blob'}).then((res) => {
                const blob = new Blob([res.data], {type: 'img/png'});
                const url = window.URL.createObjectURL(blob);
                this.graphUrl = url;
                console.log(this.graphData.nodeList)
                this.items=this.graphData.nodeList.map(function(x){return {title: x.text, avatar: x.avatar}});
          });
       
  })}
    },
    methods: {
      saveButton() {
        this.curLeftListItem.avatar=this.icon;
        this.dialog=false;
      },
      imgClick(item) {
        this.curLeftListItem=item;
        this.options.removeIconList
        this.axios({url:"https://iconsapi.com/api/search?appkey=620271bee4b06f79691875ea&query="+item.id, method: "GET"}).then((res) => {
            this.options.addIconList = [];
            for(element in res.data.pages.elements) {
              this.options.addIconList.push(element.url);
            }
        });

      }
    },
    components: {},
  }
</script>

<style scoped>
  .my-custom-dialog {
    position: absolute;
    bottom: 50;
    right: 50;
    margin-left: 0px;
  }
</style>