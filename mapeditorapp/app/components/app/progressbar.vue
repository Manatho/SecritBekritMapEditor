<template>
    <div class="progressbar-modal" v-if="visible">
        <div class="progressbar-modal-content">

            <div class="progressbar-border">
                <div v-show="progressVisible" class="progressbar" v-bind:style="{width: progress + '%'}"></div>
                <div id="message" class="progressbar-message">{{message}}</div>
            </div>
        </div>
    </div>
</template>

<script>
let vue = this;
let ProgressbarController = {
	init(instance) {
		vue = instance;
	},
	start() {
		vue.progress = 0;
		vue.visible = true;
		vue.progressVisible = false;
	},
	stop() {
		vue.visible = false;
	},
	get progress() {
		return vue.progress;
	},
	set progress(progress) {
		vue.progress = progress;
		vue.progressVisible = true;
	},
	set progressVisible(visible) {
		vue.progressVisible = visible;
	},
	get message() {
		return vue.message;
	},
	set message(message) {
		vue.message = message;
	}
};

export default {
	controller: ProgressbarController,
	data() {
		return {
			visible: false,
			progressVisible: false,
			progress: 40,
			message: ""
		};
	},
	mounted() {
		ProgressbarController.init(this);
	}
};
</script>

<style lang="scss" scoped>
.progressbar-modal {
	position: fixed;
	z-index: 1;
	padding-top: 20%;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgb(0, 0, 0);
	background-color: rgba(56, 56, 56, 0.4);
}

.progressbar-modal-content {
	background-color: rgb(153, 147, 143);
	margin: auto;
	padding: 20px;
	border: 1px solid rgb(59, 59, 59);
	width: 25%;
	border-radius: 5px;
}

.progressbar-border {
	position: relative;
	text-align: center;
	background-color: rgb(236, 229, 223);
	margin: auto;
	width: 90%;
	height: 1.1em;
	border-radius: 5px;

	font-size: 0.8em;
	font-family: "Courier New", Courier, monospace;
}

.progressbar {
	position: absolute;
	background-color: #fde5b0;
	border-right: #a7a7a7 3px solid;
	height: 100%;
	width: 0%;
	border-radius: 5px;
}

.progressbar-message {
	position: absolute;
	left: 0px;
	width: 100%;
}
</style>
