import * as THREE from 'three';
import { LngLat } from 'mapbox-gl';
import { GeoMath } from './GeoMath';

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

    const boxGeometry = new THREE.BoxGeometry(20, 20, 20);
    const boxMaterial = new THREE.MeshNormalMaterial();
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    
    const rwy01lL = new LngLat(141.6927, 42.7622);
    const pos = GeoMath.GetLocation(origin, rwy01lL);
    console.log(pos);
    box.position.set(pos.x, pos.y, pos.z);
    
    this.scene.add(box);
  }
}
