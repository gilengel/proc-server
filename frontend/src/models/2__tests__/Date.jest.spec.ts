/*
import { CreateNowTimestamp } from '../Date'

import { expect, jest, test, describe, beforeAll, afterAll } from '@jest/globals';

TODO: Faking the time does not works due to a dependency issue. Unfortunatly this is not fixable
and we need to wait for a future release of the testing plugin.
describe('Date', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2021, 5, 11));
  });

  test('CreateNowTimestamp works', () => {
    const ts = CreateNowTimestamp()
    expect(ts).toBe('2021-06-10T22:00:00.000')
  });


  afterAll(() => {
    jest.useRealTimers();
  });
});
*/