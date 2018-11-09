<template>
<div class="menubar">
    <div class="menu-entry" v-for="menuElement in menuElements">
        <button @click ="onclick" @blur="onblur" class="menu-header">{{menuElement.header}}</button>
        <div v-show="show" class="menu-items">
            <a v-for="item in menuElement.items" @click="item.action">{{item.text}}</a>
        </div>
    </div>

</div>
</template>

<script>
export default {
	props: {
		menuElements: { type: Array }
	},
	methods: {
		onclick(event) {
			this.show = !this.show;
		},
		onblur(event) {
			setTimeout(() => (this.show = false), 100);
		}
	},
	data() {
		return {
			show: false
		};
	}
};
</script>

<style lang="scss" scoped>
@import "./../../../../style/variables.scss";

.menubar {
	top: 0px;
	left: 0px;
	position: absolute;
	height: $menubar-height;

	background-color: $element-background;
	border: $element-border;
	border-width: 0 1px 1px 0;
	border-bottom-right-radius: 5px;
	font-family: $font;
	padding-right: 10px;
}

.menu-entry {
	position: relative;
	display: inline-block;
	height: 100%;
}

.menu-header {
	font-family: $font;
	font-size: 16px;
	padding: 0 20px 0 20px;
	display: block;
	text-align: center;
	background-color: $element-background;
	height: 100%;
	border: none;
}

.menu-header:hover,
.menu-header:focus {
	background-color: $element-hoverlight;
	outline: none;
}

.menu-items {
	position: absolute;
	z-index: 1;
	min-width: 160px;

	background-color: $element-backgroundlight;
	box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.8);
}

.menu-items a {
	display: block;
	height: $menubar-height;
	font-size: 13px;
	line-height: 225%;
	color: black;
	text-decoration: none;
	padding: 2px 10px;
	cursor: default;
}

.menu-items a:hover {
	background-color: $element-hoverhuedlight;
}
</style>

