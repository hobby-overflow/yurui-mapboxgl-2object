import * as THREE from 'three';
import { LngLat } from 'mapbox-gl';
import { GeoMath } from './GeoMath';
import { Vector3, Object3D } from 'three';

export class Scenery {
  public getScene = () => { return this.scene };

  private scene: THREE.Scene;
  private origin: LngLat;

  constructor(origin: LngLat) {
    this.scene = new THREE.Scene();
    this.origin = origin;

    this.InitScene();
  }

  private plot = (obj: THREE.Object3D, lnglat: LngLat) => {
    console.log(this.scene);
    const location: Vector3 = GeoMath.GetLocation(this.origin, lnglat);
    console.log(location);

    obj.position.copy(location);
    this.scene.add(obj);
  }

  private InitScene = () => {
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 70, 100).normalize();
    this.scene.add(light);

    const boxGeometry = new THREE.BoxGeometry(20, 20, 20);
    const boxMaterial = new THREE.MeshNormalMaterial();
    const box = new THREE.Mesh(boxGeometry, boxMaterial);

    const box1 = box.clone();
    const rwy01l = new LngLat(141.6927, 42.7622);
    this.plot(box1, rwy01l);
    
    
    const box2 = box.clone();
    const rwy01r = new LngLat(141.6964, 42.7625);
    this.plot(box2, rwy01r)
  }
}
