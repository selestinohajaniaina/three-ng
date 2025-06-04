import { Component } from '@angular/core';
import { Clock, Color, Mesh, PerspectiveCamera, Scene, Vector3 } from 'three';
import { WebGLRenderer } from 'three';
import { MaterialService } from '../material/material.service';
import { World, init, Collider, RigidBodyDesc, ColliderDesc, Vector, RigidBody } from '@dimforge/rapier3d-compat';

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
  private cubeArray: {cube: Mesh, boxBody: any}[] = [];
  private world!: World;
  private boxBodyArray: any[] = [];

  constructor(private material: MaterialService) {}
  
  async ngAfterViewInit() {
    const sceneFrame = document.querySelector('.scene-window') as HTMLElement;
    sceneFrame.appendChild(this.render.domElement);
    const { width, height } = sceneFrame.getBoundingClientRect();
    this.render.setSize(width, height);

    // initialize the world Rapier
    // appliquer le physic au sol
    await init();
    this.world = this.material.GenerateWorld();
    this.material.ColliderFixed(this.world, {x:0, y:-1, z:0}, {x: 50, y: 1, z: 50});

    this.camera.position.set(1, 1, 10);
    this.camera.lookAt(0, 0, 0);

    const orbitControle = this.material.OrbitControle(this.camera, this.render.domElement);
    orbitControle.update();

    const ambLight = this.material.AmbiantLight(0, 0, 0);
    this.scene.add( ambLight );
    
    const SpotLight = this.material.AmbiantLight(10, 10, 10);
    SpotLight.lookAt(this.scene.position);
    this.scene.add( SpotLight );
    
    const plan = this.material.PlanGeometry(10, 10);
    this.scene.add( plan );

    
    const cube = this.material.CubeLambert(1, 1, 1);
    cube.position.set(0, 10, 0);
    this.scene.add(cube);
    // appliquer le physic au cube
    const boxDesc = this.material.RigidBodyDescDynamic({x:0, y:10, z:0});
    const boxBody = this.material.CreateRigidBody(this.world, boxDesc);
    const boxColliderDesc = this.material.ColliderDescCube({x:0.5, y:0.5, z:0.5});
    this.world.createCollider(boxColliderDesc, boxBody);
    this.cubeArray.push({cube: cube, boxBody: boxBody});

    window.addEventListener('click', () => {
      const cube = this.material.CubeLambert(1, 1, 1);
      cube.position.set(0, 10, 0);
      this.scene.add(cube);
      // appliquer le physic au cube
      const boxDesc = this.material.RigidBodyDescDynamic({x:0, y:10, z:0});
      const boxBody = this.material.CreateRigidBody(this.world, boxDesc);
      const boxColliderDesc = this.material.ColliderDescCube({x:0.5, y:0.5, z:0.5});
      this.world.createCollider(boxColliderDesc, boxBody);
      this.cubeArray.push({cube: cube, boxBody: boxBody});
    })
    

    // this.scene.background = new Color(0xffff00);
    this.render.setAnimationLoop( this.animate );
  }

  animate = () => {
    this.world.step();
    this.material.ApplyRigidBodyToCubeArray(this.cubeArray);
    this.render.render(this.scene, this.camera);
  }

}
