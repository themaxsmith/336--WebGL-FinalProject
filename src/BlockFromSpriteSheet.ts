import * as THREE from 'three';
import { AmbientLight, BoxGeometry, Mesh, ObjectLoader, PlaneGeometry, ShaderMaterial } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

enum BlockType {
    Stone = 0,
    Wood = 1,
    Brick = 2,
}

class BlockFromSpriteSheet {
    material: ShaderMaterial
    mesh: Mesh
    selectedSpriteX = 0
    selectedSpriteY = 0

    doUpdateTick = 0
    constructor(geometry: PlaneGeometry, scene: THREE.Scene, blockType: BlockType, x: number, y: number, z: number) {
   
        // fire animation from sprite sheet. The sprite sheet is 3x1 tiles, each tile is 8x8 pixels
        const texture = new THREE.TextureLoader().load( "/textures/spritesheet.png" )
        texture.magFilter = THREE.NearestFilter
        texture.minFilter = THREE.NearestFilter;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
     


        var uniformTexture = {
            texture1: { type: "t", value:  texture},
        };
        this.material = new THREE.ShaderMaterial( {

            uniforms: {
        
                "pos": { value: new THREE.Vector3( 0, 0, 0 ) },
                "spriteSize": { value: new THREE.Vector2( 3.0, 1.0 ) },
                "spriteSelected": { value: new THREE.Vector2( blockType * 1, 0 ) },
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
        this.mesh.position.set(x, y, z)



    
    }

    getMesh(){
        return this.mesh
    }

}

export default BlockFromSpriteSheet
export { BlockType }