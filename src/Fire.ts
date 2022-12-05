import * as THREE from 'three';
import { AmbientLight, BoxGeometry, Mesh, ObjectLoader, PlaneGeometry, ShaderMaterial } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
//fire image source: https://opengameart.org/content/animated-fire
//fire map source: by us (Caleb)
//the idea for animation is from webglfundamentals.org
class Fire {
    material: ShaderMaterial
    mesh: Mesh
    selectedSpriteX = 0
    selectedSpriteY = 0

    doUpdateTick = 0
    constructor(geometry: PlaneGeometry, scene: THREE.Scene, x: number, z:number, withMap: boolean = true, withDiffuse: boolean = false) {
   
        // fire animation from sprite sheet. The sprite sheet is 10x6 tiles, each tile is 64x64 pixels
        const texture = new THREE.TextureLoader().load( "/textures/fire.png" )
        texture.magFilter = THREE.LinearMipMapLinearFilter
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
     
        const texture2 = new THREE.TextureLoader().load( "/textures/FireNormal3.png" )

        const texture3 = new THREE.TextureLoader().load( "/textures/detail160.png" )

        texture.magFilter = THREE.LinearMipMapLinearFilter
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        var uniformTexture = {
            texture1: { type: "t", value:  texture},
            texture2: {type: "t", value: texture2},
            texture3: {type: "t", value: texture3}
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
            uniform sampler2D texture2;
            uniform sampler2D texture3;
            varying vec2 vUv;
            void main() {
                vec2 uv = vUv;
                
                vec4 tex = texture2D( texture1, uv / spriteSize + (spriteSelected / spriteSize) );

                // if the alpha is 0, discard this fragment
                if (tex.a == 0.0) discard;
                float v = tex.x + tex.y + tex.z;
              

                // if color near solid black, discard : removes the blocky black border
                if(v < 0.1) discard;
                ${!withMap ? 'gl_FragColor = tex;' : ''}


                // a texture map to reduce the blockiness/pixelation (center of fire, not edges) of original 2d image
                vec4 tex2 = texture2D( texture2, uv / spriteSize + (spriteSelected / spriteSize) );
                vec4 tex3 = texture2D( texture3, uv  );
                // blend the two textures
                
                ${withDiffuse ? 'tex2 = mix(tex2, tex3, 0.5);' : ''}
                ${withMap ? 'gl_FragColor = tex/tex2;' : ''}
                
            }
            `,
        
        } );

        this.mesh =  new THREE.Mesh(geometry, this.material)
        this.mesh.position.set(x,-0.25,z)

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
            this.doUpdateTick = 0
        }
    }

    
    }

    getMesh(){
        return this.mesh
    }

}

export default Fire