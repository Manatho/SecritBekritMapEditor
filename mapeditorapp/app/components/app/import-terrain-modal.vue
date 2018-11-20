<template>
	<div v-show="render" class="modal">
		<div class="modal-content">
			<button @click="uploadTerrain" class="button">Import</button>

			<div v-show="fileimported" style="width: 100%; display:flex; flex-direction:column;">
				<div class="canvas-container"><canvas ref="canvasImage"></canvas> <canvas ref="canvasOverlay"></canvas></div>
				<div class="setting">
					<div style="display:flex">
						<h4>Scaling</h4>
						<div class="info">
							<span class="tooltip"
								>Terrain to pixel ratio: <br />
								Trades precision for performance.</span
							>
						</div>
					</div>
					<div class="grid-container">
						<label class="container" v-for="scale in Scales">
							<input type="radio" name="scale" class="radioinput" v-model="selectedScale" v-bind:value="scale" />
							<span class="radio"></span> <span class="radiotext">{{ scale }}</span>
						</label>
					</div>
				</div>
				<div class="setting">
					<h4>Height</h4>
					<div style="display:flex">
						<div>
							<label>Min:</label>
							<input type="number" name="quantity" class="number-input" v-model="minheight" min="1" max="5" />
						</div>
						<div>
							<label>Max:</label>
							<input type="number" name="quantity" class="number-input" v-model="maxheight" min="1" max="5" />
						</div>
					</div>
				</div>
				<button @click="createTerrain" class="button">Create</button>
			</div>
				<button @click="render = false" class="button">Cancel</button>
		</div>
	</div>
</template>



<script>
import { Controller } from "../logic/controller.js";
import { PNG160 } from "./UI/toolbar/export-logic/libs/PNG160.js";
import { gaussBlur } from "./UI/toolbar/export-logic/gaussianblur.js";

let file;
let width;
let height;

export default {
	methods: {
		uploadTerrain() {
			let element = document.createElement("input");
			element.setAttribute("type", "file");
			element.click();
			element.onchange = event => {
				file = element.files[0];
				this.fileimported = true;
				let canvas = this.$refs.canvasImage;
				let ctx2 = this.$refs.canvasOverlay.getContext("2d");
				let ctx = canvas.getContext("2d");
				let img = new Image();

				console.log(canvas.height, canvas.width);

				if (file.type.match("image.*")) {
					// Read in the image file as a data URL.
					let reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = function(evt) {
						if (evt.target.readyState == FileReader.DONE) {
							img.src = evt.target.result;
							img.onload = () => {
								width = img.width;
								height = img.height;
								ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
								let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
								for (var i = 0; i < imageData.data.length; i += 4) {
									if (imageData.data[i] < 20 && imageData.data[i + 1] < 20 && imageData.data[i + 2] < 20) {
										imageData.data[i + 1] = 150;
										imageData.data[i + 2] = 255;
										imageData.data[i + 3] = 100;
									}
								}
								ctx2.putImageData(imageData, 0, 0);
							};
						}
					};
				} else {
					alert("not an image");
				}
			};
		},
		createTerrain() {
			let scale = this.selectedScale;
			let binaryReader = new FileReader();
			let data;
			binaryReader.readAsArrayBuffer(file); // async call
			binaryReader.onload = function() {
				data = PNG160.getData(new Uint8Array(this.result));
				let floatdata = new Array(data.length);
				for (let i = 0; i < data.length; i++) {
					floatdata[i] = lerp(data[i], 0, 65536, 0, 1000);
				}
				console.log(floatdata);
				window.cray = floatdata;
				data = null;
				Controller.createNewTerrain(width - 1, scale, 0, 1000);
				Controller.terrain.setHeights(floatdata);
			};
			this.render = false;
		},
		show() {
			this.render = true;
		}
	},
	data() {
		return {
			Scales: [1, 2, 4, 8, 16, 32],
			minheight: 0,
			maxheight: 1000,
			selectedScale: 1,
			render: true,
			fileimported: false
		};
	}
};

function lerp(num, in_min, in_max, out_min, out_max) {
	let lerped = ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
	if (lerped < out_min || lerped > out_max) {
		return Math.max(Math.min(lerped, out_max), out_min);
	}
	return lerped;
}
</script>

<style lang="scss" scoped>
@import "./../../style/variables.scss";
@import "./common styles/modal.scss";

canvas {
	position: absolute;
	left: 0;
	top: 0;
	height: 100%;
	width: 100%;
}

.canvas-container {
	margin: 5px;
	position: relative;
	width: calc(100% - 10px);

	&::before {
		content: "";
		display: block;
		padding-top: 100%;
	}
}

.grid-container {
	position: relative;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 5px;
}

.number-input {
	font-family: $font;
	font-size: 13px;
	margin: auto;
	width: 48%;
	text-align: center;
	border-radius: 5px;
	border: 1px solid transparent;
	background-color: $element-background;
}

.number-input:focus {
	outline: none;
	border: 1px solid $element-background-border;
}

.number-input::-webkit-inner-spin-button {
	-webkit-appearance: none;
}
</style>
