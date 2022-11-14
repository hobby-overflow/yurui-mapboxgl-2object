import * as THREE from 'three';
import { LngLat } from 'mapbox-gl';
import { GeoMath } from './GeoMath';
import { Vector3, Object3D } from 'three';
import { ColladaLoader } from '../lib/ColladaLoader';

const colladaUrl = new URL('B737-800.dae', import.meta.url).href

class Aircraft {
  public lnglat: LngLat;
  public obj: Object3D;
  public setHeading(hdg: number): void {
    this.obj.rotation.z = (-hdg) * (Math.PI / 180);
  }

  constructor(lng: number, lat: number, model?: Object3D) {
    let box = (() => {
      const boxGeometry = new THREE.BoxGeometry(20, 20, 20);
      const boxMaterial = new THREE.MeshNormalMaterial();
      const box = new THREE.Mesh(boxGeometry, boxMaterial);
      return box;
    })();

    this.lnglat = new LngLat(lng, lat);
    if (model == null) {
      this.obj = box;
    } else {
      this.obj = model;
    }
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
    console.log(colladaUrl)
    let b737Model: Object3D;

    const loader = new ColladaLoader();
    loader.load("B737-800.dae", (data: THREE.ColladaObject) => {
      const model = data.scene;
      const modelScale = 1;
      model.scale.set(modelScale, modelScale, modelScale);
      b737Model = model;

      let jal = new Aircraft(141.6927, 42.7622, b737Model);
      jal.setHeading(352.62);
      // jal.obj.rotation.z = (-352.62) * (Math.PI / 180);
      let ana = new Aircraft(141.6964, 42.7625)
      this.acPlot(jal);
      this.acPlot(ana);
    });

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 70, 100).normalize();
    this.scene.add(light);
  }
}
