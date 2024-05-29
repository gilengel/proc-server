import { loadAllModules } from '../ui_builder/elementLoader';
await loadAllModules();

import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import FlowNode, { FlowNodeProps } from './FlowNode.vue';
import { ElementAttributeType, ElementType, Element } from 'src/models/Grid';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';

installQuasarPlugin();

describe('FlowNode', () => {
  it('should mount correctly', async () => {
    const props: FlowNodeProps<ElementType, ElementAttributeType> = {
      data: new Element(ElementType.Button, []),
      emit: () => {},
      seed: 0,
    };

    const wrapper = mount(FlowNode, { props });
    const element = wrapper.find('[data-testid="flow-node"]');

    expect(element.exists()).toBe(true);
  });
});
