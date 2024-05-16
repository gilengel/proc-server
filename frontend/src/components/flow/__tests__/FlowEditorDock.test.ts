import { mountFactory } from '@quasar/quasar-app-extension-testing-unit-jest';
import FlowEditorDock from '../FlowEditorDock.vue'
import { QToolbar, QToolbarTitle, QList, QItem, QItemLabel, QItemSection, QIcon } from 'quasar';
import { } from 'src/router'

const factory = mountFactory(FlowEditorDock, {
  // mount: { type: 'full' } <= uncomment this line to use `mount`; `shallowMount` is used by default as it will stub all **registered** components found into the template
    quasar: { components: { QToolbar, QToolbarTitle, QList, QItem, QItemLabel, QItemSection, QIcon } },
    propsData: {
        nodes: [{
            label: 'Basic',
            icon: '',

            components: [
                {
                    id: 'input',
                    label: 'Input',
                    icon: 'las la-download',
                    component: undefined,
                    defaultData: {}
                },
            ]
        }]
    }
});

describe('FlowEditorDock', () => {
  // DUMMY test, you should remove this and add your own tests
  test('mounts with valid properties', () => {
    //const wrapper = factory(); // <= when no props are needed
    const wrapper = factory();
    expect(wrapper).toBeTruthy();
  });

});
