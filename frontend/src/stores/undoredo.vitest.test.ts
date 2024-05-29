import { expect, describe, it, beforeEach, vi } from 'vitest';

import { setActivePinia, createPinia } from 'pinia';
import {
  GroupedUndoRedoAction,
  UndoRedoAction,
  useUndoRedoStore,
} from './undoredo';

class DummyAction implements UndoRedoAction {
  undo() {
    /* does nothing */
  }
  redo() {
    /* does nothing */
  }
}

describe('GroupedUndoRedoAction', () => {
  it('should call undo on all actions within the group', () => {
    const action = new DummyAction();
    vi.spyOn(action, 'undo');

    const groupAction = new GroupedUndoRedoAction([action]);
    groupAction.undo();

    expect(action.undo).toBeCalled();
  });

  it('should call redo on all actions within the group', () => {
    const action = new DummyAction();
    vi.spyOn(action, 'redo');

    const groupAction = new GroupedUndoRedoAction([action]);
    groupAction.redo();

    expect(action.redo).toBeCalled();
  });
});

describe('UndoRedoStore', () => {
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia());
  });

  it('should execute an action', () => {
    const undoRedoStore = useUndoRedoStore();
    undoRedoStore.execute(new DummyAction());
    expect(undoRedoStore.hasUnduable()).to.be.true;
  });

  it('should do not perform an undo if there is no unduable action stored', () => {
    const undoRedoStore = useUndoRedoStore();
    undoRedoStore.undo();
    expect(undoRedoStore.hasReduable()).to.be.false;
  });

  it('should be able to undo an executed action', () => {
    const undoRedoStore = useUndoRedoStore();
    undoRedoStore.execute(new DummyAction());
    expect(undoRedoStore.hasUnduable()).to.be.true;
    undoRedoStore.undo();
    expect(undoRedoStore.hasUnduable()).to.be.false;
    expect(undoRedoStore.hasReduable()).to.be.true;
  });

  it('should be able to redo an executed undo action', () => {
    const undoRedoStore = useUndoRedoStore();
    undoRedoStore.execute(new DummyAction());
    expect(undoRedoStore.hasUnduable()).to.be.true;
    undoRedoStore.undo();
    expect(undoRedoStore.hasUnduable()).to.be.false;
    expect(undoRedoStore.hasReduable()).to.be.true;
    undoRedoStore.redo();
    expect(undoRedoStore.hasUnduable()).to.be.true;
    expect(undoRedoStore.hasReduable()).to.be.false;
  });

  it('should do not perform a redo if there is no redoable action stored', () => {
    const undoRedoStore = useUndoRedoStore();
    undoRedoStore.redo();
    expect(undoRedoStore.hasUnduable()).to.be.false;
  });
});
