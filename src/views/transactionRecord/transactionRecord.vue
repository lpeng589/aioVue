<template>
	<div class="page_transactionRecord">
		<mt-header title="交易记录" fixed>
   		 	<div slot="left">
     			 <mt-button icon="back" @click="$router.push({name: 'index'})"></mt-button>
   			 </div>
   			 <div slot="right"  @click="openByType()">
				 <mt-button  >筛选</mt-button>
   			 </div>
  		</mt-header>	
        <!-- 搜索栏   start -->
 		<mt-search v-model="ChangeName" cancel-text="取消" placeholder="搜索"></mt-search>
	

  		<div class="total">
  		        
				<div class="total_top"><span>{{BillDate1 | formatDate}}</span><img @click="openByBillDate()" src="../../assets/time.png"></div>
				<div class="total_bottom">
					<div class="amount">支出 &nbsp;￥<span>{{totalexpenditure}}</span>&nbsp;&nbsp;|</div>
					<div class="amount">收入 &nbsp;￥<span>{{totalAmount}}</span>&nbsp;&nbsp;|</div>
					<div class="amount">余额 &nbsp;￥<span>{{balance}}</span></div>
				</div>
  		</div>
 
 	
		      <mt-loadmore :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
		        <ul class="page-loadmore-list">
		          <li v-for="(item,index) in dataLists" class="page-loadmore-listitem" @click="resetColor(index)">
		          	<div class="record">
						<div class="r1">
							<img v-if="item.BillTypeX == '销售收款单'" src="../../assets/r2.png" alt="">
							<img v-if="item.BillTypeX == '销售出库单'" src="../../assets/r6.png" alt="">
							<img v-if="item.BillTypeX == '运费'" src="../../assets/r1.png" alt="">
							<img v-if="item.BillTypeX == '预收转应收'" src="../../assets/r6.png" alt="">
						</div>
						<div class="r2">
							<div class="r2_1">{{item.BillTypeX}}</div>
							<div class="r2_2"><span>{{item.BillDate | formatDate}}</span></div>
						</div>
						<div class="r3">
						<span  v-if="item.BillTypeX == '预收转应收'" :class="{ 'col' : indexs === index }">{{item.PreReceive}}</span>
						<span  v-if="item.BillTypeX == '销售收款单'" :class="{ 'col' : indexs === index }">+{{item.PreReceive}}</span>
						<span  v-if="item.ReceiveTotalDebit != 0" :class="{ 'col' : indexs === index }">
						-{{item.ReceiveTotalDebit}}</span></div>
 			 		</div>
		          </li>
		        </ul>
		        <div slot="bottom" class="mint-loadmore-bottom">
		          <span v-show="bottomStatus == 'drop'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
		          <span v-show="bottomStatus == 'loading'">
		            <mt-spinner type="snake"></mt-spinner>
		          </span>
		        </div>
		      </mt-loadmore>

 		<div class="chooseStatus" v-show="BillTypeFlag" @click="closeQueryWindow()">
			<mt-radio
			  align="right"
			  v-model="BillType"
			  :options="statusOptions">
			</mt-radio>	
		</div>

		<div class="chooseBillDate" v-show="BillDateFlag">
			<div class="div periodTime">
				<label>&nbsp;&nbsp;日期</label>
				<input type="text" class="input1" v-model="ForMatBillDate1" @click="openPicker1()">
				<span class="span">至</span>
				<input type="text" class="input2" v-model="ForMatBillDate2" @click="openPicker2()">
			</div>
			<div class="radioDiv">
				<mt-radio
				  align="right"
				  v-model="quickDay"
				  :options="quickDayptions">
				</mt-radio>
			</div>
			<div class="div Button">
				<mt-button type="primary" @click="queryByBillDate()">确定</mt-button>
				<mt-button type="danger" @click="closeQueryWindow()">取消</mt-button>
			</div>
		</div>

		<mt-datetime-picker
			ref="picker1"
			v-model="BillDate1"
			type="date"
			:startDate="startDate"
			:endDate="endDate"
			year-format="{value} 年"
			month-format="{value} 月"
			date-format="{value} 日"
			>
			</mt-datetime-picker>	
			<mt-datetime-picker
			ref="picker2"
			v-model="BillDate2"
			type="date"
			:startDate="startDate"
			:endDate="endDate"
			year-format="{value} 年"
			month-format="{value} 月"
			date-format="{value} 日"
			>
		</mt-datetime-picker>
	</div>
