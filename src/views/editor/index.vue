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
import G6 from "@antv/g6";
import Event from "./../../utils/event.js"
import * as FileUtils from "./../../utils/file.js"
import * as ObjectUtils from "./../../utils/object.js"
import flow_link_img from "/src/assets/editor/img/lightgreen-right-triangle.png";
import flow_linked_img from "/src/assets/editor/img/lightgreen-right-triangle-fill.png";
import flow_linkbg_img from "/src/assets/editor/img/lightgrey-right-triangle-fill.png";
import data_link_img from "/src/assets/editor/img/grey-circle.png";
import data_linked_img from "/src/assets/editor/img/grey-circle-fill.png";
import data_linkbg_img from "/src/assets/editor/img/lightgrey-circle-fill.png";
import node_type_flow_img from "/src/assets/editor/img/blue-flow-fill.png";
import node_type_data_img from "/src/assets/editor/img/orange-bigdata-fill.png";



/**
 * 计算字符串的长度
 * @param {string} str 指定的字符串
 * @return {number} 字符串长度
 */
const calcStrLen = (str) => {
	let len = 0;
	for (let i = 0; i < str.length; i++) {
		if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
			len++;
		} else {
			len += 2;
		}
	}
	return len;
};

/**
 * 计算显示的字符串
 * @param {string} str 要裁剪的字符串
 * @param {number} maxWidth 最大宽度
 * @param {number} fontSize 字体大小
 * @return {string} 处理后的字符串
 */
const fittingString = (str, maxWidth, fontSize) => {
	const fontWidth = fontSize * 1.3; // 字号+边距
	maxWidth = maxWidth * 2; // 需要根据自己项目调整
	const width = calcStrLen(str) * fontWidth;
	const ellipsis = "…";
	if (width > maxWidth) {
		const actualLen = Math.floor((maxWidth - 10) / fontWidth);
		const result = str.substring(0, actualLen) + ellipsis;
		return result;
	}
	return str;
};

const NODE_TYPE_IMAGE_MAP = {
	start: node_type_flow_img,
	end: node_type_flow_img,
	ctrl: node_type_flow_img,
	func: node_type_flow_img,
	dtio: node_type_data_img,
	dtpc: node_type_data_img
};

const NODE_TYPE_COLOR_MAP = {
	start: 'green',
	end: 'red',
	ctrl: 'orange',
	func: 'RoyalBlue',
	dtio: 'DarkCyan',
	dtpc: 'purple'
};

const VALUE_TYPE_COLOR_MAP = {
	pre_edge_id: 'lightgreen',
	nxt_edge_id: 'lightgreen',
	number: 'lightpink',
	string: 'lightgrey',
	bool: 'lightskyblue',
	default: 'lightgrey',
}

const FUNC_GET_EDGE_ANCHORPOINT_INDEX = (cfg, anchorPointShapeName) => {
	let isFunc = FUNC_GET_IS_FUNC_NODE(cfg.node_type)
	let isCtrl = FUNC_GET_IS_CTRL_NODE(cfg.node_type)
	let index = 0

	// 输入
	if (isCtrl || isFunc) {
		if (anchorPointShapeName.startsWith("pre_edge_id")) {
			return index
		}
		index++
	}
	for (let key in cfg.input) {
		if (anchorPointShapeName.startsWith(`input-${key}`)) {
			return index
		}
		index++
	}

	// 输出
	if (isFunc) {
		if (anchorPointShapeName.startsWith("nxt_edge_id")) {
			return index
		}
		index++
	} else if (isCtrl) {
		for (let i = 0; i < cfg.nxt_edge_id.length; i++) {
			if (anchorPointShapeName.startsWith("nxt_edge_id-" + i + "i")) {
				return index
			}
			index++
		}
	}
	for (let key in cfg.output) {
		if (anchorPointShapeName.startsWith(`output-${key}`)) {
			return index
		}
		index++
	}

	return -1
}

const FUNC_GET_EDGE_ANCHORPOINT_INDEX_FROM_ID = (cfg, id) => {
	let isFunc = FUNC_GET_IS_FUNC_NODE(cfg.node_type)
	let isCtrl = FUNC_GET_IS_CTRL_NODE(cfg.node_type)
	let index = 0

	// 输入
	if (isCtrl || isFunc) {
		if (id == null || id == undefined || id == "pre_edge_id") {
			return index
		}
		index++
	}
	for (let key in cfg.input) {
		if (id == `${cfg.id}.input.${key}`) {
			return index
		}
		index++
	}

	// 输出
	if (isFunc) {
		if (id == 0) {
			return index
		}
		index++
	} else if (isCtrl) {
		for (let i = 0; i < cfg.nxt_edge_id.length; i++) {
			if (id == i) {
				return index
			}
			index++
		}
	}
	for (let key in cfg.output) {
		if (id == `${cfg.id}.output.${key}`) {
			return index
		}
		index++
	}

	return -1
}

const FUNC_GET_EDGE_ANCHORPOINT_INDEX_ID = (cfg, anchorPointIndex) => {
	let isFunc = FUNC_GET_IS_FUNC_NODE(cfg.node_type)
	let isCtrl = FUNC_GET_IS_CTRL_NODE(cfg.node_type)
	let index = 0

	// 输入
	if (isCtrl || isFunc) {
		if (anchorPointIndex == index) {
			return "pre_edge_id"
		}
		index++
	}
	for (let key in cfg.input) {
		if (anchorPointIndex == index) {
			return `${cfg.id}.input.${key}`
		}
		index++
	}

	// 输出
	if (isFunc) {
		if (anchorPointIndex == index) {
			return 0
		}
		index++
	} else if (isCtrl) {
		for (let i = 0; i < cfg.nxt_edge_id.length; i++) {
			if (anchorPointIndex == index) {
				return i
			}
			index++
		}
	}
	for (let key in cfg.output) {
		if (anchorPointIndex == index) {
			return `${cfg.id}.output.${key}`
		}
		index++
	}

	return null
}

const FUNC_GET_IS_FLOW_NODE = (nodeType) => {
	if (
		nodeType === "start" ||
		nodeType === "end" ||
		nodeType === "ctrl" ||
		nodeType === "func"
	) {
		return true;
	}
	return false;
}

const FUNC_GET_IS_CTRL_NODE = (nodeType) => {
	if (
		nodeType === "start" ||
		nodeType === "end" ||
		nodeType === "ctrl"
	) {
		return true;
	}
	return false;
}

const FUNC_GET_IS_FUNC_NODE = (nodeType) => {
	if (
		nodeType === "func"
	) {
		return true;
	}
	return false;
}

const GRAPH_STATUS = {
	rqAddNode: {
		x: null,
		y: null,
	},
	rqEditNodeAttr: {

	},
}


