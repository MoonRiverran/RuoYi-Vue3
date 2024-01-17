<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
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
      <!--绩效数据-->
      <el-col :span="20" :xs="24">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工作类型" prop="workType"  style="margin-right:0px">
        <el-select v-model="queryParams.workType" placeholder="请选择工作类型" style="width:80%" clearable>
          <el-option
              v-for="dict in work_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务类型" prop="projectType" style="margin-right:0px">
        <el-select v-model="queryParams.projectType" placeholder="请选择任务类型" style="width:80%" clearable>
          <el-option
              v-for="dict in project_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="完成年月" prop="searchDate" style="margin-right:0px">
        <el-date-picker style="width:80%" clearable
                        v-model="queryParams.searchDate"
                        type="month"
                        format="YYYY年MM月"
                        value-format="YYYY-MM"
                        placeholder="请选择完成年月">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <Chart v-if="showChart"></Chart>
    <div v-else>
      <el-row :gutter="10" class="mb8">
        <!--      <el-col :span="1.5">-->
        <!--        <el-button-->
        <!--            type="primary"-->
        <!--            plain-->
        <!--            icon="Plus"-->
        <!--            @click="handleAdd"-->
        <!--            v-hasPermi="['system:perf:add']"-->
        <!--        >新增</el-button>-->
        <!--      </el-col>-->
        <el-col :span="1.5">
          <el-button
              type="success"
              plain
              icon="Edit"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:perf:edit']"
          >修改</el-button>
        </el-col>
        <!--      <el-col :span="1.5">-->
        <!--        <el-button-->
        <!--            type="danger"-->
        <!--            plain-->
        <!--            icon="Delete"-->
        <!--            :disabled="multiple"-->
        <!--            @click="handleDelete"-->
        <!--            v-hasPermi="['system:perf:remove']"-->
        <!--        >删除</el-button>-->
        <!--      </el-col>-->
        <el-col :span="1.5">
          <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['system:perf:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
      <el-table v-loading="loading" :data="perfList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="员工姓名" align="center" prop="employeeName" />
        <el-table-column label="员工工号" width="90" align="center" prop="employeeNumber" />
        <el-table-column label="工作类型" width="140" align="center" prop="workType">
          <template #default="scope">
            <dict-tag :options="work_type" :value="scope.row.workType"/>
          </template>
        </el-table-column>
        <el-table-column label="任务类型" align="center" prop="projectType">
          <template #default="scope">
            <dict-tag :options="project_type" :value="scope.row.projectType"/>
          </template>
        </el-table-column>
        <el-table-column label="任务说明" align="center" prop="projectDescription">
          <template #default="scope">
            <div class="ellipsis-text" v-tooltip="scope.row.projectDescription">{{ scope.row.projectDescription }}</div>
          </template>
        </el-table-column>
        <el-table-column label="任务目标" align="center" prop="goal" >
          <template #default="scope">
            <div class="ellipsis-text" v-tooltip="scope.row.goal">{{ scope.row.goal }}</div>
          </template>
        </el-table-column>
        <el-table-column label="完成结果" align="center" prop="completionResult">
          <template #default="scope">
            <dict-tag :options="completion_result" :value="scope.row.completionResult"/>
          </template>
        </el-table-column>
        <el-table-column label="完成比例(%)" width="100" align="center" prop="completionRatio" />
        <el-table-column label="工作时长(h)"  width="100" align="center" prop="workDuration" />
        <el-table-column label="任务开始日期" align="center" prop="extensionField1" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.completionDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="个人评价" align="center" prop="remark" >
          <template #default="scope">
            <div class="ellipsis-text" v-tooltip="scope.row.remark">{{ scope.row.remark }}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />
      </el-col>
    </el-row>
    <!-- 添加或修改员工绩效对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="perfRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="工作类型" prop="workType">
          <el-select v-model="form.workType" placeholder="请选择工作类型">
            <el-option
                v-for="dict in work_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务类型" prop="projectType">
          <el-select v-model="form.projectType" placeholder="请选择任务类型">
            <el-option
                v-for="dict in project_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务说明" prop="projectDescription">
          <el-input v-model="form.projectDescription" type="textarea" placeholder="请输入任务说明" />
        </el-form-item>
        <el-form-item label="目标" prop="goal">
          <el-input v-model="form.goal" type="textarea" placeholder="请输入目标" />
        </el-form-item>
        <el-form-item label="完成比例(%)" prop="completionRatio">
          <el-input v-model="form.completionRatio"  placeholder="请输入完成比例" />
        </el-form-item>
        <el-form-item label="完成结果" prop="completionResult">
          <el-select v-model="form.completionResult" placeholder="请选择完成结果">
            <el-option
                v-for="dict in completion_result"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="完成日期" prop="completionDate">
          <el-date-picker clearable
                          v-model="form.completionDate"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择完成日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="工作时长(h)" prop="workDuration">
          <el-input v-model="form.workDuration"  placeholder="请输入工作时长" />
        </el-form-item>
        <el-form-item label="个人评价" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Perf">
import { listPerf, getPerf, delPerf, addPerf, updatePerf, deptTreeSelect } from "@/api/system/perf";
import Chart from './chart.vue';

const { proxy } = getCurrentInstance();
const { work_type, project_type, completion_result } = proxy.useDict('work_type', 'project_type', 'completion_result');

const perfList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const deptOptions = ref(undefined);
var showChart = true;

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    workType: null,
    projectType: null,
    searchDate: null,
  },
  rules: {
    workType: [
      { required: true, message: "工作类型不能为空", trigger: "change" }
    ],
    projectType: [
      { required: true, message: "任务类型不能为空", trigger: "change" }
    ],
    completionRatio: [
      { required: true, message: "完成比列不能为空", trigger: "blur" },
      {
        pattern: /^[0-9]+(\.[0-9]+)?$/,
        message: "请输入数字",
        trigger: "blur"
      },
      {
        validator: (rule, value, callback) => {
          if (value < 0 || value > 100) {
            callback(new Error("完成比例必须介于 0 和 100 之间"));
          } else {
            callback();
          }
        },
        trigger: "blur"
      } ],
    workDuration: [
      { required: true, message: "工作时长不能为空", trigger: "blur" },
      {
        pattern: /^[0-9]+(\.[0-9]+)?$/,
        message: "请输入数字",
        trigger: "blur"
      }
    ]
  }
});



