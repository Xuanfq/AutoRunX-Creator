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
		// 加载配置
		this.searchNodeData=[{"type": "dtio", "name": "输入输出节点", "nodeList": [{"id": "", "name": "布尔", "node_name": "dtio-i-bool", "node_type": "dtio", "pre_edge_id": [], "nxt_edge_id": [], "input": {"value": false}, "input_type": {"value": "def_bool"}, "input_intro": {"value": "布尔定义"}, "output": {"value": false}, "output_type": {"value": "bool"}, "output_intro": {"value": "Value: 布尔"}}, {"id": "", "name": "浮点数值", "node_name": "dtio-i-float", "node_type": "dtio", "pre_edge_id": [], "nxt_edge_id": [], "input": {"value": 0.0}, "input_type": {"value": "def_float"}, "input_intro": {"value": "浮点数值定义"}, "output": {"value": 0.0}, "output_type": {"value": "number"}, "output_intro": {"value": "Value: 浮点数值"}}, {"id": "", "name": "整型数值", "node_name": "dtio-i-int", "node_type": "dtio", "pre_edge_id": [], "nxt_edge_id": [], "input": {"value": 0}, "input_type": {"value": "def_int"}, "input_intro": {"value": "整数数值定义"}, "output": {"value": 0}, "output_type": {"value": "number"}, "output_intro": {"value": "Value: 整数数值"}}, {"id": "", "name": "字符串", "node_name": "dtio-i-string", "node_type": "dtio", "pre_edge_id": [], "nxt_edge_id": [], "input": {"value": ""}, "input_type": {"value": "def_string"}, "input_intro": {"value": "字符串定义"}, "output": {"value": ""}, "output_type": {"value": "string"}, "output_intro": {"value": "Value: 字符串"}}]}, {"type": "dtpc", "name": "数据处理节点", "nodeList": [{"id": "", "name": "绝对值", "node_name": "dtpc-abs", "node_type": "dtpc", "pre_edge_id": [], "nxt_edge_id": [], "input": {"number": 0}, "input_type": {"number": "number"}, "input_intro": {"number": "A: 数值"}, "output": {"result": 0}, "output_type": {"result": "number"}, "output_intro": {"result": "Result: 数值"}}, {"id": "", "name": "加法", "node_name": "dtpc-add", "node_type": "dtpc", "pre_edge_id": [], "nxt_edge_id": [], "input": {"number_1": 0, "number_2": 0}, "input_type": {"number_1": "number", "number_2": "number"}, "input_intro": {"number_1": "加数: 数值", "number_2": "被加数: 数值"}, "output": {"result": 0}, "output_type": {"result": "number"}, "output_intro": {"result": "和: 数值"}}, {"id": "", "name": "逻辑与", "node_name": "dtpc-and", "node_type": "dtpc", "pre_edge_id": [], "nxt_edge_id": [], "input": {"bool_1": false, "bool_2": false}, "input_type": {"bool_1": "bool", "bool_2": "bool"}, "input_intro": {"bool_1": "A: 布尔", "bool_2": "B: 布尔"}, "output": {"result": false}, "output_type": {"result": "bool"}, "output_intro": {"result": "Result: 布尔"}}, {"id": "", "name": "布尔转字符串", "node_name": "dtpc-bool2string", "node_type": "dtpc", "pre_edge_id": [], "nxt_edge_id": [], "input": {"bool": false}, "input_type": {"bool": "bool"}, "input_intro": {"bool": "布尔"}, "output": {"result": "False"}, "output_type": {"result": "string"}, "output_intro": {"result": "Result: 字符串"}}, {"id": "", "name": "除法", "node_name": "dtpc-divide", "node_type": "dtpc", "pre_edge_id": [], "nxt_edge_id": [], "input": {"number_1": 0, "number_2": 1}, "input_type": {"number_1": "number", "number_2": "number"}, "input_intro": {"number_1": "被除数: 数值", "number_2": "被数: 数值"}, "output": {"result": 0}, "output_type": {"result": "number"}, "output_intro": {"result": "商: 数值"}}, {"id": "", "name": "数值比较==", "node_name": "dtpc-eq_number", "node_type": "dtpc", "pre_edge_id": [], "nxt_edge_id": [], "input": {"number_1": 0, "number_2": 0}, "input_type": {"number_1": "number", "number_2": "number"}, "input_intro": {"number_1": "A: 数值", "number_2": "B: 数值"}, "output": {"result": true}, "output_type": {"result": "bool"}, "output_intro": {"result": "A==B: 布尔"}}, {"id": "", "name": "字符串比较==", "node_name": "dtpc-eq_string", "node_type": "dtpc", "pre_edge_id": [], "nxt_edge_id": [], "input": {"string_1": "", "string_2": ""}, "input_type": {"string_1": "string", "string_2": "string"}, "input_intro": {"string_1": "A: 字符串", "string_2": "B: 字符串"}, "output": {"result": true}, "output_type": {"result": "bool"}, "output_intro": {"result": "A==B: 布尔"}}, {"id": "", "name": "数值比较>=", "node_name": "dtpc-ge", "node_type": "dtpc", "pre_edge_id": [], "nxt_edge_id": [], "input": {"number_1": 0, "number_2": 0}, "input_type": {"number_1": "number", "number_2": "number"}, "input_intro": {"number_1": "A: 数值", "number_2": "B: 数值"}, "output": {"result": true}, "output_type": {"result": "bool"}, "output_intro": {"result": "A>=B: 布尔"}}, {"id": "", "name": "数值比较>", "node_name": "dtpc-gt", "node_type": "dtpc", "pre_edge_id": [], "nxt_edge_id": [], "input": {"number_1": 0, "number_2": 0}, "input_type": {"number_1": "number", "number_2": "number"}, "input_intro": {"number_1": "A: 数值", "number_2": "B: 数值"}, "output": {"result": true}, "output_type": {"result": "bool"}, "output_intro": {"result": "A>B: 布尔"}}, {"id": "", "name": "数值比较<=", "node_name": "dtpc-le", "node_type": "dtpc", "pre_edge_id": [], "nxt_edge_id": [], "input": {"number_1": 0, "number_2": 0}, "input_type": {"number_1": "number", "number_2": "number"}, "input_intro": {"number_1": "A: 数值", "number_2": "B: 数值"}, "output": {"result": true}, "output_type": {"result": "bool"}, "output_intro": {"result": "A<=B: 布尔"}}, {"id": "", "name": "逻辑选择布尔", "node_name": "dtpc-logical_select_bool", "node_type": "dtpc", "pre_edge_id": [], "nxt_edge_id": [], "input": {"bool": false, "bool_1": true, "bool_2": false}, "input_type": {"bool": "bool", "bool_1": "bool", "bool_2": "bool"}, "input_intro": {"bool": "A: 布尔", "bool_1": "B1: 布尔", "bool_2": "B2: 布尔"}, "output": {"result": false}, "output_type": {"result": "bool"}, "output_intro": {"result": "B1/B2: 布尔"}}, {"id": "", "name": "逻辑选择数值", "node_name": "dtpc-logical_select_number", "node_type": "dtpc", "pre_edge_id": [], "nxt_edge_id": [], "input": {"bool": false, "number_1": 0, "number_2": 0}, "input_type": {"bool": "bool", "number_1": "number", "number_2": "number"}, "input_intro": {"bool": "A: 布尔", "number_1": "B1: 数值", "number_2": "B2: 数值"}, "output": {"result": 0}, "output_type": {"result": "number"}, "output_intro": {"result": "B1/B2: 数值"}}, {"id": "", "name": "逻辑选择字符串", "node_name": "dtpc-logical_select_string", "node_type": "dtpc", "pre_edge_id": [], "nxt_edge_id": [], "input": {"bool": false, "string_1": "", "string_2": ""}, "input_type": {"bool": "bool", "string_1": "string", "string_2": "string"}, "input_intro": {"bool": "A: 布尔", "string_1": "B1: 字符串", "string_2": "B2: 字符串"}, "output": {"result": ""}, "output_type": {"result": "string"}, "output_intro": {"result": "B1/B2: 字符串"}}, {"id": "", "name": "数值比较<", "node_name": "dtpc-lt", "node_type": "dtpc", "pre_edge_id": [], "nxt_edge_id": [], "input": {"number_1": 0, "number_2": 0}, "input_type": {"number_1": "number", "number_2": "number"}, "input_intro": {"number_1": "A: 数值", "number_2": "B: 数值"}, "output": {"result": false}, "output_type": {"result": "bool"}, "output_intro": {"result": "A<B: 布尔"}}, {"id": "", "name": "取余", "node_name": "dtpc-mod", "node_type": "dtpc", "pre_edge_id": [], "nxt_edge_id": [], "input": {"number_1": 0, "number_2": 1}, "input_type": {"number_1": "number", "number_2": "number"}, "input_intro": {"number_1": "被除数: 数值", "number_2": "除数: 数值"}, "output": {"result": 0}, "output_type": {"result": "number"}, "output_intro": {"result": "余数: 数值"}}, {"id": "", "name": "乘法", "node_name": "dtpc-multiply", "node_type": "dtpc", "pre_edge_id": [], "nxt_edge_id": [], "input": {"number_1": 0, "number_2": 0}, "input_type": {"number_1": "number", "number_2": "number"}, "input_intro": {"number_1": "被乘数: 数值", "number_2": "乘数: 数值"}, "output": {"result": 0}, "output_type": {"result": "number"}, "output_intro": {"result": "积: 数值"}}, {"id": "", "name": "逻辑非", "node_name": "dtpc-not", "node_type": "dtpc", "pre_edge_id": [], "nxt_edge_id": [], "input": {"bool": false}, "input_type": {"bool": "bool"}, "input_intro": {"bool": "A: 布尔"}, "output": {"result": true}, "output_type": {"result": "bool"}, "output_intro": {"result": "!A: 布尔"}}, {"id": "", "name": "数值转字符串", "node_name": "dtpc-number2string", "node_type": "dtpc", "pre_edge_id": [], "nxt_edge_id": [], "input": {"number": 0}, "input_type": {"number": "number"}, "input_intro": {"number": "数值"}, "output": {"result": "0"}, "output_type": {"result": "string"}, "output_intro": {"result": "Result: 字符串"}}, {"id": "", "name": "逻辑或", "node_name": "dtpc-or", "node_type": "dtpc", "pre_edge_id": [], "nxt_edge_id": [], "input": {"bool_1": false, "bool_2": false}, "input_type": {"bool_1": "bool", "bool_2": "bool"}, "input_intro": {"bool_1": "A: 布尔", "bool_2": "B: 布尔"}, "output": {"result": false}, "output_type": {"result": "bool"}, "output_intro": {"result": "A&B: 布尔"}}, {"id": "", "name": "减法", "node_name": "dtpc-subtract", "node_type": "dtpc", "pre_edge_id": [], "nxt_edge_id": [], "input": {"number_1": 0, "number_2": 0}, "input_type": {"number_1": "number", "number_2": "number"}, "input_intro": {"number_1": "被减数: 数值", "number_2": "减数: 数值"}, "output": {"result": 0}, "output_type": {"result": "number"}, "output_intro": {"result": "差: 数值"}}]}, {"type": "ctrl", "name": "程序控制节点", "nodeList": [{"id": "", "name": "For循环执行", "node_name": "ctrl-for", "node_type": "ctrl", "pre_edge_id": [], "nxt_edge_id": [""], "nxt_edge_id_intro": ["下一步: 执行"], "input": {"start_index": 0, "end_index": 5, "step": 1}, "input_type": {"start_index": "number", "end_index": "number", "step": "number"}, "input_intro": {"start_index": "开头: 数值", "end_index": "结尾: 数值", "step": "递进: 数值"}, "output": {"index": 0, "loop_edge_id": ""}, "output_type": {"index": "number", "loop_edge_id": "nxt_edge_id"}, "output_intro": {"index": "索引: 数值", "loop_edge_id": "循环主体: 执行"}}, {"id": "", "name": "If条件执行", "node_name": "ctrl-if", "node_type": "ctrl", "pre_edge_id": [], "nxt_edge_id": ["", ""], "nxt_edge_id_intro": ["True: 执行", "False: 执行"], "input": {"bool": false}, "input_type": {"bool": "bool"}, "input_intro": {"bool": "条件: 布尔"}, "output": {}, "output_type": {}}, {"id": "", "name": "执行队列", "node_name": "ctrl-queue", "node_type": "ctrl", "pre_edge_id": [], "nxt_edge_id": ["", "", "", "", "", "", "", "", "", ""], "nxt_edge_id_intro": ["下一步0: 执行", "下一步1: 执行", "下一步2: 执行", "下一步3: 执行", "下一步4: 执行", "下一步5: 执行", "下一步6: 执行", "下一步7: 执行", "下一步8: 执行", "下一步9: 执行"], "input": {}, "input_type": {}, "output": {}, "output_type": {}}, {"id": "", "name": "选择执行", "node_name": "ctrl-select", "node_type": "ctrl", "pre_edge_id": [], "nxt_edge_id": ["", "", "", "", "", "", "", "", "", ""], "nxt_edge_id_intro": ["0: 执行", "1: 执行", "2: 执行", "3: 执行", "4: 执行", "5: 执行", "6: 执行", "7: 执行", "8: 执行", "9: 执行"], "input": {"index": 0}, "input_type": {"index": "number"}, "input_intro": {"index": "选择索引: 数值"}, "output": {}, "output_type": {}}]}, {"type": "func", "name": "程序功能节点", "nodeList": [{"id": "", "name": "测试", "node_name": "func-test-1692798936169238-bc2b8ee241bc11ee8331dcf505272cb8-0_0_1", "node_type": "func", "pre_edge_id": [], "nxt_edge_id": [], "input": {"value": ""}, "input_type": {"value": "string"}, "input_intro": {"value": "测试值: 字符串"}, "output": {"value": ""}, "output_type": {"value": "string"}, "output_intro": {"value": "测试值: 字符串"}}]}, {"type": "evrx", "name": "事件发生节点", "nodeList": [{"id": "", "name": "开始", "node_name": "evrx-start", "node_type": "evrx", "pre_edge_id": [], "nxt_edge_id": [""], "nxt_edge_id_intro": ["下一步: 执行"], "input": {}, "input_type": {}, "input_intro": {}, "output": {}, "output_type": {}, "output_intro": {}}]}, {"type": "evtx", "name": "事件触发节点", "nodeList": [{"id": "", "name": "结束", "node_name": "evtx-end", "node_type": "evtx", "pre_edge_id": [], "nxt_edge_id": [], "input": {}, "input_type": {}, "input_intro": {}, "output": {}, "output_type": {}, "output_intro": {}}]}]
		this.$axios.get('https://raw.githubusercontent.com/Xuanfq/AutoRunX-Python/master/cli/doc/nodeData.json')
			.then((res)=>{
				// console.log(res)
				let data=JSON.parse(JSON.stringify(res.data))
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
					PFGraph.loadConfig(config)
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
					PFGraph.loadConfig(config)
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