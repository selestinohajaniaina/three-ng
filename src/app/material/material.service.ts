import { Injectable } from '@angular/core';
import { BoxGeometry, BufferGeometry, Camera, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, MeshLambertMaterial, Vector3, AmbientLight, SpotLight, PointLight, MeshPhysicalMaterial, MeshPhongMaterial, SpotLightHelper, PointLightHelper, PlaneGeometry, DoubleSide } from 'three';
import { GLTFLoader, OrbitControls } from 'three/addons';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  constructor() { }

  CubeBasic(x: number, y: number, z: number) {
    const cubeGeometry = new BoxGeometry(x, y, z);
    const cubeMaterial = new MeshBasicMaterial({ color: 0x00ff00 });
    return new Mesh(cubeGeometry, cubeMaterial);
  }

  CubeLambert(x: number, y: number, z: number) {
    const cubeGeometry = new BoxGeometry(x, y, z);
    const cubeMaterial = new MeshLambertMaterial({ color: 0x00ff00 });
    return new Mesh(cubeGeometry, cubeMaterial);
  }

  CubePhong(x: number, y: number, z: number) {
    const cubeGeometry = new BoxGeometry(x, y, z);
    const cubeMaterial = new MeshPhongMaterial({ color: 0x00ff00 });
    return new Mesh(cubeGeometry, cubeMaterial);
  }

  Line() {
    const material = new LineBasicMaterial( { color: 0x0000ff } );
    const points = [];
    points.push( new Vector3( - 10, 0, 0 ) );
    points.push( new Vector3( 0, 10, 0 ) );
    points.push( new Vector3( 10, 0, 0 ) );
    points.push( new Vector3( 0, -10, 0 ) );
    points.push( new Vector3( -10, 0, 0 ) );
    points.push( new Vector3( 0, 0, 10 ) );
    points.push( new Vector3( 10, 0, 0 ) );
    points.push( new Vector3( 0, 0, -10 ) );
    points.push( new Vector3( -10, 0, 0 ) );
    const geometry = new BufferGeometry().setFromPoints( points );
    return new Line( geometry, material );
  }

  GltfLoader() {
    return new GLTFLoader();
  }

  OrbitControle(camera: Camera, rendererDomElement: HTMLElement) {
    return new OrbitControls(camera, rendererDomElement);
  }

  AmbiantLight(x: number, y: number, z: number) {
    const light = new AmbientLight(0xffffff, 10);
    light.position.set(x, y, z);
    light.lookAt(0, 0, 0);
    light.castShadow = true;

    return light;
  }

  SpotLight(x: number, y: number, z: number) {
    const l = new SpotLight(0xff0000, 1, 100);
    l.position.set(x, y, z);
    l.lookAt(0, 0, 0);
    l.castShadow = true;
    return l;
  }

  LightHelper(light: any): any {
    if(light == PointLight) return new PointLightHelper(light);
    if(light == SpotLight) return new SpotLightHelper(light);
  }

  PointLight(x: number, y: number, z: number) {
    const l = new PointLight(0xff0000, 1, 100);
    l.position.set(x, y, x);
    return l;
  }

  PlanGeometry(w: number, y: number) {
    const pl_g = new PlaneGeometry(w, y, 30, 30);
    const pl_m = new MeshBasicMaterial({ color: 0x3f3f3f, side: DoubleSide});
    const pl = new Mesh(pl_g, pl_m);
    pl.rotateX(-Math.PI/2);
    return pl;
  }

}
