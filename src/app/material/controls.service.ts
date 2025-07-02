import { Injectable } from '@angular/core';
import { Camera } from 'three';
import { FirstPersonControls, OrbitControls } from 'three/examples/jsm/Addons.js';

@Injectable({
  providedIn: 'root'
})
export class ControlsService {

  constructor() { }

  OrbitControle(camera: Camera, rendererDomElement: HTMLElement) {
    return new OrbitControls(camera, rendererDomElement);
  }

  personControle(camera: Camera, rendererDomElement: HTMLElement) {
    return new FirstPersonControls(camera, rendererDomElement);
  }

}
