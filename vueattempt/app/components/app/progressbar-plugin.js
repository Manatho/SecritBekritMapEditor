import AppModal from "./progressbar.vue";

const Modal = {
	install(Vue, options) {
		this.EventBus = new Vue();
		Vue.component("app-modal", AppModal);
		Vue.prototype.$modal = {
			start() {
				Modal.EventBus.$emit("start");
			},
			stop() {
				Modal.EventBus.$emit("stop");
			},
			setProgress(progress) {
				Modal.EventBus.$emit("progress", progress);
			},
			setMessage(message){
				Modal.EventBus.$emit("message", message)
			}
		};
	}
};

export default Modal;
