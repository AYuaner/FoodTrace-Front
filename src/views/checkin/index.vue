<template>
  <div class="app-container">

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
import { getList } from '@/api/checkin'

export default {
  data() {
    return {
      list: null,
      opList: null,
      listLoading: true
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
