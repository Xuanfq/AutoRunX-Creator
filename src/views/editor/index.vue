<template>
	<div id="PaperDesign" class="body">
		<!-- 头部 -->
		<div id="header" class="header" v-if="!isTopFold">
			<el-row type="flex" :gutter="20">
				<el-col :span="8" class="header-left">
					<img :src="require('/src/assets/img/logo.png')" alt="" />
					<div class="header-item">
						<el-dropdown @command="fileOperate">
							<span class="el-dropdown-link">
								文件
							</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="cmdOpenProject">
									<div class="header-dropdown-item">
										<div>打开</div>
										<div></div>
									</div>
								</el-dropdown-item>
								<el-dropdown-item command="cmdSaveProject">
									<div class="header-dropdown-item">
										<div>保存</div>
										<div></div>
									</div>
								</el-dropdown-item>
								<el-dropdown-item command="cmdLoadConfig">
									<div class="header-dropdown-item">
										<div>加载配置</div>
										<div></div>
									</div>
								</el-dropdown-item>
								<el-dropdown-item command="cmdExportConfig">
									<div class="header-dropdown-item">
										<div>导出配置</div>
										<div></div>
									</div>
								</el-dropdown-item>
								<el-dropdown-item command="cmdExportImage">
									<div class="header-dropdown-item">
										<div>导出图片</div>
										<div></div>
									</div>
								</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</div>
				</el-col>
				<el-col :span="8" class="header-center">
					<span style="font-weight: bold;font-size: x-large;">AutoRunX</span>
				</el-col>
				<el-col :span="8" class="header-right">
					<el-avatar icon="el-icon-user-solid" size="medium"></el-avatar>
				</el-col>
			</el-row>
		</div>
		<!-- 工具栏 -->
		<div id="toolbar" class="toolbar">
			<div class="toolbar-left"> </div>
			<div class="toolbar-center">
				<div v-if="false" class="toolbar-container" style="left: 0px; right: initial;">
					<el-tooltip effect="dark" content="设计器" placement="bottom">
						<div class="tool-button" @click="triggerChangeIsLeftOn" :class="isLeftOn ? 'button-on' : ''">
							<i class="el-icon-theme"></i>
						</div>
					</el-tooltip>
					<el-divider direction="vertical"></el-divider>
				</div>
			</div>
			<div class="toolbar-right">
				<el-tooltip effect="dark" content="折叠" placement="bottom">
					<div class="tool-button" @click="triggerChangeIsHeaderFold">
						<i :class="'el-icon-arrow-' + (isTopFold ? 'down' : 'up')"></i>
					</div>
				</el-tooltip>
				<el-tooltip effect="dark" content="中心" placement="bottom">
					<div class="tool-button" @click="triggerScrollToCenter">
						<i class="el-icon-aim"></i>
					</div>
				</el-tooltip>
				<el-divider v-if="false" direction="vertical"></el-divider>
				<el-tooltip v-if="false" effect="dark" content="属性栏" placement="bottom">
					<div class="tool-button" @click="triggerChangeIsRightOn" :class="isRightOn ? 'button-on' : ''">
						<i class="el-icon-s-operation"></i>
					</div>
				</el-tooltip>
			</div>
		</div>
		<div id="main-box">
			<!-- 设计器栏 -->
			<div id="resource" :style="'width:' + 310 + 'px;' + 'left:' + (isLeftOn ? 0 : -310) + 'px;'">

			</div>
			<!-- editor -->
			<div id="design-box"
				:style="'margin-left:' + (isLeftOn ? 310 : 0) + 'px;' + 'margin-right:' + (isRightOn ? 310 : 0) + 'px;'">
				<div id="design-minimap"
					style="position: absolute;top: 0px;right: 6px;background-color:rgba(44, 44, 44, 0.175);"></div>
				<div :style="'background-color:' + designCanvasBackgroundColor + ';' + 'height:' + (clientHeight - (isTopFold ? 65 : 125)) + 'px;'"
					id="design" ref="disignScrollBox">
				</div>
			</div>
			<!-- 底部 -->
			<div id="footer" :style="'right:' + (isRightOn ? 310 : 0) + 'px;'">
				<div class="footer-left">
					<el-tooltip effect="dark" content="选中数量/已画数量" placement="bottom">
						<div class="footer-item">

						</div>
					</el-tooltip>
				</div>
				<div class="footer-right">
					<el-tooltip effect="dark" content="全屏" placement="bottom">
						<div @click="triggerChangeFullScreen" class="footer-item footer-button">
							<i class="el-icon-full-screen"></i>
						</div>
					</el-tooltip>
					<el-tooltip v-if="false" effect="dark" content="缩小" placement="bottom">
						<div @click="triggerChangeScale((scale - 0.05) >= 0.02 ? (scale - 0.05) : 0.02)"
							class="footer-item footer-button">
							<i class="el-icon-minus"></i>
						</div>
					</el-tooltip>
					<div v-if="false" class="footer-item scale-box" style="width:100px;">
						<el-slider @change="triggerChangeScale" v-model="scale" :step="0.01" :min="0.02" :max="10"
							:show-tooltip="false">
						</el-slider>
					</div>
					<el-tooltip v-if="false" effect="dark" content="放大" placement="bottom">
						<div @click="triggerChangeScale((scale + 0.05) <= 10 ? (scale + 0.05) : 10)"
							class="footer-item footer-button">
							<i class="el-icon-plus"></i>
						</div>
					</el-tooltip>
					<el-tooltip v-if="false" effect="dark" content="重置缩放" placement="bottom">
						<div @click="triggerChangeScale(1)" class="footer-item" style="width:30px;">
							{{ (scale * 100).toFixed(0) }}%
						</div>
					</el-tooltip>
				</div>
			</div>
			<!-- 属性设置版面 -->
			<div id="attribute" :style="'width:' + 310 + 'px;' + 'right:' + (isRightOn ? 0 : -310) + 'px;'">

			</div>
		</div>
		<!-- 添加节点对话框 -->
		<el-dialog title="查找节点" :visible="isShowSearchNodeDialog" width="30%" @close="isShowSearchNodeDialog = false"
			center>
			<el-input placeholder="输入关键字进行过滤" v-model="searchNodeFilterText">
			</el-input>
			<div style="margin-top: 25px;height: 350px;overflow-y: scroll;">
				<el-tree class="filter-tree" :data="searchNodeData" :props="searchNodeDefaultProps"
					:default-expand-all="false" :filter-node-method="triggerSearchNodeFilterNode"
					@node-click="triggerSearchNodeClickNode" ref="searchNodeTree">
				</el-tree>
			</div>
		</el-dialog>
		<!-- 修改节点属性抽屉 -->
		<el-drawer title="编辑属性" :visible="isShowEditNodeAttrDrawer" direction="rtl" @close="triggerCloseEditNodeAttrDrawer"
			size="20%">
			<div class="attribute-box">
				<div v-if="editNodeAttrData" class="attribute-item">
					<div class="attribute-title">输入</div>
					<div v-for="item, index in editNodeAttrData.input_type" :key="index">
						<div v-if="item == 'def_bool'" class="attribute-key-value">
							<div>
								<div>{{ editNodeAttrData.input_intro[index] }}</div>
							</div>
							<div style="width: 150px;">
								<el-switch v-model="editNodeAttrData.input[index]" active-text="True" inactive-text="False">
								</el-switch>
							</div>
						</div>
						<div v-else-if="item == 'def_int'" class="attribute-key-value">
							<div>
								<div>{{ editNodeAttrData.input_intro[index] }}</div>
							</div>
							<div style="width: 150px;">
								<el-input-number style="width: 150px;" v-model="editNodeAttrData.input[index]" size="small"
									:precision="0"></el-input-number>
							</div>
						</div>
						<div v-else-if="item == 'def_float'" class="attribute-key-value">
							<div>
								<div>{{ editNodeAttrData.input_intro[index] }}</div>
							</div>
							<div style="width: 150px;">
								<el-input-number style="width: 150px;" v-model="editNodeAttrData.input[index]" size="small"
									:precision="10" :step="0.1"></el-input-number>
							</div>
						</div>
						<div v-else class="attribute-key-value">
							<div>
								<div>{{ editNodeAttrData.input_intro[index] }}</div>
							</div>
							<div style="width: 150px;">
								<el-input v-model="editNodeAttrData.input[index]" placeholder="请输入字符串"></el-input>
							</div>
						</div>
					</div>
				</div>
			</div>
		</el-drawer>
	</div>
