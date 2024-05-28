import { ElementAttributeType, ElementType } from 'src/models/Grid';

import { El } from './El';
import { ClassicPreset } from 'rete';

/* eslint-disable @typescript-eslint/no-explicit-any */
let modules: El<any, any>[] | undefined = undefined;

export async function loadAllModules<T extends string, S extends string>() {
  const keys = Object.keys(ElementType);

  if (modules) {
    return modules;
  }

  modules = await Promise.all(
    keys.map(
      async (key): Promise<El<T, S>> =>
        (await import(`./${key.toLowerCase()}`)) as El<T, S>,
    ),
  );
}

/**
 * Retrieve a module based on the enum key
 *
 * @param key Key of enum type ```ElementType```
 * @returns the found module
 */
export function getModule<T extends string, S extends string>(
  key: T,
): El<T, S> | undefined {
  const keys = Object.keys(ElementType);
  const index = keys.indexOf(key);

  if (!modules) {
    console.error(
      'Modules are not loaded. Have you called the loadAllModules function on boot?',
    );
    return;
  }

  return modules[index];
}

/*
export const AvailableSockets = Object.keys(ElementAttributeType).map(
  (type) => new ClassicPreset.Socket(type),
);
*/
