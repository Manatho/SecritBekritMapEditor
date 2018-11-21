<template>
	<div v-show="render" class="modal">
		<div class="modal-content">
			<div class="settings">
				<div class="setting">
					<h4>Size</h4>
					<label class="container" v-for="size in Sizes">
  						<input type="radio" name="size" class="radioinput" v-model="selectedSize" v-bind:value="size">
						  <span class="radio"></span>
  						<span class="radiotext">{{size}}</span>
					</label>
				</div>
				<div class="setting">
					<div style="display:flex">
						<h4>Scaling</h4>
						<div class="info">
							<span class="icon"></span>
							<span class="tooltip"
								>Terrain to pixel ratio: <br />
								Trades precision for performance <br/>
								(4 is a good starting point)
							</span>
						</div>
					</div>
					<label class="container" v-for="scale in Scales">
  						<input type="radio" name="scale" class="radioinput" v-model="selectedScale" v-bind:value="scale">
						<span class="radio"></span>
  						<span class="radiotext">{{scale}}</span>
					</label>
				</div>
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
			selectedScale: 4,
			selectedSize: 1024,
			render: false
		};
	}
};
</script>

<style lang="scss" scoped>
@import "./../../style/variables.scss";
@import "./common styles/modal.scss";
</style>
