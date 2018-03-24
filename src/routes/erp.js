const stockReport = r => require(['../views/stockreport/stockReport.vue'], r)
// 销售订单列表
 const salesOrderList = r => require(['../views/SalesOrder/salesOrderList.vue'], r) // ERP
// 销售订单添加
const salesOrderAdd = r => require(['../views/SalesOrder/salesOrderAdd.vue'], r)
// 销售订单详情页面
 const salesOrderDetail = r => require(['../views/SalesOrder/salesOrderDetail.vue'], r) // ERP
// 商品列表
const goodList = r => require(['../views/SalesOrder/goodList.vue'], r)
// 哈佛对账单
const transactionRecord = r => require(['../views/transactionRecord/transactionRecord.vue'], r)
// 采购询价
const BuyAskPriceList = r => require(['../views/BuyAskPrice/BuyAskPriceList.vue'], r)
// 销售报价
const SalesQuoteList = r => require(['../views/SalesQuote/SalesQuoteList.vue'], r)




export default [
  // 库存查询
  {path: '/stockreport/stockReport', component: stockReport, name: 'stockReport'},
  // 销售订单列表
  {path: '/SalesOrder/salesOrderList/opt=:opt?', component: salesOrderList, name: 'salesOrderList'},
  // 销售订单添加 // 路由为hash模式下时 pash: 路径不可以显示指定接收参数,否则自动跳转到默认页面, 原因未知
  {path: '/SalesOrder/salesOrderAdd/', component: salesOrderAdd, name: 'salesOrderAdd'},
  // 销售订单详情页面 // 路由为hash模式下时 pash: 路径不可以显示指定接收参数,否则自动跳转到默认页面, 原因未知
  {path: '/SalesOrder/salesOrderDetail/', component: salesOrderDetail, name: 'salesOrderDetail'},  
  // 商品列表
  {path: '/SalesOrder/goodList/retPage=:retPage', component: goodList, name: 'goodList'},
  // 哈佛对账单
  {path: '/transactionRecord/transactionRecord', component: transactionRecord, name: 'transactionRecord'},
  // 采购询价
  {path: '/BuyAskPrice/BuyAskPriceList', component: BuyAskPriceList, name: 'BuyAskPriceList'},
  // 销售报价
  {path: '/SalesQuote/SalesQuoteList', component: SalesQuoteList, name: 'SalesQuoteList'}

]
