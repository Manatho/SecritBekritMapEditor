<template>
    <label class="toolbar-button-container">
        <input type="radio" name="toolbutton" value="deincrease" checked="checked" key="1" />
        <div class="toolbar-button">
            <img v-bind:src="button.src" draggable="false" class="toolbar-icon">
        </div>
    </label>
</template>

<script>
export default {
	props: {
		button: { type: Object }
	}
};
</script>


<style lang="scss" scoped>
@import url("./style/toolbar.scss");

.toolbar-button-container input {
	visibility: hidden;
	position: absolute;
}

input:checked + .toolbar-button {
	width: 65px;
	background-color: rgb(85, 78, 74);

	transition: width 0.2s, background-color 0.2s;
}
</style>