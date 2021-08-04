import { test, describe, afterEach, expect, jest } from '@jest/globals';
import { StateInterface } from 'src/store';
import { ActionContext } from 'vuex';

import actions from '../actions';
import { PageState } from '../state';

import { ImportMock } from 'ts-mock-imports';

import * as BackendModule from 'src/models/Backend'
import { Page } from 'src/models/Page';


const actionContext: ActionContext<PageState, StateInterface> = {
    dispatch: () => Promise.resolve(),
    commit: () => jest.fn(),
    state: {
        _persistedPages: [],
        _newPages: []
    }, // here goes your auth state mock
    getters: {},
    rootState: {}, // here goes your root state mock
    rootGetters: {}
};

describe('Page', () => {
    test('fetchAllFromBackend', () => {
        ImportMock.mockFunction(BackendModule, 'GetMultiple', new Promise((resolve) => resolve([{}, {}, {}])));

        actions.fetchAllFromBackend(actionContext).then((r) => {
            expect(r.length).toBe(3);
        }).catch(() => null)
    })

    test('fetchAllFromBackend returning error', () => {
        ImportMock.mockFunction(BackendModule, 'GetMultiple', new Promise((resolve, reject) => reject('Too bad :(')));

        actions.fetchAllFromBackend(actionContext)
            .then(() => {
                expect(true).toBe(false);
            }).catch((e: string) => expect(e).toBe('Too bad :('))

    })

    test('updatePage', async () => {
        ImportMock.mockFunction(BackendModule, 'UpdateOne', new Promise<boolean>((resolve) => resolve(true)));

        const result = await actions.updatePage(actionContext, { page_pk: 0, page_id: 'id', name: 'page to be changed', created_at: ''})
        expect(result).toBeTruthy()
    })    

    test('updatePage returning error', async () => {
        ImportMock.mockFunction(BackendModule, 'UpdateOne', new Promise((resolve, reject) => reject('Too bad :(')));

        actions.updatePage(actionContext, { page_pk: 0, page_id: 'id', name: 'page to be changed', created_at: ''})
        .then(() => {
            expect(true).toBe(false);
        }).catch((e: string) => expect(e).toBe('Too bad :('))
    })  
    
    
    test('updateNewPage', () => {
        actions.updateNewPage(actionContext, { page: { page_id: 'id', name: 'page to be changed', created_at: '' }, update: { name: 'new name'}})
    })    

    test('storeNewPage', () => {
        actions.storeNewPage(actionContext, { page_id: 'id', name: 'page to be changed', created_at: '' })
    })    

    test('persistNewPage', async () => {
        ImportMock.mockFunction(BackendModule, 'PostOne', new Promise<Page>((resolve) => resolve({ page_pk: 0, page_id: 'id', name: 'new page', created_at: ''})));

        const result = await actions.persistNewPage(actionContext, { page_id: 'id', name: 'new page', created_at: ''})
        expect(result).toBeTruthy()
    })    

    test('persistNewPage returning error', () => {
        ImportMock.mockFunction(BackendModule, 'PostOne', new Promise((resolve, reject) => reject('Too bad :(')));

        actions.persistNewPage(actionContext, { page_id: 'id', name: 'new page', created_at: ''})
        .then(() => {
            expect(true).toBe(false);
        }).catch((e: string) => expect(e).toBe('Too bad :('))
    })  

    test('deletePageById', async () => {
        ImportMock.mockFunction(BackendModule, 'DeleteOne', new Promise<boolean>((resolve) => resolve(true)));

        const result = await actions.deletePageById(actionContext, 'id')
        expect(result).toBeTruthy()
    })    

    test('deletePageById returning error', () => {
        ImportMock.mockFunction(BackendModule, 'DeleteOne', new Promise((resolve, reject) => reject('Too bad :(')));

        actions.deletePageById(actionContext, 'id')
        .then(() => {
            expect(true).toBe(false);
        }).catch((e: string) => expect(e).toBe('Too bad :('))
    })  

    afterEach(() => {
        ImportMock.restore()
    })

})