import { defineStore } from 'pinia';
import { Ref, ref } from 'vue';

export interface UndoRedoAction {
  undo(): void;
  redo(): void;
}

/**
 * Groups multiple actions into one. Calling undo/redo on this
 * action will execute the corresponding function in each contained
 * action.
 *
 * This class is useful if you need to do multiple actions at the same time
 * but don't want the single actions be added to the undo / redo stack
 * (instead the group action is added).
 */
export class GroupedUndoRedoAction implements UndoRedoAction {
  constructor(private actions: UndoRedoAction[]) {}

  undo() {
    for (const action of this.actions) {
      action.undo();
    }
  }

  redo() {
    for (const action of this.actions) {
      action.redo();
    }
  }
}

export const useUndoRedoStore = defineStore('undoRedo', () => {
  const _undoStack: Ref<UndoRedoAction[]> = ref([]);
  const _redoStack: Ref<UndoRedoAction[]> = ref([]);

  function hasUnduable(): boolean {
    return _undoStack.value.length > 0;
  }

  function hasReduable(): boolean {
    return _redoStack.value.length > 0;
  }

  function execute(action: UndoRedoAction) {
    action.redo();
    _redoStack.value = [];
    _undoStack.value.push(action);
  }

  function redo() {
    const action = _redoStack.value.pop();
    if (!action) {
      return;
    }

    action?.redo();

    _undoStack.value.push(action);
  }

  function undo() {
    const action: UndoRedoAction | undefined = _undoStack.value.pop();
    if (!action) {
      return;
    }

    action.undo();
    _redoStack.value.push(action);
  }

  return {
    hasUnduable,
    hasReduable,
    execute,
    undo,
    redo,
  };
});
