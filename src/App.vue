<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
  }
}
</script>

<style>
#app,body,
router-view {
  margin: 0;
  padding: 0;
}
#app,html,body{
  width: 100%;
  height: 100%;
}
</style>
