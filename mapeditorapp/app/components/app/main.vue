<template>
    <div>
        <Editor></Editor>
		<Menubar v-bind:menuElements="menuElements"></Menubar>
        <Toolbar></Toolbar>
		<NewTerrain ref="child"></NewTerrain>
		<Progressbar></Progressbar>
		<p class="versioning">Version 0.0 (Alpha)</p>
    </div>
</template>

<script>
import Menubar from "./UI/menubar/menubar.vue";
import Toolbar from "./UI/toolbar/toolbar.vue";
import Progressbar from "./progressbar.vue";
import Editor from "./TerrainUI/editor.vue";
import NewTerrain from "./new-terrain-modal.vue";

export default {
	name: "app",
	components: {
		Toolbar,
		Editor,
		Progressbar,
		Menubar,
		NewTerrain
	},
	data() {
		return {
			menuElements: [
				{
					header: "File",
					items: [{ text: "New Map", action: () => this.$refs.child.show() }]
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
