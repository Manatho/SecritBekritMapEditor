import Vue from "vue";
import "./style/site.scss";
import Modal from "./components/app/progressbar-plugin";

Vue.use(Modal);
new Vue({
	el: "#app",
	render: h => h(require("./components/app/main.vue").default)
});