G6.registerBehavior('custom-operate', {
	// 设定该自定义行为需要监听的事件及其响应函数
	getEvents() {
		return {
			'node:mousedown': 'onNodeMousedown',
			'mousemove': 'onMousemove',
			'mouseup': 'onMouseup',
			'edge:click': 'onEdgeClick',
			'edge:mouseenter': 'onEdgeMouseenter',
			'edge:mouseleave': 'onEdgeMouseleave',
			'keydown': 'onKeydown',
			'canvas:contextmenu': 'onCanvasContextmenu',
			"nodeselectchange": "onNodeselectchange",
		};
	},
	onNodeMousedown(e) {
		// console.log(e)
		if (e.originalEvent.button != 0) {
			// 非左键
			return
		}
		const node = e.item;
		const graph = this.graph;
		// 鼠标当前点击的节点的位置
		const point = { x: e.x, y: e.y };
		const model = node.getModel();
		const anchorPointRegExp = /(input|output|pre_edge_id|nxt_edge_id)-*\w*-(linkimage|linkedimage|linkbgimage)/
		const shapeName = e.target.cfg.name
		// console.log(shapeName,anchorPointRegExp.test(shapeName))
		// console.log(model)
		if (anchorPointRegExp.test(shapeName)) {
			let anchorPointClass = shapeName.match(/(input|output|pre_edge_id|nxt_edge_id)/)[0]
			let anchorPointType = anchorPointClass
			if (anchorPointClass === "input") {
				anchorPointType = model.input_type[shapeName.split("-")[1]]
			} else if (anchorPointClass === "output") {
				anchorPointType = model.output_type[shapeName.split("-")[1]]
			}
			// console.log(anchorPointClass, anchorPointType, FUNC_GET_EDGE_ANCHORPOINT_INDEX(model, shapeName))
			let anchorPointIndex = FUNC_GET_EDGE_ANCHORPOINT_INDEX(model, shapeName)
			let addNewEdge = false
			if (anchorPointClass === 'output' || anchorPointClass === 'nxt_edge_id' || anchorPointClass === 'pre_edge_id') {
				// 新增
				addNewEdge = true
			} else {
				// 是否存在边，有则编辑，无则新增
				const findSourceEdge = graph.find('edge', (edge) => {
					let m = edge.getModel()
					return m.source === model.id && m.sourceAnchor === anchorPointIndex
				})
				if (findSourceEdge) {
					// console.log("source", findSourceEdge)
					this.edgeIsUpdate = true
					this.edgeEndpointModel = findSourceEdge.getTarget().getModel()
					this.edgeEndpointIsSource = false
					this.edge = findSourceEdge
					graph.updateItem(findSourceEdge, {
						source: point,
					});
				} else {
					const findTargetEdge = graph.find('edge', (edge) => {
						let m = edge.getModel()
						return m.target === model.id && m.targetAnchor === anchorPointIndex
					})
					if (findTargetEdge) {
						// console.log("target", findTargetEdge)
						this.edgeIsUpdate = true
						this.edgeEndpointModel = findTargetEdge.getSource().getModel()
						this.edgeEndpointIsSource = true
						this.edge = findTargetEdge
						graph.updateItem(findTargetEdge, {
							target: point,
						});
					} else {
						addNewEdge = true
					}
				}
			}
			if (addNewEdge) {
				this.edgeIsUpdate = false
				this.edgeEndpointModel = model;
				// 在图上新增一条边，结束点是鼠标当前点击的节点的位置
				if (anchorPointClass === "input" || anchorPointClass === "pre_edge_id") {
					this.edgeEndpointIsSource = false
					this.edge = graph.addItem('edge', {
						source: point,
						target: model.id,
						targetAnchor: anchorPointIndex
					});
				} else {
					this.edgeEndpointIsSource = true
					this.edge = graph.addItem('edge', {
						source: model.id,
						target: point,
						sourceAnchor: anchorPointIndex
					});
				}
			}
			this.edgeEndpointAnchorPointClass = anchorPointClass
			this.edgeEndpointAnchorPointType = anchorPointType
			this.isAddingEdge = true;
		}
	},
	onMousemove(e) {
		// 鼠标的当前位置
		// console.log(e)
		if (this.isAddingEdge && this.edge) {
			// 更新边的结束点位置为当前鼠标位置
			let isEdgeValid = false
			const currentItem = e.item;
			const point = { x: e.x, y: e.y };
			if (this.edge !== currentItem && currentItem != null) {
				const model = currentItem.getModel();
				const shapeName = e.target.cfg.name
				const anchorPointRegExp = /(input|output|pre_edge_id|nxt_edge_id)-*\w*-(linkimage|linkedimage|linkbgimage)/
				if (anchorPointRegExp.test(shapeName)) {
					let anchorPointClass = shapeName.match(/(input|output|pre_edge_id|nxt_edge_id)/)[0]
					let anchorPointType = anchorPointClass
					if (anchorPointClass === "input") {
						anchorPointType = model.input_type[shapeName.split("-")[1]]
					} else if (anchorPointClass === "output") {
						anchorPointType = model.output_type[shapeName.split("-")[1]]
					}
					// console.log(anchorPointClass, anchorPointType)
					if (this.edgeEndpointModel.id !== model.id) {
						if (this.edgeIsUpdate) {
							// console.log('update', this.edgeEndpointAnchorPointClass, this.edgeEndpointAnchorPointType)
							if ((this.edgeEndpointAnchorPointClass == anchorPointClass || anchorPointType === 'pre_edge_id' || anchorPointType === 'nxt_edge_id') && anchorPointType == this.edgeEndpointAnchorPointType) {
								isEdgeValid = true
							}
						}
						else {
							if ((anchorPointClass === 'pre_edge_id' || anchorPointType === 'pre_edge_id') &&
								(this.edgeEndpointAnchorPointClass === 'nxt_edge_id' ||
									this.edgeEndpointAnchorPointType === 'nxt_edge_id')) {
								isEdgeValid = true
							} else if ((anchorPointClass === 'nxt_edge_id' || anchorPointType === 'nxt_edge_id') &&
								(this.edgeEndpointAnchorPointClass === 'pre_edge_id' ||
									this.edgeEndpointAnchorPointType === 'pre_edge_id')) {
								isEdgeValid = true
							} else if (anchorPointClass === 'input' && this.edgeEndpointAnchorPointClass === 'output' &&
								anchorPointType == this.edgeEndpointAnchorPointType) {
								isEdgeValid = true
							} else if (anchorPointClass === 'output' && this.edgeEndpointAnchorPointClass === 'input' &&
								anchorPointType == this.edgeEndpointAnchorPointType) {
								isEdgeValid = true
							}
						}
					}
				}
			}
			if (this.edgeEndpointIsSource) {
				this.graph.updateItem(this.edge, {
					target: point,
					style: {
						stroke: isEdgeValid ? VALUE_TYPE_COLOR_MAP[this.edgeEndpointAnchorPointType] : 'lightcoral'
					}
				});
			} else {
				this.graph.updateItem(this.edge, {
					source: point,
					style: {
						stroke: isEdgeValid ? VALUE_TYPE_COLOR_MAP[this.edgeEndpointAnchorPointType] : 'lightcoral'
					}
				});
			}
		}
	},
	onMouseup(e) {
		// console.log(e)
		const currentItem = e.item;
		const graph = this.graph;
		// 拖拽过程中，点击会点击到新增的边上
		if (!this.isAddingEdge) {
			return
		} else if (this.edge === currentItem || currentItem == null) {
			graph.removeItem(this.edge);
		} else {
			const model = currentItem.getModel();
			const shapeName = e.target.cfg.name
			const anchorPointRegExp = /(input|output|pre_edge_id|nxt_edge_id)-*\w*-(linkimage|linkedimage|linkbgimage)/
			// console.log(shapeName)
			if (anchorPointRegExp.test(shapeName)) {
				let anchorPointClass = shapeName.match(/(input|output|pre_edge_id|nxt_edge_id)/)[0]
				let anchorPointType = anchorPointClass
				if (anchorPointClass === "input") {
					anchorPointType = model.input_type[shapeName.split("-")[1]]
				} else if (anchorPointClass === "output") {
					anchorPointType = model.output_type[shapeName.split("-")[1]]
				}
				// console.log(anchorPointClass,anchorPointType)
				if (this.edgeEndpointModel.id !== model.id) {
					let isEdgeValid = false
					if (this.edgeIsUpdate) {
						// console.log('update', this.edgeEndpointAnchorPointClass, this.edgeEndpointAnchorPointType)
						if ((this.edgeEndpointAnchorPointClass == anchorPointClass || anchorPointType === 'pre_edge_id' || anchorPointType === 'nxt_edge_id') && anchorPointType == this.edgeEndpointAnchorPointType) {
							isEdgeValid = true
						}
					}
					else {
						if ((anchorPointClass === 'pre_edge_id' || anchorPointType === 'pre_edge_id') &&
							(this.edgeEndpointAnchorPointClass === 'nxt_edge_id' ||
								this.edgeEndpointAnchorPointType === 'nxt_edge_id')) {
							isEdgeValid = true
						} else if ((anchorPointClass === 'nxt_edge_id' || anchorPointType === 'nxt_edge_id') &&
							(this.edgeEndpointAnchorPointClass === 'pre_edge_id' ||
								this.edgeEndpointAnchorPointType === 'pre_edge_id')) {
							isEdgeValid = true
						} else if (anchorPointClass === 'input' && this.edgeEndpointAnchorPointClass === 'output' &&
							anchorPointType == this.edgeEndpointAnchorPointType) {
							isEdgeValid = true
						} else if (anchorPointClass === 'output' && this.edgeEndpointAnchorPointClass === 'input' &&
							anchorPointType == this.edgeEndpointAnchorPointType) {
							isEdgeValid = true
						}
					}
					if (isEdgeValid) {
						let anchorPointIndex = FUNC_GET_EDGE_ANCHORPOINT_INDEX(model, shapeName)
						if (this.edgeEndpointIsSource) {
							// 查找并删除重复边、多余边
							let that = this
							const delEdges = graph.findAll('edge', (edge) => {
								let m = edge.getModel()
								if ((that.edgeEndpointAnchorPointType === 'nxt_edge_id')
									&& m.id != that.edge.getModel().id &&
									m.source == that.edge.getModel().source && m.sourceAnchor == that.edge.getModel().sourceAnchor) {
									// 该类型只能有一条边，查找多余边
									return true
								} else if ((anchorPointClass == 'input' && m.target == model.id && m.targetAnchor == anchorPointIndex) &&
									m.id != that.edge.getModel().id) {
									return true
								} else if (m.source == that.edge.getModel().source && m.sourceAnchor == that.edge.getModel().sourceAnchor
									&& m.target == model.id && m.targetAnchor == anchorPointIndex) {
									// 查找重复边
									return true
								}
								return false
							})
							// console.log("source", delEdges)
							delEdges.forEach((edge) => {
								graph.removeItem(edge)
							})
							// 更新结点
							graph.updateItem(this.edge, {
								target: model.id,
								targetAnchor: anchorPointIndex,
							});
						} else {
							// 查找并删除重复边、多余边
							let that = this
							const delEdges = graph.findAll('edge', (edge) => {
								let m = edge.getModel()
								if ((anchorPointType === 'nxt_edge_id') && m.id != that.edge.getModel().id &&
									m.source == model.id && m.sourceAnchor == anchorPointIndex) {
									// 该类型只能有一条边，查找多余边
									return true
								} else if ((that.edgeEndpointAnchorPointClass == 'input' && m.target == model.id && m.targetAnchor == anchorPointIndex) &&
									m.id != that.edge.getModel().id) {
									return true
								} else if (m.source == model.id && m.sourceAnchor == anchorPointIndex
									&& m.target == that.edge.getModel().target && m.targetAnchor == that.edge.getModel().targetAnchor) {
									// 查找重复边
									return true
								}
								return false
							})
							// console.log("target", delEdges)
							delEdges.forEach((edge) => {
								graph.removeItem(edge)
							})
							// 更新结点
							graph.updateItem(this.edge, {
								source: model.id,
								sourceAnchor: anchorPointIndex,
							})
						}
					} else {
						graph.removeItem(this.edge);
					}
				} else {
					graph.removeItem(this.edge);
				}
			} else {
				graph.removeItem(this.edge);
			}
		}

		this.edge = null;
		this.edgeIsUpdate = null
		this.edgeEndpointIsSource = null
		this.edgeEndpointModel = null;
		this.edgeEndpointAnchorPointClass = null
		this.edgeEndpointAnchorPointType = null
		this.isAddingEdge = false;
	},
	onEdgeClick(e) {
		const edge = e.item;
		this.graph.setItemState(edge, 'selected', !edge.hasState('selected')); // 切换选中
	},
	onEdgeMouseenter(e) {
		const edge = e.item;
		this.graph.setItemState(edge, 'active', true); // 切换选中
	},
	onEdgeMouseleave(e) {
		const edge = e.item;
		this.graph.setItemState(edge, 'active', false); // 切换选中
	},
	onKeydown(e) {
		// console.log("keydown", e.key, e)
		if (e.key === 'Delete' || e.key === 'Backspace') {
			const nodes = this.graph.findAllByState('node', 'selected');
			nodes.forEach((node) => {
				// console.log(node.getModel().id)
				let id = node.getModel().id
				if (id != "node-start" && id != "node-end") {
					this.graph.removeItem(node)
				} else {
					Event.emit("rqShowMessage", {
						message: '禁止删除',
						type: 'error'
					})
				}
			})
			const edges = this.graph.findAllByState('edge', 'selected');
			edges.forEach((edge) => {
				this.graph.removeItem(edge)
			})
		}
	},
	onCanvasContextmenu(e) {
		// console.log("onCanvasContextmenu", e)
		GRAPH_STATUS["rqAddNode"] = { x: e.x, y: e.y }
		Event.emit("rqAddNode")
	},
	onNodeselectchange({ target, selectedItems, select }) {
		if (target == null) {
			return
		}
		// console.log(target, selectedItems, select)
		let node = target.getModel()
		if (select && selectedItems.nodes.length == 1 && selectedItems.edges.length == 0 && node.node_type === "dtio") {
			// node = JSON.parse(JSON.stringify(node))
			GRAPH_STATUS["rqEditNodeAttr"] = node
			Event.emit("rqEditNodeAttr", node)
		}
	},
});

