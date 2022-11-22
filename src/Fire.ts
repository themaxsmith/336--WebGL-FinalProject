import * as THREE from 'three';
import { BoxGeometry, Mesh, ShaderMaterial } from 'three';

//fire source: https://opengameart.org/content/animated-fire
class Fire {
    material: ShaderMaterial
    mesh: Mesh
    constructor(geometry: BoxGeometry) {
   
        // fire animation from sprite sheet. The sprite sheet is 10x6 tiles, each tile is 64x64 pixels
        var uniformTexture = {
            texture1: { type: "t", value: new THREE.TextureLoader().load( "/textures/fire.png" ) },
        };
        this.material = new THREE.ShaderMaterial( {

            uniforms: {
        
                "pos": { value: new THREE.Vector3( 0, 0, 0 ) },
                "a_texcoord": { value: new THREE.Vector2( 0, 0 ) },
                ...uniformTexture
                },

        
            
            vertexShader: document.getElementById( 'vertex-shader-3d' ).textContent,
            fragmentShader: document.getElementById( 'fragment-shader-3d' ).textContent,

        
        } );

        this.mesh =  new THREE.Mesh(geometry, this.material)
        this.mesh.position.set(0.5,0,0)

    }

    getMesh(){
        return this.mesh
    }

}

export default Fire