<template>
  <div class="linked-control column q-gutter-md">
    <div class="col">
      <q-btn
        flat
        icon="las la-plus-circle"
        label="Add Input"
        @click="addVariable"
      />
      <q-input v-model="variableName" label="Name" stack-label dense />
    </div>
  </div>
</template>

<script setup lang="ts">
variableName: string = '';

function addVariable() {
  const inputsCount = this.node.inputs.size;
  const id = `variable${inputsCount}`;
  const a = {
    type: 'variable',
    id: id,
    label: id,
    mandatory: true,

    control: {
      identifier: id,
      component: TypeControlVue,
    },
  };
  buildParameterPin(this.$props.emitter, this.node, a, Direction.In);

  this.node.outputs.forEach((output: Output) => {
    if (output.hasConnection()) {
      for (let connection of output.connections) {
        const inputNode = connection.input.node;
        const outputNode = connection.output.node;

        outputNode?.outputs.clear();

        if (!inputNode || !outputNode) {
          continue;
        }

        if (connection.input.node?.name === 'SplitObject') {
          const data = this.node.data as Record<string, unknown>;
          //const result = [];

          console.log(data);

          for (const key in data) {
            //const inputsCount = inputNode.outputs.size + 1;
            //const id = `variable${inputsCount}`;
            const a = {
              type: 'variable',
              id: Math.floor(Math.random() * 10000), //key,
              label: data[key].identifier,
              mandatory: true,
            };

            console.log(a);

            buildParameterPin(
              outputNode.vueContext.$props.emitter,
              inputNode,
              a,
              Direction.Out,
            );
          }
        }
      }
    }
  });

  this.node.update();
}
</script>

<style scoped></style>
