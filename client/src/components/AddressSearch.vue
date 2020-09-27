<template>
  <div class="px-3 pb-3 address-search">
    <v-row
      no-gutters
      align="center"
    >
      <v-col cols="11">
        <v-text-field
          v-model="searchValue"
          class="pb-3"
          hide-details
        >
        </v-text-field>
      </v-col>
      <v-col
        cols="1"
        align="end"
      >
        <v-btn
          icon
          x-small
          @click="clearAddressSearch"
        >
          <v-icon>
            {{ mdiClose }}
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-row
      v-if="searching"
      no-gutters
    >
      <v-col
        class="py-3"
        justify="center"
        align="center"
      >
        <v-progress-circular
          indeterminate
          size="32"
          width="4"
          color="primary"
        />
      </v-col>
    </v-row>

    <div v-if="!searching && !noResults">
      <div
        v-for="result in searchResult"
        :key="result.osm_id"
        class="my-3"
        @click="setMapPositionToResult(result)"
      >
        <div
          class="search-result-value"
          :style="selectedSearchValue === result.place_id
            ? 'font-weight: bold; color: darkmagenta;' : null"
        >
          {{ result.display_name }}
        </div>
      </div>
    </div>

    <div v-if="!searching && noResults">
      {{ $vuetify.lang.t('$vuetify.addressSearch.noResults') }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.address-search {
  position: absolute;
  top: .5rem;
  right: 270px;
  width: 390px;
  min-height: 100px;
  background-color: white;
  border: 1px solid black;
  border-radius: 4px;
}

.search-result-value {
  cursor: pointer;

  &:hover {
    font-weight: bold;
    color: darkmagenta;
  }
}
</style>

<script lang="ts">
import Vue from 'vue';
import axios, { AxiosResponse } from 'axios';
import debounce from 'lodash/debounce';
import { mdiClose } from '@mdi/js';

import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import { Coordinate } from 'ol/coordinate';

import { NominatimSearchResponse } from '@/types';
import { NOMINATIM_URL } from '@/apiConfig';

import { getMarkerLayer, getMarkerFeature } from '../util/map/layer/searchMarker';

export default Vue.extend({
  props: {
    map: {
      type: Map,
    },
  },
  data: () => ({
    searching: false as boolean,
    noResults: true as boolean,
    searchError: false as boolean,
    markerLayerAdded: false as boolean,
    searchValue: null as string | null,
    selectedSearchValue: null as number | null,
    searchResult: [] as NominatimSearchResponse[] | [],
    markerLayer: null as VectorLayer | null,
    mdiClose,
  }),
  watch: {
    searchValue(newValue: string) {
      if (!newValue) return;

      if (newValue.length <= 3) {
        this.searching = false;
        return;
      }

      this.searching = true;
      this.searchAddress(newValue);
    },
  },
  mounted() {
    this.markerLayer = getMarkerLayer();
  },
  methods: {
    clearAddressSearch() {
      this.searching = false;
      this.noResults = true;
      this.searchError = false;
      this.searchValue = null;
      this.selectedSearchValue = null;
      this.searchResult = [];

      if (this.markerLayer) {
        this.markerLayer.getSource().clear();
        this.map.removeLayer(this.markerLayer);
        this.markerLayerAdded = false;
        this.markerLayer = null;
      }
    },
    searchAddress: debounce(async function (searchValue: string) { // eslint-disable-line
      try {
        // @ts-ignore
        if (!this.markerLayer) {
          // @ts-ignore
          this.markerLayer = getMarkerLayer();
        }

        const response: AxiosResponse = await axios.get(`${NOMINATIM_URL}/search?addressdetails=1&q=${searchValue}&format=json&polygon_geojson=1&limit=5`);
        const { data }: { data: NominatimSearchResponse[] } = response;

        // @ts-ignore
        this.searchResult = data;

        if (data.length === 0) {
          // @ts-ignore
          this.noResults = true;
        } else {
          // @ts-ignore
          this.noResults = false;
        }
      } catch (error) {
        console.error('Error while geocoding');
        // @ts-ignore
        this.searchError = true;
        // @ts-ignore
        this.noResults = true;
      } finally {
        // @ts-ignore
        this.searching = false;
      }
    }, 250),
    setMapPositionToResult(result: NominatimSearchResponse) {
      // @ts-ignore
      this.selectedSearchValue = result.place_id;

      const resultCoords: Coordinate = fromLonLat([parseFloat(result.lon), parseFloat(result.lat)], 'EPSG:3067');
      this.map.getView().setCenter(resultCoords);
      this.map.getView().setZoom(12);

      const marker = getMarkerFeature(resultCoords, result.icon);

      if (!this.markerLayerAdded && this.markerLayer) {
        this.map.addLayer(this.markerLayer);
        this.markerLayerAdded = true;
      }

      if (!this.markerLayer) return;

      this.markerLayer.getSource().clear();
      this.markerLayer.getSource().addFeature(marker);
    },
  },
});
</script>;
