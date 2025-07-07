import { Injectable } from '@angular/core';
import { AxesHelper, Camera, Mesh, Scene } from 'three';
import { FirstPersonControls, OrbitControls } from 'three/examples/jsm/Addons.js';

@Injectable({
  providedIn: 'root'
})
export class ControlsService {

  constructor() { }

  AxesHelper(size:number = 10) {
    return new AxesHelper(size);
  }

  OrbitControle(camera: Camera, rendererDomElement: HTMLElement) {
    return new OrbitControls(camera, rendererDomElement);
  }

  PersonControle(camera: Camera, rendererDomElement: HTMLElement) {
    return new FirstPersonControls(camera, rendererDomElement);
  }

  CaractereCamera(camera: Camera, caractere: Mesh) {
    camera.lookAt(caractere.position);
    camera.position.copy(caractere.position);
    camera.position.z += 10;
    camera.position.y += 5;
  }

}
