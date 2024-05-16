import { mountFactory } from '@quasar/quasar-app-extension-testing-unit-jest';
import VueRouter from 'vue-router';
import { createLocalVue } from '@vue/test-utils';
import App from '../App.vue'
import { } from 'src/router'

const localVue = createLocalVue();
localVue.use(VueRouter);

const factory = mountFactory(App, {
  quasar: { components: {} },
  mount: {
    localVue,
    router: new VueRouter(),
  },
});

describe('App', () => {
  // DUMMY test, you should remove this and add your own tests
  test('mounts with valid properties', () => {
    //const wrapper = factory(); // <= when no props are needed
    const wrapper = factory();
    expect(wrapper).toBeTruthy();
  });

});