const { queryParams, form, rules } = toRefs(data);

/** 查询员工绩效列表 */
function getList() {
  loading.value = true;
  listPerf(queryParams.value).then(response => {
    perfList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 查询部门下拉树结构 */
function getDeptTree() {
  deptTreeSelect().then(response => {
    deptOptions.value = response.data;
  });
};
/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.empDeptid = data.id;
  handleQuery();
};

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    empId: null,
    employeeName: null,
    employeeNumber: null,
    workType: null,
    projectType: null,
    projectDescription: null,
    goal: null,
    completionRatio: null,
    completionResult: null,
    completionDate: null,
    workDuration: null,
    extensionField1: null,
    extensionField2: null,
    extensionField3: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  };
  proxy.resetForm("perfRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  showChart=false;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
  showChart=true;
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.empId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加员工绩效";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _empId = row.empId || ids.value
  getPerf(_empId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改员工绩效";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["perfRef"].validate(valid => {
    if (valid) {
      if (form.value.empId != null) {
        updatePerf(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPerf(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _empIds = row.empId || ids.value;
  proxy.$modal.confirm('是否确认删除员工绩效编号为"' + _empIds + '"的数据项？').then(function() {
    return delPerf(_empIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/perf/export', {
    ...queryParams.value
  }, `perf_${new Date().getTime()}.xlsx`)
}
getDeptTree();
getList();
</script>
<style>
.ellipsis-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px; /* 设置最大宽度 */
}
.ellipsis-text:hover {
  white-space: normal;
  overflow: visible;
  text-overflow: inherit;
}
</style>

