<template>
  <div>
    <div ref="chart" style="width: 600px; height: 400px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
  data() {
    return {
      employeeData: []
    };
  },
  mounted() {
    this.fetchEmployeeData();
  },
  methods: {
    fetchEmployeeData() {
      axios.get('your_backend_api_url')
          .then(response => {
            this.employeeData = response.data;
            this.renderChart();
          })
          .catch(error => {
            console.error('Error fetching employee data', error);
          });
    },
    renderChart() {
      let chart = echarts.init(this.$refs.chart);
      let option = {
        title: {
          text: '员工工作类型占比'
        },
        series: [{
          type: 'pie',
          radius: '50%',
          data: this.employeeData.map(item => ({
            name: item.type,
            value: item.workHours
          }))
        }]
      };
      chart.setOption(option);
    }
  }
};
</script>