<template>
    <div v-show="show" class="modal-content content">
        <input
            class="textinput"
            v-model="name"
            name="townName"
            placeholder="Name"
            @keyup.enter="blur"
            @keypress="onkey"
            @blur="onblur"
        >
        <div class="setting">
            <div style="display:flex">
                <div>
                    <label>Size Factor:</label>
                    <input
                        type="number"
                        name="importmin"
                        class="number-input input"
                        v-model="sizeFactor"
                        @keyup.enter="blur"
                        @blur="onblur"
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Controller } from "../../logic/controller.js";
import { ControllerEvents } from "../../logic/controller.js";
import { TOWN_SIZE_FACTOR_MIN, TOWN_SIZE_FACTOR_MAX } from "../../logic/constants.js";
export default {
    methods: {
        blur(event) {
            event.target.blur();
        },
        onkey(event) {
            let key = event.key;

            if (
                (this.name == "" && key.match(/[a-zA-Z]/g)) ||
                (this.name != "" && key.match(/^[\w\-. ]+$/g))
            ) {
                return true;
            }
            event.preventDefault();
        },
        onblur(event) {
            this.town.name = this.name;
            this.town.sizeFactor = this.sizeFactor;
            this.sizeFactor = this.town.sizeFactor;
        }
    },
    mounted() {
        Controller.subscribe(
            ControllerEvents.Event_Terrain_Object_Selected,
            object => {
                this.town = object;
                if(object){
                    this.name = object.name;
                    this.sizeFactor = object.sizeFactor;
                    this.show = true;
                } else {
                    this.show = false;
                }
            }
        );
    },
    data() {
        return {
            name: "",
            sizeFactor: 0,
            show: false
        };
    }
};
</script>

<style lang="scss" scoped >
@import "../../../style/variables.scss";
@import "../common styles/modal.scss";

.content {
    position: fixed;
    left: 100px;
    top: 100px;
}

label {
    font-size: 0.8em;
    font-weight: bold;
}

.input {
    width: 60%;
}
</style>
