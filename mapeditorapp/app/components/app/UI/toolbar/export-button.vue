<template>
    	<div class="toolbar-button" @click="exportMap">
            <img draggable="false" class="toolbar-icon" src="./images/export.png">
        </div>
</template>

<script>
let Progressbar = require("../../progressbar.vue").default.Progressbar;

import { Controller } from "../../../logic/controller.js";
import Worker from "worker-loader?inline=true!./export-logic/pngworker.js";

let multiplier = 1;
let sigma = 1.5;
let max = 390;
let min = -1110;

export default {
	methods: {
		exportMap: event => {
			if (Controller.terrain == null) {
				return;
			}

			Progressbar.start();
			Progressbar.visible = false;
			Progressbar.message = "Getting data";

			setTimeout(function() {
				let heightmap = Controller.terrain.getHeightValues();

				heightmap = mapMultiplier(heightmap, Controller.terrain.mapSize, multiplier);

				const worker = new Worker();

				Progressbar.message = "Setting up data";
				worker.onmessage = function(e) {
					switch (e.data[0]) {
						case "Start":
							Progressbar.visible = true;
							Progressbar.message = e.data[1];
							break;
						case "Progress":
							Progressbar.message = e.data[1] + ": " + e.data[2] + "%";
							Progressbar.progress = e.data[2];
							break;
						case "Finished":
							Progressbar.message = e.data[1];
							Progressbar.progress = 100;
							break;
						case "Data":
							Controller.pngData = e.data[1];
							Progressbar.stop();
							break;
					}
				};
				worker.postMessage([heightmap, Controller.terrain.mapSize * multiplier]);
			}, 5);
		}
	}
};

function createPNG() {
	onmessage = function(e) {
		postMessage(["Start", "Starting"]);

		let onepercent = (((e.data[1] + 1) * (e.data[1] + 1)) / 100) >> 0;
		let pngdata = PNG160.createPNG(e.data[1] + 1, e.data[1] + 1, (w, h, i) => {
			if (i % onepercent == 0) {
				if (i / onepercent == 100) {
					postMessage(["Finished", "Finishing..."]);
				} else {
					postMessage(["Progress", "Progress", i / onepercent]);
				}
			}
			return e.data[0][i];
		});
		postMessage(["Finished", "Finished"]);
		postMessage(["Data", pngdata]);
	};
}

function lerp(num, in_min, in_max, out_min, out_max) {
	let lerped = ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
	if (lerped < out_min || lerped > out_max) {
		return Math.max(Math.min(lerped, out_max), out_min);
	}
	return lerped;
}

function mapMultiplier(heightmap, terrainwidth, multiplier) {
	let linesize = terrainwidth * multiplier + multiplier;
	let multipliedMap = new Array(linesize * linesize);
	let imagesize = linesize - multiplier + 1;
	terrainwidth++;

	let index = 0;
	heightmap.forEach((h, i) => {
		let value = h;
		if (i % terrainwidth == 0 && i != 0) {
			index += linesize * (multiplier - 1);
		}

		for (let x = 0; x < multiplier; x++) {
			for (let y = 0; y < multiplier; y++) {
				if ((i + 1) % terrainwidth != 0 || x == 0) {
					multipliedMap[index + x + linesize * y] = lerp(value, max, min, 0, 65535);
				} else {
					multipliedMap[index + x + linesize * y] = null;
				}
			}
		}
		index += multiplier;
	});

	multipliedMap = multipliedMap.filter((h, i) => h != null);
	multipliedMap = multipliedMap.slice(0, multipliedMap.length - imagesize * (multiplier - 1));

	if (sigma > 0 && multiplier > 1) {
		gaussBlur_4(multipliedMap, new Array(multipliedMap.length), imagesize, imagesize, sigma);
	}
	return multipliedMap;
}
</script>

<style lang="scss" scoped>
@import url("./style/toolbar.scss");
</style>
