<template>
    <div>
        <Toolbar></Toolbar>
        <Editor></Editor>
    </div>
</template>

<script>
import Toolbar from "./UI/toolbar.vue";
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
