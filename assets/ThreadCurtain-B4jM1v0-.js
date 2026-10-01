import{r as m,j as g,g as w}from"./index-D8FMnd77.js";import{W as x,S as P,O as y,a as R,V as C,M as E,P as S}from"./three.module-BL0eUL9H.js";const T=`
precision highp float;
uniform float uProgress;
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vUv;

float hash(float n) { return fract(sin(n) * 43758.5453123); }

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);

  /* cobertura em triângulo: pico total no meio da transição */
  float cov = uProgress <= 0.5 ? uProgress * 2.0 : (1.0 - uProgress) * 2.0;
  cov = smoothstep(0.0, 1.0, cov);

  float threads = 14.0;
  float x = uv.x * aspect;
  float idx = floor(x * threads);
  float fx = fract(x * threads);

  /* cada fio entra com stagger da esquerda p/ direita */
  float stagger = idx / threads;
  float local = smoothstep(stagger * 0.72, stagger * 0.72 + 0.42, cov);

  /* borda ondulada, como fio solto ao vento */
  float wave = sin(uv.y * (6.0 + hash(idx) * 7.0) + uTime * 2.0 + idx * 1.7) * 0.22;
  float edge = local + wave * local * (1.0 - local) * 4.0;
  float covered = smoothstep(0.42, 0.58, edge);

  /* textura de fibra: estrias verticais + ruído fino */
  float stripe = smoothstep(0.25, 0.5, fx) * smoothstep(1.0, 0.78, fx);
  vec3 clay = vec3(0.761, 0.318, 0.169);
  vec3 ink  = vec3(0.165, 0.112, 0.071);
  vec3 ocre = vec3(0.847, 0.608, 0.239);
  vec3 col = mix(clay, ink, step(0.70, hash(idx + 3.0)));
  col = mix(col, ocre, step(0.86, hash(idx + 7.0)));
  col *= 0.82 + stripe * 0.32;
  col += sin(uv.y * 240.0 + idx) * 0.014;

  gl_FragColor = vec4(col, covered);
}
`,b=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;function M(){const c=m.useRef(null);return m.useEffect(()=>{const u=c.current;if(!u)return;const h=window.matchMedia("(prefers-reduced-motion: reduce)").matches,t=new x({canvas:u,antialias:!1,alpha:!0,powerPreference:"high-performance"});t.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),t.setClearColor(0,0);const s=new P,d=new y(-1,1,1,-1,0,1),a={uProgress:{value:0},uTime:{value:0},uResolution:{value:new C(1,1)}},f=new R({vertexShader:b,fragmentShader:T,uniforms:a,transparent:!0,depthTest:!1,depthWrite:!1}),n=new E(new S(2,2),f);n.frustumCulled=!1,s.add(n);const i=()=>{const e=window.innerWidth,o=window.innerHeight;t.setSize(e,o,!1),a.uResolution.value.set(e,o)};i(),window.addEventListener("resize",i);let l=!1,r=null;const p=e=>{if(l||h){e();return}l=!0;const o=performance.now();r=w.timeline({onUpdate:()=>{a.uTime.value=(performance.now()-o)/1e3,t.render(s,d)},onComplete:()=>{l=!1,a.uProgress.value=0,t.render(s,d)}}).to(a.uProgress,{value:.5,duration:.55,ease:"power2.in"}).call(()=>e()).to(a.uProgress,{value:1,duration:.55,ease:"power2.out"})},v=e=>{const o=e.detail;p(typeof o=="function"?o:()=>{})};return window.addEventListener("mm-curtain",v),()=>{window.removeEventListener("mm-curtain",v),window.removeEventListener("resize",i),r==null||r.kill(),f.dispose(),n.geometry.dispose(),t.dispose()}},[]),g.jsx("canvas",{ref:c,className:"pointer-events-none fixed inset-0 z-[75] h-full w-full","aria-hidden":"true"})}export{M as default};
