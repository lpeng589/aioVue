<template>
	<div class="mentousheji_page" ref="mentousheji">
				<!-- 页头   start -->
		<mt-header title="门头设计申请" fixed>
			<div slot="left">
				<mt-button icon="back" @click="$router.push({name: 'index'})">返回</mt-button>
			</div>
			<div slot="right"  @click="saveOrder()">
				<mt-button class="header_saveOrder_button">
					保存送审			
				</mt-button>
			</div>
		</mt-header>
		<!-- 页头   end -->
		<div class="main_body" ref="mainbody">
		<div class="menu"><span>门店信息</span></div>

		<!-- 主表字段 -->
				<div class="my_selected">
					<label>申请日期</label>
					<div class="my_selected_cell">
						<input type="text" v-model="BillDate">
					</div>
				</div>
												<div class="my_selected">
					<label>申请地区</label>
					<div class="my_selected_cell">
						<textarea rows="4" v-model="SQDQ" placeholder='请输入申请地区'>
							
						</textarea>
					</div>
				</div>
				<div class="my_selected">
					<label>客户名称</label>
					<div class="my_selected_cell" @click="selectClient()">
						<input type="text" v-model="ComFullName" placeholder="请选择客户" readonly="true">
					</div>
				</div>
				<div class="my_selected">
					<label>门店名称</label>
					<div class="my_selected_cell">
						<input type="text" v-model="MDMC" placeholder="请输入门店名称">
					</div>
				</div>
				<div class="my_selected">
					<label>门店号码</label>
					<div class="my_selected_cell">
						<input type="text" v-model="FWDH" placeholder="请输入服务号码">
					</div>
				</div>
				<div class="my_selected">
					<label>品牌</label>
					<div class="my_selected_cell">
						<select v-model="PP">
							<option value="0">-请选择-</option>
							<option :value="item.enumValue" v-for="item in PPArr" >{{item.zhCN}}</option>
						</select>
					</div>
				</div>
				<div class="my_selected">
					<label>门店类型</label>
					<div class="my_selected_cell">
						<select v-model="MDLX">
							<option value="0">-请选择-</option>
							<option :value="item.enumValue" v-for="item in MDLXArr" >{{item.zhCN}}</option>
						</select>
					</div>
				</div>
				<div class="my_selected">
					<label>是否签订授权</label>
					<div class="my_selected_cell">
						<select v-model="SFQDSQ">
							<option value="0">-请选择-</option>
							<option :value="item.enumValue" v-for="item in SFQDSQArr" >{{item.zhCN}}</option>
						</select>
					</div>
				</div>

				<div class="my_selected">
					<label>费用金额</label>
					<div class="my_selected_cell">
						<input type="text" v-model="Amount" placeholder="请输入金额">
					</div>
				</div>
				<div class="my_selected">
					<label>申请人</label>
					<div class="my_selected_cell">
						<input type="text" v-model="EmployeeID2" placeholder="请输入申请人">
					</div>
				</div>				
				<div class="my_selected">
					<label>准核</label>
					<div class="my_selected_cell">
						<input type="text" v-model="HZ" placeholder="请输入申请人">
					</div>
				</div>

				<!-- 示例图片 -->
				<div class="menu"><span>示例图片</span></div>
				<div class="examplePic">
					<img src="../../assets/OA/examplePic1.png">

				</div>

				<!-- 广告头 -->
				<div class="item" v-for="(item,index) in PICArr">
					<div class="item_lable">
						<span class="item_lable_index">广告{{ index+1 }}</span>
						<span class="detDet" @click="deleteDet(index)">
							<img src="../../assets/opt/item_det.png">
						</span>
						<span class="detDet"  @click="fileClick(index)">
							<img src="../../assets/opt/upload_pic.png">
						</span>

					</div>

					<!-- 广告图片 -->
					<div class="item_pic" :style="{height : item.file.length > 0? 170+'px' : 50+'px'}">
						<img class="item_pic_img" src="../../assets/opt/upload.png" v-if="item.file.length == 0">
						<div class="item_pic_div_src" v-for="(fileItem,index) in item.file">
							<img :src="fileItem.src" >
							<button @click.stop="detPic(item.file,index)">X</button>
						</div>
					</div>
						<input @change="fileChange($event,index)" type="file" :id="index" multiple style="display: none"/>

					<!-- 广告图片说明 -->
					<div class="my_selected">
						<label>广告类型</label>
						<div class="my_selected_cell">
							<select v-model="item.GGLX">
								<option value="0">-请选择-</option>
								<option :value="item.enumValue" v-for="item in GGLXArr" >{{item.zhCN}}</option>
							</select>
						</div>
					</div>					
					<div class="my_selected">
						<label>版面要求</label>
						<div class="my_selected_cell">
							<select v-model="item.BMYQ">
								<option value="0">-请选择-</option>
								<option :value="item.enumValue" v-for="item in BMYQArr" >{{item.zhCN}}</option>
							</select>
						</div>
					</div>					
					<div class="my_selected">
						<label>制作要求</label>
						<div class="my_selected_cell">
							<select v-model="item.ZZYQ">
								<option value="0">-请选择-</option>
								<option :value="item.enumValue" v-for="item in ZZYQArr" >{{item.zhCN}}</option>
							</select>
						</div>
					</div>
					<div class="my_selected">
						<label>材质</label>
						<div class="my_selected_cell">
							<select v-model="item.MTCZ">
								<option value="0">-请选择-</option>
								<option v-if="(optItem.enumOrder / item.GGLX) == 1" :value="optItem.enumValue" v-for="optItem in MTCZArr" >{{optItem.zhCN}}</option>
							</select>
						</div>
					</div>

					<div class="item_size">
						<span>长</span><input type="text" v-model="item.long" placeholder="单位(米)">
						<span>高</span><input type="text" v-model="item.height" placeholder="单位(米)">
					</div>
					<div class="item_desc">
						<label>广告要求</label>
						<div class="item_desc_textarea">
							<textarea rows="4" v-model="item.desc" placeholder="请输入要求">
								
							</textarea>
						</div>
					</div>
				</div>	
		</div>
		<div class="add_item_GG"  @click="addDet()"><span>再做一份广告</span></div>
	</div>
