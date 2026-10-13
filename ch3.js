// ===================== 챕터 3: 숲 =====================
// 물속 비상구를 지나 정신을 차려 보니 숲. 낮(해 질 녘)엔 리본을 따라 숲길을 걷고, 밤엔 텐트 안에서 버팀. 5일째 숲 끝의 문
// index.html의 전역(S, R3, MON, cx, W, H, 소리 함수 등)을 그대로 씀. 이 파일은 index.html 본문 스크립트 다음에 불러옴
'use strict';
const F3={ready:false,ld:null,w:null};
const HOUR3=45;                 // 텐트 밤: 게임 1시간 = 45초 (12시~6시 = 4분 30초)
const WALK_V=1.55;              // 걷는 빠르기 (m/s)
const PLEN=[0,190,205,215,225,215],DUSK3=[0,175,182,188,194,190],NFORK=[0,1,1,2,3,2];
const VNAME3=['왼쪽','앞','오른쪽'];
let savedCh3=1,savedCh3h=1,INTRO3=0;try{savedCh3=+localStorage.getItem('obs3_night')||1;savedCh3h=+localStorage.getItem('obs3_night_hard')||1;INTRO3=+localStorage.getItem('obs3_intro')||0}catch(e){}
const ch2Clear=()=>{try{return !!localStorage.getItem('obs2_clear')}catch(e){return false}};
MON.def.deer={h:2.55,em:.07};MON.def.axe={h:1.82,em:.22};MON.def.lantern={h:2.25,em:.05};MON.def.widow={h:2.2,em:.06};
// 점프스케어 사진 (가로)
[['사슴머리','deer'],['나무꾼','axe'],['파수꾼','lantern'],['지퍼 여는 것','widow'],['부르는 것','caller'],['내 목소리','caller']].forEach(([k,f])=>{const a=new Image();a.onload=()=>{JIMG[k]=a};a.src='img/c3_'+f+'1.jpg?v='+VER;const b=new Image();b.onload=()=>{JALT[k]=b};b.src='img/c3_'+f+(k==='내 목소리'?'1':'2')+'.jpg?v='+VER});
const DEATH3={'사슴머리':['뒤에 바짝 붙어 있었다.','발소리가 내 발소리에 겹쳐 들리면 뒤돌아보세요. 사라질 때까지.'],
  '나무꾼':['길 위에 서 있던 것에게 다가갔다.','길 한가운데 누가 서 있으면 멈추세요. 숲으로 들어갈 때까지.'],
  '부르는 것':['돌아보지 말았어야 했다.','뒤에서 부르는 목소리엔 절대 돌아보지 마세요.'],
  '파수꾼':['천 너머에서 들켰다.','텐트 벽에 손이 닿으면 손전등을 끄고 숨을 참으세요.'],
  '지퍼 여는 것':['지퍼가 끝까지 열렸다.','지퍼 내려가는 소리가 나면 지퍼 고리를 빠르게 연타하세요.'],
  '그림자':['어둠 속에서 다가왔다.','텐트 안에 두 눈이 보이면 손전등을 다시 켜세요.'],
  '교대자':['텐트 불빛을 보고 들어왔다.','앞에서 발소리가 멈추면 손전등을 끄세요. 틈으로 미리 볼 수 있어요.'],
  '내 목소리':['열어 주면 안 됐다.','밖에서 내 목소리가 들리는 동안엔 지퍼를 열지 마세요.']};
const RULES3=[ // [몇 일 차부터, 신호, 할 일] (젖은 쪽지)
  [1,'내 발소리에 발소리가 겹침','뒤돌아보기. 사라질 때까지 볼 것'],
  [1,'리본 없는 갈림길','가지 말 것. 같은 데로 돌아옴'],
  [1,'텐트 벽에 불빛이 지나감','손이 닿으면 손전등 끄고 숨 참기'],
  [1,'텐트 안 어둠 속 두 눈','손전등 다시 켜기'],
  [2,'길 한가운데 누가 서 있음','멈추고 기다리기. 숲으로 갈 때까지'],
  [2,'지퍼 내려가는 소리','지퍼 고리 빠르게 연타'],
  [3,'뒤에서 누가 부름','절대 돌아보지 말 것'],
  [3,'텐트 앞 발소리가 멈춤','손전등 끄기. 틈으로 미리 볼 수 있음'],
  [4,'밖에서 내 목소리','열지 말 것'],
  [4,'바랜 흰 리본','빨간 리본만 따라갈 것']];

// ---------- 소품 불러오기 (처음 챕터 3을 열 때 한 번) ----------
const PROP3={pine:{h:1},dead:{h:1},bush:{h:1},rock:{h:1},log:{h:1},sign:{h:1},tent:{h:1}};
function c3Load(){if(F3.ld)return F3.ld;monLoad(['deer','axe','lantern','widow','shadow','stalker']);
  F3.ld=(MON.ld||Promise.resolve()).then(()=>Promise.all(Object.keys(PROP3).map(k=>MON.fail?null:MON.GL.loadAsync('model/p_'+k+'.glb?v='+VER).then(g=>{const T=R3.T;let m=null;g.scene.traverse(o=>{if(o.isMesh&&!m)m=o});if(!m)return;
    g.scene.updateMatrixWorld(true);const geo=m.geometry.clone().applyMatrix4(m.matrixWorld);geo.computeBoundingBox();const b=geo.boundingBox,c=b.getCenter(new T.Vector3());geo.translate(-c.x,-b.min.y,-c.z);geo.computeBoundingBox();geo.computeBoundingSphere();
    const mat=m.material;mat.roughness=.92;mat.metalness=0;if(k==='pine'||k==='bush')mat.side=T.DoubleSide;
    PROP3[k]={geo,mat,h:b.max.y-b.min.y,w:Math.max(b.max.x-b.min.x,b.max.z-b.min.z)}}).catch(e=>console.warn('소품',k,e))))).then(()=>{F3.ready=true});
  return F3.ld}

// ---------- 지형·길 ----------
function vnoise(seed){const P=new Uint8Array(512),R=mulberry(seed);for(let i=0;i<256;i++)P[i]=i;for(let i=255;i>0;i--){const j=Math.floor(R()*(i+1));[P[i],P[j]]=[P[j],P[i]]}for(let i=0;i<256;i++)P[i+256]=P[i];
  const V=new Float32Array(256);for(let i=0;i<256;i++)V[i]=R()*2-1;const f=t=>t*t*(3-2*t);
  return(x,z)=>{const xi=Math.floor(x),zi=Math.floor(z),xf=x-xi,zf=z-zi,a=xi&255,b=zi&255,v=(i,j)=>V[P[P[(a+i)&255]+((b+j)&255)]];const u=f(xf),w=f(zf);return lerp(lerp(v(0,0),v(1,0),u),lerp(v(0,1),v(1,1),u),w)}}
// 길: s(m)마다 0.5m 간격 점. s는 -60부터 L+50까지
function genTrack(pts,ds=.5){const T=R3.T,c=new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(p[0],0,p[1])),false,'centripetal'),len=c.getLength(),n=Math.ceil(len/ds),X=new Float32Array(n+1),Z=new Float32Array(n+1);
  const sp=c.getSpacedPoints(n);for(let i=0;i<=n;i++){X[i]=sp[i].x;Z[i]=sp[i].z}return{X,Z,n,ds,len}}
function trkAt(t,s){const f=Math.max(0,Math.min(t.n-1e-4,s/t.ds)),i=Math.floor(f),k=f-i,i2=Math.min(t.n,i+1),x=lerp(t.X[i],t.X[i2],k),z=lerp(t.Z[i],t.Z[i2],k);
  const a=Math.max(0,i-2),b=Math.min(t.n,i+3),tx=t.X[b]-t.X[a],tz=t.Z[b]-t.Z[a],l=Math.hypot(tx,tz)||1;return{x,z,tx:tx/l,tz:tz/l}}
function buildWorld3(day){const R=mulberry(9100+day*77),L=PLEN[day],W3={day,L,R};
  W3.nz=vnoise(day*13+5);W3.hg=(x,z)=>W3.nz(x*.035,z*.035)*1.5+W3.nz(x*.11+40,z*.11)*.3;
  // 큰 방향은 -z. 조금씩 휘어짐. 시작점(s=0)은 원점
  const pts=[];let x=0,z=60,h=0;for(let k=0;k<6;k++){pts.push([x,z]);z-=12}let hd=0;
  while(pts.length<6+Math.ceil((L+60)/11)){hd+=(R()-.5)*.55;hd*=.86;h=hd;x+=Math.sin(h)*11;z-=Math.cos(h)*11;pts.push([x,z])}
  W3.main=genTrack(pts);W3.s0=60;   // 트랙 좌표 = s + s0 (s0까지가 시작점 뒤쪽)
  // 갈림길: 오답 길은 바깥쪽으로 휘어 나감
  W3.forks=[];const nf=NFORK[day];for(let i=0;i<nf;i++){const fs=L*(i+1)/(nf+1)+(R()-.5)*14,a=trkAt(W3.main,fs+W3.s0),b=trkAt(W3.main,fs+W3.s0+16),turn=Math.sign(a.tx*b.tz-a.tz*b.tx)||1,side=-turn,ang=side*(.62+R()*.15);
    const bp=[[a.x-a.tx*4,a.z-a.tz*4],[a.x,a.z]];let bh=Math.atan2(a.tx,-a.tz)+ang,bx=a.x,bz=a.z;for(let k=0;k<4;k++){bh+=side*.12;bx+=Math.sin(bh)*9;bz-=Math.cos(bh)*9;bp.push([bx,bz])}
    const tr=genTrack(bp);W3.forks.push({s:fs,side,tr,b0:4,fake:day>=4})}
  W3.camp=trkAt(W3.main,L+W3.s0);
  return W3}
// 점 (x,z)에서 길(본 길 + 갈림길)까지 가까운 거리. s 힌트로 근처만 봄
function pathDist(W3,x,z,sHint){let best=1e9;const t=W3.main,i0=Math.max(0,Math.floor((sHint-60)/t.ds)),i1=Math.min(t.n,Math.ceil((sHint+60)/t.ds));for(let i=i0;i<=i1;i+=2){const d=(t.X[i]-x)**2+(t.Z[i]-z)**2;if(d<best)best=d}
  for(const f of W3.forks){if(Math.abs(f.s+W3.s0-sHint)>70)continue;const b=f.tr;for(let i=0;i<=b.n;i+=2){const d=(b.X[i]-x)**2+(b.Z[i]-z)**2;if(d<best)best=d}}return Math.sqrt(best)}

// ---------- 질감 (캔버스) ----------
function c3tex(key,size,fn,rep){return c3keep('c3_'+key,()=>{const t=ctx3(cvs(size,size,fn));t.wrapS=t.wrapT=R3.T.RepeatWrapping;t.anisotropy=8;if(rep)t.repeat.set(rep,rep);return t})}
function groundTex(){return c3tex('ground',512,(q,w,h)=>{const R=mulberry(77);q.fillStyle='#211d16';q.fillRect(0,0,w,h);
  for(let i=0;i<2600;i++){const x=R()*w,y=R()*h,r=R()*9+2;q.fillStyle=`rgba(${40+R()*30|0},${34+R()*26|0},${22+R()*14|0},${.25+R()*.35})`;q.beginPath();q.arc(x,y,r,0,7);q.fill()} // 흙덩이
  for(let i=0;i<500;i++){const x=R()*w,y=R()*h;q.fillStyle=`rgba(${48+R()*30|0},${62+R()*40|0},${28+R()*20|0},${.25+R()*.3})`;q.beginPath();q.ellipse(x,y,R()*26+6,R()*16+4,R()*3,0,7);q.fill()} // 이끼
  q.lineCap='round';for(let i=0;i<4200;i++){const x=R()*w,y=R()*h,a=R()*7,l=R()*9+4;q.strokeStyle=`rgba(${70+R()*50|0},${48+R()*30|0},${26+R()*16|0},${.35+R()*.4})`;q.lineWidth=R()*1.2+.5;q.beginPath();q.moveTo(x,y);q.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);q.stroke()} // 솔잎
  for(let i=0;i<60;i++){const x=R()*w,y=R()*h,r=R()*5+2;q.fillStyle='rgba(90,86,80,.55)';q.beginPath();q.ellipse(x,y,r,r*.7,R()*3,0,7);q.fill()}}) } // 돌멩이
function pathTex(){return c3tex('path',256,(q,w,h)=>{const R=mulberry(91);const g=q.createLinearGradient(0,0,w,0);g.addColorStop(0,'rgba(58,46,32,0)');g.addColorStop(.22,'rgba(70,56,40,.85)');g.addColorStop(.5,'rgba(84,68,48,1)');g.addColorStop(.78,'rgba(70,56,40,.85)');g.addColorStop(1,'rgba(58,46,32,0)');q.fillStyle=g;q.fillRect(0,0,w,h);
  for(let i=0;i<900;i++){const x=w*(.15+R()*.7),y=R()*h,r=R()*3+.6;q.fillStyle=`rgba(${100+R()*40|0},${86+R()*30|0},${60+R()*20|0},${.35*(1-Math.abs(x/w-.5)*1.6)})`;q.beginPath();q.arc(x,y,r,0,7);q.fill()}
  for(let i=0;i<14;i++){const y=R()*h,x=w*(.3+R()*.4);q.fillStyle='rgba(30,22,14,.35)';q.beginPath();q.ellipse(x,y,7,12,0,0,7);q.fill()} // 발자국
  for(let i=0;i<5;i++){q.strokeStyle='rgba(44,32,20,.55)';q.lineWidth=3+R()*3;q.beginPath();const y=R()*h;q.moveTo(0,y);q.bezierCurveTo(w*.3,y+R()*20-10,w*.6,y+R()*20-10,w,y+R()*30-15);q.stroke()}})} // 뿌리
function ribbonTex(){return c3keep('c3_ribbon',()=>ctx3(cvs(64,256,(q,w,h)=>{q.fillStyle='#b01c14';q.fillRect(0,0,w,h);for(let i=0;i<300;i++){q.fillStyle=`rgba(0,0,0,${Math.random()*.25})`;q.fillRect(Math.random()*w,Math.random()*h,2,6)}q.fillStyle='rgba(255,255,255,.08)';q.fillRect(0,0,w*.2,h)})))}

