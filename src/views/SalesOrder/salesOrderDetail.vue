<template>
	<div class="page_salesOrderDetail">
		<mt-header title="销售订单详情" fixed>
   		 	<div slot="left">
     			 <mt-button icon="back" @click="retSalesOrderListPage()">返回</mt-button>
   			 </div>
   			 <div slot="right" v-show="!updateOrderFlag && workFlowNodeName != 'finish'" @click="updateOrder()">
				<mt-button>
					修改			
				</mt-button>
			</div>
			<div slot="right" v-show="updateOrderFlag" @click="saveOrder()">
				<mt-button>
					保存			
				</mt-button>
			</div>
  		</mt-header>
  		<div class="order_from">
		  <div class="createInfo">
		    <img src="../../assets/man.png" alt="">
		    <div class="creater">
		      <p class="createName">{{ name }}</p>
		      <p class="flowNodeName">{{ workFlowStatus }}</p>
		    </div>
		  </div>
		  <mt-navbar v-model="selected">
		    <mt-tab-item id="1">订单信息</mt-tab-item>
		    <mt-tab-item id="2">商品明细</mt-tab-item>
		  </mt-navbar>
		  <mt-tab-container v-model="selected">
			  <mt-tab-container-item id="1" class="tblOrder">
			    <mt-field  label="订单编号" placeholder="请输入编号" v-model="BillNo" readonly="true"></mt-field>
			    <mt-field  label="订单日期" placeholder="请输入日期" v-model="BillDate" readonly="true"></mt-field>
			    <mt-field  label="客户名称" placeholder="请输入客户" v-model="ComFullName" readonly="true"></mt-field>
			    <mt-field  label="经手人" placeholder="请输入经手人" v-model="createByName" readonly="true"></mt-field>
			    <mt-field  label="订单金额" placeholder="请输入金额" v-model="TotalTaxAmount" readonly="true"></mt-field>
			  	<mt-field  label="备注" placeholder="请输入备注" type="textarea" rows="4" v-model="Remark" :readonly="!updateOrderFlag"></mt-field>
			  </mt-tab-container-item>

			   <mt-tab-container-item id="2" class="tblOrderDet">
			   
			  	<div class="good_item" v-for="(item,index) in TABLENAME_tblSalesOrderDet">
			  		<div class="goodNum">
			  			<p>产品{{ index + 1 }}</p>
			  			<span class="fr" @click="delDet(index,item)">删除</span>
			  		</div>
			  		<ul>
			  			<li class="goodName">
			  				<div>
			  				  <span>{{ item.GoodsNumber }}</span>
			  				  <span>{{ item.GoodsFullName }}</span>
			  				</div>
			  				<p>{{ item.GoodsSpec }}</p>
			  				<span class="fr">{{ item.Price }}</span>
			  			</li>
			  			<li class="goodCount">
			  				<label>数量</label>
			  				<div>
			  					<span class="fl" @click="addQty(item)">+</span>
			  					<input type="number" :readOnly="updateOrderFlag" v-model="item.Qty"  ref="goodQty" >
			  					<span class="fr" @click="delQty(item)">-</span>
			  				</div>
			  			</li>

			  			<li class="goodTotle"><label>小计</label><span>{{ item.Amount }}</span></li>
			  		</ul>
			  	</div>
			  	<div class="addGood" v-show="updateOrderFlag"  @click="$router.push({name: 'goodList',params: {retPage: 'salesOrderDetail'}})">
			  		<img src="../../assets/goto.png">
			  	</div>		  
			  </mt-tab-container-item>
		  </mt-tab-container>
  		</div>
	</div>
