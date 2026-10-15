// ===================== 챕터 3: 숲 =====================
// 물속 비상구를 지나 정신을 차려 보니 숲. 낮(해 질 녘)엔 리본을 따라 숲길을 걷고, 밤엔 텐트 안에서 버팀. 5일째 숲 끝의 문
// index.html의 전역(S, R3, MON, cx, W, H, 소리 함수 등)을 그대로 씀. 이 파일은 index.html 본문 스크립트 다음에 불러옴
'use strict';
const F3={ready:false,ld:null,w:null};
const HOUR3=45;                 // 텐트 밤: 게임 1시간 = 45초 (12시~6시 = 4분 30초)
const WALK_V=1.55;              // 걷는 빠르기 (m/s)
const PLEN=[0,190,205,215,225,215],DUSK3=[0,180,192,200,208,205],NFORK=[0,1,1,2,3,2];
const VNAME3=['왼쪽','앞','오른쪽'];
let savedCh3=1,savedCh3h=1,INTRO3=0;try{savedCh3=+localStorage.getItem('obs3_night')||1;savedCh3h=+localStorage.getItem('obs3_night_hard')||1;INTRO3=+localStorage.getItem('obs3_intro')||0}catch(e){}
const ch2Clear=()=>{try{return !!localStorage.getItem('obs2_clear')}catch(e){return false}};
MON.def.deer={h:2.55,em:.07};MON.def.axe={h:1.82,em:.22};MON.def.lantern={h:2.25,em:.05};MON.def.widow={h:2.2,em:.06};
// 점프스케어 사진 (가로)
[['사슴머리','deer'],['나무꾼','axe'],['파수꾼','lantern'],['지퍼 여는 것','widow'],['부르는 것','caller']].forEach(([k,f])=>{const a=new Image();a.onload=()=>{JIMG[k]=a};a.src='img/c3_'+f+'1.jpg?v='+VER;const b=new Image();b.onload=()=>{JALT[k]=b};b.src='img/c3_'+f+'2.jpg?v='+VER});
const DEATH3={'사슴머리':['뒤에 바짝 붙어 있었다.','발소리가 내 발소리에 겹쳐 들리면 뒤돌아보세요. 사라질 때까지.'],
  '나무꾼':['멈추지 않았다.','숲에서 누가 길로 튀어나오면 바로 멈추세요. 숲으로 돌아갈 때까지.'],
  '부르는 것':['돌아보지 말았어야 했다.','뒤에서 부르는 목소리엔 절대 돌아보지 마세요.'],
  '파수꾼':['지퍼 틈으로 들켰다.','벽에 손자국이 찍히면 무릎 위 침낭을 꾹 눌러 뒤집어쓰세요. 지퍼가 다시 닫힐 때까지.'],
  '지퍼 여는 것':['지퍼가 끝까지 열렸다.','지퍼가 확 열리면 화면 아무 데나 계속 연타하세요. 끝까지 닫힐 때까지.'],
  '그림자':['어둠 속에서 다가왔다.','텐트 안에 두 눈이 보이면 손전등을 다시 켜세요.'],
  '교대자':['텐트 불빛을 보고 들어왔다.','손전등이 지직거리며 깜빡이면 바로 끄세요. 지직 소리가 그치면 다시 켜도 돼요.']};
{const walkAx=['멈추지 않았다.','숲에서 누가 길로 튀어나오면 바로 멈추세요. 숲으로 돌아갈 때까지.'],tentAx=['도끼를 피하지 못했다.','옆벽에 큰 그림자가 비치다 멈추면, 그때 화면을 누르세요. 반대쪽으로 굴러 피합니다. 너무 일찍 움직이면 따라옵니다.'];
 Object.defineProperty(DEATH3,'나무꾼',{get:()=>S&&S.ch===3&&(S.ph==='tent'||S.inTent)?tentAx:walkAx,enumerable:true})}
{const walkRn=['따라잡혔다.','뒤에서 덤불이 부서지며 뭔가 달려오면, 빨간 리본 나무까지 멈추지 말고 달리세요. 돌아보면 느려집니다.'],tentRn=['텐트 밖에서 덮쳤다.','텐트가 무너지면 지퍼를 열고 나가 폴을 세우세요. 달려오는 소리가 나면 그쪽을 보고 손전등을 비추세요.'];
 Object.defineProperty(DEATH3,'질주자',{get:()=>S&&S.ch===3&&(S.ph==='tent'||S.inTent)?tentRn:walkRn,enumerable:true})}
const RULES3={ // [몇 일 차부터, 신호, 할 일] (젖은 쪽지: 앞면 = 걸을 때, 뒷면 = 텐트 안)
  walk:[[1,'내 발소리에 발소리가 겹침','뒤돌아보기. 사라질 때까지 볼 것'],
    [1,'리본 없는 갈림길','가지 말 것. 같은 데로 돌아옴'],
    [2,'길로 누가 튀어나옴','바로 멈추기. 숲으로 돌아갈 때까지'],
    [2,'뒤에서 덤불이 부서짐','빨간 리본 나무까지 멈추지 말고 달리기. 돌아보면 느려짐'],
    [3,'뒤에서 누가 부름','절대 돌아보지 말 것'],
    [4,'바랜 흰 리본','빨간 리본만 따라갈 것']],
  tent:[[1,'벽에 손자국','침낭 뒤집어쓰기. 지퍼가 다시 닫힐 때까지'],
    [1,'어둠 속 두 눈','손전등 다시 켜기'],
    [2,'지퍼가 확 열림','끝까지 닫힐 때까지 아무 데나 연타'],
    [3,'옆벽의 큰 그림자가 멈춤','그때 화면 누르기 (반대로 굴러 피함)'],
    [3,'텐트가 무너짐','지퍼 열고 나가 폴 세우기. 달려오는 쪽을 손전등으로 비추기'],
    [4,'손전등이 지직거림','바로 끄기. 지직 소리가 그치면 켜기']]};

// ---------- 소품 불러오기 (처음 챕터 3을 열 때 한 번) ----------
const PROP3={pine:{h:1},dead:{h:1},bush:{h:1},rock:{h:1},log:{h:1},sign:{h:1},tent:{h:1}};
function c3Load(){if(F3.ld)return F3.ld;monLoad(['deer','axe','lantern','widow','shadow','stalker','runner']);
  F3.ld=(MON.ld||Promise.resolve()).then(()=>Promise.all(Object.keys(PROP3).map(k=>MON.fail?null:MON.GL.loadAsync('model/p_'+k+'.glb?v='+VER).then(g=>{const T=R3.T;let m=null;g.scene.traverse(o=>{if(o.isMesh&&!m)m=o});if(!m)return;
    g.scene.updateMatrixWorld(true);const geo=m.geometry.clone().applyMatrix4(m.matrixWorld);geo.computeBoundingBox();const b=geo.boundingBox,c=b.getCenter(new T.Vector3());geo.translate(-c.x,-b.min.y,-c.z);geo.computeBoundingBox();geo.computeBoundingSphere();
    const mat=m.material;mat.roughness=.92;mat.metalness=0;if(k==='pine'||k==='bush')mat.side=T.DoubleSide;
    PROP3[k]={geo,mat,h:b.max.y-b.min.y,w:Math.max(b.max.x-b.min.x,b.max.z-b.min.z)};F3.np=(F3.np||0)+1}).catch(e=>{console.warn('소품',k,e);F3.np=(F3.np||0)+1})))).then(()=>{F3.ready=true});
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
  W3.fill=new T.PointLight(0xffe2c0,0,3.2,2);sc.add(W3.fill); // 텐트 안: 손전등이 천에 반사돼 은은하게 퍼지는 빛
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
   if(day<5){const tp=PROP3.tent,ts=1.5/tp.h,tx=c.x+c.tx*3.4,tz=c.z+c.tz*3.4;const te=new T.Mesh(tp.geo,tp.mat);te.scale.setScalar(ts);te.visible=false;{const bag=grp(tx,hg(tx,tz),tz,dir+.4,sc);W3.campBag=bag;CYL(.13,.13,.62,MS({color:0x3e4a30,roughness:.9}),0,.13,0,bag,14).rotation.z=PI2;[-.2,.2].forEach(x=>CYL(.135,.135,.03,MS({color:0x1a1a16}),x,.13,0,bag,14).rotation.z=PI2);BOX(.34,.46,.22,MS({color:0x29333b,roughness:.9}),.55,.23,.15,bag).rotation.y=.5}te.position.set(tx,hg(tx,tz)-.04,tz);te.rotation.y=Math.atan2(c.tz,-c.tx);te.castShadow=te.receiveShadow=true;sc.add(te);W3.tentX=te;W3.tentP=new T.Vector3(tx,hg(tx,tz),tz);W3.tentRy=dir;
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
     dr:{st:'off',timer:rnd(13,18),d:40,wT:0,stepT:0},wc:{st:'off',timer:rnd(28,45)},ws:{st:n<=4?'off':'done',timer:rnd(35,70)},cl:{st:'off',timer:rnd(45,70),after:0},rc:{st:n>=2?'off':'done',timer:rnd(55,85)},
     brH:false,breath:1,tn:null};
  ['end','start','devp','log','brkp'].forEach(id=>$(id)&&$(id).classList.remove('show'));jump=0;document.body.classList.remove('scare');
  if(!R3.ok){setMode('end');showEnd('3D 필요','챕터 3은 3D로만 할 수 있어요.\n('+(R3.why||'3D 불러오는 중')+')','메인 메뉴',toMenu);return}
  const go=()=>{if(!S||S.night!==n||S.ch!==3)return;build3D3(n);setMode('game');buildUI();updHUD();
    if(phase==='tent'||(DEV.on&&DEV.ph3==='tent')){DEV.ph3=null;startTent3(true);if(DEV.solo)pracInit();return}
    if(DEV.on&&DEV.cut3){const id=DEV.cut3;DEV.cut3=null;S.paused=false;S.fade=0;S.fadeTo=0;if(id==='intro'){cut3('intro',toMenu);return}S.ps=F3.w.L-.4;S.wt=DUSK3[n]*.9;S.yaw=null;camWalk3();if(id==='pitch')cut3('pitch',toMenu);else cut3('exit',()=>end3());return}
    if(n===1&&!INTRO3&&!DEV.on){INTRO3=1;try{localStorage.setItem('obs3_intro','1')}catch(e){}cut3('intro',()=>dayCard3(n,1))}else{dayCard3(n);if(DEV.solo)pracInit()}};
  if(!F3.ready){c3Load();loadWait(3,()=>F3.ready,()=>(F3.np||0)/7,go);return}
  go()}
// "N일 차" 글자 → 쪽지(규칙) → 닫으면 걷기 시작
function dayCard3(n,keep){S.ph='walk';S.cut=null;S.yaw=null;if(!keep)S.fade=1;S.fadeTo=0;const tx=n+'일 차',el=$('introSmall');$('introBig').textContent=n===5?'숲의 끝':'해 지기 전에';el.textContent='';let k=0;const iv=setInterval(()=>{k++;el.textContent=tx.slice(0,k);if(k>=tx.length)clearInterval(iv)},40);
  const it=$('intro');it.classList.remove('show');void it.offsetWidth;it.classList.add('show');
  setTimeout(()=>{it.classList.remove('show');if(S&&S.night===n&&!S.over&&mode==='game'&&S.ch===3){if(!DEV.solo)openLog();else S.paused=false;if(n===1)S.hintT=9}},DEV.on?600:2300)}

// ---------- 걷기 ----------
const W3c=()=>F3.w;
function onTrk(){const W3=F3.w;return S.trk<0?trkAt(W3.main,S.ps+W3.s0):trkAt(W3.forks[S.trk].tr,W3.forks[S.trk].b0+S.sb)}
function trkS(){const W3=F3.w;return S.trk<0?S.ps+W3.s0:W3.forks[S.trk].s+W3.s0+S.sb} // 덩어리 고르기용 (본 길 기준)
function behind(d){const W3=F3.w;if(S.trk>=0){const f=W3.forks[S.trk];if(d<=S.sb)return trkAt(f.tr,f.b0+S.sb-d);return trkAt(W3.main,f.s+W3.s0-(d-S.sb))}return trkAt(W3.main,S.ps-d+W3.s0)}
function walk3(dt){const W3=F3.w,n=S.night;S.wt+=dt;
  if(S.hintT>0)S.hintT-=dt;
  const back=S.inBack&&!S.atFork&&S.loopT<=0;S.lb=Math.max(0,Math.min(1,S.lb+(back?1:-1)*dt*3.2));
  const ch=S.rc&&S.rc.st==='chase',can=(S.inWalk||ch&&S.walkId!=null)&&(S.lb<.04||ch)&&!S.atFork&&S.loopT<=0&&S.ph==='walk'; // 쫓길 땐 누르고 있으면 전력 질주 (돌아보면 느려짐)
  S.v+=((can?WALK_V*(S.hard?1.04:1)*(ch?2.8*(1-.6*S.lb):1):0)-S.v)*Math.min(1,dt*(can?(ch?2.6:4):7));if(S.v<.02)S.v=0;
  if(S.trk<0){S.ps+=S.v*dt;const f=W3.forks[S.fk];if(f&&S.ps>=f.s-1.3){S.ps=f.s-1.3;if(!S.atFork){S.atFork=true;S.v=0}}
    if(S.ps>=W3.L-.4){S.ps=W3.L-.4;arrive3();return}}
  else{S.sb+=S.v*dt;if(S.sb>15&&S.loopT<=0){S.loopT=1.1;sting(0);nburst(300,.6,1.2,.25,0,0,'lowpass')}}
  if(S.loopT>0){const was=S.loopT;S.loopT-=dt;if(was>.55&&S.loopT<=.55){const f=W3.forks[S.trk];S.trk=-1;S.sb=0;S.ps=f.s-30;S.yaw=null;S.dr.d=Math.max(S.dr.d,20);say(['...여기 아까 지나온 데다.','같은 나무. 같은 표지판.','또 여기야.'][Math.min(2,S.loops=(S.loops||0)+1)-1],'bad',3)}}
  S.stepD+=S.v*dt;if(S.stepD>.74){S.stepD=0;S.foot=-(S.foot||1);leafStep(S.foot*.12,.16+S.v*.05);if(S.dr.st==='come'&&S.cl.st!=='call')deerStep(S.dr.d,.15+rnd(0,.06))} // 사슴머리 발소리는 내 발소리 바로 뒤에 겹침
  if(S.wt>DUSK3[n]*.82&&!S.lateSaid){S.lateSaid=1;say('해가 거의 졌다. 서둘러야 해.','',3)}
  chase3(dt);deer3(dt);wood3(dt);caller3(dt);sight3(dt)}
// 질주자 (2일 차~): 뒤에서 덤불을 부수고 튀어나와 네 발로 달려옴 → 앞에 빨간 리본 나무까지 멈추지 말고 달려야 함. 돌아보면 느려짐
const rcOn3=()=>S.rc&&(S.rc.st==='burst'||S.rc.st==='chase'||S.rc.st==='safe'||(S.rc.st==='off'&&S.rc.timer<7&&S.night>=2&&SOLO3('runner')&&rcOk3()));
// 쫓기기 시작해도 되는 자리: 본 길 위, 다음 갈림길까지 28m 넘게 남음 (리본 나무는 갈림길 앞에 둠)
function rcOk3(){const W3=F3.w,f=W3.forks[S.fk];return S.trk<0&&!S.atFork&&S.loopT<=0&&S.ps>(DEV.solo?4:30)&&S.ps<W3.L-40&&!(f&&f.s-S.ps<28)} // 곧 나올 때도 다른 것들이 새로 시작하지 않음
function chase3(dt){const r=S.rc,W3=F3.w,n=S.night;if(!r||r.st==='done'||!SOLO3('runner'))return;
  if(r.st==='off'){const f=W3.forks[S.fk];r.timer-=dt;
    if(r.timer<=0&&rcOk3()&&S.dr.st==='off'&&S.wc.st==='off'&&S.cl.st==='off'&&S.lb<.05){r.st='burst';r.t=0;r.d=17.5;r.s=Math.min(S.ps+38,W3.L-8,f?f.s-4:1e9);r.stepT=0;r.side=Math.random()<.5?-1:1;rcTree3(r);
      if(S.ws.st==='show'){S.ws.st='go';S.ws.t=0}
      nburst(700,.6,.9,.5,0,0,'lowpass');nburst(2400,2,.5,.25,0,.05);thump(42,.45,.55,0);thump(70,.2,.3,0,.18);sting(0);setTimeout(()=>{if(S&&S.rc===r&&!S.over)say('뛰어!','bad',1.8)},350)} // 뒤에서 덤불이 와장창
    return}
  r.t+=dt;
  if(r.st==='burst'){if(r.t>.55){r.st='chase';r.t=0;thump(50,.3,.35,0)}return}
  if(r.st==='chase'){const vr=(4.85+n*.12)*(S.hard?1.06:1);if(S.loopT<=0)r.d-=(vr-S.v)*dt;r.d=Math.min(r.d,19);
    r.stepT-=dt;if(r.stepT<=0){r.stepT=.19;rcStep3(r.d)}S.shake=Math.max(S.shake,r.d<5?.08:0);
    if(S.trk<0&&S.ps>=r.s-1.3){r.st='safe';r.t=0;r.d0=r.d;thump(55,.3,.4,0);nburst(1800,1.5,.6,.22,0);nburst(500,.8,.8,.18,0,.1,'lowpass');achC3('runner');setTimeout(()=>{if(S&&S.rc===r&&!S.over)say('...리본 앞에서 멈췄다.','',2.6)},500);return} // 리본 나무를 지나면 그 앞에서 미끄러지며 멈춤
    if(r.d<1.1)return die('질주자');return}
  if(r.st==='safe'){if(r.t>3.4)r.st='done'}}
function rcStep3(d){const v=Math.max(0,1-d/26)**1.2*.55;if(v<.01)return;thump(62+(1-d/26)*30,.08,v,0);nburst(500+(1-d/26)*900,1.6,.05,v*.7,0);if(Math.random()<.35)nburst(2600,4,.03,v*.35,0);if(d<9&&Math.random()<.2)nburst(300,.7,.35,v*.4,0,.08,'lowpass')} // 네 발로 땅 차는 소리 + 낙엽 + (가까우면) 거친 숨
// 빨간 리본을 감은 죽은 나무 (쫓길 때 도망칠 곳): 그때그때 길 옆에 세움
function rcTree3(r){const W3=F3.w,T=R3.T,hg=W3.hg,p=trkAt(W3.main,r.s+W3.s0),sd=r.side*1.15,x=p.x-p.tz*sd,z=p.z+p.tx*sd;
  if(!W3.rcT){const g=new T.Group();W3.sc.add(g);const bark=MS({color:0x2c241c,roughness:1});CYL(.1,.17,4.2,bark,0,2.1,0,g,9);CYL(.04,.07,1.3,bark,.25,3.3,0,g,6).rotation.z=-.8;CYL(.03,.05,1,bark,-.2,2.9,.1,g,6).rotation.z=.9;
    const rb=MS({map:ribbonTex(),color:0xffffff,roughness:.85,side:T.DoubleSide,emissive:0x8a0c08,emissiveIntensity:1.3});mesh(new T.CylinderGeometry(.16,.16,.22,14,1,true),rb,0,1.55,0,g);mesh(new T.CylinderGeometry(.13,.14,.12,14,1,true),rb,0,2.35,0,g);
    W3.rcTails=[0,1,2,3].map(k=>{const t=mesh(new T.PlaneGeometry(.09,.8,1,6),rb,.17,k<2?1.5:2.3,(k%2-.5)*.08,g);t.geometry.translate(0,-.3,0);t.rotation.z=.12+k*.16;return t});W3.rcT=g}
  W3.rcT.position.set(x,hg(x,z)-.05,z);W3.rcT.rotation.y=Math.atan2(-p.tz*r.side,p.tx*r.side);W3.rcT.visible=true}
// 나무꾼이 멀리 숲속에 서서 보고 있음 (괴롭히진 않음): 나무 찍는 소리가 멎고 → 길 옆 나무 사이에 서 있음 → 가까이 가면 숲으로 사라짐
function sight3(dt){const v=S.ws,W3=F3.w;if(v.st==='done'||DEV.solo)return;
  if(v.st==='off'){if(S.wc.st==='off'&&!rcOn3()&&S.trk<0&&!S.atFork&&S.ps>30&&S.ps<W3.L-45&&S.dr.st!=='come'&&S.cl.st!=='call'&&S.loopT<=0)v.timer-=dt;
    if(v.timer<=0){const f=W3.forks[S.fk];if(f&&f.s-S.ps<45){v.timer=4;return}v.st='chop';v.t=0;v.k=0;v.side=Math.random()<.5?-1:1;v.s=S.ps+rnd(30,36);v.off=rnd(7,10)}return}
  v.t+=dt;
  if(v.st==='chop'){if(v.t>v.k*1.15&&v.k<5){v.k++;chop3(v.side*.6,.07+v.k*.012)}if(v.t>6.8){v.st='show';v.t=0}return}
  if(v.st==='show'){const d=v.s-S.ps;if(d<17||rcOn3()||v.t>14||S.dr.st==='come'||S.cl.st==='call'||S.wc.st!=='off'){v.st='go';v.t=0;leafStep(v.side*.7,.06)}return}
  if(v.st==='go'&&v.t>1.6)v.st='done'}
function chooseFork(main){const W3=F3.w,f=W3.forks[S.fk];if(!f||!S.atFork)return;S.atFork=false;leafStep(0,.2);
  if(main){S.fk++}else{S.trk=S.fk;S.sb=0}}