// ---------- 숲 장면 만들기 (하루마다 새로) ----------
// 바람: 위로 갈수록 흔들림 (InstancedMesh 정점 셰이더에 끼워 넣음)
function windify(mat,h,amp,key){mat.onBeforeCompile=sh=>{sh.uniforms.uT=F3.uT;sh.vertexShader='uniform float uT;\n'+sh.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
  float hh=clamp(position.y/${h.toFixed(3)},0.,1.);vec3 ip=vec3(0.);
  #ifdef USE_INSTANCING
  ip=instanceMatrix[3].xyz;
  #endif
  float ph=ip.x*.31+ip.z*.27;transformed.x+=(sin(uT*1.3+ph)+.4*sin(uT*3.1+ph*2.))*hh*hh*${amp.toFixed(3)};transformed.z+=cos(uT*1.1+ph*1.3)*hh*hh*${(amp*.6).toFixed(3)};`)};mat.customProgramCacheKey=()=>'wind'+key}
function grassGeo(){const T=R3.T,R=mulberry(5),P=[],C=[],I=[];let v=0;
  for(let b=0;b<12;b++){const a=R()*6.28,r=R()*.3,x=Math.cos(a)*r,z=Math.sin(a)*r,h=.16+R()*.26,w=.022+R()*.02,ry=R()*6.28,bend=(R()-.5)*.25,cx2=Math.cos(ry)*w,cz2=Math.sin(ry)*w,bx=Math.cos(ry+1.57)*bend,bz=Math.sin(ry+1.57)*bend;
    P.push(x-cx2,0,z-cz2, x+cx2,0,z+cz2, x+cx2*.4+bx*.5,h*.55,z+cz2*.4+bz*.5, x-cx2*.4+bx*.5,h*.55,z-cz2*.4+bz*.5, x+bx,h,z+bz);
    const d=.6+R()*.5,y=R()<.25;C.push(.06*d,.07*d,.035*d, .06*d,.07*d,.035*d, .2*d,.26*d,.1*d, .2*d,.26*d,.1*d, (y?.5:.34)*d,(y?.46:.44)*d,(y?.2:.16)*d);
    I.push(v,v+1,v+2, v,v+2,v+3, v+3,v+2,v+4);v+=5}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(P,3));g.setAttribute('color',new T.Float32BufferAttribute(C,3));g.setIndex(I);g.computeVertexNormals();return g}
function skyMat(){const T=R3.T;return new T.ShaderMaterial({side:T.BackSide,depthWrite:false,fog:false,uniforms:{top:{value:new T.Color()},hor:{value:new T.Color()},glow:{value:new T.Color()},gd:{value:new T.Vector3(0,0,-1)}},
  vertexShader:'varying vec3 vD;void main(){vD=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_Position.z=gl_Position.w;}',
  fragmentShader:'uniform vec3 top,hor,glow,gd;varying vec3 vD;void main(){float y=clamp(vD.y,0.,1.);vec3 c=mix(hor,top,pow(y,.55))*smoothstep(-.25,.02,vD.y);float g=pow(max(dot(normalize(vec3(vD.x,0.,vD.z)),normalize(vec3(gd.x,0.,gd.z))),0.),6.)*(1.-smoothstep(0.,.35,y));c+=glow*g;gl_FragColor=vec4(c,1.);}'})}
function dispose3(W3){const keep=new Set();for(const k in PROP3){if(PROP3[k].geo)keep.add(PROP3[k].geo);if(PROP3[k].mat)keep.add(PROP3[k].mat)}
  for(const k in W3.mons||{}){const I=W3.mons[k];if(I&&I.g.parent)I.g.parent.remove(I.g);const j=MON.list.indexOf(I);if(j>=0)MON.list.splice(j,1)}
  W3.sc.traverse(o=>{if(o.geometry&&!keep.has(o.geometry))o.geometry.dispose();const m=o.material;if(!m||keep.has(m)||m.userData.keep)return;(Array.isArray(m)?m:[m]).forEach(x=>{if(x.map&&!x.map.userData.keep&&!keep.has(x))x.map.dispose();x.dispose()})})}
function build3D3(day){const T=R3.T;if(F3.w&&F3.w.day===day&&F3.w.sc)return F3.w;if(F3.w&&F3.w.sc)dispose3(F3.w);
  const W3=buildWorld3(day),R=W3.R,sc=new T.Scene();W3.sc=sc;W3.mons={};F3.w=W3;F3.uT=F3.uT||{value:0};
  sc.fog=new T.FogExp2(0x1a1c22,.03);sc.background=new T.Color(0x05070a);
  W3.sky=new T.Mesh(new T.SphereGeometry(180,24,12),skyMat());W3.sky.renderOrder=-10;W3.sky.frustumCulled=false;sc.add(W3.sky);
  W3.hemi=new T.HemisphereLight(0x8a90a8,0x1a160f,.6);sc.add(W3.hemi);
  W3.moon=new T.DirectionalLight(0x9aa8c8,.25);W3.moon.position.set(40,80,30);sc.add(W3.moon);
  W3.torch=new T.SpotLight(0xfff0d8,0,40,.46,.55,1.2);sc.add(W3.torch);sc.add(W3.torch.target);
  W3.lan=new T.PointLight(0xffa04a,0,10,1.7);sc.add(W3.lan); // 파수꾼 랜턴
  const hg=W3.hg,M=W3.main,s0=W3.s0;
  // 땅: 길을 따라 넓은 띠 (질감은 세상 좌표로)
  {const offs=[-70,-48,-34,-24,-17,-12,-8.5,-6,-4,-2.6,-1.5,-.7,0,.7,1.5,2.6,4,6,8.5,12,17,24,34,48,70],P=[],U=[],I=[],step=3;let rows=0;
   for(let s=0;s<=M.len;s+=step){const p=trkAt(M,s),nx=-p.tz,nz=p.tx;offs.forEach(o=>{const x=p.x+nx*o,z=p.z+nz*o;P.push(x,hg(x,z),z);U.push(x/5,z/5)});rows++}
   const nc=offs.length;for(let r=0;r<rows-1;r++)for(let c=0;c<nc-1;c++){const a=r*nc+c;I.push(a,a+1,a+nc,a+1,a+nc+1,a+nc)}
   const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(P,3));g.setAttribute('uv',new T.Float32BufferAttribute(U,2));g.setIndex(I);g.computeVertexNormals();
   const m=new T.Mesh(g,MS({map:groundTex(),roughness:1,color:0xd8d0c0}));m.receiveShadow=true;sc.add(m);W3.ground=m}
  // 길 띠
  const ribbon=(tr,a0,a1,fadeIn)=>{const P=[],U=[],I=[],A=[];let rows=0;for(let s=a0;s<=a1;s+=.8){const p=trkAt(tr,s),nx=-p.tz,nz=p.tx,wd=.95+.18*Math.sin(s*.37);[-1,1].forEach(k=>{const x=p.x+nx*wd*k,z=p.z+nz*wd*k;P.push(x,hg(x,z)+.05,z);U.push(k<0?0:1,s/3)});rows++}
    for(let r=0;r<rows-1;r++){const a=r*2;I.push(a,a+1,a+2,a+1,a+3,a+2)}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(P,3));g.setAttribute('uv',new T.Float32BufferAttribute(U,2));g.setIndex(I);g.computeVertexNormals();
    const m=new T.Mesh(g,MS({map:pathTex(),transparent:true,depthWrite:false,roughness:1,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2,color:0xb0a898}));m.renderOrder=1;m.receiveShadow=true;sc.add(m);return m};
  ribbon(M,0,M.len);W3.forks.forEach(f=>{f.rib=ribbon(f.tr,f.b0-.5,f.tr.len-2)});
  // 나무·덤불·바위·통나무: 길에서 떨어진 곳에 흩뿌림. 25m 덩어리(chunk)마다 따로 그려서 먼 덩어리는 아예 안 그림
  const q=SET.quality==='low'?.6:SET.quality==='high'?1.15:MOB?.75:1,CH=25,chunks=[],hash=new Map(),hk=(x,z)=>Math.round(x/2.1)+','+Math.round(z/2.1),camp=W3.camp;
  const free=(x,z,s,cl)=>{if(hash.has(hk(x,z)))return false;if(Math.hypot(x-camp.x,z-camp.z)<(day===5?11:9.5))return false;if(Math.hypot(x,z-6)<3.5)return false;return pathDist(W3,x,z,s)>=cl};
  const put=(k,s,x,z,ry,sx,sy,sz,tilt)=>{const c=Math.max(0,Math.floor(s/CH));(chunks[c]||(chunks[c]={s:c*CH+CH/2,L:{}}));(chunks[c].L[k]||(chunks[c].L[k]=[])).push([x,hg(x,z)-(k==='pine'||k==='dead'?.25:k==='log'?-.05:.08),z,ry,sx,sy,sz,tilt||0])};
  for(let s=0;s<=M.len;s+=2.4){const p=trkAt(M,s),nx=-p.tz,nz=p.tx;
    for(const sd of[-1,1])for(let d=2.6;d<52;d+=2.3){if(R()>.48*q+.08)continue;const dd=d+(R()-.5)*1.9,x=p.x+nx*sd*dd+(R()-.5)*1.6,z=p.z+nz*sd*dd+(R()-.5)*1.6,r=R();
      let k=r<.7?'pine':r<.78?'dead':r<.9?'bush':r<.96?'rock':'log';if(dd<6&&k==='pine'&&R()<.5)k='bush';
      const cl={pine:3.4,dead:3,bush:1.7,rock:2.3,log:3.2}[k];if(!free(x,z,s,cl))continue;hash.set(hk(x,z),1);
      if(k==='pine'){const h=rnd(10,17)/PROP3.pine.h,w=h*rnd(.85,1.15);put(k,s,x,z,R()*6.28,w,h,w)}
      else if(k==='dead'){const h=rnd(5,8.5)/PROP3.dead.h;put(k,s,x,z,R()*6.28,h,h,h)}
      else if(k==='bush'){const h=rnd(.8,1.6)/PROP3.bush.h;put(k,s,x,z,R()*6.28,h*rnd(.9,1.3),h,h*rnd(.9,1.3))}
      else if(k==='rock'){const w=rnd(.9,2.4)/PROP3.rock.w;put(k,s,x,z,R()*6.28,w,w*rnd(.6,1.1),w,(R()-.5)*.3)}
      else{const w=rnd(3.2,5)/PROP3.log.w;put(k,s,x,z,R()*6.28,w,w,w,(R()-.5)*.08)}}}
  const mat4=new T.Matrix4(),qq=new T.Quaternion(),e=new T.Euler(),v1=new T.Vector3(),v2=new T.Vector3();
  const mats={};for(const k of['pine','dead','bush','rock','log']){const m=PROP3[k].mat.clone();if(k==='pine')windify(m,PROP3.pine.h,.05,'p');if(k==='bush')windify(m,PROP3.bush.h,.05,'b');mats[k]=m}
  // 가까운 것만 진짜 모델, 먼 나무는 미리 찍어 둔 그림(판)으로. 0.15초마다 다시 고름 (lod3)
  const LOD={pine:[15,68,80,1300],dead:[12,68,14,300],bush:[20,0,90,0],rock:[22,0,40,0],log:[24,0,30,0]};W3.lod={};
  for(const k in LOD){const [rn,rf,cn,cf]=LOD[k],near=new T.InstancedMesh(PROP3[k].geo,mats[k],cn);near.count=0;near.frustumCulled=false;near.receiveShadow=true;sc.add(near);
    let far=null;if(rf){const im=impostor3(k),pm=new T.MeshLambertMaterial({map:im.tex,alphaTest:.45,side:T.DoubleSide});billboard(pm);const pg=new T.PlaneGeometry(im.w,im.h);pg.translate(0,im.h/2,0);far=new T.InstancedMesh(pg,pm,cf);far.count=0;far.frustumCulled=false;sc.add(far)}
    W3.lod[k]={rn,rf,near,far,cn,cf}}
  chunks.forEach(c=>{if(!c)return;c.M={};c.B={};for(const k in c.L){const L=c.L[k],A=new Float32Array(L.length*16),Bb=new Float32Array(L.length*16),P=new Float32Array(L.length*2);
    L.forEach((a,i)=>{e.set(a[7],a[3],a[7]*.7);qq.setFromEuler(e);mat4.compose(v1.set(a[0],a[1],a[2]),qq,v2.set(a[4],a[5],a[6]));mat4.toArray(A,i*16);const hs=a[5]*PROP3[k].h/(PROP3[k].imp?PROP3[k].imp.h:1);mat4.compose(v1,qq.identity(),v2.set(hs,hs,hs));mat4.toArray(Bb,i*16);P[i*2]=a[0];P[i*2+1]=a[2]});
    c.M[k]=A;c.B[k]=Bb;c[k+'P']=P}});
  F3.lodT=0;
  // 풀: 길가에 수북이, 멀어질수록 듬성듬성
  {const gg=grassGeo(),gm=new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide});windify(gm,.6,.09,'g');
   chunks.forEach((c,ci)=>{if(!c)return;const L=[];for(let s=ci*CH;s<ci*CH+CH;s+=.32){const p=trkAt(M,s),nx=-p.tz,nz=p.tx;for(const sd of[-1,1])for(let k=0;k<3;k++){const d=1.05+Math.pow(R(),1.6)*15;if(R()>Math.exp(-(d-1)/7)*q)continue;const x=p.x+nx*sd*d+(R()-.5),z=p.z+nz*sd*d+(R()-.5);if(pathDist(W3,x,z,s)<.95)continue;L.push([x,hg(x,z),z,R()*6.28,rnd(.7,1.4)])}}
     if(!L.length)return;const im=new T.InstancedMesh(gg,gm,L.length);L.forEach((a,i)=>{qq.setFromAxisAngle(v1.set(0,1,0),a[3]);mat4.compose(v2.set(a[0],a[1],a[2]),qq,new T.Vector3(a[4],a[4]*rnd(.8,1.2),a[4]));im.setMatrixAt(i,mat4)});im.computeBoundingSphere();im.receiveShadow=true;c.gr=im;sc.add(im)})}
  W3.chunks=chunks;W3.CH=CH;
  // 갈림길: 낡은 표지판 + 빨간 리본(맞는 길) / 4일 차부터 바랜 흰 리본(틀린 길)
  W3.forks.forEach(f=>{const a=trkAt(M,f.s+s0+5),b=trkAt(f.tr,f.b0+5),sx=(a.x+b.x)/2,sz=(a.z+b.z)/2,j=trkAt(M,f.s+s0);
    const sg=new T.Mesh(PROP3.sign.geo,PROP3.sign.mat);const ss=2.1/PROP3.sign.h;sg.scale.setScalar(ss);sg.position.set(sx,hg(sx,sz)-.1,sz);sg.rotation.set(.05,Math.atan2(j.x-sx,j.z-sz),-.06);sg.castShadow=true;sc.add(sg);
    const tie=(tr,s,col,side)=>{const p=trkAt(tr,s),x=p.x-p.tz*side*1.45,z=p.z+p.tx*side*1.45,g=grp(x,hg(x,z),z,R()*6,sc);CYL(.045,.06,1.55,MS({color:0x3a2c1e,roughness:1}),0,.72,0,g,8);
      const rb=MS({map:ribbonTex(),color:col,roughness:.9,side:T.DoubleSide});const band=mesh(new T.CylinderGeometry(.056,.056,.06,10,1,true),rb,0,1.42,0,g);
      const tails=[0,1].map(k=>{const t=mesh(new T.PlaneGeometry(.05,.42,1,4),rb,.06,1.2,(k-.5)*.04,g);t.geometry.translate(0,-.17,0);t.position.y=1.42;t.rotation.z=.15+k*.2;return t});f.tails=(f.tails||[]).concat(tails);return g};
    // 맞는 길: 본 길(바깥쪽) / 틀린 길: 갈림길
    tie(M,f.s+s0+3.2,0xffffff,-f.side);if(f.fake)tie(f.tr,f.b0+3.2,0x8a8478,f.side)});
  // 야영지 (5일째는 숲 끝의 문)
  {const c=W3.camp,dir=Math.atan2(c.tx,c.tz);W3.campDir=dir;
   if(day<5){const tp=PROP3.tent,ts=1.5/tp.h,tx=c.x+c.tx*3.4,tz=c.z+c.tz*3.4;const te=new T.Mesh(tp.geo,tp.mat);te.scale.setScalar(ts);te.position.set(tx,hg(tx,tz)-.04,tz);te.rotation.y=Math.atan2(c.tz,-c.tx);te.castShadow=te.receiveShadow=true;sc.add(te);W3.tentX=te;W3.tentP=new T.Vector3(tx,hg(tx,tz),tz);W3.tentRy=dir;
     const fx=c.x+c.tx*.6-c.tz*1.7,fz=c.z+c.tz*.6+c.tx*1.7,rm=PROP3.rock;for(let k=0;k<8;k++){const a=k/8*6.28,x=fx+Math.cos(a)*.42,z=fz+Math.sin(a)*.42,r=new T.Mesh(rm.geo,rm.mat),s2=rnd(.22,.3)/rm.w;r.scale.set(s2,s2*.7,s2);r.position.set(x,hg(x,z)-.05,z);r.rotation.y=R()*6;sc.add(r)}
     const ash=mesh(new T.CircleGeometry(.36,14),MS({color:0x141210,roughness:1}),fx,hg(fx,fz)+.04,fz,sc,false);ash.rotation.x=-PI2;
     {const d=new T.Mesh(PROP3.dead.geo,mats.dead);const h=6.5/PROP3.dead.h;d.scale.setScalar(h);const x=c.x-c.tz*3.2+c.tx*1.5,z=c.z+c.tx*3.2+c.tz*1.5;d.position.set(x,hg(x,z)-.2,z);sc.add(d)}}
   else buildExit3(W3,c,dir)}
  return W3}
// 5일째: 숲 한가운데 혼자 서 있는 문틀. 위에 초록 비상구 등, 문틈으로 노란 형광등 빛
function buildExit3(W3,c,dir){const T=R3.T,sc=W3.sc,x=c.x+c.tx*4,z=c.z+c.tz*4,g=grp(x,W3.hg(x,z),z,dir+Math.PI,sc);W3.exitG=g;W3.exitP=new T.Vector3(x,W3.hg(x,z),z);
  const fr=MS({color:0x4a4a44,roughness:.6,metalness:.4}),door=MS({color:0x3e3f3a,roughness:.5,metalness:.45});
  BOX(.12,2.25,.16,fr,-.53,1.12,0,g);BOX(.12,2.25,.16,fr,.53,1.12,0,g);BOX(1.18,.12,.16,fr,0,2.28,0,g);
  const hinge=grp(-.47,0,.02,0,g);W3.exitDoor=hinge;BOX(.94,2.18,.05,door,.47,1.1,0,hinge);CYL(.03,.03,.1,MS({color:0x2a2a26,metalness:.7,roughness:.3}),.84,1.05,.05,hinge,10).rotation.x=PI2;hinge.rotation.y=.06;
  BOX(.46,.24,.06,MS({color:0x202020}),0,2.5,0,g);mesh(new T.PlaneGeometry(.42,.2),new T.MeshBasicMaterial({map:exitTex(),fog:false}),0,2.5,.035,g,false);
  const gl=mesh(new T.BoxGeometry(.92,2.12,1.6),new T.MeshBasicMaterial({color:0xfff0b4,fog:false,side:T.BackSide}),0,1.06,-.84,g,false);W3.exitGlow=gl;
  W3.exitL=new T.PointLight(0xffe7a0,6,14,1.6);W3.exitL.position.set(0,1.3,-.8);g.add(W3.exitL);W3.exitS=new T.PointLight(0x30ff70,1.5,6,1.8);W3.exitS.position.set(0,2.5,-.3);g.add(W3.exitS)}

// ---------- 하루 시작 ----------
function newDay3(n,phase){
  S={ch:3,paCD:0,night:n,t:0,power:100,san:100,view:1,camX:1,mon:false,monA:0,cam:0,door:false,light:true,brk:true,log:false,paused:true,over:false,msgT:0,shake:0,hard:HARD,mods:[],swap:null,torchOff:false,eyes:false,
     bp:false,bpA:0,lockT:0,flickT:0,flOn:true,peek:null,camSw:0,sw:[],sub:0,silT:0,hum:{},shadow:{p:0},
     ph:'walk',ps:0,trk:-1,sb:0,v:0,lb:0,wt:0,stepD:0,yaw:null,fk:0,atFork:false,loopT:0,fade:1,inWalk:false,inBack:false,lateSaid:0,hintT:0,
     dr:{st:'off',timer:rnd(13,18),d:40,wT:0,stepT:0},wc:{st:'off',timer:rnd(28,45)},cl:{st:'off',timer:rnd(45,70),after:0},
     brH:false,breath:1,tn:null};
  ['end','start','devp','log','brkp'].forEach(id=>$(id)&&$(id).classList.remove('show'));jump=0;document.body.classList.remove('scare');
  if(!R3.ok){setMode('end');showEnd('3D 필요','챕터 3은 3D로만 할 수 있어요.\n('+(R3.why||'3D 불러오는 중')+')','메인 메뉴',toMenu);return}
  const go=()=>{if(!S||S.night!==n||S.ch!==3)return;build3D3(n);setMode('game');buildUI();updHUD();
    if(phase==='tent'){startTent3(true);return}
    if(DEV.on&&DEV.cut3){const id=DEV.cut3;DEV.cut3=null;S.paused=false;S.fade=0;S.fadeTo=0;if(id==='intro'){cut3('intro',toMenu);return}S.ps=F3.w.L-.4;S.wt=DUSK3[n]*.9;S.yaw=null;camWalk3();if(id==='pitch')cut3('pitch',toMenu);else cut3('exit',()=>end3());return}
    if(n===1&&!INTRO3&&!DEV.on){INTRO3=1;try{localStorage.setItem('obs3_intro','1')}catch(e){}cut3('intro',()=>dayCard3(n,1))}else dayCard3(n)};
  if(!F3.ready){setMode('end');$('endTitle').textContent='';$('endText').textContent='숲 불러오는 중...';$('endBtn').style.display='none';$('end').classList.add('show');
    c3Load().then(()=>{$('endBtn').style.display='';$('end').classList.remove('show');go()});return}
  go()}
// "N일 차" 글자 → 쪽지(규칙) → 닫으면 걷기 시작
function dayCard3(n,keep){S.ph='walk';S.cut=null;S.yaw=null;if(!keep)S.fade=1;S.fadeTo=0;const tx=n+'일 차',el=$('introSmall');$('introBig').textContent=n===5?'숲의 끝':'해 지기 전에';el.textContent='';let k=0;const iv=setInterval(()=>{k++;el.textContent=tx.slice(0,k);if(k>=tx.length)clearInterval(iv)},40);
  const it=$('intro');it.classList.remove('show');void it.offsetWidth;it.classList.add('show');
  setTimeout(()=>{it.classList.remove('show');if(S&&S.night===n&&!S.over&&mode==='game'&&S.ch===3){openLog();if(n===1)S.hintT=9}},DEV.on?600:2300)}

// ---------- 걷기 ----------
const W3c=()=>F3.w;
function onTrk(){const W3=F3.w;return S.trk<0?trkAt(W3.main,S.ps+W3.s0):trkAt(W3.forks[S.trk].tr,W3.forks[S.trk].b0+S.sb)}
function trkS(){const W3=F3.w;return S.trk<0?S.ps+W3.s0:W3.forks[S.trk].s+W3.s0+S.sb} // 덩어리 고르기용 (본 길 기준)
function behind(d){const W3=F3.w;if(S.trk>=0){const f=W3.forks[S.trk];if(d<=S.sb)return trkAt(f.tr,f.b0+S.sb-d);return trkAt(W3.main,f.s+W3.s0-(d-S.sb))}return trkAt(W3.main,S.ps-d+W3.s0)}
function walk3(dt){const W3=F3.w,n=S.night;S.wt+=dt;
  if(S.hintT>0)S.hintT-=dt;
  const back=S.inBack&&!S.atFork&&S.loopT<=0;S.lb=Math.max(0,Math.min(1,S.lb+(back?1:-1)*dt*3.2));
  const can=S.inWalk&&S.lb<.04&&!S.atFork&&S.loopT<=0&&S.ph==='walk';S.v+=((can?WALK_V*(S.hard?1.04:1):0)-S.v)*Math.min(1,dt*(can?4:7));if(S.v<.02)S.v=0;
  if(S.trk<0){S.ps+=S.v*dt;const f=W3.forks[S.fk];if(f&&S.ps>=f.s-1.3){S.ps=f.s-1.3;if(!S.atFork){S.atFork=true;S.v=0;if(!S.forkSaid){S.forkSaid=1;say('갈림길. 리본이 묶인 쪽으로.','',3)}}}
    if(S.ps>=W3.L-.4){S.ps=W3.L-.4;arrive3();return}}
  else{S.sb+=S.v*dt;if(S.sb>15&&S.loopT<=0){S.loopT=1.1;sting(0);nburst(300,.6,1.2,.25,0,0,'lowpass')}}
  if(S.loopT>0){const was=S.loopT;S.loopT-=dt;if(was>.55&&S.loopT<=.55){const f=W3.forks[S.trk];S.trk=-1;S.sb=0;S.ps=f.s-30;S.yaw=null;S.dr.d=Math.max(S.dr.d,20);say(['...여기 아까 지나온 데다.','같은 나무. 같은 표지판.','또 여기야.'][Math.min(2,S.loops=(S.loops||0)+1)-1],'bad',3)}}
  S.stepD+=S.v*dt;if(S.stepD>.74){S.stepD=0;S.foot=-(S.foot||1);leafStep(S.foot*.12,.16+S.v*.05);if(S.dr.st==='come'&&S.cl.st!=='call')deerStep(S.dr.d,.15+rnd(0,.06))} // 사슴머리 발소리는 내 발소리 바로 뒤에 겹침
  if(S.wt>DUSK3[n]*.82&&!S.lateSaid){S.lateSaid=1;say('해가 거의 졌다. 서둘러야 해.','',3)}
  deer3(dt);wood3(dt);caller3(dt)}
function chooseFork(main){const W3=F3.w,f=W3.forks[S.fk];if(!f||!S.atFork)return;S.atFork=false;leafStep(0,.2);
  if(main){S.fk++}else{S.trk=S.fk;S.sb=0}}
// 사슴머리: 뒤에서 따라옴. 안 보고 있으면 다가오고, 돌아보면 그 자리에 굳음 → 계속 보고 있으면 숲으로 사라짐
function deer3(dt){const d=S.dr,n=S.night,calm=S.cl.st==='call'||S.cl.after>0;
  if(d.st==='off'){if(S.ps>12&&!calm&&!S.atFork)d.timer-=dt;if(d.timer<=0){d.st='come';d.d=rnd(36,42);d.wT=0;d.stepT=0}return}
  if(d.st==='come'){const see=S.lb>.85&&d.d<30;if(see){d.wT+=dt;if(d.wT>1.15){d.st='leave';d.lT=0;d.side=Math.random()<.5?-1:1;thump(70,.2,.12,0);nburst(900,1,.5,.08,0)}return}d.wT=Math.max(0,d.wT-dt*2);
    if(calm||S.loopT>0)return;const vd=(1.8+n*.1)*(S.hard?1.15:1);d.d=Math.min(46,d.d-(vd-S.v)*dt);
    if(S.v<.3){d.stepT-=dt;if(d.stepT<=0){d.stepT=.6;deerStep(d.d,0)}} // 내가 멈춰도 발소리는 계속됨
    if(d.d<1.3)return die('사슴머리');return}
  if(d.st==='leave'){d.lT+=dt;if(d.lT>2.8){d.st='off';d.timer=Math.max(9,rnd(16,25)-n*1.3)*(S.hard?.8:1)}}}
// 나무꾼: 앞쪽 길 한가운데에 서 있음. 그동안 걸어서 가까이 가면 달려듦. 멈춰 있으면 숲으로 들어감
function wood3(dt){const w=S.wc,W3=F3.w,n=S.night;if(n<2)return;
  if(w.st==='off'){const f=W3.forks[S.fk],nearFork=f&&f.s-S.ps<40;if(S.trk<0&&!S.atFork&&!nearFork&&S.ps>25&&S.ps<W3.L-45)w.timer-=dt;
    if(w.timer<=0&&(S.dr.st!=='come'||S.dr.d>18)&&S.cl.st!=='call'){const a=trkAt(W3.main,S.ps+W3.s0),b=trkAt(W3.main,S.ps+W3.s0+23),dx=b.x-a.x,dz=b.z-a.z,l=Math.hypot(dx,dz);if((dx*a.tx+dz*a.tz)/l<.94){w.timer=1.5;return}w.st='stand';w.s=S.ps+rnd(22,24);w.wait=0;w.need=rnd(6,8.5)*(S.hard?1.2:1);axeTok(.18);setTimeout(()=>{if(S&&S.wc.st==='stand')axeTok(.14)},700)}return}
  const dist=w.s-S.ps;
  if(w.st==='stand'){if(S.trk>=0){w.st='off';w.timer=rnd(20,30);return}if(S.v>.25&&dist<12.5){w.st='charge';w.t=0;scrapeAxe();return}
    if(S.v<.12)w.wait+=dt;if(w.wait>w.need){w.st='leave';w.lT=0;w.side=Math.random()<.5?-1:1;leafStep(w.side*.4,.12)}return}
  if(w.st==='charge'){w.t+=dt;w.s-=dt*(w.t<.35?0:7.5);if(w.t>.95)return die('나무꾼');return}
  if(w.st==='leave'){w.lT+=dt;if(w.lT>3.2){w.st='off';w.timer=rnd(38,55)-n*2}}}
// 부르는 것 (3일 차~): 뒤에서 부름. 돌아보면 죽음. 부르는 동안·직후엔 사슴머리가 안 움직임
const CALL3=[['...저기요.',0],['...잠깐만 서 봐요.',2.3],['뒤에. 여기 있어.',4.6]];
function caller3(dt){const c=S.cl,n=S.night;if(n<3)return;if(c.after>0)c.after-=dt;
  if(c.st==='off'){if(!S.atFork&&S.loopT<=0&&S.ps>20)c.timer-=dt;if(c.timer<=0&&S.lb<.02&&(S.dr.st!=='come'||S.dr.d>22)&&S.wc.st!=='charge'){c.st='call';c.t=0;c.i=0}return}
  c.t+=dt;while(c.i<CALL3.length&&c.t>=CALL3[c.i][1]){say(CALL3[c.i][0],'voice',2.2);whisperBehind(.16+c.i*.05);c.i++}
  if(S.lb>.22)return die('부르는 것');
  if(c.t>7.2){c.st='off';c.timer=rnd(45,65)-n*3;c.after=3;say('(조용해졌다.)','',2)}}
function arrive3(){const W3=F3.w;S.v=0;S.inWalk=false;S.late=S.wt>DUSK3[S.night];
  if(S.night>=5){cut3('exit',()=>end3());return}
  cut3('pitch',()=>startTent3(false))}

// 먼 나무 그림: 모델을 옆에서 한 번 찍어 둠 (투명 배경)
function impostor3(k){const P=PROP3[k];if(P.imp)return P.imp;const T=R3.T,rd=R3.rd,sc=new T.Scene(),bw=P.w*1.05,bh=P.h*1.02,tw=k==='pine'?128:192,th=256;
  const cam=new T.OrthographicCamera(-bw/2,bw/2,bh,0,-50,50);cam.position.set(0,0,10);cam.lookAt(0,0,0);sc.add(new T.HemisphereLight(0xffffff,0x404040,1.6));const dl=new T.DirectionalLight(0xffffff,1.4);dl.position.set(.4,1,1);sc.add(dl);
  const m=new T.Mesh(P.geo,P.mat);sc.add(m);const rt=new T.WebGLRenderTarget(tw,th,{minFilter:T.LinearFilter,magFilter:T.LinearFilter});const prev=rd.getRenderTarget(),cc=rd.getClearColor(new T.Color()),ca=rd.getClearAlpha();
  rd.setRenderTarget(rt);rd.setClearColor(0x000000,0);rd.clear();rd.render(sc,cam);rd.setRenderTarget(prev);rd.setClearColor(cc,ca);sc.remove(m);rt.texture.userData.keep=true;
  P.imp={tex:rt.texture,w:bw,h:bh};return P.imp}
// 판이 항상 카메라 쪽을 보게 (세로축으로만 돎)
function billboard(mat){mat.onBeforeCompile=sh=>{sh.uniforms.uR=F3.uR||(F3.uR={value:new R3.T.Vector3(1,0,0)});sh.vertexShader='uniform vec3 uR;\n'+sh.vertexShader.replace('#include <begin_vertex>','vec3 transformed=vec3(position.x*uR.x,position.y,position.x*uR.z);').replace('#include <beginnormal_vertex>','vec3 objectNormal=normalize(vec3(-uR.z,0.,uR.x));')};mat.customProgramCacheKey=()=>'bb'}
function lod3(ts){const W3=F3.w,cam=R3.cam;if(!W3.lod)return;F3.lodT-=1/60;const T=R3.T;if(F3.uR){const r=new T.Vector3(1,0,0).applyQuaternion(cam.quaternion);r.y=0;r.normalize();F3.uR.value.copy(r)}
  if(F3.lodT>0&&!F3.lodForce)return;F3.lodT=.15;F3.lodForce=0;const cx2=cam.position.x,cz2=cam.position.z;
  for(const k in W3.lod){const L=W3.lod[k],rn2=L.rn*L.rn,rf2=L.rf*L.rf;let nn=0,nf=0;const na=L.near.instanceMatrix.array,fa=L.far?L.far.instanceMatrix.array:null;
    for(const c of W3.chunks){if(!c||!c.M[k]||Math.abs(c.s-ts)>(L.rf||L.rn)+40)continue;const P=c[k+'P'],A=c.M[k],B=c.B[k];
      for(let i=0;i<P.length/2;i++){const dx=P[i*2]-cx2,dz=P[i*2+1]-cz2,d2=dx*dx+dz*dz;
        if(d2<rn2){if(nn<L.cn){na.set(A.subarray(i*16,i*16+16),nn*16);nn++}}
        else if(fa&&d2<rf2&&nf<L.cf){fa.set(B.subarray(i*16,i*16+16),nf*16);nf++}}}
    L.near.count=nn;L.near.instanceMatrix.needsUpdate=true;if(L.far){L.far.count=nf;L.far.instanceMatrix.needsUpdate=true}}}
// ---------- 괴물 모델 (이 숲 장면 전용 복제) ----------
function mon3(name,k,fade){const W3=F3.w;let I=W3.mons[name];if(I)return I;if(!monReady(k))return null;I=monNew(k);if(!I)return null;W3.sc.add(I.g);I.g.rotation.order='YXZ';W3.mons[name]=I;
  if(fade)I.o.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.material.transparent=true}});return I}
function monFade(I,a){if(I.op===a)return;I.op=a;I.o.traverse(o=>{if(o.isMesh){o.material.opacity=a;o.material.depthWrite=a>.98}})}
function monHide(I){if(I&&I.g.visible){I.g.visible=false;if(I.mx)I.mx.stopAllAction();I.cur=null}}
function lookYaw(I,x,z){const c=R3.cam.position;I.g.rotation.y=Math.atan2(c.x-x,c.z-z)}
function walkMons3(){const W3=F3.w,hg=W3.hg,d=S.dr,w=S.wc,cam=R3.cam;
  // 사슴머리
  {const I=mon3('deer','deer',1);if(I){if(d.st==='come'||d.st==='leave'){const p=behind(d.d),nx=-p.tz,nz=p.tx;let x=p.x,z=p.z;I.g.visible=true;
      if(d.st==='come'){lookYaw(I,x,z);const a=monPlay(I,'stalk');const see=S.lb>.85&&d.d<30;if(I.acts.stalk)I.acts.stalk.timeScale=see?0:.9;monFade(I,1);I.g.rotation.x=see?.05:0} // 보는 순간 걸음 중간에 그대로 굳음
      else{const k=d.lT;x+=nx*d.side*k*1.15;z+=nz*d.side*k*1.15;I.g.rotation.y=Math.atan2(nx*d.side,nz*d.side);monPlay(I,'walk',{speed:.8});monFade(I,Math.max(0,1-Math.max(0,k-1.2)/1.4))}
      I.g.position.set(x,hg(x,z),z)}else monHide(I)}}
  // 나무꾼
  {const I=mon3('axe','axe',1);if(I){if(S.night>=2&&w.st!=='off'){const p=trkAt(W3.main,w.s+W3.s0),nx=-p.tz,nz=p.tx;let x=p.x,z=p.z;I.g.visible=true;
      if(w.st==='stand'){lookYaw(I,x,z);monPlay(I,'idle');monFade(I,1)}
      else if(w.st==='charge'){lookYaw(I,x,z);monPlay(I,w.t<.35?'charge':'sprint',{speed:1.25,fade:.12});monFade(I,1)}
      else{const k=w.lT;x+=nx*w.side*k*1.1;z+=nz*w.side*k*1.1;I.g.rotation.y=Math.atan2(nx*w.side,nz*w.side);monPlay(I,'walk');monFade(I,Math.max(0,1-Math.max(0,k-1.6)/1.5))}
      I.g.position.set(x,hg(x,z),z)}else monHide(I)}}}

// ---------- 그리기 ----------
const SKY3={dusk:[0x262c3c,0x5a4c50,0x8a5a40],night:[0x020306,0x080a10,0x000000]};
function envMix3(k){const W3=F3.w,T=R3.T,c=(a,b)=>new T.Color(a).lerp(new T.Color(b),k),u=W3.sky.material.uniforms;
  u.top.value.copy(c(SKY3.dusk[0],SKY3.night[0]));u.hor.value.copy(c(SKY3.dusk[1],SKY3.night[1]));u.glow.value.copy(c(SKY3.dusk[2],SKY3.night[2]));
  const fc=c(0x2c2c34,0x07090c);W3.sc.fog.color.copy(fc);W3.sc.fog.density=lerp(.022,.05,k);W3.sc.background.copy(fc);
  W3.hemi.intensity=lerp(2.2,.16,Math.pow(k,.8))*(DEV.on&&DEV.bright?4:1);W3.hemi.color.copy(c(0xb0a8c0,0x6a7a98));W3.hemi.groundColor.copy(c(0x3a3020,0x0c0a08));W3.moon.intensity=lerp(.9,.18,k)}
function draw3D3(){const W3=F3.w,T=R3.T,cam=R3.cam;if(!W3)return;F3.uT.value=T_;
  if(cam.far!==160){cam.far=160;cam.near=.04;cam.updateProjectionMatrix()}
  let k=1;if(S.ph==='walk'||(S.cut&&S.cut.walkK!=null))k=S.cut&&S.cut.walkK!=null?S.cut.walkK:Math.min(1,S.wt/DUSK3[S.night]);if(S.ph==='tent'||S.ph==='dawn')k=1-(S.dawnK||0)*.7;
  envMix3(k);
  if(S.ph==='walk')camWalk3();else if(S.ph==='tent'||S.ph==='dawn')camTent3();else if(S.cut)S.cut.cam&&S.cut.cam();
  const ts=S.ph==='tent'||S.ph==='dawn'||S.inTent?tentS3():S.cut&&S.cut.ts!=null?S.cut.ts:trkS();W3.chunks.forEach(c=>{if(c&&c.gr)c.gr.visible=Math.abs(c.s-ts)<48});lod3(ts);
  W3.sky.position.copy(cam.position);
  if(W3.forks)W3.forks.forEach(f=>(f.tails||[]).forEach((t,i)=>{t.rotation.z=.15+i*.2+Math.sin(T_*2.2+i)*.18;t.rotation.x=Math.sin(T_*1.7+i*2)*.15}));
  // 손전등: 카메라 오른쪽 아래에서 보는 쪽으로
  const fw=new T.Vector3(0,0,-1).applyQuaternion(cam.quaternion);const on=torchOn3();
  W3.torch.position.copy(cam.position).add(new T.Vector3(.12,-.22,0).applyQuaternion(cam.quaternion));W3.torch.target.position.copy(cam.position).addScaledVector(fw,10);
  W3.torch.intensity=on?(S.cut&&S.cut.dim?14:S.ph==='walk'||S.cut&&S.cut.walkK!=null?lerp(25,75,k):S.inTent?6:60)*(S.flick3>0&&Math.random()<.5?.2:1):0;
  if(S.ph==='walk'||(S.cut&&S.cut.mons))walkMons3();else{monHide(W3.mons.deer);monHide(W3.mons.axe)}
  if(S.inTent||S.ph==='tent'||S.ph==='dawn')tentMons3();else tentHide3();
  if(W3.exitL){W3.exitL.intensity=5.5*(Math.random()<.03?.4:1);W3.exitS.intensity=1.4*(Math.random()<.02?.2:1)}
  const fx=fxBegin();R3.rd.render(W3.sc,cam);
  if(S.ph!=='cut'||S.cut&&S.cut.hands){HND.hemi&&HND.hemi.color.setHex(0x8090a8);drawHands(0,false,false)}
  if(fx)fxEnd(cam);cx.drawImage(R3.rd.domElement,0,0,W,H)}
const torchOn3=()=>!S.torchOff&&!(S.cut&&S.cut.dark);
function camWalk3(){const cam=R3.cam,W3=F3.w,p=onTrk(),want=Math.atan2(-p.tx,-p.tz);if(S.yaw==null)S.yaw=want;let dA=want-S.yaw;dA=Math.atan2(Math.sin(dA),Math.cos(dA));S.yaw+=dA*Math.min(1,1/60*3.5);
  const vk=S.v/WALK_V;S.bobP=(S.bobP||0)+S.v/60*1.35;const bob=Math.sin(S.bobP*Math.PI*2)*.035*vk,sw=Math.sin(S.bobP*Math.PI)*.025*vk;
  cam.position.set(p.x-p.tz*sw,W3.hg(p.x,p.z)+1.62+bob,p.z+p.tx*sw);if(S.shake>0){cam.position.x+=rnd(-.015,.015);cam.position.y+=rnd(-.012,.012)}
  const lb=ease(S.lb);cam.rotation.set(-.05+bob*.4-(S.atFork?.06:0)+Math.sin(T_*.6)*.004,S.yaw+Math.PI*lb*(S.lbDir||1)+Math.sin(T_*.37)*.006,Math.sin(S.bobP*Math.PI)*.004*vk)}
function render3(){const T=R3.T;
  if(!F3.w){cx.fillStyle='#000';cx.fillRect(0,0,W,H);return}
  if(S.ph==='office')office3();else draw3D3();
  if(S.ph==='walk')walkUI3();if(S.ph==='tent')tentUI3();
  if(S.loopT>0){const k=1-Math.abs(S.loopT-.55)/.55;cx.save();cx.globalAlpha=Math.min(1,k*1.4);cx.fillStyle='#000';cx.fillRect(0,0,W,H);cx.globalAlpha=k*.6;cx.fillStyle=NPm[ri(4)];cx.fillRect(0,0,W,H);cx.restore()}
  if(S.fadeTo!=null){S.fade+=(S.fadeTo-S.fade)*Math.min(1,1/60*(S.fadeR||2.2));if(Math.abs(S.fade-S.fadeTo)<.004)S.fade=S.fadeTo}
  if(S.fade>.002){cx.fillStyle=`rgba(${S.fadeC||'0,0,0'},${S.fade})`;cx.fillRect(0,0,W,H)}
  post3()}
function post3(){cx.save();cx.globalCompositeOperation='soft-light';cx.globalAlpha=MOB?.12:.25;cx.fillStyle='#24323a';cx.fillRect(0,0,W,H);cx.restore();
  cx.save();cx.globalAlpha=.06*SET.grain;cx.translate(rnd(-128,0),rnd(-128,0));cx.fillStyle=NPm[ri(4)];cx.fillRect(0,0,W+128,H+128);cx.restore();cx.drawImage(VIG,0,0,W,H);
  const d=danger3();if(d>.35){cx.globalAlpha=Math.min(.7,(d-.35)*1.1);cx.drawImage(VIG,-W*.08,-H*.08,W*1.16,H*1.16);cx.globalAlpha=1}}
function danger3(){if(!S)return 0;const d=S.dr,tn=S.tn;let v=0;if(S.ph==='walk'){if(d.st==='come')v=Math.max(v,1-d.d/30);if(S.wc.st==='stand')v=Math.max(v,.4);if(S.cl.st==='call')v=Math.max(v,.85)}
  if(tn){v=Math.max(v,(tn.sh||0)/100,tn.zip&&tn.zip.on?.9:0,tn.ln&&tn.ln.st==='press'?.95:0,tn.st&&tn.st.stage>=4?.8:0)}return v}
// 걷기 화면 위: 갈림길 화살표, 처음 안내
function walkUI3(){const W3=F3.w,T=R3.T,cam=R3.cam;S.forkUI=null;
  if(S.atFork&&S.lb<.05){const f=W3.forks[S.fk],pr=(tr,s)=>{const p=trkAt(tr,s),v=new T.Vector3(p.x,W3.hg(p.x,p.z)+.9,p.z).project(cam);return{x:(v.x+1)/2*W,y:(1-v.y)/2*H,ok:v.z<1}};
    const a=pr(W3.main,f.s+W3.s0+6),b=pr(f.tr,f.b0+6);S.forkUI=[Object.assign(a,{main:true}),Object.assign(b,{main:false})];
    S.forkUI.forEach(o=>{if(!o.ok)return;const hov=!PT.touch&&Math.hypot(PT.x-o.x,PT.y-o.y)<70,a2=hov?1:.75+.2*Math.sin(T_*3);cx.save();cx.translate(o.x,o.y);cx.globalAlpha=a2;cx.strokeStyle='#ece5cd';cx.lineWidth=3;cx.shadowColor='#000';cx.shadowBlur=8;
      const s2=Math.max(16,H*.03);for(let k=0;k<2;k++){cx.beginPath();cx.moveTo(-s2,k*s2*.8+s2*.2);cx.lineTo(0,k*s2*.8-s2*.5);cx.lineTo(s2,k*s2*.8+s2*.2);cx.stroke()}
      cx.restore();tapeLabel('이쪽으로',o.x,o.y+Math.max(16,H*.03)*1.9,a2)})}
  if(S.hintT>0&&!S.log){const a=Math.min(1,S.hintT/1.5)*.9;tapeLabel(MOB?'화면을 누르고 있으면 걷기':'화면을 누르고 있으면 걷기 (W)',W/2,H*.36,a);if(S.hintT<6.5)tapeLabel(MOB?'뒤돌아보기 버튼: 누르는 동안 뒤를 봄':'뒤돌아보기: 버튼 또는 S 꾹',W/2,H*.36+Math.max(13,H*.026)*2.4,Math.min(1,(6.5-S.hintT)/1)*a)}}

CHT[3]={CAMS:['A'],CAMN:['-'],KIND:['p_tun'],ADJ:[[0]],DIST:[1],MAPP:[[50,50]],EXIT_CAM:[-1,-1,-1,-1,-1]};
function buildUI3(){const w=S.ph==='walk',t=S.ph==='tent';document.body.classList.toggle('c3w',S.ph!=='tent'&&S.ph!=='dawn');document.body.classList.toggle('c3t',t);
  $('backBtn').style.display=w&&!S.atFork?'block':'none';$('peekBtn').style.display=t&&S.tn&&S.view===1&&!S.tn.zip.on?'block':'none';
  if(t){$('torchBtn').style.display=handsOn()?'none':'block';$('torchBtn').querySelector('span').textContent=S.torchOff?'손전등 켜기':'손전등 끄기';$('torchBtn').classList.toggle('off',!!S.torchOff);
    $('eyeBtn').style.display='block';$('eyeBtn').querySelector('span').textContent='숨 참기 (꾹)';const sv=$('eyeBtn').querySelector('svg');if(!F3.eyeSvg){F3.eyeSvg=sv.innerHTML;sv.innerHTML='<path d="M6 10.5c1.8-1.6 3.8-2.2 6-2.2s4.2.6 6 2.2"/><path d="M6 13.5c1.8 1.6 3.8 2.2 6 2.2s4.2-.6 6-2.2"/><path d="M4 12h16"/>'}}}
function stop3(){if(F3.eyeSvg){$('eyeBtn').querySelector('svg').innerHTML=F3.eyeSvg;F3.eyeSvg=null;$('eyeBtn').querySelector('span').textContent='눈 감기 (꾹)'}document.body.classList.remove('c3w');document.body.classList.remove('c3t');if(droneG&&AC)droneG.gain.setTargetAtTime(.03,AC.currentTime,.5);['backBtn','peekBtn'].forEach(i=>$(i).style.display='none');if(F3.aud)for(const k in F3.aud)F3.aud[k].gain.setTargetAtTime(0,AC.currentTime,.1);const c=R3.cam;if(c&&c.far!==20){c.far=20;c.near=.03;c.updateProjectionMatrix()}}
function dbg3(){const d=S.dr,t=S.tn;if(t&&(S.ph==='tent'||S.ph==='dawn'))return `[치트] 숲 ${S.night}일 차 · 텐트 · ${DEV.speed}x\n그림자 ${t.sh.toFixed(0)}% · 숨 ${(S.breath*100).toFixed(0)}\n파수꾼: ${t.ln.st} ${t.ln.st==='off'?t.ln.timer.toFixed(0)+'s':''}\n지퍼: ${t.zip.on?t.zip.st+' '+(t.zip.p*100).toFixed(0)+'%':t.zip.timer.toFixed(0)+'s'}\n교대자: ${t.st.stage} (${t.st.timer.toFixed(0)}s)\n목소리: ${t.vo.on?'중':t.vo.timer.toFixed(0)+'s'}`;
  return `[치트] 숲 ${S.night}일 차 · ${S.ph} · ${DEV.speed}x\n걷기 ${S.ps.toFixed(0)}/${F3.w?F3.w.L:0}m · 시간 ${S.wt.toFixed(0)}/${DUSK3[S.night]}s\n사슴머리: ${d.st} ${d.st==='come'?d.d.toFixed(1)+'m':d.timer.toFixed(0)+'s'}\n나무꾼: ${S.wc.st}\n부르는 것: ${S.cl.st}`}
function jumpTent3(){if(!S||S.ch!==3||S.over)return;if(S.ph==='walk'){S.wt=Math.min(S.wt,DUSK3[S.night]-5);startTent3(true)}else if(S.ph==='tent')S.t=HOUR*6-3}
function retry3(){const n=S.night,ph=S.ph==='tent'||S.ph==='dawn'?'tent':'walk';return()=>{newDay3(n,ph)}}

// ---------- 입력 (챕터 3은 여기서 먼저 받아서 처리) ----------
const act3=()=>S&&S.ch===3&&mode==='game'&&!S.over&&!S.paused&&!PAUSE.on&&!S.log&&jump<=0;
addEventListener('pointerdown',e=>{if(e.target!==cv||!S||S.ch!==3||mode!=='game')return;initAudio();if(!act3())return;e.stopPropagation();const p=gameXY(e);PT.touch=e.pointerType!=='mouse';PT.x=p.x;PT.y=p.y;
  if(S.ph==='walk'){if(S.atFork&&S.forkUI){let b=null,bd=1e9;S.forkUI.forEach(o=>{const d=Math.hypot(p.x-o.x,p.y-o.y);if(o.ok&&d<bd){bd=d;b=o}});if(b&&bd<Math.max(110,W*.12)){chooseFork(b.main)}else if(b){const L=S.forkUI.reduce((a,o)=>o.x<a.x?o:a);chooseFork((p.x<W/2)===(L===S.forkUI[0]))}return}
    S.walkId=e.pointerId;S.inWalk=true;return}
  if(S.ph==='tent')tentDown3(p,e)},true);
addEventListener('pointerup',e=>{if(!S||S.ch!==3)return;if(e.pointerId===S.walkId){S.inWalk=false;S.walkId=null}if(S.ph==='tent')tentUp3(e)},true);
addEventListener('pointercancel',e=>{if(!S||S.ch!==3)return;if(e.pointerId===S.walkId){S.inWalk=false;S.walkId=null}if(S.ph==='tent')tentUp3(e)},true);
{const hold=(id,on,off)=>{const b=$(id);b.addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();initAudio();on();b.classList.add('on')});['pointerup','pointerleave','pointercancel'].forEach(k=>b.addEventListener(k,()=>{off();b.classList.remove('on')}));b.addEventListener('contextmenu',e=>e.preventDefault())};
  hold('backBtn',()=>{if(S&&S.ch===3)S.inBack=true},()=>{if(S&&S.ch===3)S.inBack=false});
  hold('peekBtn',()=>{if(S&&S.ch===3)peek3(true)},()=>{if(S&&S.ch===3)peek3(false)})}
const K3={KeyW:'walk',ArrowUp:'walk',KeyS:'back',ArrowDown:'back',Space:'mash',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right',KeyF:'torch',KeyT:'torch',KeyE:'breath',KeyQ:'peek'};
addEventListener('keydown',e=>{if(!S||S.ch!==3||mode!=='game'||KEYWAIT)return;const a=K3[e.code];if(!a)return;e.preventDefault();e.stopImmediatePropagation();if(e.repeat||!act3())return;
  if(S.ph==='walk'){if(a==='walk')S.inWalk=true;else if(a==='back')S.inBack=true;else if((a==='left'||a==='right')&&S.atFork&&S.forkUI){const L=S.forkUI.reduce((x,o)=>o.x<x.x?o:x);chooseFork((a==='left')===L.main)}return}
  if(S.ph==='tent')tentKey3(a,true)},true);
addEventListener('keyup',e=>{if(!S||S.ch!==3)return;const a=K3[e.code];if(!a)return;if(a==='walk')S.inWalk=false;else if(a==='back')S.inBack=false;else if(S.ph==='tent')tentKey3(a,false)},true);
addEventListener('blur',()=>{if(S&&S.ch===3){S.inWalk=S.inBack=false;if(S.ph==='tent'){breath3(false);peek3(false)}}});
// 젖은 쪽지 (규칙). 처음 걷기 전, 일시정지에서 언제든
function openLog3(){const box=$('logText');box.innerHTML='';const el=(c,t)=>{const d=document.createElement('div');d.className=c;d.textContent=t;box.appendChild(d)};
  $('log').classList.add('pool');$('log').classList.add('forest');$('logClose').textContent='접어 넣기';
  el('pl-h','젖은 쪽지');
  if(!MOB){const d=document.createElement('div');d.className='lg-keys';d.innerHTML=[['W 꾹 / 화면 꾹','걷기'],['S 꾹','뒤돌아보기'],['A / D','갈림길 · 텐트에서 고개 돌리기'],['F','손전등'],['E 꾹','숨 참기'],['Q 꾹','틈으로 보기'],['Space','지퍼 연타'],['Esc','일시정지']].map(([k,t])=>`<span><kbd>${k}</kbd>${t}</span>`).join('');box.appendChild(d)}
  RULES3.forEach(([d,a,b])=>{if(d>S.night)return;const r=document.createElement('div');r.className='pl-r'+(d===S.night&&d>1?' new':'');r.innerHTML='<b></b><i>→</i><span></span>';r.querySelector('b').textContent=a;r.querySelector('span').textContent=b;box.appendChild(r)});
  el('pl-f','해 지기 전에 빨간 리본을 따라 야영지까지 · 텐트에선 6시까지');S.log=true;S.inWalk=S.inBack=false;$('log').classList.add('show');buildUI()}

// ===================== 텐트 안 (밤) =====================
// 텐트 안쪽은 따로 만든 천(돔). 바깥 랜턴 빛이 천을 뚫고 비침 + 그 사이에 선 것의 그림자(실루엣)가 천에 맺힘
const TA=1.05,TB=1.15,TH=1.32,TCAM=[0,.8,.48];
function fabricTex(){return c3tex('fabric',512,(q,w,h)=>{const R=mulberry(33);q.fillStyle='#46553a';q.fillRect(0,0,w,h);
  for(let i=0;i<9000;i++){q.fillStyle=`rgba(${R()<.5?0:255},${R()<.5?0:255},${R()<.5?0:255},${R()*.035})`;q.fillRect(R()*w,R()*h,2,2)}
  for(let y=0;y<h;y+=3){q.fillStyle=`rgba(0,0,0,${.03+R()*.02})`;q.fillRect(0,y,w,1)}
  for(let k=0;k<=6;k++){const x=k*w/6;q.fillStyle='rgba(20,26,16,.55)';q.fillRect(x-2,0,4,h);q.fillStyle='rgba(120,140,100,.12)';q.fillRect(x+2,0,1,h)} // 솔기
  const g=q.createLinearGradient(0,h,0,h*.6);g.addColorStop(0,'rgba(40,30,18,.55)');g.addColorStop(1,'rgba(40,30,18,0)');q.fillStyle=g;q.fillRect(0,h*.6,w,h*.4); // 아래쪽 흙탕
  for(let i=0;i<14;i++){const x=R()*w,y=h*(.55+R()*.4),r=R()*30+10;const gg=q.createRadialGradient(x,y,0,x,y,r);gg.addColorStop(0,'rgba(30,24,14,.35)');gg.addColorStop(1,'rgba(30,24,14,0)');q.fillStyle=gg;q.fillRect(x-r,y-r,r*2,r*2)}})}
const GAPV=`varying vec3 vLP;
`,GAPF=`uniform vec3 uGap;varying vec3 vLP;
float gapHW(float y){return y<uGap.x?uGap.y*pow(max(0.,1.-y/uGap.x),.85):0.;}
`,
  GAPD=`if(vLP.z<0.&&vLP.y<uGap.x&&abs(vLP.x)<gapHW(vLP.y))discard;
  float eg=vLP.z<0.&&vLP.y<uGap.x+.02?smoothstep(.022,0.,abs(abs(vLP.x)-gapHW(vLP.y))):0.;
  float zp=vLP.z<0.&&vLP.y>=uGap.x&&vLP.y<1.14&&abs(vLP.x)<.009?1.:0.;
  float dr=vLP.z<0.?length(vec2(vLP.x/.52,max(0.,vLP.y-.55)/.62)):9.;float door=smoothstep(1.02,.98,dr)*step(.02,vLP.y);float seam=vLP.z<0.?smoothstep(.035,0.,abs(dr-1.)):0.;
  zp=max(zp,seam*.7);`;
function tentShellGeo(){const T=R3.T,NU=150,NV=38,n=3.2,P=[],U=[],I=[];
  for(let j=0;j<=NV;j++){const e=j/NV,k=Math.cos(e*PI2),y=TH*Math.pow(Math.sin(e*PI2),.9);for(let i=0;i<=NU;i++){const ph=i/NU*Math.PI*2-PI2,cs=Math.cos(ph),sn=Math.sin(ph);
    const bx=TA*Math.sign(cs)*Math.pow(Math.abs(cs),2/n),bz=TB*Math.sign(sn)*Math.pow(Math.abs(sn),2/n);P.push(bx*k,y,bz*k);U.push(i/NU*6,e*2.2)}}
  for(let j=0;j<NV;j++)for(let i=0;i<NU;i++){const a=j*(NU+1)+i,b=a+NU+1;I.push(a,b,a+1,a+1,b,b+1)}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(P,3));g.setAttribute('uv',new T.Float32BufferAttribute(U,2));g.setIndex(I);g.computeVertexNormals();
  // 바깥을 보게 감았는지 확인 (문 쪽 정점의 법선이 -z여야 함)
  const nz=g.attributes.normal.getZ(NV*0+0);if(nz>0){const ix=g.index.array;for(let t=0;t<ix.length;t+=3){const x=ix[t+1];ix[t+1]=ix[t+2];ix[t+2]=x}g.computeVertexNormals()}
  g.userData.base=Float32Array.from(g.attributes.position.array);g.userData.nrm=Float32Array.from(g.attributes.normal.array);return g}
function tentFrontZ(y){const e=Math.asin(Math.min(1,Math.pow(Math.max(0,y)/TH,1/.9)))/PI2;return -TB*Math.cos(e*PI2)}
function buildTent3(){const W3=F3.w,T=R3.T;if(W3.tn)return W3.tn;const g=grp(W3.tentP.x,W3.tentP.y,W3.tentP.z,W3.tentRy,W3.sc),tn={g};W3.tn=tn;g.visible=false;
  const geo=tentShellGeo();tn.geo=geo;tn.uGap={value:new T.Vector3(.05,0,0)};
  // 1) 안쪽 천: 손전등·달빛
  const m1=MS({map:fabricTex(),roughness:.95,side:T.BackSide,color:0xc8d0b8});
  m1.onBeforeCompile=sh=>{sh.uniforms.uGap=tn.uGap;sh.vertexShader=GAPV+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvLP=position;');
    sh.fragmentShader=GAPF+sh.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\n'+GAPD+'diffuseColor.rgb*=(1.-.7*eg)*(1.-.18*door);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.03,.03,.025),zp);')};m1.customProgramCacheKey=()=>'tent1';
  tn.inner=mesh(geo,m1,0,0,0,g,false);tn.inner.receiveShadow=false;tn.inner.frustumCulled=false;
  // 2) 바깥 빛이 천을 뚫고 들어옴 (덧칠). 랜턴 위치·세기, 실루엣 그림, 새벽빛
  const sil=new T.WebGLRenderTarget(256,256,{minFilter:T.LinearFilter,magFilter:T.LinearFilter});tn.sil=sil;tn.silCam=new T.PerspectiveCamera(110,1,.05,8);tn.silCam.layers.set(3);
  tn.m2=new T.ShaderMaterial({side:T.BackSide,transparent:true,depthWrite:false,blending:T.AdditiveBlending,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1,
    uniforms:{uGap:tn.uGap,map:{value:fabricTex()},uHT:{value:null},uHand:{value:new T.Vector4(0,0,0,0)},uLP:{value:new T.Vector3(0,-50,0)},uLI:{value:0},uSil:{value:sil.texture},uSilM:{value:new T.Matrix4()},uAmb:{value:new T.Vector3(.13,.15,.19)},uM:{value:new T.Matrix4()}},
    vertexShader:GAPV+`varying vec2 vUv;varying vec3 vWP,vWN;uniform mat4 uM;void main(){vUv=uv;vLP=position;vec4 wp=modelMatrix*vec4(position,1.);vWP=wp.xyz;vWN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*wp;}`,
    fragmentShader:GAPF+`uniform sampler2D map,uSil,uHT;uniform vec4 uHand;uniform vec3 uLP,uAmb;uniform float uLI;uniform mat4 uSilM;varying vec2 vUv;varying vec3 vWP,vWN;
void main(){`+GAPD+`vec3 tex=texture2D(map,vUv).rgb;vec3 L=uLP-vWP;float d=length(L);float ndl=max(dot(vWN,L/d),0.);
  float sh=1.;vec4 pc=uSilM*vec4(vWP,1.);if(pc.w>0.){vec2 su=pc.xy/pc.w*.5+.5;if(su.x>0.&&su.x<1.&&su.y>0.&&su.y<1.)sh=texture2D(uSil,su).r;}
  if(uHand.w>0.&&vLP.x*uHand.x>.3){vec2 hu=vec2((vLP.z-uHand.z)*-uHand.x,vLP.y-uHand.y)/.3+.5;if(hu.x>0.&&hu.x<1.&&hu.y>0.&&hu.y<1.)sh*=1.-texture2D(uHT,hu).a*uHand.w;}
  float lan=uLI*ndl/(1.+d*d*.9)*sh;vec3 c=tex*(vec3(1.,.62,.28)*lan*2.6+uAmb*(1.+.5*vWN.y))*(1.-.6*eg)*(1.-zp);gl_FragColor=vec4(c,1.);}`});
  tn.trans=mesh(geo,tn.m2,0,0,0,g,false);tn.trans.renderOrder=2;tn.trans.frustumCulled=false;
  // 바닥 깔개, 침낭, 배낭, 물병, 신발
  const fl=mesh(new T.PlaneGeometry(TA*2.1,TB*2.1),MS({color:0x23271f,roughness:1}),0,.012,0,g,false);fl.rotation.x=-PI2;fl.receiveShadow=true;
  {const sb=mesh(new T.CapsuleGeometry(.27,1.25,6,14),MS({color:0x5a2a1c,roughness:.85}),.18,.1,.25,g);sb.rotation.x=PI2;sb.scale.set(1,1,.33)}
  {const bp=grp(-.7,0,.55,.4,g);BOX(.36,.5,.24,MS({color:0x29333b,roughness:.9}),0,.25,0,bp);BOX(.3,.16,.05,MS({color:0x1d252b,roughness:.9}),0,.2,.14,bp);BOX(.04,.42,.03,MS({color:0x151a1e}),-.1,.27,-.13,bp);BOX(.04,.42,.03,MS({color:0x151a1e}),.1,.27,-.13,bp)}
  CYL(.035,.035,.22,MS({color:0x4a6a7a,roughness:.3,metalness:.2}),-.48,.11,.12,g,12);
  [[-.32,-.78],[-.18,-.82]].forEach(([x,z])=>BOX(.11,.12,.27,MS({color:0x1a1612,roughness:.9}),x,.06,z,g));
  // 지퍼 고리 (밖에서 열 때 위로 올라감 = 열린 만큼)
  {const pt=grp(0,.06,0,0,g);tn.pull=pt;BOX(.028,.018,.012,MS({color:0x202020,metalness:.6,roughness:.4}),0,0,0,pt);const r=mesh(new T.TorusGeometry(.016,.0035,6,14),MS({color:0x909088,metalness:.8,roughness:.3}),0,-.03,.006,pt,false);tn.pullHit=mesh(new T.SphereGeometry(.13,8,6),new T.MeshBasicMaterial({visible:false}),0,0,0,pt,false)}
  // 손 자국 (실루엣에만 찍히는 손바닥 그림): 파수꾼이 천에 손을 댄 곳
  {const hc=cvs(128,128,(q,w,h)=>{q.fillStyle='#000';q.beginPath();q.ellipse(w*.5,h*.66,w*.2,h*.2,0,0,7);q.fill();q.lineCap='round';[[-.17,.36,.12],[-.06,.3,.06],[.06,.29,.04],[.17,.34,.1],[.27,.6,.5]].forEach(([dx,ty,a],i)=>{q.lineWidth=i===4?w*.075:w*.065;q.beginPath();q.moveTo(w*(.5+dx*.7),h*.6);q.lineTo(w*(.5+dx+(i===4?.05:0)),h*(ty-.12));q.stroke()})});
   const ht=ctx3(hc);ht.flipY=true;tn.m2.uniforms.uHT.value=ht}
  // 그림자(텐트 안 발치)·지퍼 여는 것의 손가락
  tn.fingers=[];const fm=MS({color:0x0a0a0a,roughness:.6});for(let k=0;k<8;k++){const f=new T.Group();const c1=mesh(new T.CapsuleGeometry(.011,.06,4,8),fm,0,0,.03,f,false);c1.rotation.x=PI2;const c2=mesh(new T.CapsuleGeometry(.009,.045,4,8),fm,0,-.015,.075,f,false);c2.rotation.x=PI2+.6;g.add(f);f.visible=false;tn.fingers.push(f)}
  tn.silMat=new T.MeshBasicMaterial({color:0x000000,fog:false});
  return tn}
function tentSideX(y){const e=Math.asin(Math.min(1,Math.pow(Math.max(0,y)/TH,1/.9)))/PI2;return TA*Math.cos(e*PI2)}
function tentS3(){return F3.w.L+F3.w.s0}
// 텐트 밤 시작 (야영지 컷씬 끝 / 다시 하기)
function startTent3(retry){const W3=F3.w,tn=buildTent3(),n=S.night,hd=S.hard;S.ph='tent';S.inTent=true;S.t=0;S.view=S.camX=1;S.torchOff=false;S.brH=false;S.breath=1;S.inWalk=S.inBack=false;S.cut=null;
  tn.g.visible=true;if(W3.tentX)W3.tentX.visible=false;
  S.tn={sh:S.late?38:0,pk:0,pkHold:false,zipHold:null,brId:null,
    ln:{st:'off',timer:rnd(22,30)-n*1.5},zip:{on:false,st:'off',p:0,timer:n>=2?rnd(70,95)-n*4:1e9},st:{stage:0,timer:n>=3?rnd(40,55):1e9,bad:0},vo:{on:false,timer:n>=4?rnd(110,150):1e9},lbad:0,cr:0};
  if(S.late)say('해가 다 져서야 텐트를 쳤다. 어둠이 벌써 가깝다.','bad',4);
  S.fade=1;S.fadeTo=0;S.fadeR=1.4;S.paused=true;
  const it=$('intro');$('introBig').textContent='12:00 AM';$('introSmall').textContent=n+'일 차 · 텐트';it.classList.remove('show');void it.offsetWidth;it.classList.add('show');
  setTimeout(()=>{it.classList.remove('show');if(S&&S.ch===3&&S.ph==='tent'&&!S.over){S.paused=false;if(n===1)S.hintT=10}},DEV.on?600:2200);buildUI()}
function breath3(on){if(!S||!S.tn||S.ph!=='tent')return;if(on&&S.breath<.12)return;if(S.brH===on)return;S.brH=on;$('eyeBtn').classList.toggle('on',on);if(EYEF)EYEF.frequency.setTargetAtTime(on?900:20000,AC.currentTime,.08);if(!on)exhale(.12)}
function peek3(on){if(!S||!S.tn||S.ph!=='tent')return;S.tn.pkHold=on;$('peekBtn').classList.toggle('on',on);if(on&&S.view===1&&!S.tn.zip.on)zipSnd(.06,.25)}
function toggleTorch3(){if(!S||S.ph!=='tent'||S.over)return;S.torchOff=!S.torchOff;sfx(S.torchOff?700:1100,.03,'square',.05);thump(900,.02,.04,.2);buildUI()}
function mash3(){const z=S.tn.zip;if(!z.on||z.st!=='fight')return;z.p=Math.max(0,z.p-z.k);z.clicks++;zipSnd(.05,.12);S.shake=.05;if(z.p<=0)zipWin3()}
function tentDown3(p,e){const tn=S.tn;if(!tn)return;
  if(tn.zip.on){mash3();return}
  const nz=navZone3(p);if(nz){turn(nz);return}
  if(handsOn()){const k=handHit(p);if(k==='torch'){HND.thP=1;toggleTorch3();return}if(k==='eye'){tn.brId=e.pointerId;breath3(true);return}}
  if(S.view===1&&Math.abs(S.view-S.camX)<.1&&zipHit3(p)){tn.zipHold=e.pointerId;peek3(true);return}
  S.swipe={x:p.x,y:p.y,id:e.pointerId}}
function tentUp3(e){const tn=S.tn;if(!tn)return;if(e.pointerId===tn.brId){tn.brId=null;breath3(false)}if(e.pointerId===tn.zipHold){tn.zipHold=null;peek3(false)}
  if(S.swipe&&S.swipe.id===e.pointerId){const p=gameXY(e),dx=p.x-S.swipe.x;if(Math.abs(dx)>60)turn(dx>0?-1:1);S.swipe=null}}
function tentKey3(a,down){if(a==='left'&&down)turn(-1);else if(a==='right'&&down)turn(1);else if(a==='torch'&&down)toggleTorch3();else if(a==='breath')breath3(down);else if(a==='peek')peek3(down);else if(a==='mash'&&down)mash3()}
const navW3=()=>Math.max(52,W*.065);
function navZone3(p){if(!S.tn||S.tn.zip.on||S.tn.pk>.1)return 0;if(p.x<navW3()&&S.view>0)return -1;if(p.x>W-navW3()&&S.view<2)return 1;return 0}
function zipHit3(p){const tn=F3.w.tn;if(!tn)return false;const v=new R3.T.Vector3();tn.pull.getWorldPosition(v);v.y+=.35;v.project(R3.cam);const x=(v.x+1)/2*W,y=(1-v.y)/2*H;return Math.abs(p.x-x)<W*.12&&Math.abs(p.y-y)<H*.3}
// 밤 진행
function tent3(dt){const tn=S.tn,n=S.night,hd=S.hard?1.2:1,z=tn.zip,ln=tn.ln,st=tn.st,vo=tn.vo;
  S.t+=dt*60/HOUR3;if(S.t>=HOUR*6){dawn3();return}
  if(S.hintT>0)S.hintT-=dt;
  // 숨: 참는 동안 줄고, 다 떨어지면 저절로 크게 들이마심
  if(S.brH){S.hbT=(S.hbT||0)-dt;if(S.hbT<=0){S.hbT=lerp(.62,.38,1-S.breath);thump(52,.12,.22,0);thump(48,.1,.14,0,.13)}S.breath-=dt/9;if(S.breath<=0){S.breath=0;breath3(false);gasp3();if(ln.st==='press'&&ln.t>.8)return die('파수꾼')}}else S.breath=Math.min(1,S.breath+dt/4);
  // 틈으로 보기 (앞을 볼 때만)
  tn.pk+=((tn.pkHold&&S.view===1&&Math.abs(S.camX-1)<.15&&!z.on?1:0)-tn.pk)*Math.min(1,dt*5);
  // 그림자: 손전등이 꺼져 있으면 발치 어둠에서 다가옴
  if(!z.on){if(!torchOn3())tn.sh+=dt*(5.2+n*.55)*hd;else tn.sh=Math.max(0,tn.sh-dt*24)}
  if(tn.sh>=100)return die('그림자');
  if(tn.sh>30&&Math.random()<dt*.35)breathe(rnd(-.3,.3),.1+tn.sh/600);
  if(tn.dcd>0)tn.dcd-=dt;
  if(z.on){zip3(dt);return} // 지퍼 싸움 중엔 다른 것들이 안 옴
  lantern3(dt);stalker3(dt);voice3(dt);
  // 지퍼 여는 것 (2일 차~)
  if(n>=2){z.timer-=dt;if(z.timer<=0){if(ln.st==='off'&&st.stage<4&&!vo.on&&tn.sh<25){zipStart3()}else z.timer=4}}}
// 파수꾼: 랜턴 들고 텐트 둘레를 돎 → 옆 벽에 손을 댐 (불 끄고 숨 참기) → 떠남
function lantern3(dt){const ln=S.tn.ln,n=S.night,tn=S.tn;
  if(ln.st==='off'){ln.timer-=dt;if(ln.timer<=0&&tn.st.stage<4){ln.st='come';ln.t=0;ln.dir=Math.random()<.5?1:-1;ln.side=ln.dir>0?Math.PI:0;ln.th=Math.PI/2-ln.dir*Math.PI*.55;ln.stepT=0}return}
  ln.t+=dt;ln.stepT-=dt;const lx=Math.cos(ln.th),pan=Math.max(-1,Math.min(1,lx*1.2));
  if(ln.st==='come'){if(ln.stepT<=0){ln.stepT=.62;leafStep(pan,.05+ln.t*.025)}if(Math.random()<dt*.6)creak3(pan,.05);if(ln.t>4.5){ln.st='circle';ln.t=0}return}
  if(ln.st==='circle'){ln.th+=ln.dir*dt*.42;if(ln.stepT<=0){ln.stepT=.62;leafStep(pan,.16)}if(Math.random()<dt*.8)creak3(pan,.08);
    if((ln.dir>0?ln.th>=ln.side:ln.th<=ln.side)&&!ln.pass&&(tn.st.stage>=4||tn.dcd>0)){ln.pass=1} // 교대자가 문 앞이거나 방금 다녀갔으면 짚지 않고 지나감
    if(ln.pass&&(ln.dir>0?ln.th>=ln.side+1.2:ln.th<=ln.side-1.2)){ln.st='leave';ln.t=0;ln.pass=0;return}
    if(!ln.pass&&(ln.dir>0?ln.th>=ln.side:ln.th<=ln.side)){ln.th=ln.side;ln.st='press';ln.t=0;ln.hs=Math.random()<.5?-1:1;ln.z=ln.hs*rnd(.22,.32);fabric3(pan,.3)}return}
  if(ln.st==='press'){const bad=ln.t>.8&&(torchOn3()||!S.brH);tn.lbad=bad?tn.lbad+dt:Math.max(0,tn.lbad-dt*.5);if(ln.t>.8&&ln.t<.9&&!ln.sn){ln.sn=1;fabric3(pan,.45);breathe(pan,.18)}
    if(tn.lbad>1.05)return die('파수꾼');if(ln.t>7.2){ln.st='leave';ln.t=0;ln.sn=0;tn.lbad=0;tn.dcd=7;fabric3(pan,.2)}return}
  if(ln.st==='leave'){ln.th+=ln.dir*dt*.5;if(ln.stepT<=0){ln.stepT=.62;leafStep(pan,Math.max(.02,.16-ln.t*.03))}if(ln.t>5){ln.st='off';ln.timer=Math.max(24,rnd(48,66)-n*4)/(S.hard?1.2:1);achC3('lantern')}}}
// 지퍼 여는 것: 밖에서 지퍼를 내림 → 고리 연타로 다시 닫기
function zipStart3(){const z=S.tn.zip,n=S.night;z.on=true;z.st='warn';z.t=0;z.p=.12;z.clicks=0;const N=Math.round(12+(n-2)*8/3)+(S.hard?3:0),R=3.6+(n-2)*.4,pull=.11;z.pull=pull;z.k=(.18+pull*N/R)/N;z.need=N;
  if(S.view!==1){S.view=1;buildUI()}S.tn.pkHold=false;$('peekBtn').classList.remove('on');zipSnd(.14,.9);say('지퍼가... 밖에서 내려간다!','bad',2.5);buildUI()}
function zip3(dt){const z=S.tn.zip;z.t+=dt;
  if(z.st==='warn'){z.p=Math.min(.18,z.p+dt*.05);if(Math.random()<dt*8)zipSnd(.04,.08);if(z.t>1.1){z.st='fight';z.t=0}return}
  if(z.st==='fight'){z.p+=z.pull*dt*(S.hard?1.15:1);if(Math.random()<dt*7)zipSnd(.04,.07);if(z.p>=1)return die('지퍼 여는 것');return}
  if(z.st==='win'){if(z.t>2.2){z.on=false;z.st='off';z.timer=rnd(60,85)-S.night*3;buildUI()}}}
function zipWin3(){const z=S.tn.zip;z.st='win';z.t=0;z.p=0;zipSnd(.12,.3);setTimeout(()=>{if(S&&S.ch===3){exhale(.2);leafStep(0,.15);setTimeout(()=>leafStep(.2,.1),600)}},500);achC3('zip')}
// 교대자 (3일 차~): 나무 사이에서 점점 가까이. 텐트 바로 앞에 서면 불빛을 보고 들어옴
const ST3=[0,15,10,5.5,1.45];
function stalker3(dt){const st=S.tn.st;if(S.night<3)return;st.timer-=dt;
  if(st.stage<4){if(st.timer<=0&&st.stage===3&&(S.tn.ln.st==='press'||S.tn.dcd>0)){st.timer=2;return}if(st.timer<=0){st.stage++;st.x=st.stage===4?rnd(-.15,.15):rnd(-2.5,2.5);if(st.stage<4){st.timer=rnd(11,17)/(S.hard?1.2:1);const v=[0,.05,.08,.12][st.stage];for(let k=0;k<3;k++)leafStep(rnd(-.2,.2),v*rnd(.7,1)*(k?1:1.2))}
      else{st.timer=7;st.bad=0;setTimeout(()=>{if(S&&S.ch===3){leafStep(0,.32);setTimeout(()=>leafStep(.05,.36),520);setTimeout(()=>breathe(0,.16),1300)}},0)}}return}
  // 바로 앞
  if(torchOn3())st.bad+=dt;else st.bad=Math.max(0,st.bad-dt);if(st.bad>2.1)return die('교대자');
  if(st.timer<=0){st.stage=0;S.tn.dcd=7;st.timer=rnd(30,45)/(S.hard?1.2:1);leafStep(0,.14);setTimeout(()=>leafStep(.1,.08),600);achC3('stalker')}}
// 내 목소리 (4일 차~): "열어 줘". 그동안 틈으로 보면 안 됨
const VO3=[['...나야.',0],['추워. 열어 줘.',2.6],['왜 안 열어? 나라니까.',5.3]];
function voice3(dt){const vo=S.tn.vo;if(S.night<4)return;
  if(!vo.on){vo.timer-=dt;if(vo.timer<=0&&S.tn.pk<.05){vo.on=true;vo.t=0;vo.i=0}return}
  vo.t+=dt;while(vo.i<VO3.length&&vo.t>=VO3[vo.i][1]){say(VO3[vo.i][0],'voice',2.4);murmur3(.1);vo.i++}
  if(S.tn.pk>.35)return die('내 목소리');
  if(vo.t>8){vo.on=false;vo.timer=rnd(80,110);S.tn.zip.timer=Math.max(S.tn.zip.timer,8)}}
function dawn3(){if(S.ph==='dawn')return;S.ph='dawn';S.dawnT=0;S.dawnK=0;S.torchOff=false;breath3(false);peek3(false);say('6시. 천이 밝아진다.','',3);buildUI()}
function dawnUpd3(dt){S.dawnT+=dt;S.dawnK=Math.min(1,S.dawnT/3.5);if(S.dawnT>4.2&&S.fadeTo!==1){S.fadeTo=1;S.fadeR=1.6}if(S.dawnT>5.6&&!S.winD){S.winD=1;win3()}}
function win3(){const n=S.night,hard=S.hard;S.over=true;
  if(!DEV.on){try{if(hard){savedCh3h=Math.max(savedCh3h,n+1);localStorage.setItem('obs3_night_hard',savedCh3h)}else{savedCh3=Math.max(savedCh3,n+1);localStorage.setItem('obs3_night',savedCh3)}}catch(e){}}
  setMode('end');showEnd('6:00 AM',`${n}일 차 생존.\n${['','숲은 어젯밤보다 조용하다.','텐트 둘레에 발자국이 한 바퀴.','지퍼 고리가 휘어 있다.','텐트 앞 흙이 패여 있다. 맨발 자국.'][n]||''}`,`${n+1}일 차`,()=>newDay3(n+1))}
// ---------- 텐트 안 카메라·괴물 ----------
function camTent3(){const W3=F3.w,tn=W3.tn,cam=R3.cam,T=R3.T;if(!tn)return;const k=ease(S.tn?S.tn.pk:0),br=Math.sin(T_*1.25)*.006*(S.brH?.2:1);
  const lp=new T.Vector3(lerp(TCAM[0],0,k),lerp(TCAM[1],.48,k)+br,lerp(TCAM[2],tentFrontZ(.48)+.22,k));tn.g.updateMatrixWorld();cam.position.copy(lp.applyMatrix4(tn.g.matrixWorld));
  if(S.shake>0){cam.position.x+=rnd(-.008,.008);cam.position.y+=rnd(-.006,.006)}
  const yaw=(1-S.camX)*1.25*(1-k);cam.rotation.set(-.12+k*.13+Math.sin(T_*.5)*.004,W3.tentRy+yaw+Math.sin(T_*.31)*.004,0)}
function tentHide3(){const W3=F3.w;if(!W3)return;['lan','wid','stk','shd'].forEach(k=>monHide(W3.mons[k]));if(W3.lanM)W3.lanM.visible=false;W3.lan.intensity=0;if(W3.tn){W3.tn.g.visible=false;if(W3.shdE)W3.shdE.visible=false}}
function tl(x,y,z){const tn=F3.w.tn;return new R3.T.Vector3(x,y,z).applyMatrix4(tn.g.matrixWorld)}
function tentMons3(){const W3=F3.w,T=R3.T,tn=W3.tn,s=S.tn;if(!tn||!s)return;tn.g.visible=true;tn.g.updateMatrixWorld();const ry=W3.tentRy;
  // 지퍼 틈: 지퍼 싸움 > 틈으로 보기
  const z=s.zip;let yp=.06,wm=0;if(z.on){const p=z.st==='win'?Math.max(0,1-z.t*2)*.1:z.p;yp=lerp(.08,1.12,p);wm=lerp(.03,.3,p)}else if(s.pk>.01){const e=ease(s.pk);yp=lerp(.06,.8,e);wm=.16*e}
  tn.uGap.value.set(yp,wm,0);tn.pull.position.set(0,Math.max(.06,yp),tentFrontZ(Math.max(.06,yp))+.012);
  // 그림자 (텐트 안 앞 구석 어둠)
  {const sp=s.sh,I=mon3('shd','shadow',1);if(I&&sp>18&&!torchOn3()){const k=Math.min(1,(sp-18)/82),sx=s.shSide||(s.shSide=Math.random()<.5?-1:1),lx=lerp(sx*.62,sx*.12,k*k),lz=lerp(-.82,.05,k*k),p=tl(lx,0,lz);
      if(!I.dk){I.dk=1;I.o.traverse(o=>{if(o.isMesh){o.material.color.setHex(0x30343a);o.material.emissiveIntensity=0}if(!I.hd&&o.isBone&&o.name.endsWith('HeadTop_End'))I.hd=o})}
      I.g.visible=true;I.g.scale.setScalar(.56);I.g.position.copy(p);I.g.position.y-=.08;lookYaw(I,p.x,p.z);I.g.rotation.x=lerp(.3,.62,k)+Math.sin(T_*.8)*.02;I.g.rotation.z=Math.sin(T_*.5)*.04;monPlay(I,'walk',{speed:0,fade:0});monFade(I,Math.min(1,(sp-18)/25));
      if(!W3.shdE){const ec=cvs(128,32,(q,w,h)=>{[w*.3,w*.7].forEach(x2=>{const g=q.createRadialGradient(x2,h/2,0,x2,h/2,h*.5);g.addColorStop(0,'rgba(255,240,225,1)');g.addColorStop(.25,'rgba(255,200,170,.7)');g.addColorStop(1,'rgba(255,120,90,0)');q.fillStyle=g;q.fillRect(0,0,w,h)})});
        W3.shdE=new T.Sprite(new T.SpriteMaterial({map:ctx3(ec),transparent:true,depthWrite:false,depthTest:false,blending:T.AdditiveBlending,fog:false}));W3.shdE.renderOrder=6;W3.sc.add(W3.shdE)}
      I.g.updateMatrixWorld(true);const hp=new T.Vector3();if(I.hd)I.hd.getWorldPosition(hp);else hp.copy(p).setY(p.y+1);hp.addScaledVector(R3.cam.position.clone().sub(hp).normalize(),.04);hp.y-=.07;
      const E=W3.shdE,ew=lerp(.16,.11,k);E.visible=true;E.position.copy(hp);E.scale.set(ew,ew/4,1);E.material.opacity=Math.min(1,(sp-18)/16)*(Math.random()<.015?.2:1)}
    else{monHide(I);if(I)I.dk=0;if(W3.shdE)W3.shdE.visible=false;if(sp<5)s.shSide=0}}
  // 파수꾼
  {const ln=s.ln,I=mon3('lan','lantern');if(I&&ln.st!=='off'&&ln.st!=='come'){I.g.visible=true;
      if(!W3.lanM){const L=I.o.getObjectByName('lantern');if(L){W3.sc.attach(L);W3.lanM=L;L.material=L.material.clone();L.material.emissiveIntensity=1.6;L.castShadow=false}I.o.traverse(o=>{if(o.isMesh&&o!==W3.lanM)o.layers.enable(3);if(!I.rh&&o.isBone&&o.name.endsWith('RightHand'))I.rh=o})}
      const press=ln.st==='press',r=press?1.45:ln.st==='leave'?1.85+ln.t*.5:1.85,lx=Math.cos(ln.th)*r,lz=Math.sin(ln.th)*r+(press?-ln.hs*.85:0),p=tl(lx,0,lz);I.g.position.copy(p);
      if(press){I.g.rotation.y=ry+Math.atan2(-lx,ln.hs*.35);monPlay(I,'idle',{fade:.5})}else{const tx=-Math.sin(ln.th)*ln.dir,tz=Math.cos(ln.th)*ln.dir;I.g.rotation.y=ry+Math.atan2(tx,tz);monPlay(I,'walk',{speed:.75})}
      I.g.updateMatrixWorld(true);const hp=new T.Vector3();if(I.rh)I.rh.getWorldPosition(hp);else hp.copy(p).setY(p.y+.9);
      if(W3.lanM){const L=W3.lanM;L.visible=true;L.position.copy(hp);L.position.y-=.03;L.rotation.set(Math.sin(T_*2.3)*.12*(press?.3:1),I.g.rotation.y,Math.sin(T_*1.9+1)*.1*(press?.3:1))}
      const fl=.85+.15*Math.sin(T_*17)*Math.sin(T_*7.3);W3.lan.position.copy(hp);W3.lan.position.y-=.12;W3.lan.intensity=3.2*fl;
      // 천에 비치는 빛 + 실루엣: 빛을 그것 등 뒤(텐트 반대쪽) 조금 위에 둔 것처럼 계산 → 몸 그림자가 천에 크게 맺힘
      const ctr=tl(0,0,press?lz:0),ow=new T.Vector3(p.x-ctr.x,0,p.z-ctr.z).normalize(),VL=p.clone().addScaledVector(ow,.85);VL.y=p.y+1.25;
      const sc=tn.silCam;sc.position.copy(VL);sc.lookAt(tl(0,.55,0));sc.updateMatrixWorld();sc.updateProjectionMatrix();
      const rd=R3.rd,prevT=rd.getRenderTarget(),cc=rd.getClearColor(new T.Color()),ca=rd.getClearAlpha(),bg=W3.sc.background,sw=[];
      I.o.traverse(o=>{if(o.isMesh&&o!==W3.lanM){sw.push([o,o.material]);o.material=tn.silMat}});W3.sc.background=null;
      rd.setRenderTarget(tn.sil);rd.setClearColor(0xffffff,1);rd.clear();rd.render(W3.sc,sc);rd.setRenderTarget(prevT);rd.setClearColor(cc,ca);W3.sc.background=bg;sw.forEach(([o,m])=>o.material=m);
      const u=tn.m2.uniforms;u.uLP.value.copy(VL);u.uLI.value=3.4*fl*(ln.st==='leave'?Math.max(0,1-ln.t/4):1);u.uSilM.value.multiplyMatrices(sc.projectionMatrix,sc.matrixWorldInverse);
      // 손자국 + 천이 눌림
      const sx=Math.cos(ln.side)>0?1:-1,hk=press?Math.min(1,Math.max(0,(ln.t-.8)/.35))*(ln.t>6.8?Math.max(0,1-(ln.t-6.8)/.4):1):0;
      u.uHand.value.set(sx,.8,ln.z,hk);
      dent3(tn,hk,sx,ln.z)}
    else{monHide(I);if(W3.lanM)W3.lanM.visible=false;W3.lan.intensity=0;tn.m2.uniforms.uLI.value=0;tn.m2.uniforms.uHand.value.w=0;dent3(tn,0)}}
  // 지퍼 여는 것: 틈 바로 밖에 쭈그려 들여다봄 + 검은 손가락이 천 가장자리를 쥠
  {const I=mon3('wid','widow');const on=z.on&&(z.st!=='win'||z.t<.7);if(I&&on){I.g.visible=true;const p=tl(0,0,-TB-.62+(z.st==='win'?-z.t*.8:0));I.g.position.copy(p);I.g.position.y+=-1.5+z.p*.28;I.g.rotation.set(.04,ry,0);monPlay(I,'reach',{speed:.6})}else monHide(I);
   tn.fingers.forEach((f,i)=>{const sd=i<4?-1:1,j=i%4,show=on&&z.p>.05&&z.st!=='win';f.visible=show;if(!show)return;const y=lerp(.12,Math.max(.16,yp-.1),j/3+.05*Math.sin(T_*3+i)),hw=yp>y?wm*Math.pow(1-y/yp,.85):0;f.position.set(sd*(hw+.004),y,tentFrontZ(y)+.004);f.rotation.set(Math.sin(T_*6+i)*.15,-sd*.5,0)})}
  // 교대자: 앞쪽 나무 사이 (틈으로만 보임)
  {const st=s.st,I=mon3('stk','stalker',1);if(I&&!I.emB){I.emB=1;I.o.traverse(o=>{if(o.isMesh)o.material.emissiveIntensity=.32})}if(I&&st.stage>0){I.g.visible=true;const p=tl(st.x||0,0,-TB-ST3[st.stage]);I.g.position.copy(p);I.g.position.y=W3.hg(p.x,p.z);lookYaw(I,p.x,p.z);monPlay(I,'idle')}else monHide(I)}
  // 새벽: 천이 밝아짐
  const dk=S.dawnK||0;tn.m2.uniforms.uAmb.value.set(.13+dk*.9,.15+dk*1,.19+dk*1.1)}
// 파수꾼 손이 닿은 곳: 손바닥 + 손가락 모양으로 천이 안으로 눌림
function dent3(tn,k,sx,lz){const g=tn.geo,pa=g.attributes.position,a=pa.array,b=g.userData.base,nr=g.userData.nrm;
  if(k<=.001){if(tn.dented){a.set(b);pa.needsUpdate=true;tn.dented=0;g.attributes.normal.array.set(nr);g.attributes.normal.needsUpdate=true}return}
  if(!tn.dIdx||tn.dKey!==sx+'|'+lz.toFixed(3)){tn.dKey=sx+'|'+lz.toFixed(3);tn.dIdx=[];const cy=.84,cxw=sx*tentSideX(cy);for(let i=0;i<b.length/3;i++){const dx=b[i*3]-cxw,dy=b[i*3+1]-cy,dz=b[i*3+2]-lz;if(dx*dx+dy*dy+dz*dz<.1)tn.dIdx.push(i)}}
  const cy=.84,F=[[0,-.04,.075,1],[-.05,.07,.025,.8],[-.017,.09,.022,.9],[.017,.09,.022,.9],[.05,.075,.022,.8],[.085,-.01,.025,.6]];
  for(const i of tn.dIdx){const y=b[i*3+1]-cy,zz=(b[i*3+2]-lz)*-sx;let d=0;for(const [fz,fy,r,w] of F){const q=((zz-fz)**2+(y-fy)**2)/(r*r);d=Math.max(d,w*Math.exp(-q))}const m=d*.085*k;a[i*3]=b[i*3]-nr[i*3]*m;a[i*3+1]=b[i*3+1]-nr[i*3+1]*m;a[i*3+2]=b[i*3+2]-nr[i*3+2]*m}
  pa.needsUpdate=true;tn.dented=1;g.computeVertexNormals()}

// ===================== 진행 =====================
function update3(dt){if(S.over)return;if(S.msgT>0)S.msgT-=dt;if(S.shake>0)S.shake-=dt;if(S.flick3>0)S.flick3-=dt;
  if(S.ph==='walk')walk3(dt);else if(S.ph==='tent')tent3(dt);else if(S.ph==='dawn')dawnUpd3(dt);else if(S.ph==='cut')cutUpd3(dt);else if(S.ph==='office')officeUpd3(dt);
  if(S&&!S.over){updHUD();hud3();audio3()}}
function hud3(){if(S.ph!=='tent'&&S.ph!=='dawn')return;const b=S.breath;$('pw').textContent=Math.round(b*100);$('pb').style.width=b*100+'%';$('pbar').classList.toggle('low',b<.3)}
// 업적 세기 (파수꾼·지퍼·교대자를 버팀)
function achC3(k){if(DEV.on)return;AS.n['c3'+k]=(AS.n['c3'+k]||0)+1;achSave();if(k==='zip'&&AS.n.c3zip>=5)ach('zipper');if(k==='lantern'&&AS.n.c3lantern>=5)ach('lantern')}
// ---------- 컷씬 (챕터 3 전용: 카메라 길·자막·소리를 시간표대로) ----------
function cut3(id,done){S.ph='cut';S.cut={id,t:0,done,ev:{}};S.inWalk=S.inBack=false;S.paused=false;buildUI()}
function cutEv(c,t,k,fn){if(c.t>=t&&!c.ev[k]){c.ev[k]=1;fn()}}
function cutUpd3(dt){const c=S.cut;if(!c)return;c.t+=dt;const f=CUT3[c.id];if(f)f(c,c.t);if(c.end&&!c.fin){c.fin=1;const d=c.done;d&&d()}}
const camAt=(x,y,z,pitch,yaw)=>{const cam=R3.cam;cam.position.set(x,y,z);cam.rotation.set(pitch,yaw,0)};
const CUT3={
  // 물속 비상구를 지나 숲에서 깨어남: 누워서 하늘 → 일어나 앉음 → 둘러봄 → 일어섬
  intro(c,t){const W3=F3.w,p=trkAt(W3.main,W3.s0),h=W3.hg(p.x,p.z),base=Math.atan2(-p.tx,-p.tz);c.walkK=.05;c.ts=W3.s0;c.hands=t>13.5;c.dark=t<13.6;
    if(!c.i0){c.i0=1;S.fade=1;S.fadeTo=1}
    cutEv(c,.3,'a',()=>{bubbles(0,.12);nburst(300,.8,1.4,.18,0,0,'lowpass')});cutEv(c,1.4,'b',()=>{gasp3();});cutEv(c,2.2,'c',()=>{S.fadeTo=0;S.fadeR=.9;cough3()});
    cutEv(c,4.2,'d',()=>say('...콜록. 콜록.','',2.4));cutEv(c,8.5,'e',()=>say('...물이 아니라 흙이다.','',2.8));cutEv(c,11.2,'f',()=>say('여긴... 어디야.','',2.6));cutEv(c,14,'g',()=>say('주머니에 젖은 쪽지가 있다.','',3));
    const up=ease(Math.max(0,Math.min(1,(t-6)/3.2))),st=ease(Math.max(0,Math.min(1,(t-12.4)/1.8))),look=t<9?0:Math.sin(Math.min(1,(t-9)/3.4)*Math.PI*2)*.55*(1-st);
    const y=h+lerp(.22,.85,up)+st*.77,pitch=lerp(1.15+Math.sin(t*.7)*.03,.02,up)-st*.05+Math.sin(t*1.3)*.01*(1-st);
    camAt(p.x+p.tz*.2*(1-up),y,p.z-p.tx*.2*(1-up),pitch,base+look+lerp(.4,0,up));
    if(t>15.2)c.end=1},
  // 야영지 도착 → 텐트 치기 (암전 동안 소리만)
  pitch(c,t){const W3=F3.w,cam=R3.cam;c.walkK=Math.min(1,S.wt/DUSK3[S.night]);c.hands=t<1.6;c.ts=W3.L+W3.s0;
    if(!c.p0){c.p0=cam.position.clone();c.r0=cam.rotation.y;const tp=W3.tentP;c.r1=Math.atan2(-(tp.x-c.p0.x),-(tp.z-c.p0.z))}
    const e=ease(Math.min(1,t/2));let dr=c.r1-c.r0;dr=Math.atan2(Math.sin(dr),Math.cos(dr));cam.position.copy(c.p0);cam.position.y+=Math.sin(t*1.2)*.01-e*.25;cam.rotation.set(lerp(-.05,-.22,e),c.r0+dr*e,0);
    cutEv(c,.4,'s',()=>{if(S.night===1)say('여기서 밤을 보내야 해.','',2.4);else say('리본이 묶인 나무. 오늘은 여기까지.','',2.4)});
    cutEv(c,2.2,'f',()=>{S.fadeTo=1;S.fadeR=2.4});
    cutEv(c,3.1,'a',()=>{fabric3(0,.3);});cutEv(c,3.7,'b',()=>{sfx(1700,.03,'square',.05);sfx(1900,.03,'square',.04)});[4.2,4.65,5.1,5.55].forEach((w,i)=>cutEv(c,w,'h'+i,()=>{thump(150,.06,.3,(i%2?.3:-.3));nburst(1800,3,.03,.12,0)}));cutEv(c,6,'z',()=>zipSnd(.12,.6));
    if(t>6.9)c.end=1},
  // 5일째: 숲 끝의 문 → 열고 들어감
  exit(c,t){const W3=F3.w,cam=R3.cam,ex=W3.exitP,T=R3.T;c.walkK=1;c.hands=t<5;c.ts=W3.L+W3.s0;c.dim=1;
    if(!c.p0){c.p0=cam.position.clone();c.r0=cam.rotation.y;c.r1=Math.atan2(-(ex.x-c.p0.x),-(ex.z-c.p0.z));const d=new T.Vector3(ex.x-c.p0.x,0,ex.z-c.p0.z).normalize();c.d=d;c.p1=new T.Vector3(ex.x,ex.y+1.62,ex.z).addScaledVector(d,-1.6);c.p2=new T.Vector3(ex.x,ex.y+1.6,ex.z).addScaledVector(d,.35)}
    const e1=ease(Math.min(1,t/3.6)),e2=ease(Math.max(0,Math.min(1,(t-5.2)/2.6)));const q=c.p0.clone().lerp(c.p1,e1).lerp(c.p2,e2);let dr=c.r1-c.r0;dr=Math.atan2(Math.sin(dr),Math.cos(dr));
    cam.position.copy(q);cam.position.y+=Math.sin(t*5.4)*.022*(1-e1*.7);cam.rotation.set(lerp(-.04,.04,e1),c.r0+dr*ease(Math.min(1,t/1.6)),0);
    if(W3.exitDoor)W3.exitDoor.rotation.y=.06+ease(Math.max(0,Math.min(1,(t-3.7)/1.8)))*1.3;
    cutEv(c,.5,'s',()=>say('...문이다. 숲 한가운데에.','',2.8));cutEv(c,3.7,'cr',()=>{creak3(0,.22);setTimeout(()=>creak3(0,.14),350)});cutEv(c,4.6,'h',()=>{if(humG)humG.gain.setTargetAtTime(.5,AC.currentTime,.8)});
    cutEv(c,6.4,'w',()=>{S.fadeTo=1;S.fadeR=1.4;S.fadeC='255,240,190'});
    if(t>8.3)c.end=1}};
// 문 너머: 경비실 (챕터 1). 전화가 울리고 있음 → 끝
function end3(){S.ph='office';buildUI();S.ot=0;S.fade=1;S.fadeTo=0;S.fadeR=.8;S.fadeC='255,240,190';stop3amb();if(humG)humG.gain.setTargetAtTime(.6,AC.currentTime,.3)}
function officeUpd3(dt){S.ot+=dt;const t=S.ot;
  if(t>1.4&&!S.oc&&S.fade<.02){S.oc=1;S.fadeC='0,0,0'}
  if(t>2.2&&(t-2.2)%2.6<dt)ringTone();
  if(t>3&&!S.o1){S.o1=1;say('...여기는.','',2.4)}
  if(t>6.4&&!S.o2){S.o2=1;say('전화가 울리고 있다.','',2.6)}
  if(t>9.6&&!S.o3){S.o3=1;S.fadeTo=1;S.fadeR=1.2}
  if(t>11.4&&!S.o4){S.o4=1;S.over=true;if(humG)humG.gain.setTargetAtTime(0,AC.currentTime,.2);
    if(!DEV.on){try{localStorage.setItem('obs3_clear','1');if(S.hard)localStorage.setItem('obs3_clear_h','1')}catch(e){}ach(S.hard?'ch3_hard':'ch3_normal')}
    setMode('end');showEnd('출구','5일 차 생존.\n문 너머는 경비실이었다.\n책상 위 전화가 울리고 있었다.','처음부터',()=>{setChapter(1);startGame(1,false,false,1)})}}
function office3(){const cam=R3.cam,T=R3.T;if(cam.far!==20){cam.far=20;cam.near=.03;cam.updateProjectionMatrix()}const t=S.ot;
  cam.position.set(0,CAMY+Math.sin(t*1.1)*.004,CAMZ+lerp(.5,0,ease(Math.min(1,t/3))));cam.rotation.set(-.17+Math.sin(t*.7)*.004,Math.sin(t*.3)*.03,0);
  if(R3.dyn&&R3.dyn.scr){}
  const fx=fxBegin();R3.rd.render(R3.sc,cam);if(fx)fxEnd(cam);cx.drawImage(R3.rd.domElement,0,0,W,H)}
// ---------- 텐트 화면 위: 고개 돌리기 화살표, 지퍼 연타, 처음 안내, 틈 ----------
function tentUI3(){const s=S.tn;if(!s)return;const W3=F3.w;
  if(S.brH||s.brA>.01){s.brA=lerp(s.brA||0,S.brH?1:0,.12);const a=s.brA*(.55+.25*(1-S.breath));cx.save();const g=cx.createRadialGradient(W/2,H/2,H*.25,W/2,H/2,H*.85);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(0,0,0,${a})`);cx.fillStyle=g;cx.fillRect(0,0,W,H);cx.restore()}
  if(s.pk>.02){const k=ease(s.pk);cx.save();cx.globalAlpha=k*.55;const g=cx.createRadialGradient(W/2,H/2,H*.18,W/2,H/2,H*.8);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'#000');cx.fillStyle=g;cx.fillRect(0,0,W,H);cx.restore()}
  if(s.zip.on){const z=s.zip,a=z.st==='win'?Math.max(0,1-z.t*1.5):1,bw=Math.min(W*.5,360),bx=W/2-bw/2,by=H*.16;cx.save();cx.globalAlpha=a;
    cx.fillStyle='rgba(0,0,0,.7)';cx.fillRect(bx-10,by-34,bw+20,58);cx.fillStyle='#2a2620';cx.fillRect(bx,by,bw,10);cx.fillStyle=z.p>.7?'#d93a25':'#e9a53d';cx.fillRect(bx,by,bw*Math.min(1,z.p),10);
    cx.font=`700 ${Math.max(16,H*.032)}px 'Galmuri11',monospace`;cx.textAlign='center';cx.textBaseline='bottom';cx.fillStyle=z.st==='win'?'#ece5cd':(T_*6%1<.5?'#ff7058':'#ece5cd');
    cx.fillText(z.st==='win'?'닫혔다':z.st==='warn'?'지퍼 고리를 잡아!':(MOB?'화면 연타!':'클릭 / Space 연타!'),W/2,by-6);cx.restore()}
  // 양옆 화살표
  if(!s.zip.on&&s.pk<.1&&!S.paused){const zw=navW3();[-1,1].forEach(d=>{const to=S.view+d;if(to<0||to>2)return;const hov=!PT.touch&&PT.x>=0&&((d<0&&PT.x<zw)||(d>0&&PT.x>W-zw)),a=hov?1:PT.touch?.6:.4,x0=d<0?0:W-zw;
    const gr=cx.createLinearGradient(d<0?0:W,0,d<0?zw:W-zw,0);gr.addColorStop(0,`rgba(0,0,0,${.6*a})`);gr.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=gr;cx.fillRect(x0,0,zw,H);
    const cxp=d<0?zw*.4:W-zw*.4,cy=H*.5,s2=Math.min(14,zw*.22);cx.save();cx.strokeStyle=`rgba(236,224,170,${.75*a})`;cx.lineWidth=2;for(let k=0;k<2;k++){const o=k*s2*.9*d,a2=s2*.5;cx.beginPath();cx.moveTo(cxp+o-d*a2,cy-s2);cx.lineTo(cxp+o+d*a2,cy);cx.lineTo(cxp+o-d*a2,cy+s2);cx.stroke()}
    cx.fillStyle=`rgba(236,224,170,${.75*a})`;cx.font=`${Math.max(13,Math.min(16,H*.026))}px 'Galmuri11',monospace`;cx.textAlign='center';cx.textBaseline='top';cx.fillText(VNAME3[to],cxp,cy+s2+10);cx.restore()});
    const want=navZone3(PT)?'pointer':'default';if(cv.style.cursor!==want)cv.style.cursor=want}
  // 처음 안내
  if(S.hintT>0&&!S.paused){const a=Math.min(1,S.hintT/1.5)*.9,fs=Math.max(13,H*.026)*2.4;let y=H*.3;
    [[handsOn()?'손전등 누르기: 끄기/켜기':'손전등 버튼: 끄기/켜기'],[MOB?'숨 참기 버튼 꾹':'숨 참기: 버튼 또는 E 꾹'],[MOB?'지퍼 꾹: 틈으로 보기':'지퍼 꾹 (Q): 틈으로 보기']].forEach(([t])=>{tapeLabel(t,W/2,y,a);y+=fs})}}
