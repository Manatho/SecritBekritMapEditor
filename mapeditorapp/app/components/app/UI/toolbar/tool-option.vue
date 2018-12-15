<template>
    <div class="toolbar-number-container">
        <label>{{option.name.charAt(0).toUpperCase() + option.name.slice(1).replace("_", " ") }}:</label>
        <input
            v-if="option.type === 'NUMBER'"
            ref="input"
            type="number"
            :value="option.value"
            @keyup.enter="onEnter"
            @mousedown.left="onLeft"
            @mouseup.left="onLeftUp"
            @mousemove="onMove"
            @blur="onBlur"
        >
        <input
            v-else
            ref="input"
            type="text"
            :value="option.value"
            @keyup.enter="onEnter"
            @blur="onBlur"
        >
    </div>
</template>

<script>
import { Controller } from "../../../logic/controller";
import Vue from "vue";

let mouseEvent;
export default {
    props: {
        option: { type: Object }
    },
    mounted() {
        this.input = this.$refs.input;
        
    },
    data() {
        return {
            minimum: undefined
        };
    },
    methods: {
        onEnter(event) {
            this.input.blur();
        },
        onLeft(event) {
            this.input.setPointerCapture(1);
            mouseEvent = event;
            mouseEvent.strength = this.input.value;
        },
        onMove(event) {
            if (event.buttons == 1) {
                let difference = ((mouseEvent.y - event.y) / 10);
                difference = Math.round(difference/this.option.increment)*this.option.increment;
                this.input.value = (new Number(mouseEvent.strength) + difference).toFixed(1);
            }
        },
        onBlur(event) {
            this.option.value = this.input.value;
            this.$forceUpdate();
        },
        onLeftUp(event) {
            if (this.input.value != mouseEvent.strength) {
                this.input.blur();
            }
        }
    }
};
</script>

<style lang="scss" scoped>
@import "./../../../../style/variables.scss";
.toolbar-number-container {
    font-family: $font;
    //font-weight: bold;
    font-size: 13px;
}

.toolbar-number-container > input {
    font-family: $font;
    font-size: 13px;
    margin: auto;
    width: 55px;
    text-align: center;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    border: 1px solid rgb(59, 59, 59);
    background-color: $element-backgroundlight;
}

.toolbar-number-container > input:focus {
    outline: none;
    border: 1px solid rgb(255, 255, 222);
}

input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
</style>



