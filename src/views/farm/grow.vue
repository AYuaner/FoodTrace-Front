<template>
  <div class="app-container">

    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="searchContent" placeholder="请输入要查询CropsID" clearable @keydown.enter.native="search" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchClick">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addClick">新增</el-button>
      </el-form-item>
    </el-form>

    <el-divider />

    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" status-icon :rules="formRules">
        <el-form-item label="OperationId" :label-width="formLabelWidth" prop="operationId" required>
          <el-input v-model="form.operationId" />
        </el-form-item>

        <el-form-item label="CropsID" :label-width="formLabelWidth" prop="cropsId" required>
          <el-input v-model="form.cropsId" />
        </el-form-item>

        <el-form-item label="OperateType" :label-width="formLabelWidth" prop="operateType" required>
          <el-select v-model="form.operateType" placeholder="select operateType please">
            <el-option label="除草" value="除草" />
            <el-option label="驱虫" value="驱虫" />
            <el-option label="施肥" value="施肥" />
          </el-select>
        </el-form-item>

        <el-form-item label="OperateTime" :label-width="formLabelWidth" prop="operateTime" required>
          <el-date-picker v-model="form.operateTime" type="datetime" placeholder="select date and time please" />
        </el-form-item>

        <el-form-item label="OperatorId" :label-width="formLabelWidth" prop="operatorId" required>
          <el-input v-model="form.operatorId" disabled />
        </el-form-item>

        <el-form-item label="OperatorName" :label-width="formLabelWidth" prop="operatorName" required>
          <el-select v-model="form.operatorName" placeholder="select worker please" @change="workerSelectChange">
            <el-option v-for="option in workerOption" :key="option.id" :label="option.name" :value="option.name" />
          </el-select>
        </el-form-item>

        <el-form-item label="Tools" :label-width="formLabelWidth" prop="tools" required>
          <el-input v-model="form.tools" />
        </el-form-item>

        <el-form-item label="Remarks" :label-width="formLabelWidth" prop="remarks" required>
          <el-input v-model="form.remarks" type="textarea" :rows="2" placeholder="please make remarks" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelClick">取 消</el-button>
        <el-button type="primary" @click="commitClick">确 定</el-button>
      </div>
    </el-dialog>

    <el-table
      v-loading="listLoading"
      :data="opList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="OperationId" align="center">
        <template slot-scope="scope">
          {{ scope.row.operationId }}
        </template>
      </el-table-column>
      <el-table-column label="批次ID" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.cropsId }}
        </template>
      </el-table-column>
      <el-table-column label="OperateType" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operateType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="OperateTime" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.operateTime }}
        </template>
      </el-table-column>
      <el-table-column label="OperatorId" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.operatorId }}
        </template>
      </el-table-column>
      <el-table-column label="OperatorName" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.operatorName }}
        </template>
      </el-table-column>
      <el-table-column label="Tools" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.tools }}
        </template>
      </el-table-column>
      <el-table-column label="Remarks" align="center">
        <template slot-scope="scope">
          {{ scope.row.remarks }}
        </template>
      </el-table-column>
      <el-table-column label="CreatedTime" align="center">
        <template slot-scope="scope">
          {{ scope.row.createdTime }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList, newOne } from '@/api/grow'
import { getList as getWorker } from '@/api/worker'

export default {
  data() {
    const validate = (rule, value, callback) => {
      if (value.length < 0) {
        callback(new Error('cant be empty'))
        return
      } else {
        callback()
      }
    }
    return {
      list: null,
      opList: null,
      title: '',
      listLoading: true,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      searchContent: '',
      form: {
        operationId: '',
        cropsId: '',
        operateType: '',
        operateTime: '',
        operatorId: '',
        operatorName: '',
        tools: '',
        remarks: ''
      },
      formRules: {
        operationId: [{ required: true, trigger: 'blur', validator: validate }],
        cropsId: [{ required: true, trigger: 'blur', validator: validate }],
        operateType: [{ required: true, trigger: 'blur', validator: validate }],
        operateTime: [{ required: true, trigger: 'blur', validator: validate }],
        operatorId: [{ required: true, trigger: 'blur', validator: validate }],
        operatorName: [{ required: true, trigger: 'blur', validator: validate }],
        tools: [{ required: true, trigger: 'blur', validator: validate }],
        remarks: [{ required: true, trigger: 'blur', validator: validate }]
      },
      workerOption: ''
    }
  },
  watch: {
    searchContent(value) {
      if (value === '') {
        this.opList = this.list
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then((response) => {
        this.list = response.data.result
        this.opList = response.data.result
        this.listLoading = false
      })
    },
    searchClick() {
      this.opList = this.list.filter((element) => {
        return element.cropsId.indexOf(this.searchContent) !== -1
      })
    },
    addClick() {
      this.title = 'New Record'
      this.clearForm()
      this.dialogFormVisible = true
      this.getWorkerList()
    },
    clearForm() {
      this.form.operationId = ''
      this.form.cropsId = ''
      this.form.operateType = ''
      this.form.operateTime = ''
      this.form.operatorId = ''
      this.form.operatorName = ''
      this.form.tools = ''
      this.form.remarks = ''
    },
    getWorkerList() {
      getWorker().then((response) => {
        this.workerOption = response.data.listData
      })
    },
    workerSelectChange(value) {
      this.workerOption.forEach(element => {
        if (element.name === value) {
          this.form.operatorId = element.id
        }
      })
    },
    cancelClick() {
      this.clearForm()
      this.dialogFormVisible = false
    },
    commitClick() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          console.log('error submit!!')
          return false
        }
        this.addCommit()
      })
    },
    addCommit() {
      newOne(this.form).then((response) => {
        if (response.data.result === false) {
          this.$message(response.data.errorInfo)
        } else if (response.data.result === true) {
          this.$message('Add Success')
          this.clearForm()
          this.list = ''
          this.fetchData()
        }
        this.dialogFormVisible = false
      })
    }
  }
}

</script>
