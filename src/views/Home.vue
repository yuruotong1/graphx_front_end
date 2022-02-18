<template>

  <div>
    <v-row>
      <v-col cols="3">
        <v-list> 
          <v-list-item
            v-for="node in graphData.nodeList"
            :key="node.text"
          >
            <v-list-item-content>
              <v-list-item-title v-text="node.text"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-avatar>
              <v-menu offset-y :close-on-content-click=false :close-on-click=false v-model="menuInfo[node.id]">
                <template v-slot:activator="{ on, attrs }">
                   <v-img  
                      :src="node.avatar" 
                      v-bind="attrs"
                      v-on="on"
                      @click="imgClick(node)"
                    />
                </template>
                <v-card>
                  <v-card-title>选择图标</v-card-title>
                  <v-divider></v-divider>
                  <v-card-text style="height: 300px;">
                    <e-icon-picker ref="iconPicker"  v-model="pickeredIconInfo[node.id]" :options="options"/>
                  </v-card-text>
                   <v-divider></v-divider>
                    <v-card-actions>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="menuInfo[node.id]=false"
                      >
                        Close
                      </v-btn>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="saveButton(node)"
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
        menuInfo: {},
        options: {FontAwesome: false, ElementUI: false, addIconList: [], removeIconList: []},
        pickeredIconInfo: {},
    }
    }, 
    mounted() {

    },
    watch: {

      textareaValue: function(val) {
        this.refreshData();
       }
    },
    methods: {
      saveButton(node) {
        node.avatar=this.pickeredIconInfo[node.id];
        console.log("cur", node)
        this.menuInfo[node.id]=false;
        this.options.addIconList=[];
        
        this.refreshData();

      },
      imgClick(node) {
        this.axios({url:"https://iconsapi.com/api/search?appkey=620271bee4b06f79691875ea&query="+node.text, method: "GET"}).then((res) => {
            res.data.pages.elements.forEach(element=>{
              this.options.addIconList.push(element.url);
            });
        });

      },
      refreshData() {
        console.log(this.graphData)
        this.axios({url:"/graph/parse", method: "POST", data: {"rawData": this.textareaValue, "jsonData": this.graphData}}).then((res) => {
        if(res.status != 200 || res.data.success == false) {
          return;
        }
        this.graphData=res.data.graphData;
        this.graphData.nodeList.forEach(node=>{
          this.$set(this.menuInfo, node.id, false);
        })   
        this.graphData.nodeList.forEach(node=>{
          this.$set(this.pickeredIconInfo, node.id, "");
        })
        this.axios({url:"/graph/getPng", method: "POST", data: this.graphData,  responseType: 'blob'}).then((res) => {
                const blob = new Blob([res.data], {type: 'img/png'});
                const url = window.URL.createObjectURL(blob);
                this.graphUrl = url;
                });
       
  })
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