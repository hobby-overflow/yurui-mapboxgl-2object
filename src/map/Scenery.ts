import * as THREE from 'three';
import { LngLat } from 'mapbox-gl';
import { GeoMath } from './GeoMath';
import { Vector3, Object3D } from 'three';

class Aircraft {
  public lnglat: LngLat;
  public obj: Object3D;

  constructor(lng: number, lat: number) {
    let box = (() => {
      const boxGeometry = new THREE.BoxGeometry(20, 20, 20);
      const boxMaterial = new THREE.MeshNormalMaterial();
      const box = new THREE.Mesh(boxGeometry, boxMaterial);
      return box;
    })();

    this.lnglat = new LngLat(lng, lat);
    this.obj = box;
  }
}

export class Scenery {
  public getScene = () => { return this.scene };

  public objects = new Array<Object3D>();

  private scene: THREE.Scene;
  private origin: LngLat;

  constructor(origin: LngLat) {
    this.scene = new THREE.Scene();
    this.origin = origin;

    this.InitScene();
  }

  private plot = (obj: THREE.Object3D, lnglat: LngLat) => {
    const location: Vector3 = GeoMath.GetLocation(this.origin, lnglat);
    obj.position.copy(location);
    this.objects.push(obj);
    this.scene.add(obj);
  }

  private acPlot = (aircraft: Aircraft) => {
    const location = GeoMath.GetLocation(this.origin, aircraft.lnglat)
    aircraft.obj.position.copy(location)
    this.objects.push(aircraft.obj)
    this.scene.add(aircraft.obj)
  }

  private InitScene = () => {
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 70, 100).normalize();
    this.scene.add(light);

    let jal = new Aircraft(141.6927, 42.7622);
    let ana = new Aircraft(141.6964, 42.7625)
    this.acPlot(jal);
    this.acPlot(ana);
  }
}
