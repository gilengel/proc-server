import { NodeEditor } from 'rete';
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin';
import { DataflowEngine, DataflowEngineScheme } from 'rete-engine';
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from 'rete-connection-plugin';
import { VuePlugin, Presets, VueArea2D } from 'rete-vue-plugin';

import FlowNode from './FlowNode.vue';
import FlowSocket from './FlowSocket.vue';
import FlowConnection from './FlowConnection.vue';

export type AreaExtra<T extends DataflowEngineScheme> = VueArea2D<T>;

export async function createEditor<T extends DataflowEngineScheme>(
  container: HTMLElement,
): Promise<{
  editor: NodeEditor<T>;
  area: AreaPlugin<T, AreaExtra<T>>;
  engine: DataflowEngine<T>;
}> {
  const editor = new NodeEditor<T>();
  const area = new AreaPlugin<T, AreaExtra<T>>(container);
  const connection = new ConnectionPlugin<T, AreaExtra<T>>();
  const render = new VuePlugin<T, AreaExtra<T>>();
  const engine = new DataflowEngine<T>();

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl(),
  });

  render.addPreset(
    Presets.classic.setup({
      customize: {
        node() {
          return FlowNode;
        },
        socket() {
          return FlowSocket;
        },
        connection() {
          return FlowConnection;
        },
      },
    }),
  );

  connection.addPreset(ConnectionPresets.classic.setup());

  editor.use(area);
  editor.use(engine);
  area.use(connection);
  area.use(render);

  AreaExtensions.simpleNodesOrder(area);
  AreaExtensions.zoomAt(area, editor.getNodes());

  return { editor, area, engine };
}
