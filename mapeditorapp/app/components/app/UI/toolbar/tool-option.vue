<template>
    <div class="toolbar-number-container">
            <label>{{option.name.charAt(0).toUpperCase() + option.name.slice(1) }}:</label>
            <input ref="input" type="number" step="1"  :value="option.value"
                @keyup.enter="onEnter"
                @mousedown.left="onLeft"
                @mouseup.left="onLeftUp"
                @mousemove="onMove"
                @blur="onBlur"
                
            />
        </div>
</template>

<script>
import { Controller } from "../../../logic/controller";
import Vue from "vue";

let mouseEvent;
export default {
	props: {
		option: { type: Object }
	},
	mounted() {
		this.input = this.$refs.input;
	},
	data() {
		return {
			minimum: undefined
		};
	},
	methods: {
		onEnter(event) {
			this.input.blur();
		},
		onLeft(event) {
			this.input.setPointerCapture(1);
			mouseEvent = event;
			mouseEvent.strength = this.input.value;
		},
		onMove(event) {
			if (event.buttons == 1) {
				let difference = ((mouseEvent.y - event.y) / 10) >> 0;
				this.input.value = Number.parseInt(mouseEvent.strength) + Number.parseInt(difference);
			}
		},
		onBlur(event) {
			this.option.value = this.input.value;
			this.$forceUpdate();
		},
		onLeftUp(event) {
			if (this.input.value != mouseEvent.strength) {
				this.input.blur();
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import "./../../../../style/variables.scss";
.toolbar-number-container {
	font-family: $font;
	//font-weight: bold;
	font-size: 13px;
}

.toolbar-number-container > input[type="number"] {
	font-family: $font;
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



