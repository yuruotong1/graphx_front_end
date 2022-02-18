<template>

  <div>
    <v-row>
      <v-col cols="3">
        <v-list> 
          <v-list-item
            v-for="nodeItem in items"
            :key="nodeItem.title"
          >
            <v-list-item-content>
              <v-list-item-title v-text="nodeItem.title"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-avatar>
              <v-menu offset-y :close-on-content-click=false :close-on-click=false v-model="menuInfo[nodeItem.id]">
                <template v-slot:activator="{ on, attrs }">
                   <v-img  
                      :src="nodeItem.avatar" 
                      v-bind="attrs"
                      v-on="on"
                      @click="imgClick(nodeItem)"
                    />
                </template>
                <v-card>
                  <v-card-title>选择图标</v-card-title>
                  <v-divider></v-divider>
                  <v-card-text style="height: 300px;">
                    <e-icon-picker ref="iconPicker"  v-model="pickeredIconInfo[nodeItem.id]" :options="options"/>
                  </v-card-text>
                   <v-divider></v-divider>
                    <v-card-actions>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="menuInfo[nodeItem.id]=false"
                      >
                        Close
                      </v-btn>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="saveButton"
                      >
                        Save
                      </v-btn>
                    </v-card-actions>
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
        graphData: {
          nodeList: [],
          edgeList: []},
        graphUrl: "",
        items: [],
        menuInfo: {},
        options: {FontAwesome: false, ElementUI: false, addIconList: [], removeIconList: []},
        pickeredIconInfo: {},
        curLeftListItem: null,
    }
    }, 
    mounted() {

    },
    watch: {
      textareaValue: function(val) {
        console.log(this.graphData)
        this.axios({url:"/graph/parse", method: "POST", data: {rawData: val, graphData: this.graphData}}).then((res) => {
        this.graphData=res.data;
        if(res.status != 200) {
          return;
        }
        this.axios({url:"/graph/getPng", method: "POST", data: this.graphData,  responseType: 'blob'}).then((res) => {
                const blob = new Blob([res.data], {type: 'img/png'});
                const url = window.URL.createObjectURL(blob);
                this.graphUrl = url;
                this.items=this.graphData.nodeList.map(function(x){return {id: x.id, title: x.text, avatar: x.avatar}});
                this.items.forEach(item=>{
                  this.$set(this.menuInfo, item.id, false);
                })   
                this.items.forEach(item=>{
                  this.$set(this.pickeredIconInfo, item.id, "");
                })
                });
       
  })}
    },
    methods: {
      saveButton() {
        this.curLeftListItem.avatar=this.pickeredIconInfo[this.curLeftListItem.id];
        this.menuInfo[this.curLeftListItem.id]=false;
        this.options.addIconList=[];
      },
      imgClick(item) {
        this.curLeftListItem=item;
        this.axios({url:"https://iconsapi.com/api/search?appkey=620271bee4b06f79691875ea&query="+item.id, method: "GET"}).then((res) => {
            res.data.pages.elements.forEach(element=>{
              this.options.addIconList.push(element.url);
            });
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