<template>
  <div class="app-container">

    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="searchName" placeholder="请输入要查询的用户名" clearable @keydown.enter.native="search" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addClick">新增</el-button>
      </el-form-item>
    </el-form>

    <el-divider />

    <el-dialog title="新增记录" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" status-icon :rules="formRules">
        <el-form-item label="批次ID" :label-width="formLabelWidth" prop="cropsId" required>
          <el-input v-model="form.cropsId" />
        </el-form-item>
        <el-form-item label="作物名称" :label-width="formLabelWidth" prop="cropsName" required>
          <el-input v-model="form.cropsName" />
        </el-form-item>
        <el-form-item label="播种位置" :label-width="formLabelWidth" prop="address" required>
          <el-input v-model="form.address" />
        </el-form-item>

        <el-form-item label="播种时间" :label-width="formLabelWidth" prop="seedTime" required>
          <el-date-picker v-model="form.seedTime" type="datetime" placeholder="select date and time please" />
        </el-form-item>

        <el-form-item label="农场ID" :label-width="formLabelWidth" prop="farmId" required>
          <el-input v-model="form.farmId" disabled />
        </el-form-item>
        <el-form-item label="农场名称" :label-width="formLabelWidth" prop="farmName" required>
          <el-select v-model="form.farmName" placeholder="select farm please" @change="FarmSelectChange">
            <el-option v-for="option in farmOption" :key="option.id" :label="option.name" :value="option.name" />
          </el-select>
        </el-form-item>

        <el-form-item label="操作人员ID" :label-width="formLabelWidth" prop="operatorId" required>
          <el-input v-model="form.operatorId" disabled />
        </el-form-item>
        <el-form-item label="操作人员姓名" :label-width="formLabelWidth" prop="operatorName" required>
          <el-select v-model="form.operatorName" placeholder="select worker please" @change="WorkerSeleceChange">
            <el-option v-for="option in workerOption" :key="option.id" :label="option.name" :value="option.name" />
          </el-select>
        </el-form-item>

        <el-form-item label="备注" :label-width="formLabelWidth" prop="remarks" required>
          <el-input v-model="form.remarks" type="textarea" :rows="2" placeholder="please make remarks" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="commit">确 定</el-button>
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
      <el-table-column label="批次ID" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.cropsId }}
        </template>
      </el-table-column>
      <el-table-column label="作物名称" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cropsName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="播种位置" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column label="播种时间" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.seedTime }}
        </template>
      </el-table-column>
      <el-table-column label="农场ID" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.farmId }}
        </template>
      </el-table-column>
      <el-table-column label="农场名称" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.farmName }}
        </template>
      </el-table-column>
      <el-table-column label="操作人员ID" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.operatorId }}
        </template>
      </el-table-column>
      <el-table-column label="操作人员姓名" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.operatorName }}
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          {{ scope.row.remarks }}
        </template>
      </el-table-column>
      <el-table-column label="记录时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.createdTime }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList, newOne } from '@/api/seed'
import { getList as getFarms } from '@/api/farm'
import { getList as getWorkers } from '@/api/worker'

export default {
  data() {
    const validate = (rule, value, callback) => {
      if (value.length < 0) {
        callback(new Error('不能为空'))
        return
      } else {
        callback()
      }
    }
    return {
      searchName: '',
      list: null,
      opList: null,
      listLoading: true,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      form: {
        cropsId: '',
        cropsName: '',
        address: '',
        seedTime: '',
        farmId: '',
        farmName: '',
        operatorId: '',
        operatorName: '',
        remarks: '',
        createdTime: ''
      },
      formRules: {
        cropsId: [{ required: true, trigger: 'blur', validator: validate }],
        cropsName: [{ required: true, trigger: 'blur', validator: validate }],
        address: [{ required: true, trigger: 'blur', validator: validate }],
        seedTime: [{ required: true, trigger: 'blur', validator: validate }],
        farmId: [{ required: true, trigger: 'blur', validator: validate }],
        farmName: [{ required: true, trigger: 'blur', validator: validate }],
        operatorId: [{ required: true, trigger: 'blur', validator: validate }],
        operatorName: [{ required: true, trigger: 'blur', validator: validate }],
        remarks: [{ required: true, trigger: 'blur', validator: validate }]
      },
      farmOption: '',
      workerOption: ''
    }
  },
  watch: {
    searchName(value) {
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
    addClick() {
      this.clearForm
      this.dialogFormVisible = true
      this.getFarmList()
      this.getWorkerList()
    },
    cancel() {
      this.clearForm()
      this.dialogFormVisible = false
    },
    commit() {
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
          this.$message('新增成功')
          this.clearForm()
          this.list = ''
          this.fetchData()
        }
        this.dialogFormVisible = false
      })
    },
    search() {
      this.opList = this.list.filter((value) => {
        return value.cropsId.indexOf(this.searchName) !== -1
      })
    },
    getFarmList() {
      getFarms().then((reponse) => {
        this.farmOption = reponse.data.listData
      })
    },
    FarmSelectChange(value) {
      this.farmOption.forEach(element => {
        if (element.name === value) {
          this.form.farmId = element.id
        }
      })
    },
    getWorkerList() {
      getWorkers().then((response) => {
        this.workerOption = response.data.listData
      })
    },
    WorkerSeleceChange(value) {
      this.workerOption.forEach(element => {
        if (element.name === value) {
          this.form.operatorId = element.id
        }
      })
    },
    clearForm() {
      this.form.cropsId = ''
      this.form.cropsName = ''
      this.form.address = ''
      this.form.seedTime = ''
      this.form.farmId = ''
      this.form.farmName = ''
      this.form.operatorId = ''
      this.form.operatorName = ''
      this.form.remarks = ''
      this.form.createdTime = ''
    }
  }
}

</script>
