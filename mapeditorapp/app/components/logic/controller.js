import Vue from "vue";
import { Terrain } from "./terrain";
import { raiseTool, averageTool } from "./toolprefabs";

let eventbus = new Vue();
let terrain = new Terrain();

let tools = [raiseTool, averageTool];
let tool = tools[0];

let pngdata;
let render = true;

export const Controller = {
	get tools() {
		return tools;
	},
	get tool() {
		return tool;
	},
	set tool(newtool) {
		tool = newtool;
	},
	applyTool(raycaster, direction) {
		tool.applyTool(raycaster, terrain, direction);
		this.requestRender();
	},
	get terrain() {
		return terrain;
	},
	get pngData() {
		return pngdata;
	},
	set pngData(data) {
		pngdata = data;
		eventbus.$emit("png-data-changed", pngdata);
	},
	requestRender() {
		render = true;
	},
	get render() {
		let old = render;
		render = false;
		return old;
	},

	subscribe(eventType, method) {
		eventbus.$on(eventType, method);
	},
	unsubscribe(eventType, method) {
		eventbus.$off(eventType, method);
	}
};

export const ControllerEvents = {
	Event_PNG_Data_Changed: "png-data-changed"
};
