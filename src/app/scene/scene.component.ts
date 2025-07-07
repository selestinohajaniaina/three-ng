import { Component } from '@angular/core';
import { Clock, Color, Euler, Mesh, PerspectiveCamera, Quaternion, Scene, Vector3 } from 'three';
import { WebGLRenderer } from 'three';
import { MaterialService } from '../material/material.service';
import { World, init, Collider, RigidBodyDesc, ColliderDesc, Vector, RigidBody } from '@dimforge/rapier3d-compat';
import { ControlsService } from '../material/controls.service';

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
  private personCube!: {cube: Mesh, boxBody: RigidBody};
  private world!: World;
  private speed: number = 150;
  private euler!: Euler;
  private deltatime: number = 0.0167;
  private marcher = {
    avancer: false,
    gauche: false,
    droit: false
  };

  constructor(private material: MaterialService, private controls: ControlsService) {}
  
  async ngAfterViewInit() {
    const sceneFrame = document.querySelector('.scene-window') as HTMLElement;
    sceneFrame.appendChild(this.render.domElement);
    const { width, height } = sceneFrame.getBoundingClientRect();
    this.render.setSize(width, height);

    // initialize the world Rapier
    // appliquer le physic au sol
    await init();
    this.world = this.material.GenerateWorld();
    this.material.ColliderFixed(this.world, {x:0, y:0, z:0}, {x: 10, y: 0, z: 10});

    this.camera.position.set(1, 1, 10);

    const ambLight = this.material.AmbiantLight(0, 0, 0);
    this.scene.add( ambLight );
    
    const SpotLight = this.material.AmbiantLight(10, 10, 10);
    SpotLight.lookAt(this.scene.position);
    this.scene.add( SpotLight );
    
    const plan = this.material.PlanGeometry(10, 10);
    this.scene.add( plan );

    const sceneAxes = this.controls.AxesHelper();
    this.scene.add(sceneAxes);
    
    // cube personnage
    const cube = this.material.CubeLambert(1, 1, 1);
    cube.position.set(0, 1, 0);
    this.scene.add(cube);
    // appliquer le physic au cube
    const boxDesc = this.material.RigidBodyDescDynamic( cube.position );
    const boxBody = this.material.CreateRigidBody(this.world, boxDesc);
    const boxColliderDesc = this.material.ColliderDescCube( {x: 1, y: 1, z: 1} );
    this.world.createCollider(boxColliderDesc, boxBody);
    this.personCube = {cube: cube, boxBody: boxBody};

    const personCubeAxes = this.controls.AxesHelper(1);
    this.personCube.cube.add(personCubeAxes);

    // mure devant
    this.setMure(10, 2, 0.5, 0, 0.5, -5);

    // mure deriere
    this.setMure(10, 2, 0.5, 0, 0.5, 5);

    // mure gauche
    this.setMure(0.5, 2, 10, -5, 0.5, 0);

    // mure droit
    this.setMure(0.5, 2, 10, 5, 0.5, 0);
    
    window.addEventListener('keydown', (event) => {
      switch(event.key) {
        case 'ArrowUp': {
          this.marcher.avancer = true;
          break;
        }
        case 'ArrowLeft': {
          this.marcher.gauche = true;
          break;
        }
        case 'ArrowRight': {
          this.marcher.droit = true;
          break;
        }
      }
    })
    
    window.addEventListener('keyup', (event) => {
      switch(event.key) {
        case 'ArrowUp': {
          this.marcher.avancer = false;
          break;
        }
        case 'ArrowLeft': {
          this.marcher.gauche = false;
          break;
        }
        case 'ArrowRight': {
          this.marcher.droit = false;
          break;
        }
      }
    })
    
    // Récupère la rotation actuelle
    const currentRotation = this.personCube.boxBody.rotation(); // Rapier rotation (Quaternion)
    const quat = new Quaternion(
      currentRotation.x,
      currentRotation.y,
      currentRotation.z,
      currentRotation.w
    );

    // Convertit en angle Euler pour modifier Y
    this.euler = new Euler().setFromQuaternion(quat);

   

    // Convertit de retour en quaternion
    const newQuat = new Quaternion().setFromEuler(this.euler);
    this.personCube.boxBody.setRotation(
      {
        x: newQuat.x,
        y: newQuat.y,
        z: newQuat.z,
        w: newQuat.w,
      },
      true
    );
    

    // this.scene.background = new Color(0xffff00);
    this.render.setAnimationLoop( this.animate );
  }

  animate = () => {
    this.world.step();
    if(this.personCube) {
      this.controls.CaractereCamera(this.camera, this.personCube.cube)
    }

    if(this.marcher.avancer) {
      const direction = this.getForwardDirection(this.personCube.cube, this.euler);
      // setLinvel applique une vélocité
      this.personCube.boxBody.setLinvel(
        {
          x: direction.x * this.speed,
          y: this.personCube.boxBody.linvel().y, // garder la vélocité verticale (ex: gravité)
          z: direction.z * this.speed,
        },
        true
      );
    }

     // Appliquer rotation gauche/droite
    const turnSpeed = 2 * this.deltatime; // en radians (ajuste `deltaTime` si dispo)

    if (this.marcher.gauche) this.euler.y += turnSpeed;
    if (this.marcher.droit) this.euler.y -= turnSpeed;

    this.material.ApplyRigidBodyToCube(this.personCube.boxBody, this.personCube.cube);
    this.render.render(this.scene, this.camera);
  }

  getForwardDirection(mesh: Mesh, euler: Euler): Vector3 {
    const forward = new Vector3(0, 0, -1).applyEuler(euler).normalize();
    return forward;
  }

  setMure(x: number, y: number, z: number, posX: number, posY: number, posZ: number, color: any = 0x00ffff) {
    let mure1 = this.material.CubeLambert(x, y, z, color);
    mure1.position.set(posX, posY, posZ);
    this.scene.add(mure1);
    this.material.ColliderFixed(this.world, mure1.position, mure1.scale);
  }

}
