<template>
    <div class="toolbar">
        <template  v-for="tool in tools">
 			<toolbutton
        		v-bind:button="tool"
        		v-bind:key="tool.id"
        ></toolbutton>
		<hr class="spacer">
        </template>
        <template  v-for="option in tooloptions">
 			<tooloption
        		v-bind:option="option"
        		v-bind:key="option.id"
        ></tooloption>
		<hr class="spacer">
        </template>
		<hr>
		<exportbutton></exportbutton>
    </div> 
</template>

<script>
import toolbutton from "./tool-button.vue";
import tooloption from "./tool-option.vue";
import exportbutton from "./export-button.vue";

export default {
	components: {
		toolbutton,
		tooloption,
		exportbutton
	},
	data() {
		return {
			tools: [
				{
					id: 1,
					src: require("./images/in-decrease.png")
				},
				{
					id: 2,
					src: require("./images/average.png")
				}
			],
			tooloptions: [
				{
					id: 3,
					text: "Strength"
				},
				{
					id: 4,
					text: "Size",
					minimum: 1
				}
			]
		};
	}
};
</script>

<style lang="scss" scoped>
.toolbar {
	position: absolute;
	top: 5%;
	width: 70px;
	left: 0;

	padding-top: 10px;
	padding-bottom: 10px;
	margin: 0px;

	background-color: rgb(153, 147, 143);

	border: 1px solid rgb(59, 59, 59);
	border-left: 0;

	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
}

.spacer {
	margin: 0;
	border: 0;
	margin-top: 10px;
}
</style>