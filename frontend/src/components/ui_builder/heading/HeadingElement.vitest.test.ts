import { loadAllModules } from '../elementLoader';
await loadAllModules();

import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { installPinia } from 'app/test/vitest/setupPinia';
import HeadingElement from './HeadingElement.vue';

import { Element, ElementAttributeType, ElementType } from 'src/models/Grid';
import { ref } from 'vue';
import { IBaseElementProps } from '../BaseElement';
import { createDefaultAttributes } from '.';

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

describe('HeadingElement', () => {
  beforeAll(() => {
    installQuasarPlugin();
    installPinia({ stubActions: false, createSpy: vi.fn });
  });

  it('should mount correctly', async () => {
    const model: Element<ElementType, ElementAttributeType> = new Element(
      ElementType.Text,
      [],
    );
    createDefaultAttributes(model);

    const props: IBaseElementProps<ElementType, ElementAttributeType> = {
      uuid: '',
      editable: false,
      model,
    };

    const wrapper = mount(HeadingElement<ElementType, ElementAttributeType>, {
      props,
    });
    const element = wrapper.find('[data-testid="heading-element"]');

    expect(element.exists()).toBe(true);
  });
});
