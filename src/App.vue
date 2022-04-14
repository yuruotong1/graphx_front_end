<template>
  <v-app>
    <v-main>
      <keep-alive>
       <router-view v-if='$route.meta.keepAlive'/>
      </keep-alive>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>
<style>  

/* 隐藏滚动条 */
::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
}
                                           
</style>