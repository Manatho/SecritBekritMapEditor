import Vue from "vue";
import { Terrain } from "./terrain";
import { Tool } from "./tools";

let eventbus = new Vue();
let terrain = new Terrain();
let tool = new Tool(5, 5, "square");
let pngdata;
let render = true;

export const Controller = {
	get Tool() {
		return tool;
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
