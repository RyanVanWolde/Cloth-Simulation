import { VertexInstance } from './VertexInstance.js'

import { Vertex } from './Vertex.js';
import { Stick } from './stick.js';

export function InitNet(width, height) {

    var returns = [];

    var vertices = [];

    for (let h = 0 ; h < height ; h++) {   
        for (let w = 0 ; w < width ; w++) {
            vertices.push(
                new Vertex(w, 0, h, false)
            );
        }
    }

    var sticks = []

    var stick;

    for (let i = 0 ; i < vertices.length ; i++) {
        if (((i+1) % width) != 0) {
            //left to right
            stick = new Stick(vertices[i], vertices[i+1]);
            sticks.push(stick);

            
        }
        
        // build sticks top to bottom   
        if (i < ((vertices.length-width))) {
            stick = new Stick(vertices[i], vertices[i+width]);
            sticks.push(stick);
        }
    }

    // Tether net
    vertices[0].toggleLocked();
    vertices[width-1].toggleLocked();
    vertices[(width*height)-1].toggleLocked();
    vertices[(width*height)-(width-1)].toggleLocked();

    var vertexInstances = new VertexInstance(vertices, 0.1);

    returns.push(vertexInstances);
    returns.push(sticks);

    return returns;

}