// ---------- 숲 소리 ----------
function amb3(){if(!AC)return null;if(F3.aud)return F3.aud;const A={};
  {const s=AC.createBufferSource();s.buffer=NB;s.loop=true;const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=520;const g=AC.createGain();g.gain.value=0;const lfo=AC.createOscillator(),lg=AC.createGain();lfo.frequency.value=.09;lg.gain.value=220;lfo.connect(lg);lg.connect(f.frequency);s.connect(f);f.connect(g);g.connect(AMB);s.start();lfo.start();A.wind=g;A.windF=f}
  {const s=AC.createBufferSource();s.buffer=NB;s.loop=true;const f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=4600;f.Q.value=9;const am=AC.createGain();am.gain.value=0;const lfo=AC.createOscillator(),lg=AC.createGain();lfo.type='square';lfo.frequency.value=17;lg.gain.value=.5;lfo.connect(lg);lg.connect(am.gain);
   const slow=AC.createOscillator(),sg=AC.createGain();slow.frequency.value=.35;sg.gain.value=.5;slow.connect(sg);sg.connect(am.gain);const g=AC.createGain();g.gain.value=0;s.connect(f);f.connect(am);am.connect(g);g.connect(AMB);s.start();lfo.start();slow.start();A.crick=g}
  F3.aud=A;return A}
