<template>
  <div class="app-container">

    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="searchContent" placeholder="请输入要查询品牌" clearable @keydown.enter.native="search" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addClick">新增</el-button>
      </el-form-item>
    </el-form>

    <el-divider />

    <!-- Dialog to Add or Edit -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" status-icon :rules="formRules">
        <el-form-item v-if="formType === 'update'" label="ID" :label-width="formLabelWidth" prop="id">
          <el-input v-model.trim="form.id" disabled />
        </el-form-item>
        <el-form-item label="Brand" :label-width="formLabelWidth" prop="品牌" required>
          <el-input v-model.trim="form.brand" clearable />
        </el-form-item>
        <el-form-item label="Type" :label-width="formLabelWidth" prop="型号" required>
          <el-input v-model.trim="form.type" clearable />
        </el-form-item>
        <el-form-item label="BuyYear" :label-width="formLabelWidth" prop="购置年份" required>
          <el-input-number v-model="form.buyYear" clearable />
        </el-form-item>
        <el-form-item label="License" :label-width="formLabelWidth" prop="车牌号" required>
          <el-input v-model.trim="form.license" clearable />
        </el-form-item>
        <el-form-item v-if="isAdmin" label="所属公司" :label-width="formLabelWidth" prop="company" required>
          <el-select v-model="form.company" placeholder="请选择所属公司">
            <el-option v-for="item in companyOption" :key="item.id" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCancleClick">取 消</el-button>
        <el-button type="primary" @click="dialogCommitClick">确 定</el-button>
      </div>
    </el-dialog>

    <!-- Worker Info Table -->
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

      <el-table-column v-if="isAdmin" align="center" label="ID" width="90">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="品牌" width="120">
        <template slot-scope="scope">
          {{ scope.row.brand }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="型号">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="购置年份" width="90">
        <template slot-scope="scope">
          {{ scope.row.buyYear }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="车牌号">
        <template slot-scope="scope">
          {{ scope.row.license }}
        </template>
      </el-table-column>
      <el-table-column v-if="isAdmin" align="center" label="所属公司">
        <template slot-scope="scope">
          {{ scope.row.company }}
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
import { getList, newOne, updateOne, deleteOne } from '@/api/vehicle'
import { getList as getCompanyList } from '@/api/company'
import store from '@/store'

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
      companyOption: '',
      dataList: null,
      dialogFormVisible: false,
      dialogTitle: '',
      form: {
        id: '',
        brand: '',
        type: '',
        buyYear: '',
        license: '',
        company: ''
      },
      formLabelWidth: '120px',
      formRules: {
        brand: [{ required: true, trigger: 'blur', validator: validate }],
        type: [{ required: true, trigger: 'blur', validator: validate }],
        buyYear: [{ required: true, trigger: 'blur', validator: validate }],
        license: [{ required: true, trigger: 'blur', validator: validate }]
      },
      formType: '',
      isAdmin: false,
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
    // get the role of user
    this.isAdmin = store.getters.roles[0] === 'admin'
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
    // get data to fill the `company` option
    fetchCompanyOptionData() {
      this.listLoading = true
      getCompanyList().then((reponse) => {
        this.companyOption = reponse.data.listData
        this.listLoading = false
      })
    },
    // click evenn of the button '搜索'
    search() {
      this.opDataList = this.dataList.filter((value) => {
        return value.brand.indexOf(this.searchContent) !== -1
      })
    },
    // click event of the button '新增'
    addClick() {
      this.dialogTitle = '新增载具'
      this.clearForm()
      this.formType = 'add'
      this.fetchCompanyOptionData()
      this.dialogFormVisible = true
    },
    // click event of the button '编辑'
    updateClick(data) {
      this.dialogTitle = '信息修改'
      this.form = data
      this.formType = 'update'
      this.fetchCompanyOptionData()
      this.dialogFormVisible = true
    },
    // dialog cancle and commit button
    dialogCancleClick() {
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
          this.$message('修改信息成功')
          this.clearForm
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
      this.form.brand = ''
      this.form.type = ''
      this.form.buyYear = ''
      this.form.license = ''
      this.form.company = ''
    },
    refreshList() {
      this.dataList = null
      this.opDataList = null
      this.fetchTableData()
    }
  }
}

</script>
