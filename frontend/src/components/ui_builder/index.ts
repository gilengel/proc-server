// dynamically loads the associated components for each key in the ElementType enum.

import { ElementType } from 'src/models/Grid';
import { El } from './El';

const keys = Object.keys(ElementType);

export const modules: El[] = await Promise.all(
  keys.map(
    async (key): Promise<El> => (await import(`./${key.toLowerCase()}`)) as El,
  ),
);

export function getModule(key: ElementType) {
  const keys = Object.keys(ElementType);
  const index = keys.indexOf(key);

  return modules[index];
}
