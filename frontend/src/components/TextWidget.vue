<template>
  <Widget
    title="Text"
    @remove-widget="removeWidget"
    :resizable="resizable"
    :draggable="draggable"
    :deletable="deletable"
  >
    <div class="editor">
      <editor-menu-bubble
        :editor="editor"
        v-slot="{ commands, isActive, menu }"
      >
        <div
          class="menububble shadow-3 rounded-borders"
          :class="{ 'is-active': menu.isActive }"
          :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
        >
          <button
            class="menububble__button"
            :class="{ 'is-active': isActive.bold() }"
            @click="commands.bold"
          >
            <q-icon name="las la-marker" />
          </button>

          <button
            class="menububble__button"
            :class="{ 'is-active': isActive.strike() }"
            @click="commands.strike"
          >
            <q-icon name="las la-eraser" />
          </button>

          <button
            class="menububble__button"
            :class="{ 'is-active': isActive.bold() }"
            @click="commands.bold"
          >
            <q-icon name="las la-comments" />
          </button>
        </div>
      </editor-menu-bubble>

      <editor-content class="editor__content" :editor="editor" />
    </div>
  </Widget>
</template>

<script lang="ts">
/* eslint @typescript-eslint/no-unsafe-call: off */

import Widget from "./Widget.vue";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import {
  Editor,
  EditorContent,
  EditorMenuBubble,
  EditorUpdateEvent,
} from "tiptap";
import { Bold, Strike } from "tiptap-extensions";
import { Getter, Action } from "vuex-class";

import IModel from "../store/Model";

@Component({
  name: "TextWidget",

  components: {
    Widget,
    EditorContent,
    EditorMenuBubble,
  },
})
export default class TextWidget extends Widget {
  get model() {
    return this.getModel(this.uuid);
  }

  @Prop({ default: "uuid" }) uuid!: string;

  @Getter("model")
  getModel!: (uuid: string) => Map<string, unknown>;

  @Action("updateModel")
  updateModel!: (params: IModel) => void;

  @Watch("model.text")
  onModelChanged(val: string) {
    this.editor?.setContent(`${val}`);
  }

  onEditorContentChange(event: EditorUpdateEvent) {
    this.updateModel({
      uuid: this.uuid,
      model: {
        text: event.getHTML(),
      },
    });
  }

  editor: Editor | undefined;

  created() {
    this.editor = new Editor({
      content: `<p>${this.model}</p>`,
      extensions: [new Bold(), new Strike()],
      onUpdate: this.onEditorContentChange,
    });
  }

  beforeDestroy() {
    this.editor?.destroy();
  }
}
</script>

<style lang="scss">
.editor {
  margin: 1em;
}
p {
  color: white;
}

strong {
  color: $primary;
  font-weight: none;
}

s {
  color: $warning;
}

.menububble {
  position: absolute;
  display: flex;
  z-index: 20;
  border-radius: 5px;
  padding: 0.3rem;
  margin-bottom: 0.5rem;
  transform: translateX(-50%);
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s, visibility 0.2s;

  &.is-active {
    opacity: 1;
    visibility: visible;
  }

  > button {
    display: inline-flex;
    background: transparent;
    border: 0;
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
    cursor: pointer;
    font-size: 24px;

    &:hover {
      color: rgba(white, 0.1);
    }

    &.is-active {
      color: $primary;
    }
  }

  &__form {
    display: flex;
    align-items: center;
  }

  &__input {
    font: inherit;
    border: none;
    background: transparent;
    color: white;
  }
}

$indicator: 16px;
.menububble::after {
  content: "";
  width: $indicator;
  height: $indicator;
  left: 50%;
  bottom: -$indicator / 2;
  position: absolute;
  transform: translate(-$indicator / 2, 0em) rotate(45deg);
}
</style>
