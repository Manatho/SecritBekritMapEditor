<template>
    <div class="toolbar-number-container">
            <label for="strength">{{ option.text }}:</label>
            <input type="number" step="1" value="5" min="0" 
                @keyup.enter="onEnter"
                @mousedown.left="onLeft"
                @mouseup.left="onLeftUp"
                @mousemove="onMove"
                @blur="onBlur"
                
            />
        </div>
</template>

<script>
let mouseEvent;
let option;
export default {
	props: {
		option: { type: Object }
	},
	mounted() {
		option = this.$props.option;
	},
	methods: {
		onEnter: event => {
			event.target.blur();
		},
		onLeft: event => {
			event.target.setPointerCapture(1);
			mouseEvent = event;
			mouseEvent.strength = event.target.value;
		},
		onMove: event => {
			if (event.buttons == 1) {
				let difference = ((mouseEvent.y - event.y) / 10) >> 0;
				event.target.value = Number.parseInt(mouseEvent.strength) + Number.parseInt(difference);
			}
		},
		onBlur: event => {
			if (option.minimum != undefined) {
				event.target.value = Math.max(event.target.value, option.minimum);
			}

			//Tools.tool.strength = strengthInput.value;
		},
		onLeftUp: event => {
			if (event.target.value != mouseEvent.strength) {
				event.target.blur();
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.toolbar-number-container {
	font-family: "Courier New", Courier, monospace;
	font-size: 13px;
}

.toolbar-number-container > input[type="number"] {
	font-family: "Courier New", Courier, monospace;
	font-size: 13px;
	margin: auto;
	width: 55px;
	text-align: center;
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
	border: 1px solid rgb(59, 59, 59);
	background-color: rgb(236, 229, 223);
}

.toolbar-number-container > input[type="number"]:focus {
	outline: none;
	border: 1px solid rgb(255, 255, 222);
}

input[type="number"]::-webkit-inner-spin-button {
	-webkit-appearance: none;
}
</style>



