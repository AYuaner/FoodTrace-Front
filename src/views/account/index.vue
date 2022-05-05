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
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username" required>
          <el-input v-model.trim="form.username" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password" required>
          <el-input v-model.trim="form.password" />
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth" required>
          <el-input v-model.trim="form.role" />
        </el-form-item>
        <el-form-item label="公司" :label-width="formLabelWidth" required>
          <el-input v-model.trim="form.company" />
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
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="密码" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.role }}
        </template>
      </el-table-column>
      <el-table-column label="公司" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.company }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updateClick(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column label="启用" width="200" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            @change="changeEnable(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList, updateEnable, newAccount, updateAccount } from '@/api/account'
import { validUsername } from '@/utils/validate'

export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
        return
      } else {
        callback()
      }
    }
    const validataPassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
        return
      } else {
        callback()
      }
    }
    return {
      searchName: '',
      title: '',
      list: null,
      opList: null,
      listLoading: true,
      dialogFormVisible: false,
      formType: '',
      form: {
        id: '',
        username: '',
        password: '',
        role: '',
        company: ''
      },
      formLabelWidth: '120px',
      formRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validataPassword }]
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
        this.list = response.data.listData
        this.opList = response.data.listData
        this.listLoading = false
      })
    },
    changeEnable(data) {
      console.log(data)
      this.listLoading = true
      updateEnable(data).then((response) => {
        if (response.data.result === false) {
          this.$message('更新状态失败')
          this.list[data.id].enable = !data.enable
        }
        this.listLoading = false
      })
    },
    cancel() {
      this.form.username = ''
      this.form.password = ''
      this.form.role = ''
      this.form.company = ''
      this.dialogFormVisible = false
    },
    commit() {
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
      newAccount(this.form).then((response) => {
        if (response.data.result === false) {
          this.$message('新增用户失败')
        } else if (response.data.result === true) {
          this.$message('新增用户成功')
          this.form.username = ''
          this.form.password = ''
          this.form.role = ''
          this.form.company = ''
          this.list = ''
          this.fetchData()
        }
        this.dialogFormVisible = false
      })
    },
    updateCommit() {
      updateAccount(this.form).then((response) => {
        if (response.data.result === false) {
          this.$message('修改信息失败')
        } else if (response.data.result === true) {
          this.$message('修改信息成功')
          this.form.username = ''
          this.form.password = ''
          this.form.role = ''
          this.form.company = ''
          this.list = ''
          this.fetchData()
        }
        this.dialogFormVisible = false
      })
    },
    search() {
      this.opList = this.list.filter((value) => {
        return value.username.indexOf(this.searchName) !== -1
      })
    },
    addClick() {
      this.title = '新增用户'
      this.form.username = ''
      this.form.password = ''
      this.form.role = ''
      this.form.company = ''
      this.formType = 'add'
      this.dialogFormVisible = true
    },
    updateClick(data) {
      this.title = '信息修改'
      this.form.id = data.id
      this.form.username = data.username
      this.form.password = data.password
      this.form.role = data.role
      this.form.company = data.company
      this.formType = 'update'
      this.dialogFormVisible = true
    }
  }
}

</script>
