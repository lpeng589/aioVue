
const state = {
	today: '',
	WeekFirstDay: '',
	MonthFirstDay: '',
	dataList: []
}

const getters = {
	today(state) {
		state.today = (new Date().getFullYear())+'-'+(new Date().getMonth()+1)+'-'+(new Date().getDate()) //今天 +1天
		return state.today.toString()
	},
	fristWeekday(state) { // 获取本周第一天
		let Nowdate = new Date()
		state.WeekFirstDay = new Date(Nowdate-(Nowdate.getDay()-1)*86400000)

		return state.WeekFirstDay
	},
	fristMonthday(state) { // 获取本月第一天
		let Nowdate = new Date();
		//state.MonthFirstDay = new Date(Nowdate.getFullYear(),Nowdate.getMonth(),1)
		state.MonthFirstDay = (new Date().getFullYear())+'-'+(new Date().getMonth()+1)+'-01'
		return state.MonthFirstDay

	},
	dataList(state) {
		return state.dataList
	}
}

const actions = {
	setDateList({commit,state},arr){

		commit('setDateList',arr)
	},
	addDateList({commit,state},obj){

		commit('addDateList',obj)

	}

}

const mutations = {
	'setDateList'(state,arr){
		if(arr.length > 0){
			state.dataList = arr
		}
	},
	'addDateList'(state,obj){
		if(obj){
			state.dataList.push(obj)
		}
	}
}

export default {
	state,
	getters,
	actions,
	mutations
}