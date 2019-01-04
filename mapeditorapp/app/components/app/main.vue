<template>
    <div>
        <Editor></Editor>
		<Menubar v-bind:menuElements="menuElements"></Menubar>
        <Toolbar></Toolbar>
		<NewTerrain ref="newterrain"></NewTerrain>
		<ImportTerrain ref="importterrain"></ImportTerrain>
		<Progressbar></Progressbar>
		<p class="versioning">Version 0.6 (Alpha)</p>
    </div>
</template>

<script>
import Menubar from "./UI/menubar/menubar.vue";
import Toolbar from "./UI/toolbar/toolbar.vue";
import Progressbar from "./progressbar.vue";
import Editor from "./TerrainUI/editor.vue";
import NewTerrain from "./new-terrain-modal.vue";
import ImportTerrain from "./import-terrain-modal.vue";

import { Controller } from "./../logic/controller.js";

let progressbar = Progressbar.controller;

function progressHandler(percent) {
	if (percent == "Start") {
		progressbar.start();
		progressbar.visible = true;
		progressbar.message = "Loading initialized";
	} else if (percent == "End") {
		progressbar.stop();
	} else {
		progressbar.message = "Loading: " + percent + "%";
		progressbar.progress = percent;
	}
}

export default {
	name: "app",
	components: {
		Toolbar,
		Editor,
		Progressbar,
		Menubar,
		NewTerrain,
		ImportTerrain
	},
	data() {
		return {
			menuElements: [
				{
					header: "File",
					items: [
						{ text: "New Map", action: () => this.$refs.newterrain.show() },
						{ text: "Save Map", action: () => Controller.saveTerrain() },
						{
							text: "Load Map",
							action: () => {
								let element = document.createElement("input");
								element.setAttribute("type", "file");
								setTimeout(function() {
									element.click();
								}, 0);
								element.onchange = file => {
									Controller.loadTerrain(element.files[0]);
								};
							}
						},
						{ text: "Import Map", action: () => this.$refs.importterrain.show() }
					]
				}
			]
		};
	}
};
</script>

<style lang="scss" scoped>
.versioning {
	position: absolute;
	right: 10px;
	top: 0px;
}
</style>
