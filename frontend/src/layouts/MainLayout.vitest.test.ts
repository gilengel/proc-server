import { mount } from '@vue/test-utils';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import MainLayout from './MainLayout.vue';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { installPinia } from 'app/test/vitest/setupPinia';

vi.mock('src/components/flow/editor.ts', () => {
  return {
    createEditor: vi.fn(),
  };
});
describe('MainLayout', () => {
  beforeAll(() => {
    installQuasarPlugin();
    installPinia({ stubActions: false, createSpy: vi.fn });
  });

  it('should mount correctly', async () => {
    const wrapper = mount(MainLayout, {
      global: {
        stubs: {
          WidgetLayout: {
            template: '<span />',
          },
          FlowEditor: {
            template: '<span />',
          },
        },
      },
    });
    const element = wrapper.find('[data-testid="layout-main"]');

    expect(element.exists()).toBe(true);
  });
});
