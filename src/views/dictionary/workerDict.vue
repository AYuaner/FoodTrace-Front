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
        <el-form-item label="WorkerID" :label-width="formLabelWidth" prop="id" required>
          <el-input v-model.trim="form.id" :disabled="idInputdis" clearable />
        </el-form-item>
        <el-form-item label="Name" :label-width="formLabelWidth" prop="name" required>
          <el-input v-model.trim="form.name" clearable />
        </el-form-item>
        <el-form-item label="Age" :label-width="formLabelWidth" prop="age" required>
          <el-input v-model.trim="form.age" clearable />
        </el-form-item>
        <el-form-item label="Gender" :label-width="formLabelWidth" prop="gender" required>
          <el-radio-group v-model="form.gender">
            <el-radio-button v-model="form.gender" label="true">Male</el-radio-button>
            <el-radio-button v-model="form.gender" label="false">Female</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="PhoneNumber" :label-width="formLabelWidth" prop="phoneNumber" required>
          <el-input v-model.trim="form.phoneNumber" maxlength="11" mshow-word-limit clearable />
        </el-form-item>
        <el-form-item label="ID-Number" :label-width="formLabelWidth" prop="idNumber" required>
          <el-input v-model.trim="form.idNumber" maxlength="18" show-word-limit clearable />
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
      <el-table-column align="center" label="WorkerID">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Name">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Age">
        <template slot-scope="scope">
          {{ scope.row.age }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Gender">
        <template slot-scope="scope">
          {{ scope.row.gender }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="PhoneNumber">
        <template slot-scope="scope">
          {{ scope.row.phoneNumber }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="IDNumber">
        <template slot-scope="scope">
          {{ scope.row.idNumber }}
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
import { getList, newOne, updateOne, deleteOne } from '@/api/worker'

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
    const IDvalidate = (rule, value, callback) => {
      if (value.length < 18) {
        callback(new Error('id number shuold be 18'))
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
        name: '',
        age: '',
        gender: true,
        phoneNumber: '',
        idNumber: ''
      },
      formRules: {
        id: [{ required: true, trigger: 'blur', validator: validate }],
        name: [{ required: true, trigger: 'blur', validator: validate }],
        age: [{ required: true, trigger: 'blur', validator: validate }],
        phoneNumber: [{ required: true, trigger: 'blur', validator: validate }],
        idNumber: [{ required: true, trigger: 'blur', validator: IDvalidate }]
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
        return value.name.indexOf(this.searchName) !== -1
      })
    },
    addClick() {
      this.title = '新增用户'
      this.form.id = ''
      this.form.name = ''
      this.form.age = ''
      this.form.gender = true
      this.form.phoneNumber = ''
      this.form.idNumber = ''
      this.formType = 'add'
      this.idInputdis = false
      this.dialogFormVisible = true
    },
    cancel() {
      this.form.id = ''
      this.form.name = ''
      this.form.age = ''
      this.form.gender = true
      this.form.phoneNumber = ''
      this.form.idNumber = ''
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
      newOne(this.form).then((response) => {
        if (response.data.result === false) {
          this.$message(response.data.errorInfo)
        } else if (response.data.result === true) {
          this.$message('新增用户成功')
          this.form.id = ''
          this.form.name = ''
          this.form.age = ''
          this.form.gender = true
          this.form.phoneNumber = ''
          this.form.idNumber = ''
          this.list = ''
          this.fetchData()
        }
        this.dialogFormVisible = false
      })
    },
    updateCommit() {
      updateOne(this.form).then((response) => {
        if (response.data.result === false) {
          this.$message(response.data.errorInfo)
        } else if (response.data.result === true) {
          this.$message('修改信息成功')
          this.form.id = ''
          this.form.name = ''
          this.form.age = ''
          this.form.gender = true
          this.form.phoneNumber = ''
          this.form.idNumber = ''
          this.list = ''
          this.fetchData()
        }
        this.dialogFormVisible = false
      })
    },
    updateClick(data) {
      this.title = '信息修改'
      this.form.id = data.id
      this.form.name = data.name
      this.form.age = data.age
      this.form.gender = data.gender
      this.form.phoneNumber = data.phoneNumber
      this.form.idNumber = data.idNumber
      this.formType = 'update'
      this.idInputdis = true
      this.dialogFormVisible = true
    },
    deleteClick(data) {
      deleteOne(data).then((response) => {
        if (response.data.result === false) {
          this.$message(response.data.errorInfo)
        }
        this.list = ''
        this.fetchData()
      })
    },
    changeClick(data) {
      console.log(data)
    }
  }
}

</script>
