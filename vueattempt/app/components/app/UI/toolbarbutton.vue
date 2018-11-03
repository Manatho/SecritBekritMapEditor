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
.toolbar-button {
	width: 55px;
	height: 55px;
	line-height: 50px;
	cursor: pointer;

	background-color: rgb(163, 158, 154);
	border: 1px solid rgb(110, 110, 110);
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;

	transition: width 0.2s, background-color 0.2s;
}

.toolbar-button:hover {
	width: 65px;
	background-color: rgb(109, 100, 94);

	transition: width 0.2s, background-color 0.2s;
}

.toolbar-button-container input {
	visibility: hidden;
	position: absolute;
}

input:checked + .toolbar-button {
	width: 65px;
	background-color: rgb(85, 78, 74);

	transition: width 0.2s, background-color 0.2s;
}

.toolbar-icon {
	margin: 5px;
	width: 45px;
	height: 45px;
	filter: sepia(1);
}
</style>