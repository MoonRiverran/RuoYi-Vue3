<template>
  <div class="chart-container">
    <div class="wrapper" v-for="(item,index) in employeeInfo" :key="index" :id="'crchi-chart'+item.id">
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import {getMonthWorkHour} from "@/api/system/perf";

var that;
export default {
  data() {
    return {
      workTypeData:[{
        name:"订单项目",
        type:"workType002"
      }],

      employeeData: [],
      chartData: [],

      employeeInfo:[{
        name:"宁方可",
        id:"32432543643",
        workerData:[{
          name:"订单项目",
          value:36,
          //type:"workType002"
        },{
          name:"科研项目",
          value:36,
          //type:"workType001"
        },{
          name:"外部项目",
          value:36,
          //type:"workType003"
        },]
      },{
        name:"宁方可224",
        id:"324325436535643",
        workerData:[{
          name:"订单项目",
          value:36,
          //type:"workType002"
        },{
          name:"科研项目",
          value:36,
          //type:"workType001"
        },{
          name:"外部项目",
          value:36,
          //type:"workType003"
        },]
      },{
        name:"宁方3可",
        id:"12432453654",
        workerData:[{
          name:"订单项目",
          value:36,
          // type:"workType002"
        },{
          name:"科研项目",
          value:36,
          //type:"workType001"
        },{
          name:"外部项目",
          value:36,
          // type:"workType003"
        },]
      },{
        name:"宁方可2",
        id:"324325423423643",
        workerData:[{
          name:"订单项目",
          value:36,
          // type:"workType002"
        },{
          name:"科研项目",
          value:36,
          //type:"workType001"
        },{
          name:"外部项目",
          value:36,
          //type:"workType003"
        },]
      },{
        name:"宁方可1",
        id:"3243215436565643",
        workerData:[{
          name:"订单项目",
          value:36,
          // type:"workType002"
        },{
          name:"科研项目（外部）",
          value:36,
          // type:"workType001"
        },{
          name:"外部项目",
          value:36,
          // type:"workType003"
        },]
      }],

    };
  },
  mounted() {
    that=this;
    that.renderChart();
    //that.fetchEmployeeData();
  },
  methods: {
    fetchEmployeeData() {
      getMonthWorkHour().then(response => {
        console.log(response);
        // 根据employeeNumber来展示相同的数据在一个表里
        var groupedData = [];

        response.rows.forEach(item => {
          if (!groupedData[item.employeeNumber]) {
            groupedData[item.employeeNumber] = [];
          }
          groupedData[item.employeeNumber].push(item);
        });
        that.employeeData = groupedData;
        that.renderChart();
      })
    },
    renderChart() {
      for (let i = 0; i < that.employeeInfo.length; i++) {
        let chartId = 'crchi-chart' + that.employeeInfo[i].id;
        let myChart = echarts.init(document.getElementById(chartId));
        // 设置echarts的配置项
        let option = {
          title: {
            text: that.employeeInfo[i].name,
            x: 'center',
            y: 'bottom',
            textStyle: {
              textAlign: 'center' // 将textAlign属性设置为'center'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c}(h) ({d}%)'
          },
          legend: {
            orient: 'horizontal',
            x: 'center',
            data: ['科研项目（外部）', '科研项目（内部）', '订单项目', '技术预研', '工地服务', '平台开发', '基层工作', '知识产权', '外部工作', '其他']
          },
          series: [{
            type: 'pie',
            radius: ['20%', '50%'],
            center: ['50%', '50%'],
            data: that.employeeInfo[i].workerData,
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
      }
    },
  }
};
</script>

<style>
.chart-container {
  position: relative;
  display: flex;
  flex-direction: row;
}

.wrapper {
  margin-top: 10px;
  width: 300px;
  height: 300px;
  border-right: 1px solid #0B61B3;
}


</style>