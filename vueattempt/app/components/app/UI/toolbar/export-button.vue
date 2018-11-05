<template>
    	<div class="toolbar-button" @click="exportMap">
            <img draggable="false" class="toolbar-icon" src="./images/export.png">
        </div>
</template>

<script>
export default {
	methods: {
		exportMap: event => {
			let multiplier = 1;
			let sigma = 1.5;
			let max = 390;
			let min = -1110;

			console.log(event);

			Progressbar.start();
			Progressbar.visible = false;
			Progressbar.message = "Getting data";

			/*setTimeout(function() {
				let heightmap = terrain.getHeightValues();

				heightmap = mapMultiplier(heightmap, terrain.mapSize, multiplier);

				//  var myworker = new Worker('./scripts/webworker.js');
				var myworker = new Worker(URL.createObjectURL(new Blob(["(" + worker_function.toString() + ")()"], { type: "text/javascript" })));
				Progressbar.message = "Setting up data";
				myworker.postMessage([heightmap, terrain.mapSize * multiplier]);

				myworker.onmessage = function(e) {
					//console.log(e);

					switch (e.data[0]) {
						case "Start":
							Progressbar.visible = true;
							Progressbar.message = e.data[1];
							break;
						case "Progress":
							Progressbar.message = e.data[1] + ": " + e.data[2] + "%";
							Progressbar.progress = e.data[2];
							break;
						case "Finished":
							Progressbar.message = e.data[1];
							Progressbar.progress = 100;
							break;
						case "Data":
							document.getElementById("png").src = makepngfile(e.data[1]);
							Progressbar.stop();
							break;
					}
				};
			}, 5);*/
		}
	}
};
</script>

<style lang="scss" scoped>
@import url("./style/toolbar.scss");
</style>
