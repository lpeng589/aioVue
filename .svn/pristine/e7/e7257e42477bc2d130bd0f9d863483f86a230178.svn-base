<template>
	<div class="page_goodList">
		<mt-header title="选择仓库" fixed>
   		 	<div slot="left">
     			 <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
   			 </div>
         <div slot="right"  @click="retGoodCodes()">
           <mt-button>
            确定      
           </mt-button>
         </div>
  		</mt-header>
  		<mt-search v-model="GoodsFullName" cancel-text="取消" placeholder="搜索"></mt-search>
      <div class="goodList page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
          <mt-radio v-model="values" :options="options"></mt-radio>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomStatus == 'drop'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
            <span v-show="bottomStatus == 'loading'">
              <mt-spinner type="snake"></mt-spinner>
            </span>
        </div>
        </mt-loadmore>
  		</div>
		
	</div>
</template>
<script type="text/javascript">
import { mapActions } from 'vuex'
import { Header, Button, Search, Checklist, Loadmore, Indicator, Spinner, Radio} from 'mint-ui'

export default {
  components: {
    'mt-header': Header,
    'mt-button': Button,  
    'mt-search': Search,
    'mt-checklist': Checklist,
    'mt-loadmore': Loadmore,
    'mt-spinner': Spinner,
    'mt-radio': Radio
  },
  data () {
    return {
      // 查询条件
      pageNo: 1,
      pageSize: 15,
      selectName: 'model_tblstock',  //'model_saleGoodList',BuyQuoteForOrder, GoodsSalesForDet
      GoodsFullName: '',
      StockFullName: '',
      
      // checkbox 选项值
      values: '',
      options: [],
      // 下拉状态值
      allLoaded: false,
      bottomStatus: '',
      wrapperHeight: 0,
      goodCodeStr: '',
      stockCodeStr:''
    }
  },
  watch: {
    GoodsFullName() {
      this.allLoaded = false
      this.goodCodeStr = ''
      this.options = []
      this.pageNo = 1
      this.goodList()
    },
    retPage() {
      this.values = ''
    }
  },
  computed: {
    retPage() {
      return this.$route.params.retPage
    },
    index1 (){
      return this.$route.params.index1
    },
  },
  methods: {
    ...mapActions(['popupSelect']),
    goodList() {
      Indicator.open({text: '加载中...', spinnerType: 'snake'})
      setTimeout(() => {
        let cond = {
          selectName: this.selectName,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          extraParam: {
            //GoodsFullName: this.GoodsFullName
          }
        }
   
        var self = this;
        this.popupSelect(cond).then((obj) => {
             //console.log(cond)
             //console.log(obj)
             if (obj.length > 0) {
                 obj.forEach(function(val,index){
                  if(self.goodCodeStr.indexOf(val.GoodsCode) == -1) {
                    let arr = { label: val.StockNumber+'/ '+val.StockFullName+'/ '+val.StockFullNamePYM, 
                                value: val.classCode, goodsfullname}
                    self.options.push(arr)
                  }
                  self.stockCodeStr += val.classCode+','
                })
                self.pageNo += 1 // 累计页码
              } else {
                this.allLoaded = true;
              }
              Indicator.close()
              self.$refs.loadmore.onBottomLoaded();
        }).catch(error => {
          Indicator.close()
          console.log(error)
        })
      }, 1500);

    },
    retGoodCodes() {
      this.$router.push({
          //name: this.retPage,
          name: 'salesOrderAdd',
          params: {
            classCode :this.values,
            index1 :this.index1
          }
      })
              //console.log(1234)
              console.log(this.values)
    },
    handleBottomChange(status) {
          this.bottomStatus = status;
    },
    loadBottom() {
      console.log(this.index1)
      if(this.pageNo == 1){
        Indicator.open({text: '加载中...', spinnerType: 'snake'})
      }
      setTimeout(() => {
        let cond = {
          selectName: this.selectName,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          extraParam: {
            //GoodsFullName: this.GoodsFullName
          }
        }
   
        var self = this;
        this.popupSelect(cond).then((obj) => {
             //console.log(obj)
             if (obj.length > 0) {
                 obj.forEach(function(val,index){
                  if(self.goodCodeStr.indexOf(val.GoodsCode) == -1) {
                    let arr = { label: val.StockNumber+'/ '+val.StockFullName+'/ '+val.StockFullNamePYM,        //00001/总仓/zc
                                value: val.classCode+'/'+val.StockFullName,                                     //00001/总仓
                                value2: val.StockFullName }                                                     //总仓
                    self.options.push(arr)
                  }
                  self.stockCodeStr += val.classCode+','
                  //console.log(val.GoodsCode)
                })
                self.pageNo += 1 // 累计页码
              } else {
                this.allLoaded = true;
              }
              Indicator.close()
              self.$refs.loadmore.onBottomLoaded();
               //console.log(12345)
               console.log(self.options)
        })
      }, 1500);

    }
  },
  created() {
   // this.goodList()
   this.stockCodeStr = ''
  },
  mounted() {
    this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
  }
}
</script>
<style lang="scss" >
.page_goodList {
 	.mint-search {
		position: fixed;
   		top: 40px;
    	width: 100%;
    	height: 50px;
    	.mint-searchbar{
    		background-color: #ffffff;
    	}
    	.mint-searchbar-inner {
    		height: 18px;
    		background-color: #f0f1f5;
    		border-radius: 5px;
    		.mintui-search {
    			color: #333;
    		}
    		.mint-searchbar-core {
    			background-color: #f0f1f5;
    			text-align: center;
    		}
    	}
	} 
 	.goodList {
		position: fixed;
	  top: 82px;
	  width: 100%;
	  font-size: 15px;
    height: 100%;
    overflow-y: auto;
    .mint-radio {
      height: 100%;
      .mint-cell {
        min-height: 59px;
        border-bottom: 1px solid #888;
        .mint-cell-wrapper {
          background-image: none;
          .mint-checkbox-label {
            display: inline-block;
            width: 85%;
          }
        }
      }
    }
    .mint-loadmore-bottom {
      span {
        display: inline-block;
        transition: .2s linear;
        vertical-align: middle;
        .is-rotate {
          transform: rotate(180deg);
        }
      }
    }
	} 
}
</style>