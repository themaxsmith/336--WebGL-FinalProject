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
        const texture = new THREE.TextureLoader().load( "/textures/brick-wayfair.png" )
      
     
        const texture2 = new THREE.TextureLoader().load( "/textures/brick-invert-greyscale.png" )



        const texture3 = new THREE.TextureLoader().load( "/textures/detail160.png" )
// research done from: https://softsrc.cc/Public/three.js/examples/webgl_materials_parallaxmap.html
// research done from  https://learnopengl.com/Advanced-Lighting/Parallax-Mapping
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
                "spriteSize": { value: new THREE.Vector2( 1.0, 1.0 ) },
                "spriteSelected": { value: new THREE.Vector2( 0, 0 ) },
                "parallaxScale": {  value: 0.4 },
                ...uniformTexture
                },

        
            
            vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            void main() {
                vUv = uv;
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                vViewPosition = -mvPosition.xyz;
                vNormal = normalize( normalMatrix * normal );
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
            `,

            fragmentShader:  `
            uniform vec3 pos;

            uniform sampler2D texture1;
            uniform sampler2D texture2;
            uniform sampler2D texture3;
            varying vec2 vUv;
            varying vec3 vNormal;
            uniform float parallaxScale;
            varying vec3 vViewPosition;
            vec2 parallaxMap( in vec3 V ) {
                float height = texture2D( texture2, vUv).r;
                vec2 texCoordOffset = parallaxScale * V.xy * height;
                return vUv - texCoordOffset;
                }

            vec2 visualApUV( vec3 surfacePosition, vec3 surfNormal, vec3 viewPosition ) {

        vec2 texDx = dFdx( vUv );
           vec2 texDy = dFdy( vUv );

           vec3 vSigmaX = dFdx( surfacePosition );
           vec3 vSigmaY = dFdy( surfacePosition );
           vec3 vR1 = cross( vSigmaY, surfNormal );
           vec3 vR2 = cross( surfNormal, vSigmaX );
           float fDet = dot( vSigmaX, vR1 );

           vec2 vProjVscr = ( 1.0 / fDet ) * vec2( dot( vR1, viewPosition ), dot( vR2, viewPosition ) );
           vec3 vProjVtex;
           vProjVtex.xy = texDx * vProjVscr.x + texDy * vProjVscr.y;
           vProjVtex.z = dot( surfNormal, viewPosition );

           return parallaxMap( vProjVtex );
       }

         

            void main() {
            vec2 mapUv = visualApUV( -vViewPosition, normalize( vNormal ), normalize( vViewPosition ) );
			gl_FragColor = texture2D( texture1, mapUv );
              
            }
            `,
        
        } );
        
        this.mesh =  new THREE.Mesh(geometry, this.material)
        this.mesh.position.set(x,-0.25,z)

        // on each frame, update the spriteSelected uniform
   

    
    }

    getMesh(){
        return this.mesh
    }

}

export default Fire