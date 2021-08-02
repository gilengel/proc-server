/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { describe, expect, it } from '@jest/globals';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { mount } from '@vue/test-utils';
import PageList from '../Pagelist.vue';

import { jest, beforeEach } from '@jest/globals';
import { createStore, Store } from 'vuex';

// Specify here Quasar config you'll need to test your component
installQuasarPlugin();

describe('PageList', () => {
  describe('Empty', () => {
    let emptyStore: Store<unknown>;

    beforeEach(() => {
      // hide vue warning about the store
      console.warn = jest.fn()

      emptyStore = createStore({
        getters: {
          'Page/persistedPages': jest.fn(() => []),
        },

        actions: {
          'Page/storeNewPage': jest.fn()
        }
      });
    });

    /*
    it('shows message to create new page if non exist', () => {
      const wrapper = mount(PageList, {
        global: {
          plugins: [emptyStore],
        },
      });

      expect(wrapper.find('h2').text()).toBe(
        "You don't have any pages yet. You can start by creating a new page right here."
      );
    });
    */

    it('shows dialog to create a new page', async () => {
      const wrapper = mount(PageList, {
        global: {
          plugins: [emptyStore],
        },
      });

      expect(wrapper.vm.isNewPageDialogVisisble).toBeFalsy();

      const newPageLink = wrapper.find('button');
      await newPageLink.trigger('click');

      expect(wrapper.vm.isNewPageDialogVisisble).toBeTruthy();
    });

    it('calls "create page" backend function after click on "Create Page"', async () => {
      const wrapper = mount(PageList, {
        global: {
          plugins: [emptyStore],
        },
      });

      const newPageLink = wrapper.find('button');
      await newPageLink.trigger('click');

      expect(wrapper.vm.isNewPageDialogVisisble).toBeTruthy();

      const createNewPageBtn = wrapper.find('#btn__create_page');
      await createNewPageBtn.trigger('click');

      expect(wrapper.vm.isNewPageDialogVisisble).toBeFalsy();
    });  
  });

  /*
  it('calls the store getter to retrieve all available pages', () => {
    const store = createStore({
      //dispatch: jest.fn(),
      getters: {
        'Page/persistedPages': jest.fn(() => [
          {
            page_id: '6ad60ccb-0ad7-4257-9ebe-919965e91ec7',
            name: 'test page',
            created_at: '2021-07-30',
          },
        ]),
      },
    });

    const wrapper = mount(PageList, {
      global: {
        plugins: [store],
      },
    });

    console.log(wrapper.text());
    expect(wrapper.text()).toBe('Page Listtest page');
  });
  */
});
