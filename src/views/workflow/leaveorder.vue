<template>
<div class="page_wrap">
  <!-- 顶部 -->
  <mt-header title="请假单" fixed>
    <div slot="left">
      <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
    </div>
  </mt-header>
  <!-- 内容 -->
  <div class="page_cont detail_page">
    <div class="main_info">
      <template v-if="!isEdit">
        <div class="createInfo">
          <p class="creatorImg"><img src="../../assets/man.png" alt=""></p>
          <p class="creatorInfo">
            <span class="creator">{{createByName}}</span><br>
            <span class="flowDepictLink" @click="$router.push({path: '/workflow/approveFlowdepict/'})">
              {{lastWorkFlowNode}}<span style="color:#d9d9d9">&nbsp;&gt;</span>
            </span>
            <span class="createTime"></span>
          </p>
        </div>
      </template>
      <mt-cell ref="field-EmployeeID" title="请假人员" v-model="EmployeeID">
        <span>{{ $data['tblEmployee.EmpFullName']?$data['tblEmployee.EmpFullName']:'请选择'}}</span>
      </mt-cell>
      <template v-if="isEdit"> <!-- 编辑状态 -->
        <div class="expen_select mint-cell" ref="field-LeavebillType" is-link="true" title="请假类型">
          <label>请假类型</label>
            <select v-model="LeavebillType">
              <option  v-for="option in selectOption" :value="option.value">{{option.name}}</option>
            </select>
            <i class="mint-cell-allow-right"></i>
        </div>
      </template>
      <mt-cell  title="请假类型" v-if="!isEdit && selectOption.length > 0" :value="selectOption.filter(item => item.value === LeavebillType)[0].name">
      </mt-cell>
      <mt-field ref="field-due" :readonly="!isEdit":placeholder="isEdit ? '请输入请假事由' : '无请假事由'" type="textarea" v-model="due" rows="3">
      </mt-field>
      <mt-cell ref="field-Kstime" title="开始时间" :is-link="isEdit" @click.native="startPicker('Kstime', 'picker1')">
      <span>{{ Kstime?Kstime:'请选择'}}</span>
      </mt-cell>
      <mt-datetime-picker  month-format="{value} 月" date-format="{value} 日" hourFormat="{value} 时" minuteFormat="{value} 分" @confirm="getDate" ref="picker1" v-model="KstimeShowDate"></mt-datetime-picker>
      <mt-cell ref="field-Jstime" title="结束时间" :is-link="isEdit" @click.native="startPicker('Jstime', 'picker2')">
      <span>{{ Jstime?Jstime:'请选择'}}</span>
      </mt-cell>
      <mt-datetime-picker month-format="{value} 月" date-format="{value} 日" hourFormat="{value} 时" minuteFormat="{value} 分" @confirm="getDate" ref="picker2" v-model="JstimeShowDate"></mt-datetime-picker>
      <mt-field ref="field-qjtime" label="请假时长" :readonly="!isEdit" placeholder="请输入请假时长" type="number" v-model="qjtime"></mt-field>
      <mt-cell ref="field-Hhtime" title="回岗时间" :is-link="isEdit" @click.native="startPicker('Hhtime', 'picker3')">
      <span>{{ Hhtime?Hhtime:'请选择'}}</span>
      </mt-cell>
      <mt-datetime-picker  month-format="{value} 月" date-format="{value} 日" hourFormat="{value} 时" minuteFormat="{value} 分" @confirm="getDate" ref="picker3" v-model="HhtimeShowDate"></mt-datetime-picker>        
      <mt-field  ref="field-mark" title='备注' :readonly="!isEdit" :placeholder="isEdit ? '请输入备注' : '无备注'" type="textarea" v-model="mark" rows="3" ></mt-field>
    </div>
  </div>
  <div  class="buttonArea">
    <p class="checkBtn" v-if="opType === 'detail' && updateRight && workFlowNode === '0'" @click="updatePre">修改</p>
    <p class="checkBtn" v-if="opType === 'detail' && checkRight && workFlowNode !== '0'" @click="$router.push({name:'deliver', params: {tableName, keyId, opType: 'fallback'}})">回退</p>
    <p class="checkBtn" v-if="opType === 'detail' && checkRight" @click="$router.push({name:'deliver', params: {tableName, keyId, opType: 'send'}})">转交</p>
    <p class="checkBtn" v-if="opType === 'detail' && hasCancel" @click="cancel">撤回</p>
    <p class="checkBtn" v-if="opType === 'detail' && hurryTrans" @click="hurry">催办</p>
    <p class="checkBtn" v-if="opType !== 'detail'" @click="saveData">保存并送审</p>
  </div>
