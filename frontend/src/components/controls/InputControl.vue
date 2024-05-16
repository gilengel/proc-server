<template>
  <div class="linked-control column q-gutter-md">
    <div class="col">
      <q-btn
        flat
        icon="las la-plus-circle"
        label="Add Output"
        @click="addVariable"
      />
      <q-input v-model="variableName" label="Name" stack-label dense />
    </div>
  </div>
</template>

<script setup>
variableName: string = '';

function addVariable() {
  //const firstInput = this.node.inputs.values().next();

  const socket = registeredSockets.get('variable');
  if (!socket) {
    throw new Error('Socket <variable> is not registered');
  }

  const pin = new Rete.Output(
    `variable_${this.node.outputs.size}`,
    `variable_${this.node.outputs.size}`,
    socket,
  );

  this.node.addOutput(pin);
  this.node.update();
}
</script>

<style lang="scss" scoped>
.linked-control {
  padding: 1em;
  display: flex;
  gap: 2em;
}
</style>
