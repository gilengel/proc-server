import { Ref, onMounted, onUnmounted } from 'vue';

/**
 * Simply prevents the browsers default handling of an event
 *
 * @param event
 */
function preventDefault(event: DragEvent) {
  event.preventDefault();
}

/**
 * Loops over all keys in the dataTransfer object of a drag/drop event
 * and creates an object with these as keys and the corresponding values.
 *
 * This is unfortunately necessary as the dataTransfer object only allows
 * string values to be passed on.
 *
 * @param event
 * @returns the constructed object
 */
function recreateData(event: DragEvent): object {
  const data = event.dataTransfer?.getData('payload');

  return JSON.parse(data!);
}

/**
 * Registers a drop listener to the ref that call a callback each time the
 * drop event occurs. On drop it then recreates an object out of all data
 * provided by the user.
 *
 * @param element The element that shall listen for any drop event
 * @param callback The callback that is called once a drop event occurred.
 */
export function useDrop(element: Ref, callback: (data: object) => void) {
  const dropCallback = (event: DragEvent) => callback(recreateData(event));
  onMounted(() => {
    element.value.addEventListener('dragover', preventDefault);
    element.value.addEventListener('drop', dropCallback);
  });

  onUnmounted(() => {
    element.value.removeEventListener('dragover', preventDefault);
    element.value.removeEventListener('drop', dropCallback);
  });
}