// 사슴머리: 뒤에서 따라옴. 안 보고 있으면 다가오고, 돌아보면 그 자리에 굳음 → 계속 보고 있으면 숲으로 사라짐
function deer3(dt){const d=S.dr,n=S.night,calm=S.cl.st==='call'||S.cl.after>0;if(!SOLO3('deer'))return;
  if(d.st==='off'){if((S.ps>12||DEV.solo)&&!calm&&!S.atFork&&!rcOn3())d.timer-=dt;if(d.timer<=0){d.st='come';d.d=rnd(15,18);d.wT=0;d.stepT=0}return}
  if(d.st==='come'){const see=S.lb>.85&&d.d<16.5;if(see){d.wT+=dt;if(d.wT>1.15){d.st='leave';d.lT=0;d.side=Math.random()<.5?-1:1;thump(70,.2,.12,0);nburst(900,1,.5,.08,0)}return}d.wT=Math.max(0,d.wT-dt*2);
    if(calm||S.loopT>0)return;const vd=(2.5+n*.1)*(S.hard?1.12:1);d.d=Math.min(19,d.d-(vd-S.v)*dt);
    if(S.v<.3){d.stepT-=dt;if(d.stepT<=0){d.stepT=.6;deerStep(d.d,0)}} // 내가 멈춰도 발소리는 계속됨
    if(d.d<1.3)return die('사슴머리');return}
  if(d.st==='leave'){d.lT+=dt;if(d.lT>2.8){d.st='off';d.timer=cd3(Math.max(9,rnd(16,25)-n*1.3)*(S.hard?.8:1))}}}
// 나무꾼: 바로 앞 나무 사이에서 길로 툭 튀어나옴 → 바로 멈춰야 함 (조금이라도 계속 걸으면 달려듦). 멈춰 있으면 한 걸음씩 다가오다 숲으로 들어감
function wood3(dt){const w=S.wc,W3=F3.w,n=S.night;if(n<2||!SOLO3('axe'))return;
  if(w.st==='off'){const f=W3.forks[S.fk],nearFork=f&&f.s-S.ps<25;if(S.trk<0&&!S.atFork&&!nearFork&&S.ps>(DEV.solo?6:25)&&S.ps<W3.L-30&&!rcOn3())w.timer-=dt;
    if(w.timer<=0&&S.cl.st!=='call'){const a=trkAt(W3.main,S.ps+W3.s0),b=trkAt(W3.main,S.ps+W3.s0+10),dx=b.x-a.x,dz=b.z-a.z,l=Math.hypot(dx,dz);if((dx*a.tx+dz*a.tz)/l<.95){w.timer=1;return}
      w.st='out';w.t=0;w.s=S.ps+rnd(6.2,7.6);w.side=Math.random()<.5?-1:1;w.wait=0;w.cr=2;w.need=rnd(5,7)*(S.hard?1.2:1);w.g=S.hard?.85:1;
      leafStep(w.side*.5,.3);nburst(1400,1.5,.35,.22,w.side*.5);thump(60,.2,.3,w.side*.3);axeTok(.22);sting(w.side*.3)}return}
  const dist=w.s-S.ps;w.t=(w.t||0)+dt;
  if(w.st==='out'||w.st==='stand'){if(S.trk>=0){w.st='off';w.timer=rnd(20,30);return}
    if(S.v>.25&&w.t>w.g){w.st='charge';w.t=0;scrapeAxe();return}
    if(w.st==='out'&&w.t>.6){w.st='stand';axeTok(.12)}
    if(w.st==='stand'){if(S.v<.12)w.wait+=dt;w.cr-=dt;if(w.cr<=0&&dist>4.1){w.cr=rnd(1.8,2.6);w.s-=.45;leafStep(0,.2);thump(55,.12,.12,0)} // 한 걸음 다가옴
      if(w.wait>w.need){w.st='leave';w.lT=0;w.side=-w.side;leafStep(w.side*.4,.14)}}return}
  if(w.st==='charge'){w.s-=dt*(w.t<.3?0:8);if(w.t>.8)return die('나무꾼');return}
  if(w.st==='leave'){w.lT+=dt;if(w.lT>3.2){w.st='off';w.timer=cd3(rnd(30,45)-n*2)}}}
// 부르는 것 (3일 차~): 뒤에서 부름. 돌아보면 죽음. 부르는 동안·직후엔 사슴머리가 안 움직임
const CALL3=[['...저기요.',0],['...잠깐만 서 봐요.',2.3],['뒤에. 여기 있어.',4.6]];
function caller3(dt){const c=S.cl,n=S.night;if(n<3||!SOLO3('caller'))return;if(c.after>0)c.after-=dt;
  if(c.st==='off'){if(!S.atFork&&S.loopT<=0&&S.ps>(DEV.solo?4:20)&&!rcOn3())c.timer-=dt;if(c.timer<=0&&S.lb<.02&&(S.dr.st!=='come'||S.dr.d>22)&&S.wc.st!=='charge'){c.st='call';c.t=0;c.i=0}return}
  c.t+=dt;while(c.i<CALL3.length&&c.t>=CALL3[c.i][1]){say(CALL3[c.i][0],'voice',2.2);whisperBehind(.16+c.i*.05);c.i++}
  if(S.lb>.22)return die('부르는 것');
  if(c.t>7.2){c.st='off';c.timer=cd3(rnd(45,65)-n*3);c.after=3}}
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
      if(d.st==='come'){lookYaw(I,x,z);const a=monPlay(I,'stalk');const see=S.lb>.85&&d.d<16.5;if(I.acts.stalk)I.acts.stalk.timeScale=see?0:.9;monFade(I,1);I.g.rotation.x=see?.05:0} // 보는 순간 걸음 중간에 그대로 굳음
      else{const k=d.lT;x+=nx*d.side*k*1.15;z+=nz*d.side*k*1.15;I.g.rotation.y=Math.atan2(nx*d.side,nz*d.side);monPlay(I,'walk',{speed:.8});monFade(I,Math.max(0,1-Math.max(0,k-1.2)/1.4))}
      I.g.position.set(x,hg(x,z),z)}else monHide(I)}}
  // 나무꾼
  {const I=mon3('axe','axe',1);if(I){if(S.night>=2&&w.st!=='off'){const p=trkAt(W3.main,w.s+W3.s0),nx=-p.tz,nz=p.tx;let x=p.x,z=p.z;I.g.visible=true;
      if(w.st==='out'){const k=ease(Math.min(1,w.t/.6));x+=nx*w.side*lerp(2.6,0,k);z+=nz*w.side*lerp(2.6,0,k);lookYaw(I,x,z);monPlay(I,'walk',{speed:1.4});monFade(I,1)}
      else if(w.st==='stand'){lookYaw(I,x,z);monPlay(I,'idle');monFade(I,1)}
      else if(w.st==='charge'){lookYaw(I,x,z);monPlay(I,w.t<.35?'charge':'sprint',{speed:1.25,fade:.12});monFade(I,1)}
      else{const k=w.lT;x+=nx*w.side*k*1.1;z+=nz*w.side*k*1.1;I.g.rotation.y=Math.atan2(nx*w.side,nz*w.side);monPlay(I,'walk');monFade(I,Math.max(0,1-Math.max(0,k-1.6)/1.5))}
      I.g.position.set(x,hg(x,z),z)}
    else if(S.ws&&(S.ws.st==='show'||S.ws.st==='go')){const v=S.ws,p=trkAt(W3.main,v.s+W3.s0),nx=-p.tz,nz=p.tx;let x=p.x+nx*v.side*v.off,z=p.z+nz*v.side*v.off;I.g.visible=true;
      if(v.st==='show'){lookYaw(I,x,z);monPlay(I,'idle',{speed:.6});monFade(I,Math.min(1,v.t/.4))}else{const k=v.t;x+=nx*v.side*k*1.3;z+=nz*v.side*k*1.3;I.g.rotation.y=Math.atan2(nx*v.side,nz*v.side);monPlay(I,'walk');monFade(I,Math.max(0,1-k/1.4))}
      I.g.position.set(x,hg(x,z),z)}else monHide(I)}}
  // 질주자: 뒤에서 네 발로 달려옴 → 리본 나무 앞에서 미끄러지며 멈추고 숲으로
  {const r=S.rc,on=r&&(r.st==='chase'||r.st==='safe'||r.st==='burst');const I=on?mon3('runW','runner',1):W3.mons.runW;if(I){if(on){const T=R3.T;let dd=r.d,k=0,mode='run';
      if(r.st==='burst'){dd=r.d+(1-r.t/.55)*3}
      if(r.st==='safe'){k=Math.min(1,r.t/.35);dd=r.d0+Math.min(r.t,.6)*2.2+Math.max(0,r.t-1.3)*0;mode=r.t<1.3?'skid':'run'}
      const p=behind(Math.max(1.1,dd)),nx=-p.tz,nz=p.tx;let x=p.x,z=p.z;I.g.visible=true;const tt=T_;
      if(mode==='run'&&!(r.st==='safe')){lookYaw(I,x,z);x+=Math.sin(tt*23)*.02;I.g.rotation.x=Math.sin(tt*15)*.06;I.g.rotation.z=Math.sin(tt*11)*.05;monFade(I,1)}
      else if(r.st==='safe'&&r.t<1.3){lookYaw(I,x,z);I.g.rotation.x=-.12*k;I.g.rotation.z=0;monFade(I,1)}
      else{const q=r.t-1.3;x+=nx*r.side*q*5;z+=nz*r.side*q*5;I.g.rotation.y=Math.atan2(nx*r.side,nz*r.side);I.g.rotation.x=0;monFade(I,Math.max(0,1-q/1.2))}
      I.g.position.set(x,hg(x,z)+(mode==='run'?Math.abs(Math.sin(tt*15))*.07:0),z);runPose(I,mode,tt,k)}else monHide(I)}}}

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
  if(W3.rcTails)W3.rcTails.forEach((t,i)=>{t.rotation.z=.12+i*.16+Math.sin(T_*2.6+i*1.7)*.22;t.rotation.x=Math.sin(T_*1.9+i*2)*.2});
  // 손전등: 카메라 오른쪽 아래에서 보는 쪽으로
  const fw=new T.Vector3(0,0,-1).applyQuaternion(cam.quaternion);const on=torchOn3();
  W3.torch.position.copy(cam.position).add(new T.Vector3(.12,-.22,0).applyQuaternion(cam.quaternion));W3.torch.target.position.copy(cam.position).addScaledVector(fw,10);
  const fk=S.flick3>0&&Math.random()<.5?.2:1;W3.torch.intensity=on?(S.cut&&S.cut.dim?14:S.ph==='walk'||S.cut&&S.cut.walkK!=null?lerp(25,75,k):S.inTent&&!(S.tn&&S.tn.out)?4.4*(1-Math.min(1,(S.tn&&S.tn.hd||0)*1.2)):S.tn&&S.tn.out?30:60)*fk:0;
  {const inT=(S.ph==='tent'||S.ph==='dawn')&&on&&!S.brH&&!(S.tn&&S.tn.out);W3.fill.intensity=inT?2.5*fk:0;if(inT)W3.fill.position.copy(cam.position).addScaledVector(fw,-.1).add(new T.Vector3(0,.32,0))}
  if(S.ph==='walk'||(S.cut&&S.cut.mons))walkMons3();else{monHide(W3.mons.deer);monHide(W3.mons.axe);monHide(W3.mons.runW)}
  if(S.inTent||S.ph==='tent'||S.ph==='dawn')tentMons3();else tentHide3();
  if(W3.exitL){W3.exitL.intensity=5.5*(Math.random()<.03?.4:1);W3.exitS.intensity=1.4*(Math.random()<.02?.2:1)}
  const fx=fxBegin();R3.rd.render(W3.sc,cam);
  if((S.ph!=='cut'||S.cut&&S.cut.hands)&&!(S.tn&&S.tn.hd>.35&&S.ph==='tent')){HND.hemi&&HND.hemi.color.setHex(0x8090a8);drawHands(0,false,false)}
  if(fx)fxEnd(cam);cx.drawImage(R3.rd.domElement,0,0,W,H)}
const torchOn3=()=>!S.torchOff&&!(S.cut&&S.cut.dark);
const lightOut3=()=>torchOn3()&&!S.brH; // 텐트 밖·어둠 속에서 보이는 빛 (침낭을 뒤집어쓰면 가려짐)
function camWalk3(){S.rcF=(S.rcF||0)+(((S.rc&&S.rc.st==='chase')?-.13:0)-(S.rcF||0))*.05;fov3(S.rcF);const cam=R3.cam,W3=F3.w,p=onTrk(),want=Math.atan2(-p.tx,-p.tz);if(S.yaw==null)S.yaw=want;let dA=want-S.yaw;dA=Math.atan2(Math.sin(dA),Math.cos(dA));S.yaw+=dA*Math.min(1,1/60*3.5);
  const vk=Math.min(1.7,S.v/WALK_V);S.bobP=(S.bobP||0)+S.v/60*1.35;const bob=Math.sin(S.bobP*Math.PI*2)*.035*vk,sw=Math.sin(S.bobP*Math.PI)*.025*vk;
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
function danger3(){if(!S)return 0;const d=S.dr,tn=S.tn;let v=0;if(S.ph==='walk'){if(d.st==='come')v=Math.max(v,1-d.d/17);if(S.wc.st==='stand'||S.wc.st==='out')v=Math.max(v,.75);if(S.cl.st==='call')v=Math.max(v,.85);if(S.rc&&S.rc.st==='chase')v=Math.max(v,.6,1-S.rc.d/18)}
  if(tn){v=Math.max(v,(tn.sh||0)/100,tn.zip&&tn.zip.on?.9:0,lanLit3()?.95:0,tn.st&&tn.st.stage>=4?.8:0,axOn3()?.9:0)}return v}
// 걷기 화면 위: 갈림길 화살표, 처음 안내
function walkUI3(){const W3=F3.w,T=R3.T,cam=R3.cam;S.forkUI=null;if(window.TRL)return;
  if(S.atFork&&S.lb<.05){const f=W3.forks[S.fk],pr=(tr,s)=>{const p=trkAt(tr,s),v=new T.Vector3(p.x,W3.hg(p.x,p.z)+.9,p.z).project(cam);return{x:(v.x+1)/2*W,y:(1-v.y)/2*H,ok:v.z<1}};
    const a=pr(W3.main,f.s+W3.s0+6),b=pr(f.tr,f.b0+6);S.forkUI=[Object.assign(a,{main:true}),Object.assign(b,{main:false})];
    S.forkUI.forEach(o=>{if(!o.ok)return;const hov=!PT.touch&&Math.hypot(PT.x-o.x,PT.y-o.y)<70,a2=hov?1:.75+.2*Math.sin(T_*3);cx.save();cx.translate(o.x,o.y);cx.globalAlpha=a2;cx.strokeStyle='#ece5cd';cx.lineWidth=3;cx.shadowColor='#000';cx.shadowBlur=8;
      const s2=Math.max(16,H*.03);for(let k=0;k<2;k++){cx.beginPath();cx.moveTo(-s2,k*s2*.8+s2*.2);cx.lineTo(0,k*s2*.8-s2*.5);cx.lineTo(s2,k*s2*.8+s2*.2);cx.stroke()}
      cx.restore();tapeLabel('이쪽으로',o.x,o.y+Math.max(16,H*.03)*1.9,a2)})}
  // 양옆: 누르고 있는 동안 그쪽 어깨 너머로 뒤돌아봄
  if(!S.atFork&&S.loopT<=0&&!S.paused&&!S.log&&!window.TRL){const zw=navW3();[-1,1].forEach(d=>{const held=S.inBack&&S.lb>.05&&(S.lbDir||1)===-d,hov=!PT.touch&&PT.x>=0&&walkNav3(PT)===d,a=held||hov?1:PT.touch?.55:.36,x0=d<0?0:W-zw;
    const gr=cx.createLinearGradient(d<0?0:W,0,d<0?zw:W-zw,0);gr.addColorStop(0,`rgba(0,0,0,${.55*a})`);gr.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=gr;cx.fillRect(x0,0,zw,H);
    const cxp=d<0?zw*.45:W-zw*.45,cy=H*.5,r=Math.min(13,zw*.2);cx.save();cx.strokeStyle=cx.fillStyle=`rgba(236,224,170,${.8*a})`;cx.lineWidth=2.2;cx.lineCap='round';
    cx.beginPath();cx.arc(cxp,cy,r,d<0?-.2:Math.PI+.2,d<0?Math.PI*1.25:-Math.PI*.25,d>0);cx.stroke(); // 휘어 돌아가는 화살표
    const ea=d<0?Math.PI*1.25:-Math.PI*.25,ex=cxp+Math.cos(ea)*r,ey=cy+Math.sin(ea)*r;cx.beginPath();cx.moveTo(ex-d*6,ey-5);cx.lineTo(ex+d*1,ey+3);cx.lineTo(ex+d*7,ey-3);cx.stroke();
    cx.font=`${Math.max(12,Math.min(15,H*.024))}px 'Galmuri11',monospace`;cx.textAlign='center';cx.textBaseline='top';cx.fillText('뒤',cxp,cy+r+9);cx.restore()});
    const want=walkNav3(PT)?'pointer':'default';if(cv.style.cursor!==want)cv.style.cursor=want}
  if(S.hintT>0&&!S.log){const a=Math.min(1,S.hintT/1.5)*.9;tapeLabel(MOB?'화면 꾹: 걷기':'화면 꾹 (W): 걷기',W/2,H*.36,a);if(S.hintT<6.5)tapeLabel(MOB?'양옆 화살표 꾹: 그쪽으로 뒤돌아보기':'양옆 화살표 꾹 (A / D): 뒤돌아보기',W/2,H*.36+Math.max(13,H*.026)*2.4,Math.min(1,(6.5-S.hintT)/1)*a)}}
function walkNav3(p){if(!S||S.ph!=='walk'||S.atFork||S.loopT>0)return 0;const zw=navW3();return p.x<zw?-1:p.x>W-zw?1:0}
function lookBack3(d,id){S.inBack=true;S.backId=id;if(S.lb<.08)S.lbDir=d<0?1:-1}

CHT[3]={CAMS:['A'],CAMN:['-'],KIND:['p_tun'],ADJ:[[0]],DIST:[1],MAPP:[[50,50]],EXIT_CAM:[-1,-1,-1,-1,-1]};
function buildUI3(){const w=S.ph==='walk',t=S.ph==='tent';document.body.classList.toggle('c3w',S.ph!=='tent'&&S.ph!=='dawn');document.body.classList.toggle('c3t',t);['backBtn','peekBtn','torchBtn','eyeBtn','flashBtn','battBtn','pnlBtn'].forEach(i=>$(i).style.display='none');return;
  $('backBtn').style.display=w&&!S.atFork?'block':'none';$('peekBtn').style.display=t&&S.tn&&S.view===1&&!S.tn.zip.on?'block':'none';
  if(t){$('torchBtn').style.display=handsOn()?'none':'block';$('torchBtn').querySelector('span').textContent=S.torchOff?'손전등 켜기':'손전등 끄기';$('torchBtn').classList.toggle('off',!!S.torchOff);
    $('eyeBtn').style.display='block';$('eyeBtn').querySelector('span').textContent='숨 참기 (꾹)';const sv=$('eyeBtn').querySelector('svg');if(!F3.eyeSvg){F3.eyeSvg=sv.innerHTML;sv.innerHTML='<path d="M6 10.5c1.8-1.6 3.8-2.2 6-2.2s4.2.6 6 2.2"/><path d="M6 13.5c1.8 1.6 3.8 2.2 6 2.2s4.2-.6 6-2.2"/><path d="M4 12h16"/>'}}}
function stop3(){buzz3(false);if(F3.eyeSvg){$('eyeBtn').querySelector('svg').innerHTML=F3.eyeSvg;F3.eyeSvg=null;$('eyeBtn').querySelector('span').textContent='눈 감기 (꾹)'}document.body.classList.remove('c3w');document.body.classList.remove('c3t');if(droneG&&AC)droneG.gain.setTargetAtTime(.03,AC.currentTime,.5);['backBtn','peekBtn'].forEach(i=>$(i).style.display='none');if(F3.aud)for(const k in F3.aud)F3.aud[k].gain.setTargetAtTime(0,AC.currentTime,.1);const c=R3.cam;if(c&&c.far!==20){c.far=20;c.near=.03;c.updateProjectionMatrix()}}
function dbg3(){const d=S.dr,t=S.tn;if(t&&(S.ph==='tent'||S.ph==='dawn'))return `[치트] 숲 ${S.night}일 차 · 텐트 · ${DEV.speed}x\n그림자 ${t.sh.toFixed(0)}% · 숨 ${(S.breath*100).toFixed(0)}\n파수꾼: ${t.ln.st} ${t.ln.st==='off'?t.ln.timer.toFixed(0)+'s':''}\n지퍼: ${t.zip.on?t.zip.st+' '+(t.zip.p*100).toFixed(0)+'%':t.zip.timer.toFixed(0)+'s'}\n교대자: ${t.st.stage} (${t.st.timer.toFixed(0)}s)\n나무꾼: ${t.ax.st} ${t.ax.st==='off'?t.ax.timer.toFixed(0)+'s':''} · 위치 ${t.px.toFixed(1)}`;
  return `[치트] 숲 ${S.night}일 차 · ${S.ph} · ${DEV.speed}x\n걷기 ${S.ps.toFixed(0)}/${F3.w?F3.w.L:0}m · 시간 ${S.wt.toFixed(0)}/${DUSK3[S.night]}s\n사슴머리: ${d.st} ${d.st==='come'?d.d.toFixed(1)+'m':d.timer.toFixed(0)+'s'}\n나무꾼: ${S.wc.st}\n부르는 것: ${S.cl.st}`}
function jumpTent3(){if(!S||S.ch!==3||S.over)return;if(S.ph==='walk'){S.wt=Math.min(S.wt,DUSK3[S.night]-5);startTent3(true)}else if(S.ph==='tent')S.t=HOUR*6-3}
function retry3(){const n=S.night,ph=S.ph==='tent'||S.ph==='dawn'?'tent':'walk';return()=>{newDay3(n,ph)}}

// ---------- 입력 (챕터 3은 여기서 먼저 받아서 처리) ----------
const act3=()=>S&&S.ch===3&&mode==='game'&&!S.over&&!S.paused&&!PAUSE.on&&!S.log&&jump<=0;
addEventListener('pointerdown',e=>{if(e.target!==cv||!S||S.ch!==3||mode!=='game')return;initAudio();if(!act3())return;e.stopPropagation();const p=gameXY(e);PT.touch=e.pointerType!=='mouse';PT.x=p.x;PT.y=p.y;
  if(S.ph==='walk'){if(S.atFork&&S.forkUI){let b=null,bd=1e9;S.forkUI.forEach(o=>{const d=Math.hypot(p.x-o.x,p.y-o.y);if(o.ok&&d<bd){bd=d;b=o}});if(b&&bd<Math.max(110,W*.12)){chooseFork(b.main)}else if(b){const L=S.forkUI.reduce((a,o)=>o.x<a.x?o:a);chooseFork((p.x<W/2)===(L===S.forkUI[0]))}return}
    {const z=walkNav3(p);if(z){lookBack3(z,e.pointerId);return}}
    if(e.pointerType==='mouse'&&e.button===2){lookBack3(1,e.pointerId);return}S.walkId=e.pointerId;S.walkY=p.y;S.inWalk=true;return}
  if(S.ph==='tent')tentDown3(p,e)},true);
addEventListener('pointermove',e=>{if(!S||S.ch!==3||e.pointerId!==S.walkId)return;const p=gameXY(e),dy=p.y-S.walkY;if(dy>Math.max(36,H*.07)){if(!S.inBack&&S.lb<.08)S.lbDir=1;S.inBack=true;S.inWalk=false}else if(dy<Math.max(16,H*.03)&&S.inBack&&S.backId==null){S.inBack=false;S.inWalk=true}},true);
addEventListener('contextmenu',e=>{if(S&&S.ch===3&&e.target===cv)e.preventDefault()},true);
addEventListener('pointerup',e=>{if(!S||S.ch!==3)return;if(e.pointerId===S.backId){S.inBack=false;S.backId=null}if(e.pointerId===S.walkId){S.inWalk=false;S.walkId=null;S.inBack=false}if(S.ph==='tent')tentUp3(e)},true);
addEventListener('pointercancel',e=>{if(!S||S.ch!==3)return;if(e.pointerId===S.walkId||e.pointerId===S.backId){S.inWalk=false;S.walkId=null;S.inBack=false;S.backId=null}if(S.ph==='tent')tentUp3(e)},true);
{const hold=(id,on,off)=>{const b=$(id);b.addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();initAudio();on();b.classList.add('on')});['pointerup','pointerleave','pointercancel'].forEach(k=>b.addEventListener(k,()=>{off();b.classList.remove('on')}));b.addEventListener('contextmenu',e=>e.preventDefault())};
  hold('backBtn',()=>{if(S&&S.ch===3)S.inBack=true},()=>{if(S&&S.ch===3)S.inBack=false});
  hold('peekBtn',()=>{if(S&&S.ch===3)peek3(true)},()=>{if(S&&S.ch===3)peek3(false)})}
