<template>
    <section >
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <!-- <el-form-item>
                    <span>警告通知：</span>
                    <select v-model="enabledMethod">
						            <option value=''>全部</option>
                        <option value='0'>不通知</option>
                        <option value='1'>短信</option>
                        <option value='2'>邮件</option>
                        <option value='3'>短信邮件</option>
                    </select>
                </el-form-item> -->
                <br>
                <el-form-item>
                    <el-input v-model="moduleName" placeholder="模块名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="name" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item v-if="fasle">
                    <el-input v-model="mobile" placeholder="手机号"></el-input>

                </el-form-item>
               

                <el-form-item>
                    <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getNotifyList">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <el-button type="primary" v-on:click="handleAdd">新增</el-button>

        <!--列表-->
        <el-table :data="record" highlight-current-row @selection-change="selsChange" style="width: 100%;margin-top: 10px">
                <el-table-column v-if="false" type="selection" width="40"></el-table-column>
                <el-table-column prop="id" v-if="false" label="ID" width="80" show-overflow-tooltip sortable></el-table-column>
                <!--     <el-table-column prop="moduleName" label="模块名" width="120" show-overflow-tooltip sortable></el-table-column>
                <el-table-column prop="moduleIp" label="IP" width="150" show-overflow-tooltip sortable></el-table-column>
                <el-table-column prop="modulePort" label="端口" width="100" show-overflow-tooltip sortable></el-table-column> -->
                <el-table-column prop="name" label="姓名" width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="mobile" width="150" label="手机号"></el-table-column>
                <el-table-column prop="email" label="邮箱" width="250" show-overflow-tooltip></el-table-column>
                <el-table-column prop="enabledMethod" label="系统警告" :formatter="showMethod" width="110" show-overflow-tooltip></el-table-column>
                <el-table-column prop="nomalLevel" width="110" :formatter="showMethod" label="一般警告"></el-table-column>
                <el-table-column prop="majorLevel" width="110" :formatter="showMethod"  label="重要警告"></el-table-column>
                <el-table-column prop="urgentLevel" width="110" :formatter="showMethod"  label="紧急警告"></el-table-column>
                <el-table-column prop="otherLevel" width="110" :formatter="showMethod"  label="其他警告"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="200" show-overflow-tooltip sortable></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" width="200" show-overflow-tooltip sortable></el-table-column>
		        <el-table-column label="操作" width="200">
                <template scope="scope">
                    <el-button size="small" @click="handleLook(scope.$index, scope.row)">查看</el-button>
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button size="small" @click="delNofity(scope.row)">删除</el-button>
                </template>
            </el-table-column>
    </el-table>

        <!--工具条-->
        <el-col :span="24">
            <el-pagination layout="prev, pager, next" @current-change="changePage" :page-size="pageSize" :total="total" style="float:right;margin-top: 18px">
            </el-pagination>
        </el-col>
        

    <!--新增界面-->
    <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false" style="width:100%;">
      <el-form :model="addForm" label-width="120px" :rules="rule1" ref="addForm">
        <el-form-item label="模块名" prop="moduleName">
          <el-col :span='12'>
            <el-input v-model="_moduleNames"  placeholder="模块名" :disabled='true'></el-input>
          </el-col>
          <el-col :span="4">
            <el-button v-on:click="handleModule(false)">选择</el-button>
          </el-col>
        </el-form-item>
         <el-form-item label="通知人名字" prop="name">
         <el-col :span='12'>
          <el-input v-model="addForm.name"  placeholder="通知人名字"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
        <el-col :span='12'>
          <el-input v-model="addForm.mobile"  placeholder="手机号"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
        <el-col :span='12'>
          <el-input v-model="addForm.email"  placeholder="邮箱"></el-input>
         </el-col>
        </el-form-item>
        <el-form-item>
          <span>系统告警通知：</span>
              <select v-model="addForm.enabledMethod">
                <option value='3'>短信邮件</option>
                <option value='0'>不通知</option>
                <option value='1'>短信</option>
                <option value='2'>邮件</option>
            </select>
        </el-form-item>
        <el-form-item>
          <span>系统告警一般级别通知：</span>
              <select v-model="addForm.nomalLevel">
                <option value='1'>短信</option> 
                <option value='0'>不通知</option>
                <option value='2'>邮件</option>
                <option value='3'>短信邮件</option>
            </select>
        </el-form-item>
        <el-form-item>
          <span>系统告警重要级别通知：</span>
              <select v-model="addForm.majorLevel">
                <option value='3'>短信邮件</option>
                <option value='0'>不通知</option>
                <option value='1'>短信</option>
                <option value='2'>邮件</option>
            </select>
        </el-form-item>
        <el-form-item>
          <span>系统告警紧急级别通知：</span>
              <select v-model="addForm.urgentLevel">
                <option value='3'>短信邮件</option>
                <option value='0'>不通知</option>
                <option value='1'>短信</option>
                <option value='2'>邮件</option>
            </select>
        </el-form-item>
        <el-form-item>
          <span>系统告警其他级别通知：</span>
              <select v-model="addForm.otherLevel">
                <option value='3'>短信邮件</option>
                <option value='0'>不通知</option>
                <option value='1'>短信</option>
                <option value='2'>邮件</option>
            </select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addNotify" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--编辑界面-->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false" style="width:100%">

      <el-form :model="editForm" label-width="120px" :rules="rule1" ref="editForm">
      <el-form-item label="模块名" prop="moduleName">
          <el-col :span='12'>
            <el-input v-model="_moduleNames"  placeholder="模块名" :disabled='true'></el-input>
          </el-col>
          <el-col :span='11'>
            <el-button v-on:click="handleModule(true)">选择</el-button>
          </el-col>
        </el-form-item>
         <el-form-item label="通知人名字" prop="name">
         <el-col :span='12'>
          <el-input v-model="editForm.name"  placeholder="通知人名字"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
        <el-col :span='12'>
          <el-input v-model="editForm.mobile"  placeholder="手机号"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
         <el-col :span='12'>
          <el-input v-model="editForm.email"  placeholder="邮箱"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <span>系统告警通知：</span>
              <select v-model="editForm.enabledMethod">
                <option value='3'>短信邮件</option>
                <option value='0'>不通知</option>
                <option value='1'>短信</option>
                <option value='2'>邮件</option>
            </select>
        </el-form-item>
        <el-form-item>
          <span>系统告警一般级别通知：</span>
              <select v-model="editForm.nomalLevel">
                <option value='1'>短信</option> 
                <option value='0'>不通知</option>
                <option value='2'>邮件</option>
                <option value='3'>短信邮件</option>
            </select>
        </el-form-item>
        <el-form-item>
          <span>系统告警重要级别通知：</span>
              <select v-model="editForm.majorLevel">
                <option value='3'>短信邮件</option>
                <option value='0'>不通知</option>
                <option value='1'>短信</option>
                <option value='2'>邮件</option>
            </select>
        </el-form-item>
        <el-form-item>
          <span>系统告警紧急级别通知：</span>
              <select v-model="editForm.urgentLevel">
                <option value='3'>短信邮件</option>
                <option value='0'>不通知</option>
                <option value='1'>短信</option>
                <option value='2'>邮件</option>
            </select>
        </el-form-item>
        <el-form-item>
          <span>系统告警其他级别通知：</span>
              <select v-model="editForm.otherLevel">
                <option value='3'>短信邮件</option>
                <option value='0'>不通知</option>
                <option value='1'>短信</option>
                <option value='2'>邮件</option>
            </select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editNotify" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!-- 选择模块名界面 -->
    <el-dialog title="选择模块名" v-model="moduleNameVisible"  :close-on-click-modal="false" width="80%">
      <el-table :data="secrets" highlight-current-row @selection-change="_selsChange" ref="table">
      <el-table-column type="selection" width="40">
      </el-table-column>
      <el-table-column prop="sn" v-if="false">
      </el-table-column>
      <el-table-column prop="moduleId" label="模板ID" sortable>
      </el-table-column>
      <el-table-column prop="moduleName" label="模块名称" width="180" sortable>
      </el-table-column>
      <el-table-column prop="moduleIp" label="IP" width="150" sortable>
      </el-table-column>
      <el-table-column prop="modulePort" label="端口" width="120" sortable>
      </el-table-column>
     <!--  <el-table-column prop="thresholdCpu" label="CPU告警阈值" width="180" show-overflow-tooltip sortable>
      </el-table-column>
      <el-table-column prop="thresholdMem" label="内存告警阈值" width="180" sortable>
      </el-table-column>
      <el-table-column prop="thresholdThreadNum" label="线程数" width="100" sortable>
      </el-table-column>s
      <el-table-column prop="createTime" label="创建时间" width="180" sortable> -->
     <!--  </el-table-column> -->
    </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button v-on:click="reset">取消</el-button>
        <el-button type="primary" @click.native="moduleNameVisible = false">确定</el-button>
      </div>
    </el-dialog>

    <!-- 模块查看界面 -->
    <el-dialog title="查看模块" v-model="lookVisible"  :close-on-click-modal="false" style="width:90%;left:5%">
      <el-table :data="modules" highlight-current-row>
      <el-table-column prop="moduleId" label="ID" sortable>
      </el-table-column>
      <el-table-column prop="moduleName" width="200" label="模块名称"  sortable>
      </el-table-column>
      <el-table-column prop="moduleIp" label="IP" width="160" show-overflow-tooltip sortable>
      </el-table-column>
      <el-table-column prop="modulePort" label="端口" width="120" sortable>
      </el-table-column>
    </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="lookVisible = false">确定</el-button>
      </div>
    </el-dialog>

    </section>
