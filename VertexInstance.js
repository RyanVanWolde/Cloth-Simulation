import * as THREE from 'three';

const dummy = new THREE.Object3D();



export class VertexInstance {

    constructor(vertices, radius) {

        this.vertices = vertices;

        var geometry = new THREE.SphereGeometry(radius, 16, 16);
        var material = new THREE.MeshBasicMaterial();

        this.mesh = new THREE.InstancedMesh(geometry, material, this.vertices.length); 

        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame

        this.gravity = -9.81;

    }


    updatePoints(delta) {

        // update points in random order
        var random = this.generateRandomIndexes(this.vertices.length);

        for (let i = 0; i < this.vertices.length; i++) {

            var index = random[i];
            var vertex = this.vertices[index]; 
            
            vertex.updatePoint(delta, this.gravity);

            dummy.position.set(vertex.position.x, vertex.position.y, vertex.position.z);

            dummy.updateMatrix();

            this.mesh.setMatrixAt(index, dummy.matrix);

            var color = new THREE.Color(vertex.defaultColor);

            this.mesh.setColorAt(index, color);
        }

        this.mesh.instanceMatrix.needsUpdate = true;
        this.mesh.instanceColor.needsUpdate = true;

    }

    constrainPoints(sceneW, sceneH) {

        for (let i = 0; i < this.vertices.length; i++) {

            var point = this.vertices[i]; 

            point.constrainPoint(sceneW, sceneH);

            dummy.position.set(point.position.x, point.position.y, 0);

            dummy.updateMatrix();

            this.mesh.setMatrixAt(i++, dummy.matrix);
        }

        this.mesh.instanceMatrix.needsUpdate = true;
    }


    generateRandomIndexes(length) {

        var array = [];

        for (let i = 0 ; i < length ; i++) {
            array.push(i);
        }

        var currentIndex = array.length, temporaryValue, randomIndex;
    
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
    
        return array;
        
    }
}