<template>
    <div class="toolbar">
		<img ref="image" width="70" height="70" style="image-rendering: pixelated;">
        <template  v-for="tool in tools">
 			<toolbutton
        		v-bind:tooldata="tool"
        		v-bind:key="tool.id"
        ></toolbutton>
		<hr class="spacer">
        </template>
        <template  v-for="(option,index) in Controller.tool.options">
 			<tooloption
        		v-bind:option="option"
        		v-bind:key="option.id"
        	></tooloption>
			<hr class="spacer" v-if="index != Controller.tool.options.length-1">
        </template>
		<hr>
		<exportbutton></exportbutton>
    </div> 
</template>

<script>
import toolbutton from "./tool-button.vue";
import tooloption from "./tool-option.vue";
import exportbutton from "./export-button.vue";
import { Controller } from "../../../logic/controller";
import { ControllerEvents } from "../../../logic/controller";
let pngfile;

let tools = [];
let srcs = [require("./images/in-decrease.png"), require("./images/average.png")];

Controller.tools.forEach((tool, index) => {
	tools.push({
		id: index,
		key: (index + 1).toString(),
		src: srcs[index],
		tool: tool
	});
});

export default {
	components: {
		toolbutton,
		tooloption,
		exportbutton
	},
	mounted() {
		let refs = this.$refs;
		Controller.subscribe(ControllerEvents.Event_PNG_Data_Changed, function(event) {
			let data = new Blob([event], { type: "image/png" });
			if (pngfile !== null) {
				window.URL.revokeObjectURL(pngfile);
			}
			pngfile = window.URL.createObjectURL(data);
			refs.image.src = pngfile;
		});
	},
	data() {
		return {
			Controller: Controller,
			tools: tools
		};
	}
};
</script>

<style lang="scss" scoped>
@import "./../../../../style/variables.scss";
.toolbar {
	position: absolute;
	top: $menubar-height;
	width: $toolbar-width;
	left: 0;

	padding-top: 10px;
	padding-bottom: 10px;
	margin: 0px;

	background-color: $element-background;

	border: 1px solid $element-background-border;
	border-left: 0;
	border-top: 0;

	border-bottom-right-radius: 5px;
	user-select: none;
}

.spacer {
	margin: 0;
	border: 0;
	margin-top: 10px;
}
</style>