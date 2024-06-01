import { mount } from '@vue/test-utils';
import { Router, createRouter, createWebHistory } from 'vue-router';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import routes from 'src/router/routes';

import App from 'src/App.vue';
import { installPinia } from 'app/test/vitest/setupPinia';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';

vi.mock('src/components/flow/editor.ts', () => {
  return {
    createEditor: vi.fn(),
  };
});

let router: Router | undefined = undefined;
describe('Router', () => {
  beforeEach(() => {
    installPinia({ stubActions: false, createSpy: vi.fn });
    installQuasarPlugin();

    router = createRouter({
      history: createWebHistory(),
      routes: routes,
    });
  });
  it('should display the default page', async () => {
    router!.push('/');
    await router!.isReady();

    const wrapper = mount(App, {
      global: {
        plugins: [router!],
      },
    });

    const element = wrapper.find('[data-testid="layout-main"]');
    expect(element.exists()).toBe(true);
  });

  it('should display the 404 error page for an invalid url', async () => {
    router!.push('/INVALID_URL');

    await router!.isReady();

    const wrapper = mount(App, {
      global: {
        plugins: [router!],
      },
    });

    const element = wrapper.find('[data-testid="page-404"]');
    expect(element.exists()).toBe(true);
  });
});