G6.registerEdge('cubic-horizontal-end-distance', {
	getPath(item) {
		// console.log(item)
		var points = item;
		var start = points[0];
		var end = points[points.length - 1];
		var hgap = Math.abs(end.x - start.x);
		if (end.x > start.x) {
			hgap = Math.max(hgap, 32 * 7 - hgap * 2)
		} else {
			hgap = 32 * 7 + hgap / 2
		}
		return [['M', start.x, start.y], ['C', start.x + hgap * 1 / 2, start.y, end.x - hgap * 1 / 2, end.y, end.x, end.y]];
	},
	afterDraw(cfg, group) {
		// 获得当前边的第一个图形，这里是边本身的 path
		const shape = group.get('children')[0];
		// 边 path 的起点位置
		const startPoint = shape.getPoint(0);

		// 添加红色 circle 图形
		const circle = group.addShape('circle', {
			attrs: {
				x: startPoint.x,
				y: startPoint.y,
				fill: 'red',
				r: 3,
			},
			// must be assigned in G6 3.3 and later versions. it can be any value you want
			name: 'circle-shape',
		});
		// 对红色圆点添加动画
		circle.animate(
			(ratio) => {
				// 每一帧的操作，入参 ratio：这一帧的比例值（Number）。返回值：这一帧需要变化的参数集（Object）。
				// 根据比例值，获得在边 path 上对应比例的位置。
				const tmpPoint = shape.getPoint(ratio);
				// 返回需要变化的参数集，这里返回了位置 x 和 y
				return {
					x: tmpPoint.x,
					y: tmpPoint.y,
				};
			},
			{
				repeat: false, // 动画重复
				duration: 1500,
				callback: () => {
					circle.hide()
				},
			},
		); // 一次动画的时间长度
	},
	setState(name, value, item) {
		const shape = item.get('keyShape');
		// console.log(name, value, item)
		if (name === 'active' || name === 'selected') {
			if (value) {
				shape.attr('lineWidth', 5);
				shape.get('parent').get('children').forEach((keyShape) => {
					if (keyShape.get('name').startsWith('circle-shape')) {
						keyShape.show()
						keyShape.animate(
							(ratio) => {
								// 每一帧的操作，入参 ratio：这一帧的比例值（Number）。返回值：这一帧需要变化的参数集（Object）。
								// 根据比例值，获得在边 path 上对应比例的位置。
								const tmpPoint = shape.getPoint(ratio);
								// 返回需要变化的参数集，这里返回了位置 x 和 y
								return {
									x: tmpPoint.x,
									y: tmpPoint.y,
								};
							},
							{
								repeat: true, // 动画重复
								duration: 2000,
							},
						); // 一次动画的时间长度
					}
				})
			} else {
				if (!item.hasState('selected') && !item.hasState('active')) {
					shape.attr('lineWidth', 3);
					// 结束动画
					shape.get('parent').get('children').forEach((keyShape) => {
						// console.log(keyShape)
						if (keyShape.get('name').startsWith('circle-shape')) {
							keyShape.hide()
						}
					})
				}
			}
		}
	}
}, 'cubic-horizontal');

