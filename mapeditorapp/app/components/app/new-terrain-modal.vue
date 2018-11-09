<template>
	<div v-show="render" class="modal">
		<div class="modal-content">
			<div class="settings">
				<div class="setting">
					<h4>Size</h4>
					<label class="container" v-for="size in Sizes">
  						<input type="radio" name="size" v-model="selectedSize" v-bind:value="size">
						  <span class="radio"></span>
  						<span class="radiotext">{{size}}</span>
					</label>
				</div>
				<div class="setting">
					<div style="display:flex">
						<h4>Scaling</h4>
						<div class="info">
							<span class="tooltip">Terrain to pixel ratio: <br> Trades precision for performance.</span>
						</div>
					</div>
					<label class="container" v-for="scale in Scales">
  						<input type="radio" name="scale" v-model="selectedScale" v-bind:value="scale">
						<span class="radio"></span>
  						<span class="radiotext">{{scale}}</span>
					</label>
				</div>
			</div>
			<button @click="createTerrain" class="create">Create</button>
		</div>
	</div>
</template>


<script>
import { Controller } from "../logic/controller.js";
export default {
	methods: {
		createTerrain() {
			Controller.createNewTerrain(this.selectedSize, this.selectedScale);
			this.render = false;
		},
		show() {
			this.render = true;
		}
	},
	data() {
		return {
			Scales: [1, 2, 4, 8, 16, 32],
			Sizes: [1024, 2048, 3072, 4096, 5120, 6144],
			selectedScale: 1,
			selectedSize: 1024,
			render: true
		};
	}
};
</script>

<style lang="scss" scoped>
@import "./../../style/variables.scss";
.modal {
	position: fixed;
	z-index: 1;
	padding-top: 10%;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	background-color: rgb(0, 0, 0);
	background-color: rgba(56, 56, 56, 0.6);
}
.modal-content {
	margin: auto;
	width: 205px;
	background-color: $element-background;
	border: $element-border;
	font-family: $font;
	display: flex;
	flex-direction: column;
	border-radius: 5px;
}

.settings {
	display: grid;
	grid-template-columns: 50% 50%;
	height: 50%;
	flex-grow: 1;
}

.setting {
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	flex-grow: 1;
	background-color: $element-backgroundlight;
	padding: 5px;
	margin: 5px;
	box-shadow: 0 1px 2px 0px black;
	border-radius: 4px;
}

.create {
	margin: 5px;
	border: none;
	background-color: $element-backgroundlight;
	box-shadow: 0 1px 2px 0px black;
	flex-grow: 1;
	outline: 0;
	transition: background-color 0.1s;

	&:hover {
		background-color: $element-hoverhuedlight;
		box-shadow: 0 1px 3px 0px black;
		transition: background-color 0.2s;
	}
}

h4 {
	flex-grow: 1;
	margin: 0;
	margin-bottom: 5px;
	padding: 0;
	height: 1em;
}

.info {
	background: url("../../icons/help.svg");
	height: 1.4em;
	width: 1.4em;
	margin-top: -1px;
	position: relative;
	.tooltip {
		visibility: hidden;

		position: absolute;
		width: 150px;
		padding: 5px 0;
		z-index: 1;
		bottom: 125%;
		left: 50%;
		margin-left: -75px;

		background-color: rgb(43, 43, 43);
		border-radius: 6px;
		border: 1px;

		color: #fff;
		font-size: 12px;
		text-align: center;
	}
	.tooltip::after {
		content: "";
		position: absolute;
		top: 100%;
		left: 50%;
		margin-left: -10px;
		border-width: 10px;
		border-style: solid;
		border-color: rgb(43, 43, 43) transparent transparent transparent;
	}

	&:hover .tooltip {
		visibility: visible;
	}
}

.container {
	position: relative;
	flex-grow: 1;
	display: flex;
	padding-left: 20px;

	input {
		position: absolute;
		opacity: 0;
		cursor: pointer;
	}

	&:hover input ~ .radio {
		background-color: $element-hover;
	}

	input:checked ~ .radio {
		background-color: $element-background;
	}

	input:checked ~ .radio:after {
		display: block;
	}
}

.radio {
	position: absolute;
	top: 0;
	left: 0;
	height: 16px;
	width: 16px;
	background-color: $element-background;
	border-radius: 50%;

	&:after {
		content: "";
		position: absolute;
		display: none;
		top: 3px;
		left: 3px;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: $element-hoverhuedlight;
	}
}

.radiotext {
	width: 1em;
	text-align: right;
}
</style>
