import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { installPinia } from 'app/test/vitest/setupPinia';
import TextOption from './TextOption.vue';

import { Element, ElementAttributeType, ElementType } from 'src/models/Grid';
import { IOptionProps } from '.';
import { ref } from 'vue';

// We mock here the overall logic how it would be handled by the grid since this is
// a unit test and mocking the complete behaviour is not necessary for the test to work.
vi.mock('src/composables/useChangeableComputedAttributeModel.ts', async () => {
  return {
    useChangeableComputedAttributeModel: () => {
      const value = ref('mocked text');

      return value;
    },
  };
});

describe('TextOption', () => {
  beforeAll(() => {
    installQuasarPlugin();
    installPinia({ stubActions: false, createSpy: vi.fn });
  });

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

    const wrapper = mount(TextOption, { props });
    const element = wrapper.find('[data-testid="text-option"]');

    expect(element.exists()).toBe(true);
  });
});
