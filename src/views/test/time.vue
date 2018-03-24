<template>
<div class="stockReport">
  <h1>库存查询</h1>
  <button @click="query()">查询</button>
</div>
  
</template>
<script type="text/javascript">
import { mapActions, mapGetters, mapState } from 'vuex'
export default {
      components: {
    },
    data :function() {
      return {

      }

    },
    computed: {

    },
    filters: {

    },
    watch: {

    },
    methods: {
      query() {
        console.log(123)
      },
      initParam() { //离开页面时初始化参数
       this.mobileGoodsFullName = ''
       this.StockCode = ''
      }
    },
    created () {

    },
    mounted () {

    },
    deactivated: function() { //离开页面时执行的方法
      console.log('deactivated')
      this.initParam() //离开页面时初始化查询查询条件

    },
    activated: function () { //进入页面时执行的方法
      console.log('activated')
      this.listData() //每次进入页面重新加载数据
    }
}

  
</script>
<style lang="scss" scoped="scoped">
  
</style>