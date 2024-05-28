import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import { installPinia } from 'app/test/vitest/setupPinia';
import ToggleOption from './ToggleOption.vue';

import { Element, ElementAttributeType, ElementType } from 'src/models/Grid';
import { IOptionProps } from '.';
import { ref } from 'vue';

installQuasarPlugin();
installPinia({ stubActions: false, createSpy: vi.fn });

// We mock here the overall logic how it would be handled by the grid since this is
// a unit test and mocking the complete behaviour is not necessary for the test to work.
vi.mock('src/composables/useChangeableComputedAttributeModel.ts', async () => {
  return {
    useChangeableComputedAttributeModel: () => {
      const value = ref(false);

      return value;
    },
  };
});

describe('ToggleOption', () => {
  it('should mount correctly', async () => {
    const model: Element<ElementType, ElementAttributeType> = new Element(
      ElementType.Text,
      [],
    );

    const props: IOptionProps<ElementType, ElementAttributeType> = {
      model,
      attributeKey: '',
      label: '',
    };

    const wrapper = mount(ToggleOption, { props });
    const element = wrapper.find('[data-testid="toggle-option"]');

    expect(element.exists()).toBe(true);
  });

  it('should toggle the model on click', async () => {
    const model: Element<ElementType, ElementAttributeType> = new Element(
      ElementType.Text,
      [],
    );

    const props: IOptionProps<ElementType, ElementAttributeType> = {
      model,
      attributeKey: '',
      label: '',
    };

    const wrapper = mount(ToggleOption, { props });

    const element = wrapper.find('[data-testid="toggle-model"]');

    // We use the aria-checked attribute as a workaround as we don't have access to
    // the private model variable of the toggle option
    expect(element.attributes()['aria-checked']).toBe('false');
    element.trigger('click');
    await wrapper.vm.$nextTick(); // We need to wait so that the aria field is properly updated
    expect(element.attributes()['aria-checked']).toBe('true');

    expect(element.exists()).toBe(true);
  });
});
