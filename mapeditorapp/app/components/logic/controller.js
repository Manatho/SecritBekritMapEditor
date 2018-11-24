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
	createNewTerrain(name, size, scale) {
		let actualSize = size / scale;
		let indiceSize = findBestIndiceSize(128, actualSize);
		let baselineheight = 150; //Meters
		let indiceCount = actualSize / indiceSize;
		let indiceworldsize = ((size / 1024) * 1000) / indiceCount;

		terrain = new Terrain(name, actualSize, indiceworldsize, indiceSize, baselineheight, 0, 1000);
		scaling = scale;

		eventbus.$emit(ControllerEvents.Event_Terrain_Changed, terrain);
		this.requestRender();
	},
	async loadTerrain(file, progress) {
		terrain = await Terrain.load(file, progress);

		console.log(terrain.mapSize, terrain._indiceSize, terrain.indiceWorldSize, Terrain.PIXEL_PER_METER);

		scaling = (128 * (terrain.mapSize / (terrain._indiceSize - 1)) * terrain.indiceWorldSize) / (125 * terrain.mapSize);
		scaling /= Terrain.PIXEL_PER_METER;
		console.log(scaling);

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

function findBestIndiceSize(base, worldsize) {
	let indiceSize = Math.min(worldsize, base);
	//Ensures proper splitting of the map as close to 128 as possible
	if ((worldsize / indiceSize) % 1 != 0) {
		let newIndiceSize = worldsize;

		while (newIndiceSize > base && newIndiceSize % 1 == 0) {
			newIndiceSize /= 2;
		}
		indiceSize = (newIndiceSize * 2) >> 0;
	}
	return indiceSize;
}

export const ControllerEvents = {
	Event_PNG_Data_Changed: "png-data-changed",
	Event_Terrain_Changed: "terrain-changed"
};

window.Controller = Controller;
window.Terrain = Terrain;
