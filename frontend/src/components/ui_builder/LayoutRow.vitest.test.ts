import { loadAllModules } from './elementLoader';
await loadAllModules();

import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { installPinia } from 'app/test/vitest/setupPinia';
import LayoutRow from './LayoutRow.vue';

import { ElementAttributeType, ElementType, Row } from 'src/models/Grid';
import { ref } from 'vue';
import { useGridModuleStore } from 'src/stores/gridModule';
import { fireEvent } from '@testing-library/dom';

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

describe('LayoutRow', () => {
  beforeAll(() => {
    installQuasarPlugin();
    installPinia({ stubActions: false, createSpy: vi.fn });
  });

  it('should mount correctly', async () => {
    const row: Row<ElementType, ElementAttributeType> = {
      id: '',
      columns: [
        {
          id: '',
          width: 6,
        },
        {
          id: '',
          width: 6,
        },
      ],
    };

    const props = {
      minColSize: 2,
      maxColSize: 11,
      rowIndex: 0,
      model: row,
    };

    const wrapper = mount(LayoutRow, { props });
    const element = wrapper.find('[data-testid="layout-row"]');

    expect(element.exists()).toBe(true);
  });

  it('should call the grid store to delete a row if clicked on the row delete button', async () => {
    const row: Row<ElementType, ElementAttributeType> = {
      id: '',
      columns: [
        {
          id: '',
          width: 6,
        },
        {
          id: '',
          width: 6,
        },
      ],
    };

    const props = {
      minColSize: 2,
      maxColSize: 11,
      rowIndex: 0,
      model: row,
    };

    const gridModuleStore = useGridModuleStore();

    const wrapper = mount(LayoutRow, { props });
    const element = wrapper.find('[data-testid="delete-row-button"]');
    element.trigger('click');
    await wrapper.vm.$nextTick(); // We need to wait so that the aria field is properly updated

    expect(gridModuleStore.deleteRow).toHaveBeenCalledOnce();
  });

  it('should update the column width on mouse drag', async () => {
    const row: Row<ElementType, ElementAttributeType> = {
      id: '',
      columns: [
        {
          id: '',
          width: 6,
        },
        {
          id: '',
          width: 6,
        },
      ],
    };

    const props = {
      minColSize: 2,
      maxColSize: 6,
      rowIndex: 0,
      model: row,
    };

    // We need to mock the getBoundingClientRect as both happy-dom or jsdom will return objects where all
    // values are 0 and therefore it wouldn't be possible to test the splitter move logic
    window.HTMLElement.prototype.getBoundingClientRect = () =>
      ({
        bottom: 0,
        height: 400,
        left: 0,
        right: 0,
        top: 0,
        width: 800,
      }) as DOMRect;

    const wrapper = mount(LayoutRow, { props });
    const splitter = wrapper.find('[data-testid="row-splitter"]');

    splitter.trigger('mousedown');

    await wrapper.vm.$nextTick(); // We need to wait so that the aria field is properly updated

    // TODO: move the two following lines into seperate test cases as they really test different cases
    fireEvent.mouseMove(document, { clientX: 50, clientY: 50 });
    fireEvent.mouseMove(document, { clientX: 800, clientY: 50 });

    fireEvent.mouseUp(document);
  });
});
