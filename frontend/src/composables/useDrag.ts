import { Ref } from 'vue';

export function addObjectToDataTransfer(event: DragEvent, data: object) {
  event.dataTransfer?.setData('payload', JSON.stringify(data));
}

export function useDrag(element: Ref, data: object) {
  element.value.ondragstart = (e: DragEvent) =>
    addObjectToDataTransfer(e, data);
}