function stop3amb(){if(F3.aud)for(const k of['wind','crick'])F3.aud[k].gain.setTargetAtTime(0,AC.currentTime,.3)}
function audio3(){const A=amb3();if(!A||!S)return;const k=S.ph==='walk'?Math.min(1,S.wt/DUSK3[S.night]):1,inT=S.inTent&&S.ph!=='cut';
  if(S.ph==='office')return;A.wind.gain.setTargetAtTime(inT?.09:.16,AC.currentTime,.4);A.windF.Q.value=inT?.3:.6;A.crick.gain.setTargetAtTime(.012*k*(inT?.5:1),AC.currentTime,.5);if(droneG)droneG.gain.setTargetAtTime(0,AC.currentTime,.3);
  if(Math.random()<1/60*(inT?.05:.03))owl3();if(Math.random()<1/60*.05)twig3()}
function owl3(){if(!AC)return;const t=AC.currentTime,p=rnd(-.8,.8),o2=out(p);[0,.42,.62].forEach((w,i)=>{const o=AC.createOscillator(),g=AC.createGain(),f=AC.createBiquadFilter();o.type='sine';o.frequency.setValueAtTime(i===1?360:330,t+w);o.frequency.linearRampToValueAtTime(i===1?340:300,t+w+.3);f.type='lowpass';f.frequency.value=900;
  g.gain.setValueAtTime(.0001,t+w);g.gain.linearRampToValueAtTime(.025,t+w+.05);g.gain.exponentialRampToValueAtTime(.0005,t+w+.38);o.connect(f);f.connect(g);g.connect(o2);o.start(t+w);o.stop(t+w+.45)})}
