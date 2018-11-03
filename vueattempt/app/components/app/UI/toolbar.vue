<template>
    <div class="toolbar">
        <template  v-for="tool in tools">
 			<ToolbarButton
        		v-bind:button="tool"
        		v-bind:key="tool.id"
        ></ToolbarButton>
		<hr class="spacer">
        </template>
    </div> 
</template>

<script>
import ToolbarButton from "./toolbarbutton.vue";
export default {
	components: {
		ToolbarButton
	},
	data() {
		return {
			tools: [
				{
					id: 1,
					src: require("../images/in-decrease.png")
				},
				{
					id: 2,
					src: require("../images/average.png")
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

	border: 1px solid rgb(138, 82, 82);
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