const K3={KeyW:'walk',ArrowUp:'walk',KeyS:'back',ArrowDown:'back',Space:'mash',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right',KeyF:'torch',KeyT:'torch',KeyE:'breath',KeyQ:'peek'};
addEventListener('keydown',e=>{if(!S||S.ch!==3||mode!=='game'||KEYWAIT)return;const a=K3[e.code];if(!a)return;e.preventDefault();e.stopImmediatePropagation();if(e.repeat||!act3())return;
  if(S.ph==='walk'){if(a==='walk')S.inWalk=true;else if(a==='back')lookBack3(-1,null);else if((a==='left'||a==='right')&&S.atFork&&S.forkUI){const L=S.forkUI.reduce((x,o)=>o.x<x.x?o:x);chooseFork((a==='left')===L.main)}else if(a==='left'||a==='right')lookBack3(a==='left'?-1:1,null);return}
  if(S.ph==='tent')tentKey3(a,true)},true);
addEventListener('keyup',e=>{if(!S||S.ch!==3)return;const a=K3[e.code];if(!a)return;if(a==='walk')S.inWalk=false;else if(a==='back'||(S.ph==='walk'&&(a==='left'||a==='right')))S.inBack=false;else if(S.ph==='tent')tentKey3(a,false)},true);
addEventListener('blur',()=>{if(S&&S.ch===3){S.inWalk=S.inBack=false;if(S.ph==='tent'){breath3(false);peek3(false)}}});
// 젖은 쪽지 (규칙). 앞면 = 걸을 때, 뒷면 = 텐트 안. 접힌 귀퉁이를 누르면 뒤집힘
function wetPaper3(){if(F3.paper)return F3.paper;const c=cvs(640,960,(q,w,h)=>{const R=mulberry(404);
  q.fillStyle='#cfc2a0';q.fillRect(0,0,w,h);
  for(let i=0;i<26000;i++){const v=R();q.fillStyle=v<.5?`rgba(255,250,230,${R()*.07})`:`rgba(70,55,30,${R()*.06})`;q.fillRect(R()*w,R()*h,1+R()*2,1)} // 종이 결
  q.globalAlpha=.5;for(let i=0;i<40;i++){q.strokeStyle=`rgba(90,70,40,${.05+R()*.06})`;q.lineWidth=.6;q.beginPath();const x=R()*w,y=R()*h;q.moveTo(x,y);q.quadraticCurveTo(x+rnd(-40,40),y+rnd(-20,20),x+rnd(-90,90),y+rnd(-30,30));q.stroke()}q.globalAlpha=1; // 섬유
  // 물 얼룩: 번진 자리 + 마른 테두리 (물때 자국)
  const stain=(x,y,r,a)=>{const pts=[];for(let k=0;k<28;k++){const t=k/28*Math.PI*2,rr=r*(.78+R()*.4+.12*Math.sin(t*3+R()));pts.push([x+Math.cos(t)*rr,y+Math.sin(t)*rr*.85])}
    q.save();q.beginPath();pts.forEach(([px,py],i)=>i?q.lineTo(px,py):q.moveTo(px,py));q.closePath();q.clip();const g=q.createRadialGradient(x,y,r*.1,x,y,r*1.15);g.addColorStop(0,`rgba(80,70,50,${a*.5})`);g.addColorStop(.75,`rgba(95,75,45,${a*.75})`);g.addColorStop(1,`rgba(70,50,25,${a*1.6})`);q.fillStyle=g;q.fillRect(x-r*1.3,y-r*1.3,r*2.6,r*2.6);q.restore();
    q.strokeStyle=`rgba(85,60,30,${a*1.8})`;q.lineWidth=2.2;q.filter='blur(1.2px)';q.beginPath();pts.forEach(([px,py],i)=>i?q.lineTo(px,py):q.moveTo(px,py));q.closePath();q.stroke();q.filter='none'};
  stain(w*.78,h*.2,150,.2);stain(w*.22,h*.62,120,.16);stain(w*.6,h*.88,190,.24);stain(w*.12,h*.08,80,.14);stain(w*.9,h*.55,90,.13);
  // 아래쪽은 아직 축축함 (진하게)
  {const g=q.createLinearGradient(0,h*.55,0,h);g.addColorStop(0,'rgba(60,55,40,0)');g.addColorStop(1,'rgba(55,50,35,.42)');q.fillStyle=g;q.fillRect(0,h*.55,w,h*.45)}
  // 흘러내린 물줄기
  for(let i=0;i<9;i++){const x=R()*w,y0=R()*h*.5,len=120+R()*360,g=q.createLinearGradient(0,y0,0,y0+len);g.addColorStop(0,'rgba(70,60,40,0)');g.addColorStop(.3,'rgba(70,60,40,.16)');g.addColorStop(1,'rgba(60,50,30,.3)');q.fillStyle=g;q.beginPath();q.moveTo(x-3,y0);for(let y=y0;y<y0+len;y+=20)q.lineTo(x-3-Math.sin(y*.03)*2,y);q.lineTo(x+3,y0+len);for(let y=y0+len;y>y0;y-=20)q.lineTo(x+3-Math.sin(y*.03)*2,y);q.fill();q.beginPath();q.arc(x,y0+len,5,0,7);q.fill()}
  // 접힌 자국 (가로·세로)
  [[0,h*.34,w,h*.34],[0,h*.67,w,h*.665],[w*.5,0,w*.505,h]].forEach(([a,b,c2,d])=>{q.strokeStyle='rgba(60,45,25,.28)';q.lineWidth=2;q.beginPath();q.moveTo(a,b);q.lineTo(c2,d);q.stroke();q.strokeStyle='rgba(255,250,235,.25)';q.lineWidth=1.5;q.beginPath();q.moveTo(a+1.5,b+1.5);q.lineTo(c2+1.5,d+1.5);q.stroke()});
  // 구김
  for(let i=0;i<70;i++){const x=R()*w,y=R()*h,l=10+R()*40,a=R()*Math.PI;q.strokeStyle=`rgba(60,45,25,${.06+R()*.08})`;q.lineWidth=1;q.beginPath();q.moveTo(x,y);q.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);q.stroke();q.strokeStyle=`rgba(255,250,235,${.06+R()*.06})`;q.beginPath();q.moveTo(x+1,y+1);q.lineTo(x+1+Math.cos(a)*l,y+1+Math.sin(a)*l);q.stroke()}
  // 흙 묻은 손가락 자국
  for(let i=0;i<3;i++){const x=w*(.08+R()*.85),y=h*(.75+R()*.2);q.fillStyle='rgba(60,42,22,.18)';q.beginPath();q.ellipse(x,y,14,20,R(),0,7);q.fill()}
  // 가장자리 어둡게
  const v=q.createRadialGradient(w/2,h/2,h*.3,w/2,h/2,h*.75);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(50,35,15,.4)');q.fillStyle=v;q.fillRect(0,0,w,h)});
  F3.paper=c.toDataURL('image/jpeg',.85);
  // 찢어진 가장자리 (clip-path)
  const R=mulberry(77),P=[];const N=26;for(let i=0;i<=N;i++)P.push([i/N*100,R()*1.2]);for(let i=1;i<=N;i++)P.push([100-R()*1.1,i/N*100]);for(let i=1;i<=N;i++)P.push([100-i/N*100,100-R()*1.4]);for(let i=1;i<N;i++)P.push([R()*1.1,100-i/N*100]);
  F3.paperClip='polygon('+P.map(([x,y])=>x.toFixed(2)+'% '+y.toFixed(2)+'%').join(',')+')';
  document.documentElement.style.setProperty('--wet',`url(${F3.paper})`);document.documentElement.style.setProperty('--wetclip',F3.paperClip);return F3.paper}
function openLog3(side){side=side||(S.ph==='tent'||S.ph==='dawn'||S.inTent?'tent':'walk');wetPaper3();F3.logSide=side;const box=$('logText');box.innerHTML='';const el=(c,t)=>{const d=document.createElement('div');d.className=c;d.textContent=t;box.appendChild(d);return d};
  $('log').classList.add('pool');$('log').classList.add('forest');$('logClose').textContent='접어 넣기';
  const R=mulberry(side==='tent'?31:13);
  el('pl-h','젖은 쪽지');el('pl-sd',side==='tent'?'뒷면 — 텐트 안에서':'앞면 — 걸을 때');
  if(!MOB){const d=document.createElement('div');d.className='lg-keys';d.innerHTML=(side==='tent'?[['손전등 누르기 / F','켜기·끄기'],['침낭 꾹 / E','뒤집어쓰기'],['지퍼 꾹 / Q','틈으로 보기'],['양옆 / A D','고개 돌리기 · 피하기'],['아무 데나 / Space','연타']]:[['화면 꾹 / W','걷기'],['양옆 화살표 꾹 / A D','뒤돌아보기'],['Esc','일시정지']]).map(([k,t])=>`<span><kbd>${k}</kbd>${t}</span>`).join('');box.appendChild(d)}
  RULES3[side].forEach(([d,a,b],i)=>{if(d>S.night)return;const r=document.createElement('div');r.className='pl-r'+(d===S.night&&d>1?' new':'')+(R()<.4?' run':'')+(R()<.3?' blur':'');r.style.transform=`rotate(${(R()-.5)*1.4}deg) translateX(${(R()-.5)*6}px)`;r.innerHTML='<b></b><i>→</i><span></span>';r.querySelector('b').textContent=a;r.querySelector('span').textContent=b;box.appendChild(r)});
  el('pl-f',side==='tent'?'6시까지 텐트 밖으로 나가지 말 것':'해 지기 전에 빨간 리본을 따라 야영지까지');
  const fl=document.createElement('button');fl.className='pl-flip';fl.textContent=side==='tent'?'앞면 보기':'뒷면 보기';fl.onclick=e=>{e.stopPropagation();sfx(300,.05,'triangle',.02);nburst(2400,1.5,.12,.06,0);openLog3(side==='tent'?'walk':'tent')};box.appendChild(fl);
  $('log').querySelector('.sheet').classList.toggle('back',side==='tent');
  S.log=true;S.inWalk=S.inBack=false;$('log').classList.add('show');buildUI()}

// ===================== 텐트 안 (밤) =====================
// 텐트 안쪽은 따로 만든 천(돔). 바깥 랜턴 빛이 천을 뚫고 비침 + 그 사이에 선 것의 그림자(실루엣)가 천에 맺힘
const TA=1.05,TB=1.15,TH=1.32,TCAM=[0,.8,.48];
function fabricTex(){return c3tex('fabric',512,(q,w,h)=>{const R=mulberry(33);q.fillStyle='#46553a';q.fillRect(0,0,w,h);
  for(let i=0;i<9000;i++){q.fillStyle=`rgba(${R()<.5?0:255},${R()<.5?0:255},${R()<.5?0:255},${R()*.035})`;q.fillRect(R()*w,R()*h,2,2)}
  for(let y=0;y<h;y+=3){q.fillStyle=`rgba(0,0,0,${.03+R()*.02})`;q.fillRect(0,y,w,1)}
  for(const x of [0,w]){q.fillStyle='rgba(20,26,16,.45)';q.fillRect(x-2,0,4,h);q.fillStyle='rgba(120,140,100,.1)';q.fillRect(x+2,0,1,h)} // 솔기 (판마다 하나)
  const g=q.createLinearGradient(0,h,0,h*.6);g.addColorStop(0,'rgba(40,30,18,.55)');g.addColorStop(1,'rgba(40,30,18,0)');q.fillStyle=g;q.fillRect(0,h*.6,w,h*.4); // 아래쪽 흙탕
  for(let i=0;i<14;i++){const x=R()*w,y=h*(.55+R()*.4),r=R()*30+10;const gg=q.createRadialGradient(x,y,0,x,y,r);gg.addColorStop(0,'rgba(30,24,14,.35)');gg.addColorStop(1,'rgba(30,24,14,0)');q.fillStyle=gg;q.fillRect(x-r,y-r,r*2,r*2)}})}
// 천 주름: 아래로 처진 세로 주름 + 잔주름 → 법선 지도 (손전등에 천이 울퉁불퉁하게 보이게)
function fabricNrm(){return c3keep('c3_fabN',()=>{const N=256,R=mulberry(77),Hh=new Float32Array(N*N);
  const waves=[];for(let k=0;k<14;k++)waves.push([R()*N,4+R()*16,.4+R()*.8,R()*6]);
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){let h=0;for(const [cx0,wd,a,ph] of waves){let dx=Math.abs(x-cx0);dx=Math.min(dx,N-dx);h+=a*Math.exp(-(dx*dx)/(wd*wd))*(.6+.4*Math.sin(y/N*Math.PI*2+ph))}
    h+=.12*Math.sin(x*.21+y*.05)+.08*Math.sin(x*.07-y*.13+2);Hh[y*N+x]=h}
  const c=cvs(N,N,(q)=>{const im=q.createImageData(N,N);for(let y=0;y<N;y++)for(let x=0;x<N;x++){const hx=Hh[y*N+(x+1)%N]-Hh[y*N+(x+N-1)%N],hy=Hh[((y+1)%N)*N+x]-Hh[((y+N-1)%N)*N+x],nx=-hx*1.6,ny=-hy*1.6,l=Math.hypot(nx,ny,1),i=(y*N+x)*4;im.data[i]=(nx/l*.5+.5)*255;im.data[i+1]=(ny/l*.5+.5)*255;im.data[i+2]=(1/l*.5+.5)*255;im.data[i+3]=255}q.putImageData(im,0,0)});
  const t=new R3.T.CanvasTexture(c);t.wrapS=t.wrapT=R3.T.RepeatWrapping;t.colorSpace=R3.T.NoColorSpace;return t})}
const GAPV=`varying vec3 vLP;
`,GAPF=`uniform vec3 uGap;uniform vec4 uCA[4],uCB[4];varying vec3 vLP;
float gapHW(float y){return y<uGap.x?uGap.y*pow(max(0.,1.-y/uGap.x),.85):0.;}
float hsh(float x){return fract(sin(x*127.1)*43758.5453);}
`,
  GAPD=`if(vLP.z<0.&&vLP.y<uGap.x&&abs(vLP.x)<gapHW(vLP.y))discard;
  float eg=vLP.z<0.&&vLP.y<uGap.x+.02?smoothstep(.022,0.,abs(abs(vLP.x)-gapHW(vLP.y))):0.;
  float zp=vLP.z<0.&&vLP.y>=uGap.x&&vLP.y<1.14&&abs(vLP.x)<.009?1.:0.;
  float dr=vLP.z<0.?length(vec2(vLP.x/.52,max(0.,vLP.y-.55)/.62)):9.;float door=smoothstep(1.02,.98,dr)*step(.02,vLP.y);float seam=vLP.z<0.?smoothstep(.035,0.,abs(dr-1.)):0.;
  zp=max(zp,seam*.7);
  float cutE=0.;for(int i=0;i<4;i++){vec4 ca=uCA[i];if(ca.w<=0.||vLP.x*ca.x<.2)continue;vec4 cb=uCB[i];vec2 q=vec2(vLP.y-ca.y,vLP.z-ca.z);float tt=clamp(dot(q,cb.xy),-cb.z,cb.z);float dd=length(q-cb.xy*tt);
    float jag=.7+.6*hsh(floor(tt*160.)+float(i)*13.);float wt=ca.w*(1.-pow(tt/cb.z,2.))*jag+.0015;if(dd<wt)discard;cutE=max(cutE,smoothstep(wt+.018,wt,dd)*step(-cb.z-.01,dot(q,cb.xy))*step(dot(q,cb.xy),cb.z+.01));}`;
function tentShellGeo(){const T=R3.T,NU=150,NV=38,n=3.2,P=[],U=[],I=[];
  for(let j=0;j<=NV;j++){const e=j/NV,k=Math.cos(e*PI2),y=TH*Math.pow(Math.sin(e*PI2),.9);for(let i=0;i<=NU;i++){const ph=i/NU*Math.PI*2-PI2,cs=Math.cos(ph),sn=Math.sin(ph);
    const bx=TA*Math.sign(cs)*Math.pow(Math.abs(cs),2/n),bz=TB*Math.sign(sn)*Math.pow(Math.abs(sn),2/n);P.push(bx*k,y,bz*k);U.push(i/NU*6,e*2.2)}}
  for(let j=0;j<NV;j++)for(let i=0;i<NU;i++){const a=j*(NU+1)+i,b=a+NU+1;I.push(a,b,a+1,a+1,b,b+1)}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(P,3));g.setAttribute('uv',new T.Float32BufferAttribute(U,2));g.setIndex(I);g.computeVertexNormals();
  // 바깥을 보게 감았는지 확인 (문 쪽 정점의 법선이 -z여야 함)
  const nz=g.attributes.normal.getZ(NV*0+0);if(nz>0){const ix=g.index.array;for(let t=0;t<ix.length;t+=3){const x=ix[t+1];ix[t+1]=ix[t+2];ix[t+2]=x}g.computeVertexNormals()}
  g.userData.base=Float32Array.from(g.attributes.position.array);g.userData.nrm=Float32Array.from(g.attributes.normal.array);return g}
function tentFrontZ(y){const e=Math.asin(Math.min(1,Math.pow(Math.max(0,y)/TH,1/.9)))/PI2;return -TB*Math.cos(e*PI2)}
// ---------- 손 (파수꾼이 천을 짚은 손): 그림자·눌림 둘 다 같은 모양에서 ----------
// u = 가로(m), v = 세로(m), 손 가운데 기준. 손가락은 끝으로 갈수록 가늘고, 엄지는 손바닥 아래에서 갈라져 나옴
// [시작 x,y, 끝 x,y, 시작 굵기, 끝 굵기]
const HAND3={fing:[[-.029,.03,-.049,.122,.0108,.0084],[-.009,.036,-.012,.142,.0112,.0088],[.012,.033,.025,.133,.0108,.0085],[.031,.022,.054,.1,.0094,.0074],
  [-.036,-.036,-.07,-.006,.0175,.0128],[-.07,-.006,-.09,.03,.0128,.0095]],arm:[.004,-.075,.016,-.36,.032]};
function capSDF(u,v,ax,ay,bx,by,r,r2){const px=u-ax,py=v-ay,dx=bx-ax,dy=by-ay,h=Math.max(0,Math.min(1,(px*dx+py*dy)/(dx*dx+dy*dy)));return Math.hypot(px-dx*h,py-dy*h)-(r2==null?r:lerp(r,r2,h))}
const smin=(a,b,k)=>{const h=Math.max(0,Math.min(1,.5+.5*(b-a)/k));return lerp(b,a,h)-k*h*(1-h)};
function handSDF(u,v){let d=(Math.hypot(u/.045,(v+.012)/.05)-1)*.045;d=smin(d,capSDF(u,v,-.03,.022,.032,.016,.02),.012);d=smin(d,capSDF(u,v,-.004,-.05,.012,-.07,.026),.01); // 손바닥 + 손가락 뿌리 + 손목
  for(const f of HAND3.fing)d=smin(d,capSDF(u,v,...f),.006);return d}
