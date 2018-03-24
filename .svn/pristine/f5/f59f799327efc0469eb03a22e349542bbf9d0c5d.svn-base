<template>
  <div class="clientList_page">
    <mt-header title="客户列表" fixed>
      <div slot="left">
        <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
      </div>
    </mt-header>
  <mt-index-list>
    <mt-index-section :index="item" v-for="(item,index) in indexList">
      <div class="mt_cell_div"  @click="retCom(com)"  v-if="com.ComFullNamePYM.charAt(0).toUpperCase() == item " v-for="(com,index) in company">
        <span>{{com.ComFullName}}</span>
      </div>
    </mt-index-section>
  </mt-index-list>
  </div>
  
</template>
<script type="text/javascript">
import { mapState, mapActions } from 'vuex'
import { IndexList, IndexSection, Cell, Header, Button } from 'mint-ui'
export default {
  components: {
    'mt-index-list': IndexList,
    'mt-index-section': IndexSection,
    'mt-cell': Cell,
    'mt-header': Header,
    'mt-button': Button

  },
  computed: {
    retPage() {
      return this.$route.params.retPage
    }
  },
  data() {
    return {
      indexList: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
      company: []
    }
  },
  methods: {
    ...mapActions([ 'popupSelect' ]),
    retCom(com) {
      if(this.retPage != undefined && this.retPage.length > 0){
        this.$router.push({name: this.retPage, params: {company: com}})
      }
    },
    clientList() {
      let cond = {
              selectName: 'model_clientList',
              extraParam: {
                pageSize: 1000
              }
      }
      this.popupSelect(cond).then((obj) => {
        console.log(obj)
        if(obj != undefined && obj.length > 0){
          this.company = obj
        }

      })

    }
  },
  created() {
    this.clientList()
  },
  mounted() {
    
  }

}
  
</script>
<style lang="scss">
.clientList_page{
  .mint-indexlist-navitem {
    font-size: 15px;
  }
}
</style>
<style lang="scss" scoped>
  .clientList_page {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    .mint-indexlist {
      position: fixed;
      top: 40px;
      .mt_cell_div {
        min-height: 20px;
        width: 100%;
        padding: 12px;
      }
    }
  }
</style>
