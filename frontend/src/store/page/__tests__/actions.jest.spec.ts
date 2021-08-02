import { expect, test, describe, afterEach, jest } from '@jest/globals';
import mockAxios from 'jest-mock-axios';
import actions from '../actions';
import { PageStateInterface } from '../state';

describe('Page', () => {
  test('fetchAllFromBackend calls backend and updates state', () => {
    const catchFn = jest.fn(),
      thenFn = jest.fn();

    const { fetchAllFromBackend } = actions;

    // using the component, which should make a server response
    const clientMessage = 'client is saying hello!';

    fetchAllFromBackend(clientMessage).then(thenFn).catch(catchFn);

    // since `post` method is a spy, we can check if the server request was correct
    // a) the correct method was used (post)
    // b) went to the correct web service URL ('/web-service-url/')
    // c) if the payload was correct ('client is saying hello!')
    expect(mockAxios.post).toHaveBeenCalledWith('/web-service-url/', {
      data: clientMessage,
    });

    // simulating a server response
    let responseObj = { data: 'server says hello!' };
    mockAxios.mockResponse(responseObj);

    // checking the `then` spy has been called and if the
    // response from the server was converted to upper case
    expect(thenFn).toHaveBeenCalledWith('SERVER SAYS HELLO!');

    // catch should not have been called
    expect(catchFn).not.toHaveBeenCalled();
  });

  afterEach(() => {
    // cleaning up the mess left behind the previous test
    mockAxios.reset();
  });
});
