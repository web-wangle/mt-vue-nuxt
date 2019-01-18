<template>
  <div class="m-menu">
    <dl class="nav" @mouseleave="mouseleave">
      <dt>全部分类</dt>
      <dd v-for="(item,index) in menu" :key="index" @mouseenter="mouseenter">
        <i :class="item.type"></i>{{item.name}}<span class="arrow"></span>
      </dd>
    </dl>
    <div class="detail" v-if="kind" @mouseenter="sover" @mouseleave="sout">
      <div v-for="(item,index) in curdetail.child" :key="index">
        <h4>{{item.title}}</h4>
        <span v-for="(x,idx) in item.child" :key="idx">{{x}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      kind: '',
      menu: [{
        type: 'food',
        name: '美食',
        child: [{
          title: '美食',
          child: ['代金券','甜点饮品','火锅','自助餐','小吃快餐']
        }]
      },{
        type: 'takeout',
        name: '外卖',
        child: [{
          title: '外卖',
          child: ['美团外卖']
        }]
      },{
        type: 'hotel',
        name: '酒店',
        child: [{
          title: '酒店星级',
          child: ['经济型','舒适/三星','高档/四星','豪华/五星']
        }]
      }]
    };
  },
  computed: {
    curdetail(){
      return this.menu.filter((item) => {
        return item.type === this.kind;
        })[0]
    }
  },
  methods: {
    mouseleave(){
      let self = this;
      self._timer = setTimeout(() => {
        this.kind = '';
      },150)
    },
    mouseenter(e){
      this.kind = e.target.querySelector('i').className;
    },
    sover(){
      clearTimeout(this._timer);
    },
    sout(){
      this.kind = '';
    }
  }
};
</script>

<style scoped>
</style>
