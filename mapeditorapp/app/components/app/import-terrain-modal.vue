<template>
	<div v-show="render" class="modal">
		<div class="modal-content">
			<button @click="uploadTerrain" class="button">Import</button>
			<div style="position: relative; height:200px; width:100px;">
				<canvas ref="canvasImage"></canvas>
				<canvas ref="canvasOverlay"></canvas>
			</div>
			<button @click="createTerrain" class="button">Create</button>
			<button @click="render = false" class="button">Cancel</button>
		</div>
	</div>
</template>


<script>
import { Controller } from "../logic/controller.js";
export default {
	methods: {
		uploadTerrain() {
			let element = document.createElement("input");
			element.setAttribute("type", "file");
			element.click();
			element.onchange = event => {
				let file = element.files[0];
				let canvas = this.$refs.canvasImage;
				let ctx2 = this.$refs.canvasOverlay.getContext("2d");
				let ctx = canvas.getContext("2d");
				let img = new Image();

				if (file.type.match("image.*")) {
					var reader = new FileReader();
					// Read in the image file as a data URL.
					reader.readAsDataURL(file);
					reader.onload = function(evt) {
						if (evt.target.readyState == FileReader.DONE) {
							img.src = evt.target.result;
							img.onload = () => {
								ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
								let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
								for (var i = 0; i < imageData.data.length; i += 4) {
									if (imageData.data[i] < 20 && imageData.data[i + 1] < 20 && imageData.data[i + 2] < 20) {
										//imageData.data[i] = 0;
										imageData.data[i + 1] = 150;
										imageData.data[i + 2] = 255;
										imageData.data[i + 3] = 100;
									}
								}
								// put the altered data back on the canvas
								ctx2.putImageData(imageData, 0, 0);
								//ctx.drawImage(imageData, 0, 0, canvas.width, canvas.height);
							};
						}
					};
				} else {
					alert("not an image");
				}
			};
		},
		createTerrain() {
			this.render = false;
		},
		show() {
			this.render = true;
		}
	},
	data() {
		return {
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

.button {
	text-align: center;
	font-family: $font;
	font-size: 0.9em;
	padding: 1px;
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

canvas {
	position: absolute;
	left: 0;
	top: 0;
	height: 100%;
	widows: 100%;
}
</style>
