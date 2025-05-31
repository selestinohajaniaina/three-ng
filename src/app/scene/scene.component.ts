import { Component } from '@angular/core';
import { BufferGeometry, Line, LineBasicMaterial, Mesh, PerspectiveCamera, Scene, Vector3 } from 'three';
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
  private line!: Line;

  constructor(private material: MaterialService) {}
  
  ngAfterViewInit() {
    const sceneFrame = document.querySelector('.scene-window') as HTMLElement;
    sceneFrame.appendChild(this.render.domElement);
    const { width, height } = sceneFrame.getBoundingClientRect();
    this.render.setSize(width, height);

    this.camera.position.set(0, 0, 10);
    this.camera.lookAt(0, 0, 0);
    this.cube = this.material.Cube();
    this.line = this.material.Line();
    
    this.scene.add(this.cube, this.line);
    
    this.render.setAnimationLoop( this.animate );
  }

  animate = () => {
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.render.render(this.scene, this.camera);
  }

}