function blur3(a,N,r){const t=new Float32Array(a.length),c=new Float32Array(N+1);for(let pass=0;pass<2;pass++){ // 상자 흐림 두 번 ≈ 가우스
  for(let y=0;y<N;y++){for(let x=0;x<N;x++)c[x+1]=c[x]+a[y*N+x];for(let x=0;x<N;x++){const l=Math.max(0,x-r),h=Math.min(N,x+r+1);t[y*N+x]=(c[h]-c[l])/(h-l)}}
  for(let x=0;x<N;x++){for(let y=0;y<N;y++)c[y+1]=c[y]+t[y*N+x];for(let y=0;y<N;y++){const l=Math.max(0,y-r),h=Math.min(N,y+r+1);a[y*N+x]=(c[h]-c[l])/(h-l)}}}return a}
function handTex3(){if(F3.hand)return F3.hand;const N=256,S2=.3,sh=document.createElement('canvas'),hh=document.createElement('canvas');sh.width=sh.height=hh.width=hh.height=N;
  const a=sh.getContext('2d'),b=hh.getContext('2d'),ia=a.createImageData(N,N),ib=b.createImageData(N,N),D=new Float32Array(N*N),A=new Float32Array(N*N),Hm=new Float32Array(N*N);
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const u=(x/N-.5)*S2,v=(.5-y/N)*S2,i=y*N+x;D[i]=handSDF(u,v);const [ax,ay,bx,by,ar]=HAND3.arm;A[i]=capSDF(u,v,ax,ay,bx,by,ar,ar*1.25);Hm[i]=D[i]<0?1:0}
  // 높이: 손 모양을 흐리게 → 천이 손가락 위로 덮여 팽팽해진 모양. 손바닥 쪽이 더 깊음 + 넓게 부푼 자리
  const H1=blur3(Float32Array.from(Hm),N,3),H2=blur3(Float32Array.from(Hm),N,14);
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=y*N+x,u=(x/N-.5)*S2,v=(.5-y/N)*S2,d=D[i],da=A[i],o=i*4;
    // 그림자: 닿은 곳은 진하고 또렷, 둘레는 천에 번져 흐릿 / 팔은 천에서 떨어져 있어 크게 번짐
    const contact=Math.min(1,Math.max(0,(.0015-d)/.003)),pen=.5*Math.exp(-Math.max(0,d)/.008),arm=.45*Math.exp(-Math.max(0,da)/.028)*Math.min(1,Math.max(0,(-.05-v)/.07));
    ia.data[o]=ia.data[o+1]=ia.data[o+2]=0;ia.data[o+3]=Math.round(255*Math.min(1,Math.max(contact*.96,pen,arm)));
    const hgt=Math.min(1,H1[i]*.7+H2[i]*.55);ib.data[o]=ib.data[o+1]=ib.data[o+2]=Math.round(255*hgt);ib.data[o+3]=255}
  a.putImageData(ia,0,0);b.putImageData(ib,0,0);const t1=ctx3(sh),t2=new R3.T.CanvasTexture(hh);t2.colorSpace=R3.T.NoColorSpace;F3.hand={sh:t1,hh:t2};return F3.hand}
// ---------- 텐트 안 소품용 ----------
function rbox(w,h,d,r,seg=4){const T=R3.T,g=new T.BoxGeometry(w,h,d,seg*2,seg*2,seg*2),p=g.attributes.position,hw=w/2-r,hh=h/2-r,hd=d/2-r,v=new T.Vector3(),c=new T.Vector3();
  for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);c.set(Math.max(-hw,Math.min(hw,v.x)),Math.max(-hh,Math.min(hh,v.y)),Math.max(-hd,Math.min(hd,v.z)));const o=v.clone().sub(c);if(o.lengthSq()>1e-9)o.normalize().multiplyScalar(r);p.setXYZ(i,c.x+o.x,c.y+o.y,c.z+o.z)}g.computeVertexNormals();return g}
