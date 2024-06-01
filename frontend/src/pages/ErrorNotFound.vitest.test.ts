import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import ErrorNotFound from './ErrorNotFound.vue';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';

installQuasarPlugin();

describe('ErrorNotFound', () => {
  it('should mount correctly', async () => {
    const wrapper = mount(ErrorNotFound, {});
    const element = wrapper.find('[data-testid="page-404"]');

    expect(element.exists()).toBe(true);
  });
});