</template>

<script>
    import {formatDate} from '../../common/date.js';
    export default {
        data() {
            return {
              moduleName:'',
              name:'',
              mobile:'',
              email:'',
              id:'',
              enabledMethod:'',
              createBegin:null,
              createEnd:null,
              updateBegin:null,
              updateEnd:null,
              startTime:null,
              endTime:null,
              total: 0,
              pageNum: 1,
              pageSize: 20,
              sels: [],//列表选中列
              _sel:[],
              _moduleNames:'',
              preModuleNames:'',
              moduleNames:'',
              preModuleIds:[],
              modules:[],
              record: [],
              secrets:[],
              addForm: {
                moduleIds: [],
                name:'',
                mobile:'',
                email:'',
                enabledMethod:3,
                nomalLevel:1,
                majorLevel:3,
                urgentLevel:3,
                otherLevel:3
              },
              editForm: {
                moduleIds: [],
                id:'',
                name:'',
                mobile:'',
                email:'',
                enabledMethod:3,
                nomalLevel:1,
                majorLevel:3,
                urgentLevel:3,
                otherLevel:3
              },
              addFormVisible: false,//新增界面是否显示
              editFormVisible:false,//编辑界面是否显示
              moduleNameVisible:false,//模块选择界面是否显示
              lookVisible:false,//查看模块界面
              addLoading: false,
              rule1: {
                  name: [
                    { required: true, message: '请输入通知人名称', trigger: 'blur' }
                  ],
                  mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' }
                  ],
                  email: [
                    { required: true, message: '请邮箱', trigger: 'blur' }
                  ],
                  
              },
            }
        },
        methods: {
            //显示新增界面
              handleAdd: function () {
                this._moduleNames = ''
                this.addFormVisible = true;
              },
              handleModule:function(flag){
                const that = this
                this.moduleNameVisible = true
                this.getAppList(flag)
              },
              showStatus(row) {
              var status = row.status
              if (1 == status){
                return '正常'
              }else {
                return '异常'
              }
            },
              showMethod(row) {
                var type = row.enabledMethod ;
                if (type== 0) {
                  return "不通知";
                }else if(type== 1){
                  return "短信";
                }else if(type== 2){
                  return "邮件";
                }else {
                  return "邮件短信"
                }
            },
            //显示编辑界面
            handleEdit: function (index, row) {
              this.editForm.id = row.id
              this.editFormVisible = true;
              this.editForm = Object.assign({}, row);
              this.getModuleList(row);
            },
            //显示查看界面
            handleLook: function (index, row) {
              this.lookVisible = true;
              this.getModuleList(row);
            },

            getModuleList(row){
              const that = this
              showLoading()
              $.ajax({
                headers:{
                  AccessToken: sessionStorage.getItem('token'),
                  userId: sessionStorage.getItem('userId'),
                },
                type:"GET",
                url:'/gateway/notify/list/module',
                data:{
                  "id":row.id
                },
                contentType: 'application/x-www-form-urlencoded',
                dataType:"json",
                success:function(response){
                  if(response.code==0){
                    that.modules = response.data
                    that._moduleNames = response.data.map(item => item.moduleName).join()
                    that.preModuleNames = response.data.map(item => item.moduleName).join()
                    that.editForm.moduleIds = response.data.map(item => item.moduleId)
                    that.preModuleIds =  response.data.map(item => item.moduleId)
                    
                  }
                  closeLoading()
                },
                error: function() {
                  layer.msg("网络异常，请稍后再试！！");
                  closeLoading();
                }
              })
            },

            changePage(page) {
                this.pageNum = page;
                this.getNotifyList();
            },
            //获取人员列表
            getNotifyList() {
              showLoading()
              const that = this
              //alert(this.format(this.startTime))
              $.ajax({
                headers:{
                  AccessToken: sessionStorage.getItem('token'),
                  userId: sessionStorage.getItem('userId'),

                },
                type:"GET",
                url:'/gateway/notify/list',
                data:{
                  'id': that.id,
                  'moduleName':that.moduleName,
                  'name':that.name,
                  'mobile':that.mobile,
                  'email': that.email,
                  'enabledMethod':that.enabledMethod,
                  'createBegin':(that.startTime==null||that.startTime=='')?null:formatDate(new Date(that.startTime),"yyyy-MM-dd hh-mm:ss"),
                  'createEnd': (that.endTime==null||that.endTime=='')?null:formatDate(new Date(that.endTime),"yyyy-MM-dd hh-mm:ss"),
                 
                  // 'pageSize': that.pageSize
                },
                contentType: 'application/x-www-form-urlencoded',
                dataType:"json",
                success: function(response){
                  if (0 == response.code){
                    let data = response.data
			           		that.record = data.list
                  }
                  closeLoading()
                },
                error: function() {
                  layer.msg("网络异常，请稍后再试！！");
                  closeLoading();
                }
              });
            },
            //获取配置列表
            getAppList(flag) {
              showLoading()
              const that = this
              $.ajax({
                headers:{
                  AccessToken: sessionStorage.getItem('token'),
                  userId: sessionStorage.getItem('userId')
                },
                type:"GET",
                url: "/gateway/config/list",
                data:{
                'id': null,
                'moduleName':null,
                'createBegin':null,
                'createEnd':null
                },
                contentType: 'application/x-www-form-urlencoded',
                dataType:"json",
                success: function(response){
                  if (0 == response.code){
                    let data = response.data
                    that.secrets = data.list
                    that._sels =  JSON.stringify(data.list.map(item => item.moduleId)) 
                    if(flag){
                      that.$nextTick(function(){
                      const len = that.editForm.moduleIds.length
                      for(var j=0;j<that.secrets.length;j++){
                          for(var i=0;i<that.editForm.moduleIds.length;i++){
                            if(i<len){
                              if(that.secrets[j].moduleId==that.preModuleIds[i]){
                                that.$refs.table.toggleRowSelection(that.secrets[j])
                              }
                            }
                          }
                        }
                      }) 
                    }
                  }
                  closeLoading()
                },
                error: function() {
                  layer.msg("网络异常，请稍后再试！！");
                  closeLoading()
                }
              });
              
            },

            addNotify(){
              this.$refs.addForm.validate((valid) => {
                if(valid){
                  this.addForm.moduleIds = this._sels
                  const that = this
                  $.ajax({
                    headers:{
                      AccessToken: sessionStorage.getItem('token'),
                      userId: sessionStorage.getItem('userId')
                    },
                    type:"POST",
                    url:'/gateway/notify/add',
                    data:that.addForm,
                    dataType:"json",
                    success: function(response){
                      if (0 == response.code){
                        that.getNotifyList();
                        that.addFormVisible = false;
                        layer.msg("添加成功！！");
                      }else {
                        layer.msg("添加失败！！");
                        }
                      },
                      error: function() {
                        layer.msg("网络异常，请稍后再试！！");
                      }
                    });
                }
              })
            },
            //删除
            delNofity: function (row) {
              const that = this
              this.$confirm('确认删除吗?', '提示', {
                //type: 'warning'
              }).then(() => {
                   $.ajax({
                  headers:{
                    AccessToken: sessionStorage.getItem('token'),
                    userId: sessionStorage.getItem('userId')
                  },
                  type:"POST",
                  url:'/gateway/notify/delete',
                  data:{
                    id:row.id
                  },
                  dataType:"json",
                  success: function(response){
                    if (0 == response.code){
                      that.getNotifyList();
                      layer.msg("删除成功！！");
                    }else {
                      layer.msg("删除失败！！");
                    }
                  },
                  error: function() {
                    layer.msg("网络异常，请稍后再试！！");
                  }
                });    
                
              }).catch(() => {

              });        
            },
            //编辑
            editNotify: function (row) {
              showLoading()
              this.$refs.editForm.validate((valid) => {
                if (valid) {
                      const that = this
                      $.ajax({
                        headers:{
                          AccessToken: sessionStorage.getItem('token'),
                          userId: sessionStorage.getItem('userId'),
                        },
                        type:"POST",
                        url: '/gateway/notify/update',
                        data:that.editForm,
                        dataType:"json",
                        success: function(response){
                          if (0 == response.code){
                            that.getNotifyList();
                            layer.msg("更新成功！！");
                            that.editFormVisible = false;
                          }else {
                            layer.msg("更新失败！！");
                          }
                          closeLoading()
                          that.editFormVisible = false
                        },
                        error: function() {
                          layer.msg("网络异常，请稍后再试！！");
                          closeLoading()
                          that.editFormVisible = false
                        }
                      });
                }
              });
            },

            selsChange: function (sels) {
                this.sels = sels;
            },
            _selsChange: function (sels) {
                this._sels = JSON.stringify(sels.map(item => item.moduleId)) 
                this._moduleNames = sels.map(item => item.moduleName).join()
                this.editForm.moduleIds = this._sels
            },
            clear:function(){
              this._sels = []
              this.preModuleIds = [],
              this._moduleNames = ''
              this.moduleNameVisible = false
            },
            reset:function(){
              this._moduleNames = this.preModuleNames
              this._sels = this.preModuleIds
              this.moduleNameVisible = false
            }
        },
        
        mounted() {
            this.getNotifyList();
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