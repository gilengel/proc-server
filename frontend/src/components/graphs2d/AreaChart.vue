<script lang="ts">
/* eslint @typescript-eslint/no-unsafe-call: off */

import { PolarArea } from 'vue-chartjs'

export default {
  extends: PolarArea,
  mounted () {
    this.renderChart(
      {
        datasets: [
          {
            data: [10, 20, 30]
          }
        ],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: ['Red', 'Yellow', 'Blue']
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: 'My Data'
        }
      }
    )
  }
}
</script>
