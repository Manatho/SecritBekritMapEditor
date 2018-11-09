import Vue from "vue";
import { Terrain } from "./terrain";
import { raiseTool, averageTool } from "./toolprefabs";

let eventbus = new Vue();
let terrain;

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
	createNewTerrain(size, scale) {
		let actualSize = size / scale;
		let indeiceSize = Math.min(actualSize, 128);
		let indiceCount = actualSize / indeiceSize;

		// 128 1024 -> 8
		// 128 512 -> 4
		// 128 256 -> 2
		// 128 128 -> 1

		// this.mapSize = 4096; this.indiceWorlSize = 8000; var indiceSize = 128;
		// this.mapSize = 2048; this.indiceWorlSize = 4000; var indiceSize = 128;
		// this.mapSize = 1024; this.indiceWorlSize = 2000; let indiceSize = 128;
		// this.mapSize = 512; this.indiceWorlSize = 1000; var indiceSize = 64;
		// this.mapSize = 256; this.indiceWorlSize = 500; var indiceSize = 32;
		// this.mapSize = 4; this.indiceWorlSize = 1000; var indiceSize = 2;

		terrain = new Terrain(actualSize, (size * 16) / (actualSize / indeiceSize), indeiceSize);
		//terrain = new Terrain(512, 1000, 64);
		eventbus.$emit(ControllerEvents.Event_Terrain_Changed, terrain);
		this.requestRender();
	},
	get pngData() {
		return pngdata;
	},
	set pngData(data) {
		pngdata = data;
		eventbus.$emit(ControllerEvents.Event_PNG_Data_Changed, pngdata);
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
		console.log(eventType);

		eventbus.$on(eventType, method);
	},
	unsubscribe(eventType, method) {
		eventbus.$off(eventType, method);
	}
};

export const ControllerEvents = {
	Event_PNG_Data_Changed: "png-data-changed",
	Event_Terrain_Changed: "terrain-changed"
};
