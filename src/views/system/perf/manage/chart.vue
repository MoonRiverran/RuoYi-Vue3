<template>
  <div>
    <div ref="chart" style="width: 600px; height: 400px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { getMonthWorkHour } from "@/api/system/perf";
import { getDictLabel } from '@/api/system/dict/data'


export default {
  data() {
    return {
      employeeData: [],
      workType:[],
    };
  },
  mounted() {
    this.fetchEmployeeData();
  },
  methods: {
    fetchEmployeeData() {
      getMonthWorkHour().then(response => {
        this.employeeData = response.rows;
        this.renderChart();
      })
          .catch(error => {
            console.error('Error fetching employee data', error);
          });
    },
    renderChart() {
      console.log(this.employeeData);
      let chart = echarts.init(this.$refs.chart);
      let option = {
        title: {
          text: '员工工作类型占比'
        },
        series: [{
          type: 'pie',
          radius: '50%',
          data: this.employeeData.map(item => ({
            name: (item.workType),
            value: item.workDuration
          }))
        }]
      };
      chart.setOption(option);
    }
  }
};
</script>