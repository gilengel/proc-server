<template>
  <Widget>
    <MglMap
      :access-token="accessToken"
      :map-style="mapStyle"
      :source-id="geoJsonSource.data.id"
      :source="geoJsonSource"
      layer-id="somethingSomething"
      :layer="geoJsonLayer"
      @load="onMapLoaded"
    />
  </Widget>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import Mapbox from "mapbox-gl";
import { MglMap } from "vue-mapbox";
import resize from "vue-resize-directive";

import "mapbox-gl/dist/mapbox-gl.css";

@Component({
  name: "MapWidget",

  directives: {
    resize,
  },

  components: {
    MglMap,
  },
})
export default class MapWidget extends Vue {
  accessToken =
    "pk.eyJ1IjoibmFudHUiLCJhIjoiY2ttcnNreGFuMDRtbDJ3bXdyNm5vcGw5cyJ9.ATcig-n5fak3GqavXn9xXg";

  mapStyle = "mapbox://styles/nantu/ckmrsykkb2e6e17qtgfhy7whx"; // your map style
  geoJsonSource = {
    type: "geojson",
    data: {
      id: "thisIsMySource",
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [102.0, 0.5],
          },
          properties: {
            id: "value0",
          },
        },
      ],
    },
  };

  geoJsonLayer = {
    type: "circle",
    paint: {
      "circle-color": "red",
    },
  };

  mapbox = null;

  width = 0;
  height = 0;

  map: any;

  onMapLoaded(event: any) {
    this.map = event.map;
  }

  onResize(e: HTMLElement) {
    if (
      (this.width !== e.scrollWidth || this.height !== e.scrollHeight) &&
      this.map
    ) {
      this.map.resize();
    }

    this.width = e.scrollWidth; // - (e.scrollWidth % 50)
    this.height = e.scrollHeight; // - (e.scrollHeight % 50)
  }

  created() {
    this.mapbox = Mapbox;
  }
}
</script>

<style lang="scss">
.map {
  display: block;
  position: relative;

  //height: 100%;
  min-height: 400px;
}

.mapboxgl-ctrl-attrib {
  visibility: collapse;
}
</style>
