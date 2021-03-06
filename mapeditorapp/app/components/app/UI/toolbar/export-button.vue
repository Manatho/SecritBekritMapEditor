<template>
    	<div class="toolbar-button" @click="exportMap">
            <img draggable="false" class="toolbar-icon" src="./images/export.png">
        </div>
</template>

<script>
let Progressbar = require("../../progressbar.vue").default.controller;

import { MyMath } from "../../../logic/MyMath.js";
import { Controller } from "../../../logic/controller.js";
import { gaussBlur } from "../../../logic/images/gaussianblur.js";
import Worker from "worker-loader?inline=true!./pngworker.js";

import * as JSZip from "jszip";
import { create } from "../../../logic/createLuaFile.js";

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
				let multiplier = Controller.scaling;
				let sigma = multiplier / 2 + 0.5;
				heightmap = mapMultiplier(
					heightmap,
					Controller.terrain.min,
					Controller.terrain.max,
					Controller.terrain.mapSize,
					multiplier,
					sigma
				);

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

							let mapname = Controller.terrain.name;

							let zip = new JSZip();
							zip.file(
								"instructions.txt",
								'To add your map to TransportFever move the folder "' +
									mapname +
									'" into the map folder of the game. \r\n\r\nThe TransportFever map folder can be found by going to your: \r\nSteam Library -> right clicking TransportFever -> Properties -> Local Files -> Browse Local Files  \r\n\r\nEnjoy! :)'
							);
							zip.folder(mapname);
							zip.file(mapname + "/map.lua", create(
								{ 
									name: mapname, 
									author: Controller.terrain.meta.author,
									profile: Controller.terrain.meta.profile,
									towns: Controller.terrainObjects.createTownString(),
									industries: Controller.terrainObjects.createIndustryString() 
									
									}));
							zip.file(mapname + "/heightmap.png", Controller.pngData, { binary: true });

							zip.generateAsync({ type: "blob" }).then(function(blob) {
								let url = URL.createObjectURL(blob);
								let element = document.createElement("a");
								element.setAttribute("href", url);
								element.setAttribute("download", "Map.zip");
								element.click();
								element = null;
								URL.revokeObjectURL(url);
							});

							break;
					}
				};
				worker.postMessage([heightmap, Controller.terrain.mapSize * multiplier]);
			}, 5);
		}
	}
};

function mapMultiplier(heightmap, min, max, terrainwidth, multiplier, sigma) {
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
					multipliedMap[index + x + linesize * y] = MyMath.lerp(value, min, max, 0, 65535);
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
		gaussBlur(multipliedMap, imagesize, imagesize, sigma);
	}
	return multipliedMap;
}
</script>

<style lang="scss" scoped>
@import url("./style/toolbar.scss");
</style>
