import { loadAllModules } from '../ui_builder/elementLoader';
await loadAllModules();

import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import FlowDock, { FlowDockProps } from './FlowDock.vue';
import { ElementAttributeType, ElementType, Element } from 'src/models/Grid';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';

installQuasarPlugin();

describe('FlowDock', () => {
  it('should mount correctly', async () => {
    const props: FlowDockProps<ElementType, ElementAttributeType> = {
      title: 'Test Dock',
      nodes: [
        {
          label: 'Basic',
          icon: '',

          elements: [
            {
              label: 'Element Label',
              icon: 'icon',
              type: ElementType.Button,
              create: () => {
                return new Element(ElementType.Button, []);
              },
            },
          ],
        },
      ],
    };

    const wrapper = mount(FlowDock, { props });
    const element = wrapper.find('[data-testid="flow-dock"]');

    expect(element.exists()).toBe(true);
  });
});
