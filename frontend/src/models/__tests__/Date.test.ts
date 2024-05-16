import { CreateNowTimestamp, CreateDateTimestamp } from '../Date'

import { expect, jest, test, describe, beforeAll, afterAll } from '@jest/globals';

describe('Date', () => {

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2021, 5, 11));
  });

  test('CreateNowTimestamp works', () => {
    const ts = CreateNowTimestamp()
    expect(ts).toBe("2021-06-10T22:00:00.000")
  });


  afterAll(() => {
    jest.useRealTimers();
  });
});
