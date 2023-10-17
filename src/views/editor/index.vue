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
								{{ $t('File') }}
							</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="cmdOpenProject">
									<div class="header-dropdown-item">
										<div>{{ $t('OpenProject') }}</div>
										<div></div>
									</div>
								</el-dropdown-item>
								<el-dropdown-item command="cmdSaveProject">
									<div class="header-dropdown-item">
										<div>{{ $t('SaveProject') }}</div>
										<div></div>
									</div>
								</el-dropdown-item>
								<el-dropdown-item command="cmdLoadConfig">
									<div class="header-dropdown-item">
										<div>{{ $t('LoadConfiguration') }}</div>
										<div></div>
									</div>
								</el-dropdown-item>
								<el-dropdown-item command="cmdExportConfig">
									<div class="header-dropdown-item">
										<div>{{ $t('ExportConfiguration') }}</div>
										<div></div>
									</div>
								</el-dropdown-item>
								<el-dropdown-item command="cmdExportImage">
									<div class="header-dropdown-item">
										<div>{{ $t('ExportPicture') }}</div>
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
					<div class="header-item">
						<el-dropdown @command="changeLang">
							<span class="el-dropdown-link">
								{{ $i18n.locale }}
							</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item v-for="(item, index) in $i18n.messages" :key="index" :command="index">
									<div class="header-dropdown-item">
										<div>{{ index }}</div>
										<div></div>
									</div>
								</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</div>
					<div>
						<a href="https://github.com/Xuanfq/AutoRunX-Creator" target="_blank">
							<i class="el-icon-github" style="font-size: 32px;"></i>
						</a>
					</div>
				</el-col>
			</el-row>
		</div>
		<!-- 工具栏 -->
		<div id="toolbar" class="toolbar">
			<div class="toolbar-left"> </div>
			<div class="toolbar-center">
				<div v-if="false" class="toolbar-container" style="left: 0px; right: initial;">
					<el-tooltip effect="dark" :content="$t('Designer')" placement="bottom">
						<div class="tool-button" @click="triggerChangeIsLeftOn" :class="isLeftOn ? 'button-on' : ''">
							<i class="el-icon-theme"></i>
						</div>
					</el-tooltip>
					<el-divider direction="vertical"></el-divider>
				</div>
			</div>
			<div class="toolbar-right">
				<el-tooltip effect="dark" :content="$t('Fold')" placement="bottom">
					<div class="tool-button" @click="triggerChangeIsHeaderFold">
						<i :class="'el-icon-arrow-' + (isTopFold ? 'down' : 'up')"></i>
					</div>
				</el-tooltip>
				<el-tooltip effect="dark" :content="$t('Center')" placement="bottom">
					<div class="tool-button" @click="triggerScrollToCenter">
						<i class="el-icon-aim"></i>
					</div>
				</el-tooltip>
				<el-divider v-if="false" direction="vertical"></el-divider>
				<el-tooltip v-if="false" effect="dark" :content="$t('PropertyBar')" placement="bottom">
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
					<el-tooltip effect="dark" :content="$t('SelectQuantity/NumberDrawn')" placement="bottom">
						<div class="footer-item">

						</div>
					</el-tooltip>
				</div>
				<div class="footer-right">
					<el-tooltip effect="dark" :content="$t('FullScreen')" placement="bottom">
						<div @click="triggerChangeFullScreen" class="footer-item footer-button">
							<i class="el-icon-full-screen"></i>
						</div>
					</el-tooltip>
					<el-tooltip v-if="false" effect="dark" :content="$t('ZoomOut')" placement="bottom">
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
					<el-tooltip v-if="false" effect="dark" :content="$t('ZoomIn')" placement="bottom">
						<div @click="triggerChangeScale((scale + 0.05) <= 10 ? (scale + 0.05) : 10)"
							class="footer-item footer-button">
							<i class="el-icon-plus"></i>
						</div>
					</el-tooltip>
					<el-tooltip v-if="false" effect="dark" :content="$t('ResetZoom')" placement="bottom">
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
		<el-dialog :title="$t('FindNode')" :visible="isShowSearchNodeDialog" width="60%"
			@close="isShowSearchNodeDialog = false" center>
			<el-input :placeholder="$t('EnterAKeywordToSearch')" v-model="searchNodeFilterText">
			</el-input>
			<el-row :gutter="0">
				<el-col :span="12">
					<div
						style="border-right: 1px solid lightgrey;padding:0 20px;margin-top: 25px;height: 350px;overflow-y: scroll;">
						<el-tree :data="searchNodeData" :props="searchNodeDefaultProps" :default-expand-all="false"
							:filter-node-method="triggerSearchNodeFilterNode" :expand-on-click-node="true" accordion
							@node-click="triggerSearchNodeClickNode" @node-contextmenu="triggerSearchNodeRightClickNode"
							ref="searchNodeTree">
						</el-tree>
					</div>
				</el-col>
				<el-col :span="12" v-loading="searchNodeSelectNodeDocLoading">
					<div
						style="border-left: 1px solid lightgrey;padding:0 20px;margin-top: 25px;height: 350px;overflow-y: scroll;">
						<div v-if="!searchNodeSelectNode || !searchNodeSelectNodeDoc">
							<el-empty
								:description="!searchNodeSelectNode ? $t('PleaseSelectNode') : $t('NoNode') + '「' + searchNodeSelectNode.name + '」' + $t('sIntro')">
							</el-empty>
						</div>
						<div v-if="searchNodeSelectNode && searchNodeSelectNodeDoc">
							<vue-markdown :source="searchNodeSelectNodeDoc" :breaks="true" :typographer="true"
								:linkify="true" :highlight="true"></vue-markdown>
						</div>
					</div>
				</el-col>
			</el-row>
			<span slot="footer" class="dialog-footer">
				<el-button @click="isShowSearchNodeDialog = false">{{ $t('Cancel') }}</el-button>
				<el-button :disabled="!searchNodeSelectNode" type="primary"
					@click="triggerSearchNodeRightClickNode(null, searchNodeSelectNode)">{{ $t('Confirm') }}</el-button>
			</span>
		</el-dialog>
		<!-- 修改节点属性抽屉 -->
		<el-drawer :title="$t('EditProperties')" :visible="isShowEditNodeAttrDrawer" direction="rtl"
			@close="triggerCloseEditNodeAttrDrawer" size="20%">
			<div class="attribute-box">
				<div v-if="editNodeAttrData" class="attribute-item">
					<div class="attribute-title">{{ $t('Input') }}</div>
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
								<el-input v-model="editNodeAttrData.input[index]"
									:placeholder="$t('PleaseEnterAString')"></el-input>
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
import * as PFGraph from "./ProgramFlowGraph.js"
import * as Api from '@/api'

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
			searchNodeSelectNode: null,
			searchNodeSelectNodeDoc: null,
			searchNodeSelectNodeDocLoading: false,
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
				nodeList: [],
			}, {
				type: 'func',
				name: '程序功能节点',
				nodeList: [],
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
					"node_name": "evrx-start",
					"node_type": "evrx",
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
					"node_name": "evtx-end",
					"node_type": "evtx",
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
		this.refresh()
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
			this.triggerOpenSearchNodeDialog()
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
		// =============================================== file ==================================================
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
					PFGraph.loadConfig(config)
					this.$message({
						message: this.$i18n.t('LoadSuccess'),
						type: 'success'
					})
				})
			} else if (command === "cmdExportConfig") {
				const config = PFGraph.saveConfig()
				// console.log("saved", config)
				FileUtils.downloadFile(this.projectName + ".json", JSON.stringify(config))
				this.$message({
					message: this.$i18n.t('SaveSuccess'),
					type: 'success'
				})
			} else if (command === "cmdOpenProject") {
				FileUtils.uploadFile('.arxc', (data) => {
					const config = JSON.parse(data)
					PFGraph.loadConfig(config)
					this.$message({
						message: this.$i18n.t('LoadSuccess'),
						type: 'success'
					})
				})
			} else if (command === "cmdSaveProject") {
				const config = PFGraph.saveConfig()
				FileUtils.downloadFile(this.projectName + '.arxc', JSON.stringify(config))
				this.$message({
					message: this.$i18n.t('SaveSuccess'),
					type: 'success'
				})
			}
		},
		// =============================================== language ==================================================
		changeLang(lang) {
			// console.log(this.$gfunc)
			this.$gfunc.changeLang(lang)
			this.refresh()
		},
		// =============================================== refresh ==================================================
		refresh() {
			// 加载配置
			Api.node.getBaseNodeData((res) => {
				if (res.flag) {
					this.searchNodeData = res.data
				} else {
					this.$message({
						type: 'error',
						message: res.data
					})
				}
			}, this)
		},
		// =============================================== find node ==================================================
		triggerSearchNodeFilterNode(value, data) {
			if (!value) return true;
			return data.name.indexOf(value) !== -1 || (data.node_type && data.node_type.indexOf(value) !== -1);
		},
		triggerSearchNodeRightClickNode(e, data, node) {
			if (!data.nodeList) {
				// console.log(data)
				data = JSON.parse(JSON.stringify(data))
				data.id = `node-${data.node_name}-${Date.now()}-${(Math.random() * 1000000 + "").substring(0, 4)}`
				// console.log(data.id)
				Event.emit("addNode", data)
				this.isShowSearchNodeDialog = false
			}
		},
		triggerSearchNodeClickNode(data, node, vueobj) {
			if (!data.nodeList) {
				// console.log(data)
				data = JSON.parse(JSON.stringify(data))
				this.searchNodeSelectNode = data
				this.searchNodeSelectNodeDocLoading = true
				Api.node.getNodeDoc((res) => {
					// console.log("doc",res)
					if (res.flag) {
						this.searchNodeSelectNodeDoc = res.data
					} else {
						this.$message({
							type: 'error',
							message: res.data
						})
					}
					this.searchNodeSelectNodeDocLoading = false
				}, this, data)
			}
		},
		triggerOpenSearchNodeDialog() {
			this.searchNodeSelectNode = null
			this.searchNodeSelectNodeDoc = null
			this.isShowSearchNodeDialog = true
		},
		triggerCloseEditNodeAttrDrawer() {
			Event.emit("editNodeAttr", this.editNodeAttrData)
			this.isShowEditNodeAttrDrawer = false
		},
		// =============================================== view ==================================================
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
		// =============================================== switch ==================================================
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