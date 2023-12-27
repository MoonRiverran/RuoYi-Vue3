<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <!--        <div class="head-container">-->
        <!--          <el-input-->
        <!--              v-model="deptName"-->
        <!--              placeholder="请输入部门名称"-->
        <!--              clearable-->
        <!--              prefix-icon="Search"-->
        <!--              style="margin-bottom: 20px"-->
        <!--          />-->
        <!--        </div>-->
        <div class="head-container">
          <el-tree
              :data="deptOptions"
              :props="{ label: 'label', children: 'children' }"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="deptTreeRef"
              node-key="id"
              highlight-current
              default-expand-all
              @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--扇形图-->
      <el-col :span="20" :xs="24">
        <div id="charts">
          <div id="chart" ref="chart" style="width: 100%; height: 1080px;"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import {getMonthWorkHour,deptTreeSelect} from "@/api/system/perf";
const deptOptions = ref(undefined);

/** 查询部门下拉树结构 */
function getDeptTree() {
  deptTreeSelect().then(response => {
    deptOptions.value = response.data;
  });
};

export default {
  data() {
    return {
      employeeData: [],
      workType: [],
      employeeName: '郑浩然',
    };
  },
  mounted() {
    this.fetchEmployeeData();
  },
  methods: {
    fetchEmployeeData() {
      getMonthWorkHour().then(response => {
        // 根据employeeNumber来展示相同的数据在一个表里
        let groupedData = {};
        response.rows.forEach(item => {
          if (!groupedData[item.employeeNumber]) {
            groupedData[item.employeeNumber] = [];
          }
          groupedData[item.employeeNumber].push(item);
        });
        this.employeeData = groupedData;
        this.renderChart();
      })
          .catch(error => {
            console.error('Error fetching employee data', error);
          });
    },
    renderChart() {
      // 初始化echarts实例
      let chart = echarts.init(this.$refs.chart);
      // 构造echarts需要的数据格式
      let chartData = [];
      var index = 0;
      for (let employeeNumber in this.employeeData) {
        let workTypeData = this.employeeData[employeeNumber].map(item => {
          return {
            name: item.workTypeName,
            value: item.workDuration,
          };
        });
        chartData.push({
          type: 'pie',
          radius: ['6%', '12%'],
          //center: [`${(index * 20) + 20}%`, '10%'],
          center: this.getCenterPosition(index, chartData.length),
          data: workTypeData,
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
        });
        index +=1;
      }
      // 设置echarts的配置项
      let option = {
        title: {
          x: 'left',
          y: 'left',
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
          data:['科研项目（外部）','科研项目（内部）','订单项目','技术预研','工地服务','平台开发','基层工作','知识产权','外部工作','其他']
        },
        series: chartData,
      };
      // 使用配置项设置图表
      chart.setOption(option);
      window.onresize = chart.resize;
    },
    getCenterPosition(index, dataLength) {
      const rowCapacity = 5; // 一行展示5个扇形图
      const rowIndex = Math.floor(index / rowCapacity);
      const colIndex = index % rowCapacity;
      const centerX = (10 + 18 * colIndex) + '%';
      const centerY = (10 + 18 * rowIndex) + '%';
      return [centerX, centerY];
    },
  }
};
getDeptTree();
</script>

<style>
#charts {
  position: relative;
}
#chart {
  margin: 20px 10px;
}
#name {
  position: absolute;
  top: 285px;
  left: 260px;
}
</style>