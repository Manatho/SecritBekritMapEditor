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
        <div v-if="show && this.terrainObject.type == 'TOWN'">
            <div class="setting">
                <div style="display:flex">
                    <div>
                        <label>Size Factor:</label>
                        <input
                            type="number"
                            class="number-input input"
                            v-model="townSizeFactor"
                            @keyup.enter="blur"
                            @blur="onblur"
                        >
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="setting">
                <div style="display:flex">
                    <div>
                        <label>Angle:</label>
                        <input
                            type="number"
                            name="angle"
                            class="number-input input"
                            v-model="industryAngle"
                            @keyup.enter="blur"
                            @blur="onblur"
                        >
                    </div>
                </div>
            </div>
            <div class="setting">
                <div style="display:flex">
                    <div>
                        <label>Type:</label>
                        <select @blur="onblur" @change="blur" v-model="industryType" class="number-input input">
                            <option
                                v-for="choice in choices"
                                :value="choice"
                            >{{choice.charAt(0).toUpperCase() + choice.slice(1).replace(/_/g, " ")}}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Controller } from "../../logic/controller.js";
import { ControllerEvents } from "../../logic/controller.js";
import {
    TOWN_SIZE_FACTOR_MIN,
    TOWN_SIZE_FACTOR_MAX,
    ListIndustries
} from "../../logic/constants.js";
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
            if (this.terrainObject.type == "TOWN") {
                this.terrainObject.name = this.name;
                this.terrainObject.sizeFactor = this.townSizeFactor;
                this.townSizeFactor = this.town.sizeFactor;
            } else {
                this.terrainObject.name = this.name;
                this.terrainObject.angle = this.industryAngle;
                this.industryAngle = this.terrainObject.angle;
                this.terrainObject.industry = this.industryType;
            }
        },
        blur(event) {
            event.target.blur();
        }
    },
    mounted() {
        Controller.subscribe(
            ControllerEvents.Event_Terrain_Object_Selected,
            object => {
                this.terrainObject = object;
                if (object) {
                    this.name = object.name;
                    if(this.terrainObject.type == "TOWN"){
                        this.townSizeFactor = object.sizeFactor;
                    } else {
                        this.industryAngle = object.angle;
                        this.industryType = object.industry;
                        this.$forceUpdate();
                    }
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
            townSizeFactor: 0,
            industryAngle: 0,
            industryType: 0,
            show: false,
            choices: ListIndustries()
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

option{
    border: none;
}

.input {
    color: white;
    width: 60%;
    float: right;
}
</style>
