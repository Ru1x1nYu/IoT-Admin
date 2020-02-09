<template>
  <div class="app-container">
    <el-card class="area-content">
      <el-button
        v-for="(item,index) in areaList"
        :key="index"
        class="card-item"
        @click="handleTable(item)"
      >
        <span>酒店{{ item }}层</span>
      </el-button>
    </el-card>
    <h2>酒店{{ currentFloor }}层 <small>本页有{{ deviceList.length }}条数据</small> </h2>
    <el-table
      v-loading="listLoading"
      :data="deviceList"
      element-loading-text="请求数据中..."
      :row-class-name="tableRowClassName"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        align="center"
        prop="address"
        label="设备号"
        width="150"
      />
      <el-table-column
        align="center"
        prop="room"
        label="房间号"
        width="150"
      />
      <el-table-column
        align="center"
        prop="name"
        label="房间名"
        width="150"
      />
      <el-table-column
        align="center"
        prop="r_mode_r"
        label="运行模式反馈"
        width="150"
      >
        <template slot-scope="{row}">
          {{ row.r_mode_r ===1 ? '运行':row.r_mode_r ===2 ? '节能' : row.r_mode_r ===3 ? '本地待机' : row.r_mode_r ===4 ? '锁定' : '未知' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="r_mode_s"
        label="运行模式设定"
        width="150"
      >
        <template slot-scope="{row}">
          {{ row.r_mode_s ===1 ? '运行': row.r_mode_s ===3 ? '节能' : '未知' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="r_fan_r"
        label="风机速度反馈"
        width="150"
      >
        <template slot-scope="{row}">
          {{ row.r_fan_r === 1? '自动' : row.r_fan_r === 2 ? '低速' : row.r_fan_r === 3 ? '中速' : row.r_fan_r === 4 ? '高速' : '未知' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="r_fan_s"
        label="风机速度设定"
        width="150"
      >
        <template slot-scope="{row}">
          {{ row.r_fan_s === 1? '自动' : row.r_fan_s === 2 ? '低速' : row.r_fan_s === 3 ? '中速' : row.r_fan_s === 4 ? '高速' : '未知' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="r_temp_r"
        label="环境温度反馈"
        width="150"
      >
        <template slot-scope="{row}">
          {{ row.r_door }}°C
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="r_temp_s"
        label="环境温度设定"
        width="150"
      >
        <template slot-scope="{row}">
          <el-input
            type="text"
            :value="row.r_temp_s"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="r_hc"
        label="制冷、制热模式"
        width="150"
      >
        <template slot-scope="{row}">
          {{ row.r_hc === 1? '制冷' : row.r_hc === 2 ? '制热' : '未知' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="r_door"
        label="门磁功能"
        width="150"
      >
        <template slot-scope="{row}">
          {{ row.r_door === 2 ? '失效' : row.r_door === 3 ? '有效' : '未知' }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="page"
      :page-sizes="[15, 20, 30, 40, 50, 60, 120]"
      :page-size="pageSize"
      layout="sizes, prev, pager, next"
      :page-count="pageCount"
      @size-change="changePageSize"
      @current-change="changePage"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { getAreaList, getDevice } from '@/api/tempSystem'

@Component({
  name: 'TemperatureControlSystem'
})

export default class extends Vue {
  // data{}
  private areaList: Number[] =[]
  private deviceList: object[] =[]
  private page: number =1
  private pageSize: number =15
  private pageCount?: number
  private currentFloor: string ='1'
  private listLoading = true

  @Watch('currentFloor')
  onChangeValue(newVal: string, oldVal: string): any {
    if (newVal !== oldVal) {
      console.log('变了')
      this.page = 1
      this.pageSize = 15
    }
  }

  mounted() {
    this.getFloor()
    this.getDeviceList()
  }

  private async getFloor() {
    const { data } = await getAreaList()
    this.areaList = data.list.sort((m: string, n: string) => {
      return parseInt(m) < parseInt(n) ? -1 : 1
    })
  }
  private handleTable(item:string) {
    this.page = 1
    this.pageSize = 15
    this.currentFloor = item
    this.getDeviceList()
  }
  private getDeviceList() {
    this.listLoading = true
    const query = {
      floor: this.currentFloor,
      page: this.page,
      pageSize: this.pageSize
    }
    getDevice(query).then(res => {
      const { data } = res
      this.deviceList = data.list
      this.page = data.page
      this.pageSize = data.pageSize
      this.pageCount = data.pageCount
      this.listLoading = false
    })
  }
  private changePage() {
    this.getDeviceList()
  }
  private changePageSize(val :any) {
    this.pageSize = val
    this.page = 1
    this.getDeviceList()
  }
  private tableRowClassName({ row, rowIndex }:any) {
    if (row.r_mode_r !== 0 || row.r_mode_s !== 0 || row.r_fan_r !== 0 || row.r_fan_s !== 0) {
      return ''
    } else {
      return 'isUnknow'
    }
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
