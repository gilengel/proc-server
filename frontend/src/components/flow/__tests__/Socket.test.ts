import 'regenerator-runtime/runtime'
import { mountFactory } from '@quasar/quasar-app-extension-testing-unit-jest';
import Socket from '../Socket.vue'

import { Socket as ReteSocket } from 'rete'

const factory = mountFactory(Socket, {
  // mount: { type: 'full' } <= uncomment this line to use `mount`; `shallowMount` is used by default as it will stub all **registered** components found into the template
  quasar: { components: { } },
  propsData: {
    socket: new ReteSocket("socket"),
    used: true,
    type: 'string'
  },
});

describe('Socket', () => {
  // DUMMY test, you should remove this and add your own tests
  test('mounts with valid properties', () => {
    //const wrapper = factory(); // <= when no props are needed
    const wrapper = factory();
    expect(wrapper).toBeTruthy();
  });

});
