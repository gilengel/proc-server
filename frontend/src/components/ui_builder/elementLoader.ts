import { ElementAttributeType, ElementType } from 'src/models/Grid';

import { El } from './El';
import { ClassicPreset } from 'rete';

/**
 * Singleton that loads for each key in the ElementType enum the corresponding
 * module and make them available via the ```getModule``` function.
 */
export class ModuleLoader {
  /**
   * The singleton instance.
   *
   * @private
   * @static
   * @type {ModuleLoader}
   * @memberof ModuleLoader
   */
  private static instance: ModuleLoader;

  /**
   * List of all loaded modules. The modules are loaded the first time a class requests an instance
   * of the class via the ```getInstance``` function.
   *
   * @private
   * @static
   * @type {El[]}
   * @memberof ModuleLoader
   */
  private static modules: El[];

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {}

  /**
   * Tries to import for each key in the ```ElementType``` enum the corresponding module.
   * Each module must have the same name as the enum key but in lowercase in the same directory
   * as this class.
   */
  private static async loadAllModules() {
    const keys = Object.keys(ElementType);
    this.modules = await Promise.all(
      keys.map(
        async (key): Promise<El> =>
          (await import(`./${key.toLowerCase()}`)) as El,
      ),
    );
  }

  /**
   * Request an instance (and load the modules if called for the first time)
   */
  public static async getInstance(): Promise<ModuleLoader> {
    if (!ModuleLoader.instance) {
      ModuleLoader.instance = new ModuleLoader();

      await ModuleLoader.loadAllModules();
    }

    return ModuleLoader.instance;
  }

  /**
   * Retrieve a module based on the enum key
   *
   * @param key Key of enum type ```ElementType```
   * @returns the found module
   */
  public getModule(key: ElementType): El {
    const keys = Object.keys(ElementType);
    const index = keys.indexOf(key);

    return ModuleLoader.modules[index];
  }
}

export const AvailableSockets = Object.keys(ElementAttributeType).map(
  (type) => new ClassicPreset.Socket(type),
);
