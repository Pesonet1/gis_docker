<template>
  <div class="router-wrapper">
    <div class="router-buttons">
      <v-btn
        class="mr-2"
        color="primary"
        fab
        small
        :dark="!startPointSet && !routeCalculated"
        :disabled="startPointSet || routeCalculated"
        @click="setStartPoint"
      >
        <v-icon dark>
          {{ mdiRayStart }}
        </v-icon>
      </v-btn>

      <v-btn
        class="mx-2"
        color="primary"
        fab
        small
        :dark="startPointSet && !routeCalculated && !destPointSet"
        :disabled="!startPointSet || destPointSet || routeCalculated"
        @click="setEndPoint"
      >
        <v-icon dark>
          {{ mdiRayEnd }}
        </v-icon>
      </v-btn>

      <v-btn
        class="mx-2"
        color="primary"
        :dark="!routingLoading"
        :disabled="routingLoading"
        @click="clearRouting"
      >
        {{ $vuetify.lang.t('$vuetify.router.clearButton') }}
      </v-btn>

      <v-btn
        class="mx-2"
        color="primary"
        :dark="startPointSet && destPointSet && !routeCalculated"
        :disabled="!startPointSet || !destPointSet || routeCalculated"
        :loading="routingLoading"
        @click="routeBetweenStartAndDest"
      >
        {{ $vuetify.lang.t('$vuetify.router.routeButton') }}
      </v-btn>
    </div>

    <div class="router-selectors">
      <v-radio-group
        v-model="routeData"
        hide-details
        class="ml-2 mr-5"
      >
        <v-radio
          label="OSM"
          value="osm">
        </v-radio>
        <v-radio
          label="Digiroad"
          value="digiroad">
        </v-radio>
      </v-radio-group>

      <v-radio-group
        v-model="routingType"
        hide-details
      >
        <v-radio
          label="Dijkstra"
          value="dijkstra">
        </v-radio>
        <v-radio
          label="K-Shorthest Path"
          value="ksp">
        </v-radio>
      </v-radio-group>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.router-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: .5rem;
  top: .5rem;
  padding: 15px;
  background-color: white;
  border: 1px solid black;
  border-radius: 4px;
}

.router-buttons {
  display: flex;
  flex-direction: row;
}

.router-selectors {
  display: flex;
  flex-direction: row;
  width: 100%;
}
</style>

<script lang="ts">
import Vue from 'vue';
import { mdiRayStart, mdiRayEnd } from '@mdi/js';

import Map from 'ol/Map';
import ImageLayer from 'ol/layer/Image';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import { Draw, Modify, Snap } from 'ol/interaction';
import { DrawEvent } from 'ol/interaction/Draw';
import GeometryType from 'ol/geom/GeometryType';

import {
  routingLocationLayer,
  // routingResultLayerWMS,
  routingResultLayerWFS,
  defaultStyle,
} from '../util/map/layer/pgrouting';
import { RouteDataTypes, RoutingTypes } from '../types';

export default Vue.extend({
  props: {
    map: {
      type: Map,
    },
  },
  data: () => ({
    startPoint: null as Feature | null,
    destPoint: null as Feature | null,
    vectorLayer: null as VectorLayer | null,
    resultLayer: null as ImageLayer | VectorLayer | null,
    startPointSet: false as boolean,
    destPointSet: false as boolean,
    routeCalculated: false as boolean,
    routingLoading: false as boolean,
    routeData: 'osm' as RouteDataTypes,
    routingType: 'dijkstra' as RoutingTypes,
    mdiRayStart,
    mdiRayEnd,
  }),
  methods: {
    setStartPoint() {
      if (!this.vectorLayer) {
        this.vectorLayer = routingLocationLayer();

        const modifyInteraction: Modify = new Modify({
          source: this.vectorLayer.getSource(),
          style: defaultStyle,
        });

        const snapInteraction: Snap = new Snap({ source: this.vectorLayer.getSource() });

        this.map.addInteraction(modifyInteraction);
        this.map.addInteraction(snapInteraction);
        this.map.addLayer(this.vectorLayer);
      }

      this.addPointInteraction(true);
    },
    setEndPoint() {
      this.addPointInteraction(false);
    },
    addPointInteraction(startPoint: boolean) {
      if (!this.vectorLayer) return;

      const drawInteraction: Draw = new Draw({
        // @ts-ignore
        features: this.vectorLayer.getSource().getFeatures(),
        type: GeometryType.POINT,
        style: defaultStyle,
      });

      this.map.addInteraction(drawInteraction);

      drawInteraction.on('drawend', (event: DrawEvent) => {
        if (!this.vectorLayer) return;
        const vectorLayerSource: VectorSource | null = this.vectorLayer.getSource();
        if (!vectorLayerSource) return;

        if (startPoint) {
          this.startPoint = event.feature;
          this.startPointSet = true;
          this.startPoint.set('text', 'Aloitus');
          vectorLayerSource.addFeature(this.startPoint);
        } else {
          this.destPoint = event.feature;
          this.destPointSet = true;
          this.destPoint.set('text', 'Lopetus');
          vectorLayerSource.addFeature(this.destPoint);
        }

        this.map.removeInteraction(drawInteraction);
      });
    },
    routeBetweenStartAndDest() {
      if (!this.startPoint || !this.destPoint) return;

      // @ts-ignore
      const startCoord = this.startPoint.getGeometry().getCoordinates();
      // @ts-ignore
      const destCoord = this.destPoint.getGeometry().getCoordinates();

      // LOADER INDICATION FOR WMS
      // this.resultLayer = routingResultLayerWMS(startCoord, destCoord);

      // this.routingLoading = true;
      // this.resultLayer.getSource().on('imageloadend', () => {
      //   this.routingLoading = false;
      //   this.routeCalculated = true;
      // });

      // LOADER INDICATION FOR WFS
      this.resultLayer = routingResultLayerWFS(
        startCoord,
        destCoord,
        this.routeData,
        this.routingType,
      );

      this.routingLoading = true;
      this.resultLayer.getSource().on('change', () => {
        this.routingLoading = false;
        this.routeCalculated = true;
      });

      this.map.addLayer(this.resultLayer);
    },
    clearRouting() {
      this.startPointSet = false;
      this.destPointSet = false;
      this.routeCalculated = false;

      if (this.startPoint) {
        // @ts-ignore
        this.startPoint.setGeometry(null);
        this.startPoint = null;
      }

      if (this.destPoint) {
        // @ts-ignore
        this.destPoint.setGeometry(null);
        this.destPoint = null;
      }

      if (this.vectorLayer) {
        this.vectorLayer.getSource().clear();
      }

      if (this.resultLayer) {
        this.map.removeLayer(this.resultLayer);
        this.resultLayer = null;
      }
    },
  },
});
</script>