G6.registerNode("flow-node", {
	update: undefined,
	draw: (cfg, group) => {
		const KEYSHAPE_WIDTH = 180;
		let KEYSHAPE_HEIGHT = 200;
		const KEYSHAPE_RADIUS = 4;
		const KEYSHAPE_LINEWIDTH = 2;
		const KEYSHAPE_STROKECOLOR = "black";
		const KEYSHAPE_FILLCOLOR = "#130c0e40";
		const TITLEBAR_HEIGHT = 28;
		const TITLEBAR_PADDING = 4;
		const TITLEBAR_COLOR = NODE_TYPE_COLOR_MAP[cfg.node_type];
		const TITLEBAR_TITLECOLOR = "grey";
		const TITLEBAR_STATUSCOLOR = "lightblue";
		const CONTENT_PADDING_X = 4;
		const CONTENT_PADDING_Y = 8;
		const CONTENT_ITEM_HEIGHT = 28;
		const CONTENT_ITEM_PADDING_X = 0;
		const CONTENT_ITEM_PADDING_Y = 2;
		const CONTENT_ITEM_ACTUAL_HEIGHT =
			CONTENT_ITEM_HEIGHT - CONTENT_ITEM_PADDING_Y * 2;

		let isFlow = FUNC_GET_IS_FLOW_NODE(cfg.node_type)
		let isFunc = FUNC_GET_IS_FUNC_NODE(cfg.node_type)
		let isCtrl = FUNC_GET_IS_CTRL_NODE(cfg.node_type)

		const keyShape = group.addShape("rect", {
			attrs: {
				x: 0,
				y: 0,
				width: KEYSHAPE_WIDTH,
				height: KEYSHAPE_HEIGHT,
				lineWidth: KEYSHAPE_LINEWIDTH,
				stroke: KEYSHAPE_STROKECOLOR,
				fill: KEYSHAPE_FILLCOLOR,
				fillOpacity: 0.6,
				radius: KEYSHAPE_RADIUS
			},
			name: `${isFlow ? "flow" : "data"}-node-keyshape`
		});
		group.addShape("rect", {
			attrs: {
				x: KEYSHAPE_LINEWIDTH / 2,
				y: KEYSHAPE_LINEWIDTH / 2,
				width: KEYSHAPE_WIDTH - KEYSHAPE_LINEWIDTH,
				height: TITLEBAR_HEIGHT,
				lineWidth: 0,
				fillOpacity: 0.6,
				fill: TITLEBAR_COLOR,
				radius: [KEYSHAPE_RADIUS, KEYSHAPE_RADIUS, 0, 0]
			},
			name: `titlebar-keyshape`,
			draggable: true
		});
		group.addShape("image", {
			attrs: {
				x: KEYSHAPE_LINEWIDTH + TITLEBAR_PADDING,
				y: KEYSHAPE_LINEWIDTH + TITLEBAR_PADDING,
				width:
					TITLEBAR_HEIGHT -
					(KEYSHAPE_LINEWIDTH + TITLEBAR_PADDING) -
					TITLEBAR_PADDING,
				height:
					TITLEBAR_HEIGHT -
					(KEYSHAPE_LINEWIDTH + TITLEBAR_PADDING) -
					TITLEBAR_PADDING,
				img: NODE_TYPE_IMAGE_MAP[cfg.node_type]
			},
			name: `titlebar-typeimage`,
			draggable: true
		});
		group.addShape("text", {
			attrs: {
				text: fittingString(
					cfg.name,
					KEYSHAPE_WIDTH -
					KEYSHAPE_LINEWIDTH * 2 -
					TITLEBAR_HEIGHT * 2 -
					TITLEBAR_PADDING * 4,
					14
				),
				x: TITLEBAR_HEIGHT,
				y: (TITLEBAR_HEIGHT + KEYSHAPE_LINEWIDTH) / 2,
				fill: TITLEBAR_TITLECOLOR,
				textBaseline: "middle",
				fontWeight: 600
			},
			name: `titlebar-nametext`,
			draggable: true
		});
		group.addShape("circle", {
			attrs: {
				x:
					KEYSHAPE_WIDTH -
					KEYSHAPE_LINEWIDTH -
					TITLEBAR_PADDING -
					((TITLEBAR_HEIGHT - TITLEBAR_PADDING * 2) * 2) / 5,
				y:
					KEYSHAPE_LINEWIDTH +
					TITLEBAR_PADDING +
					((TITLEBAR_HEIGHT - TITLEBAR_PADDING * 2) * 2) / 5,
				r: ((TITLEBAR_HEIGHT - TITLEBAR_PADDING * 2) * 2) / 5,
				fill: TITLEBAR_STATUSCOLOR
			},
			name: `titlebar-typecircle`,
			draggable: true
		});

		let appendContentItemStartX =
			CONTENT_PADDING_X + KEYSHAPE_LINEWIDTH;
		let appendContentItemStartY =
			TITLEBAR_HEIGHT + CONTENT_PADDING_Y + KEYSHAPE_LINEWIDTH;

		// 输入
		let inList = [];
		if (isFlow) {
			inList.push("pre_edge_id");
		}
		for (let key in cfg.input) {
			inList.push(key);
		}

		for (let i = 0; i < inList.length; i++) {
			const contentItemGroupX = appendContentItemStartX + CONTENT_ITEM_PADDING_X;
			const contentItemGroupY = appendContentItemStartY + CONTENT_ITEM_PADDING_Y;

			const contentItemGroup = group.addGroup();

			let input_intro = "";
			if (isFlow && i === 0) {
				input_intro = "执行";
			} else {
				input_intro = cfg.input_intro[inList[i]];
			}

			let namePrefix = `${isFlow && i === 0 ? '' : 'input-'}${inList[i]}`;

			let linkimage = data_link_img,
				linkedimage = data_linked_img,
				linkbgimage = data_linkbg_img;
			if ((isFlow && i === 0) || cfg.input_type[inList[i]].endsWith("edge_id")) {
				linkimage = flow_link_img;
				linkedimage = flow_linked_img;
				linkbgimage = flow_linkbg_img;
			}

			contentItemGroup.addShape("image", {
				attrs: {
					x: contentItemGroupX + 4,
					y: contentItemGroupY + 4,
					width: CONTENT_ITEM_ACTUAL_HEIGHT - 8,
					height: CONTENT_ITEM_ACTUAL_HEIGHT - 8,
					img: linkimage
				},
				name: namePrefix + "-linkimage"
			});
			contentItemGroup.addShape("image", {
				attrs: {
					x: contentItemGroupX + 4,
					y: contentItemGroupY + 4,
					width: CONTENT_ITEM_ACTUAL_HEIGHT - 8,
					height: CONTENT_ITEM_ACTUAL_HEIGHT - 8,
					opacity: 0,
					img: linkedimage
				},
				name: namePrefix + "-linkedimage"
			});
			contentItemGroup.addShape("image", {
				attrs: {
					x: contentItemGroupX,
					y: contentItemGroupY,
					width: CONTENT_ITEM_ACTUAL_HEIGHT,
					height: CONTENT_ITEM_ACTUAL_HEIGHT,
					opacity: 0.3,
					img: linkbgimage
				},
				name: namePrefix + "-linkbgimage"
			});
			contentItemGroup.addShape("text", {
				attrs: {
					x: contentItemGroupX + CONTENT_ITEM_ACTUAL_HEIGHT + 4,
					y: contentItemGroupY + CONTENT_ITEM_ACTUAL_HEIGHT / 2,
					textAlign: 'left',
					textBaseline: "middle",
					text: fittingString(
						input_intro,
						KEYSHAPE_WIDTH -
						KEYSHAPE_LINEWIDTH * 2 -
						CONTENT_PADDING_X * 2 -
						CONTENT_ITEM_HEIGHT,
						12
					),
					fill: "grey"
				},
				name: namePrefix + "-linktipstext",
				draggable: true
			});

			appendContentItemStartY += CONTENT_ITEM_HEIGHT
		}

		// 输出
		appendContentItemStartX = KEYSHAPE_WIDTH - KEYSHAPE_LINEWIDTH - CONTENT_PADDING_X;

		let outList = [];
		if (isFunc) {
			outList.push("nxt_edge_id");
		} else if (isCtrl) {
			cfg.nxt_edge_id.forEach((edge_id, i) => {
				outList.push("nxt_edge_id-" + i + "i");
			})
		}
		for (let key in cfg.output) {
			outList.push(key);
		}

		for (let i = 0; i < outList.length; i++) {
			const contentItemGroupX = appendContentItemStartX - CONTENT_ITEM_PADDING_X - CONTENT_ITEM_ACTUAL_HEIGHT;
			const contentItemGroupY = appendContentItemStartY + CONTENT_ITEM_PADDING_Y;

			const contentItemGroup = group.addGroup();

			let output_intro;
			if (isFunc && i === 0) {
				output_intro = "下一步: 执行";
			} else if (isCtrl && i < cfg.nxt_edge_id.length) {
				output_intro = cfg.nxt_edge_id_intro[i];
			} else {
				output_intro = cfg.output_intro[outList[i]];
			}

			let namePrefix = `${(isFunc && i === 0) || (isCtrl && i < cfg.nxt_edge_id.length) ? '' : 'output-'}${outList[i]}`;
			// console.log(namePrefix)

			let linkimage = data_link_img,
				linkedimage = data_linked_img,
				linkbgimage = data_linkbg_img;
			if ((isFunc && i === 0) || (isCtrl && i < cfg.nxt_edge_id.length) || cfg.output_type[outList[i]].endsWith("edge_id")) {
				linkimage = flow_link_img;
				linkedimage = flow_linked_img;
				linkbgimage = flow_linkbg_img;
			}

			contentItemGroup.addShape("image", {
				attrs: {
					x: contentItemGroupX + 4,
					y: contentItemGroupY + 4,
					width: CONTENT_ITEM_ACTUAL_HEIGHT - 8,
					height: CONTENT_ITEM_ACTUAL_HEIGHT - 8,
					img: linkimage
				},
				name: namePrefix + "-linkimage"
			});
			contentItemGroup.addShape("image", {
				attrs: {
					x: contentItemGroupX + 4,
					y: contentItemGroupY + 4,
					width: CONTENT_ITEM_ACTUAL_HEIGHT - 8,
					height: CONTENT_ITEM_ACTUAL_HEIGHT - 8,
					opacity: 0,
					img: linkedimage
				},
				name: namePrefix + "-linkedimage"
			});
			contentItemGroup.addShape("image", {
				attrs: {
					x: contentItemGroupX,
					y: contentItemGroupY,
					width: CONTENT_ITEM_ACTUAL_HEIGHT,
					height: CONTENT_ITEM_ACTUAL_HEIGHT,
					opacity: 0.3,
					img: linkbgimage
				},
				name: namePrefix + "-linkbgimage"
			});
			contentItemGroup.addShape("text", {
				attrs: {
					x: contentItemGroupX - 4,
					y: contentItemGroupY + CONTENT_ITEM_ACTUAL_HEIGHT / 2,
					textAlign: "right",
					textBaseline: "middle",
					text: fittingString(
						output_intro,
						KEYSHAPE_WIDTH -
						KEYSHAPE_LINEWIDTH * 2 -
						CONTENT_PADDING_X * 2 -
						CONTENT_ITEM_HEIGHT,
						12
					),
					fill: "grey"
				},
				name: namePrefix + "-linktipstext",
				draggable: true
			});

			appendContentItemStartY += CONTENT_ITEM_HEIGHT;
		}

		KEYSHAPE_HEIGHT = appendContentItemStartY + CONTENT_PADDING_Y - KEYSHAPE_LINEWIDTH
		keyShape.attrs.height = KEYSHAPE_HEIGHT;
		return keyShape;
	},
	getAnchorPoints(cfg) {
		var tmp_anchorPoints = [];
		var anchorPoints = [];
		const KEYSHAPE_WIDTH = 180;
		let KEYSHAPE_HEIGHT = 200;
		const KEYSHAPE_RADIUS = 4;
		const KEYSHAPE_LINEWIDTH = 2;
		const KEYSHAPE_STROKECOLOR = "lightblue";
		const KEYSHAPE_FILLCOLOR = "#00000040";
		const TITLEBAR_HEIGHT = 28;
		const TITLEBAR_PADDING = 4;
		const TITLEBAR_COLOR = "lightpink";
		const TITLEBAR_TITLECOLOR = "grey";
		const TITLEBAR_STATUSCOLOR = "lightblue";
		const CONTENT_PADDING_X = 4;
		const CONTENT_PADDING_Y = 8;
		const CONTENT_ITEM_HEIGHT = 24;
		const CONTENT_ITEM_PADDING_X = 0;
		const CONTENT_ITEM_PADDING_Y = 2;
		const CONTENT_ITEM_ACTUAL_HEIGHT =
			CONTENT_ITEM_HEIGHT - CONTENT_ITEM_PADDING_Y * 2;

		let isFlow = FUNC_GET_IS_FLOW_NODE(cfg.node_type)
		let isFunc = FUNC_GET_IS_FUNC_NODE(cfg.node_type)
		let isCtrl = FUNC_GET_IS_CTRL_NODE(cfg.node_type)

		let appendContentItemStartX =
			CONTENT_PADDING_X + KEYSHAPE_LINEWIDTH;
		let appendContentItemStartY =
			TITLEBAR_HEIGHT + CONTENT_PADDING_Y + KEYSHAPE_LINEWIDTH;

		// 输入
		let inList = [];
		if (isFlow) {
			inList.push("pre_edge_id");
		}
		for (let key in cfg.input) {
			inList.push(key);
		}

		for (let i = 0; i < inList.length; i++) {
			const contentItemGroupX = appendContentItemStartX + CONTENT_ITEM_PADDING_X;
			const contentItemGroupY = appendContentItemStartY + CONTENT_ITEM_PADDING_Y;

			let x_center = contentItemGroupX + CONTENT_ITEM_ACTUAL_HEIGHT / 2
			let y_center = contentItemGroupY + CONTENT_ITEM_ACTUAL_HEIGHT / 2

			tmp_anchorPoints.push([x_center, y_center])

			appendContentItemStartY += CONTENT_ITEM_HEIGHT
		}

		// 输出
		appendContentItemStartX = KEYSHAPE_WIDTH + KEYSHAPE_LINEWIDTH - CONTENT_PADDING_X;

		let outList = [];
		if (isFunc) {
			outList.push("nxt_edge_id");
		} else if (isCtrl) {
			cfg.nxt_edge_id.forEach((edge_id, i) => {
				outList.push("nxt_edge_id-" + i + "i");
			})
		}
		for (let key in cfg.output) {
			outList.push(key);
		}

		for (let i = 0; i < outList.length; i++) {
			const contentItemGroupX = appendContentItemStartX - CONTENT_ITEM_PADDING_X - CONTENT_ITEM_ACTUAL_HEIGHT;
			const contentItemGroupY = appendContentItemStartY + CONTENT_ITEM_PADDING_Y;

			let x_center = contentItemGroupX + CONTENT_ITEM_ACTUAL_HEIGHT / 2
			let y_center = contentItemGroupY + CONTENT_ITEM_ACTUAL_HEIGHT / 2

			tmp_anchorPoints.push([x_center, y_center])

			appendContentItemStartY += CONTENT_ITEM_HEIGHT;
		}

		KEYSHAPE_HEIGHT = appendContentItemStartY + CONTENT_PADDING_Y - KEYSHAPE_LINEWIDTH

		tmp_anchorPoints.forEach((value) => {
			// console.log(value)
			anchorPoints.push([value[0] / (KEYSHAPE_WIDTH + KEYSHAPE_LINEWIDTH * 2),
			value[1] / (KEYSHAPE_HEIGHT + KEYSHAPE_LINEWIDTH * 2)])
		})

		// console.log(anchorPoints)

		return anchorPoints;
	}
}, "rect");



