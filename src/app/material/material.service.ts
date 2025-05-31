import { Injectable } from '@angular/core';
import { BoxGeometry, BufferGeometry, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, Vector3 } from 'three';

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

  Line() {
    const material = new LineBasicMaterial( { color: 0x0000ff } );
    const points = [];
    points.push( new Vector3( - 10, 0, 0 ) );
    points.push( new Vector3( 0, 10, 0 ) );
    points.push( new Vector3( 10, 0, 0 ) );
    const geometry = new BufferGeometry().setFromPoints( points );
    return new Line( geometry, material );
  }
}
