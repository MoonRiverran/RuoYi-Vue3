<template>
  <div class="container">
    <div v-for="employee in employeeInfo" :key="employee.id" class="chart-container">
      <div :id="'crchi-chart' + employee.id" class="chart"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import {getMonthWorkHour} from "@/api/system/perf";

export default {
  data() {
    return {
      employeeInfo: [],
    };
  },
  mounted() {
    // 调用 getMonthWorkHour 方法获取数据
    getMonthWorkHour().then(response => {
      this.employeeInfo = response.data;
      console.log(response.data);
      this.renderChart();
    });
  },
  methods: {
    renderChart() {
      if (this.employeeInfo.length > 0) {
        for (let i = 0; i < this.employeeInfo.length; i++) {
          this.$nextTick(() => {
            let chartId = 'crchi-chart' + this.employeeInfo[i].id;
            let myChart = echarts.init(document.getElementById(chartId));
            // 设置echarts的配置项
            let option = {
              title: {
                text: this.employeeInfo[i].name,
                x: 'center',
                y: 'bottom',
                textStyle: {
                  textAlign: 'center'
                }
              },
              tooltip: {
                trigger: 'item',
                formatter: '{b} : {c}(h) ({d}%)'
              },
              legend: {
                orient: 'horizontal',
                x: 'center',
                // data: ['科研项目（外部）', '科研项目（内部）', '订单项目', '技术预研', '工地服务', '平台开发', '基层工作', '知识产权', '外部工作', '其他']
              },
              series: [{
                type: 'pie',
                radius: ['20%', '50%'],
                center: ['50%', '50%'],
                data: this.employeeInfo[i].workerData,
                label: {
                  normal: {
                    position: 'inner',
                    formatter: '{c}h',
                    textStyle: {
                      color: 'black',
                      fontWeight: 'bold',
                      fontSize: 12
                    },
                  }
                },
                labelLine: {
                  show: false
                }
              }],
            };
            myChart.setOption(option)
            //将该echarts用之前配置好的option的配置项进行渲染
            window.addEventListener("resize", function () {
              //监听窗口变动实时渲染
              myChart.resize();
            });
          });

        }
      }
    },
  }
};
</script>

<style>
.container {
  display: flex;
  flex-wrap: wrap;
}

.chart-container {
  flex-basis: 20%;
  /* 可以根据需要调整宽度百分比 */
}

.chart {
  width: 100%;
  height: 300px;
  /* 根据需要设置图表容器的高度 */
}

</style>