import { Component } from '@angular/core';
import { Color, Mesh, PerspectiveCamera, Scene, Vector3 } from 'three';
import { WebGLRenderer } from 'three';
import { MaterialService } from '../material/material.service';

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

  constructor(private material: MaterialService) {}
  
  ngAfterViewInit() {
    const sceneFrame = document.querySelector('.scene-window') as HTMLElement;
    sceneFrame.appendChild(this.render.domElement);
    const { width, height } = sceneFrame.getBoundingClientRect();
    this.render.setSize(width, height);

    this.camera.position.set(1, 5, 15);
    this.camera.lookAt(0, 0, 0);
    this.cube = this.material.CubeLambert(1, 1, 1);
    this.cube.position.set(0, 1, 0);

    const orbitControle = this.material.OrbitControle(this.camera, this.render.domElement);
    orbitControle.update();

    const ambLight = this.material.AmbiantLight(0, 0, 0);
    this.scene.add( ambLight );

    const SpotLight = this.material.AmbiantLight(10, 10, 10);
    SpotLight.lookAt(this.scene.position);
    this.scene.add( SpotLight );

    const sphere = this.material.SpherePhong(1,4, 100);
    sphere.position.set(0, 3, 0);
    this.scene.add( sphere );

    const plan = this.material.PlanGeometry(10, 10);
    this.scene.add( plan );

    // this.scene.background = new Color(0xffff00);
    
    this.scene.add(this.cube);
    this.render.setAnimationLoop( this.animate );
  }

  animate = () => {
    this.render.render(this.scene, this.camera);
  }

}
