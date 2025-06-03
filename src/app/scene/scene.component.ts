import { Component } from '@angular/core';
import { Clock, Color, Mesh, PerspectiveCamera, Scene, Vector3 } from 'three';
import { WebGLRenderer } from 'three';
import { MaterialService } from '../material/material.service';
import { World, init, Collider, RigidBodyDesc, ColliderDesc } from '@dimforge/rapier3d-compat';

@Component({
  selector: 'app-scene',
  standalone: true,
  imports: [],
  templateUrl: './scene.component.html',
  styleUrl: './scene.component.css'
})
export class SceneComponent {
  private scene = new Scene();
  private camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  private render = new WebGLRenderer();
  private cube!: Mesh;
  private world!: World;
  private solCollider!: any;
  private boxDesc!: any;
  private boxBody!: any;

  constructor(private material: MaterialService) {}
  
  async ngAfterViewInit() {
    const sceneFrame = document.querySelector('.scene-window') as HTMLElement;
    sceneFrame.appendChild(this.render.domElement);
    const { width, height } = sceneFrame.getBoundingClientRect();
    this.render.setSize(width, height);

    this.camera.position.set(1, 1, 10);
    this.camera.lookAt(0, 0, 0);

    const orbitControle = this.material.OrbitControle(this.camera, this.render.domElement);
    orbitControle.update();

    const ambLight = this.material.AmbiantLight(0, 0, 0);
    this.scene.add( ambLight );

    this.cube = this.material.CubeLambert(1, 1, 1);
    this.cube.position.set(0, 10, 0);
    this.scene.add(this.cube);

    const SpotLight = this.material.AmbiantLight(10, 10, 10);
    SpotLight.lookAt(this.scene.position);
    this.scene.add( SpotLight );

    const plan = this.material.PlanGeometry(10, 10);
    this.scene.add( plan );

    // initialize the world Rapier
    await init();
    this.world = this.material.GenerateWorld();

    // // appliquer le physic au sol
    this.material.BoxCollider(this.world, {x:0, y:-1, z:0}, {x: 50, y: 1, z: 50});

    // // appliquer le physic au cube
    // this.boxDesc = this.material.BoxCollider(this.world, {x:0, y:10, z:0}, {x:0.5, y:0.5, z:0.5});
    const boxBodyDesc = RigidBodyDesc.dynamic().setTranslation(0, 10, 0);
    this.boxBody = this.world.createRigidBody(boxBodyDesc);
    const boxColliderDesc = ColliderDesc.cuboid(0.5, 0.5, 0.5)
                              .setFriction(0.1)
                              .setRestitution(0.3);
    this.world.createCollider(boxColliderDesc, this.boxBody);

    // this.scene.background = new Color(0xffff00);
    this.render.setAnimationLoop( this.animate );
  }

  animate = () => {
    this.world.step();

    const pos = this.boxBody.translation();
    const rot = this.boxBody.rotation();
    this.cube.position.set(pos.x, pos.y, pos.z);
      
    this.cube.quaternion.set(rot.x, rot.y, rot.z, rot.w);
    this.render.render(this.scene, this.camera);
  }

}
