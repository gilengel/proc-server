import { NodeEditor, GetSchemes, ClassicPreset } from 'rete';
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin';
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from 'rete-connection-plugin';
import { VuePlugin, Presets, VueArea2D } from 'rete-vue-plugin';

import FlowNode from './FlowNode.vue';
import FlowSocket from './FlowSocket.vue';
import FlowConnection from './FlowConnection.vue';

export type Schemes = GetSchemes<
  ClassicPreset.Node,
  ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>;
export type AreaExtra = VueArea2D<Schemes>;

export async function createEditor(container: HTMLElement): Promise<{
  editor: NodeEditor<Schemes>;
  area: AreaPlugin<Schemes, AreaExtra>;
}> {
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const render = new VuePlugin<Schemes, AreaExtra>();

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
  area.use(connection);
  area.use(render);

  AreaExtensions.simpleNodesOrder(area);
  AreaExtensions.zoomAt(area, editor.getNodes());

  return { editor, area };
}