var graph;

const initGraph = (graphElementId, graphWidth, graphHeight, minimapElementId, data) => {
	if (!data) {
		data = {
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
			edges: [
			]
		}
	}

	const container = document.getElementById(graphElementId);
	// console.log(container)
	const width = graphWidth;
	const height = graphHeight;

	const grid = new G6.Grid();

	const minimap = new G6.Minimap({
		container: minimapElementId,
		type: 'default'
	});

	graph = new G6.Graph({
		container: container,
		width,
		height,
		fitCenter: true,
		minZoom: 0.3,
		maxZoom: 3,
		modes: {
			default: ["drag-canvas", "drag-node", 'custom-operate',
				{
					type: 'zoom-canvas',
					enableOptimize: true,
				}, 'click-select', 'brush-select',
				{
					type: 'activate-relations',//bug:
					inactiveState: 'none'
				},],
		},
		defaultNode: {
			type: "flow-node"
		},
		defaultEdge: {
			type: 'cubic-horizontal-end-distance',
			style: {
				lineWidth: 3,
			}
		},
		plugins: [grid, minimap,],//, menu
		animate: true, // Boolean，切换布局时是否使用动画过度，默认为 false
		animateCfg: {
			duration: 500, // Number，一次动画的时长
			easing: 'linearEasing', // String，动画函数
		},
	});

	graph.data(data);
	graph.render();

	Event.on("addNode", this, (data) => {
		data.x = GRAPH_STATUS.rqAddNode.x
		data.y = GRAPH_STATUS.rqAddNode.y
		graph.addItem("node", data)
	})

	Event.on("editNodeAttr", this, (data) => {
		graph.updateItem(GRAPH_STATUS.rqEditNodeAttr.id, data)
	})

	return graph
}

