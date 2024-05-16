<template>
  <Widget
    title="Image"
    @remove-widget="removeWidget"
    :resizable="resizable"
    :draggable="draggable"
    :deletable="deletable"
  >
    <q-img src="https://placeimg.com/500/300/nature" :ratio="1" />
  </Widget>
<!--
  <Widget
    title="Chart"
    :resizable="resizable"
    :draggable="draggable"
    :deletable="deletable"
  >
    <component :is="chartType" />
  </Widget>
  -->
</template>

<script lang='ts'>
/* eslint @typescript-eslint/no-explicit-any: off */

import Widget from './Widget.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'

import AreaChart from './graphs2d/AreaChart.vue'
import BarChart from './graphs2d/BarChart.vue'
import DoughnoutChart from './graphs2d/DoughnoutChart.vue'
import LineChart from './graphs2d/LineChart.vue'
import PieChart from './graphs2d/PieChart.vue'
import PolarAreaChart from './graphs2d/PolarAreaChart.vue'
import RadarChart from './graphs2d/RadarChart.vue'
import ScatterChart from './graphs2d/ScatterChart.vue'

/* eslint-disable no-unused-vars */
export enum ChartType {
  Area = 'Area',
  Bar = 'Bar',
  Doughnout = 'Doughnout',
  Line = 'Line',
  Pie = 'Pie',
  PolarArea = 'PolarArea',
  Radar = 'Radar',
  Scatter = 'Scatter'
}
/* eslint-enable no-unused-vars */

@Component({
  name: 'ChartWidget',

  components: {
    Widget,
    AreaChart,
    BarChart,
    DoughnoutChart,
    LineChart,
    PieChart,
    PolarAreaChart,
    RadarChart,
    ScatterChart
  }
})
export default class ChartWidget extends Vue {
  @Prop() readonly chartData!: any;
  @Prop() readonly options!: any;
  @Prop({ default: ChartType.Scatter }) readonly chart!: ChartType;

  get chartType (): string {
    return this.chart + 'Chart'
  }
}
</script>

<style lang='scss'>
</style>
