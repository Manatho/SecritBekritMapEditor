<template>
	<div v-show="render" class="modal">
		<div class="modal-content">
			<div class="err" v-show="err">{{err}}
				<div style="float:right; position:absoulte"> 
					<div class="info">
						<span class="icon"></span>
						<span class="tooltip">Imported images need to be 16bit grayscale pngs </br></br>
						(Currently, non-square maps and incorrect sizes are not supported</span>
					</div>
				</div>
			</div>
			<button @click="uploadTerrain" class="button">Import</button>
			<div v-show="fileimported" style="width: 100%; display:flex; flex-direction:column;">
				<input class="textinput" v-model="name" name="importName" placeholder="Name" @keyup.enter="blur" @keypress="onkey">
				<input class="textinput" v-model="author" name="importAuthor" placeholder="Author" @keyup.enter="blur">
				<input class="textinput" v-model="profile" name="importProfile" placeholder="Steam Profile" @keyup.enter="blur">
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
							<input type="radio" name="importscale" class="radioinput" v-model="selectedScale" v-bind:value="scale" />
							<span class="radio"></span> <span class="radiotext">{{ scale }}</span>
						</label>
					</div>
				</div>
				<div class="setting">
					<h4>Height</h4>
					<div style="display:flex">
						<div>
							<label>Min:</label>
							<input type="number" name="importmin" class="number-input" v-model="minheight" @keyup.enter="blur" @blur="onblur" />
						</div>
						<div>
							<label>Max:</label>
							<input type="number" name="importmax" class="number-input" v-model="maxheight"  @keyup.enter="blur"  @blur="onblur" />
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
import { MyMath } from "../logic/MyMath.js";
import { Controller } from "../logic/controller.js";
import { PNG160 } from "../logic/images/PNG160.js";
import { gaussBlur } from "../logic/images/gaussianblur.js";
import { ResampleLanczos } from "../logic/images/lanczos.js";
import { TERRAIN_MAX_HEIGHT, TERRAIN_MIN_HEIGHT } from '../logic/constants.js';
let Progressbar = require("./progressbar.vue").default.controller;
console.log(Progressbar);

export default {
	mounted() {
		this.canvas = this.$refs.canvasImage;
		this.layer2 = this.$refs.canvasOverlay.getContext("2d");
		this.layer1 = this.canvas.getContext("2d");
	},
	methods: {
		uploadTerrain() {
			openFileDialog(file => {
				if (file.type != "image/png") {
					this.err = "Not a png";
					return;
				}

				Progressbar.start();
				Progressbar.visible = false;
				Progressbar.message = "Importing...";
				checkImageType(this, file);
				createMapPreview(this, file); //sets progressbar
			});
		},
		createTerrain() {
			Progressbar.start();
			Progressbar.visible = false;
			Progressbar.message = "Creating Terrain...";

			setTimeout(() => {
				let image = PNG160.getRawImage(this.rawImageData);
				let data = image.data;

				//Downscaling
				if (this.selectedScale > 1) {
					let scaledwidth = ((image.width * (1 / this.selectedScale)) >> 0) + 1;
					let scaledheight = ((image.height * (1 / this.selectedScale)) >> 0) + 1;
					data = ResampleLanczos(data, image.width, image.height, scaledwidth, scaledheight, 5);
				}

				//Convert pixel to terrain values
				let floatdata = new Array(data.length);
				for (let i = 0; i < data.length; i++) {
					floatdata[i] = MyMath.lerp(data[i], 0, 65536, this.minheight, this.maxheight);
				}
				data = null;
				let meta = {
					name: this.name == "" ? "map" : this.name,
					author: this.author,
					profile: this.profile
				};
				Controller.createNewTerrain(meta, image.width - 1, this.selectedScale);
				Controller.terrain.setHeights(floatdata);
				this.render = false;
				Progressbar.stop();
			}, 50);
		},
		show() {
			this.render = true;

			if (this.err != null) {
				this.err = null;
				this.fileimported = false;
			}
		},
		onblur(event) {
			let target = event.target;

			if (target.name == "importmin") {
				this.minheight = Math.max(TERRAIN_MIN_HEIGHT, this.minheight);
			} else if (target.name == "importmax") {
				this.maxheight = Math.min(TERRAIN_MAX_HEIGHT, this.maxheight);
			}
			this.minheight = Math.min(this.minheight, this.maxheight);
			let waterheight = Math.max(0, ((100 - this.minheight) / this.maxheight) * 255);

			updateWaterLevel(this.canvas, this.layer1, this.layer2, waterheight);
		},
		blur(event) {
			event.target.blur();
		},
		onkey(event) {
			let key = event.key;

			if ((this.name == "" && key.match(/[a-zA-Z]/g)) || (this.name != "" && key.match(/^[\w\-. ]+$/g))) {
				return true;
			}
			event.preventDefault();
		}
	},
	data() {
		return {
			render: false,
			err: null,

			//Settings
			Scales: [1, 2, 4, 8, 16, 32],
			minheight: TERRAIN_MIN_HEIGHT,
			maxheight: TERRAIN_MAX_HEIGHT,
			selectedScale: 4,
			name: "",
			author: "",
			profile: "",
			//Canvas
			canvas: null,
			layer1: null,
			layer2: null,

			//file
			fileimported: false,
			rawImageData: null
		};
	}
};

function updateWaterLevel(canvas, layer1, layer2, waterHeight) {
	let imageData = layer1.getImageData(0, 0, canvas.width, canvas.height);
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
	layer2.putImageData(imageData, 0, 0);
}

function openFileDialog(callback) {
	let element = document.createElement("input");
	element.setAttribute("type", "file");
	setTimeout(function() {
		element.click();
	}, 0);
	element.onchange = event => {
		callback(element.files[0]);
	};
}

function createMapPreview(self, file) {
	let reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = function(event) {
		if (event.target.readyState == FileReader.DONE) {
			let img = new Image();
			img.src = event.target.result;
			img.onload = () => {
				self.layer1.drawImage(img, 0, 0, self.canvas.width, self.canvas.height);
				updateWaterLevel(self.canvas, self.layer1, self.layer2, 25);
			};
		}
	};
}

function checkImageType(self, file) {
	let binaryReader = new FileReader();
	binaryReader.readAsArrayBuffer(file);
	binaryReader.onload = function() {
		self.rawImageData = new Uint8Array(this.result);
		let header = PNG160.getImageHeader(self.rawImageData);
		if (header.bitdepth == 16 && header.colortype == 0) {
			if (header.width != header.height) {
				self.err = "Not square";
				self.fileimported = false;
			} else if ((header.width - 1) % 1024 != 0) {
				self.err = "Not a multiple of 1024(+1)";
				self.fileimported = false;
			} else {
				self.fileimported = true;
				self.err = null;
			}
		} else {
			self.err = "Not 16bit / grayscale";
			self.fileimported = false;
		}
		Progressbar.stop();
	};
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

.err {
	width: calc(100% - 27px);

	font-size: 0.8em;
	color: rgb(255, 223, 223);
	border: rgb(90, 12, 12) 1px solid;
	background-color: rgb(136, 62, 62);
	border-radius: 5px;
	margin: 5px;
	padding-left: 15px;
	padding-top: 2px;
	padding-bottom: 2px;
	box-shadow: 0 1px 5px 0px black;

	& .icon {
		background-color: currentcolor;
	}
}
</style>