</div>
</template>

<script>
import {mapActions, mapMutations, mapGetters} from 'vuex'
import {dateformat} from '../../fmt'
import { Button, Field, Header, DatetimePicker, Cell, Indicator, Toast, MessageBox } from 'mint-ui'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import 'mint-ui/lib/button/style.css'
import 'mint-ui/lib/field/style.css'
import 'mint-ui/lib/header/style.css'
import 'mint-ui/lib/datetime-picker/style.css'
import 'mint-ui/lib/cell/style.css'
import 'mint-ui/lib/indicator/style.css'
import 'mint-ui/lib/toast/style.css'
import 'mint-ui/lib/message-box/style.css'
// 原始数据
let rawData
export default {
  name: 'leaveorder',
  components: {
    'mt-button': Button,
    'mt-field': Field,
    'mt-header': Header,
    'mt-datetime-picker': DatetimePicker,
    'mt-cell': Cell
  },
  mixins: [validationMixin],
  validations: {
    EmployeeID: { required },
    LeavebillType: { required },
    due: { required },
    Kstime: { required },
    Jstime: { required },
    qjtime: { required },
    Hhtime: { required },
    mark: { required }
  },
  data () {
    return {
      // 备注
      mark: '',
      // 批复
      PF: '',
      // 请假事由
      due: '',
      // 职务
      duty: '',
      'tblEmployee.EmpFullName': '',
      EmployeeID: '',
      DepartmentCode: '',
      // 开始时间
      Kstime: '',
      KstimeShowDate: new Date(),
      Jstime: '',
      JstimeShowDate: new Date(),
      LeavebillType: '',
      // 回岗时间
      Hhtime: '',
      HhtimeShowDate: new Date(),
      // 请假小时
      qjtime: '',
      // 回填的时间字段
      _dtPickerFill: '',
      // 请假类型的选项
      selectOption: [
      ],
      // 反审核权限
      retCheckRight: false,
      // 审核权限
      checkRight: false,
      // 催办权限
      hurryTrans: false,
      // 撤回权限
      hasCancel: false,
      // 修改权限
      updateRight: false,
      createByName: null,
      createTime: null,
      workFlowNode: null,
      // 当前单据的操作类型
      opType: 'add'
    }
  },
  computed: {
    tableName () {
      return 'FlowNqingjiadan2'
    },
    keyId () {
      return this.$route.params.keyId
    },
    isEdit () {
      return this.opType !== 'detail'
    },
    lastWorkFlowNode () {
      return this.workFlowNode === '0' ? '开始' : this.getCurFlowDepictLast().workFlowNode
    }
  },
  methods: {
    ...mapActions(['addPre', 'add', 'update', 'popupSelectInfo', 'getEnum', 'detail', 'cancelTo', 'hurryTransFunc']),
    ...mapMutations(['curFlowDepict']),
    ...mapGetters(['getCurFlowDepictLast']),
    'getDate': function (value) {
      this.$data[this._dtPickerFill] = dateformat(value)
    },
    'startPicker': function (_dtPickerFill, _dtPickerRef) {
      if (this.isEdit) {
        this._dtPickerFill = _dtPickerFill
        this.$refs[_dtPickerRef].open()
      }
    },
    // 保存数据
    saveData () {
      this.$v.touch
      if (this.$v.$invalid) {
        let unvalidField = Object.keys(this.$v).filter(item => item in this.$data && this.$v[item].$invalid)
        let field = this.$refs['field-' + unvalidField[0]]
        if (field instanceof window.HTMLElement && field.getAttribute('is-link')) {
          Toast({message: '请选择' + field.getAttribute('title'), duration: 1000})
        } else if (field['isLink']) {
          Toast({message: '请选择' + field.title, duration: 1000})
        } else if (field.title) {
          Toast({message: '请输入' + field.title, duration: 1000})
        } else {
          Toast({message: field.placeholder, duration: 1000})
        }
        return
      }
      let values = Object.assign({}, this.$data)
      Indicator.open({
        text: '数据提交中...',
        spinnerType: 'snake'
      })
      let method = 'add'
      if (this.opType === 'update') {
        method = 'update'
        values.id = this.keyId
        values.printCount = 0
      }
      values = window.JSON.stringify(values)
      let postData = {tableName: this.tableName, values}
      this[method](postData).then(({keyId, tableName}) => {
        Indicator.close()
        if (keyId === undefined) {
          keyId = this.keyId
          tableName = this.tableName
        }
        this.$router.replace({
          name: 'deliver',
          params: {
            tableName: tableName,
            keyId: keyId,
            opType: 'send' // 处理转交或者回退的参数，send是转交，fallback是回退
          }
        })
      }).catch(({message}) => {
        Indicator.close()
        Toast({message: message, duration: 1000})
      })
    },
    fetchData () {
      let vm = this
      if (this.opType === 'add') { // 新增时拉取数据
        // 重置data
        for (let key in vm.$data) {
          vm.$data[key] = rawData[key]
        }
        // 拉取请假单类型
        this.getEnum('LeavebillType').then(data => {
          vm.selectOption.splice(0, vm.selectOption.length)
          vm.selectOption.push({name: '请选择', value: ''})
          data.forEach(item => { vm.selectOption.push(item) })
        }).catch(({message}) => { Toast({message: message, duration: 1000}) })
        // 拉取默认信息
        this.addPre({tableName: this.tableName}).then(({values}) => {
          vm.EmployeeID = values.EmployeeID
          vm['tblEmployee.EmpFullName'] = values['tblEmployee.EmpFullName']
          vm.DepartmentCode = values.DepartmentCode
        })
      } else { // 详情时拉取数据
        this.detail({tableName: this.tableName, keyId: this.keyId}).then(({values, fieldList, retCheckRight, checkRight, hurryTrans, hasCancel, updateRight, flowDepict}) => {
          for (let key in vm.$data) {
            if (key in values) {
              vm.$data[key] = values[key]
            }
          }
          this.retCheckRight = retCheckRight
          this.checkRight = checkRight
          this.hurryTrans = hurryTrans
          this.hasCancel = hasCancel
          this.updateRight = updateRight
          vm.curFlowDepict(flowDepict)
          // 设置请假类型选项
          vm.selectOption.splice(0, vm.selectOption.length)
          vm.selectOption.push({name: '请选择', value: ''})
          fieldList.filter(({fieldName}) => fieldName === 'LeavebillType')[0].EnumItem.forEach(item => { vm.selectOption.push(item) })
          Indicator.close()
        }).catch(({message}) => {
          Indicator.close()
          Toast({ message: message, duration: 1000 })
        })
      }
    },
    chooseEmployee () {
      if (this.isEdit) {
        this.$router.push({name: 'popupEmployee', params: { prevRouteName: this.$route.name }})
      }
    },
    // 催办
    hurry () {
      let vm = this
      MessageBox({
        title: '提示',
        message: '请输入催办信息',
        showCancelButton: true,
        showInput: true,
        inputValue: '有请假单需要你审核，请查看',
        $type: 'confirm'
      })
      .then(({ value: content, action }) => {
        Indicator.open({text: '催办中...', spinnerType: 'snake'})
        vm.hurryTransFunc({tableName: vm.tableName, keyId: vm.keyId, content}).then(message => {
          Indicator.close()
          Toast({ message, duration: 1000 })
        }).catch(message => {
          Indicator.close()
          Toast({ message, duration: 1000 })
        })
      })
    },
    cancel () {
      let vm = this
      MessageBox.confirm('确定要撤回此单据?').then(action => {
        Indicator.open({text: '撤回中...', spinnerType: 'snake'})
        vm.cancelTo({tableName: vm.tableName, keyId: vm.keyId}).then(message => {
          vm.fetchData()
          Indicator.close()
          Toast({ message, duration: 1000 })
        }).catch(message => {
          Indicator.close()
          Toast({ message, duration: 1000 })
        })
      })
    },
    updatePre () {
      let tableName = this.tableName
      let keyId = this.keyId
      this.$router.push({ path: `/workflow/approvedetredirect/${tableName}/${keyId}?opType=update` })
    }
  },
  watch: {
    '$route' (to, from) {
      // 选择请假人员后回填信息
      if (from.name === 'popupEmployee') {
        if (to.params.checked) {
          let checkedEmp = to.params.checked
          this.EmployeeID = checkedEmp.EmployeeID
          this['tblEmployee.EmpFullName'] = checkedEmp.tblEmployee_EmpFullName
          this.DepartmentCode = checkedEmp.DepartmentCode
        }
      } else if (to.name === 'workflowLeaveorder') { // 根据query设置opType
        this.opType = to.query.opType ? to.query.opType : 'add'  // 这时候的opType是update或者detail的其中一种
        this.fetchData() // 拉取数据
      }
    }
  },
  created () {
    // 保存原始数据
    rawData = Object.assign({}, this.$data)
    this.opType = this.$route.query.opType ? this.$route.query.opType : 'add'  // 这时候的opType是detail或者add的其中一种
    this.fetchData() // 拉取数据
  }
}
</script>
<style>
  .mint-msgbox-input input{
    height:26px;
  }
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
  $background-color: #F0F1F5;
  $background-color-block:#fff;
  $p-text-color:#BABABA;
  $p-text-color-light:#26A2FF;
  .page_wrap{
    width: 100%;
    height:100%;
    background:$background-color;
    overflow: hidden;
    .page_cont.detail_page{
      padding:41px 0 45px 0;
      height: 100%;
      box-sizing: border-box;
      background:$background-color;
      overflow-y: auto;
      overflow-x: hidden;
      .main_info
      {
        padding: 0 1rem;
        background: $background-color-block;
        margin-bottom:1rem;
        .createInfo {
          background-image: -webkit-linear-gradient(top, #d9d9d9, #d9d9d9 50%, transparent 50%);
          background-image: linear-gradient(180deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
          background-size: 120% 1px;
          background-repeat: no-repeat;
          background-position: top left;
          background-origin: content-box;
          font-size: 16px;
          padding: 0 10px;
          width: 100%;
          height: 60px;
          position: relative;
          overflow: hidden;
          .creatorImg {
            position: absolute;
            width: 40px;
            height: 40px;
            background-color: gray;
            border-radius: 20px;
            margin: 10px 16px 10px 0;
            img {
              width: 100%;
              height: 100%;
              border: 0;
              border-radius: 50%;
            }
          }
          .creatorInfo {
            box-sizing: border-box;
            height: 40px;
            margin: 10px 0 10px 56px;
            .creator {
              font-weight: bolder;
            }
            .flowDepictLink,.createTime {
              display: inline-block;
              font-size: smaller;
            }
            .flowDepictLink {
              color: #26A2FF;
              min-width: 100px;
            }
            .createTime {
              right: 16px;
            }
          }
        }
      }
      .expen_select{
        padding:0 10px;
        line-height:3rem;
        position: relative;
        label{
          width:105px;
          display:inline-block;
        }
        select{
          position: absolute;
          border: none;
          outline: none;
          height:100%;
          width:180px;
          color:$p-text-color;
          background:$background-color-block;
          font-size:16px;
          appearance:none;
          -moz-appearance:none;
          -webkit-appearance:none;
          right:2.1rem;
          direction: rtl;
          option{
            direction: ltr;
          }
        }
      }
    }
    .mint-header-title{
      font-size:18px;
    }
    .buttonArea {
      border-top:#e8e8e8 solid 1px;
      bottom: 0;
      right: 0;
      left: 0;
      position: fixed;
      z-index: 1;
      height: 30px;
      line-height: 30px;
      background-image: -webkit-linear-gradient(top, #d9d9d9, #d9d9d9 50%, transparent 50%);
      background-image: linear-gradient(180deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
      background-size: 120% 1px;
      background-repeat: no-repeat;
      background-position: top left;
      background-origin: content-box;
      padding: 5px 0;
      background: #fff;
      text-align: center;
      .checkBtn {
        color: #26A2FF;
        font-size: larger;
        width: 49%;
        display: inline-block;
      }
      .checkBtn:nth-last-child(2){
        border-right: 1px solid #7c8192;
      }
    }
  }
</style>
