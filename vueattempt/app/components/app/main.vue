<template>
    <div>
        <Toolbar></Toolbar>
        <Editor></Editor>
		<Progressbar></Progressbar>
    </div>
</template>

<script>
import Toolbar from "./UI/toolbar/toolbar.vue";
import Progressbar from "./progressbar.vue";
import Editor from "./TerrainUI/editor.vue";

export default {
	name: "app",
	components: {
		Toolbar,
		Editor,
		Progressbar
	}
};
</script>

<style lang="scss" scoped>
</style>