/**
 * 
 * ## 事件列表：
 * ### graph触发, 视图监听
 * - rqAddNode
 * - rqEditNodeAttr
 * - rqShowMessage
 * ### graph监听, 视图触发
 * - addNode
 * - editNodeAttr
 */


const saveConfig = (_graph, _dataSource) => {
	let dataSource = _graph ? _graph.save() : (_dataSource ? _dataSource : graph.save())
	let data = JSON.parse(JSON.stringify(dataSource))
	let config = {
		graph: {
			node_list: [],
			edge_list: []
		},
		source: {
			graph: JSON.parse(JSON.stringify(dataSource))
		}
	}

	let nodeMap = {}
	for (let i = 0; i < data.nodes.length; i++) {
		let node = data.nodes[i]
		nodeMap[node.id] = node
		config.graph.node_list.push(node)
	}
	for (let i = 0; i < data.edges.length; i++) {
		let edge = data.edges[i]
		let sourceAnchorId = FUNC_GET_EDGE_ANCHORPOINT_INDEX_ID(nodeMap[edge.source], edge.sourceAnchor)
		let targetAnchorId = FUNC_GET_EDGE_ANCHORPOINT_INDEX_ID(nodeMap[edge.target], edge.targetAnchor)
		// console.log(sourceAnchorId, targetAnchorId)
		if (/^[0-9]*$/.test(sourceAnchorId)) {
			// console.log("1")
			nodeMap[edge.source].nxt_edge_id[sourceAnchorId] = edge.id
			config.graph.edge_list.push({
				id: edge.id,
				name: "",
				pre_id: edge.source,
				nxt_id: edge.target
			})
		} else if (sourceAnchorId.search(".output.") != -1 && (targetAnchorId.search(".input.") != -1 || targetAnchorId == "pre_edge_id")) {
			// console.log("2")
			config.graph.edge_list.push({
				id: edge.id,
				name: "",
				pre_id: sourceAnchorId,
				nxt_id: targetAnchorId == "pre_edge_id" ? edge.target : targetAnchorId
			})
		} else {
			// console.log("3")
			config.graph.edge_list.push({
				id: edge.id,
				name: "",
				pre_id: edge.source,
				nxt_id: edge.target
			})
		}
	}

	// console.log(config)
	return config
}

const loadConfigGraph = (config) => {
	config = JSON.parse(JSON.stringify(config))
	let data = JSON.parse(JSON.stringify(config.source.graph))
	graph.read(data)
	// console.log(data)
	return data
}

const loadConfig = (config) => {
	config = JSON.parse(JSON.stringify(config))
	let data = {
		nodes: [],
		edges: [],
	}

	let nodeMap = {}
	for (let i = 0; i < config.graph.node_list.length; i++) {
		let node = config.graph.node_list[i]
		nodeMap[node.id] = node
		data.nodes.push(node)
	}

	for (let i = 0; i < config.graph.edge_list.length; i++) {
		let edge = config.graph.edge_list[i]
		let sourceId = edge.pre_id
		let targetId = edge.nxt_id
		if (sourceId.search(".output.") != -1 && targetId.search(".input.") != -1) {
			let sourceNodeId = sourceId.split(".output.")[0]
			let sourceNodeField = sourceId.split(".output.")[1]
			let sourceNodeAnchor = FUNC_GET_EDGE_ANCHORPOINT_INDEX_FROM_ID(nodeMap[sourceNodeId], sourceId)
			let targetNodeId = targetId.split(".input.")[0]
			let targetNodeAnchor = FUNC_GET_EDGE_ANCHORPOINT_INDEX_FROM_ID(nodeMap[targetNodeId], targetId)
			console.log(VALUE_TYPE_COLOR_MAP[nodeMap[sourceNodeId].output_type[sourceNodeField]] || VALUE_TYPE_COLOR_MAP.default)
			data.edges.push({
				id: edge.id,
				source: sourceNodeId,
				sourceAnchor: sourceNodeAnchor,
				target: targetNodeId,
				targetAnchor: targetNodeAnchor,
				style: {
					stroke: VALUE_TYPE_COLOR_MAP[nodeMap[sourceNodeId].output_type[sourceNodeField]] || VALUE_TYPE_COLOR_MAP.default
				}
			})
		} else if (sourceId.search(".output.") != -1) {
			let sourceNodeId = sourceId.split(".output.")[0]
			let sourceNodeField = sourceId.split(".output.")[1]
			let sourceNodeAnchor = FUNC_GET_EDGE_ANCHORPOINT_INDEX_FROM_ID(nodeMap[sourceNodeId], sourceId)
			data.edges.push({
				id: edge.id,
				source: sourceNodeId,
				sourceAnchor: sourceNodeAnchor,
				target: targetId,
				targetAnchor: FUNC_GET_EDGE_ANCHORPOINT_INDEX_FROM_ID(nodeMap[targetId], null),
				style: {
					stroke: VALUE_TYPE_COLOR_MAP[nodeMap[sourceNodeId].output_type[sourceNodeField]] || VALUE_TYPE_COLOR_MAP.default
				}
			})
		} else {
			let isBreak = false
			for (let j = 0; j < nodeMap[sourceId].nxt_edge_id.length; j++) {
				if (nodeMap[sourceId].nxt_edge_id[j] == edge.id) {
					let sourceAnchor = FUNC_GET_EDGE_ANCHORPOINT_INDEX_FROM_ID(nodeMap[sourceId], j)
					let targetAnchor = FUNC_GET_EDGE_ANCHORPOINT_INDEX_FROM_ID(nodeMap[targetId], null)
					data.edges.push({
						id: edge.id,
						source: sourceId,
						sourceAnchor: sourceAnchor,
						target: targetId,
						targetAnchor: targetAnchor,
						style: {
							stroke: VALUE_TYPE_COLOR_MAP.nxt_edge_id
						}
					})
					isBreak = true
					break
				}
			}
			if (!isBreak) {
				let sourceAnchor = FUNC_GET_EDGE_ANCHORPOINT_INDEX_FROM_ID(nodeMap[sourceId], 0)
				let targetAnchor = FUNC_GET_EDGE_ANCHORPOINT_INDEX_FROM_ID(nodeMap[targetId], null)
				data.edges.push({
					id: edge.id,
					source: sourceId,
					sourceAnchor: sourceAnchor,
					target: targetId,
					targetAnchor: targetAnchor,
					style: {
						stroke: VALUE_TYPE_COLOR_MAP.nxt_edge_id
					}
				})
			}
		}
	}

	graph.read(data)

	data = JSON.parse(JSON.stringify(data))
	// console.log(data)
	return data
}


