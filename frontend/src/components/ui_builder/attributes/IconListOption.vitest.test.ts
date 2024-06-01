import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { installPinia } from 'app/test/vitest/setupPinia';
import IconListOption from './IconListOption.vue';

import { Element, ElementAttributeType, ElementType } from 'src/models/Grid';
import { IOptionProps } from '.';

describe('IconListOption', () => {
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

    const wrapper = mount(IconListOption, { props });
    const element = wrapper.find('[data-testid="icon-list"]');

    expect(element.exists()).toBe(true);
  });
});
