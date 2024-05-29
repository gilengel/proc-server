import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import FlowSocket, { ISocketProps } from './FlowSocket.vue';

describe('FlowSocket', () => {
  it('should mount correctly', async () => {
    const props: ISocketProps = {
      data: {
        name: '',
      },
    };

    const wrapper = mount(FlowSocket, { props });
    const element = wrapper.find('[data-testid="flow-socket"]');

    expect(element.exists()).toBe(true);
  });
});