document.oncontextmenu = (e) => {
	e.preventDefault()
}


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
				nodeList: [{
					"id": "",
					"name": "布尔",
					"node_name": "dtio-i-bool",
					"node_type": "dtio",
					"pre_edge_id": [],
					"nxt_edge_id": [],
					"input": {
						"value": false
					},
					"input_type": {
						"value": "def_bool"
					},
					"input_intro": {
						"value": "布尔定义"
					},
					"output": {
						"value": false
					},
					"output_type": {
						"value": "bool"
					},
					"output_intro": {
						"value": "Value: 布尔"
					}
				}, {
					"id": "",
					"name": "字符串",
					"node_name": "dtio-i-string",
					"node_type": "dtio",
					"pre_edge_id": [],
					"nxt_edge_id": [],
					"input": {
						"value": ""
					},
					"input_type": {
						"value": "def_string"
					},
					"input_intro": {
						"value": "字符串定义"
					},
					"output": {
						"value": ""
					},
					"output_type": {
						"value": "string"
					},
					"output_intro": {
						"value": "Value: 字符串"
					}
				}, {
					"id": "",
					"name": "浮点数值",
					"node_name": "dtio-i-float",
					"node_type": "dtio",
					"pre_edge_id": [],
					"nxt_edge_id": [],
					"input": {
						"value": 0.0
					},
					"input_type": {
						"value": "def_float"
					},
					"input_intro": {
						"value": "浮点数值定义"
					},
					"output": {
						"value": 0.0
					},
					"output_type": {
						"value": "number"
					},
					"output_intro": {
						"value": "Value: 浮点数值"
					}
				}, {
					"id": "",
					"name": "整型数值",
					"node_name": "dtio-i-int",
					"node_type": "dtio",
					"pre_edge_id": [],
					"nxt_edge_id": [],
					"input": {
						"value": 0
					},
					"input_type": {
						"value": "def_int"
					},
					"input_intro": {
						"value": "整数数值定义"
					},
					"output": {
						"value": 0
					},
					"output_type": {
						"value": "number"
					},
					"output_intro": {
						"value": "Value: 整数数值"
					}
				}],
			}, {
				type: 'dtpc',
				name: '数据处理节点',
				nodeList: [{
					"id": "",
					"name": "绝对值",
					"node_name": "dtpc-abs",
					"node_type": "dtpc",
					"pre_edge_id": [],
					"nxt_edge_id": [],
					"input": {
						"number": 0
					},
					"input_type": {
						"number": "number"
					},
					"input_intro": {
						"number": "A: 数值"
					},
					"output": {
						"result": 0
					},
					"output_type": {
						"result": "number"
					},
					"output_intro": {
						"result": "Result: 数值"
					}
				}, {
					"id": "",
					"name": "加法",
					"node_name": "dtpc-add",
					"node_type": "dtpc",
					"pre_edge_id": [],
					"nxt_edge_id": [],
					"input": {
						"number_1": 0,
						"number_2": 0
					},
					"input_type": {
						"number_1": "number",
						"number_2": "number"
					},
					"input_intro": {
						"number_1": "加数: 数值",
						"number_2": "被加数: 数值"
					},
					"output": {
						"result": 0
					},
					"output_type": {
						"result": "number"
					},
					"output_intro": {
						"result": "和: 数值"
					}
				}, {
					"id": "",
					"name": "逻辑与",
					"node_name": "dtpc-and",
					"node_type": "dtpc",
					"pre_edge_id": [],
					"nxt_edge_id": [],
					"input": {
						"bool_1": false,
						"bool_2": false
					},
					"input_type": {
						"bool_1": "bool",
						"bool_2": "bool"
					},
					"input_intro": {
						"bool_1": "A: 布尔",
						"bool_2": "B: 布尔"
					},
					"output": {
						"result": false
					},
					"output_type": {
						"result": "bool"
					},
					"output_intro": {
						"result": "Result: 布尔"
					}
				}, {
					"id": "",
					"name": "除法",
					"node_name": "dtpc-divide",
					"node_type": "dtpc",
					"pre_edge_id": [],
					"nxt_edge_id": [],
					"input": {
						"number_1": 0,
						"number_2": 1
					},
					"input_type": {
						"number_1": "number",
						"number_2": "number"
					},
					"input_intro": {
						"number_1": "被除数: 数值",
						"number_2": "被数: 数值"
					},
					"output": {
						"result": 0
					},
					"output_type": {
						"result": "number"
					},
					"output_intro": {
						"result": "商: 数值"
					}
				}, {
					"id": "",
					"name": "数值比较==",
					"node_name": "dtpc-eq_number",
					"node_type": "dtpc",
					"pre_edge_id": [],
					"nxt_edge_id": [],
					"input": {
						"number_1": 0,
						"number_2": 0
					},
					"input_type": {
						"number_1": "number",
						"number_2": "number"
					},
					"input_intro": {
						"number_1": "A: 数值",
						"number_2": "B: 数值"
					},
					"output": {
						"result": true
					},
					"output_type": {
						"result": "bool"
					},
					"output_intro": {
						"result": "A==B: 布尔"
					}
				}, {
					"id": "",
					"name": "字符串比较==",
					"node_name": "dtpc-eq_string",
					"node_type": "dtpc",
					"pre_edge_id": [],
					"nxt_edge_id": [],
					"input": {
						"string_1": "",
						"string_2": ""
					},
					"input_type": {
						"string_1": "string",
						"string_2": "string"
					},
					"input_intro": {
						"string_1": "A: 字符串",
						"string_2": "B: 字符串"
					},
					"output": {
						"result": true
					},
					"output_type": {
						"result": "bool"
					},
					"output_intro": {
						"result": "A==B: 布尔"
					}
				}, {
					"id": "",
					"name": "数值比较>=",
					"node_name": "dtpc-ge",
					"node_type": "dtpc",
					"pre_edge_id": [],
					"nxt_edge_id": [],
					"input": {
						"number_1": 0,
						"number_2": 0
					},
					"input_type": {
						"number_1": "number",
						"number_2": "number"
					},
					"input_intro": {
						"number_1": "A: 数值",
						"number_2": "B: 数值"
					},
					"output": {
						"result": true
					},
					"output_type": {
						"result": "bool"
					},
					"output_intro": {
						"result": "A>=B: 布尔"
					}
				}, {
					"id": "",
					"name": "数值比较>",
					"node_name": "dtpc-gt",
					"node_type": "dtpc",
					"pre_edge_id": [],
					"nxt_edge_id": [],
					"input": {
						"number_1": 0,
						"number_2": 0
					},
					"input_type": {
						"number_1": "number",
						"number_2": "number"
					},
					"input_intro": {
						"number_1": "A: 数值",
						"number_2": "B: 数值"
					},
					"output": {
						"result": true
					},
					"output_type": {
						"result": "bool"
					},
					"output_intro": {
						"result": "A>B: 布尔"
					}
				}, {
					"id": "",
					"name": "数值比较<=",
					"node_name": "dtpc-le",
					"node_type": "dtpc",
					"pre_edge_id": [],
					"nxt_edge_id": [],
					"input": {
						"number_1": 0,
						"number_2": 0
					},
					"input_type": {
						"number_1": "number",
						"number_2": "number"
					},
					"input_intro": {
						"number_1": "A: 数值",
						"number_2": "B: 数值"
					},
					"output": {
						"result": true
					},
					"output_type": {
						"result": "bool"
					},
					"output_intro": {
						"result": "A<=B: 布尔"
					}
				}, {
					"id": "",
					"name": "逻辑选择布尔",
					"node_name": "dtpc-logical_select_bool",
					"node_type": "dtpc",
					"pre_edge_id": [],
					"nxt_edge_id": [],
					"input": {
						"bool": false,
						"bool_1": true,
						"bool_2": false
					},
					"input_type": {
						"bool": "bool",
						"bool_1": "bool",
						"bool_2": "bool"
					},
					"input_intro": {
						"bool": "A: 布尔",
						"bool_1": "B1: 布尔",
						"bool_2": "B2: 布尔"
					},
					"output": {
						"result": false
					},
					"output_type": {
						"result": "bool"
					},
					"output_intro": {
						"result": "B1/B2: 布尔"
					}
				}, {
					"id": "",
					"name": "逻辑选择数值",
					"node_name": "dtpc-logical_select_number",
					"node_type": "dtpc",
					"pre_edge_id": [],
					"nxt_edge_id": [],
					"input": {
						"bool": false,
						"number_1": 0,
						"number_2": 0
					},
					"input_type": {
						"bool": "bool",
						"number_1": "number",
						"number_2": "number"
					},
					"input_intro": {
						"bool": "A: 布尔",
						"number_1": "B1: 数值",
						"number_2": "B2: 数值"
					},
					"output": {
						"result": 0
					},
					"output_type": {
						"result": "number"
					},
					"output_intro": {
						"result": "B1/B2: 数值"
					}
				}, {
					"id": "",
					"name": "逻辑选择字符串",
					"node_name": "dtpc-logical_select_string",
					"node_type": "dtpc",
					"pre_edge_id": [],
					"nxt_edge_id": [],
					"input": {
						"bool": false,
						"string_1": "",
						"string_2": ""
					},
					"input_type": {
						"bool": "bool",
						"string_1": "string",
						"string_2": "string"
					},
					"input_intro": {
						"bool": "A: 布尔",
						"string_1": "B1: 字符串",
						"string_2": "B2: 字符串"
					},
					"output": {
						"result": ""
					},
					"output_type": {
						"result": "string"
					},
					"output_intro": {
						"result": "B1/B2: 字符串"
					}
				}, {
					"id": "",
					"name": "数值比较<",
					"node_name": "dtpc-lt",
					"node_type": "dtpc",
					"pre_edge_id": [],
					"nxt_edge_id": [],
					"input": {
						"number_1": 0,
						"number_2": 0
					},
					"input_type": {
						"number_1": "number",
						"number_2": "number"
					},
					"input_intro": {
						"number_1": "A: 数值",
						"number_2": "B: 数值"
					},
					"output": {
						"result": false
					},
					"output_type": {
						"result": "bool"
					},
					"output_intro": {
						"result": "A<B: 布尔"
					}
				}, {
					"id": "",
					"name": "取余",
					"node_name": "dtpc-mod",
					"node_type": "dtpc",
					"pre_edge_id": [],
					"nxt_edge_id": [],
					"input": {
						"number_1": 0,
						"number_2": 1
					},
					"input_type": {
						"number_1": "number",
						"number_2": "number"
					},
					"input_intro": {
						"number_1": "被除数: 数值",
						"number_2": "除数: 数值"
					},
					"output": {
						"result": 0
					},
					"output_type": {
						"result": "number"
					},
					"output_intro": {
						"result": "余数: 数值"
					}
				}, {
					"id": "",
					"name": "乘法",
					"node_name": "dtpc-multiply",
					"node_type": "dtpc",
					"pre_edge_id": [],
					"nxt_edge_id": [],
					"input": {
						"number_1": 0,
						"number_2": 0
					},
					"input_type": {
						"number_1": "number",
						"number_2": "number"
					},
					"input_intro": {
						"number_1": "被乘数: 数值",
						"number_2": "乘数: 数值"
					},
					"output": {
						"result": 0
					},
					"output_type": {
						"result": "number"
					},
					"output_intro": {
						"result": "积: 数值"
					}
				}, {
					"id": "",
					"name": "逻辑非",
					"node_name": "dtpc-not",
					"node_type": "dtpc",
					"pre_edge_id": [],
					"nxt_edge_id": [],
					"input": {
						"bool": false
					},
					"input_type": {
						"bool": "bool"
					},
					"input_intro": {
						"bool": "A: 布尔"
					},
					"output": {
						"result": true
					},
					"output_type": {
						"result": "bool"
					},
					"output_intro": {
						"result": "!A: 布尔"
					}
				}, {
					"id": "",
					"name": "数值转字符串",
					"node_name": "dtpc-number2string",
					"node_type": "dtpc",
					"pre_edge_id": [],
					"nxt_edge_id": [],
					"input": {
						"number": 0
					},
					"input_type": {
						"number": "number"
					},
					"input_intro": {
						"number": "数值"
					},
					"output": {
						"result": "0"
					},
					"output_type": {
						"result": "string"
					},
					"output_intro": {
						"result": "Result: 字符串"
					}
				}, {
					"id": "",
					"name": "逻辑或",
					"node_name": "dtpc-or",
					"node_type": "dtpc",
					"pre_edge_id": [],
					"nxt_edge_id": [],
					"input": {
						"bool_1": false,
						"bool_2": false
					},
					"input_type": {
						"bool_1": "bool",
						"bool_2": "bool"
					},
					"input_intro": {
						"bool_1": "A: 布尔",
						"bool_2": "B: 布尔"
					},
					"output": {
						"result": false
					},
					"output_type": {
						"result": "bool"
					},
					"output_intro": {
						"result": "A&B: 布尔"
					}
				}, {
					"id": "",
					"name": "减法",
					"node_name": "dtpc-subtract",
					"node_type": "dtpc",
					"pre_edge_id": [],
					"nxt_edge_id": [],
					"input": {
						"number_1": 0,
						"number_2": 0
					},
					"input_type": {
						"number_1": "number",
						"number_2": "number"
					},
					"input_intro": {
						"number_1": "被减数: 数值",
						"number_2": "减数: 数值"
					},
					"output": {
						"result": 0
					},
					"output_type": {
						"result": "number"
					},
					"output_intro": {
						"result": "差: 数值"
					}
				}],
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

		this.graph = initGraph("design", window.innerWidth, window.innerHeight, "design-minimap", this.graphInitData)

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
					const loadedConfig = loadConfig(config)
					this.$message({
						message: '加载成功',
						type: 'success'
					})
				})
			} else if (command === "cmdExportConfig") {
				const config = saveConfig()
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
					const saved = saveConfig(null, config.source.graph)
					if (ObjectUtils.isSame(saved.graph, config.graph)) {
						// 配置无改动，加载原图不失色
						loadConfigGraph(config)
					} else {
						// 配置有改动
						loadConfig(config)
					}
					this.$message({
						message: '加载成功',
						type: 'success'
					})
				})
			} else if (command === "cmdSaveProject") {
				const config = saveConfig()
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