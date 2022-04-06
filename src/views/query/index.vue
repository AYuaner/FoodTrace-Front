<template>
  <div class="login-container">
    <el-form ref="form" :model="form" :rules="rules" class="login-form" label-position="left">

      <div class="title-container">
        <h3 class="title">FoodTrace Info</h3>
      </div>

      <el-form-item prop="traceCode">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model="form.traceCode"
          placeholder="Please enter traceCode"
          name="traceCode"
          type="text"
        />
      </el-form-item>

      <el-dialog class="traceInfoDialog" title="TraceInfo" :visible.sync="dialogFormVisible">
        <el-timeline>
          <!-- SeedInfo -->
          <el-timeline-item :timestamp="seedInfo.seedTime" placement="top">
            <el-card>
              <h4>SeedInfo</h4>
              <table cellspacing="10">
                <tr>
                  <td><b>CropsName:</b></td>
                  <td>{{ seedInfo.cropsName }}</td>
                </tr>
                <tr>
                  <td><b>FarmName:</b></td>
                  <td>{{ seedInfo.farmName }}</td>
                </tr>
                <tr>
                  <td><b>Address:</b></td>
                  <td>{{ seedInfo.address }}</td>
                </tr>
                <tr>
                  <td><b>Operator:</b></td>
                  <td>{{ seedInfo.operatorName }}</td>
                </tr>
                <tr>
                  <td><b>Remarks:</b></td>
                  <td>{{ seedInfo.remarks }}</td>
                </tr>
                <tr>
                  <td><b>RecordTime:</b></td>
                  <td>{{ seedInfo.createdTime }}</td>
                </tr>
              </table>
            </el-card>
          </el-timeline-item>
          <!-- GrowInfo -->
          <el-timeline-item v-for="element in growInfo" :key="element.operationId" :timestamp="element.operateTime" placement="top">
            <el-card>
              <h4>GrowInfo</h4>
              <table cellspacing="10">
                <tr>
                  <td><b>OperateType:</b></td>
                  <td>{{ element.operateType }}</td>
                </tr>
                <tr>
                  <td><b>Operator:</b></td>
                  <td>{{ element.operatorName }}</td>
                </tr>
                <tr>
                  <td><b>Tools:</b></td>
                  <td>{{ element.tools }}</td>
                </tr>
                <tr>
                  <td><b>Remarks:</b></td>
                  <td>{{ element.remarks }}</td>
                </tr>
                <tr>
                  <td><b>RecordTime:</b></td>
                  <td>{{ element.createdTime }}</td>
                </tr>
              </table>
            </el-card>
          </el-timeline-item>
          <!-- PickInfo -->
          <el-timeline-item :timestamp="pickInfo.operateTime" placement="top">
            <el-card>
              <h4>PickInfo</h4>
              <table cellspacing="10">
                <tr>
                  <td><b>Operator:</b></td>
                  <td>{{ pickInfo.operatorName }}</td>
                </tr>
                <tr>
                  <td><b>Remarks:</b></td>
                  <td>{{ pickInfo.remarks }}</td>
                </tr>
                <tr>
                  <td><b>RecordTime:</b></td>
                  <td>{{ pickInfo.createdTime }}</td>
                </tr>
              </table>
            </el-card>
          </el-timeline-item>
          <!-- Transportation -->
          <el-timeline-item :timestamp="transportation.startTime" placement="top">
            <el-card>
              <h4>Transportation</h4>
              <table cellspacing="10">
                <tr>
                  <td><b>Company</b></td>
                  <td>{{ transportation.company }}</td>
                </tr>
                <tr>
                  <td><b>Driver:</b></td>
                  <td>{{ transportation.driver }}</td>
                </tr>
                <tr>
                  <td><b>Vehicle</b></td>
                  <td>{{ transportation.vehicle }}</td>
                </tr>
                <tr>
                  <td><b>StartTime:</b></td>
                  <td>{{ transportation.startTime }}</td>
                </tr>
                <tr>
                  <td><b>StartLocation:</b></td>
                  <td>{{ transportation.startLocation }}</td>
                </tr>
                <tr>
                  <td><b>EndTime:</b></td>
                  <td>{{ transportation.endTime }}</td>
                </tr>
                <tr>
                  <td><b>EndLocation:</b></td>
                  <td>{{ transportation.endLocation }}</td>
                </tr>
                <tr>
                  <td><b>Remarks:</b></td>
                  <td>{{ pickInfo.remarks }}</td>
                </tr>
                <tr>
                  <td><b>RecordTime:</b></td>
                  <td>{{ pickInfo.createdTime }}</td>
                </tr>
              </table>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-dialog>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">GetInfo</el-button>

    </el-form>
  </div>
</template>


<script>
import { getTraceInfo } from '@/api/trace'

export default {
  name: 'Login',
  data() {
    const validateTraceCode = (rule, value, callback) => {
      if (value.length < 0) {
        callback(new Error('Please enter the correct user name'))
        return
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      form: {
          traceCode: '',
      },
      seedInfo: '',
      growInfo: '',
      pickInfo: '',
      transportation: '',
      checkIn: '',
      
      rules: {
        traceCode: [{ required: true, trigger: 'blur', validator: validateTraceCode }]
      },
      loading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    handleLogin() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          getTraceInfo(this.form.traceCode).then(response => {
            this.loading = false
            console.log(response)
            this.seedInfo = response.data.seedInfo
            this.growInfo = response.data.growInfo
            this.pickInfo = response.data.pickInfo
            this.transportation = response.data.transportation
            this.checkIn = response.data.checkIn
            this.dialogFormVisible = true
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

.traceInfoDialog {
  max-height: 90%;
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>