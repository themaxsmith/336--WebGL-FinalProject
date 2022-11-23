import * as THREE from 'three';
import { BoxGeometry, Mesh, ObjectLoader, PlaneGeometry, ShaderMaterial } from 'three';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
//fire source: https://opengameart.org/content/animated-fire
class Fire {
    material: ShaderMaterial
    mesh: Mesh
    selectedSpriteX = 0
    selectedSpriteY = 0

    doUpdateTick = 0
    constructor(geometry: PlaneGeometry, camera: THREE.Camera) {
   
        // fire animation from sprite sheet. The sprite sheet is 10x6 tiles, each tile is 64x64 pixels
        const texture = new THREE.TextureLoader().load( "/textures/fire.png" )
        texture.magFilter = THREE.LinearMipMapLinearFilter
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
     


        var uniformTexture = {
            texture1: { type: "t", value:  texture},
        };
        this.material = new THREE.ShaderMaterial( {

            uniforms: {
        
                "pos": { value: new THREE.Vector3( 0, 0, 0 ) },
                "spriteSize": { value: new THREE.Vector2( 10.0, 6 ) },
                "spriteSelected": { value: new THREE.Vector2( 1, 0 ) },
                ...uniformTexture
                },

        
            
            vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
            `,

            fragmentShader:  `
            uniform vec3 pos;
            uniform vec2 spriteSelected;
            uniform vec2 spriteSize;
            uniform sampler2D texture1;
            varying vec2 vUv;
            void main() {
                vec2 uv = vUv;
                
                vec4 tex = texture2D( texture1, uv / spriteSize + (spriteSelected / spriteSize) );

                // if the alpha is 0, discard this fragment
                if (tex.a == 0.0) discard;
  
                gl_FragColor = tex;
            }
            `,
        
        } );

        this.mesh =  new THREE.Mesh(geometry, this.material)
        this.mesh.position.set(0.5,-0.25,0)

        // on each frame, update the spriteSelected uniform
        this.mesh.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
            this.doUpdateTick++
            if(this.doUpdateTick % 3 == 0){

            // increment the spriteSelected.x value
            this.selectedSpriteX += 1
            if (this.selectedSpriteX >= 10) {
                this.selectedSpriteX = 0
                this.selectedSpriteY += 1
                if (this.selectedSpriteY >= 6) {
                    this.selectedSpriteY = 0
                }
            }
            this.material.uniforms.spriteSelected.value = new THREE.Vector2(this.selectedSpriteX, this.selectedSpriteY)
            this.mesh.lookAt(camera.position)
            console.log(this.selectedSpriteX, this.selectedSpriteY)
            this.doUpdateTick = 0
        }





        }


        

    }

    getMesh(){
        return this.mesh
    }

}

export default Fire