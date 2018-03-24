<template>
  <div class="page_BuyAskPriceList">
    <!-- 页头   start -->
    <mt-header title="采购询价" fixed>
      <div slot="left">
        <mt-button icon="back" @click="$router.push({name: 'index'})">返回</mt-button>
      </div>
      <div slot="right" @click="$router.replace({name: 'BuyAskPriceAdd', params: {goodCodes: '0',optType: 'add'}})">
        <mt-button>
          <img src="../../assets/add.png" alt=""/>
        </mt-button>
      </div>
    </mt-header>
    <!-- 页头   end -->

    <!-- 搜索栏   start -->
    <mt-search v-model="BillNo" cancel-text="取消" placeholder="搜索"></mt-search>

    <!-- 查询条件栏   start -->
    <div class="nav_condition">
      <ul>
        <li v-bind:class="{ fontBlue: BillDateFlag }" @click="openByBillDate()">下单时间
        </li>
        <li v-bind:class="{ fontBlue: statusFlag }" @click="openByStatus()">单据状态
        </li>
        <li v-bind:class="{ fontBlue: workFlowFlag }" @click="openByworkFlow()">审核状态
        </li>
      </ul>
    </div>

    <!-- 报价列表   start -->
    <div class="orderList page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
      <mt-loadmore :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded"
                   ref="loadmore">
        <ul class="page-loadmore-list">
          <li class="page-loadmore-listitem" index="orderDetail" v-for="(item, index) in dataList"
              v-if="item.BillNo != null && item.BillNo != '' " @click="detailData(item)">
            <div>
              <label><span></span>询价金额￥<span>{{ item.TotalAmount }}</span></label>
              <span class="status" v-if="item.statusId == '未完成'"
                    v-bind:style="{color: StartColor}">{{ item.statusId }}</span>
              <span class="status" v-if="item.statusId == '已完成'"
                    v-bind:style="{color: MiddleColor}">{{ item.statusId }}</span>
            </div>
            <p><label>供应商:</label><span>{{ item.ComFullName }}</span></p>
            <p><label>下单日期:</label><span>{{ item.BillDate }}</span></p>
            <p>
              <label>单据编号:</label>
              <span>{{ item.BillNo | getBillNo }}</span>
              <span v-show="item.workFlowStatus != null" class="workFlow" v-if="item.workFlowNodeName == 'finish'"
                    v-bind:style="{color: MiddleColor}">{{ item.workFlowStatus }}</span>
              <span class="workFlow" v-else
                    v-bind:style="{color: StartColor}">{{ item.workFlowStatus }}</span>
            </p>
          </li>
        </ul>
        <div slot="bottom" class="mint-loadmore-bottom">
          <span v-show="bottomStatus == 'drop'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
          <span v-show="bottomStatus == 'loading'">
            <mt-spinner type="snake"></mt-spinner>
          </span>
        </div>
      </mt-loadmore>
    </div>
    <!-- 报价列表   end -->

    <!-- 报价状态筛选   start -->
    <div class="chooseStatus" v-show="statusFlag" @click="closeQueryWindow()">
      <mt-radio
        align="right"
        v-model="ProduceStatus"
        :options="statusOptions">
      </mt-radio>
    </div>

    <!-- 报价审核节点筛选   start -->
    <div class="chooseWorkFlow" v-show="workFlowFlag" @click="closeQueryWindow()">
      <mt-radio
        align="right"
        v-model="workFlowNodeName"
        :options="workFlowOptions">
      </mt-radio>
    </div>

    <!-- 报价日期筛选   start -->
    <div class="chooseBillDate" v-show="BillDateFlag">
      <div class="div periodTime">
        <label>日期</label>
        <input type="text" v-model="ForMatBillDate1" @click="openPicker1()">
        <span>至</span>
        <input type="text" v-model="ForMatBillDate2" @click="openPicker2()">
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
  import {mapActions, mapGetters, mapState} from 'vuex'
  import {Button, Header, Search, Indicator, DatetimePicker, Radio, Loadmore, Spinner} from 'mint-ui'

  export default {
    name: 'BuyAskPriceList',
    components: {
      'mt-header': Header,
      'mt-button': Button,
      'mt-search': Search,
      'mt-datetime-picker': DatetimePicker,
      'mt-radio': Radio,
      'mt-loadmore': Loadmore,
      'mt-spinner': Spinner
    },
    data: function () {
      return {
        list: [],
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        khlx: '',
        ProduceStatus: '',
        InvoiceType: '',
        SelectCompanySales: '',
        ReportSelectDepartment: '',
        ReportSelectEmployee: '',
        ReportSelectUser: '',
        BillNo: '',
        selectModel: '1',
        // Loadmore下拉状态变量
        allLoaded: false,
        bottomStatus: '',
        wrapperHeight: 0,
        salesOrderNoStr: '',
        // 下单时间
        BillDateFlag: false,
        BillDate1: '',
        BillDate2: (new Date().getFullYear()) + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate() + 1), //今天+1天
        startDate: new Date('2010-01-01'),
        endDate: new Date((new Date().getFullYear() + 1) + '-12' + '-31'), //明天 12月 31号
        quickDay: '', //
        quickDayptions: [
          {
            label: '今天',
            value: this.$store.getters.today
          },
          {
            label: '本周',
            value: this.$store.getters.fristWeekday
          },
          {
            label: '本月',
            value: '2017-10-01'
          },
          {
            label: '全部',
            value: '2010-01-01'
          }
        ],
        // 状态颜色
        StartColor: '#00BFFF',
        MiddleColor: '#FF8C00',
        EndColor: '#696969',
        // 单据状态 1 完成 0 未完成
        OrderStatus: '',
        statusFlag: false,
        statusOptions: [
          {
            label: '未完成',
            value: '0'
          },
          {
            label: '完成',
            value: '1'
          },
          {
            label: '全部',
            value: ''
          }],
        // 审核节点 draft notApprove finish
        workFlowNodeName: '',
        workFlowFlag: false,
        workFlowOptions: [
          {
            label: '草稿',
            value: 'draft'
          },
          {
            label: '全部',
            value: ''
          }]
      }
    },
    computed: {
      ...mapState({
        name: state => state.user.name,
        titleId: state => state.user.titleId,
        department: state => state.user.departmentName
      }),
      ...mapGetters([
        'today',
        'fristWeekday',
        'fristMonthday'
      ]),
      tableName() {
        return 'tblBuyAskPrice'
      },
      ForMatBillDate1: function () {
        let date = new Date(this.BillDate1)
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      },
      ForMatBillDate2: function () {
        let date = new Date(this.BillDate2)
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      },
      opt() {
        return this.$route.params.opt
      }
    },
    filters: {
      getBillNo(val) {
        return val.substring(0, val.indexOf('#'))
      },
      changeColor(val) {
        if (val === '未完成') {
          bus.StatusColor = '#00BFFF'
        } else {
          bus.StatusColor = '#FF8C00'
        }
      }
    },
    watch: {
      BillNo: function (newVal) {
        this.BillNo = newVal
        this.listData()
      },
      workFlowNodeName: function (newVal) {
        this.workFlowNodeName = newVal
        this.listData()
      },
      ProduceStatus: function (newVal) {
        this.produceStatus = newVal
        this.listData()
      },
      quickDay: function (newVal) {
        this.BillDate1 = newVal
        this.BillDate2 = (new Date().getFullYear()) + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate() + 1) //今天+1天
      },
      $route() {
        if (this.opt === 'reload') {
          this.listData()
        }
      }
    },
    methods: {
      ...mapActions(['reportQuery', 'popupSelect']),
      getWorkFlowNodes() {
        let cond = {
          selectName: 'model_getWorkNodeByTblName',
          extraParam: {
            tableName: 'tblBuyAskPrice'
          }
        }
        this.popupSelect(cond).then((obj) => {
          obj.forEach(val => {
            console.log(val)
            this.workFlowOptions.push(val)
          })
        })
        console.log(this.workFlowOptions)
      },
      listData: function () {
        console.log('listdate')
        Indicator.open({text: '加载中...', spinnerType: 'snake'})
        // 每次查询 重置 页码和判断重复的字符串
        this.pageNo = 1
        this.salesOrderNoStr = ''

        let cond = {
          tableName: this.tableName,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          extraParam: {
            // khlx: this.khlx, // 客户类型
            statusId: this.ProduceStatus, // 报价状态
            BillNo: this.BillNo, // 单据编号 notApprove
            BillDate1: this.BillDate1,
            BillDate2: this.BillDate2,
            workFlowNodeName: this.workFlowNodeName // 审核状态 draft notApprove finish
          }
        }
        this.reportQuery(cond).then((obj) => {
          console.log(obj.rows)
          var self = this
          Indicator.close()
          this.dataList = obj.rows

          if (this.dataList.length > 0) {

            this.dataList.forEach(val => {
              let billNo = val.BillNo.substring(0, val.BillNo.indexOf('#'))
              // console.log(self.salesOrderNoStr)
              self.salesOrderNoStr += billNo + ' ' // 判断重复的字符串
            })
          }
          this.pageNo = 2 // 向上滑动列表时 从第二页开始查询
        })
        // console.log(this.dataList)
      },
      openPicker1() {
        this.$refs.picker1.open();
      },
      openPicker2() {
        this.$refs.picker2.open();
      },
      openByStatus () {
        this.workFlowFlag = false
        this.BillDateFlag = false
        this.statusFlag = !this.statusFlag
      },
      openByworkFlow () {
        this.BillDateFlag = false
        this.statusFlag = false
        this.workFlowFlag = !this.workFlowFlag
      },
      openByBillDate () {
        this.statusFlag = false
        this.workFlowFlag = false
        this.BillDateFlag = !this.BillDateFlag
      },
      queryByBillDate () {
        this.listData()
        this.BillDateFlag = false
      },
      closeQueryWindow () {
        this.workFlowFlag = false
        this.statusFlag = false
        this.BillDateFlag = false
      },
      handleBottomChange (status) {
        this.bottomStatus = status
      },
      loadBottom() {
        console.log('loadBottom')
        if (this.pageNo === 1) {
          Indicator.open({text: '加载中...', spinnerType: 'snake'})
        }
        setTimeout(() => {
          let cond = {
            tableName: this.tableName,
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            extraParam: {
              statusId: this.ProduceStatus, // 报价状态
              BillNo: this.BillNo, // 单据编号 notApprove
              BillDate1: this.BillDate1,
              BillDate2: this.BillDate2,
              workFlowNodeName: this.workFlowNodeName // 审核状态 draft notApprove finish
            }
          }

          var self = this;
          this.reportQuery(cond).then((obj) => {
            // console.log('method--loadBottom')
            let list = obj.rows
            console.log(list.length)
            if (list.length > 0) {
              list.forEach(function (val, key) {
                let billNo = val.BillNo.substring(0, val.BillNo.indexOf('#'))
                if (val.BillNo != null && val.BillNo !== '' && self.salesOrderNoStr.indexOf(billNo) === -1) {
                  self.dataList.push(val)
                  // console.log(self.salesOrderNoStr)
                  console.log(self.dataList)
                  self.salesOrderNoStr += billNo + ' ' // 累计判断重复的字符串
                }

              })
              self.pageNo += 1 // 累计页码
              this.allLoaded = true
            } else {
              this.allLoaded = true
            }
            Indicator.close()
            self.$refs.loadmore.onBottomLoaded()
          })


        }, 1500)
      },
      detailData(item) { // 进入详情页面
        this.$router.replace({
          name: 'BuyAskPriceDetail',
          params: {
            tableName: this.tableName,
            keyId: item.keyId,
            ModuleId: this.selectModel,
            workFlowStatus: item.BillStatus,
            optType: 'intoDetail'
          }
        })
        
      }
    },
    created () {
      this.getWorkFlowNodes()
      let det = (new Date().getFullYear()) + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate() + 1)
    },
    mounted () {
      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  $background-color: #F0F1F5;
  .page_BuyAskPriceList {
    background-color: $background-color;
    height: 100%;
    width: 100%;
    .fontBlue {
      color: #26a2ff;
    }
    .chooseStatus {
      position: fixed;
      top: 120px;
      left: 0px;
      height: 100%;
      width: 100%;
      background-color: rgba(7, 17, 27, 0.8);
      z-index: 2000;
    }
    .chooseWorkFlow {
      @extend .chooseStatus;

    }
    .chooseBillDate {
      @extend .chooseStatus;
      .radioDiv {
        width: 100%;
        height: 26%;
        .mint-radiolist {
          top: 157px;
        }

      }
      .div {
        padding: 5px 15px;
        width: 100%;
        background-color: white;
        border-bottom: 1px solid #DCDCDC;
        min-height: 35px;
        line-height: 35px;
        input {
          border: none;
          text-align: center;
          width: 35%;
        }
      }
      .Button {
        text-align: center;
        position: fixed;
        top: 357px;
        button {
          margin-right: 30px;

        }
      }
    }
    div.mint-radiolist {
      position: fixed;
      top: 110px;
      width: 100%;
    }
    .orderList {
      position: fixed;
      top: 120px;
      width: 100%;
      height: 84%;
      overflow: auto;
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
      .workFlow {
        float: right;
        border: 1px solid;
        border-radius: 10px;
        width: 55px;
        text-align: center;
        height: 20px;
        line-height: 20px;
        font-size: 13px;
      }
      .status {
        @extend .workFlow;
      }

      ul {
        overflow-y: auto;
        height: 100%;
        li {
          background-color: white;
          height: 80px;
          padding: 10px 20px;
          margin-bottom: 5px;
          div {
            margin-bottom: 5px;
            label {
              font-weight: 700;
              font-size: 15px;
              display: inline;
            }
          }
          p {
            font-size: 13px;
            font-weight: 400;
            label {
              margin-right: 5px;
            }
          }
        }
      }
    }
    .nav_condition {
      position: fixed;
      top: 88px;
      width: 100%;
      height: 30px;
      background-color: white;
      line-height: 30px;
      ul {
        display: flex;
        li {
          flex: 1;
          text-align: center;
          border-right: 1px solid #DCDCDC;
          font-size: 15px;
        }
      }
    }
    .mint-header {
      background-color: white;
      color: black;
      border-bottom: 1px solid #DCDCDC;
      img {
        width: 30px;
      }
      .mint-header-title {
        font-size: 18px;
      }
    }
    .mint-search {
      position: fixed;
      top: 40px;
      width: 100%;
      height: 50px;
      .mint-searchbar {
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
  }
</style>
