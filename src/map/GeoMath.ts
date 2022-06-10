import { LngLat } from "mapbox-gl";
import { Vector3 } from "three/src/math/Vector3";

export class GeoMath {
  static radian = (deg: number) => {
    return deg * (Math.PI / 180)
  }
  static degree = (rad: number) => {
    return rad * (180 / Math.PI)
  }

  static GetBearing = (pos1: LngLat, pos2: LngLat): number => {
    let dLng = pos2.lng - pos1.lng;
    
    const x = Math.cos(this.radian(pos2.lat)) * Math.sin(this.radian(dLng));
    const z =
      Math.cos(this.radian(pos1.lat)) * Math.sin(this.radian(pos2.lat)) -
      Math.sin(this.radian(pos1.lat)) *
      Math.cos(this.radian(pos2.lat)) *
      Math.cos(this.radian(dLng));

    let bearingRadian = Math.atan2(x, z);
    let bearingDegree = this.degree(bearingRadian);

    if (bearingDegree > 0.0) return bearingDegree;
    return bearingDegree + 360;
  }

  static GetLocation = (origin: LngLat, to: LngLat) => {
    const distance = origin.distanceTo(to);
    const bearing = this.GetBearing(origin, to);
    let x = distance * Math.sin((Math.PI * 2 * bearing) / 360);
    let z = distance * Math.cos((Math.PI * 2 * bearing) / 360);
    return new Vector3(x, 0, -z)
  }
}
