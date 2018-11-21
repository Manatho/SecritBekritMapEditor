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
								Trades precision for performance <br/>
								(4 is a good starting point)
							</span>
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
							<input type="number" name="min" class="number-input" v-model="minheight" @keyup.enter="blur" @blur="onblur" />
						</div>
						<div>
							<label>Max:</label>
							<input type="number" name="max" class="number-input" v-model="maxheight"  @keyup.enter="blur"  @blur="onblur" />
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
import { PNG160 } from "../logic/images/PNG160.js";
import { gaussBlur } from "../logic/images/gaussianblur.js";

let file;
let width;
let height;

let canvas;
let ctx2;
let ctx;

export default {
	methods: {
		uploadTerrain() {
			let element = document.createElement("input");
			element.setAttribute("type", "file");
			element.click();
			element.onchange = event => {
				file = element.files[0];
				console.log(file);

				this.fileimported = true;
				canvas = this.$refs.canvasImage;
				ctx2 = this.$refs.canvasOverlay.getContext("2d");
				ctx = canvas.getContext("2d");
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
								updateWaterLevel(ctx, ctx2, 25);
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
			let self = this;

			binaryReader.readAsArrayBuffer(file); // async call
			binaryReader.onload = function() {
				data = PNG160.getData(new Uint8Array(this.result));
				if (scale > 1) {
					data = lanczos(data, width, height, 1 / scale, 3);
				}
				let floatdata = new Array(data.length);

				for (let i = 0; i < data.length; i++) {
					floatdata[i] = lerp(data[i], 0, 65536, self.minheight, self.maxheight);
				}
				console.log(floatdata);
				window.cray = floatdata;
				data = null;
				Controller.createNewTerrain(width - 1, scale);
				Controller.terrain.setHeights(floatdata);
			};
			this.render = false;
		},
		show() {
			this.render = true;
		},
		onblur(event) {
			let target = event.target;

			if (target.name == "min") {
				this.minheight = Math.max(0, this.minheight);
			} else if (target.name == "max") {
				this.maxheight = Math.min(1000, this.maxheight);
			}
			this.minheight = Math.min(this.minheight, this.maxheight);
			let waterheight = Math.max(0, ((100 - this.minheight) / this.maxheight) * 255);
			console.log(waterheight);

			updateWaterLevel(ctx, ctx2, waterheight);
		},
		blur(event) {
			event.target.blur();
		}
	},
	data() {
		return {
			Scales: [1, 2, 4, 8, 16, 32],
			minheight: 0,
			maxheight: 1000,
			selectedScale: 4,
			render: true,
			fileimported: false
		};
	}
};

function updateWaterLevel(ctx, ctx2, waterHeight) {
	let imageData = ctx.getImageData(0, 0, width, height);
	for (var i = 0; i < imageData.data.length; i += 4) {
		if (imageData.data[i] < waterHeight - 1 && imageData.data[i + 1] < waterHeight - 1 && imageData.data[i + 2] < waterHeight - 1) {
			imageData.data[i + 1] = 150;
			imageData.data[i + 2] = 255;
			imageData.data[i + 3] = 100;
		} else if (imageData.data[i] < waterHeight && imageData.data[i + 1] < waterHeight && imageData.data[i + 2] < waterHeight) {
			imageData.data[i] = 255;
			imageData.data[i + 3] = 255;
		}
	}
	ctx2.putImageData(imageData, 0, 0);
}

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
	color: $element-backgroundlight;
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
