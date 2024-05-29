import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import FlowEditor, { FlowEditorProps } from './FlowEditor.vue';
import { Element, ElementAttributeType, ElementType } from 'src/models/Grid';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';

installQuasarPlugin();

function mockCreateEditor() {
  return {
    editor: {
      addPipe: () => {},
    },
  };
}
vi.mock('./editor.ts', () => {
  return {
    createEditor: vi.fn().mockImplementation(mockCreateEditor),
  };
});

describe('FlowEditor', () => {
  it('should mount correctly', async () => {
    const props: FlowEditorProps<
      Element<ElementType, ElementAttributeType>,
      ElementType,
      ElementAttributeType
    > = {
      elements: [],
      categories: [],
      grid: {
        enabled: true,
        size: 20,
      },
    };

    const wrapper = mount(FlowEditor, { props });
    const element = wrapper.find('[data-testid="flow-editor"]');

    expect(element.exists()).toBe(true);
  });
});
