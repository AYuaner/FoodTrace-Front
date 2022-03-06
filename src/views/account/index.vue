<template>
  <div class="app-container">
    <el-button type="primary" @click="dialogFormVisible = true">新建用户</el-button>
    <el-divider />
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model.trim="form.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model.trim="form.password" auto-complete="off" />
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-input v-model.trim="form.role" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="commit">确 定</el-button>
      </div>
    </el-dialog>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Username" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="Password" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Role" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.role }}
        </template>
      </el-table-column>
      <el-table-column label="Status" width="200" align="center">
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
import { getList, updateEnable, newAccount } from '@/api/account'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogFormVisible: false,
      form: {
        username: '',
        password: '',
        role: ''
      },
      formLabelWidth: '120px'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then((response) => {
        this.list = response.data.accounts
        this.listLoading = false
      })
    },
    changeEnable(data) {
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
      this.dialogFormVisible = false
    },
    commit() {
      newAccount(this.form).then((response) => {
        if (response.data.result === false) {
          this.$message('新增用户失败')
        } else if (response.data.result === true) {
          this.$message('新增用户成功')
          this.form.username = ''
          this.form.password = ''
          this.form.role = ''
          this.list = ''
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
新建用户时的表单验证
查询单个用户功能
编辑用户信息功能
分页功能
*/
</script>