</template>


<script>

import Event from "./../../utils/event.js"
import * as FileUtils from "./../../utils/file.js"
import * as ObjectUtils from "./../../utils/object.js"
import * as PFGraph from "./ProgramFlowGraph.js"

export default {
	// eslint-disable-next-line vue/multi-word-component-names
	name: "editor",
	watch: {
		searchNodeFilterText(val) {
			this.$refs.searchNodeTree.filter(val);
		}
	},
	data() {
		return {
			projectName: 'AutoRunX',
			// window
			clientWidth: null,
			clientHeight: null,
			// 左右选择栏或属性栏
			isTopFold: false,
			isLeftOn: false,
			isRightOn: false,
			// 右键菜单
			isMenuShow: false,
			menuOperations: ["aaa", "bbb"],
			menuEvent: null,
			// canvas及其容器
			designCanvasBackgroundColor: '#FFF2DE',
			designContainerWidth: 2048,
			designContainerHeight: 1024,
			designCanvasWidth: 1000,
			designCanvasHeight: 500,
			canvasBackgroundImage: "",
			scale: 1,
			// 画布实际宽高
			canvasWidht: 1000,
			canvasHeight: 500,
			// 查找节点对话框
			isShowSearchNodeDialog: false,
			searchNodeFilterText: '',
			searchNodeDefaultProps: { label: 'name', children: 'nodeList' },
			searchNodeData: [{
				type: 'dtio',
				name: '输入输出节点',
				nodeList: [],
			}, {
				type: 'dtpc',
				name: '数据处理节点',
				nodeList: [],
			}, {
				type: 'ctrl',
				name: '程序控制节点',
				nodeList: [{
					"id": "",
					"name": "For循环执行",
					"node_name": "ctrl-for",
					"node_type": "ctrl",
					"pre_edge_id": [],
					"nxt_edge_id": [""],
					"nxt_edge_id_intro": ["下一步: 执行"],
					"input": {
						"start_index": 0,
						"end_index": 5,
						"step": 1
					},
					"input_type": {
						"start_index": "number",
						"end_index": "number",
						"step": "number"
					},
					"input_intro": {
						"start_index": "开头: 数值",
						"end_index": "结尾: 数值",
						"step": "递进: 数值"
					},
					"output": {
						"index": 0,
						"loop_edge_id": ""
					},
					"output_type": {
						"index": "number",
						"loop_edge_id": "nxt_edge_id"
					},
					"output_intro": {
						"index": "索引: 数值",
						"loop_edge_id": "循环主体: 执行"
					}
				}, {
					"id": "",
					"name": "If条件执行",
					"node_name": "ctrl-if",
					"node_type": "ctrl",
					"pre_edge_id": [],
					"nxt_edge_id": ["", ""],
					"nxt_edge_id_intro": ["True: 执行", "False: 执行"],
					"input": {
						"bool": false
					},
					"input_type": {
						"bool": "bool"
					},
					"input_intro": {
						"bool": "条件: 布尔"
					},
					"output": {},
					"output_type": {}
				}, {
					"id": "",
					"name": "执行队列",
					"node_name": "ctrl-queue",
					"node_type": "ctrl",
					"pre_edge_id": [],
					"nxt_edge_id": [
						"",
						"",
						"",
						"",
						"",
						"",
						"",
						"",
						"",
						""
					],
					"nxt_edge_id_intro": [
						"下一步0: 执行",
						"下一步1: 执行",
						"下一步2: 执行",
						"下一步3: 执行",
						"下一步4: 执行",
						"下一步5: 执行",
						"下一步6: 执行",
						"下一步7: 执行",
						"下一步8: 执行",
						"下一步9: 执行"
					],
					"input": {},
					"input_type": {},
					"output": {},
					"output_type": {}
				}, {
					"id": "",
					"name": "选择执行",
					"node_name": "ctrl-select",
					"node_type": "ctrl",
					"pre_edge_id": [],
					"nxt_edge_id": [
						"",
						"",
						"",
						"",
						"",
						"",
						"",
						"",
						"",
						""
					],
					"nxt_edge_id_intro": [
						"0: 执行",
						"1: 执行",
						"2: 执行",
						"3: 执行",
						"4: 执行",
						"5: 执行",
						"6: 执行",
						"7: 执行",
						"8: 执行",
						"9: 执行"
					],
					"input": {
						"index": 0
					},
					"input_type": {
						"index": "number"
					},
					"input_intro": {
						"index": "选择索引: 数值"
					},
					"output": {},
					"output_type": {}
				}],
			}, {
				type: 'func',
				name: '程序功能节点',
				nodeList: [{
					"id": "",
					"name": "测试",
					"node_name": "func-test-1692798936169238-bc2b8ee241bc11ee8331dcf505272cb8-0_0_1",
					"node_type": "func",
					"pre_edge_id": [],
					"nxt_edge_id": [],
					"input": {
						"value": ""
					},
					"input_type": {
						"value": "string"
					},
					"input_intro": {
						"value": "测试值: 字符串"
					},
					"output": {
						"value": ""
					},
					"output_type": {
						"value": "string"
					},
					"output_intro": {
						"value": "测试值: 字符串"
					}
				}],
			}],
			// 编辑节点属性抽屉
			isShowEditNodeAttrDrawer: false,
			editNodeAttrData: null,
			// 状态
			state: {},
			graph: null,
			graphInitData: {
				nodes: [{
					"id": "node-start",
					"name": "开始",
					"node_name": "ctrl-start",
					"node_type": "start",
					"pre_edge_id": [],
					"nxt_edge_id": [""],
					"nxt_edge_id_intro": ["下一步: 执行"],
					"input": {
					},
					"input_type": {
					},
					"output": {
					},
					"output_type": {
					}
				}, {
					"id": "node-end",
					"name": "结束",
					"node_name": "ctrl-end",
					"node_type": "end",
					"pre_edge_id": [],
					"nxt_edge_id": [],
					"input": {
					},
					"input_type": {
					},
					"output": {
					},
					"output_type": {
					}
				}],
				edges: []
			},
		};
	},
	created() {
		// 加载配置
		this.$axios.get('https://raw.githubusercontent.com/Xuanfq/AutoRunX-Python/09bb6eb9c7d145dc04d4218efab6fbe850138c31/cli/doc/nodeData.json')
			.then((res)=>{
				// console.log(res)
				let data=JSON.parse(JSON.stringify(res.data))
				for(let i=0;i<data.length;i++){
					if(data[i].type=='ctrl'){
						data[i].nodeList=data[i].nodeList.filter((item)=>{
							return item.node_name!='ctrl-start' && item.node_name!='ctrl-end'
						})
					}
				}
				this.searchNodeData=data
			})
			.catch((err)=>{
				this.$message({
					type:'error',
					message:err
				})
			})
		// 初始化
		this.triggerScrollToCenter();
	},
	mounted() {
		this.clientWidth = document.body.clientWidth;
		this.clientHeight = document.body.clientHeight;
		this.designContainerWidth = this.clientWidth
		this.designContainerHeight = this.clientHeight
		window.onresize = () => {
			this.clientWidth = document.body.clientWidth;
			this.clientHeight = document.body.clientHeight;
			this.designContainerWidth = this.clientWidth
			this.designContainerHeight = this.clientHeight
			// console.log("resize", this.clientWidth, this.clientHeight)
		};

		this.graph = PFGraph.initGraph("design", window.innerWidth, window.innerHeight, "design-minimap", this.graphInitData)

		Event.on("rqAddNode", this, () => {
			this.isShowSearchNodeDialog = true
		})
		Event.on("rqEditNodeAttr", this, (data) => {
			// console.log("编辑", data)
			this.editNodeAttrData = data
			this.isShowEditNodeAttrDrawer = true
		})
		Event.on("rqShowMessage", this, (data) => {
			this.$message(data)
		})
	},
	methods: {
		// =============================================== 文件 ==================================================
		fileOperate(command) {
			if (command === "cmdExportImage") {
				this.graph.downloadFullImage(this.projectName, 'image/png', {
					backgroundColor: this.designCanvasBackgroundColor,
					padding: 50,
				});
			} else if (command === "cmdLoadConfig") {
				// 加载配置文件有一定的失色
				FileUtils.uploadFile('.json', (data) => {
					const config = JSON.parse(data)
					// console.log("loaded", loadedConfig)
					const loadedConfig = PFGraph.loadConfig(config)
					this.$message({
						message: '加载成功',
						type: 'success'
					})
				})
			} else if (command === "cmdExportConfig") {
				const config = PFGraph.saveConfig()
				// console.log("saved", config)
				FileUtils.downloadFile(this.projectName + ".json", JSON.stringify(config))
				this.$message({
					message: '保存成功',
					type: 'success'
				})
			} else if (command === "cmdOpenProject") {
				FileUtils.uploadFile('.arxc', (data) => {
					const config = JSON.parse(data)
					// console.log("loaded", loadedConfig)
					const saved = PFGraph.saveConfig(null, config.source.graph)
					if (ObjectUtils.isSame(saved.graph, config.graph)) {
						// 配置无改动，加载原图不失色
						PFGraph.loadConfigGraph(config)
					} else {
						// 配置有改动
						PFGraph.loadConfig(config)
					}
					this.$message({
						message: '加载成功',
						type: 'success'
					})
				})
			} else if (command === "cmdSaveProject") {
				const config = PFGraph.saveConfig()
				FileUtils.downloadFile(this.projectName + '.arxc', JSON.stringify(config))
			}
		},
		// =============================================== 配置 ==================================================
		// =============================================== 状态更新 ==================================================
		// =============================================== 查找节点 ==================================================
		triggerSearchNodeFilterNode(value, data) {
			if (!value) return true;
			return data.name.indexOf(value) !== -1;
		},
		triggerSearchNodeClickNode(data, node, vueobj) {
			if (node.isLeaf && !data.nodeList) {
				// console.log(data)
				data = JSON.parse(JSON.stringify(data))
				data.id = `node-${data.node_name}-${Date.now()}-${(Math.random() * 1000000 + "").substring(0, 4)}`
				// console.log(data.id)
				Event.emit("addNode", data)
				this.isShowSearchNodeDialog = false
			}
		},
		triggerCloseEditNodeAttrDrawer() {
			Event.emit("editNodeAttr", this.editNodeAttrData)
			this.isShowEditNodeAttrDrawer = false
		},
		// =============================================== 布局 ==================================================
		// =============================================== 视图 ==================================================
		triggerChangeFullScreen() {
			if (!document.fullscreenElement) {
				document.querySelector("html").requestFullscreen();
			}
			else {
				document.exitFullscreen();
			}
		},
		triggerScrollToCenter(isGraphFit = true) {
			this.$nextTick(() => {
				// console.log("居中")
				let containerWidth = this.$refs.disignScrollBox.offsetWidth;
				let containerHeight = this.$refs.disignScrollBox.offsetHeight;
				let top = (this.designContainerHeight - containerHeight) / 2;
				let left = (this.designContainerWidth - containerWidth) / 2;
				this.$refs.disignScrollBox.scrollTo({ top: top, left: left, behavior: "smooth" });
				isGraphFit && this.graph.fitCenter()
			});
		},
		// =============================================== 开关 ==================================================
		triggerChangeIsHeaderFold() {
			this.isTopFold = !this.isTopFold;
			setTimeout(() => {
				this.triggerScrollToCenter(false)
			}, 250);
		},
		triggerChangeIsLeftOn() {
			this.isLeftOn = !this.isLeftOn;
			setTimeout(() => {
				this.triggerScrollToCenter(false)
			}, 250);
			// let width = this.clientWidth - (this.isRightOn ? 310 : 0) - (this.isLeftOn ? 250 : 0)-6
			// let height = this.clientHeight - (this.isTopFold ? 65 : 125)
			// this.graph.changeSize(width, height)
		},
		triggerChangeIsRightOn() {
			this.isRightOn = !this.isRightOn;
			setTimeout(() => {
				this.triggerScrollToCenter()
			}, 250);
			// let width = this.clientWidth - (this.isRightOn ? 310 : 0) - (this.isLeftOn ? 250 : 0)-6
			// let height = this.clientHeight - (this.isTopFold ? 65 : 125)
			// setTimeout(() => {
			// 	this.graph.changeSize(width, height)
			// }, this.isRightOn?500:0);
		},
		// =============================================== 工具 ==================================================

	},
	components: {}
}
</script>