</template>
<script type="text/javascript">
import axios from 'axios'
import { mapState, mapActions } from 'vuex'
import { Header, Button, Cell, Navbar, TabItem, TabContainer, TabContainerItem, Indicator, Toast, MessageBox } from 'mint-ui'
export default {
  components: {
    'mt-header': Header,
    'mt-button': Button,
    'mt-cell': Cell,
    'mt-navbar': Navbar,
    'mt-tab-item': TabItem,
    'mt-tab-container': TabContainer,
    'mt-tab-container-item': TabContainerItem
  },
  computed: {
  	...mapState({
		userID: state => state.user.id,
		name: state => state.user.name,
		titleId: state => state.user.titleId,
		department: state => state.user.departmentName
	}),
  	tableName() {
      return 'FlowNmendianguanggaoshenqing' // 门头设计申请
    },
    company() {
    	return this.$route.params.company
    },
    clientWidth() {
    	return document.body.clientWidth
    }
  },
  data() {
  	return {
  		pinpai: 1,
  		selected: 1,
  		// 主表字段
  		//BillNo: 'SS123',
  		EnumArr: ['PP','MDLX','SFQDSQ','MTCZ','MTDB','GGLX','ZZYQ','BMYQ'], // 品牌,门店类型,是否授权,门头材质,门头底板
  		

  		// 主表
  		BillDate: (new Date().getFullYear())+'-'+(new Date().getMonth()+1)+'-'+(new Date().getDate()),
  		SQDQ: '', // 申请地区
  		CompanyCode: '', //客户
  		ComFullName: '', //客户名称
  		MDMC: '', // 门店名称
  		FWDH: '', // 门店号码
  		PP: 0, // 品牌
  		PPArr: [], // 品牌枚举
  		MDLX: 0, // 门店类型
  		MDLXArr: [],
  		SFQDSQ: 0, // 是否签订授权
  		SFQDSQArr: [],
  		EmployeeID2: '',
  		HZ: '',
  		Amount: '', //金额

  		// 明细表
  		GGLX: 0, //广告类型1
  		GGLX2: 0, //广告类型1
  		GGLX3: 0, //广告类型1
  		GGLX4: 0, //广告类型1
  		GGLXArr: [], 
  		ZZYQ: 0, // 制作要求1
  		ZZYQ2: 0, // 制作要求2
  		ZZYQ3: 0, // 制作要求3
  		ZZYQ4: 0, // 制作要求4
  		ZZYQArr: [],
  		BMYQ: 0, //版面要求1
  		BMYQ2: 0, //版面要求2
  		BMYQ3: 0, //版面要求3
  		BMYQ4: 0, //版面要求4
  		BMYQArr: [],
  		MTCZ: 0, // 材质1
  		MTCZ2: 0, // 材质2
  		MTCZ3: 0, // 材质3
  		MTCZ4: 0, // 材质4
  		MTCZArr: [],
  		LXA: '', // 尺寸1
  		LXB: '', // 尺寸2
  		LXC: '', // 尺寸3
  		LXD: '', // 尺寸4
  		QTCZYQ: '', // 其他材质、要求补充1
  		QTCZYQ2: '', // 其他材质、要求补充2
  		QTCZYQ3: '', // 其他材质、要求补充3
  		QTCZYQ4: '', // 其他材质、要求补充4
  		tupian: '', // 图片1
  		tupian2: '', // 图片2
  		tupian3: '', // 图片3
  		tupian4: '', // 图片4
  		PICArr: [{'file': [], 'long': '', 'height': '', 'desc': '', 'GGLX': '', 'BMYQ': '', 'ZZYQ': '', 'MTCZ': ''}]
  	}
  },
  watch: {
  	company(newVal){
  		if(newVal != undefined){
  			this.CompanyCode = newVal.CompanyCode
  			this.ComFullName = newVal.ComFullName
  		}
  	},
    $route() {
      let path = this.$route.path
     // console.log(path)
    }
  },
  methods: {
  	...mapActions([ 'add', 'addPre', 'popupSelect', 'getSessEmp', 'uploadServlet', 'getHome' ]),
  	selectClient() {
  		this.$router.push({name: 'clientList', params: {retPage: 'FlowNmendianguanggaoshenqing'}})
  	},
  	saveOrder() {
      MessageBox.confirm('确认保存?').then(action => {
    		// 处理明细表数据
    		this.PICArr.forEach((obj,index) => {
    			if(index == 0){
    				this.GGLX = obj.GGLX
    				this.ZZYQ = obj.ZZYQ
    				this.BMYQ = obj.BMYQ
    				this.MTCZ = obj.MTCZ
    				this.QTCZYQ = obj.QTCZYQ
    				obj.file.forEach((file,index) => {
    					let fileName = file.name.split('.')
    					fileName = fileName[0]+'_tupian.'+fileName[1]
    					console.log(fileName)
    					this.tupian += fileName+';'
    				})
    				this.LXA = obj.long+'*'+obj.height
    			}			
    			if(index == 1){
    				this.GGLX2 = obj.GGLX
    				this.ZZYQ2 = obj.ZZYQ
    				this.BMYQ2 = obj.BMYQ
    				this.MTCZ2 = obj.MTCZ
    				this.QTCZY2 = obj.QTCZYQ
    				obj.file.forEach((file,index) => {
    					let fileName = file.name.split('.')
    					fileName = fileName[0]+'_tupian.'+fileName[1]
    					console.log(fileName)
    					this.tupian2 += fileName+';'
    				})
    				this.LXB = obj.long+'*'+obj.height
    			}			
    			if(index == 2){
    				this.GGLX3 = obj.GGLX
    				this.ZZYQ3 = obj.ZZYQ
    				this.BMYQ3 = obj.BMYQ
    				this.MTCZ3 = obj.MTCZ
    				this.QTCZYQ3 = obj.QTCZYQ
    				obj.file.forEach((file,index) => {
    					let fileName = file.name.split('.')
    					fileName = fileName[0]+'_tupian.'+fileName[1]
    					console.log(fileName)
    					this.tupian3 += fileName+';'
    				})
    				this.LXC = obj.long+'*'+obj.height
    			}			
    			if(index == 3){
    				this.GGLX4 = obj.GGLX
    				this.ZZYQ4 = obj.ZZYQ
    				this.BMYQ4 = obj.BMYQ
    				this.MTCZ4 = obj.MTCZ
    				this.QTCZYQ4 = obj.QTCZYQ
    				obj.file.forEach((file,index) => {
    					let fileName = file.name.split('.')
    					fileName = fileName[0]+'_tupian.'+fileName[1]
    					console.log(fileName)
    					this.tupian4 += fileName+';'
    				})
    				this.LXD = obj.long+'*'+obj.height
    			}

    		})

    		let values = {
    			// 主表字段
    			BillDate : this.BillDate,
    			SQDQ : this.SQDQ,
    			CompanyCode : this.CompanyCode,
    			MDMC : this.MDMC,
    			FWDH : this.FWDH,
    			PP : this.PP,
    			MDLX : this.MDLX,
    			SFQDSQ : this.SFQDSQ,
    			EmployeeID2 : this.EmployeeID2,
    			HZ : this.HZ,
    			// 明细表
  	  		GGLX: this.GGLX, //广告类型1
  	  		GGLX2: this.GGLX2, //广告类型1
  	  		GGLX3: this.GGLX3, //广告类型1
  	  		GGLX4: this.GGLX4, //广告类型1
  	  		ZZYQ: this.ZZYQ, // 制作要求1
  	  		ZZYQ2: this.ZZYQ2, // 制作要求2
  	  		ZZYQ3: this.ZZYQ3, // 制作要求3
  	  		ZZYQ4: this.ZZYQ4, // 制作要求4
  	  		BMYQ: this.BMYQ, //版面要求1
  	  		BMYQ2: this.BMYQ2, //版面要求2
  	  		BMYQ3: this.BMYQ3, //版面要求3
  	  		BMYQ4: this.BMYQ4, //版面要求4
  	  		MTCZ: this.MTCZ, // 材质1
  	  		MTCZ2: this.MTCZ2, // 材质2
  	  		MTCZ3: this.MTCZ3, // 材质3
  	  		MTCZ4: this.MTCZ4, // 材质4
  	  		LXA: this.LXA, // 尺寸1
  	  		LXB: this.LXB, // 尺寸2
  	  		LXC: this.LXC, // 尺寸3
  	  		LXD: this.LXD, // 尺寸4
  	  		QTCZYQ: this.QTCZYQ, // 其他材质、要求补充1
  	  		QTCZYQ2: this.QTCZYQ2, // 其他材质、要求补充2
  	  		QTCZYQ3: this.QTCZYQ3, // 其他材质、要求补充3
  	  		QTCZYQ4: this.QTCZYQ4, // 其他材质、要求补充4
  	  		tupian: this.tupian, // 图片1
  	  		tupian2: this.tupian2, // 图片2
  	  		tupian3: this.tupian3, // 图片3
  	  		tupian4: this.tupian4 // 图片4

    		}

    		values = window.JSON.stringify(values)
    		let postDate = { tableName: this.tableName, values }
    		console.log(postDate)
  	    this.add(postDate).then((obj) => {
  	    	if(obj.keyId != undefined){
  	    		Indicator.close()
          		Toast({message: '保存成功', duration: 2000})

          		setTimeout(()=>{
          			this.$router.push({ path: `/workflow/approvedetredirect/FlowNmendianguanggaoshenqing/${obj.keyId}?title=门头设计申请&opType=detail` })
          		},2000)
  	    	}
  	    }).catch(({message}) => {
          	Indicator.close()
          	Toast({message: message, duration: 2000})
        })
      })
  	},
  	detPic(itemFile,index) {
  		itemFile.splice(index,1)
  	},
  	fileClick(index) {
  		console.log(index)
        document.getElementById(index).click()
    },
     fileChange(el,index) {
      if (!el.target.files[0].size) return;
     //console.log(el.target)
      this.fileList(el.target,index);
      el.target.value = ''
  	},
  	fileList(fileList,index) {
      let files = fileList.files;
      //console.log(files)
      for (let i = 0; i < files.length; i++) {
          //判断是否为文件夹
          if (files[i].type != '') {
              this.fileAdd(files[i],index);
          } else {
              //文件夹处理
              this.folders(fileList.items[i]);
          }
      }
    },
	//文件夹处理
	folders(files) {
      let _this = this;
      //判断是否为原生file
      if (files.kind) {
          files = files.webkitGetAsEntry();
      }
      files.createReader().readEntries(function (file) {
          for (let i = 0; i < file.length; i++) {
              if (file[i].isFile) {
                  _this.foldersAdd(file[i]);
              } else {
                  _this.folders(file[i]);
              }
          }
      })
	},
    fileAdd(file,index) {
      //总大小
      this.size = this.size + file.size;
      //判断是否为图片文件
      if (file.type.indexOf('image') == -1) {
          file.src = 'wenjian.png';

      } else {
          let reader = new FileReader();
          reader.vue = this;
          reader.readAsDataURL(file);
          reader.onload = function () {
              file.src = this.result;

              this.vue.PICArr[index].file.push(file)  
              this.vue.uploadPic(file)


          }
      }
    },
    uploadPic(file) { //图pain上传
      this.uploadServlet(file).then((obj) => {
        console.log(obj)
      })
    },
  	saveOrderPre() { // 初始化订单主表信息
  		let self = this
  		this.EnumArr.forEach((val,index) => { 			
	 		let cond = {
	          	selectName: 'model_getEnumBykey',
	          	extraParam: {
	          		EnumKey: val,
	          		pageSize: 100
	          }
	        }
		    this.popupSelect(cond).then((obj) => {
		    	//console.log(obj)
		    	if(obj != undefined && val == 'PP'){
		   			self.PPArr = obj
		    	}
		    	if(obj != undefined && val == 'MDLX'){
		   			self.MDLXArr = obj
		    	}
		    	if(obj != undefined && val == 'MTCZ'){
		   			self.MTCZArr = obj
            console.log(self.MTCZArr)
		    	}
		    	if(obj != undefined && val == 'MTDB'){
		   			self.MTDBArr = obj
		    	}
		    	if(obj != undefined && val == 'SFQDSQ'){
		   			self.SFQDSQArr = obj
		    	}	
		    	if(obj != undefined && val == 'GGLX'){
		   			self.GGLXArr = obj
		    	}	
		    	if(obj != undefined && val == 'ZZYQ'){
		   			self.ZZYQArr = obj
		    	}
		    	if(obj != undefined && val == 'BMYQ'){
		   			self.BMYQArr = obj
		    	}

		    })
  		})
  	},
  	addDet() {
  		let mainbody = this.$refs.mainbody 
  		console.log(mainbody.scrollHeight )

  		if(this.PICArr.length >= 4){
  			Indicator.close()
        	Toast({message: '最多提交4份广告!', duration: 2000})
        	return
  		}else{
  			let det = {'file': [], 'long': '', 'height': '', 'desc': '', 'GGLX': '', 'BMYQ': '', 'ZZYQ': '', 'MTCZ': ''}
  			this.PICArr.push(det)
  		}
  		 mainbody.scrollTo(0,mainbody.scrollHeight) //滚动条移动 到新增item 位置
  	},
  	deleteDet(index) {
  		this.PICArr.splice(index,1)
  	},
    initData() {

    }
  },
  created() {
  	this.saveOrderPre()
	this.getHome({}).then((obj) => {
	    console.log(obj)
	})
  },
  activated: function () {
   	this.getHome({}).then((obj) => {
	    console.log(obj)
	})
  },
  deactivated: function() {
    console.log('deactivated')
    let toPath = this.$route.path.split('/')
    console.log(toPath[1])
    if(toPath[1] == 'index'){
      
      //初始化数据
      Object.assign(this.$data, this.$options.data())
    }
  }
}
	
