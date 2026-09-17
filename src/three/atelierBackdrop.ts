import * as THREE from "three";

/* Uma única superfície no mesmo espaço da peça: pigmento, linho e luz de janela.
 * Sem texturas externas, blur em tela cheia ou uma segunda animação de canvas. */
export function createAtelierBackdrop() {
  const material = new THREE.ShaderMaterial({
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uLight: { value: new THREE.Vector2(-.8, .9) },
      uInk: { value: new THREE.Color("#2c1e13") },
      uClay: { value: new THREE.Color("#c2512b") },
      uMoss: { value: new THREE.Color("#35573b") },
      uSand: { value: new THREE.Color("#d89b3d") },
      uCream: { value: new THREE.Color("#fbf6ea") },
    },
    vertexShader: `
      varying vec2 vSurface;
      void main() {
        vSurface = position.xy;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime, uProgress;
      uniform vec2 uLight;
      uniform vec3 uInk, uClay, uMoss, uSand, uCream;
      varying vec2 vSurface;
      float grain(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
      void main() {
        vec2 p = vSurface;
        float breath = sin(uTime*.19)*.045;
        float bend = sin(p.y*1.45 + uProgress*3.2)*.19;
        float ochre = exp(-dot((p-vec2(-1.1+bend,.45)) * vec2(.67,.53),
                              (p-vec2(-1.1+bend,.45)) * vec2(.67,.53)));
        float moss = exp(-dot((p-vec2(1.2,-.8+bend)) * vec2(.8,.64),
                             (p-vec2(1.2,-.8+bend)) * vec2(.8,.64)));
        vec3 color = mix(uInk, uClay, ochre*.24);
        color = mix(color,uMoss,moss*.31);
        vec2 lightSpace = p-uLight;
        float light = exp(-dot(lightSpace*vec2(.65,.43),lightSpace*vec2(.65,.43)));
        color = mix(color,uSand,light*(.26+breath));
        // Grande sombra de janela, suave: atravessa o cenário sem repetir um loop curto.
        float diagonal = p.x*.8 + p.y*.55 + uProgress*.85 + sin(uTime*.13)*.09;
        float windowLight = smoothstep(-1.0,-.6,diagonal)*(1.0-smoothstep(.38,.85,diagonal));
        color = mix(color,uCream,windowLight*light*.085);
        float weave = sin(p.x*560.0)*sin(p.y*570.0)*.009;
        color *= 1.0 + weave + (grain(gl_FragCoord.xy)-.5)*.055;
        float vignette = smoothstep(.45,3.2,length(p*vec2(.75,.6)));
        color *= 1.0-vignette*.24;
        gl_FragColor = vec4(color,1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(24, 18), material);
  mesh.position.z = -.4;
  mesh.renderOrder = -1;
  return { mesh, material };
}
