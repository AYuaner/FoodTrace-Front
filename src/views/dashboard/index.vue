<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎使用FoodTrace溯源系统</div>
    <div class="dashboard-name">用户: {{ name }}</div>
    <div id="space" style="height: 10px" />
    <el-form :inline="true">
      <el-form-item><v-chart id="auth-chart" :option="option_bar" style="height: 400px; width: 450px" /></el-form-item>
      <el-form-item><v-chart id="fabric-chart" :option="option_pie" style="height: 400px; width: 450px" /></el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCount, getFabricCounts } from '@/api/echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
])

export default {
  name: 'Dashboard',
  components: {
    VChart
  },
  data() {
    return {
      option_bar: {
        title: {
          text: 'FoodTrace-Auth',
          left: 'center'
        },
        tooltip: {},
        xAxis: {
          data: ['账号', '公司', '农场', '载具', '员工']
        },
        yAxis: {},
        series: [
          {
            name: 'Auth',
            type: 'bar',
            data: []
          }
        ]
      },
      option_pie: {
        title: {
          text: 'FoodTrace-Fabric',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: []
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getCount().then((response) => {
        this.option_bar.series[0].data = response.data
      })
      getFabricCounts().then((response) => {
        this.option_pie.series[0].data = response.data
        console.log(this.option_pie.series[0].data)
      })
    }
  }
}
// TODO 添加echarts
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 20px;
    line-height: 46px;
  }
  &-name {
    font-size: 30px;
    color: brown;
  }
}
</style>
