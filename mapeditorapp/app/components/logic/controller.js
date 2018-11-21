import Vue from "vue";
import { Terrain } from "./terrain";
import { raiseTool, averageTool } from "./toolprefabs";

let eventbus = new Vue();

let terrain;
let scaling = 1;

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
	get scaling() {
		return scaling;
	},
	createNewTerrain(size, scale) {
		let actualSize = size / scale;
		let indiceSize = Math.min(actualSize, 128);
		let indiceCount = actualSize / indiceSize;
		let indiceworldsize = ((size / 1024) * 1000) / indiceCount;
		let baselineheight = 150; //Meters

		//Ensures proper splitting of the map as close to 128 as possible
		if ((actualSize / indiceSize) % 1 != 0) {
			let newIndiceSize = actualSize;

			while (newIndiceSize > 128 && newIndiceSize % 1 == 0) {
				newIndiceSize /= 2;
			}
			indiceSize = (newIndiceSize * 2) >> 0;
		}

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
		//terrain = new Terrain(6, 250, 2, baselineheight, 0, 1000);

		terrain = new Terrain(actualSize, indiceworldsize, indiceSize, baselineheight, 0, 1000);
		scaling = scale;

		eventbus.$emit(ControllerEvents.Event_Terrain_Changed, terrain);
		this.requestRender();
	},
	async loadTerrain(file, progress) {
		terrain = await Terrain.load(file, progress);
		eventbus.$emit(ControllerEvents.Event_Terrain_Changed, terrain);
	},
	saveTerrain() {
		terrain.save();
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

window.Controller = Controller;
window.Terrain = Terrain;
