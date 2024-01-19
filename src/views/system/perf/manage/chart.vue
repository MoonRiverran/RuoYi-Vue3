<template>
  <div id="commonLegend"></div>
</template>

<script setup >
import * as echarts from 'echarts';
import {getMonthWorkHour} from "@/api/system/perf";
import { onMounted } from 'vue';
const legend = ref({});


onMounted(() => {
  getMonthWorkHour().then(response => {
    var series = [];
    var data = response.data;;
    var dom = document.getElementById("commonLegend")
    let myChart = echarts.init(dom);

    // 遍历数据，生成饼图系列
    for (var i = 0; i < data.length; i++) {
      var workerData = data[i].workerData;
      series.push({
        type: 'pie',
        radius: ['10%', '18%'],
        center: [((i % 6) * 15 + 15) + '%', (Math.floor(i / 6) * 30 + 15) + '%'],
        encode: {
          itemName: 'name',
          value: 'value'
        },
        label: {
          position: 'inner',
          formatter: '{c}h',
          color: 'black',
          fontWeight: 'bold',
          fontSize: 12
        },
        labelLine: {
          show: false
        },
        data: workerData
      });
      // 在每个echarts图下生成序号
      var chartDiv = document.createElement('div');
      chartDiv.innerText = data[i].name;
      chartDiv.style.position = 'absolute';
      chartDiv.style.left = ((i % 6) * 15 + 13) + '%';
      chartDiv.style.top = (Math.floor(i / 6) * 30 + 25) + '%'; // 调整序号的上下位置
      dom.appendChild(chartDiv);
    }
    var option = {
      legend: {},
      tooltip: {},
      series: series
    };
    myChart.setOption(option);
    window.addEventListener('resize', myChart.resize);
  });
});




// export default {
//   data() {
//     return {
//       employeeInfo: [],
//       legend: null,
//     };
//   },
//   mounted() {
//     // 调用 getMonthWorkHour 方法获取数据
//     getMonthWorkHour().then(response => {
//       this.employeeInfo = response.data;
//       this.renderChart();
//     });
//   },
//   methods: {
//     renderChart() {
//       var series = [];
//       var data = this.employeeInfo;
//       var dom = document.getElementById("commonLegend")
//       let myChart = echarts.init(dom);
//
//       // 遍历数据，生成饼图系列
//       for (var i = 0; i < data.length; i++) {
//         var workerData = data[i].workerData;
//         series.push({
//           type: 'pie',
//           radius: ['10%', '18%'],
//           center: [((i % 6) * 15 + 15) + '%', (Math.floor(i / 6) * 30 + 15) + '%'],
//           encode: {
//             itemName: 'name',
//             value: 'value'
//           },
//           label: {
//             position: 'inner',
//             formatter: '{c}h',
//             color: 'black',
//             fontWeight: 'bold',
//             fontSize: 12
//           },
//           labelLine: {
//             show: false
//           },
//           data: workerData
//         });
//         // 在每个echarts图下生成序号
//         var chartDiv = document.createElement('div');
//         chartDiv.innerText = data[i].name;
//         chartDiv.style.position = 'absolute';
//         chartDiv.style.left = ((i % 6) * 15 + 13) + '%';
//         chartDiv.style.top = (Math.floor(i / 6) * 30 + 25) + '%'; // 调整序号的上下位置
//         dom.appendChild(chartDiv);
//       }
//       var option = {
//         legend: {},
//         tooltip: {},
//         series: series
//       };
//       myChart.setOption(option);
//       window.addEventListener('resize', myChart.resize);
//     },
//   }
// };
</script>

<style>
#commonLegend {
  position: relative;
  top:0px;
  height: 800px;
  margin:0;
}
</style>

