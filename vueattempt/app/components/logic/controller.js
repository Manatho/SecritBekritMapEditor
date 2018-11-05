import Vue from "vue";
import { Terrain } from "./terrain";

let eventbus = new Vue();
let terrain = new Terrain();
let pngdata;

export const Controller = {
	get Terrain() {
		return terrain;
	},
	get pngData() {
		return pngdata;
	},
	set pngData(data) {
		pngdata = data;
		eventbus.$emit("png-data-changed", pngdata);
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
