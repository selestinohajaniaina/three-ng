import { Injectable } from '@angular/core';
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  constructor() { }

  Cube() {
    const cubeGeometry = new BoxGeometry(1, 1, 1);
    const cubeMaterial = new MeshBasicMaterial({ color: 0x00ff00 });
    return new Mesh(cubeGeometry, cubeMaterial);
  }
}
