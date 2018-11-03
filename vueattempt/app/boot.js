import Vue from 'vue';
import './style/site.scss';

new Vue({
  el: '#app',
  render: (h) => h(require('./components/app/main.vue').default)
})