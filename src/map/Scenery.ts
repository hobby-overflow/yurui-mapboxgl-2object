import * as THREE from 'three';
import { LngLat } from 'mapbox-gl';
import { GeoMath } from './GeoMath';
import { ColladaLoader, ColladaObject } from '../lib/ColladaLoader.js';

export class Scenery {
  private scene: THREE.Scene;
  public getScene = () => { return this.scene };

  constructor(origin: LngLat) {
    this.scene = new THREE.Scene();
    this.InitScene(origin);
  }

  private InitScene = (origin: LngLat) => {
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 70, 100).normalize();
    this.scene.add(light);

    const loader = new ColladaLoader();
    loader.load('./B737-800.dae', (data: ColladaObject) => {
      const model = data.scece;
      const rwy01lL = new LngLat(141.6927, 42.7622);
      const pos1 = GeoMath.GetLocation(origin, rwy01lL);
      model.position.set(pos1.x, pos1.y, pos1.z);
      this.scene.add(model);
    })

    const boxGeometry = new THREE.BoxGeometry(20, 20, 20);
    const boxMaterial = new THREE.MeshNormalMaterial();
    const box1 = new THREE.Mesh(boxGeometry, boxMaterial);
    
    const rwy01R = new LngLat(141.6964, 42.7625);
    const pos2 = GeoMath.GetLocation(origin, rwy01R);
    const box2 = new THREE.Mesh(boxGeometry, boxMaterial);
    box2.position.set(pos2.x, pos2.y, pos2.z);
    this.scene.add(box2);
  }
}
