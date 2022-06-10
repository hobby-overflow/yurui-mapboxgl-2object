import React from 'react';
import mapboxgl, { CustomLayerInterface } from 'mapbox-gl';
import * as three from 'three';

import InitMap from './map/MapSettings';
import { Scenery } from './map/Scenery';
import { MapboxMatrix } from './map/MapboxMatrix';

import 'mapbox-gl/dist/mapbox-gl.css'

export class Map extends React.Component<{}, {value: number}> {
  constructor(props: any) {
    super(props);
  }

  private camera = new three.Camera();
  private renderer!: three.WebGLRenderer;
  private map!: mapboxgl.Map;

  private mapboxMatrix = new MapboxMatrix();

  componentDidMount = () => {
    this.map = InitMap();

    const mapOrigin = this.mapboxMatrix.getModelOrigin();
    const scene = new Scenery(mapOrigin).getScene();

    const customLayer: CustomLayerInterface = {
      id: '3d-model',
      type: 'custom',
      renderingMode: '3d',
      onAdd: (_, gl) => {
        this.renderer = new three.WebGLRenderer({
          canvas: this.map.getCanvas(),
          context: gl,
          antialias: true,
        });

        this.renderer.autoClear = false;
      },
      render: (_: WebGLRenderingContext, matrix) => {
        const cameraMatrix = this.mapboxMatrix.calculateCameraMatrix(matrix);

        this.camera.projectionMatrix = cameraMatrix.m.multiply(cameraMatrix.l);
        this.renderer.resetState();
        this.renderer.render(scene, this.camera);
        this.map.triggerRepaint();
      },
    };
    this.map.on('style.load', () => {
      this.map.addLayer(customLayer);
      this.map.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 0.0],
          'sky-atmosphere-sun-intensity': 15,
        },
      });
    });
  };
  render = () => {
    return <div id="mapContainer"></div>;
  };
}
