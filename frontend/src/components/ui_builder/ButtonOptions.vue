<template>
  <div class="column option-column">
    <h1 class="text-subtitle1">Button</h1>

    <Option label="Label">
    <q-input dark placeholder="Label" v-model="labelInput" />
    </Option>

    <Option label="Type">
        <q-option-group
          dark
          color="primary"
          :options="buttonOptions"
          label="Notifications"
          type="radio"
          v-model="typeInput"
        />
    </Option>

    <Option label="Highlighted">
      <q-toggle v-model="isHighlightedInput" color="primary" label="Highlighed?" />
    </Option>

    <Option label="With Icon?">
      <q-toggle v-model="hasIconInput" color="primary" label="With Icon?" />
    </Option>

    <Option label="Icon">
        <IconList v-for="group in groupedIcons" v-if="groupedIcons" :group="group" @setIcon="updateIcon" />
    </Option>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import ButtonElement from "./ButtonElement.vue";
import IconList from "./IconList.vue";
import Option from "./Option.vue";

export interface Button {
  identifier: string;
  hasIcon: boolean;
  isHighlighted: boolean;
  label: string;
  icon: string;
}

@Component({
  name: "ButtonOptions",

  components: {
    IconList,
    Option,
  },
})
export default class ButtonOptions extends ButtonElement {
  buttonOptions : Array<{ label: string, value: string }> = [];

  groupedIcons : Array<{ label: string, icons: Array<string> }>= [];

  mounted() {
    this.buttonOptions.push({ label: "Link", value: "a" });
    this.buttonOptions.push({ label: "Button", value: "button" });
    this.buttonOptions.push({ label: "Submit", value: "submit" });
    this.buttonOptions.push({ label: "Reset", value: "reset" });

    this.groupedIcons.push({
      label: "Automotive",
      icons: [
        "las la-car",
        "las la-car-side",
        "las la-truck",
        "las la-ambulance",
        "las la-charging-station",
        "las la-gas-pump",
        "las la-shuttle-van",
        "las la-bus",
        "las la-car-battery",
        "las la-tachometer-alt",
        "las la-truck-pickup",
        "las la-car-crash",
        "las la-motorcycle",
        "las la-taxi",
      ],
    });

    this.groupedIcons.push({
      label: "Chat",
      icons: [
        "las la-comment-alt",
        "las la-comments",
        "las la-comment-dots",
        "las la-phone-alt",
        "las la-phone-slash",
        "las la-quote-left",
        "las la-quote-right",
        "las la-video",
        "las la-video-slash",
      ],
    });

    this.groupedIcons.push({
      label: "Code",
      icons: [
        "las la-archive",
        "las la-code",
        "las la-microchip",
        "las la-barcode",
        "las la-code-branch",
        "las la-project-diagram",
        "las la-qrcode",
        "las la-terminal",
        "las la-bug",
        "las la-laptop-code",
      ],
    });
  }

  set typeInput(value: string) {
    this.setValueOfAttribute("type", value);
  }

  get typeInput() {
    return this.getValueOfAttribute("type");
  }

  set identifierInput(value: string) {
    this.setValueOfAttribute("identifier", value);
  }

  get identifierInput() {
    return this.getValueOfAttribute("identifier");
  }

  set hasIconInput(value: boolean) {
    this.setValueOfAttribute("hasIcon", value);
  }

  get hasIconInput() {
    return this.getValueOfAttribute("hasIcon");
  }

  set isHighlightedInput(value: boolean) {
    this.setValueOfAttribute("isHighlighted", value);
  }

  get isHighlightedInput() {
    return this.getValueOfAttribute("isHighlighted");
  }

  set labelInput(value: string) {
    this.setValueOfAttribute("label", value);
  }

  get labelInput() {
    return this.getValueOfAttribute("label");
  }

  updateIcon(icon: string) {
    this.setValueOfAttribute("icon", icon);
  }

  get iconInput() {
    return this.getValueOfAttribute("icon");
  }
}
</script>

<style lang="scss" scoped>
.option-column {
  padding-left: 1em;
  padding-right: 1em;
  color: white;

  .preview {
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 1em;
  }
}
.q-icon {
  font-size: 3em;
  margin: 0.3rem;
}


</style>
