declare module 'vue-resize-directive' {
  import { DirectiveFunction, DirectiveOptions } from 'vue'
    // You need to change `Worker`, if you specified a different value for the `workerType` option
  const resize: DirectiveFunction | DirectiveOptions
  export default resize
}