<style>
@import './index.css';
@import '../../style/common.css';

/* el-menu */
.header-menu .el-menu.el-menu--horizontal {
	border-bottom: 0px solid #e6e6e6;
}

.header-menu .el-menu--horizontal>.el-submenu .el-submenu__title {
	height: 33px;
	line-height: 15px;
	border-bottom: 0px solid rgba(0, 0, 0, 0);
	display: flex;
	align-items: center;
	color: #606266;
}

.header-menu .el-submenu__title {
	padding: 0;
}

.header-menu .el-submenu.is-opened>.el-submenu__title .el-submenu__icon-arrow {
	display: none;
}

.header-menu .el-submenu>.el-submenu__title .el-submenu__icon-arrow {
	display: none;
}

.header-menu .el-menu--horizontal>.el-submenu.is-active .el-submenu__title {
	border-bottom: 0px solid #409EFF;
	color: #303133;
}


/* 放大缩小滑动条 */
.scale-box .el-slider__stop {
	height: 9px;
	margin-top: -8px;
	width: 2px;
	border-radius: 0;
	background-color: #E4E7ED;
}

.scale-box .el-slider__marks-text {
	margin-top: -30px;
}

.scale-box .el-slider__bar {
	background-color: #303133;
	height: 2px;
}

.scale-box .el-slider__runway {
	background-color: #303133;
	height: 2px;
	border-radius: 2px;
}

.scale-box .el-slider__button {
	color: red;
	width: 7px;
	height: 7px;
	background-color: #ffffff;
	border: 1px solid #303133;
	margin-top: -3px;
}

.scale-box .el-slider__button.hover,
.el-slider__button:hover {
	width: 9px;
	height: 9px;
}
</style>