import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import FlowConnection, { FlowConnectionProps } from './FlowConnection.vue';

describe('FlowConnection', () => {
  it('should mount correctly', async () => {
    const props: FlowConnectionProps = {
      data: undefined,
      start: undefined,
      end: undefined,
      path: '',
    };

    const wrapper = mount(FlowConnection, { props });
    const element = wrapper.find('[data-testid="flow-connection"]');

    expect(element.exists()).toBe(true);
  });
});
