import { mountFactory, qLayoutInjections } from '@quasar/quasar-app-extension-testing-unit-jest';
import Error404 from '../Error404.vue'
import { } from 'quasar';
import { } from 'src/router'

const factory = mountFactory(Error404, {
  // mount: { type: 'full' } <= uncomment this line to use `mount`; `shallowMount` is used by default as it will stub all **registered** components found into the template
  quasar: { components: {} },
  mount: {
    provide: qLayoutInjections(),
  }
});

describe('Error404', () => {
  // DUMMY test, you should remove this and add your own tests
  test('mounts with valid properties', () => {
    //const wrapper = factory(); // <= when no props are needed
    const wrapper = factory();
    expect(wrapper).toBeTruthy();
  });

});
