<template>
    <section >
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <span>类别：</span>
                    <select v-model="type">
						            <option value=''>全部</option>
                        <option value='0'>系统警告</option>
                        <option value='1'>业务警告</option>
                    </select>
                </el-form-item>
                <el-form-item>
                    <span>状态：</span>
                    <select v-model="processed">
            						<option value=''>全部</option>
            						<option value='1'>已处理</option>
                        <option value='0'>未处理</option>
                    </select>
                    </el-select>
                </el-form-item>
                <!--<el-form-item>-->
                    <!--<span>URL：</span>-->
                    <!--<select v-model="url" style="height: 30px">-->
                        <!--<option value='1'>正常</option>-->
                        <!--<option value='0'>异常</option>-->
                    <!--</select>-->
                <!--</el-form-item>-->
                <br>
                <el-form-item>
                    <el-input v-model="moduleName" placeholder="模块名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="id" v-if="false" placeholder=""></el-input>
                </el-form-item>
                <el-form-item>
                    <el-date-picker type="datetime" placeholder="创建时间开始" v-model="startTime"></el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-date-picker type="datetime" placeholder="创建时间结束" v-model="endTime"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getRecordList">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

       <el-button type="primary" v-on:click="handleUpdate">更新状态</el-button>


        <!--列表-->
        <el-table :data="record" highlight-current-row @selection-change="selsChange" style="width: 100%;margin-top:10px">
            <el-table-column type="selection"  width="60"></el-table-column>
            <el-table-column prop="id" lable="ID" v-if="false" width="60" ></el-table-column>
            <!--<el-table-column prop="moduleId" v-if="false" label="模块ID" width="70" show-overflow-tooltip sortable></el-table-column>-->
            <el-table-column prop="moduleName" label="模块名称" width="150" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="moduleIp" label="IP地址" width="150" show-overflow-tooltip sortable> </el-table-column>
            <el-table-column prop="modulePort" label="端口" width="90" show-overflow-tooltip sortable> </el-table-column>
            <el-table-column prop="processed" label="状态" width="100" show-overflow-tooltip sortable :formatter="showStatusType"></el-table-column>   
            <el-table-column prop="alarmType" width="100" label="告警类别" :formatter="showAlarmType" ></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="190" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="190" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="content"  label="告警信息" width="800" ></el-table-column>
		</el-table>

    <!--更新状态界面-->
    <el-dialog title="更新状态" v-model="updateVisible" :close-on-click-modal="false" style="width:60%;left:20%">
      <template>
          <el-radio v-model="processed1" label='1'>已处理</el-radio>
          <el-radio v-model="processed1" label='0'>未处理</el-radio>
      </template>
    <div slot="footer" class="dialog-footer">
        <el-button @click="updateVisible = false">取消</el-button>
        <el-button type="primary" @click="updateStatus">提交</el-button>
      </div>
    </el-dialog>

        <!--工具条-->
        <el-col :span="24">
            <el-pagination layout="prev, pager, next" @current-change="changePage" :page-size="pageSize" :total="total" style="float:right;margin-top: 18px">
            </el-pagination>
        </el-col>
        
    </section>
</template>

<script>
    import {formatDate} from '../../common/date.js';
    export default {
        data() {
            return {
              type:'',
              status:null,
              url:'',
              processed:'',
              processed1:'',
              id:'',
              moduleName :'',
              startTime:null,
              endTime:null,

              total: 0,
              pageNum: 1,
              pageSize: 20,
              sels: [],//列表选中列

              record: [],
              ids:'',
              updateVisible:false
            }
        },
        methods: {
              format(time){
                var date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
              },
              showStatus(row) {
              var status = row.status
              if (1 == status){
                return '正常'
              }else {
                return '异常'
              }
            },
              showStatusType(row) {
                var type = row.processed ;
                if (type== 0) {
                  return "未处理";
                }else if(type== 1){
                  return "已处理";
                }
            },
            //显示编辑界面
            handleUpdate: function (index, row) {
              this.updateVisible = true;
            },
            showAlarmType(row){
              var type = row.alarmType
              if (type== 0) {
                  return "系统警告";
                }else if(type== 1){
                  return "业务警告";
                }
            },
            changePage(page) {
                this.pageNum = page;
                this.getRecordList();
            },
            //获取用户列表
            getRecordList() {
              showLoading()
              const that = this

              $.ajax({
                headers:{
                  AccessToken: sessionStorage.getItem('token'),
                  userId: sessionStorage.getItem('userId'),
                },
                type:"GET",
                url:'/gateway/record/list',
                data:{
                  'type': that.type,
                  'status':that.status,
                  'moduleName':that.moduleName ,
                  'processed':that.processed,
                  'id': that.id,
                  'userName':that.userName,
                  'createBegin': (that.startTime==null||that.startTime=='')?null:that.format(that.startTime),
                  'createEnd':(that.endTime==null||that.endTime=='')?null:that.format(that.endTime),
                  'pageNum': that.pageNum,
                  'pageSize': that.pageSize
                },
                async:true,
                crossDomain:true,

                contentType: 'application/x-www-form-urlencoded',
                dataType:"json",
                success: function(response){
                  if (0 == response.code){
                    let data = response.data   
                    that.pageNum = data.pageNum
                    that.total = data.total
					          that.record = data.list 
                  }
                  closeLoading()
                },
                error: function() {
                  layer.msg("网络异常，请稍后再试！！");
                  closeLoading();
                },
                finish:function(){
                  closeLoading();
                  alert("dsf");
                }
              });
            },

            updateStatus() {
            this.$confirm('确定操作？',"提示",{}).then(()=>{
              showLoading()
              const that = this
              $.ajax({
                async:true,
                crossDomain:true,
                contentType: 'application/x-www-form-urlencoded',
                headers:{
                  AccessToken: sessionStorage.getItem('token'),
                  userId: sessionStorage.getItem('userId')
                },
                type:"POST",
                url:"/gateway/record/update",
                data:{
                  'ids':that.ids,
                  'processed':that.processed1
                },
                dataType:"json",
                success:function(response){
                   if (0 == response.code){
                      that.getRecordList()
                      layer.msg("更新成功")
                   }else{
                    layer.msg("更新失败")
                   }
                   that.updateVisible=false
                   closeLoading()
                },
                error:function(){
                  layer.msg("网络异常，请稍后再试！！");
                  that.updateVisible=false
                  closeLoading()
                }
              });
            }).catch(()=>{

            })
            
          },

          selsChange: function (sels) {
            this.sels = sels;
            this.ids = JSON.stringify(this.sels.map(item => item.id)) 
          }
        },

        mounted() {
            this.getRecordList();
        }
    }

</script>

<style scoped>
.times{
    color: darkgrey;
}


select{
    height: 30px;
    width: 100px;
    boder:0;
}

</style>