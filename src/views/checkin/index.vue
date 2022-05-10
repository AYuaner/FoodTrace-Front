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

    <el-dialog title="New Record" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" status-icon :rules="formRules">
        <el-form-item label="CropsID" :label-width="formLabelWidth" prop="cropsId" required>
          <el-input v-model="form.cropsId" />
        </el-form-item>

        <el-form-item label="Company" :label-width="formLabelWidth" prop="company" required>
          <el-input v-model="form.company" />
        </el-form-item>

        <el-form-item label="位置" :label-width="formLabelWidth" prop="location" required>
          <el-input v-model="form.location" />
        </el-form-item>

        <el-form-item label="OperatorId" :label-width="formLabelWidth" prop="operatorId" required>
          <el-input v-model="form.operatorId" disabled />
        </el-form-item>

        <el-form-item label="操作人员" :label-width="formLabelWidth" prop="operatorName" required>
          <el-select v-model="form.operatorName" placeholder="select driver please" @change="workerSelectChange">
            <el-option v-for="option in workerOption" :key="option.id" :label="option.name" :value="option.name" />
          </el-select>
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
      <el-table-column label="CropsId" align="center">
        <template slot-scope="scope">
          {{ scope.row.cropsId }}
        </template>
      </el-table-column>
      <el-table-column label="Company" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.company }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Location" align="center">
        <template slot-scope="scope">
          {{ scope.row.location }}
        </template>
      </el-table-column>
      <el-table-column label="OperatorId" align="center">
        <template slot-scope="scope">
          {{ scope.row.operatorId }}
        </template>
      </el-table-column>
      <el-table-column label="OperatorName" align="center">
        <template slot-scope="scope">
          {{ scope.row.operatorName }}
        </template>
      </el-table-column>
      <el-table-column label="Remark" align="center">
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
import { getList, newOne } from '@/api/checkin'
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
      listLoading: true,
      searchContent: '',
      formLabelWidth: '120px',
      dialogFormVisible: false,
      form: {
        cropsId: '',
        company: '',
        location: '',
        operatorId: '',
        operatorName: '',
        createdTime: '',
        remarks: ''
      },
      formRules: {
        cropsId: [{ required: true, trigger: 'blur', validator: validate }],
        company: [{ required: true, trigger: 'blur', validator: validate }],
        location: [{ required: true, trigger: 'blur', validator: validate }],
        operatorId: [{ required: true, trigger: 'blur', validator: validate }],
        operatorName: [{ required: true, trigger: 'blur', validator: validate }],
        createdTime: [{ required: true, trigger: 'blur', validator: validate }],
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
      this.opList = this.list.filtert((element) => {
        return element.cropsId.indexOf(this.searchContent) !== -1
      })
    },
    addClick() {
      this.clearForm()
      this.dialogFormVisible = true
      this.getWorkerList()
    },
    clearForm() {
      this.form.cropsId = ''
      this.form.company = ''
      this.form.location = ''
      this.form.operatorId = ''
      this.form.operatorName = ''
      this.form.createdTime = ''
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
          if (response.data.errorInfo === null) {
            this.$message('添加失败')
          } else {
            this.$message(response.data.errorInfo)
          }
        } else if (response.data.result === true) {
          this.$message('添加成功')
          this.clearForm()
          this.list = ''
          this.opList = ''
          this.fetchData()
        }
        this.dialogFormVisible = false
      })
    }
  }
}

// TODO 完成account/index相关开发

/*
TODO
新建用户时的表单验证 X
查询单个用户功能 X
编辑用户信息功能 X
分页功能
*/
</script>
