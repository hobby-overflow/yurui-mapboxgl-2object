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

    const box1 = box.clone();
    console.log(box1)
    const rwy01lL = new LngLat(141.6927, 42.7622);
    const pos1 = GeoMath.GetLocation(origin, rwy01lL);
    box1.position.set(pos1.x, pos1.y, pos1.z);
    this.scene.add(box1);
    
    const rwy01R = new LngLat(141.6964, 42.7625);
    const pos2 = GeoMath.GetLocation(origin, rwy01R);
    const box2 = box.clone();
    box2.position.set(pos2.x, pos2.y, pos2.z);
    this.scene.add(box2);
  }
}
