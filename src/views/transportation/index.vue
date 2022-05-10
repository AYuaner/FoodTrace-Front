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

        <el-form-item label="StartLoc" :label-width="formLabelWidth" prop="startLocation" required>
          <el-input v-model="form.startLocation" />
        </el-form-item>

        <el-form-item label="StartTime" :label-width="formLabelWidth" prop="startTime" required>
          <el-date-picker v-model="form.startTime" type="datetime" placeholder="select date and time please" />
        </el-form-item>

        <el-form-item label="EndLoc" :label-width="formLabelWidth" prop="endLocation" required>
          <el-input v-model="form.endLocation" />
        </el-form-item>

        <el-form-item label="StartTime" :label-width="formLabelWidth" prop="endTime" required>
          <el-date-picker v-model="form.endTime" type="datetime" placeholder="select date and time please" />
        </el-form-item>

        <el-form-item label="Vehicle" :label-width="formLabelWidth" prop="vehicle" required>
          <el-select v-model="form.vehicle" placeholder="select vehicle please">
            <el-option v-for="option in vehicleOption" :key="option.id" :label="option.brand +'-'+ option.type" :value="option.brand +'-'+ option.type" />
          </el-select>
        </el-form-item>

        <el-form-item label="Driver" :label-width="formLabelWidth" prop="vehicle" required>
          <el-select v-model="form.driver" placeholder="select driver please">
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
      <el-table-column label="StartLoc" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.startLocation }}
        </template>
      </el-table-column>
      <el-table-column label="StartTime" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.startTime }}
        </template>
      </el-table-column>
      <el-table-column label="EndLoc" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.endLocation }}
        </template>
      </el-table-column>
      <el-table-column label="EndTime" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.endTime }}
        </template>
      </el-table-column>
      <el-table-column label="Vehicle" align="center">
        <template slot-scope="scope">
          {{ scope.row.vehicle }}
        </template>
      </el-table-column>
      <el-table-column label="Driver" align="center">
        <template slot-scope="scope">
          {{ scope.row.driver }}
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
import { getList, newOne } from '@/api/transportation'
import { getList as getWorker } from '@/api/worker'
import { getList as getVehicle } from '@/api/vehicle'

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
      dialogFormVisible: false,
      formLabelWidth: '120px',
      searchContent: '',
      form: {
        cropsId: '',
        company: '',
        startLocation: '',
        startTime: '',
        endLocation: '',
        endTime: '',
        vehicle: '',
        driver: '',
        remarks: '',
        createdTime: ''
      },
      formRules: {
        cropsId: [{ required: true, trigger: 'blur', validator: validate }],
        company: [{ required: true, trigger: 'blur', validator: validate }],
        startLocation: [{ required: true, trigger: 'blur', validator: validate }],
        startTime: [{ required: true, trigger: 'blur', validator: validate }],
        endLocation: [{ required: true, trigger: 'blur', validator: validate }],
        endTime: [{ required: true, trigger: 'blur', validator: validate }],
        vehicle: [{ required: true, trigger: 'blur', validator: validate }],
        driver: [{ required: true, trigger: 'blur', validator: validate }],
        remarks: [{ required: true, trigger: 'blur', validator: validate }]
      },
      workerOption: '',
      vehicleOption: ''
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
      this.getVehicleList()
    },
    clearForm() {
      this.form.cropsId = ''
      this.form.company = ''
      this.form.startLocation = ''
      this.form.startTime = ''
      this.form.endLocation = ''
      this.form.endTime = ''
      this.form.vehicle = ''
      this.form.driver = ''
      this.form.remarks = ''
    },
    getWorkerList() {
      getWorker().then((response) => {
        this.workerOption = response.data.listData
      })
    },
    getVehicleList() {
      getVehicle().then((response) => {
        this.vehicleOption = response.data.listData
      })
    },
    cancelClick() {
      this.clearForm
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
            this.$message('Add Info Fail')
          } else {
            this.$message(response.data.errorInfo)
          }
        } else if (response.data.result === true) {
          this.$message('Add Success')
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

// TODO expectd array but got string with value ""

</script>
