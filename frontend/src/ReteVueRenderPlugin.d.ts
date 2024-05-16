//import Mixin from '//'./components/render/Mixin'
import Vue from 'vue'
import { NodeEditor } from 'rete'
/* eslint-disable no-inner-declarations */
declare module 'rete-vue-render-plugin-ts' {

    export interface mixin{
      props: [],
      methods: unknown,
      directives: unknown
    }

    export function createVue(el: HTMLElement, vueComponent: string, vueProps: Record<string, unknown>, options: Record<string, unknown>): Vue
    export function createNode(editor: NodeEditor, CommonVueComponent: unknown, obj: Record<string, unknown>, options: Record<string, unknown>): Vue
    export function createControl(editor: NodeEditor, obj: unknown, options: Record<string, unknown>): Vue
    export function install(editor: NodeEditor, obj: unknown): void

    export const mixin: unknown //Mixin

    export const name = 'vue-render'
}
