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

    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" status-icon :rules="formRules">
        <el-form-item label="ID" :label-width="formLabelWidth" prop="id" required>
          <el-input v-model.trim="form.id" :disabled="idInputdis" clearable />
        </el-form-item>
        <el-form-item label="Brand" :label-width="formLabelWidth" prop="brand" required>
          <el-input v-model.trim="form.brand" clearable />
        </el-form-item>
        <el-form-item label="Type" :label-width="formLabelWidth" prop="type" required>
          <el-input v-model.trim="form.type" clearable />
        </el-form-item>
        <el-form-item label="BuyYear" :label-width="formLabelWidth" prop="buyYear" required>
          <el-input-number v-model="form.buyYear" clearable />
        </el-form-item>
        <el-form-item label="License" :label-width="formLabelWidth" prop="license" required>
          <el-input v-model.trim="form.license" clearable />
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

      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="Brand">
        <template slot-scope="scope">
          {{ scope.row.brand }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="Type">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="BuyYear">
        <template slot-scope="scope">
          {{ scope.row.buyYear }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="License">
        <template slot-scope="scope">
          {{ scope.row.license }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="Op">
        <template slot-scope="scope">
          <el-button type="warning" size="small" @click="updateClick(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteClick(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList, newOne, updateOne, deleteOne } from '@/api/vehicle'

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
      idInputdis: false,
      searchName: '',
      title: '',
      list: null,
      opList: null,
      listLoading: true,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      formType: '',
      form: {
        id: '',
        brand: '',
        type: '',
        buyYear: '',
        license: ''
      },
      formRules: {
        id: [{ required: true, trigger: 'blur', validator: validate }],
        brand: [{ required: true, trigger: 'blur', validator: validate }],
        type: [{ required: true, trigger: 'blur', validator: validate }],
        buyYear: [{ required: true, trigger: 'blur', validator: validate }],
        license: [{ required: true, trigger: 'blur', validator: validate }]
      }
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
    search() {
      this.opList = this.list.filter((value) => {
        return value.id.indexOf(this.searchName) !== -1
      })
    },
    addClick() {
      this.title = '新增用户'
      this.clearForm()
      this.formType = 'add'
      this.idInputdis = false
      this.dialogFormVisible = true
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
        if (this.formType === 'add') {
          this.addCommit()
        } else if (this.formType === 'update') {
          this.updateCommit()
        }
      })
    },
    addCommit() {
      newOne(this.form).then((response) => {
        if (response.data.result === false) {
          this.$message('add info fail')
        } else if (response.data.result === true) {
          this.$message('新增用户成功')
          this.clearForm()
          this.refreshList()
        }
        this.dialogFormVisible = false
      })
    },
    updateCommit() {
      updateOne(this.form).then((response) => {
        if (response.data.result === false) {
          this.$message('update info fail')
        } else if (response.data.result === true) {
          this.$message('修改信息成功')
          this.clearForm
          this.refreshList()
        }
        this.dialogFormVisible = false
      })
    },
    updateClick(data) {
      this.title = '信息修改'
      this.form.id = data.id
      this.form.brand = data.brand
      this.form.type = data.type
      this.form.buyYear = data.buyYear
      this.form.license = data.license
      this.formType = 'update'
      this.idInputdis = true
      this.dialogFormVisible = true
    },
    deleteClick(data) {
      deleteOne(data).then((response) => {
        if (response.data.result === false) {
          this.$message(response.data.errorInfo)
        }
        this.refreshList()
      })
    },
    clearForm() {
      this.form.id = ''
      this.form.brand = ''
      this.form.type = ''
      this.form.buyYear = ''
      this.form.license = ''
    },
    refreshList() {
      this.list = null
      this.opList = null
      this.fetchData()
    }
  }
}

</script>