</script>
<style  lang="scss" scoped>
$fontSize: 18px; 
.mentousheji_page{
	height: 100%;
	width:  100%;
	margin: 0px;
	padding: 0px;

	.mint-header {
		background-color:white;
		color: black;
		border-bottom: 1px solid #DCDCDC;
		.header_saveOrder_button {
			color: blue;
		}
		.mint-header-title {
			font-size: 18px;
		}
	}
	.add_item_GG {
		width: 100%;
		height: 5%;
		background-color: #1E90FF;
		position: fixed;
		bottom: 0px;
		border-radius: 10px;
		line-height: 30px;
		text-align: center;
		span {
			font-weight: 800;
			color: white;
			font-size: 20px;
		}
	}
	.main_body {
		position: fixed;
		height: 90%;
		width: 100%;
		top: 40px;
		right:  0px;
		left:  0px;
		bottom:  0px;
		font-size: $fontSize;
		overflow-y: auto;
		overflow-x: hidden;
		.menu {
			width: 100%;
			height: 30px;
			line-height: 30px;
			background-color: #1E90FF;
			color: white;
			font-weight: 700;
			border: 1px solid #1E90FF; //00BFFF
			border-radius: 5px;
			margin-top: 5px;
			margin-bottom: 5px;
			span {
				margin-left: 20px;
			}
		}
		.item {
			min-height: 200px;
		    width: 99%;
		   // background-color: blue;
		    border: 3px solid #e8e8e8;
		    .item_lable {
		    	background-color: #B0C4DE;
		    	height: 30px;
		    	line-height: 30px;
		    	.item_lable_index {
		    		display: inline-block;
		    		width: 100px;
		    		margin-left: 10px;
		    		font-weight: 700;
		    	}
		    	.addDet {
		    		display: inline-block;
    				height: 100%;
			    	float: right;
			    	margin-right: 10px;
			    	img {
			    		height: 100%;
			    	}

		    	}
		    	.detDet {
		    		display: inline-block;
    				height: 80%;
			    	float: right;
			    	margin-right: 10px;
			    	margin-left: 30px;
			    	img {
			    		height: 100%;
			    	}

		    	}
		    }
		    .item_pic {
		    	height: 170px;
		    	line-height: 170px;
			    width: 100%;
			    border: 2px solid #e8e8e8;
			  	overflow-y: auto;
    			background-color: #f7f7f7;
    			.item_pic_img {
    				float: left;
    				margin-left: 40%;
    			}
    			.item_pic_div_src {
    				height: 80%;
    				width:  100px;
    				display: inline-block;
    				margin: 15px;
    				border: 2px dashed;
    				float: left;
    				border-radius: 5px;
    				img {
    					height: 100%;
    					width: 100%;
    					display: inline-block;
    				}
    				button {
    					width: 20px;
    					height: 20px;
					    background-color: #DC143C;
					    position: relative;
					    left: -10px;
					    top: -300px;
					    border-radius: 20px;
					    text-align: center;
					    line-height: 20px;
					    color: white;
					    border: none;
					    font-weight: 800;
    				}
    			}
    			input {
		    		height: 100%;
		    		width:  100%;
			    }
			    img {
			    	height: 100%;
			    }
		    }
		    .item_size {
		    	text-align: left;
		    	margin-top: 12px;
		    	input {
		    		margin-left: 15px;
		    		width: 30%;
		    		height: 30px;
   					border: 1px solid #888;
		    	}
		    	span {
		    		margin-left: 20px;
		    	}
		    }
		    .item_desc {
		    	margin-top: 15px;
		    	label {
		    			margin-left: 20px;
    					float: left;
		    	}
		    	.item_desc_textarea {
		    		display: inline-block;
		    		height: 100%;
		    		width: 70%;
		    		margin-left: 20px;
			    	textarea {
			    		height: 100%;
					    width: 100%;
					    outline: none;
					    border: none;
					    font-size: $fontSize;

			    	}
		    	}
		    }
		}
		.examplePic {
			height: 150px;
			width: 99%;
			border-left: 2.5px solid white;
			background-color: #bababa;
			margin-bottom: 20px;
			img {
				height: 100%;
				width: 100%;
			}
			input {
				width: 100%;
				height: 100%;
				z-index: -10;
			}
		}
		.my_selected {
		    width: 99%;
		    min-height: 50px;
		    border-bottom: 1px solid #e8e8e8;
		    line-height: 50px;
		    text-align: left;
		    margin-bottom: 5px;
		    margin-left: 20px;
		    label {
		    	width: 35%;
			    height: 100%;
			    line-height: 50px;
			    display: inline-block;
			    float: left;
		    }
		    .my_selected_cell {
		    	display: inline-block;
		    	height: 100%;
   				width: 65%;
   				text-align: center;
   				textarea {
   					height: 100%;
				    width: 100%;
				    outline: none;
				    border: none;
				    font-size: $fontSize;
   				}
		    	input {
		    		width: 100%;
				    height: 100%;
				    margin-left: 10px;
				    font-size: $fontSize;
				    border: none;
				    outline: none;
		    	}
		    	select {
		     		height: 100%;
				    width: 60%;
				    font-size: $fontSize;
				    text-align: center;
				      appearance:none;
					  -moz-appearance:none;
					  -webkit-appearance:none;
				    option {
				    	height: 80%;
				    	width: 80%;
				    	outline: hidden;
				    	text-align: center;
				    	font-size: 15px;
				    	outline: 1px solid;
				    	padding: auto;
				    	border: 1px solid;
				    } 
		    	}
		    }

		}
	}
}
</style>
