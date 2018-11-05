<template>
    <div>
        <Toolbar></Toolbar>
        <Editor></Editor>
		<app-modal/>
    </div>
</template>

<script>
import Toolbar from "./UI/toolbar/toolbar.vue";
import Editor from "./TerrainUI/editor.vue";

export default {
	name: "app",
	components: {
		Toolbar,
		Editor
	}
};
</script>

<style lang="scss" scoped>
</style>
