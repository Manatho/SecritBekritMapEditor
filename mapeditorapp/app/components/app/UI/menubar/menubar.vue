<template>
    <div class="menubar">
        <div class="menubar-deadspace"></div>
		<div class="menubar-items">
			<div class="menu-item">File</div>
		</div>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "./../../../../style/variables.scss";
.menubar {
	// background-color: $element-background;

	// border: solid 1px $element-background-borderlight;

	// box-shadow: $toolbar-width 1px 0 0 $element-background-border;

	// width: $toolbar-width;
	// height: $menubar-height;

	top: 0px;
	left: 0px;
	position: absolute;
	//z-index: 1;
	height: $menubar-height;
}

// .menubar-deadspace {
// 	height: 100%;
// 	width: $toolbar-width + 1;
// 	background-color: $element-background;
// 	float: left;
// }

.menubar-items {
	height: 100%;
	//width: 20px;
	background-color: $element-background;
	float: left;
	border-bottom-right-radius: 5px;

	border: 1px solid $element-background-border;
	border-left: 0;
	border-top: 0;
	padding-right: 10px;
	padding-left: 1px;
}

.menu-item {
	font-family: $font;
	//font-weight: bold;
	font-size: 18px;
	//color: $element-background-border;
	padding-left: 20px;
	padding-right: 20px;
	border-left: 1px solid transparent;
	border-right: 1px solid transparent;

	height: 100%;
	line-height: 170%;
	text-align: center;
	background-color: $element-background;
	float: left;
	user-select: none;

	&:hover {
		background-color: $element-hoverlight;

		border-left-color: $element-background-borderlight;
		border-right-color: $element-background-borderlight;
	}
}
</style>

