<template>
	<section>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
                <!--<el-form-item>-->
                    <!--<el-input v-model="appId" placeholder="应用ID"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item>
					<el-input v-model="id" placeholder="ID"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="moduleName" placeholder="模块名"></el-input>
				</el-form-item>
				<el-form-item>
                    <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime"></el-date-picker>
                </el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getAppList">查询</el-button>
				</el-form-item>
				
			</el-form>
		</el-col>

		<el-button type="primary" @click="handleAdd">新增</el-button>

		<!--列表-->
		<el-table :data="secrets" highlight-current-row @selection-change="selsChange" style="width: 100%;margin-top: 10px">
			<el-table-column type="selection" width="40">
			</el-table-column>
			<el-table-column prop="id" v-if="false" label="ID" width="80" sortable>
			</el-table-column>
			<el-table-column prop="moduleName" label="模块名称" sortable>
			</el-table-column>
			<el-table-column prop="moduleIp" label="IP" sortable>
			</el-table-column>
			<el-table-column prop="modulePort" label="端口" sortable>
			</el-table-column>
			<el-table-column prop="thresholdCpu" label="CPU告警阈值" width="180" show-overflow-tooltip sortable>
			</el-table-column>
			<el-table-column prop="thresholdMem" label="内存告警阈值" width="180" sortable>
			</el-table-column>
			<el-table-column prop="thresholdThreadNum" label="线程数" width="100" sortable>
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间"  sortable>
			</el-table-column>
			<el-table-column prop="updateTime" label="更新时间"  sortable>
			</el-table-column>
			
			<el-table-column label="操作" width="180">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
					<el-button size="small" @click="delSecret(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24">
			<el-pagination layout="prev, pager, next" @current-change="changePage" :page-size="pageSize" :total="total" style="float:right;margin-top: 18px">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false" style="width:70%;left:15%">
			<el-form :model="editForm" label-width="80px" :rules="rule1" ref="editForm">
				
				<el-form-item label="模块名" prop="moduleName">
					<el-col :span="12">
						<el-input v-model="editForm.moduleName"  placeholder=""></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="IP地址" prop="moduleIp">
					<el-col :span="12">
						<el-input v-model="editForm.moduleIp"  placeholder=""></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="端口" prop="modulePort">
					<el-col :span="12">
						<el-input v-model="editForm.modulePort"  placeholder=""></el-input>
					</el-col>
				</el-form-item>
				
				<el-form-item label="CPU使用率">
					<el-input-number v-model="editForm.cpu" :min="0" :max="100" ></el-input-number>
					<span class="cpu">(0~100) 0表示不监控cpu</span>
				</el-form-item>

				<el-form-item label="内存使用率">
					<el-input-number v-model="editForm.memory" :min="0" :max="100" ></el-input-number>
					<span class="memory">(0~100) 0表示不监控内存</span>
				</el-form-item>

				<el-form-item label="阻塞线程占用率">
					<el-input-number v-model="editForm.thread" :min="0" :max="100" ></el-input-number>
					<span class="thread">(0~100) 0表示不监控阻塞现场</span>
				</el-form-item>
			
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click="editSecret">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false" style="width:70%;left:15%">
			<el-form :model="addForm" label-width="120px" :rules="rule1" ref="addForm">
				<el-form-item label="模块名" prop="moduleName">
					<el-col :span="12">
						<el-input v-model="addForm.moduleName"  placeholder=""></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="IP地址" prop="moduleIp">
					<el-col :span="12">
						<el-input v-model="addForm.moduleIp"  placeholder=""></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="端口" prop="modulePort">
					<el-col :span="12">
						<el-input v-model="addForm.modulePort"  placeholder=""></el-input>
					</el-col>
				</el-form-item>
				
				<el-form-item label="CPU使用率">
					<el-input-number v-model="addForm.cpu" :min="0" :max="100" ></el-input-number>
					<span class="cpu">(0~100) 0表示不监控cpu</span>
				</el-form-item>

				<el-form-item label="内存使用率">
					<el-input-number v-model="addForm.memory" :min="0" :max="100" ></el-input-number>
					<span class="memory">(0~100) 0表示不监控内存</span>
				</el-form-item>

				<el-form-item label="阻塞线程占用率">
					<el-input-number v-model="addForm.thread" :min="0" :max="100" ></el-input-number>
					<span class="thread">(0~100) 0表示不监控阻塞现场</span>
				</el-form-item>
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSecret" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import {formatDate} from '../../common/date.js';
	export default {
		data() {
			return {
				description:'',
                moduleName:'',
                id:'',
                createTime:null,
				updateTime: null,
				thresholdMem: 0,
				thresholdCpu:0,
				thresholdThreadNum:0,
				endTime:null,
				startTime:null,
				pageNum: 1,
                pageSize: 20,
                total:0,
				sels: [],//列表选中列
				secrets:[],
				editFormVisible: false,//编辑界面是否显示
				//编辑界面数据
				editForm: {
				  id:null,
                  moduleName: '',
                  moduleIp:'',
                  modulePort:'',
				  cpu: 0,
				  memory: 0,
				  thread: 0
				},


				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				rule1: {
                  moduleName: [
                    { required: true, message: '请输入模块名', trigger: 'blur' }
                  ],
                  moduleIp: [
                  	{required: true,message: '请输入IP',trigger: 'blur'}
                  ],
                  modulePort: [
                  	{required : true, message: '请输入端口',trigge: 'blur'}
                  ],
				},
				addForm: {
					moduleName: '',
					moduleIp:'',
                  	modulePort:'',
				  	cpu: 0,
				  	memory: 0,
				  	thread: 0
				}
			}
		},
		methods: {
		  showAppStatus(row) {
              var status = row.status
			  if (1 == status){
				return '可用'
			  }else if(0 == status){
				return '禁用'
			  }
			},
          showAppTimes(row) {
            var times = row.times
            if (-1 == times){
              return '无约束'
            }else{
              return times
            }
          },
          showAppType(row) {
            var type = row.type ;
            return this.showType(type)
          },
          showType(type) {
            var msg = '';
            if (type.indexOf("a") != -1) {
              msg = msg + "短信"
            }
            if(type.indexOf("b") != -1){
              msg = msg + ",流量"
            }
            if(type.indexOf("Z") != -1){
              msg = msg + ",其它"
            }
            return msg;
          },
            changePage(page) {
                this.pageNum = page;
                this.getAppList();
            },
			//获取用户列表
			getAppList() {

			  const that = this
              $.ajax({
                headers:{
                  AccessToken: sessionStorage.getItem('token'),
                  userId: sessionStorage.getItem('userId')
                },
                type:"GET",
                url: "/gateway/config/list",
                data:{
				  'id': that.id,
                  'moduleName':that.moduleName,
                  'createBegin':(that.startTime==null||that.startTime=='')?null:formatDate(new Date(that.startTime),"yyyy-MM-dd hh:mm:ss"),
                  'createEnd':(that.endTime==null||that.endTime=='')?null:formatDate(new Date(that.endTime),"yyyy-MM-dd hh:mm:ss")
				},
                contentType: 'application/x-www-form-urlencoded',
                dataType:"json",
                success: function(response){

                  if (0 == response.code){
                    let data = response.data
					that.secrets = data.list
                  }
                },
                error: function() {
                  layer.msg("网络异常，请稍后再试！！");
                }
              });
			},

			//显示编辑界面
			handleEdit: function (index, row) {
				this.editForm.id = row.id
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},

			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
			},
			//编辑
			editSecret: function (row) {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
                      const that = this
                      $.ajax({
                        headers:{
                          AccessToken: sessionStorage.getItem('token'),
                          userId: sessionStorage.getItem('userId'),
                        },
                        type:"POST",
                        url: '/gateway/config/update',
                        data:that.editForm,
                        dataType:"json",
                        success: function(response){
                          if (0 == response.code){
                            that.getAppList();
                            layer.msg("更新成功！！");
                            that.editFormVisible = false;
                          }else {
                            layer.msg("更新失败！！");
                          }
                        },
                        error: function() {
                          layer.msg("网络异常，请稍后再试！！");
                        }
                      });
					}
				});
			},
			//新增
			addSecret: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
                      const that = this
                      $.ajax({
                        headers:{
                          AccessToken: sessionStorage.getItem('token'),
                          userId: sessionStorage.getItem('userId')
                        },
                        type:"POST",
                        url:'/gateway/config/add',
                        data:that.addForm,
                        dataType:"json",
                        success: function(response){
                          if (0 == response.code){
                            that.getAppList();
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
				});
			},
			//删除
			delSecret: function (row) {
				const that = this
				this.$confirm("确认删除吗?", '提示', {
					//type: 'warning'
				}).then(() => {
                  $.ajax({
                  headers:{
                    AccessToken: sessionStorage.getItem('token'),
                    userId: sessionStorage.getItem('userId')
                  },
                  type:"POST",
                  url:'/gateway/config/delete',
                  data:{
                  	id:row.id
                  },
                  dataType:"json",
                  success: function(response){
                    if (0 == response.code){
                      that.getAppList();
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
			selsChange: function (sels) {
				this.sels = sels;
				//this.ids = JSON.stringify(this.sels.map(item => item.id)) 
			}
		},
		mounted() {
			this.getAppList();
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