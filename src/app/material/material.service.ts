import { Injectable } from '@angular/core';
import { BoxGeometry, BufferGeometry, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, MeshLambertMaterial, Vector3, AmbientLight, SpotLight, PointLight, MeshPhysicalMaterial, MeshPhongMaterial, SpotLightHelper, PointLightHelper, PlaneGeometry, DoubleSide, Plane, PlaneHelper, RectAreaLight, SphereGeometry, Scene } from 'three';
import { GLTFLoader, RectAreaLightHelper } from 'three/addons';
import { ColliderDesc, RigidBodyDesc, World, Vector, Collider } from '@dimforge/rapier3d-compat';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private gravity = { x: 0, y: -9.81, z: 0 };
  public world!: World;

  constructor() { }

  CubeBasic(x: number, y: number, z: number) {
    const cubeGeometry = new BoxGeometry(x, y, z);
    const cubeMaterial = new MeshBasicMaterial({ color: 0xffff00 });
    return new Mesh(cubeGeometry, cubeMaterial);
  }

  CubeLambert(x: number, y: number, z: number, color: any = 0xffff00) {
    const cubeGeometry = new BoxGeometry(x, y, z);
    const cubeMaterial = new MeshLambertMaterial({ color: color });
    return new Mesh(cubeGeometry, cubeMaterial);
  }

  CubePhong(x: number, y: number, z: number) {
    const cubeGeometry = new BoxGeometry(x, y, z);
    const cubeMaterial = new MeshPhongMaterial({ color: 0xffff00 });
    return new Mesh(cubeGeometry, cubeMaterial);
  }

  SphereBasic(r: number, ps: number, tl: number) {
    const sphereGeo = new SphereGeometry(r, ps, tl);
    const sphereMat = new MeshBasicMaterial({ color: 0x02ff00 });
    return new Mesh(sphereGeo, sphereMat);
  }

  SpherePhong(r: number, ps: number, tl: number) {
    const sphereGeo = new SphereGeometry(r, ps, tl);
    const sphereMat = new MeshPhongMaterial({ color: 0xffff00 });
    return new Mesh(sphereGeo, sphereMat);
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

  AmbiantLight(x: number, y: number, z: number) {
    const light = new AmbientLight(0x404040, 10);
    // light.position.set(x, y, z);
    // light.lookAt(0, 0, 0);
    // light.castShadow = true;
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

  RectLight() {
    const width = 10;
    const height = 10;
    const intensity = 1;
    const rectLight = new RectAreaLight( 0xffffff, intensity,  width, height );
    rectLight.position.set( 5, 5, 0 );
    rectLight.lookAt( 0, 0, 0 );
    const rectLightHelper = new RectAreaLightHelper( rectLight );
    rectLight.add( rectLightHelper );
    return rectLight;
  }

  PlanGeometry(w: number, y: number) {
    const pl_g = new PlaneGeometry(w, y, 30, 30);
    const pl_m = new MeshLambertMaterial({ color: 'skyblue', side: DoubleSide});
    const pl = new Mesh(pl_g, pl_m);
    pl.receiveShadow = true;
    pl.rotateX(-Math.PI/2);
    return pl;
  }

  Plan() {
    const plane = new Plane( new Vector3( 10, 10, 0.2 ), 0 );
    return new PlaneHelper( plane, 10, 0xffff00 );
  }

  GenerateWorld(): World {
    return new World(this.gravity);
  }

  ColliderFixed(world: World, transl: Vector, size: Vector) {
    const desc = this.RigidBodyDescFixed(transl);
    const body = this.CreateRigidBody(world, desc);
    const collider = this.ColliderDescCube(size);
    return world.createCollider(collider, body);
  }

  ColliderDynamic(world: World, transl: Vector, size: Vector) {
    const desc = this.RigidBodyDescDynamic(transl);
    const body = this.CreateRigidBody(world, desc);
    const collider = this.ColliderDescCube(size);
    return world.createCollider(collider, body);
  }

  RigidBodyDescFixed(transl: Vector): RigidBodyDesc {
    return RigidBodyDesc.fixed().setTranslation(transl.x, transl.y, transl.z);
  }

  RigidBodyDescDynamic(transl: Vector): RigidBodyDesc {
    return RigidBodyDesc.dynamic().setTranslation(transl.x, transl.y, transl.z);
  }

  CreateRigidBody(world: World, boxDescription: RigidBodyDesc) {
    return world.createRigidBody(boxDescription);
  }

  ColliderDescCube(size: Vector) {
    return ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2)
                          .setFriction(0.1)
                          .setRestitution(0.5);
  }

  ApplyRigidBodyToCube(boxBody: any, cube: Mesh) {
    const pos = boxBody.translation();
    const rot = boxBody.rotation();
    cube.position.set(pos.x, pos.y, pos.z);
    cube.quaternion.set(rot.x, rot.y, rot.z, rot.w);
  }

  ApplyRigidBodyToCubeArray(cubeArray: {cube: Mesh, boxBody: any}[]) {
    cubeArray.map((el) => {
      const pos = el.boxBody.translation();
      const rot = el.boxBody.rotation();
      el.cube.position.set(pos.x, pos.y, pos.z);
      el.cube.quaternion.set(rot.x, rot.y, rot.z, rot.w);
    });
  }

}