function nylonTex(key,col,grid,dirt){return c3tex(key,256,(q,w,h)=>{const R=mulberry(key.length*31);q.fillStyle=col;q.fillRect(0,0,w,h);
  for(let i=0;i<5000;i++){q.fillStyle=`rgba(${R()<.5?0:255},${R()<.5?0:255},${R()<.5?0:255},${R()*.04})`;q.fillRect(R()*w,R()*h,1,1)}
  if(grid){q.strokeStyle='rgba(0,0,0,.18)';q.lineWidth=1;for(let x=0;x<w;x+=grid){q.beginPath();q.moveTo(x+.5,0);q.lineTo(x+.5,h);q.stroke()}for(let y=0;y<h;y+=grid){q.beginPath();q.moveTo(0,y+.5);q.lineTo(w,y+.5);q.stroke()}}
  for(let i=0;i<(dirt||0);i++){const x=R()*w,y=R()*h,r=4+R()*22,g=q.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(40,30,15,${.15+R()*.2})`);g.addColorStop(1,'rgba(40,30,15,0)');q.fillStyle=g;q.fillRect(x-r,y-r,r*2,r*2)}})}
function quiltTex(){return c3tex('quilt',256,(q,w,h)=>{const R=mulberry(5);q.fillStyle='#a3361e';q.fillRect(0,0,w,h);
  for(let i=0;i<4000;i++){q.fillStyle=`rgba(${R()<.5?0:255},0,0,${R()*.05})`;q.fillRect(R()*w,R()*h,1,1)}
  const nb=5;for(let k=0;k<nb;k++){const y=k*h/nb,g=q.createLinearGradient(0,y,0,y+h/nb);g.addColorStop(0,'rgba(0,0,0,.3)');g.addColorStop(.2,'rgba(0,0,0,0)');g.addColorStop(.5,'rgba(255,200,180,.1)');g.addColorStop(.8,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.3)');q.fillStyle=g;q.fillRect(0,y,w,h/nb);q.fillStyle='rgba(20,5,3,.45)';q.fillRect(0,y,w,1)}
  q.fillStyle='#1a1614';q.fillRect(w*.86,0,6,h);q.fillStyle='rgba(200,200,190,.35)';for(let y=0;y<h;y+=3)q.fillRect(w*.86+1,y,4,1); // 지퍼
  for(let i=0;i<10;i++){const x=R()*w,y=R()*h,r=8+R()*20,g=q.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(30,20,10,.25)');g.addColorStop(1,'rgba(30,20,10,0)');q.fillStyle=g;q.fillRect(x-r,y-r,r*2,r*2)}})}
// 침낭: 무릎이 살짝 솟은 통 + 칸마다 부푼 솜
function bagGeo(){const T=R3.T,NS=56,NA=26,P=[],U=[],I=[],z0=.42,z1=-.78;
  for(let i=0;i<=NS;i++){const s=i/NS,z=lerp(z0,z1,s),w=.36*(1-.32*s*s)*(s>.9?Math.sqrt(Math.max(0,1-(s-.9)/.1*.9)):1),puff=1+.07*Math.pow(Math.abs(Math.sin(s*Math.PI*9)),.6),hgt=(.12+.11*Math.exp(-Math.pow((s-.4)/.12,2))-.03*s+.06*Math.exp(-Math.pow((s-.93)/.05,2)))*puff*(s>.9?Math.sqrt(Math.max(0,1-(s-.9)/.1*.9)):1);
    for(let j=0;j<=NA;j++){const a=j/NA*Math.PI,x=Math.cos(a)*w*puff*(1+.03*Math.sin(a*5+s*20)),y=Math.pow(Math.sin(a),.75)*hgt+.012;P.push(x,y,z);U.push(j/NA*1.4,s*1.7)}}
  for(let i=0;i<NS;i++)for(let j=0;j<NA;j++){const a=i*(NA+1)+j,b=a+NA+1;I.push(a,b,a+1,a+1,b,b+1)}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(P,3));g.setAttribute('uv',new T.Float32BufferAttribute(U,2));g.setIndex(I);g.computeVertexNormals();return g}
// 침낭을 머리끝까지 뒤집어쓴 모양 (카메라에 붙음). 0 = 무릎께에 뭉쳐 있음(안 보임) → 1 = 머리 위로 덮고 앞에 손가락만 한 틈
function hoodGeo(){const T=R3.T,NR=26,NA=40,P0=[],P1=[],P2=[],U=[],I=[],R=mulberry(21);
  for(let i=0;i<=NR;i++){const t=i/NR;for(let j=0;j<=NA;j++){const a=j/NA*Math.PI*2,ca=Math.cos(a),sa=Math.sin(a),fold=1+.07*Math.sin(a*5+t*4)+.05*Math.sin(a*9-t*7),puff=1+.05*Math.abs(Math.sin(t*Math.PI*5)),lip=t>.9?(t-.9)/.1:0;
    const rx=lerp(.46,.05,Math.pow(t,1.05))*fold*puff,ry=lerp(.36,.019,Math.pow(t,1.2))*fold*puff,z=lerp(.14,-.3,t)+lip*.025,yo=lerp(0,-.02,t);
    P1.push(ca*rx*(1+lip*.12),sa*ry*(1+lip*.5)+yo,z);
    // 숨이 차서 틈이 조금 벌어진 모양
    P2.push(ca*rx*(1+.3*t*t)*(1+lip*.12),sa*ry*(1+1.4*t*t)*(1+lip*.5)+yo,z);
    // 내린 상태: 아래로 처져 화면 밖 (무릎께)
    P0.push(ca*(rx*2.4+.25),sa*ry*.6-1.05-.3*t,z*.6+.25);U.push(j/NA*3,t*1.6)}}
  for(let i=0;i<NR;i++)for(let j=0;j<NA;j++){const a=i*(NA+1)+j,b=a+NA+1;I.push(a,b,a+1,a+1,b,b+1)}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(P0,3));g.setAttribute('uv',new T.Float32BufferAttribute(U,2));g.setIndex(I);
  const d1=P1.map((v,i)=>v-P0[i]),d2=P2.map((v,i)=>v-P1[i]);g.morphAttributes.position=[new T.Float32BufferAttribute(d1,3),new T.Float32BufferAttribute(d2,3)];g.morphTargetsRelative=true;g.computeVertexNormals();return g}
function bootGeo(par,x,z,ry,tilt,mat,sole){const g=grp(x,0,z,ry,par);g.rotation.z=tilt||0;
  mesh(rbox(.105,.035,.29,.014,3),sole,0,.0175,0,g);mesh(rbox(.098,.085,.15,.04,3),mat,0,.07,-.06,g);mesh(rbox(.092,.17,.13,.035,3),mat,0,.12,.07,g);
  const col=mesh(new R3.T.TorusGeometry(.045,.016,8,16),MS({color:0x2a1c12,roughness:.9}),0,.205,.07,g);col.rotation.x=PI2;col.scale.set(1,1.3,1);
  for(let k=0;k<4;k++)BOX(.06,.004,.008,MS({color:0x8a7a5a,roughness:.9}),0,.075+k*.03,-.005-k*.004,g).rotation.x=-.5;return g}
function buildTent3(){const W3=F3.w,T=R3.T;if(W3.tn)return W3.tn;const g=grp(W3.tentP.x,W3.tentP.y,W3.tentP.z,W3.tentRy,W3.sc),tn={g};W3.tn=tn;g.visible=false;
  const geo=tentShellGeo();tn.geo=geo;tn.uGap={value:new T.Vector3(.05,0,0)};tn.uCA={value:[0,1,2,3].map(()=>new T.Vector4(0,0,0,0))};tn.uCB={value:[0,1,2,3].map(()=>new T.Vector4(1,0,.1,0))};
  const HT=handTex3();tn.uHand={value:new T.Vector4(0,0,0,0)};
  // 1) 안쪽 천: 손전등·달빛 (+ 손에 눌린 자국을 빛으로 도드라지게)
  const m1=MS({map:fabricTex(),normalMap:fabricNrm(),normalScale:new T.Vector2(.9,.9),roughness:.92,side:T.BackSide,color:0xc8d0b8});
  m1.onBeforeCompile=sh=>{sh.uniforms.uGap=tn.uGap;sh.uniforms.uCA=tn.uCA;sh.uniforms.uCB=tn.uCB;sh.uniforms.uHand=tn.uHand;sh.uniforms.uHH={value:HT.hh};sh.uniforms.uHS={value:HT.sh};sh.vertexShader=GAPV+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvLP=position;');
    sh.fragmentShader=GAPF+'uniform vec4 uHand;uniform sampler2D uHH,uHS;\n'+sh.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\n'+GAPD+`diffuseColor.rgb*=(1.-.7*eg)*(1.-.18*door)*(1.-.75*cutE);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.03,.03,.025),zp);
      if(uHand.w>0.&&vLP.x*uHand.x>.3){vec2 hu=vec2((vLP.z-uHand.z)*-uHand.x,vLP.y-uHand.y)/.3+.5;if(hu.x>.01&&hu.x<.99&&hu.y>.01&&hu.y<.99){float e=1.5/256.,h0=texture2D(uHH,hu).r,hx=texture2D(uHH,hu+vec2(e,0.)).r-texture2D(uHH,hu-vec2(e,0.)).r,hy=texture2D(uHH,hu+vec2(0.,e)).r-texture2D(uHH,hu-vec2(0.,e)).r;
        float sa=texture2D(uHS,hu).a;diffuseColor.rgb*=clamp(1.+(-hy*1.2+hx*.5)*2.6*uHand.w,.45,1.6)*(1.-.62*sa*uHand.w)*(1.-.12*h0*uHand.w);}}`)};m1.customProgramCacheKey=()=>'tent1b';
  tn.inner=mesh(geo,m1,0,0,0,g,false);tn.inner.receiveShadow=false;tn.inner.frustumCulled=false;
  // 2) 바깥 빛이 천을 뚫고 들어옴 (덧칠). 랜턴 위치·세기, 실루엣 그림, 새벽빛
  const sil=new T.WebGLRenderTarget(256,256,{minFilter:T.LinearFilter,magFilter:T.LinearFilter});tn.sil=sil;tn.silCam=new T.PerspectiveCamera(110,1,.05,8);tn.silCam.layers.set(3);
  tn.m2=new T.ShaderMaterial({side:T.BackSide,transparent:true,depthWrite:false,blending:T.AdditiveBlending,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1,
    uniforms:{uGap:tn.uGap,uCA:tn.uCA,uCB:tn.uCB,map:{value:fabricTex()},uHT:{value:HT.sh},uHand:tn.uHand,uLP:{value:new T.Vector3(0,-50,0)},uLI:{value:0},uLC:{value:new T.Vector3(1,.62,.28)},uSil:{value:sil.texture},uSilM:{value:new T.Matrix4()},uSilOn:{value:1},uAmb:{value:new T.Vector3(.13,.15,.19)},uM:{value:new T.Matrix4()}},
    vertexShader:GAPV+`varying vec2 vUv;varying vec3 vWP,vWN;uniform mat4 uM;void main(){vUv=uv;vLP=position;vec4 wp=modelMatrix*vec4(position,1.);vWP=wp.xyz;vWN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*wp;}`,
    fragmentShader:GAPF+`uniform sampler2D map,uSil,uHT;uniform vec4 uHand;uniform vec3 uLP,uAmb;uniform float uLI,uSilOn;uniform vec3 uLC;uniform mat4 uSilM;varying vec2 vUv;varying vec3 vWP,vWN;
void main(){`+GAPD+`vec3 tex=texture2D(map,vUv).rgb;vec3 L=uLP-vWP;float d=length(L);float ndl=max(dot(vWN,L/d),0.);
  float sh=1.;vec4 pc=uSilM*vec4(vWP,1.);if(uSilOn>.5&&pc.w>0.){vec2 su=pc.xy/pc.w*.5+.5;if(su.x>0.&&su.x<1.&&su.y>0.&&su.y<1.)sh=texture2D(uSil,su).r;}
  if(uHand.w>0.&&vLP.x*uHand.x>.3){vec2 hu=vec2((vLP.z-uHand.z)*-uHand.x,vLP.y-uHand.y)/.3+.5;if(hu.x>0.&&hu.x<1.&&hu.y>0.&&hu.y<1.)sh*=1.-texture2D(uHT,hu).a*uHand.w;}
  float lan=uLI*ndl/(1.+d*d*.9)*sh;vec3 c=tex*(uLC*lan*2.6+uAmb*(1.+.5*vWN.y))*(1.-.6*eg)*(1.-zp)*(1.-.85*cutE);gl_FragColor=vec4(c,1.);}`});
  tn.trans=mesh(geo,tn.m2,0,0,0,g,false);tn.trans.renderOrder=2;tn.trans.frustumCulled=false;
  // ---- 바닥 깔개 (텐트 바닥 모양 그대로) ----
  {const sh=new T.Shape(),n=3.2;for(let i=0;i<=64;i++){const ph=i/64*Math.PI*2,cs=Math.cos(ph),sn=Math.sin(ph),x=(TA-.02)*Math.sign(cs)*Math.pow(Math.abs(cs),2/n),z=(TB-.02)*Math.sign(sn)*Math.pow(Math.abs(sn),2/n);i?sh.lineTo(x,z):sh.moveTo(x,z)}
   const fg=new T.ShapeGeometry(sh,8);const uv=fg.attributes.uv,pp=fg.attributes.position;for(let i=0;i<uv.count;i++)uv.setXY(i,pp.getX(i)*1.2,pp.getY(i)*1.2);
   const ft=nylonTex('floor','#262b2c',8,26);ft.wrapS=ft.wrapT=T.RepeatWrapping;const fl=mesh(fg,MS({map:ft,roughness:.8,color:0xb8c0c0}),0,.008,0,g,false);fl.rotation.x=PI2;fl.scale.z=-1;fl.receiveShadow=true;
   // 흙 묻은 자국·낙엽
   const lm=MS({color:0x4a3418,roughness:1,side:T.DoubleSide});const R=mulberry(12);for(let k=0;k<9;k++){const l=mesh(new T.CircleGeometry(.03+R()*.025,5),lm,(R()-.5)*1.5,.011+k*.0004,-.3-R()*.75,g,false);l.rotation.set(-PI2,0,R()*6);l.scale.set(1,.55,1)}}
  // ---- 침낭 (다리 위) ----
  {tn.bagG=grp(0,0,0,0,g);const qt=quiltTex();qt.wrapS=qt.wrapT=T.RepeatWrapping;tn.bagM=null;const bm=MS({map:qt,roughness:.55,metalness:.05,emissive:0x120403});
   const sb=mesh(bagGeo(),bm,0,0,0,tn.bagG);sb.castShadow=false;
   const col=mesh(new T.TorusGeometry(.26,.06,10,26,Math.PI),bm,0,.03,.42,tn.bagG);col.scale.set(1.12,1,1);col.castShadow=false; // 허리께 말린 입구
   const hood=mesh(new T.SphereGeometry(.24,18,10,0,Math.PI*2,0,PI2),bm,0,.0,.66,tn.bagG);hood.scale.set(1.15,.45,.7);
   tn.bag=[sb,col];tn.bagM=bm}
  // ---- 배낭 (왼쪽 뒤 구석, 벽에 기대 있음) + 위에 묶은 매트 ----
  {const bp=grp(-.64,0,.3,.7,g);bp.rotation.z=.1;bp.rotation.x=-.08;const nt=nylonTex('pack2','#3a4a1e',0,8),nm=MS({map:nt,roughness:.95,color:0x5c5c5c}),dm=MS({map:nylonTex('pack3','#1c2218',0,4),roughness:.85}),dk=MS({color:0x141812,roughness:.9}),bk=MS({color:0x0c0c0c,roughness:.45,metalness:.3}),zp=MS({color:0x0a0a0a,roughness:.6});
   const body=rbox(.34,.5,.22,.085,4),bpp=body.attributes.position;for(let i=0;i<bpp.count;i++){const y=bpp.getY(i),k=1+(.25-y)*.18;bpp.setX(i,bpp.getX(i)*k);if(bpp.getZ(i)>0)bpp.setZ(i,bpp.getZ(i)*(1+.15*Math.cos(bpp.getX(i)*6)))}body.computeVertexNormals();mesh(body,nm,0,.26,0,bp);
   mesh(rbox(.33,.1,.25,.045,3),dm,0,.53,-.005,bp);mesh(rbox(.24,.24,.07,.035,3),dm,0,.2,.125,bp);mesh(rbox(.2,.012,.01,.004,1),zp,0,.32,.16,bp); // 뚜껑·앞주머니·지퍼
   [-.17,.17].forEach(x=>mesh(rbox(.06,.18,.12,.025,2),dm,x*1.05,.16,0,bp)); // 옆주머니
   [-.09,.09].forEach(x=>{const c=new T.CatmullRomCurve3([new T.Vector3(x,.48,-.11),new T.Vector3(x*1.25,.4,-.165),new T.Vector3(x*1.35,.2,-.155),new T.Vector3(x,.05,-.115)]);mesh(new T.TubeGeometry(c,14,.02,6),dk,0,0,0,bp)});
   [-.075,.075].forEach(x=>{BOX(.026,.2,.01,dk,x,.42,.135,bp);BOX(.034,.024,.016,bk,x,.36,.142,bp)});
   const hl=mesh(new T.TorusGeometry(.035,.007,6,12,Math.PI),dk,0,.585,-.02,bp);
   const pad=mesh(new T.CylinderGeometry(.055,.055,.4,16,1),MS({map:nylonTex('pad2','#2a3846',4,2),roughness:.95,color:0x808080}),0,.635,-.01,bp);pad.rotation.z=PI2;
   [-.12,.12].forEach(x=>{const st=mesh(new T.TorusGeometry(.058,.006,6,16),dk,x,.635,-.01,bp);st.rotation.y=PI2})}
  // ---- 신발 한 켤레 (문 앞 왼쪽), 하나는 쓰러짐 ----
  {const lm=MS({map:nylonTex('boot','#4a3524',0,14),roughness:.72}),so=MS({color:0x121010,roughness:.9});bootGeo(g,-.52,-.62,.25,0,lm,so);const b2=bootGeo(g,-.33,-.74,-.5,1.35,lm,so);b2.position.y=.05}
  // ---- 물병·컵 (오른쪽) ----
  {const pr=[[0,0],[.038,0],[.041,.01],[.041,.15],[.036,.175],[.022,.19],[.022,.2],[0,.2]].map(([x,y])=>new T.Vector2(x,y));const bt=mesh(new T.LatheGeometry(pr,20),MS({color:0x3d5a63,roughness:.35,metalness:.6}),.56,0,.12,g);
   CYL(.025,.025,.03,MS({color:0x111111,roughness:.6}),.56,.21,.12,g,14);const lp=mesh(new T.TorusGeometry(.015,.004,6,12),MS({color:0x111111}),.56,.235,.12,g);
   const mug=grp(.42,0,-.16,.6,g),em=MS({color:0xd8d4c8,roughness:.4});mesh(new T.CylinderGeometry(.042,.038,.085,18,1,true),MS({color:0xd8d4c8,roughness:.4,side:T.DoubleSide}),0,.0425,0,mug);CYL(.038,.038,.004,em,0,.003,0,mug,18);
   const rim=mesh(new T.TorusGeometry(.042,.003,6,20),MS({color:0x1a2a4a,roughness:.4}),0,.085,0,mug);rim.rotation.x=PI2;const hd=mesh(new T.TorusGeometry(.024,.005,6,12,Math.PI),em,.045,.045,0,mug);hd.rotation.z=-PI2}
  // ---- 젖은 쪽지 (바닥, 오른쪽 앞). 누르면 펼쳐 봄 ----
  {const pg=new T.PlaneGeometry(.15,.2,8,10),pp=pg.attributes.position,R=mulberry(3);for(let i=0;i<pp.count;i++)pp.setZ(i,(R()-.5)*.008+Math.abs(pp.getX(i))*.04*(pp.getY(i)>0?1:.3));pg.computeVertexNormals();
   const tx=c3tex('notep',128,(q,w,h)=>{q.fillStyle='#bcb08c';q.fillRect(0,0,w,h);const R2=mulberry(8);for(let i=0;i<11;i++){q.strokeStyle=`rgba(30,34,70,${.4+R2()*.3})`;q.lineWidth=1.3;q.beginPath();let x=10;q.moveTo(x,14+i*10);while(x<w-12-R2()*30){x+=4+R2()*5;q.lineTo(x,14+i*10+(R2()-.5)*3)}q.stroke()}
     const g2=q.createRadialGradient(w*.6,h*.7,4,w*.6,h*.7,60);g2.addColorStop(0,'rgba(60,50,30,.4)');g2.addColorStop(1,'rgba(60,50,30,0)');q.fillStyle=g2;q.fillRect(0,0,w,h)});
   const nt=mesh(pg,MS({map:tx,roughness:.7,side:T.DoubleSide}),.3,.014,-.36,g,false);nt.rotation.set(-PI2,0,.5);tn.note=nt}
  // ---- 천장 고리에 묶은 빨간 리본, 오른쪽 벽 그물 주머니 ----
  {const rb=MS({map:ribbonTex(),roughness:.9,side:T.DoubleSide});const lp=mesh(new T.TorusGeometry(.03,.005,6,14),MS({color:0x202020}),0,TH-.06,0,g,false);
   tn.rib=[0,1].map(k=>{const t=mesh(new T.PlaneGeometry(.016,.2,1,8),rb,(k-.5)*.012,TH-.08,0,g,false);t.geometry.translate(0,-.1,0);const pp=t.geometry.attributes.position;for(let i=0;i<pp.count;i++){const y=-pp.getY(i);pp.setZ(i,Math.sin(y*14+k)*.012);pp.setX(i,pp.getX(i)*Math.cos(y*9+k*2)+(k-.5)*y*.08)}t.geometry.computeVertexNormals();return t});
   const pk=c3tex('mesh2',256,(q,w,h)=>{q.clearRect(0,0,w,h);q.fillStyle='rgba(10,12,10,.12)';q.fillRect(0,0,w,h);q.strokeStyle='rgba(18,20,18,.75)';q.lineWidth=1;for(let k=-h;k<w;k+=10){q.beginPath();q.moveTo(k,0);q.lineTo(k+h,h);q.stroke();q.beginPath();q.moveTo(k+h,0);q.lineTo(k,h);q.stroke()}
     q.fillStyle='rgba(60,40,22,.85)';q.fillRect(w*.18,h*.5,w*.3,h*.3);q.fillStyle='rgba(120,40,25,.8)';q.fillRect(w*.18,h*.5,w*.3,h*.07);q.fillStyle='rgba(25,25,25,.85)';q.fillRect(w*.58,h*.38,w*.12,h*.48); // 비치는 성냥갑·라이터
     const bd=(x,y,ww,hh)=>{q.fillStyle='#202619';q.fillRect(x,y,ww,hh);q.fillStyle='rgba(120,130,100,.25)';q.fillRect(x,y,ww,2)};bd(0,0,w,18);bd(0,h-10,w,10);bd(0,0,9,h);bd(w-9,0,9,h);q.fillStyle='rgba(200,200,190,.35)';for(let x=12;x<w-12;x+=9)q.fillRect(x,7,4,2)}); // 테두리 천·위 박음질
   const pm=MS({map:pk,transparent:true,alphaTest:.2,side:T.DoubleSide,roughness:.9});const y0=.6,x0=tentSideX(y0)-.035;const pgg=new T.PlaneGeometry(.3,.17,8,4),ppp=pgg.attributes.position;for(let i=0;i<ppp.count;i++){const u=ppp.getX(i)/.15,v=(ppp.getY(i)+.085)/.17;ppp.setZ(i,.022*(1-u*u)*(1-v*.6))}pgg.computeVertexNormals(); // 아래가 불룩한 그물 주머니
   const pq=mesh(pgg,pm,x0,y0,.25,g,false);pq.visible=false;pq.rotation.y=-PI2+.12;pq.rotation.x=-.22} // 성냥갑
  // ---- 지퍼 고리 (밖에서 열 때 위로 올라감 = 열린 만큼) ----
  {const pt=grp(0,.06,0,0,g);tn.pull=pt;BOX(.028,.018,.012,MS({color:0x202020,metalness:.6,roughness:.4}),0,0,0,pt);const r=mesh(new T.TorusGeometry(.016,.0035,6,14),MS({color:0x909088,metalness:.8,roughness:.3}),0,-.03,.006,pt,false);tn.pullHit=mesh(new T.SphereGeometry(.13,8,6),new T.MeshBasicMaterial({visible:false}),0,0,0,pt,false)}
  // ---- 나무꾼의 도끼날 (천을 뚫고 들어옴) ----
  {const ax=grp(0,0,0,0,g);ax.visible=false;tn.axe=ax; // 도끼머리: x = 날을 따라(세로), y = 안쪽으로(날 끝이 +y), 자루는 밖에 남음
   const s2=new T.Shape();s2.moveTo(-.028,-.05);s2.lineTo(-.03,.03);s2.bezierCurveTo(-.04,.08,-.07,.11,-.11,.13);s2.quadraticCurveTo(-.118,.16,-.104,.178);s2.quadraticCurveTo(0,.21,.104,.178);s2.quadraticCurveTo(.118,.16,.11,.13);s2.bezierCurveTo(.07,.11,.04,.08,.03,.03);s2.lineTo(.028,-.05);s2.lineTo(-.028,-.05);
   const eye=new T.Path();eye.absellipse(0,-.015,.014,.02,0,Math.PI*2,true);s2.holes.push(eye);
   const hg2=new T.ExtrudeGeometry(s2,{depth:.016,bevelEnabled:true,bevelThickness:.007,bevelSize:.004,bevelSegments:2,curveSegments:14});hg2.translate(0,0,-.008);
   const rust=c3tex('rust2',128,(q,w,h)=>{q.fillStyle='#4a4a48';q.fillRect(0,0,w,h);const R=mulberry(9);for(let i=0;i<500;i++){q.fillStyle=`rgba(${100+R()*50},${45+R()*20},18,${R()*.4})`;q.beginPath();q.arc(R()*w,R()*h*.75,R()*5,0,7);q.fill()}
     const g2=q.createLinearGradient(0,h*.72,0,h);g2.addColorStop(0,'rgba(220,222,225,0)');g2.addColorStop(.35,'rgba(220,222,225,.85)');g2.addColorStop(1,'rgba(245,245,248,1)');q.fillStyle=g2;q.fillRect(0,h*.72,w,h*.28); // 갈아 놓은 날
     q.fillStyle='rgba(70,8,4,.6)';for(let i=0;i<10;i++)q.fillRect(R()*w,h*.55+R()*h*.3,2+R()*3,6+R()*16)});
   const head=mesh(hg2,MS({map:rust,roughness:.38,metalness:.35,emissive:0x262628,emissiveIntensity:1}),0,0,0,ax,false);ax.scale.setScalar(1.35);const uvs=hg2.attributes.uv,ps=hg2.attributes.position;for(let i=0;i<uvs.count;i++)uvs.setXY(i,ps.getX(i)/.24+.5,(ps.getY(i)+.05)/.26);
   const hd=mesh(new T.CylinderGeometry(.017,.02,.5,10),MS({color:0x3a2616,roughness:.85}),0,-.27,0,ax,false);tn.axeHead=head} // 자루 (뒤로 빠져 밖에 있음)
  // 그림자(텐트 안 발치)·지퍼 여는 것의 손가락
  tn.fingers=[];const fm=MS({color:0x0a0a0a,roughness:.6});for(let k=0;k<8;k++){const f=new T.Group();const c1=mesh(new T.CapsuleGeometry(.011,.06,4,8),fm,0,0,.03,f,false);c1.rotation.x=PI2;const c2=mesh(new T.CapsuleGeometry(.009,.045,4,8),fm,0,-.015,.075,f,false);c2.rotation.x=PI2+.6;g.add(f);f.visible=false;tn.fingers.push(f)}
  {const qt=quiltTex();qt.wrapS=qt.wrapT=T.RepeatWrapping;const hm=MS({map:qt,roughness:.8,side:T.DoubleSide,color:0x9a7068,emissive:0x1c0705});const h=new T.Mesh(hoodGeo(),hm);h.frustumCulled=false;h.visible=false;h.renderOrder=3;W3.sc.add(h);tn.hood=h;
   tn.hoodL=new T.PointLight(0xff5a2a,0,1.2,2);W3.sc.add(tn.hoodL)} // 침낭 속: 안에 든 손전등 빛이 천에 막혀 붉게 번짐
  {const ax=new T.Group(),m=new T.MeshBasicMaterial({color:0});const hd=new T.Mesh(new T.CylinderGeometry(.022,.026,.85,6),m);hd.position.y=.42;ax.add(hd);
   const bs=new T.Shape();bs.moveTo(0,0);bs.lineTo(.2,-.06);bs.quadraticCurveTo(.26,.08,.2,.22);bs.lineTo(0,.14);bs.lineTo(0,0);const bl=new T.Mesh(new T.ExtrudeGeometry(bs,{depth:.02,bevelEnabled:false}),m);bl.position.set(.01,.68,-.01);ax.add(bl);
   ax.traverse(o=>o.layers.set(3));ax.visible=false;W3.sc.add(ax);tn.axS=ax} // 그림자에만 보이는 치켜든 도끼
  tn.silMat=new T.MeshBasicMaterial({color:0x000000,fog:false});
  return tn}
function tentSideX(y){const e=Math.asin(Math.min(1,Math.pow(Math.max(0,y)/TH,1/.9)))/PI2;return TA*Math.cos(e*PI2)}
function tentWallX(y,z){const k=tentSideX(y)/TA,zz=Math.min(.999,Math.abs(z)/(TB*Math.max(.01,k)));return TA*k*Math.pow(1-Math.pow(zz,3.2),1/3.2)} // 높이 y, 앞뒤 z에서 옆벽까지 거리
function tentS3(){return F3.w.L+F3.w.s0}
// 텐트 밤 시작 (야영지 컷씬 끝 / 다시 하기)
function startTent3(retry){const W3=F3.w,tn=buildTent3(),n=S.night,hd=S.hard;S.ph='tent';S.inTent=true;S.t=0;S.view=S.camX=1;S.torchOff=false;S.brH=false;S.breath=1;S.inWalk=S.inBack=false;S.cut=null;buzz3(false);
  tn.g.visible=true;if(W3.tentX)W3.tentX.visible=false;if(W3.campBag)W3.campBag.visible=false;
  S.tn={sh:S.late?38:0,pk:0,pkHold:false,zipHold:null,brId:null,hd:0,px:0,pxT:0,lk:0,cuts:[],chopT:rnd(8,16),
    ln:{st:'off',timer:rnd(14,20)-n,gk:0},zip:{on:false,st:'off',p:0,timer:n>=2?rnd(38,52)-n*3:1e9},st:{stage:0,timer:n>=4?rnd(26,36):1e9,bad:0},ax:{st:'off',timer:n>=3?rnd(22,30):1e9},pl:{st:'off',timer:n>=2?rnd(85,120):1e9,sag:0,p:0},lbad:0,cr:0,out:0};
  if(S.late)say('해가 다 져서야 텐트를 쳤다. 어둠이 벌써 가깝다.','bad',4);
  S.fade=1;S.fadeTo=0;S.fadeR=1.4;S.paused=true;
  const it=$('intro');$('introBig').textContent='12:00 AM';$('introSmall').textContent=n+'일 차 · 텐트';it.classList.remove('show');void it.offsetWidth;it.classList.add('show');
  setTimeout(()=>{it.classList.remove('show');if(S&&S.ch===3&&S.ph==='tent'&&!S.over){if(DEV.solo)S.paused=false;else openLog3('tent');if(n===1)S.hintT=10}},DEV.on?600:2200);buildUI()}
function breath3(on){if(!S||!S.tn||S.ph!=='tent')return;if(on&&S.breath<.12)return;if(S.brH===on)return;S.brH=on;if(on){S.tn.pkHold=false;S.view=1}if(EYEF)EYEF.frequency.setTargetAtTime(on?700:20000,AC.currentTime,.1);fabric3(0,on?.38:.24);thump(70,.08,on?.12:.06,0);if(!on)exhale(.1)} // 침낭을 머리끝까지 뒤집어씀 (그동안 손전등 빛도 가려짐)
function peek3(on){if(!S||!S.tn||S.ph!=='tent')return;S.tn.pkHold=on&&!S.brH;if(on&&S.view===1&&!S.tn.zip.on&&!S.brH)zipSnd(.06,.25)}
function toggleTorch3(){if(!S||S.ph!=='tent'||S.over)return;S.torchOff=!S.torchOff;sfx(S.torchOff?700:1100,.03,'square',.05);thump(900,.02,.04,.2);buildUI()}
function mash3(){const z=S.tn.zip;if(!z.on||z.st!=='fight')return;z.p=Math.max(0,z.p-z.k);z.clicks++;zipSnd(.05,.12);S.shake=.05;if(z.p<=.015)zipWin3()}
function axDodge3(){const a=S.tn.ax,tn=S.tn;if(a.st==='wind'||(a.st==='swing'&&!a.hit)){dodge3(-a.sd);return}
  if(a.st==='near'||a.st==='move'){const d=-a.sd;dodge3(d);if(!a.heard){a.heard=1;a.st='move';a.t=0;a.mv=rnd(.6,.9);a.fe=0;a.fT=0;a.sd=d;dragAxe3(d)}}} // 너무 일찍 구르면 소리를 듣고 그쪽으로 바로 옴 // 너무 일찍 구르면 소리를 듣고 그쪽으로 돌아옴
function dodge3(d){const tn=S.tn;if(tn.pxT===d)return;tn.pxT=d;tn.pxBack=0;fabric3(d*.5,.34);thump(60,.1,.14,d*.4);nburst(700,1,.18,.06,d*.4)} // 텐트 안에서 옆으로 굴러 피함
function noteHit3(p){const tn=F3.w&&F3.w.tn;if(!tn||!tn.note||S.brH||S.tn.pk>.1)return false;const v=new R3.T.Vector3();tn.note.getWorldPosition(v);v.project(R3.cam);if(v.z>1)return false;const x=(v.x+1)/2*W,y=(1-v.y)/2*H;return Math.hypot(p.x-x,p.y-y)<Math.max(48,H*.09)}
function tentDown3(p,e){const tn=S.tn;if(!tn)return;
  {const pl=tn.pl;if(pl.st!=='off'&&pl.st!=='done'){const k=handHit(p);if(k==='torch'){HND.thP=1;toggleTorch3();return}
    if(pl.st==='down'){if(zipHit3(p))poleExit3();return} // 무너진 텐트: 지퍼를 열고 나감
    if(pl.st==='out'){const nz=navZone3(p);if(nz){turn(nz);return}pl.hold=e.pointerId}return}} // 밖: 꾹 = 폴 붙잡고 세우기
  if(tn.zip.on){mash3();return}
  if(axOn3()){axDodge3();return} // 도끼: 아무 데나 누르면 그것 반대쪽으로 굴러 피함
  const nz=navZone3(p);if(nz){turn(nz);return}
  {const k=handHit(p);if(k==='torch'){HND.thP=1;toggleTorch3();return}}
  if(p.y>H*.76&&Math.abs(S.view-S.camX)<.2&&tn.pk<.1){tn.brId=e.pointerId;breath3(true);return} // 화면 아래 = 무릎 위 침낭
  if(noteHit3(p)){sfx(300,.05,'triangle',.02);openLog3('tent');return}
  if(S.view===1&&Math.abs(S.view-S.camX)<.1&&zipHit3(p)){tn.zipHold=e.pointerId;peek3(true);return}
  S.swipe={x:p.x,y:p.y,id:e.pointerId}}
function tentUp3(e){const tn=S.tn;if(!tn)return;if(e.pointerId===tn.pl.hold)tn.pl.hold=null;if(e.pointerId===tn.brId){tn.brId=null;breath3(false)}if(e.pointerId===tn.zipHold){tn.zipHold=null;peek3(false)}
  if(S.swipe&&S.swipe.id===e.pointerId){const p=gameXY(e),dx=p.x-S.swipe.x;if(Math.abs(dx)>60&&!axOn3())turn(dx>0?-1:1);S.swipe=null}}
function tentKey3(a,down){{const pl=S.tn.pl;if(pl.st!=='off'&&pl.st!=='done'){if(a==='torch'&&down)toggleTorch3();else if(pl.st==='down'&&(a==='peek'||a==='mash')&&down)poleExit3();else if(pl.st==='out'){if(a==='left'&&down)turn(-1);else if(a==='right'&&down)turn(1);else if(a==='breath'||a==='mash'||a==='peek')pl.hold=down?'k':null}return}}if((a==='left'||a==='right'||a==='mash')&&down&&axOn3()){axDodge3();return}if(a==='left'&&down)turn(-1);else if(a==='right'&&down)turn(1);else if(a==='torch'&&down)toggleTorch3();else if(a==='breath')breath3(down);else if(a==='peek')peek3(down);else if(a==='mash'&&down)mash3()}
const navW3=()=>Math.max(52,W*.065);
function navZone3(p){if(!S.tn||S.tn.zip.on||S.tn.pk>.1||S.brH||axOn3())return 0;if(p.x<navW3()&&S.view>0)return -1;if(p.x>W-navW3()&&S.view<2)return 1;return 0}
function zipHit3(p){const tn=F3.w.tn;if(!tn)return false;const v=new R3.T.Vector3();tn.pull.getWorldPosition(v);v.y+=.35;v.project(R3.cam);const x=(v.x+1)/2*W,y=(1-v.y)/2*H;return Math.abs(p.x-x)<W*.12&&Math.abs(p.y-y)<H*.3}
const lanLit3=()=>{const s=S.tn&&S.tn.ln.st;return s==='press'||s==='door'||s==='unzip'||s==='look'||s==='zip'};
const plSoon3=()=>{const pl=S.tn.pl;return pl.st==='off'&&pl.timer<8&&S.night>=2&&SOLO3('pole')}; // 질주자가 곧 오면 다른 것들이 새로 시작하지 않음
const lanDanger3=()=>{const l=S.tn.ln;return (l.st==='press'&&l.t>1.2)||l.st==='door'||l.st==='unzip'||l.st==='look'||(l.st==='zip'&&l.t<.4)};
// 밤 진행
function tent3(dt){const tn=S.tn,n=S.night,hd=S.hard?1.2:1,z=tn.zip,ln=tn.ln,st=tn.st,ax=tn.ax;
  S.t+=dt*60/HOUR3;if(S.t>=HOUR*6){dawn3();return}
  if(S.hintT>0)S.hintT-=dt;
  tn.hd+=((S.brH?1:0)-tn.hd)*Math.min(1,dt*(S.brH?6.5:4.5));
  tn.px+=(tn.pxT-tn.px)*Math.min(1,dt*10);if(ax.st!=='wind'&&ax.st!=='swing'&&tn.pxT!==0){tn.pxBack=(tn.pxBack||0)+dt;if(tn.pxBack>.55){tn.pxT=0;tn.pxBack=0;fabric3(0,.14)}}
  {const lkT=ax.st==='near'&&ax.t>1.2||ax.st==='move'&&ax.t>ax.mv*.5||ax.st==='wind'||ax.st==='swing'?-ax.sd*.95:ax.st==='peek'?-ax.sd*.78:0;tn.lk+=(lkT-tn.lk)*Math.min(1,dt*(ax.st==='peek'?2.5:7))}
  tn.cuts.forEach(c=>{c.o+=(c.oT-c.o)*Math.min(1,dt*(c.oT>c.o?14:3))});
  // 숨: 뒤집어쓴 동안 줄고, 다 떨어지면 저절로 침낭을 걷고 크게 들이마심
  if(S.brH){S.hbT=(S.hbT||0)-dt;if(S.hbT<=0){S.hbT=lerp(.62,.38,1-S.breath);thump(52,.12,.22,0);thump(48,.1,.14,0,.13)}S.breath-=dt/14;if(S.breath<=0){S.breath=0;breath3(false);gasp3();if(lanDanger3())return die('파수꾼')}}else S.breath=Math.min(1,S.breath+dt/5);
  // 틈으로 보기 (앞을 볼 때만)
  tn.pk+=((tn.pkHold&&S.view===1&&Math.abs(S.camX-1)<.15&&!z.on&&!S.brH?1:0)-tn.pk)*Math.min(1,dt*5);
  if(tn.pl.st!=='off'&&tn.pl.st!=='done'){pole3(dt);return} // 텐트가 무너진 동안엔 다른 것들이 멈춤 (그것만 남음)
  // 그림자: 손전등이 꺼져 있으면 발치 어둠에서 다가옴 (다른 것이 와 있는 동안엔 멈춤)
  const busy=lanLit3()||(ax.st!=='off'&&ax.st!=='leave'); // 교대자가 문 앞이어도 그림자는 다가옴 (손전등을 끈 동안 둘 다 신경 써야 함)
  if(!z.on&&SOLO3('shadow')){if(lightOut3())tn.sh=Math.max(0,tn.sh-dt*24);else if(!busy)tn.sh+=dt*(5.2+n*.55)*hd}
  if(tn.sh>=100)return die('그림자');
  if(tn.sh>30&&Math.random()<dt*.35)breathe(rnd(-.3,.3),.1+tn.sh/600);
  if(tn.dcd>0)tn.dcd-=dt;
  // 먼 데서 나무 찍는 소리 (분위기)
  tn.chopT-=dt;if(tn.chopT<=0){tn.chopT=rnd(22,38);if(ax.st==='off'&&!z.on&&!DEV.solo){const pan=rnd(-1,1),c=3+ri(4);for(let k=0;k<c;k++)setTimeout(()=>{if(S&&S.ch===3&&S.ph==='tent')chop3(pan,.05)},k*rnd(950,1300))}}
  if(z.on){zip3(dt);return} // 지퍼 싸움 중엔 다른 것들이 안 옴
  lantern3(dt);if(S.over)return;stalker3(dt);if(S.over)return;ax3(dt);if(S.over)return;
  // 지퍼 여는 것 (2일 차~)
  if(n>=2&&SOLO3('zip')){z.timer-=dt;if(z.timer<=0){if(ln.st==='off'&&st.stage<4&&ax.st==='off'&&tn.sh<25&&!plSoon3()){zipStart3()}else z.timer=4}}
  // 질주자 (2일 차~, 하룻밤 한 번): 텐트를 들이받아 무너뜨림
  const pl=tn.pl;if(n>=2&&SOLO3('pole')&&pl.st==='off'&&!z.on){if(S.t<HOUR*5)pl.timer-=dt;if(pl.timer<=0&&ln.st==='off'&&ax.st==='off'&&st.stage<3&&tn.sh<20)poleStart3()}}
// 질주자 (텐트): 옆에서 네 발로 달려와 텐트를 들이받음 → 한쪽이 폭삭 주저앉음 → 지퍼를 열고 나가 쓰러진 폴을 붙잡고 세워야 함 (안에서 버티면 천에 깔려 덮쳐짐)
// 밖에서 폴을 세우는 동안 그것이 왼쪽/오른쪽 어둠에서 달려듦 → 소리 나는 쪽을 보고 손전등을 비추면 미끄러지며 멈추고 달아남
function poleStart3(){const pl=S.tn.pl;Object.assign(pl,{st:'come',t:0,sd:Math.random()<.5?-1:1,stepT:0,sag:0,p:0,hold:null,ou:0,bk:0,k:0,c:null});S.tn.pkHold=false}
function poleExit3(){const pl=S.tn.pl;if(pl.st!=='down')return;pl.st='exit';pl.t=0;zipSnd(.14,.45);fabric3(0,.3);S.fadeTo=1;S.fadeR=7}
function pole3(dt){const pl=S.tn.pl,n=S.night,tn=S.tn;pl.t+=dt;
  if(pl.st==='come'){pl.stepT-=dt;if(pl.stepT<=0){pl.stepT=lerp(.27,.12,Math.min(1,pl.t/1.2));const v=.04+pl.t*.3;thump(62+pl.t*20,.08,v,pl.sd*.9);nburst(500+pl.t*600,1.6,.05,v*.7,pl.sd*.9)}
    if(pl.t>1.3){pl.st='hit';pl.t=0;S.shake=.6;thump(42,.5,.75,pl.sd*.6);thump(95,.14,.5,pl.sd*.5,.03);nburst(900,.7,.55,.42,pl.sd*.6);fabric3(pl.sd*.6,.6);creak3(pl.sd*.5,.3);sting(pl.sd*.5);breath3(false);tn.pkHold=false;if(S.view!==1){S.view=1;buildUI()}}return}
  if(pl.st==='hit'){pl.sag=ease(Math.min(1,pl.t/.35));if(pl.t>.35&&!pl.cr){pl.cr=1;creak3(pl.sd*.4,.2);nburst(300,.6,.6,.2,pl.sd*.4,0,'lowpass')}if(pl.t>.9){pl.st='down';pl.t=0;pl.stepT=1;say(n<=3&&!pl.said?'폴이 쓰러졌다. 나가서 세워야 해.':'천이 얼굴까지 내려앉는다.','bad',3);pl.said=1}return}
  if(pl.st==='down'){pl.sag=1;const lim=(n>=4?11:13)*(S.hard?.8:1);
    if(Math.random()<dt*1.4)fabric3(pl.sd*.4,.06+pl.t*.012);pl.stepT-=dt;if(pl.stepT<=0){pl.stepT=rnd(1,2);rcStepT3(rnd(-1,1),.05+pl.t*.008);if(Math.random()<.5)breathe(rnd(-.8,.8),.1+pl.t*.01)} // 텐트 둘레를 빙빙 도는 발소리·숨소리
    if(pl.t>lim)return die('질주자');return}
  if(pl.st==='exit'){if(pl.t>.5){pl.st='out';pl.t=0;pl.c={st:'wait',t:0,w:rnd(1.3,2.1)};S.view=1;S.camX=1;tn.out=1;S.fadeTo=0;S.fadeR=6;leafStep(0,.2);buildUI();if(!pl.said2){pl.said2=1;say('폴. 붙잡고 세워야 해.','',2.4)}}return}
  if(pl.st==='out'){const c=pl.c,face=Math.abs(S.camX-1)<.22;c.t+=dt;
    if(pl.hold!=null&&face&&pl.p<1){pl.p=Math.min(1,pl.p+dt/3.1);pl.ck=(pl.ck||0)-dt;if(pl.ck<=0){pl.ck=rnd(.35,.6);creak3(0,.07);fabric3(0,.05)}if(pl.p>=1){thump(120,.06,.3,0);sfx(1500,.04,'square',.04);fabric3(0,.25)}}
    if(c.st==='wait'){if(pl.p>=1&&c.t>.4){pl.st='back';pl.t=0;S.fadeTo=1;S.fadeR=7;return}
      if(c.t>c.w&&pl.p<1){c.st='come';c.t=0;c.sd=Math.random()<.5?-1:1;c.win=Math.max(.95,1.5-(n-2)*.13-(S.hard?.12:0));c.stepT=0;nburst(800,.8,.35,.25,c.sd*.9);thump(55,.2,.25,c.sd*.8)}return} // 덤불 헤치고 튀어나옴
    if(c.st==='come'){const k=Math.min(1,c.t/c.win),pan=Math.sin(((c.sd<0?0:2)-S.camX)*PI2);c.d=lerp(13,1.4,k);c.stepT-=dt;if(c.stepT<=0){c.stepT=lerp(.2,.11,k);const v=.08+k*.5;thump(60+k*35,.08,v,Math.max(-1,Math.min(1,pan)));nburst(500+k*900,1.6,.05,v*.7,Math.max(-1,Math.min(1,pan)))}
      if(Math.abs(S.camX-(c.sd<0?0:2))<.35&&torchOn3()){c.st='skid';c.t=0;c.d0=c.d;thump(50,.25,.35,0);nburst(1800,1.5,.5,.2,0);nburst(600,.7,.6,.15,0,.05,'lowpass');return} // 빛에 놀라 미끄러지며 멈춤
      if(c.t>=c.win)return die('질주자');return}
    if(c.st==='skid'){if(c.t>1.7){c.st='wait';c.t=0;c.w=rnd(.9,1.7);pl.k++}}return}
  if(pl.st==='back'){if(pl.t>.45&&!pl.bk){pl.bk=1;tn.out=0;pl.sag=0;S.view=1;S.camX=1;S.fadeTo=0;S.fadeR=4;zipSnd(.1,.6);buildUI()}if(pl.t>1.1){pl.st='done';achC3('pole');say('...섰다. 발소리가 멀어진다.','',2.8)}}}
function rcStepT3(pan,v){thump(62,.08,v,pan);nburst(700,1.6,.05,v*.7,pan);if(Math.random()<.4)nburst(2600,4,.03,v*.3,pan)}
// 파수꾼: 랜턴 들고 텐트 둘레를 돎 → 옆 벽을 짚음 (손자국) → 문 앞으로 가서 지퍼를 열고 안을 들여다봄 → 닫고 떠남
// 손자국이 찍히면 침낭을 뒤집어쓰고 지퍼가 다시 닫힐 때까지 버팀
function lantern3(dt){const ln=S.tn.ln,n=S.night,tn=S.tn;if(!SOLO3('lantern'))return;
  if(ln.st==='off'){ln.timer-=dt;if(ln.timer<=0){if(tn.ax.st!=='off'||tn.zip.on||plSoon3()){ln.timer=3;return}ln.st='come';ln.t=0;ln.dir=Math.random()<.5?1:-1;ln.side=ln.dir>0?Math.PI:0;ln.th=Math.PI/2-ln.dir*Math.PI*.55;ln.stepT=0;ln.gk=0}return}
  ln.t+=dt;ln.stepT-=dt;const lx=Math.cos(ln.th),pan=Math.max(-1,Math.min(1,lx*1.2));
  const bad=k=>{if(!S.brH)tn.lbad+=dt*k;else tn.lbad=Math.max(0,tn.lbad-dt*.6)};
  if(ln.st==='come'){if(ln.stepT<=0){ln.stepT=.62;leafStep(pan,.05+ln.t*.025)}if(Math.random()<dt*.6)creak3(pan,.05);if(ln.t>4.5){ln.st='circle';ln.t=0}return}
  if(ln.st==='circle'){ln.th+=ln.dir*dt*.42;if(ln.stepT<=0){ln.stepT=.62;leafStep(pan,.16)}if(Math.random()<dt*.8)creak3(pan,.08);
    if((ln.dir>0?ln.th>=ln.side:ln.th<=ln.side)&&!ln.pass&&(tn.dcd>0||tn.ax.st!=='off')){ln.pass=1} // 다른 것이 문 앞이거나 방금 다녀갔으면 짚지 않고 지나감
    if(ln.pass&&(ln.dir>0?ln.th>=ln.side+1.2:ln.th<=ln.side-1.2)){ln.st='leave';ln.t=0;ln.pass=0;return}
    if(!ln.pass&&(ln.dir>0?ln.th>=ln.side:ln.th<=ln.side)){ln.th=ln.side;ln.st='press';ln.t=0;ln.hs=Math.random()<.5?-1:1;ln.z=ln.hs*rnd(.12,.22);fabric3(pan,.3)}return}
  if(ln.st==='press'){if(ln.t>.8&&!ln.sn){ln.sn=1;fabric3(pan,.45);breathe(pan,.18)}if(ln.t>1.2)bad(1);if(Math.random()<dt*1.5)fabric3(pan,.08);
    if(ln.t>3){ln.st='door';ln.t=0;ln.sn=0;ln.th0=ln.th;ln.th1=Math.cos(ln.side)>0?-PI2:Math.PI*1.5;fabric3(pan,.2)}}
  else if(ln.st==='door'){const k=Math.min(1,ln.t/2.3);ln.th=lerp(ln.th0,ln.th1,ease(k));if(ln.stepT<=0){ln.stepT=.55;leafStep(Math.cos(ln.th)*.9,.17)}if(Math.random()<dt*.8)creak3(Math.cos(ln.th),.1);bad(1);
    if(ln.t>2.4){ln.st='unzip';ln.t=0;zipSnd(.1,1.3);thump(80,.1,.12,0)}}
  else if(ln.st==='unzip'){ln.gk=Math.min(1,ln.t/1.4);bad(1.4);if(Math.random()<dt*6)zipSnd(.035,.07);if(ln.t>1.5){ln.st='look';ln.t=0;breathe(0,.22);creak3(0,.14)}}
  else if(ln.st==='look'){ln.gk=1;bad(3);if(Math.random()<dt*.9)creak3(0,.1);if(ln.t>2.8){ln.st='zip';ln.t=0;zipSnd(.12,.9)}}
  else if(ln.st==='zip'){ln.gk=Math.max(0,1-ln.t/.95);if(ln.t<.4)bad(2);if(ln.t>1.1){ln.st='leave';ln.t=0;ln.gk=0;ln.dir=Math.random()<.5?1:-1;tn.lbad=0;tn.dcd=7;fabric3(0,.15)}}
  if(tn.lbad>1.6)return die('파수꾼');
  if(ln.st==='leave'){ln.th+=ln.dir*dt*.5;if(ln.stepT<=0){ln.stepT=.62;leafStep(Math.cos(ln.th),Math.max(.02,.16-ln.t*.03))}if(ln.t>5){ln.st='off';ln.timer=cd3(Math.max(20,rnd(36,50)-n*4)/(S.hard?1.2:1));achC3('lantern')}}}
// 지퍼 여는 것: 밖에서 지퍼를 내림 → 아무 데나 연타해서 다시 닫기
function zipStart3(){const z=S.tn.zip,n=S.night;z.on=true;z.st='rip';z.t=0;z.p=.04;z.clicks=0;z.yk=rnd(1,1.6);
  // 갑자기 확 열림 → 틈에 얼굴 → 연타로 조금씩 닫음 (몇 초는 버텨야 닫힘). 중간중간 확 잡아당김
  const N=Math.round(20+(n-2)*4)+(S.hard?4:0),R=4.6,pull=.085*(S.hard?1.15:1),p0=.5+n*.02;z.p0=p0;z.pull=pull;z.k=(p0+pull*N/R+.05*(N/R)/1.3)/N;z.need=N;
  if(S.view!==1){S.view=1;S.camX=1;buildUI()}S.tn.pkHold=false;breath3(false);zipSnd(.22,.28);sting(0);thump(90,.08,.3,0);S.shake=.35;buildUI()}
function zip3(dt){const z=S.tn.zip;z.t+=dt;
  if(z.st==='rip'){z.p=lerp(.04,z.p0,ease(Math.min(1,z.t/.3)));if(z.t>.38){z.st='fight';z.t=0;breathe(0,.2)}return}
  if(z.st==='fight'){z.p+=z.pull*dt;z.yk-=dt;if(z.yk<=0){z.yk=rnd(1.1,1.9);z.p+=.05;zipSnd(.1,.12);S.shake=.12}if(Math.random()<dt*5)zipSnd(.035,.07);if(z.p>=1)return die('지퍼 여는 것');return}
  if(z.st==='win'){if(z.t>2.2){z.on=false;z.st='off';z.timer=cd3(rnd(45,62)-S.night*3);buildUI()}}}
function zipWin3(){const z=S.tn.zip;z.st='win';z.t=0;z.p=0;zipSnd(.12,.3);setTimeout(()=>{if(S&&S.ch===3){exhale(.2);leafStep(0,.15);setTimeout(()=>leafStep(.2,.1),600)}},500);achC3('zip')}
// 교대자 (4일 차~): 나무 사이에서 점점 가까이 → 문 앞에 서면 손전등이 지직거리며 깜빡임 (끄면 됨). 지직 소리가 그치면 떠난 것
const ST3=[0,15,10,5.5,1.45];
function stalker3(dt){const st=S.tn.st;if(S.night<4||!SOLO3('stalker'))return;st.timer-=dt;
  if(st.stage<4){if(st.timer<=0&&st.stage===3&&(S.tn.zip.on||S.tn.ax.st!=='off'||plSoon3())){st.timer=2;return}if(st.timer<=0){st.stage++;st.x=st.stage===4?rnd(-.15,.15):rnd(-2.5,2.5);if(st.stage<4){st.timer=cd3(rnd(11,17)/(S.hard?1.2:1));const v=[0,.05,.08,.12][st.stage];for(let k=0;k<3;k++)leafStep(rnd(-.2,.2),v*rnd(.7,1)*(k?1:1.2))}
      else{st.timer=7.5;st.bad=0;st.gr=1.1;leafStep(0,.32);setTimeout(()=>{if(S&&S.ch===3&&S.tn&&S.tn.st.stage>=4)buzz3(true)},380)}}return}
  // 문 앞: 지직거림 + 손전등 깜빡임
  st.gr-=dt;if(torchOn3())S.flick3=.08;if(st.gr<=0){if(lightOut3())st.bad+=dt;else st.bad=Math.max(0,st.bad-dt)}if(st.bad>1.8)return die('교대자');
  if(st.timer<=0){st.stage=0;buzz3(false);sfx(1400,.02,'square',.03);S.tn.dcd=7;st.timer=cd3(rnd(24,36)/(S.hard?1.2:1));setTimeout(()=>leafStep(0,.14),500);setTimeout(()=>leafStep(.1,.08),1100);achC3('stalker')}}
function buzz3(on){if(!AC)return;if(on){if(F3.bz)return;const t=AC.currentTime,o=AC.createOscillator(),o2=AC.createOscillator(),f=AC.createBiquadFilter(),g=AC.createGain(),lfo=AC.createOscillator(),lg=AC.createGain();
    o.type='sawtooth';o.frequency.value=120;o2.type='square';o2.frequency.value=60.4;f.type='bandpass';f.frequency.value=1100;f.Q.value=.9;g.gain.value=0;g.gain.setTargetAtTime(.045,t,.04);lfo.type='square';lfo.frequency.value=6.7;lg.gain.value=.03;lfo.connect(lg);lg.connect(g.gain);o.connect(f);o2.connect(f);f.connect(g);g.connect(out(0));[o,o2,lfo].forEach(x=>x.start());F3.bz={g,o:[o,o2,lfo]};
    F3.bzI=setInterval(()=>{if(!F3.bz)return;nburst(rnd(2500,5000),2,.02,rnd(.03,.07),rnd(-.2,.2))},90)}
  else if(F3.bz){const b=F3.bz;F3.bz=null;clearInterval(F3.bzI);b.g.gain.cancelScheduledValues(AC.currentTime);b.g.gain.setTargetAtTime(0,AC.currentTime,.02);setTimeout(()=>b.o.forEach(x=>{try{x.stop()}catch(e){}}),300)}}
// 나무꾼 (3일 차~): 텐트 옆에서 도끼로 천을 찍음. 날이 먼저 높이 한 번 뚫고 들어옴(경고) → 그 반대쪽으로 피해야 낮게 휘두르는 다음 도끼를 피함
const axOn3=()=>{const a=S&&S.tn&&S.tn.ax;return !!a&&(a.st==='near'||a.st==='wind'||a.st==='swing'||a.st==='move')};
function axCut3(sd,kind){const tn=S.tn,c={sd,y:rnd(.58,.66),z:sd<0?rnd(-.46,-.34):rnd(-.3,-.14),dy:.96,dz:sd*.28,hl:.19,o:0,oT:.016};c.kind=kind;tn.cuts.push(c);if(tn.cuts.length>4)tn.cuts.shift();tn.ax.cut=c;return c}
// 나무꾼 (3일 차~): 텐트 둘레를 돌다(발소리·도끼 끄는 소리) → 옆벽에 도끼를 치켜든 그림자 → 내려찍음
// 그림자가 도끼를 치켜든 동안 아무 데나 누르면 반대쪽으로 굴러 피함. 너무 일찍 구르면 소리를 듣고 그쪽으로 돌아감
function ax3(dt){const a=S.tn.ax,n=S.night,tn=S.tn;if(n<3||!SOLO3('axT'))return;
  if(a.st==='off'){a.timer-=dt;if(a.timer<=0){if(tn.ln.st!=='off'||tn.zip.on||tn.st.stage>=4||plSoon3()){a.timer=3;return}
      a.st='near';a.t=0;a.rep=0;a.reps=(n>=4?4:3)+(S.hard?1:0);a.sd=Math.random()<.5?-1:1;a.stepT=0;a.sc=0;a.heard=0;a.sh=0;a.fe=Math.random()<.55?rnd(.35,.6):0;a.fT=0;if(S.view!==1){S.view=1;buildUI()}tn.pkHold=false;breath3(false)}return}
  a.t+=dt;const wu=Math.max(.6,1.05-n*.08-(S.hard?.12:0)); // 치켜든 채 멈춰 있는 시간 = 피할 시간
  if(a.st==='near'||a.st==='move'){const dur=a.st==='near'?2.8:a.mv;
    // 헛걸음: 그림자가 잠깐 멈췄다 다시 걷기 (이때 누르면 들킴)
    if(a.fe&&a.t>dur*a.fe&&a.fT<.65){a.fT+=dt;a.t-=dt;a.sh=Math.min(1,a.sh+dt);return}
    a.stepT-=dt;if(a.stepT<=0){a.stepT=.5;leafStep(a.sd*Math.min(.9,.25+a.t/dur*.7),.06+a.t/dur*.12)}if(a.st==='near'&&a.t>1.2&&!a.sc){a.sc=1;dragAxe3(a.sd)}
    a.sh=Math.min(1,Math.max(a.fT>0?.8:0,(a.t-dur*.35)/(dur*.5)));if(a.t>dur){a.st='wind';a.t=0;a.heard=0;scrapeAxe();breathe(a.sd*.8,.2)}return}
  if(a.st==='wind'){a.sh=1;if(a.t>wu){a.st='swing';a.t=0;a.hit=0;axCut3(a.sd,'swing');swing3(a.sd)}return}
  if(a.st==='swing'){if(a.t>.1&&!a.hit){a.hit=1;if(tn.pxT*a.sd>=0)return die('나무꾼');thump(90,.15,.35,a.sd*.6);S.shake=.3}
    a.sh=Math.max(0,1-a.t*2);if(a.t>.9){rip3(a.sd,.13);a.rep++;if(a.rep<a.reps){a.st='move';a.t=0;a.heard=0;a.fT=0;a.fe=Math.random()<.4?rnd(.35,.6):0;
        if(Math.random()<.5){a.sd=Math.sign(tn.pxT)||-a.sd;a.mv=rnd(.7,1)}else{a.sd=Math.random()<.5?-1:1;a.mv=rnd(1.2,1.8)}} // 반은 내가 피한 쪽으로 바로 쫓아옴
      else{a.st='peek';a.t=0;a.cut.oT=.05;tn.pxT=0;setTimeout(()=>{if(S&&S.tn&&S.tn.ax.st==='peek')giggle3(a.sd)},500)}}return}
  if(a.st==='peek'){a.sh=0;if(a.t>2.8){a.st='leave';a.t=0;a.cut.oT=.016;a.stepT=0}return}
  if(a.st==='leave'){a.stepT-=dt;if(a.stepT<=0){a.stepT=.6;leafStep(a.sd*.9,Math.max(.02,.12-a.t*.04))}if(a.t>2.6){a.st='off';a.timer=cd3(rnd(40,55)-n*3);achC3('axe')}}}
function dawn3(){if(S.ph==='dawn')return;S.ph='dawn';if(S.tn&&S.tn.pl.st!=='off'){S.tn.pl.st='done';S.tn.pl.sag=0;S.tn.out=0;S.fadeTo=0}S.dawnT=0;S.dawnK=0;S.torchOff=false;buzz3(false);breath3(false);peek3(false);say('6시. 천이 밝아진다.','',3);buildUI()}
function dawnUpd3(dt){S.dawnT+=dt;S.dawnK=Math.min(1,S.dawnT/3.5);if(S.dawnT>4.2&&S.fadeTo!==1){S.fadeTo=1;S.fadeR=1.6}if(S.dawnT>5.6&&!S.winD){S.winD=1;win3()}}
function win3(){const n=S.night,hard=S.hard;S.over=true;
  if(!DEV.on){try{if(hard){savedCh3h=Math.max(savedCh3h,n+1);localStorage.setItem('obs3_night_hard',savedCh3h)}else{savedCh3=Math.max(savedCh3,n+1);localStorage.setItem('obs3_night',savedCh3)}}catch(e){}}
  setMode('end');showEnd('6:00 AM',`${n}일 차 생존.\n${['','숲은 어젯밤보다 조용하다.','텐트 둘레에 발자국이 한 바퀴.','텐트 옆구리가 찢어져 있다.','텐트 앞 흙이 패여 있다. 맨발 자국.'][n]||''}`,`${n+1}일 차`,()=>newDay3(n+1))}
// ---------- 텐트 안 카메라·괴물 ----------
function fov3(k){const b=W/H<1.5?74:W/H>1.95?62:68,f=b*(1-k);if(Math.abs(R3.cam.fov-f)>.01){R3.cam.fov=f;R3.cam.updateProjectionMatrix()}}
function camTent3(){const W3=F3.w,tn=W3.tn,cam=R3.cam,T=R3.T;if(!tn)return;if(S.tn&&S.tn.out){camOut3();return}const s=S.tn,k=ease(s?s.pk:0),hk=ease(s?s.hd||0:0),br=Math.sin(T_*1.25)*.006*(S.brH?.2:1),px=(s?s.px:0)*.42,roll=s?(s.pxT-s.px)*.22:0;
  const lp=new T.Vector3(lerp(px,0,k),lerp(lerp(TCAM[1],.36,hk)-Math.sin(hk*Math.PI)*.04-Math.abs(roll)*.25,.48,k)+br,lerp(lerp(TCAM[2],.52,hk),tentFrontZ(.48)+.22,k));tn.g.updateMatrixWorld();cam.position.copy(lp.applyMatrix4(tn.g.matrixWorld));
  if(S.shake>0){cam.position.x+=rnd(-.008,.008);cam.position.y+=rnd(-.006,.006)}
  const zon=s&&s.zip.on&&s.zip.st!=='win';if(s)s.zk=(s.zk||0)+((zon?1:0)-(s.zk||0))*(zon?.25:.06);const zk=ease(s?s.zk||0:0);fov3(.36*zk); // 지퍼 싸움: 틈에 붙은 얼굴로 시선이 확 쏠림
  const yaw=(1-S.camX)*1.25*(1-k)*(1-hk)+(s?s.lk:0);cam.rotation.set(lerp(lerp(-.17+k*.18,.04,hk),-.2,zk)+Math.sin(T_*.5)*.004,W3.tentRy+yaw+Math.sin(T_*.31)*.004,roll);
  if(tn.hood){const h=tn.hood,on=hk>.004;h.visible=on;if(on){cam.updateMatrixWorld();h.position.copy(cam.position);h.quaternion.copy(cam.quaternion);const air=S.breath;h.morphTargetInfluences[0]=hk;h.morphTargetInfluences[1]=hk*Math.max(0,Math.min(1,(1-air)*.9+.12*Math.sin(T_*2.2)+.1));
    tn.hoodL.position.copy(cam.position).add(new T.Vector3(.03,-.05,-.04).applyQuaternion(cam.quaternion));tn.hoodL.intensity=torchOn3()?.22*hk:.03*hk}else tn.hoodL.intensity=0}}
// 텐트 밖 (폴 세우기): 문 앞에 서서 텐트를 봄. 왼쪽/오른쪽 = 어둠 속 숲
function camOut3(){const W3=F3.w,tn=W3.tn,cam=R3.cam;tn.g.updateMatrixWorld();const p=tl(0,0,-TB-1.45),pl=S.tn.pl,hk=pl.hold!=null&&Math.abs(S.camX-1)<.22&&pl.p<1?1:0,f=1-Math.min(1,Math.abs(S.camX-1));
  cam.position.set(p.x,W3.hg(p.x,p.z)+1.58-f*.32*hk+Math.sin(T_*1.3)*.008,p.z);if(S.shake>0){cam.position.x+=rnd(-.01,.01);cam.position.y+=rnd(-.008,.008)}fov3(-.04);
  cam.rotation.set(lerp(-.04,-.36,f)+Math.sin(T_*.5)*.004+hk*Math.sin(T_*21)*.004,W3.tentRy+Math.PI+(1-S.camX)*PI2+Math.sin(T_*.31)*.004,0);if(tn.hood){tn.hood.visible=false;tn.hoodL.intensity=0}}
function tentHide3(){const W3=F3.w;if(!W3)return;['lan','wid','stk','shd','axT'].forEach(k=>monHide(W3.mons[k]));if(W3.lanM)W3.lanM.visible=false;W3.lan.intensity=0;if(W3.tn){W3.tn.g.visible=false;if(W3.shdE)W3.shdE.visible=false;W3.tn.axe.visible=false}}
function tl(x,y,z){const tn=F3.w.tn;return new R3.T.Vector3(x,y,z).applyMatrix4(tn.g.matrixWorld)}
const tlYaw=(dx,dz)=>F3.w.tentRy+Math.atan2(dx,dz); // 텐트 기준 방향 (dx,dz)를 보게
function headAt(I,target){ // 모델 머리(눈 높이)가 target(세상 좌표)에 오도록 몸 전체를 옮김
  if(!I.hb){I.o.traverse(o=>{if(o.isBone&&o.name.endsWith('Head'))I.hb=o;if(o.isBone&&o.name.endsWith('HeadTop_End'))I.ht=o})}
  I.g.updateMatrixWorld(true);if(!I.hb)return;const a=new R3.T.Vector3(),b=new R3.T.Vector3();I.hb.getWorldPosition(a);if(I.ht){I.ht.getWorldPosition(b);a.lerp(b,.35)}I.g.position.add(target.clone().sub(a));I.g.updateMatrixWorld(true)}
// 밖에 선 것의 그림자를 천에 맺히게: 그것 등 뒤(텐트 반대쪽) 조금 위에 빛을 둔 것처럼 계산
function sil3(tn,I,p,ctr,back,up){const T=R3.T,W3=F3.w,u=tn.m2.uniforms,ow=new T.Vector3(p.x-ctr.x,0,p.z-ctr.z).normalize(),VL=p.clone().addScaledVector(ow,back);VL.y=p.y+up;
  if(!I.l3){I.l3=1;I.o.traverse(o=>{if(o.isMesh&&o!==W3.lanM)o.layers.enable(3)})}
  const sc=tn.silCam;sc.position.copy(VL);sc.lookAt(tl(0,.55,0));sc.updateMatrixWorld();sc.updateProjectionMatrix();
  const rd=R3.rd,prevT=rd.getRenderTarget(),cc=rd.getClearColor(new T.Color()),ca=rd.getClearAlpha(),bg=W3.sc.background,sw=[];
  I.o.traverse(o=>{if(o.isMesh&&o!==W3.lanM){sw.push([o,o.material]);o.material=tn.silMat}});W3.sc.background=null;
  rd.setRenderTarget(tn.sil);rd.setClearColor(0xffffff,1);rd.clear();rd.render(W3.sc,sc);rd.setRenderTarget(prevT);rd.setClearColor(cc,ca);W3.sc.background=bg;sw.forEach(([o,m])=>o.material=m);
  u.uSilOn.value=1;u.uLP.value.copy(VL);u.uSilM.value.multiplyMatrices(sc.projectionMatrix,sc.matrixWorldInverse)}
function tentMons3(){const W3=F3.w,T=R3.T,tn=W3.tn,s=S.tn;if(!tn||!s)return;
  poleVis3(W3,tn,s);if(s.out)return;tn.g.visible=true;tn.g.updateMatrixWorld();const ry=W3.tentRy;
  // 지퍼 틈: 지퍼 싸움 > 파수꾼이 엶 > 틈으로 보기
  const z=s.zip,ln=s.ln;let yp=.06,wm=0;if(z.on){const p=z.st==='win'?Math.max(0,1-z.t*2)*.1:z.p;yp=lerp(.08,1.12,p);wm=lerp(.03,.3,p)}else if(ln.gk>.005){const e=ease(ln.gk);yp=lerp(.06,.98,e);wm=.3*e}else if(s.pk>.01){const e=ease(s.pk);yp=lerp(.06,.8,e);wm=.16*e}
  tn.uGap.value.set(yp,wm,0);tn.pull.position.set(0,Math.max(.06,yp),tentFrontZ(Math.max(.06,yp))+.012);
  // 침낭은 몸을 따라 옆으로
  {const hd=ease(s.hd||0),lift=Math.min(1,hd*1.7);tn.bagG.position.set(s.px*.42,lift*.26,lift*.22);tn.bagG.rotation.x=-lift*.5; // 숨을 때: 무릎 위 침낭을 얼굴까지 끌어올림
   // 1~2일 차: 파수꾼이 벽을 짚으면 침낭이 숨 쉬듯 붉게 깜빡임 (여기를 누르라는 뜻)
   const want=(S.night<=2||DEV.solo)&&lanDanger3()&&!S.brH,gl=want?.5+.5*Math.sin(T_*7):0;s.bgl=(s.bgl||0)+(gl-(s.bgl||0))*.2;if(tn.bagM){tn.bagM.emissive.setRGB(.07+s.bgl*.5,.016+s.bgl*.1,.012+s.bgl*.06)}}
  // 리본 흔들림
  tn.rib.forEach((r,i)=>{r.rotation.z=Math.sin(T_*1.1+i)*.06;r.rotation.x=Math.sin(T_*.8+i*2)*.05});
  // 찢긴 자리
  for(let i=0;i<4;i++){const c=s.cuts[i],A=tn.uCA.value[i],B=tn.uCB.value[i];if(c){const l=Math.hypot(c.dy,c.dz);A.set(c.sd,c.y,c.z,c.o);B.set(c.dy/l,c.dz/l,c.hl,0)}else A.w=0}
  // 그림자 (텐트 안 앞 구석 어둠)
  {const sp=s.sh,I=mon3('shd','shadow',1);if(I&&sp>18&&!lightOut3()&&s.hd<.5){const k=Math.min(1,(sp-18)/82),sx=s.shSide||(s.shSide=Math.random()<.5?-1:1),lx=lerp(sx*.62,sx*.12,k*k),lz=lerp(-.82,.05,k*k),p=tl(lx,0,lz);
      if(!I.dk){I.dk=1;I.o.traverse(o=>{if(o.isMesh){o.material.color.setHex(0x30343a);o.material.emissiveIntensity=0}if(!I.hd&&o.isBone&&o.name.endsWith('HeadTop_End'))I.hd=o})}
      I.g.visible=true;I.g.scale.setScalar(.56);I.g.position.copy(p);I.g.position.y-=.08;lookYaw(I,p.x,p.z);I.g.rotation.x=lerp(.3,.62,k)+Math.sin(T_*.8)*.02;I.g.rotation.z=Math.sin(T_*.5)*.04;monPlay(I,'walk',{speed:0,fade:0});monFade(I,Math.min(1,(sp-18)/25));
      if(!W3.shdE){const ec=cvs(128,32,(q,w,h)=>{[w*.3,w*.7].forEach(x2=>{const g=q.createRadialGradient(x2,h/2,0,x2,h/2,h*.5);g.addColorStop(0,'rgba(255,240,225,1)');g.addColorStop(.25,'rgba(255,200,170,.7)');g.addColorStop(1,'rgba(255,120,90,0)');q.fillStyle=g;q.fillRect(0,0,w,h)})});
        W3.shdE=new T.Sprite(new T.SpriteMaterial({map:ctx3(ec),transparent:true,depthWrite:false,depthTest:false,blending:T.AdditiveBlending,fog:false}));W3.shdE.renderOrder=6;W3.sc.add(W3.shdE)}
      I.g.updateMatrixWorld(true);const hp=new T.Vector3();if(I.hd)I.hd.getWorldPosition(hp);else hp.copy(p).setY(p.y+1);hp.addScaledVector(R3.cam.position.clone().sub(hp).normalize(),.04);hp.y-=.07;
      const E=W3.shdE,ew=lerp(.16,.11,k);E.visible=true;E.position.copy(hp);E.scale.set(ew,ew/4,1);E.material.opacity=Math.min(1,(sp-18)/16)*(Math.random()<.015?.2:1)}
    else{monHide(I);if(I)I.dk=0;if(W3.shdE)W3.shdE.visible=false;if(sp<5)s.shSide=0}}
  // 파수꾼
  {const I=mon3('lan','lantern');if(I&&ln.st!=='off'&&ln.st!=='come'){I.g.visible=true;
      if(!W3.lanM){const L=I.o.getObjectByName('lantern');if(L){W3.sc.attach(L);W3.lanM=L;L.material=L.material.clone();L.material.emissiveIntensity=1.6;L.castShadow=false}I.o.traverse(o=>{if(o.isMesh&&o!==W3.lanM)o.layers.enable(3);if(!I.rh&&o.isBone&&o.name.endsWith('RightHand'))I.rh=o})}
      const press=ln.st==='press',atDoor=ln.st==='unzip'||ln.st==='look'||ln.st==='zip';let p,hp=new T.Vector3();I.g.rotation.x=0;
      if(atDoor){const cr=ln.st==='unzip'?ease(Math.min(1,ln.t/.7)):ln.st==='zip'?1-ease(Math.min(1,ln.t/1)):1,lk=ln.st==='look'?ease(Math.min(1,ln.t/.8))*(ln.t>2.4?1-ease(Math.min(1,(ln.t-2.4)/.4)):1):0;
        p=tl(0,0,-TB-.55);I.g.position.copy(p);I.g.rotation.y=ry;I.g.rotation.x=cr*.35+lk*.25;monPlay(I,'idle',{fade:.4});
        headAt(I,tl(Math.sin(T_*.7)*.02,lerp(lerp(1.75,.95,cr),.52,lk),lerp(-TB-.42,-TB-.12,lk)));
        hp.copy(tl(.24,lerp(.55,.42,lk),-TB-.3))}
      else{const r=press?1.45:ln.st==='leave'?1.85+ln.t*.5:ln.st==='door'?lerp(1.45,1.75,Math.sin(Math.min(1,ln.t/2.3)*Math.PI*.5)):1.85,lx=Math.cos(ln.th)*r,lz=Math.sin(ln.th)*r+(press?-ln.hs*.85:0);p=tl(lx,0,lz);I.g.position.copy(p);
        if(press){I.g.rotation.y=ry+Math.atan2(-lx,ln.hs*.35);monPlay(I,'idle',{fade:.5})}else{const dir=ln.st==='door'?Math.sign(ln.th1-ln.th0):ln.dir,tx=-Math.sin(ln.th)*dir,tz=Math.cos(ln.th)*dir;I.g.rotation.y=ry+Math.atan2(tx,tz);monPlay(I,'walk',{speed:.75})}
        I.g.updateMatrixWorld(true);if(I.rh)I.rh.getWorldPosition(hp);else hp.copy(p).setY(p.y+.9)}
      if(W3.lanM){const L=W3.lanM;L.visible=true;L.position.copy(hp);L.position.y-=.03;L.rotation.set(Math.sin(T_*2.3)*.12*(press||atDoor?.3:1),I.g.rotation.y,Math.sin(T_*1.9+1)*.1*(press||atDoor?.3:1))}
      const fl=.85+.15*Math.sin(T_*17)*Math.sin(T_*7.3);W3.lan.position.copy(hp);W3.lan.position.y-=.12;W3.lan.intensity=(atDoor?2.2+ln.gk*4:3.2)*fl;
      const u=tn.m2.uniforms;
      if(atDoor){u.uSilOn.value=0;u.uLP.value.copy(hp);u.uLI.value=(2.6+ln.gk*1.6)*fl}
      else{// 천에 비치는 빛 + 실루엣: 빛을 그것 등 뒤(텐트 반대쪽) 조금 위에 둔 것처럼 계산 → 몸 그림자가 천에 크게 맺힘
        const ctr=tl(0,0,press?Math.sin(ln.th)*1.45-ln.hs*.85:0);sil3(tn,I,p,ctr,.85,1.25);u.uLC.value.set(1,.62,.28);u.uLI.value=3.4*fl*(ln.st==='leave'?Math.max(0,1-ln.t/4):1)}
      // 손자국 + 천이 눌림 (손이 천을 쓸듯 조금씩 미끄러짐)
      const sx=Math.cos(ln.side)>0?1:-1,hk=press?Math.min(1,Math.max(0,(ln.t-.8)/.3))*(ln.t>2.7?Math.max(0,1-(ln.t-2.7)/.3):1):0,sl=Math.max(0,ln.t-.8);
      tn.uHand.value.set(sx,.86-Math.min(.06,sl*.025),ln.z+Math.sin(sl*1.3)*.012+sl*.012*ln.hs,hk);
      dent3(tn,hk,sx,tn.uHand.value.z,tn.uHand.value.y)}
    else{monHide(I);if(W3.lanM)W3.lanM.visible=false;W3.lan.intensity=0;tn.m2.uniforms.uLI.value=0;tn.uHand.value.w=0;dent3(tn,0)}}
  // 지퍼 여는 것: 틈 바로 밖에 쭈그려 들여다봄 + 검은 손가락이 천 가장자리를 쥠
  const ax=s.ax;
  {const I=mon3('wid','widow');const on=z.on&&(z.st!=='win'||z.t<.7);if(I&&on){I.g.visible=true;const p=z.st==='win'?0:z.p,back=z.st==='win'?z.t*.9:0,fy=lerp(.15,.36,Math.min(1,p)),fz=tentFrontZ(fy)-lerp(.2,.06,Math.min(1,p*1.3))-back;
     I.g.position.copy(tl(0,0,-TB-.5-back));I.g.rotation.set(.55,ry,0);monPlay(I,'reach',{speed:.5});headAt(I,tl(Math.sin(T_*1.3)*.012,fy+Math.sin(T_*2.1)*.008,fz))}else monHide(I); // 쭈그려 앉아 틈에 얼굴을 바짝 댐
   const pk=ax.st==='peek'&&ax.cut;
   tn.fingers.forEach((f,i)=>{f.visible=false;return;if(pk){const c=ax.cut,j=i%4,up=i<4?1:-1,tt=(j/3-.5)*c.hl*1.1,y=c.y+c.dy*tt+up*(c.o+.004),zz=c.z+c.dz*tt,x=c.sd*(tentWallX(y,zz)-.005);f.visible=a2(ax.t)>0;f.position.set(x,y,zz);f.rotation.set(up*.35+Math.sin(T_*5+i)*.08,-c.sd*PI2,0);return}
     const sd=i<4?-1:1,j=i%4,show=on&&z.p>.05&&z.st!=='win';f.visible=show;if(!show)return;const y=lerp(.12,Math.max(.16,yp-.1),j/3+.05*Math.sin(T_*3+i)),hw=yp>y?wm*Math.pow(1-y/yp,.85):0;f.position.set(sd*(hw+.004),y,tentFrontZ(y)+.004);f.rotation.set(Math.sin(T_*6+i)*.15,-sd*.5,0)})}
  function a2(t){return t>.35&&t<2.6?1:0}
  // 교대자: 앞쪽 나무 사이 (틈으로만 보임)
  {const st=s.st,I=mon3('stk','stalker',1);if(I&&!I.emB){I.emB=1;I.o.traverse(o=>{if(o.isMesh)o.material.emissiveIntensity=.32})}if(I&&st.stage>0){I.g.visible=true;const p=tl(st.x||0,0,-TB-ST3[st.stage]);I.g.position.copy(p);I.g.position.y=W3.hg(p.x,p.z);lookYaw(I,p.x,p.z);monPlay(I,'idle')}else monHide(I)}
  // 나무꾼: 도끼날 + 마지막에 찢긴 틈으로 들여다보는 얼굴
  {const A=tn.axe,c=ax.cut,blade=c&&ax.st==='swing';A.visible=!!blade;
   if(blade){const sd=c.sd,l=Math.hypot(c.dy,c.dz),X=new T.Vector3(0,c.dy/l,c.dz/l),Y=new T.Vector3(-sd,0,0),Z=new T.Vector3().crossVectors(X,Y);A.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(X,Y,Z));
     let dep;if(ax.st==='warn')dep=ax.t<.07?lerp(-.2,.02,ax.t/.07):ax.t<.8?.02+Math.sin(ax.t*40)*.004*(ax.t<.3?1:0):lerp(.02,-.25,Math.min(1,(ax.t-.8)/.12));
     else dep=ax.t<.08?lerp(-.25,.36,ease(ax.t/.08)):ax.t<.7?.36-Math.min(.08,(ax.t-.08)*.4)+Math.sin(ax.t*34)*.005*(ax.t<.3?1:0):lerp(.28,-.3,Math.min(1,(ax.t-.7)/.15));
     const wx=sd*tentWallX(c.y,c.z);A.position.set(wx,c.y,c.z).addScaledVector(Y,dep-.15)}
   const I=mon3('axT','axe');const shOn=I&&ax.sh>.01&&(ax.st==='near'||ax.st==='move'||ax.st==='wind'||ax.st==='swing');
   if(shOn){const sd=ax.sd,wd=ax.st==='wind'||ax.st==='swing',zz=ax.st==='near'||ax.st==='move'?lerp(-.9,-.05,Math.min(1,ax.t/(ax.st==='near'?2.8:ax.mv))):-.05,p=tl(sd*1.8,0,zz);I.g.visible=true;I.g.position.copy(p);I.g.position.y=W3.hg(p.x,p.z);I.g.rotation.set(wd?-.22*Math.min(1,ax.t/.35):0,tlYaw(-sd,0),0);
     monPlay(I,wd?'charge':'walk',{speed:wd?.0001:.8,fade:.25});
     {const A2=tn.axS;A2.visible=wd;if(wd){if(!I.hb)I.o.traverse(o=>{if(!I.hb&&o.isBone&&o.name.endsWith('Head'))I.hb=o});I.g.updateMatrixWorld(true);const hp=new T.Vector3();if(I.hb)I.hb.getWorldPosition(hp);else hp.copy(p).setY(p.y+1.6);
       const up=ax.st==='wind'?ease(Math.min(1,ax.t/.35)):Math.max(0,1-ax.t*6),ang=lerp(.3,-.55,up)*sd;A2.position.copy(hp).add(new T.Vector3(0,lerp(-.5,.05,up),0));A2.rotation.set(0,F3.w.tentRy+(sd>0?Math.PI:0),0);A2.rotateZ(lerp(-2.2,.55,up));A2.updateMatrixWorld(true)}}
     sil3(tn,I,p,tl(0,0,zz),3.2,.7);const u=tn.m2.uniforms;u.uLC.value.set(.5,.6,.85);u.uLI.value=15*ax.sh}
   else if(I&&ax.st==='peek'&&c){I.g.visible=true;const sd=c.sd,k=a2(ax.t)?Math.min(1,(ax.t-.35)/.5):0;monPlay(I,'idle',{speed:.4});I.g.rotation.set(.2,tlYaw(-sd,0),0);I.g.position.copy(tl(sd*1.7,0,c.z));
     headAt(I,tl(sd*(tentWallX(c.y,c.z)+lerp(.4,.115,ease(k))),c.y-.015,c.z+.01));
     W3.lan.position.copy(tl(sd*(tentWallX(c.y,c.z)-.25),c.y+.05,c.z+.1));W3.lan.color.setHex(0x9aa4b8);W3.lan.intensity=.9*k}
   else{monHide(I);if(ax.st!=='peek'&&W3.lan.color.getHex()!==0xffa04a)W3.lan.color.setHex(0xffa04a)}
   if(!shOn){tn.axS.visible=false;if(!(ln.st!=='off'&&ln.st!=='come'))tn.m2.uniforms.uLI.value=0}}
  sag3(tn,s.pl.sag||0,s.pl.sd||1);
  // 새벽: 천이 밝아짐
  const dk=S.dawnK||0;tn.m2.uniforms.uAmb.value.set(.13+dk*.9,.15+dk*1,.19+dk*1.1)}
// 질주자 (텐트): 밖 장면 그리기 (무너진 텐트 + 폴 + 양옆에서 달려드는 그것). 안에 있을 땐 지퍼 손잡이가 은은히 빛남 (1~3일 차)
function poleVis3(W3,tn,s){const pl=s.pl,T=R3.T,on=pl.st!=='off'&&pl.st!=='done';
  {const gl=on&&pl.st==='down'&&(S.night<=3||DEV.solo)?.5+.5*Math.sin(T_*6):0,m=tn.pull.children[0].material;m.emissive.setRGB(gl*.9,gl*.55,gl*.2)}
  const I0=W3.mons.runT;
  if(!s.out){if(I0)monHide(I0);if(W3.poleG)W3.poleG.visible=false;if(W3.tentX&&!S.cut)W3.tentX.visible=false;return}
  ['lan','wid','stk','shd','axT'].forEach(k=>monHide(W3.mons[k]));W3.lan.intensity=0;if(W3.shdE)W3.shdE.visible=false;tn.axe.visible=false;tn.axS.visible=false;if(W3.lanM)W3.lanM.visible=false;
  tn.g.visible=false;tn.g.updateMatrixWorld();const k=1-pl.p,te=W3.tentX;
  if(te){if(!te.userData.s0){te.userData.s0=te.scale.x;te.userData.r0=te.rotation.clone()}const s0=te.userData.s0,j=pl.hold!=null&&pl.p<1?Math.sin(T_*23)*.006:0;te.visible=true;te.scale.set(s0*(1+.12*k),s0*(1-.58*k+j),s0*(1+.06*k));te.rotation.set(te.userData.r0.x,te.userData.r0.y,te.userData.r0.z+.1*k*pl.sd)}
  if(W3.campBag)W3.campBag.visible=true;
  // 폴: 문 앞에 쓰러져 있다가 세울수록 일어섬
  if(!W3.poleG){const g=new T.Group();W3.sc.add(g);const pm=MS({color:0x4a5058,metalness:.7,roughness:.5,emissive:0x111418});CYL(.013,.013,1.28,pm,0,.64,0,g,8);CYL(.019,.019,.05,MS({color:0x202020}),0,1.26,0,g,8);W3.poleG=g;W3.poleM=pm}
  {const g=W3.poleG,b=tl(0,0,-TB-.04);g.visible=true;g.position.set(b.x,W3.hg(b.x,b.z)+.02,b.z);g.rotation.set(0,W3.tentRy,0);g.rotateZ(pl.sd*lerp(1.45,.03,ease(pl.p)));g.rotateX(.05);
   const gl=(S.night<=3||DEV.solo)&&pl.p<1?.25+.25*Math.sin(T_*5):0;W3.poleM.emissive.setRGB(.06+gl,.06+gl*.9,.07+gl*.7)}
  // 그것: 양옆 어둠에서 달려듦 → 빛을 받으면 미끄러지며 멈추고 달아남
  const c=pl.c,run=c&&(c.st==='come'||c.st==='skid');const I=run?mon3('runT','runner',1):I0;if(!I)return;if(!run){monHide(I);return}
  const cp=R3.cam.position,yv=W3.tentRy+Math.PI+(c.sd<0?1:-1)*PI2,fx=-Math.sin(yv),fz=-Math.cos(yv),tt=T_;let d=c.d,mode='run',kk=0,x,z;
  if(c.st==='skid'){kk=Math.min(1,c.t/.3);d=Math.max(1.3,c.d0-Math.min(c.t,.4)*2.4);mode=c.t<.9?'skid':'run'}
  x=cp.x+fx*d;z=cp.z+fz*d;I.g.visible=true;
  if(c.st==='skid'&&c.t>=.9){const q=c.t-.9;x+=fz*q*6*c.sd;z-=fx*q*6*c.sd;I.g.rotation.set(0,Math.atan2(fz*c.sd,-fx*c.sd),0);monFade(I,Math.max(0,1-q/.8))}
  else{lookYaw(I,x,z);I.g.rotation.x=mode==='run'?Math.sin(tt*15)*.06:-.12*kk;I.g.rotation.z=mode==='run'?Math.sin(tt*11)*.05:0;monFade(I,1)}
  I.g.position.set(x,W3.hg(x,z)+(mode==='run'?Math.abs(Math.sin(tt*15))*.07:0),z);runPose(I,mode,tt,kk)}
// 무너진 텐트 안: 들이받힌 쪽 벽과 지붕이 주저앉아 얼굴 가까이 내려옴 (천 주름)
function sag3(tn,k,sd){const g=tn.geo,pa=g.attributes.position,a=pa.array,b=g.userData.base;
  if(k<=.001){if(tn.sagged){a.set(b);pa.needsUpdate=true;tn.sagged=0;g.attributes.normal.array.set(g.userData.nrm);g.attributes.normal.needsUpdate=true}return}
  if(tn.dented||(tn.sagged&&tn.sagK===k))return;tn.sagK=k;
  for(let i=0;i<b.length/3;i++){const x=b[i*3],y=b[i*3+1],z=b[i*3+2],f=Math.max(0,Math.min(1,.5+x*sd/TA*.55)),h=y/TH,w=Math.sin(z*9+x*5)*.05+Math.sin(z*17-y*7)*.03;
    a[i*3]=x-sd*k*.3*f*f*h;a[i*3+1]=y-k*y*(.1+.4*f*f)*(1+w);a[i*3+2]=z+w*k*.25*h}
  pa.needsUpdate=true;tn.sagged=1;g.computeVertexNormals()}
// 파수꾼 손이 닿은 곳: 손바닥 크기로 천이 안으로 불룩 (잔 모양은 셰이더의 손자국이 맡음)
function dent3(tn,k,sx,lz,cy){const g=tn.geo,pa=g.attributes.position,a=pa.array,b=g.userData.base,nr=g.userData.nrm;
  if(k<=.001){if(tn.dented){a.set(b);pa.needsUpdate=true;tn.dented=0;g.attributes.normal.array.set(nr);g.attributes.normal.needsUpdate=true}return}
  if(!tn.dIdx||tn.dKey!==sx){tn.dKey=sx;tn.dIdx=[];const cxw=sx*tentSideX(.85);for(let i=0;i<b.length/3;i++){const dx=b[i*3]-cxw,dy=b[i*3+1]-.85,dz=b[i*3+2];if(dx*dx+dy*dy+dz*dz<.3)tn.dIdx.push(i)}}
  for(const i of tn.dIdx){const y=b[i*3+1]-cy+.03,zz=b[i*3+2]-lz,d=Math.exp(-(y*y/.006+zz*zz/.004))*.9+Math.exp(-((y-.07)**2/.004+zz*zz/.0025))*.5,m=d*.06*k;a[i*3]=b[i*3]-nr[i*3]*m;a[i*3+1]=b[i*3+1]-nr[i*3+1]*m;a[i*3+2]=b[i*3+2]-nr[i*3+2]*m}
  pa.needsUpdate=true;tn.dented=1;g.computeVertexNormals()}

// ===================== 진행 =====================
function update3(dt){if(S.over){if(F3.bz)buzz3(false);return}if(S.msgT>0)S.msgT-=dt;if(S.shake>0)S.shake-=dt;if(S.flick3>0)S.flick3-=dt;
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
  const hk=s.hd||0;if(hk>.01){const air=S.breath;cx.save();cx.globalAlpha=hk*.18;cx.fillStyle=NPm[ri(4)];cx.fillRect(0,0,W,H);cx.globalAlpha=hk*(.25+.45*(1-air));cx.drawImage(VIG,0,0,W,H);cx.restore()} // 침낭 속 (모양은 3D)
  if(s.pk>.02){const k=ease(s.pk);cx.save();cx.globalAlpha=k*.55;const g=cx.createRadialGradient(W/2,H/2,H*.18,W/2,H/2,H*.8);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'#000');cx.fillStyle=g;cx.fillRect(0,0,W,H);cx.restore()}
  // 양옆 화살표
  if(!s.zip.on&&s.pk<.1&&!S.paused&&(s.hd||0)<.1&&!axOn3()&&!window.TRL&&s.pl.st!=='down'&&s.pl.st!=='exit'&&s.pl.st!=='back'){const zw=navW3();[-1,1].forEach(d=>{const to=S.view+d;if(to<0||to>2)return;const hov=!PT.touch&&PT.x>=0&&((d<0&&PT.x<zw)||(d>0&&PT.x>W-zw)),a=hov?1:PT.touch?.6:.4,x0=d<0?0:W-zw;
    const gr=cx.createLinearGradient(d<0?0:W,0,d<0?zw:W-zw,0);gr.addColorStop(0,`rgba(0,0,0,${.28*a})`);gr.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=gr;cx.fillRect(x0,0,zw,H);
    const cxp=d<0?zw*.4:W-zw*.4,cy=H*.5,s2=Math.min(14,zw*.22);cx.save();cx.strokeStyle=`rgba(236,224,170,${.75*a})`;cx.lineWidth=2;for(let k=0;k<2;k++){const o=k*s2*.9*d,a2=s2*.5;cx.beginPath();cx.moveTo(cxp+o-d*a2,cy-s2);cx.lineTo(cxp+o+d*a2,cy);cx.lineTo(cxp+o-d*a2,cy+s2);cx.stroke()}
    cx.fillStyle=`rgba(236,224,170,${.75*a})`;cx.font=`${Math.max(13,Math.min(16,H*.026))}px 'Galmuri11',monospace`;cx.textAlign='center';cx.textBaseline='top';cx.fillText(VNAME3[to],cxp,cy+s2+10);cx.restore()});
    const want=navZone3(PT)?'pointer':'default';if(cv.style.cursor!==want)cv.style.cursor=want}
  // 처음 안내
  if(S.hintT>0&&!S.paused){const a=Math.min(1,S.hintT/1.5)*.9,fs=Math.max(13,H*.026)*2.4;let y=H*.3;
    [['손에 든 손전등 누르기: 끄기/켜기'],[MOB?'무릎 위 침낭 꾹: 뒤집어쓰고 숨기':'무릎 위 침낭 꾹 (E): 뒤집어쓰고 숨기'],[MOB?'지퍼 꾹: 틈으로 보기':'지퍼 꾹 (Q): 틈으로 보기'],['바닥의 쪽지: 규칙 보기']].forEach(([t])=>{tapeLabel(t,W/2,y,a);y+=fs})}}
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
function chop3(pan,v){thump(95,.09,v,pan);nburst(1800,2,.04,v*.6,pan);nburst(450,1,.12,v*.5,pan,.01,'lowpass')} // 멀리서 도끼로 나무 찍는 소리
function rip3(sd,v){const p=sd*.75;nburst(2600,1.1,.28,v,p);nburst(5200,2,.2,v*.6,p,.04);nburst(900,1,.32,v*.45,p,.02);thump(160,.04,v*.5,p)} // 천 찢어지는 소리
function swing3(sd){const p=sd*.7;nburst(500,.7,.22,.22,p,0,'lowpass');rip3(sd,.36);thump(70,.18,.4,p,.06);sting(p)}
function dragAxe3(sd){const p=sd*.85;nburst(3200,5,.9,.06,p);nburst(1200,3,.9,.04,p,.1);thump(60,.2,.08,p)} // 도끼날을 땅에 끄는 소리
function giggle3(sd){if(!AC)return;const p=sd*.8;for(let k=0;k<6;k++){const f=1500+k*90+rnd(-60,60);nburst(f,6,.07,.08+(k%2)*.03,p,k*.12+rnd(0,.03))}breathe(p,.12)} // 숨죽여 킥킥
function fabric3(pan,v){nburst(1200,.5,.35,v,pan);nburst(400,.8,.25,v*.5,pan,.05,'lowpass')}
// 치트 모드: 챕터 3 날짜·컷씬
for(let n=1;n<=5;n++){const b=document.createElement('button');b.textContent=n+'일';b.onclick=()=>{$('devp').classList.remove('show');go(()=>startGame(n,true,false,3))};$('devN3').appendChild(b)}
[['3 · 인트로',1,'intro'],['3 · 텐트 치기',2,'pitch'],['3 · 숲 끝',5,'exit']].forEach(([t,n,id])=>{const b=document.createElement('button');b.textContent=t;b.onclick=()=>{$('devp').classList.remove('show');go(()=>{DEV.cut3=id;startGame(n,true,false,3)})};$('devCuts').appendChild(b)});
// 치트 무적: 죽음 원인을 치움 (같은 것에 매 프레임 죽지 않게)
function god3(c){const d=S.dr,w=S.wc,cl=S.cl,tn=S.tn;
  if(c==='사슴머리'){d.st='leave';d.lT=0;d.side=1;d.d=Math.max(d.d,6)}else if(c==='나무꾼'&&!tn){w.st='leave';w.lT=0;w.side=1}else if(c==='부르는 것'){cl.st='off';cl.timer=cd3(40);cl.after=3}else if(c==='질주자'&&!tn){S.rc.st='safe';S.rc.t=0;S.rc.d0=Math.max(2,S.rc.d)}
  else if(tn){if(c==='파수꾼'){tn.ln.st='leave';tn.ln.t=0;tn.ln.gk=0;tn.lbad=0;tn.dcd=7}else if(c==='지퍼 여는 것')zipWin3();else if(c==='그림자')tn.sh=0;else if(c==='교대자'){tn.st.stage=0;tn.st.timer=cd3(30);tn.st.bad=0;buzz3(false)}else if(c==='질주자'){const pl=tn.pl;if(pl.st==='down')pl.t=0;else if(pl.c){pl.c.st='skid';pl.c.t=0;pl.c.d0=Math.max(2,pl.c.d||3)}}else if(c==='나무꾼'){tn.ax.st='leave';tn.ax.t=0;tn.ax.stepT=0;tn.ax.sh=0;tn.pxT=0}}}
// ===================== 치트: 괴물 체험 =====================
const SOLO3=k=>!DEV.solo||DEV.solo===k;
const cd3=x=>DEV.solo?Math.max(4,x*.3):x; // 체험 중엔 금방 다시 옴
const PRAC=[ // [챕터, 일차, 키, 이름, 할 일, (챕터3) 텐트에서 시작]
  [1,1,'hum','교대자','형광등 소리가 끊기면 문 잠그기'],[1,2,'gaze','응시자','화면에 얼룩이 커지면 다른 화면으로'],[1,2,'stat','은둔자','무전기가 지직거리면 환풍구 닫기'],
  [1,3,'shadow','그림자','불 끄면 다가옴. 다시 켜기'],[1,3,'run','질주자','창고 문 틈이 벌어지면 닫기'],[1,4,'clone','복제자','화면에 내가 앉아 있으면 신고'],
  [2,1,'hum2','교대자','비상등이 깜빡이는 쪽을 보고 플래시'],[2,2,'drn','익사자','패널 가운데 화면을 자주 보기'],[2,2,'sl','미끄럼틀','손이 보이면 앞을 보고 플래시'],
  [2,3,'dv','잠수부','헤엄치는 소리 → 손전등 끄기'],[2,3,'sh2','그림자','어둠 속 숨소리 → 손전등 켜기'],[2,4,'hm','흥얼이','흥얼거림 → 눈 감기'],
  [3,1,'deer','사슴머리','발소리가 겹치면 뒤돌아보기'],[3,2,'axe','나무꾼 (길)','길로 튀어나오면 바로 멈추기'],[3,3,'caller','부르는 것','뒤에서 불러도 돌아보지 않기'],
  [3,1,'lantern','파수꾼','벽에 손자국 → 무릎 위 침낭 꾹',1],[3,2,'zip','지퍼 여는 것','지퍼가 확 열림 → 닫힐 때까지 연타',1],[3,1,'shadow','그림자','손전등 끄면 다가옴. 다시 켜기',1],
  [3,2,'runner','질주자 (길)','뒤에서 덤불이 부서지면 리본 나무까지 달리기'],[3,2,'pole','질주자 (텐트)','무너지면 나가서 폴 세우기 · 달려오는 쪽에 손전등',1],
  [3,3,'axT','나무꾼 (텐트)','벽 그림자가 멈추면 화면 누르기',1],[3,4,'stalker','교대자','손전등 지직 → 끄기. 소리 그치면 켜기',1]];
{const G=$('pracG');[1,2,3].forEach(ch=>{const col=document.createElement('div');col.innerHTML=`<div class="dvh">챕터 ${ch} · ${['','경비실','수영장','숲'][ch]}</div>`;const box=document.createElement('div');box.className='dvb';col.appendChild(box);G.appendChild(col);
  PRAC.filter(x=>x[0]===ch).forEach(([c,n,k,name,tip,tent])=>{const b=document.createElement('button');b.innerHTML=`${name}<small>${tip}</small>`;b.onclick=()=>{$('pracp').classList.remove('show');$('devp').classList.remove('show');DEV.soloNext=k;DEV.pracTip=name+': '+tip;DEV.ph3=tent?'tent':null;go(()=>startGame(n,true,false,c))};box.appendChild(b)})})}
$('devPrac').onclick=()=>{$('devp').classList.remove('show');$('pracp').classList.add('show')};$('pracBack').onclick=()=>{$('pracp').classList.remove('show');$('devp').classList.add('show')};
// 체험 시작: 고른 괴물이 금방 나오게
function pracInit(){const k=DEV.solo;if(!k||!S)return;
  if(S.ch===1){if(k==='hum')S.hum.timer=2;else if(k==='gaze'){S.gaze.timer=1}else if(k==='stat')S.stat.timer=2;else if(k==='run')S.run.cd=2;else if(k==='clone')S.clone.timer=3}
  else if(S.ch===2){if(k==='hum2')S.hum.timer=1;else if(k==='dv')S.dv.timer=2;else if(k==='sl')S.sl.timer=2;else if(k==='hm')S.hm.timer=1}
  else if(S.ch===3){if(k==='deer')S.dr.timer=2;else if(k==='axe')S.wc.timer=2;else if(k==='caller')S.cl.timer=3;else if(k==='runner'){S.rc.st='off';S.rc.timer=3}else if(S.tn){const t=S.tn;if(k==='lantern')t.ln.timer=2;else if(k==='zip')t.zip.timer=3;else if(k==='stalker')t.st.timer=2;else if(k==='axT')t.ax.timer=3;else if(k==='pole')t.pl.timer=3}}
  if(DEV.pracTip){const tp=DEV.pracTip;setTimeout(()=>{if(S&&!S.over)say('[체험] '+tp,'',4)},900)}}
