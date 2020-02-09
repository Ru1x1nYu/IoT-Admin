<template>
  <div class="app-container">
    <el-form
      ref="formInline"
      :inline="true"
      :model="formInline"
    >
      <el-form-item label="查询的标签">
        <el-select
          v-model="formInline.query.__name__"
          placeholder=""
        >
          <el-option
            v-for="(item, index) in labelList"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备地址">
        <el-select
          v-model="formInline.query.address"
          placeholder=""
        >
          <el-option
            label="42001"
            value="42001"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="formInline.date"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        />
      </el-form-item>
      <el-form-item label="间隔">
        <el-select
          v-model="formInline.step"
        >
          <el-option
            v-for="(item, index) in stepList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit(formInline)"
        >
          查询
        </el-button>
      </el-form-item>
    </el-form>
    <ve-line
      v-if="isShow"
      :loading="isLoading"
      :resizeable="true"
      :not-set-unchange="['dataZoom']"
      :data="chartData"
      :data-zoom="[{type: 'inside',show: true, xAxisIndex: [0],start: 0,end: 80},{start: 0,end: 80,height: 20}]"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import { getGraphsData, getLabelList } from '@/api/graphs'
import { chartDataType } from '@/api/chartData'
import clonedeep from 'clonedeep'
@Component({
  name: 'QueryGraphs'
})

export default class extends Vue {
  // data{}
  private stepList: any = [
    {
      label: '5秒',
      value: '5s'
    },
    {
      label: '30秒',
      value: '30s'
    },
    {
      label: '1分钟',
      value: '1m'
    },
    {
      label: '5分钟',
      value: '5m'
    },
    {
      label: '30分钟',
      value: '30m'
    }
  ]
  private pickerOptions: any = {
    shortcuts: [{
      text: '最近30分钟',
      onClick(picker: any) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 0.5)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近1小时',
      onClick(picker: any) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近一天',
      onClick(picker: any) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24)
        picker.$emit('pick', [start, end])
      }
    }]
  }
  private formInline: object = {
    query: {
      address: '42001',
      __name__: 'r_temp_r'
    },
    date: [new Date(new Date().getTime() - 3600 * 1000), new Date()],
    step: '30s'
  }
  private chartSettings = {
    metrics: ['温度'],
    dimension: ['时间']
  }
  private chartData?: chartDataType = {
    columns: [],
    rows: []
  }
  private labelList: string[] = []
  private isLoading = true
  private isShow = false

  mounted() {
    this.getLabelLists()
  }
  private async getLabelLists() {
    const { data } = await getLabelList()
    this.labelList = data
  }
  private onSubmit() {
    (this.$refs.formInline as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.isShow = true
        this.isLoading = true
        let query = clonedeep(this.formInline)
        query.start = query.date[0]
        query.end = query.date[1]
        delete query.date
        query.query = `{address='${query.query.address}',__name__='${query.query.__name__}'}`
        let { data } = await getGraphsData(query)
        var list = data.result[0].values
        var chartDatas: chartDataType = {
          rows: [],
          columns: ['时间', '温度']
        }
        for (let i in list) {
          chartDatas.rows[parseInt(i)] = {
            '时间': new Date(list[i][0] * 1000).toLocaleString(),
            '温度': Number(list[i][1])
          }
        }
        this.isLoading = false
        this.chartData = chartDatas
        console.log(this.chartData.rows)
      } else {
        alert('error submit!!')
        return false
      }
    })
  }
}
</script>
<style lang="scss">
.app-container{
  h2{
    small{
      font-size: 60%;
      font-weight: normal;
    }
  }
  .area-content{
    .el-card__body{
      display: flex;
      padding: 15px;
      flex-wrap: wrap;
      justify-content: flex-start;
    }
    .card-item{
      width: 100px;
      margin: 5px 5px;
    }
  }
  .isUnknow{
    background-color: #ccc;
  }
}
</style>
