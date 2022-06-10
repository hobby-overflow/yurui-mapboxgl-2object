import mapboxgl, { LngLat, MercatorCoordinate } from "mapbox-gl";
import { Matrix4, Vector3 } from "three";

export type ModelTransform = {
  translateX: number;
  translateY: number;
  translateZ: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scale: number;
}

export type Matrixs = {
  m: Matrix4;
  l: Matrix4;
}

export class MapboxMatrix {
  private modelOrigin?: LngLat;
  private modelTransform?: ModelTransform;
  constructor() {
    this.calculateOrigin();
  }

  private calculateOrigin = () => {
    this.modelOrigin = new mapboxgl.LngLat(141.6769, 42.7831);
    const modelAltitude = 70 * 0.5;
    const modelRotate = [Math.PI / 2, 0, 0];

    const modelAsMercatorCoodinate = MercatorCoordinate.fromLngLat(
      this.modelOrigin,
      modelAltitude
    );

    this.modelTransform = {
      translateX: modelAsMercatorCoodinate.x,
      translateY: modelAsMercatorCoodinate.y,
      translateZ: modelAsMercatorCoodinate.z!,
      rotateX: modelRotate[0],
      rotateY: modelRotate[1],
      rotateZ: modelRotate[2],
      scale: modelAsMercatorCoodinate.meterInMercatorCoordinateUnits(),
    };

    return this.modelTransform!;
  }
  public calculateCameraMatrix = (matrix: number[]) => {
    const rotationX = new Matrix4().makeRotationAxis(
      new Vector3(1, 0, 0),
      this.modelTransform!.rotateX
    );
    const rotationY = new Matrix4().makeRotationAxis(
      new Vector3(0, 1, 0),
      this.modelTransform!.rotateY
    );
    const rotationZ = new Matrix4().makeRotationAxis(
      new Vector3(0, 0, 1),
      this.modelTransform!.rotateZ
    );

    const m = new Matrix4().fromArray(matrix);
    const l = new Matrix4()
      .makeTranslation(
        this.modelTransform!.translateX,
        this.modelTransform!.translateY,
        this.modelTransform!.translateZ
      )
      .scale(
        new Vector3(
          this.modelTransform!.scale,
          -this.modelTransform!.scale,
          this.modelTransform!.scale
        )
      )
      .multiply(rotationX)
      .multiply(rotationY)
      .multiply(rotationZ);
    return {m: m, l: l}
  }

  public getModelOrigin = () => {
    return this.modelOrigin!;
  }
  public getModelTransform = () => {
    return this.modelTransform!;
  }
}
