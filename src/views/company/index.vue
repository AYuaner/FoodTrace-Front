<template>
  <div class="app-container">

    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="searchContent" placeholder="请输入要查询农场名" clearable @keydown.enter.native="searchClick" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchClick">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addClick">新增</el-button>
      </el-form-item>
    </el-form>

    <el-divider />

    <!-- Dialog to Add or Edit -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" status-icon :rules="formRules">
        <el-form-item v-if="formType === 'update'" label="ID" :label-width="formLabelWidth" prop="ID">
          <el-input v-model.trim="form.id" disabled />
        </el-form-item>
        <el-form-item label="公司名" :label-width="formLabelWidth" prop="name" required>
          <el-input v-model.trim="form.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCancleClick">取 消</el-button>
        <el-button type="primary" @click="dialogCommitClick">确 定</el-button>
      </div>
    </el-dialog>

    <el-table
      v-loading="listLoading"
      :data="opDataList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="90">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column v-if="isAdmin" align="center" label="FarmID" width="90">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="公司名">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="warning" size="small" @click="updateClick(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteClick(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList, newOne, updateOne, deleteOne } from '@/api/company'

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
      dataList: null,
      dialogFormVisible: false,
      dialogTitle: '',
      form: {
        id: '',
        name: ''
      },
      formLabelWidth: '120px',
      formRules: {
        name: [{ required: true, trigger: 'blur', validator: validate }]
      },
      formType: '',
      listLoading: true,
      opDataList: null,
      searchContent: ''
    }
  },
  watch: {
    searchContent(value) {
      if (value === '') {
        this.opDataList = this.dataList
      }
    }
  },
  created() {
    this.fetchTableData()
  },
  methods: {
    // get data to fill the table
    fetchTableData() {
      this.listLoading = true
      getList().then((response) => {
        this.dataList = response.data.listData
        this.opDataList = response.data.listData
        this.listLoading = false
      })
    },
    // click evenn of the button '搜索'
    searchClick() {
      this.opDataList = this.dataList.filter((value) => {
        return value.name.indexOf(this.searchContent) !== -1
      })
    },
    // click event of the button '新增'
    addClick() {
      this.title = '新增用户'
      this.clearForm()
      this.formType = 'add'
      this.dialogFormVisible = true
    },
    // click event of the button '编辑'
    updateClick(data) {
      this.title = '信息修改'
      this.form = data
      this.formType = 'update'
      this.dialogFormVisible = true
    },
    // dialog cancle and commit button
    dialogCancleClick() {
      this.clearForm()
      this.dialogFormVisible = false
    },
    dialogCommitClick() {
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
    // commit request when the dialog for add
    addCommit() {
      newOne(this.form).then((response) => {
        if (response.data.result === false) {
          this.$message(response.data.errorInfo)
        } else if (response.data.result === true) {
          this.$message('新增成功')
          this.clearForm()
          this.refreshList()
          this.dialogFormVisible = false
        }
      })
    },
    // commit request when the dialog for update
    updateCommit() {
      updateOne(this.form).then((response) => {
        if (response.data.result === false) {
          this.$message(response.data.errorInfo)
        } else if (response.data.result === true) {
          this.$message('修改成功')
          this.clearForm()
          this.refreshList()
          this.dialogFormVisible = false
        }
      })
    },
    // click event of the button '删除'
    deleteClick(data) {
      deleteOne(data).then((response) => {
        if (response.data.result === false) {
          this.$message(response.data.errorInfo)
        } else if (response.data.result === true) {
          this.$message('删除成功')
          this.refreshList()
        }
      })
    },
    clearForm() {
      this.form.id = ''
      this.form.name = ''
    },
    refreshList() {
      this.dataList = null
      this.opDataList = null
      this.fetchTableData()
    }
  }
}

</script>
