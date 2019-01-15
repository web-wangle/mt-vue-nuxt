<template>
  <div class="m-menu">
    <dl class="nav">
      <dt>全部分类</dt>
      <dd v-for="(item,index) in menu" :key="index">
        <i :class="item.type"></i>{{item.name}}<span class="arrow"></span>
      </dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      menu: [{
        type: 'food',
        title: '美食'
      },{
        type: 'takeout',
        title: '外卖'
      }]
    };
  },
};
</script>

<style scoped>
</style>
