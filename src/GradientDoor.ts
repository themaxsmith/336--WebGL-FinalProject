import * as THREE from 'three';
import { AmbientLight, BoxGeometry, Mesh, ObjectLoader, PlaneGeometry, ShaderMaterial } from 'three';

class DoorWithShaderColorGradient {
    material: ShaderMaterial
    mesh: Mesh
    selectedSpriteX = 0
    selectedSpriteY = 0

    doUpdateTick = 0
    constructor(geometry: PlaneGeometry, scene: THREE.Scene, x: number, y: number, z: number, colors: THREE.Vector3[]) {
   
        // fire animation from sprite sheet. The sprite sheet is 3x1 tiles, each tile is 8x8 pixels
        const texture = new THREE.TextureLoader().load( "/textures/door.png" )
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
                "spriteColorTopLeft": { value: colors[0] },
                "spriteColorTopRight": { value: colors[1] },
                "spriteColorBottomLeft": { value: colors[2] },
                "spriteColorBottomRight": { value: colors[3] },

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
            uniform vec3 spriteColorTopLeft;
            uniform vec3 spriteColorTopRight;
            uniform vec3 spriteColorBottomLeft;
            uniform vec3 spriteColorBottomRight;
            uniform sampler2D texture1;
            varying vec2 vUv;
            void main() {
                vec2 uv = vUv;
                
                vec4 tex = texture2D( texture1, uv);

                // if the alpha is 0, discard this fragment
  
                if (tex.a == 0.0) discard;

                // create a gradient from the 4 colors
                vec3 color = mix(mix(spriteColorTopLeft, spriteColorTopRight, uv.x), mix(spriteColorBottomLeft, spriteColorBottomRight, uv.x), uv.y);
                gl_FragColor = tex * vec4(color, 1.0);

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

export default DoorWithShaderColorGradient