</template>
<script type="text/javascript">
import { mapActions, mapState } from 'vuex'
import Vue from 'vue'
import { Header, Button, Navbar, TabItem, TabContainer, TabContainerItem, Cell, Field, Indicator, Toast, MessageBox } from 'mint-ui'
export default {
  components: {
    'mt-header': Header,
    'mt-button': Button,
    'mt-navbar': Navbar,
    'mt-tab-item': TabItem,
    'mt-tab-container': TabContainer,
    'mt-tab-container-item': TabContainerItem,
    'mt-cell': Cell,
    'mt-field': Field
  },
  computed: {
  	newKeyId() {
  		return  this.$route.params.keyId
  	},
  	workFlowStatus() {
  		return  this.$route.params.workFlowStatus
  	},
	...mapState({
		userID: state => state.user.id,
		name: state => state.user.name,
		titleId: state => state.user.titleId,
		department: state => state.user.departmentName
	}),
	tableName () {
      return 'tblSalesOrder' // 订货申请表
    },
    queryGoodByCode_Alert () { // 根据 code 查商品弹窗
    	return 'model_queryGoodByCode' 
    },
    getClientInfo_Alert() { // 根据 EmployeeID 获取客户信息
    	return 'model_getClientInfo'
    },
    goodCodes (){ 
    	return this.$route.params.goodCodes
    },
    optType() {
    	return this.$route.params.optType
  	}
  },
  data () {
    return {
      selected: '1',
      username: '',
      email: '',
      DetGoodsCodeStr: '',
      NewDetGoodsCodeStr: '',
      clientLevel: 'level', //获取客户级别,根据级别获取对应的商品价格
      // pageNo: 1,
      // pageSize: 10,
      updateOrderFlag: false,
     // saveOrderFlag: false,
      tableName: 'tblSalesOrder',
      //主表信息
      keyId: '',
      BillNo: '',
      BillDate: '',
      ComFullName: '',
      EmployeeID: '',
      TotalAmount: 0,
      TotalTaxAmount: 0,
      ShippingAddress: '',
      createByName: '',
      District: '',
      CompanyCode: '',
      Remark: '',
      //明细表信息
      TABLENAME_tblSalesOrderDet: [],
      opType: 'update',
      workFlowNodeName: ''

    }
  },
  watch: {
  	$route() {
  		this.initSaleOrderDet()
  	},
  	optType(newVal) {
  		if(newVal == 'intoDetail'){
  			this.feachData()
  		}
  	},
  	newKeyId(newVal,oldVal) {
  		if(newVal != undefined){
  			this.keyId = newVal
  		}else{
  			this.keyId = oldVal
  		}
  		//console.log(this.keyId)
  	}
  },
  methods: {
  	...mapActions(['detail', 'popupSelect', 'update', 'getSessEmp']),
  	retSalesOrderListPage() {
  		this.updateOrderFlag = false
  		this.DetGoodsCodeStr = ''
  		this.TABLENAME_tblSalesOrderDet = []
  		//console.log('retSalesOrderListPage')
  	    this.$router.push({ name: 'salesOrderList', params: { opt: 'reload'} })

  	},
  	feachData () {
      Indicator.open({text: '数据拉取中...', spinnerType: 'snake'})
      this.keyId = this.newKeyId
      this.DetGoodsCodeStr = ''
  	  this.TABLENAME_tblSalesOrderDet = []
      let vm = this
      	// 明细表信息
        this.detail({tableName: this.tableName, keyId: this.keyId}).then(data => {
        	console.log('---------------------------')
        	console.log(data) 
        	this.workFlowNodeName = data.values.workFlowNodeName
        	console.log(this.workFlowNodeName)

      	let DetArr = data.values.TABLENAME_tblSalesOrderDet
      	DetArr.forEach((val,index) => {
  			val.GoodsNumber = val["tblGoods.GoodsNumber"]
  			val.GoodsFullName = val["tblGoods.GoodsFullName"]
  			val.GoodsSpec = val["tblGoods.GoodsSpec"]
  			val.SalesGoodsType = 1
	   
      		//console.log(val)
      		this.DetGoodsCodeStr += val.GoodsCode+','
      	})
      	this.TABLENAME_tblSalesOrderDet = DetArr

        // 主表信息
        this.BillNo = data.values.BillNo
        this.BillDate = data.values.BillDate
        this.ComFullName = data.values["tblCompany.ComFullName"]
        this.CompanyCode = data.values.CompanyCode
        this.createByName = data.values.createByName
        this.EmployeeID = data.values.EmployeeID
        this.TotalAmount = data.values.TotalAmount
        this.TotalTaxAmount = data.values.TotalTaxAmount
        this.ShippingAddress = data.values.ShippingAddress
        this.Remark = data.values.Remark
        this.TABLENAME_tblSalesOrderDet = data.values.TABLENAME_tblSalesOrderDet

      	this.getClientInfo() //获取客户信息
      	
        Indicator.close()
      }).catch(({message}) => {
        Indicator.close()
       // Toast({ message: "-10000", duration: 1000 })
      })
    },
    delDet(index,item) {
    	if(this.updateOrderFlag){
  			this.TotalAmount -= this.TABLENAME_tblSalesOrderDet[index].Amount
  			this.TotalTaxAmount -= this.TABLENAME_tblSalesOrderDet[index].Amount
  			this.TABLENAME_tblSalesOrderDet.splice(index,1)
  			if(item.GoodsCode != undefined){
  				this.DetGoodsCodeStr = this.DetGoodsCodeStr.replace(item.GoodsCode,'')
  			}
    	}
  	},
  	addQty(item) { // 增加商品数量
  		if(this.updateOrderFlag){
	  		let oldAmount = item.Amount
			item.Qty += 1
			item.Amount = item.Qty * item.Price
			item.TaxAmount = item.Amount
			this.TotalAmount += (item.Amount - oldAmount) 
			this.TotalTaxAmount += (item.Amount - oldAmount) 
		//	console.log(this.TotalAmount)
  		}

  	},
  	delQty(item) { // 减少商品数量
  		if(this.updateOrderFlag){
	  		let oldAmount = item.Amount
			item.Qty = item.Qty > 0 ? item.Qty- 1 : item.Qty
			item.Amount = item.Qty * item.Price
			item.TaxAmount = item.Qty * item.Price
			this.TotalAmount -= (oldAmount - item.Amount)
			this.TotalTaxAmount -= (oldAmount - item.Amount)
  		}

  	},
  	updateOrder() {
  		this.updateOrderFlag = true
  		//this.saveOrderFlag = true

  	},
  	saveOrder() {
  		MessageBox.confirm('确认保存?').then(action => {
  		this.updateOrderFlag = false
  		//this.saveOrderFlag = false
  		let values = this.$data
  		values.id = this.keyId
  		console.log(values)
  		values = window.JSON.stringify(values)
  		let postDate = { tableName: this.tableName, values }
  		//console.log(postDate)
	    this.update(postDate).then((obj) => {
	    	//console.log(obj)
	    	if(obj != undefined){
	    		Toast({message: '修改成功', duration: 2000})
	    	}
	    }).catch(({message}) => {
        	Indicator.close()
        	Toast({message: message, duration: 2000})
        	console.log(message)
      })
      })
  	},
	initSaleOrderDet() { //每次添加商品初始化商品信息
  		let goodArr = this.goodCodes
  		if(goodArr != undefined && goodArr.length > 0 && goodArr != 0){
  			var self = this
  			goodArr.forEach((val,index) => {
  				if(self.DetGoodsCodeStr.indexOf(val) == -1) {
	  				let cond = {
			          selectName: self.queryGoodByCode_Alert,
			          extraParam: {
			            GoodCode: val
			          }
			        }
	  				self.popupSelect(cond).then((obj) => { // 根据客户级别取对应的商品价格
	  					let Det = { GoodsNumber : obj[0].GoodsNumber, 
	  								GoodsFullName : obj[0].GoodsFullName, 
	  								GoodsSpec : obj[0].GoodsSpec,
	  								GoodsCode : val,
	  								Qty : 1,
	  								TaxPrice: 0,
	  								Price : 0,
	  								Amount : 0,
	  								TaxAmount: 0
	  							  }

	  					let good = obj[0]
	  					for( let g in good ) {
	  						if(g == this.clientLevel){
	  							Det.Price = good[g]
	  							Det.TaxPrice = good[g]
	  						}
	  					}

	  					Det.Amount = Det.Qty * Det.Price
	  					Det.TaxAmount = Det.Amount
	  					this.TotalAmount += Det.Amount
	  					this.TotalTaxAmount += Det.Amount

	  					self.TABLENAME_tblSalesOrderDet.push(Det)
  						
	  					self.DetGoodsCodeStr += val+','
	  					self.NewDetGoodsCodeStr += val+','
	  				})
  				}
  			})
  		
  		}
  	},
  	getClientInfo() { // 初始化客户信息
  		this.getSessEmp({}).then((obj) => {
  			if(obj.id != undefined){

		  		let cond = {
		          	selectName: this.getClientInfo_Alert,
		          	extraParam: {
		            CompanyCode: this.CompanyCode
		          }
		        }
        		console.log(cond)
			    this.popupSelect(cond).then((obj) => {
			    	console.log(obj)
			    	if(obj != undefined){
			    		this.CompanyCode = obj[0].CompanyCode

			    		this.ComFullName = obj[0].ComFullName
			    	}
			    })

	    	}
  		})
  	}	
  },
  activated: function () {

  },
  created() {
  	this.feachData()
  },
  mounted() {
  }
}
</script>
<style lang="scss" scoped>
$background-color: #F0F1F5;
.page_salesOrderDetail {
	background-color: $background-color;
	height: 100%;
	width: 100%;
	.order_from {
		position: fixed;
		top: 40px;
		width: 100%;
		height: 100%;
		font-size: 15px;
		.mint-tab-item {
			margin-bottom: 0px;
		}
		.createInfo {
			width: 100%;
			height: 50px;
			background-color: white;
			padding: 10px 20px;
			img {
				width: 50px;
				height: 50px;
			}
			.creater {
				display: inline-block;
				width: 50px;
				position: fixed;
			    left: 85px;
			    top: 52px;
			    .createName {
			    	margin-bottom: 5px;
			    }

			}
		}
		.mint-tab-container {
	      position: relative;
	      overflow: auto;
	      height: 80%;
	      .mint-tab-container-wrap {
	      .mint-field.is-textarea {
	      		border-bottom: 1px solid #888;
	      	}
	      }
	      div {
	      	height: 100%
	      }
	      .tblOrderDet {
	      	.addGood {
	      		position: fixed;
			    bottom: 5px;
			    right: 5px;
			    width: 60px;
			    height: 60px;
			    img {
			    	width: 100%;
			    }
	      	}
	      	.good_item {
	      		border-bottom: 5px solid #b8bbbf;
	      		.goodNum {
	      			padding: 0px 15px;
	      			height: 35px;
	      			line-height: 35px;
	      			p {
	      				display: inline-block;
	      			}
	      		}
	      		.goodName {
	      			div {
	      				height: 20px;
	      			}
	      			p {
	      				display: inline-block;
	      			}
	      		}
	      		.goodCount {
	      			div {
	      				height: 21px;
	      				width: 80px;
	      				border: 1px solid #888;
	      				display: inline-block;
	      				float: right;
                        margin-top: 9px;
                        span {
                        	display: inline-block;
                        	border-left: 1px solid #888;
                        	border-right: 1px solid #888;
                        	width: 20px;
                        	height: 21px;
                        	text-align: center;
                        	line-height: 21px;
                        }
                        input {
                          width: 36px;
					      border: none;
					      float: left;
					      height: 100%;
					      text-align: center;
                        }
	      			}
	
	      		}
	      		.goodDis {
	      			input {
		      			width: 50px;
					    float: right;
					    margin-top: 10px;
					    border: 1px solid #888;
					    height: 20px;
					    text-align: center;
	      			}
	      		}
	      		.goodTotle {
	      			span {
	      				float: right;
	      			}
	      		}
	      		ul {
	      			background-color: white;
	      			li {
	      				min-height: 40px;
	      				border-bottom: 1px solid #DCDCDC;
	      				line-height: 40px;
	      				padding: 0px 15px;
	      			}
	      		}
	      	}
	      }
		}
	}

}
</style>