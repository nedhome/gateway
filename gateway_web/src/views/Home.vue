<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				{{collapsed?'':Name}}
			</el-col>
            <el-dropdown-item class="breadcrumb-inner">{{$route.name}}</el-dropdown-item>
			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="hover">
					<!--<span class="el-dropdown-link userinfo-inner"><img :src="this.userLogo" /> {{userName}}</span>-->
                    <span class="el-dropdown-link userinfo-inner">{{userName}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<!--导航菜单-->
				<el-menu :default-active="$route.path" unique-opened router v-show="!collapsed">
					<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
					</template>
				</el-menu>
				<!--导航菜单-折叠后-->
				<ul class="el-menu collapsed" v-show="collapsed" ref="menuCollapsed">
					<li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">
						<template v-if="!item.leaf">
							<div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
								<i :class="item.iconCls"/>
							</div>
							<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
								<li v-for="child in item.children" v-if="!child.hidden" :key="child.path" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>
							</ul>
						</template>
						<template v-else>
							<li class="el-submenu">
								<div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)">
									<i :class="item.iconCls"/>
								</div>
							</li>
						</template>
					</li>
				</ul>
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
	export default {
		data() {
			return {
				Name:'告警网关',
				collapsed:false,
				userName: '',
				userLogo: '',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				}
			}
		},
		methods: {
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
                  sessionStorage.removeItem('userSn');
                  sessionStorage.removeItem('userName');
					_this.$router.push('/login');
				}).catch(() => {

				});


			},
			//折叠导航栏
			collapse:function(){
				// this.collapsed=!this.collapsed;
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			}
		},
		mounted() {
		  this.userName = sessionStorage.getItem('userName');
          // this.userLogo = sessionStorage.getItem('userLogo');
		}
	}

</script>

<style  scoped lang="scss">
.container {
	position: absolute;
	top: 0px;
	bottom: 0px;
	width: 100%;
}
.header {
	height: 60px;
	line-height: 60px;
	background: #1f2d3d;
	color:#fff;
}
.userinfo {
	text-align: right;
	padding-right: 35px;
	float: right;
}
.userinfo-inner {
	cursor: pointer;
	color:#fff;
    font-size: 18px;
    margin-right:30px;
}

.logo {
	height:60px;
	font-size: 22px;
	padding-left:20px;
	padding-right:20px;
	border-color: rgba(238,241,146,0.3);
	border-right-width: 1px;
	border-right-style: solid;
}

.txt {
	color:#fff;
}
.logo-width{
	width:230px;
}
.logo-collapse-width{
	width:60px
}
.tools{
	padding: 0px 23px;
	width:14px;
	height: 60px;
	line-height: 60px;
	cursor: pointer;
}
.main {
	display: flex;
	position: absolute;
	top: 60px;
	bottom: 0px;
	overflow: hidden;
}
aside {
	flex:0 0 230px;
	width: 230px;
}
.el-menu{
	height: 100%;
}
.collapsed{
	width:60px;
}
.item{
	position: relative;
}
.submenu{
	position:absolute;
	top:0px;
	left:60px;
	z-index:99999;
	height:auto;
	display:none;
}
.content-container {
	flex:1;
	overflow-y: scroll;
	padding: 20px;
}
.breadcrumb-inner {
	float: left;
    height:30px;
    font-size: 18px;
    padding-left:20px;
    line-height: 60px;
    color:#fff;
}

.content-wrapper {
	background-color: #fff;
	box-sizing: border-box;
}

</style>