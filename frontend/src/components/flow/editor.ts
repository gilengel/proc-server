import { ClassicPreset, GetSchemes, NodeEditor } from 'rete';
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin';
import {
  DataflowEngine,
  DataflowEngineScheme,
  DataflowNode,
} from 'rete-engine';

import {
  AutoArrangePlugin,
  Presets as ArrangePresets,
} from 'rete-auto-arrange-plugin';
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from 'rete-connection-plugin';
import { VuePlugin, Presets, VueArea2D, ClassicScheme } from 'rete-vue-plugin';

import FlowNode from './FlowNode.vue';
import FlowSocket from './FlowSocket.vue';
import FlowConnection from './FlowConnection.vue';

export type AreaExtra<T extends DataflowEngineScheme> = VueArea2D<T>;

export declare type FlowScheme<Node extends ClassicPreset.Node> = GetSchemes<
  Node & DataflowNode & { width: number; height: number },
  ClassicScheme['Connection']
>;

export type ReteEditor<Node extends ClassicPreset.Node> = {
  editor: NodeEditor<FlowScheme<Node>>;
  area: AreaPlugin<FlowScheme<Node>, AreaExtra<FlowScheme<Node>>>;
  engine: DataflowEngine<FlowScheme<Node>>;
  arrange: AutoArrangePlugin<FlowScheme<Node>>;
};

export async function createEditor<Node extends ClassicPreset.Node>(
  container: HTMLElement,
): Promise<ReteEditor<Node>> {
  const editor = new NodeEditor<FlowScheme<Node>>();
  const area = new AreaPlugin<FlowScheme<Node>, AreaExtra<FlowScheme<Node>>>(
    container,
  );
  const connection = new ConnectionPlugin<
    FlowScheme<Node>,
    AreaExtra<FlowScheme<Node>>
  >();
  const render = new VuePlugin<FlowScheme<Node>, AreaExtra<FlowScheme<Node>>>();
  const engine = new DataflowEngine<FlowScheme<Node>>();
  const arrange = new AutoArrangePlugin<FlowScheme<Node>>();

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

  arrange.addPreset(ArrangePresets.classic.setup());

  editor.use(area);
  editor.use(engine);
  area.use(connection);
  area.use(render);
  area.use(arrange);

  AreaExtensions.simpleNodesOrder(area);
  AreaExtensions.zoomAt(area, editor.getNodes());

  return { editor, area, engine, arrange };
}