</template>
<script type="text/javascript">
import { mapActions, mapState } from 'vuex'
import { Header, Button, Field, Indicator, Loadmore, Radio, Spinner, DatetimePicker, Navbar, Search } from 'mint-ui'
export default {
  components: {
    'mt-header': Header,
    'mt-button': Button,
    'mt-field': Field,
    'mt-radio': Radio,
    'mt-loadmore': Loadmore,
    'mt-spinner': Spinner,
    'mt-datetime-picker': DatetimePicker,
    'mt-navbar': Navbar,
    'mt-search': Search
  },
  data () {
    return {
      list: [],
      lists: [],
      dataLists: [],
      indexs: -1,
      pageSize: 10,
      pageNo: 1,
      reportNumber: 'Report_Cln',
      BillType: '',
      // 下拉
      wrapperHeight: 0,
      allLoaded: false,
      bottomStatus: '',
      // 单据类型
      BillTypeFlag: false,
      statusOptions: [
        {label: '收款单', value: 'tblSaleReceive'},
        {label: '销售出库', value: 'tblSalesOutStock'},
        {label: '运费', value: 'tblSalesOutStockYF'},
        {label: '预收转应收', value: 'tblTransferSale1'},
        {label: '全部',value: ''}
      ],
      // 单据日期
		BillDateFlag: false,
		BillDate1: '',
		BillDate2: new Date(),
		startDate: new Date('2010-01-01'),
		endDate: new Date(),
		quickDay: '', 
		quickDayptions: [
			{	label: '今天',
			value: new Date().toString()},
			{	label: '本周',
			value: new Date(new Date()-(new Date().getDay()-1)*86400000).toString()},
			{	label: '本月',
			value: new Date(new Date().getFullYear(),new Date().getMonth(),1).toString()},
			{	label: '全部',
			value: '2010-01-01'}
		],
      // 总额
      totalAmount: 0, //总收入
      totalexpenditure: 0, //总支出
      balance: 0, //余额
      // 弹出框
      selectName: 'CompanyCode',
      CompanyCode: '', //客户
      //搜索条件
      ChangeName: ''
    }
  },
  computed: {
    ...mapState({
        name: state => state.user.name,
        id: state => state.user.id,
        department: state => state.user.departmentName
      }),
    ForMatBillDate1: function(){
      let date = new Date(this.BillDate1)
      var y = date.getFullYear();  
      var m = date.getMonth() + 1;  
      m = m < 10 ? '0' + m : m;  
      var d = date.getDate();  
      d = d < 10 ? ('0' + d) : d;  
      return y + '-' + m + '-' + d; 
	},
	ForMatBillDate2: function(){
      let date = new Date(this.BillDate2)
      var y = date.getFullYear();  
      var m = date.getMonth() + 1;  
      m = m < 10 ? '0' + m : m;  
      var d = date.getDate();  
      d = d < 10 ? ('0' + d) : d;  
      return y + '-' + m + '-' + d; 
	}
  },

  watch: {
    BillType: function (newVal) {
      this.BillType = newVal
      this.allLoaded = false
      this.listData()
    },
    ChangeName: function (newVal) {
    	this.ChangeName = newVal
    	this.allLoaded = false
    	this.listData()
    },
    quickDay: function(newVal) {
  		this.BillDate1 = newVal
  		this.BillDate2 = new Date();
	}
  },
  filters: {
    formatDate (val) {
      let date = new Date(val)
      return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
    },
  },
  methods: {
    ...mapActions(['reportQuery','popupSelect']),
    listData: function () {
      Indicator.open({text: '加载中...', spinnerType: 'snake'})
      this.pageNo = 1
      this.dataLists = []
      let cond = {
        reportNumber: this.reportNumber,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        extraParam: {
          userId: this.id,
          startDate: this.ForMatBillDate1,
          endDate: this.ForMatBillDate2,
          BillType: this.BillType,
          // BillNo: '',
         // startDate: this.BillDate
          ComFullName: this.ChangeName
        }
      }
      var self = this
      this.reportQuery(cond).then((obj) => {
      	//console.log(obj)
        let list = obj.rows
        self.totalAmount = 0
        self.totalexpenditure  = 0
      	if(list.length > 0) {
          list.forEach(function(val,key) {
	            self.dataLists.push(val)
	            if(val.PreReceive != 0 ) {
	        	  self.totalAmount = self.totalAmount + Number(val.PreReceive.replace(/,/g,''))
	        	}
	        	if(val.ReceiveTotalDebit != 0 ) {
	        	  self.totalexpenditure = self.totalexpenditure + Number(val.ReceiveTotalDebit.replace(/,/g,''))
	            }
	            self.balance = val.TotalReceive
        	})
            self.totalAmount = self.totalAmount.toFixed(2)
            self.totalexpenditure = self.totalexpenditure.toFixed(2)
      	}
        Indicator.close()
        this.pageNo = 2
        console.log(list)
      }).catch(({message}) => {
        	Indicator.close()
        	Toast({message: message, duration: 2000})
      })
    },
   /* listCompany: function () {
	    let cond = {
		      selectName: this.selectName,
		      extraParam: {
		      	userId: this.id
		      }
	    }
	    console.log('------' + this.id)
	    console.log('------' + this.name)
	    var self = this
	    this.popupSelect(cond).then((obj) => {
	    	if(obj.length > 0 ) {
	    		obj.forEach(function(val,key) {
	    			if (key < obj.length - 1) {
	     			  self.CompanyCode = self.CompanyCode + val.ClassCode + ';' + '0' + '|'   				
	    			}else {
	    			  self.CompanyCode = self.CompanyCode + val.ClassCode + ';' + '0'
	    			}
	    		})
	    	}
	    })	
    }, */
    openByType: function () {
      this.BillTypeFlag = !this.BillTypeFlag
      //console.log(this.BillTypeFlag)
    },
    closeQueryWindow: function () {
      this.BillDateFlag = false
      this.BillTypeFlag = false
    },
    openPicker1() {
	  this.$refs.picker1.open();
	},
	openPicker2() {
	  this.$refs.picker2.open();
	},
    openByBillDate: function () {
      this.BillDateFlag = true
    },
    handleBottomChange: function (status) {
      this.bottomStatus = status

    },
    queryByBillDate() {
	  this.listData()
	  this.BillDateFlag = false
	},
    loadBottom: function () {

      if (this.pageNo == 1) {
        Indicator.open({text: '加载中...', spinnerType: 'snake'})
      }
      //console.log(this.wrapperHeight)

      setTimeout(() => {
        let cond = {
        	reportNumber: this.reportNumber,
        	pageNo: this.pageNo,
        	pageSize: this.pageSize,
        	extraParam: {
        		userId: this.id,
        		startDate: this.ForMatBillDate1,
        		endDate: this.ForMatBillDate2,
        		BillType: this.BillType,
        		ComFullName: this.ChangeName
        	}
        }
        var self = this;
        this.reportQuery(cond).then((obj) => {
        	let list = obj.rows;
        	console.log(list)
        	if (list.length > 0) {
        		list.forEach(function(val,key) {
        			self.dataLists.push(val)
        			if(val.PreReceive != 0 ) {
        			  self.totalAmount = Number(self.totalAmount) + Number(val.PreReceive.replace(/,/g,''))
        		    }
        		    if(val.ReceiveTotalDebit != 0 ) {
        			  self.totalexpenditure = Number(self.totalexpenditure) + Number(val.ReceiveTotalDebit.replace(/,/g,''))
        		    }
        		    self.balance = val.TotalReceive
        		})
	            self.totalAmount = parseFloat(self.totalAmount.toFixed(2))
	            self.totalexpenditure = parseFloat(self.totalexpenditure.toFixed(2))
        	} else {
        		this.allLoaded = true
        	}
        	Indicator.close()
        	this.pageNo += 1
        	self.$refs.loadmore.onBottomLoaded()
        })
      }, 1500)
      //console.log(this.allLoaded)
    },
    resetColor: function (index) {
      this.indexs = index
    }
  },
  created () {
    // this.listCompany()
    this.loadBottom();
  },
  mounted () {

  }
}
</script>
<style lang="scss">
    .page_transactionRecord{
    	height:100%;
    	width:100%;
    	overflow:hidden;
    	.mint-header{
	      background-color:#fff;
	      color:#333;
	      border-bottom:1px #dedede solid;
	    }
    	.chooseStatus {
			position: fixed;
			top: 40px;
			left: 0px;
			height: 100%;
			width: 100%;
			background-color: rgba(7,17,27,0.8);
			z-index: 2000;
			.mint-radiolist-title{
	    		margin: 0px;
	    	}
	    	.mint-cell {
	    		border-bottom: 1px solid #888;
	    	}
    	}
	    .total{
	    	background-color:#F6F6F6;
	    	width:auto;
	    	border-bottom: 2px solid  gainsboro;
	    	font-family:"Trebuchet MS", Arial, Helvetica, sans-serif;
	    	.total_top{		
	    		padding-top:10px;
	    		margin-left:10px;
	    		font-size:15px;
	    		font-weight:bold;
	    		img{
	    			display:inline-block;
	    			position:absolute;
	    			right:15px;
	    			width:20px;
	    			height:20px;
	    		}
	    	}
	    	.total_bottom{
	    		width:100%;
	    		overflow:hidden;
	    		margin-top:10px;
	    		margin-left:0px;
	    		font-size:15px;

	    		.amount{
					float:left;
					margin-left:10px;
					margin-bottom:5px;
					color:#808080;
					font-size:13px;
					span{
						font-family:Arial,Helvetica,sans-serif;font-size:1em;vertical-align:middle;font-weight:normal
					}
	    		}
	    	}
	    }
	    .chooseBillDate {
	    	position: fixed;
			top: 40px;
			left: 0px;
			height: 100%;
			width: 100%;
			background-color: rgba(7,17,27,0.8);
			z-index: 2000;
			.mint-radiolist-title{
	    		margin: 0px;
	    	}
			.periodTime{
				background-color: white;
				font-size:14px;
				line-height:30px;
				label{
					margin-left:10px;
				}
				.span{
					position:absolute;
					left:50%;
				}
				input{
					height:30px;
					border:none;
	                width:30%;
					text-align:center;
				}
				.input1{
					position:absolute;
					left:15%;
				}
				.input2{
					position:absolute;
					right:8%;
				}
			}
			.Button{
				height:50px;
				text-align: center;
				line-height:50px;
				background: white;
				.mint-button{
					margin-right:20px;
					margin-left:20px;
				}
			}
	    }
	    .mint-loadmore{
	    	width: 100%;
	    	height:88%;
	    	overflow:auto;
	    	.mint-loadmore-content {
			    margin-top: 17px;
			}
    		li{
	    		height:70px;
		    	background-color:#fff;
				color:#333;
				border-bottom:1px #dedede solid;
				margin-bottom: 20px;
		    	.record{
		    		height:100%;
		    		margin-left:10px;
		    		margin-right:10px;
					margin-top:-20px;
				    .r1{
				    	height:40px;
				    	width:40px;
				    	float:left;
				    	margin-left:15px;
				    	margin-top:15px;
				    	img{
				    		height:100%;
				    		width:100%;
				    	}
				    }
				    .r2{
				    	margin-left:15px;
				    	float:left;
				    	margin-top:15px;
				    	font-family:"Trebuchet MS", Arial, Helvetica, sans-serif;
				    	span{
				    		font-size:15px;
				    		color: lightslategrey;
				    	}
				    	.r2_1{
				    		font-weight:bold;
				    	}
				    }
				    .r3{
				    	position:fixed;
						margin-top:26px;			    	
				    	right:20px;
				    	font-size:12px;
				    	color: lightslategrey;
				    	.col{
				    		color:#FF9933;
				    	}
				    }
	    		}
		    	}
	    	
	    	.mint-loadmore-bottom {
	    		margin-bottom: 5px;
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
	    .mint-search {
	    	width: 100%;
	    	height: 42px;
	    	margin-top:40px;
	    	.mint-searchbar{
	    		background-color: #FFFFFF;
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
    }
</style>