function twig3(){const p=rnd(-1,1);nburst(2400,3,.025,rnd(.03,.08),p);nburst(900,2,.04,rnd(.02,.05),p,.03)}
function leafStep(pan,v){nburst(900,.7,.12,v,pan);nburst(2600,1.4,.05,v*.5,pan);thump(80,.06,v*.4,pan);if(Math.random()<.3)nburst(3800,4,.03,v*.25,pan,.02)}
function deerStep(d,when){const v=Math.max(0,1-d/40)**1.4*.5;if(v<.008)return;thump(55,.14,v,0,when);nburst(500,1,.2,v*.7,0,when,'lowpass');nburst(1600,2,.05,v*.35,0,when+.03);if(d<10&&Math.random()<.25)nburst(250,.6,.5,v*.3,0,when+.2,'lowpass')} // 무거운 발굽 + 낙엽 + (가까우면) 콧김
function axeTok(v){thump(380,.05,v,0);nburst(2200,3,.04,v,0);nburst(700,4,.08,v*.5,0,.01)}
function scrapeAxe(){nburst(3000,4,.3,.18,0);thump(60,.3,.3,0);sting(0)}
function whisperBehind(v){if(!AC)return;whisper();const t=AC.currentTime,s=AC.createBufferSource();s.buffer=NB;const f=AC.createBiquadFilter();f.type='bandpass';f.Q.value=3;f.frequency.setValueAtTime(700,t);f.frequency.linearRampToValueAtTime(1200,t+.6);const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1800;const g=AC.createGain();g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v*.5,t+.15);g.gain.exponentialRampToValueAtTime(.001,t+1.4);s.connect(f);f.connect(lp);lp.connect(g);g.connect(out(0));s.start(t);s.stop(t+1.5)}
function murmur3(v){if(!AC)return;const t=AC.currentTime;for(let k=0;k<6;k++){const s=AC.createBufferSource();s.buffer=NB;const f=AC.createBiquadFilter();f.type='bandpass';f.Q.value=6;f.frequency.value=rnd(260,520);const g=AC.createGain(),w=k*.28;g.gain.setValueAtTime(.0001,t+w);g.gain.linearRampToValueAtTime(v*rnd(.6,1),t+w+.06);g.gain.exponentialRampToValueAtTime(.001,t+w+.26);s.connect(f);f.connect(g);g.connect(out(rnd(-.1,.1)));s.start(t+w,rnd(0,1.5));s.stop(t+w+.3)}}
function zipSnd(v,dur){if(!AC)return;const t=AC.currentTime,n=Math.max(2,Math.round(dur*40));for(let k=0;k<n;k++)nburst(rnd(2600,4200),6,.012,v*rnd(.5,1),0,k*dur/n)}
function exhale(v){if(!AC)return;const t=AC.currentTime,s=AC.createBufferSource();s.buffer=NB;const f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=900;f.Q.value=.7;const g=AC.createGain();g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.12);g.gain.exponentialRampToValueAtTime(.001,t+1);s.connect(f);f.connect(g);g.connect(master);s.start(t);s.stop(t+1.1)}
function gasp3(){if(!AC)return;const t=AC.currentTime,s=AC.createBufferSource();s.buffer=NB;const f=AC.createBiquadFilter();f.type='bandpass';f.frequency.setValueAtTime(600,t);f.frequency.linearRampToValueAtTime(1600,t+.5);f.Q.value=1.2;const g=AC.createGain();g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.4,t+.08);g.gain.exponentialRampToValueAtTime(.001,t+.7);s.connect(f);f.connect(g);g.connect(master);s.start(t);s.stop(t+.8)}
function cough3(){[0,.45,.8].forEach(w=>{nburst(500,1.2,.18,.3,0,w);thump(110,.12,.25,0,w)})}
function creak3(pan,v){if(!AC)return;const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain(),f=AC.createBiquadFilter();o.type='sawtooth';o.frequency.setValueAtTime(rnd(420,520),t);o.frequency.linearRampToValueAtTime(rnd(300,380),t+.35);f.type='bandpass';f.frequency.value=1500;f.Q.value=4;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.05);g.gain.exponentialRampToValueAtTime(.001,t+.4);o.connect(f);f.connect(g);g.connect(out(pan));o.start(t);o.stop(t+.45)}
function fabric3(pan,v){nburst(1200,.5,.35,v,pan);nburst(400,.8,.25,v*.5,pan,.05,'lowpass')}
// 치트 모드: 챕터 3 날짜·컷씬
for(let n=1;n<=5;n++){const b=document.createElement('button');b.textContent=n+'일';b.onclick=()=>{$('devp').classList.remove('show');go(()=>startGame(n,true,false,3))};$('devN3').appendChild(b)}
[['3 · 인트로',1,'intro'],['3 · 텐트 치기',2,'pitch'],['3 · 숲 끝',5,'exit']].forEach(([t,n,id])=>{const b=document.createElement('button');b.textContent=t;b.onclick=()=>{$('devp').classList.remove('show');go(()=>{DEV.cut3=id;startGame(n,true,false,3)})};$('devCuts').appendChild(b)});
