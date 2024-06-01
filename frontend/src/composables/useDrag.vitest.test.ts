import { ref } from 'vue';
import { describe, it, expect } from 'vitest';
import { addObjectToDataTransfer, useDrag } from './useDrag';

describe('useDrag', () => {
  it('should add the event listener to the "ondragstart" event of an element', () => {
    const element = document.createElement('a');
    const e = ref(element);

    expect(e.value.ondragstart).toBe(undefined);
    useDrag(e, { data: 42 });
    expect(e.value.ondragstart).not.toBe(undefined);
  });

  it('should add a field "payload" with the given object to a datatransfer object', () => {
    const dragEvent = new DragEvent('test');
    const event = {
      ...dragEvent,
      dataTransfer: new DataTransfer(),
    } as DragEvent;

    expect(event.dataTransfer?.getData('payload')).toBe('');

    addObjectToDataTransfer(event, { data: 42 });

    expect(event.dataTransfer?.getData('payload')).toBe('{"data":42}');
  });

  it('should add the event listener to the "ondragstart" event of an element 2', () => {
    const element = document.createElement('a');
    const e = ref(element);

    expect(e.value.ondragstart).toBe(undefined);
    useDrag(e, { data: 42 });
    expect(e.value.ondragstart).not.toBe(undefined);
  });
});
