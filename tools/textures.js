// 맵 텍스처 생성기. tools/textures.html 을 열면 img/tex 에 넣을 jpg 를 만들어 내려받을 수 있음
// 게임은 미리 만든 jpg 를 불러오므로, 텍스처를 바꿀 때만 이 파일을 고친 뒤 다시 생성하면 됨
function mk(w,h){const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w));c.height=Math.max(1,Math.round(h));return c}
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
// 이어 붙여도 티 안 나는 값 노이즈(fBm). bx,by = 가로·세로 격자 수
function lat(seed,n){const r=mulberry(seed),G=new Float32Array(n);for(let i=0;i<n;i++)G[i]=r();return G}
function FBM(seed,bx,by,oct,gain=.5){const L=[];for(let o=0;o<oct;o++){const px=bx<<o,py=by<<o;L.push([lat(seed+o*977,px*py),px,py])}
  return(x,y)=>{let s=0,a=1,t=0;for(let k=0;k<L.length;k++){const G=L[k][0],px=L[k][1],py=L[k][2],X=x*px,Y=y*py,xi=Math.floor(X),yi=Math.floor(Y);let xf=X-xi,yf=Y-yi;const x0=((xi%px)+px)%px,y0=((yi%py)+py)%py,x1=(x0+1)%px,y1=(y0+1)%py;xf=xf*xf*(3-2*xf);yf=yf*yf*(3-2*yf);const A=G[y0*px+x0],B=G[y0*px+x1],C=G[y1*px+x0],D=G[y1*px+x1];s+=(A+(B-A)*xf+(C-A)*yf+(A-B-C+D)*xf*yf)*a;t+=a;a*=gain}return s/t}}
const gau=x=>Math.exp(-x*x);
const sstep=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
const mixc=(o,r,g,b,t)=>{o[0]+=(r-o[0])*t;o[1]+=(g-o[1])*t;o[2]+=(b-o[2])*t};
// fn(u,v,out) → out=[r,g,b,높이]. 높이 차이로 위(왼쪽 위)에서 빛을 받은 요철 음영을 만듦
function makeTex(w,h,fn,bump=2){
  const c=mk(w,h),g=c.getContext('2d'),id=g.createImageData(w,h),p=id.data,H=new Float32Array(w*h),o=[0,0,0,0];
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){fn(x/w,y/h,o);const i=y*w+x;p[i*4]=o[0];p[i*4+1]=o[1];p[i*4+2]=o[2];H[i]=o[3]}
  for(let y=0;y<h;y++){const yu=((y+h-1)%h)*w,yd=((y+1)%h)*w,yc=y*w;for(let x=0;x<w;x++){const i=yc+x,sh=1+((H[yc+(x+w-1)%w]-H[yc+(x+1)%w])*.7+(H[yu+x]-H[yd+x]))*bump;p[i*4]*=sh;p[i*4+1]*=sh;p[i*4+2]*=sh;p[i*4+3]=255}}
  g.putImageData(id,0,0);return c}

// 벽지 1536x1024: 세로 = 벽 전체 높이(위=천장, 아래=바닥), 가로는 벽지 6폭
// 백룸의 단색 노란 줄무늬 벽지. 대체로 깨끗하고, 물이 샌 곳(넓은 얼룩 영역)에만 얼룩·흘러내림·곰팡이
function makeWall(){
  const W=1536,H=1024,R=mulberry(7),big=FBM(70,9,6,5),st=FBM(71,6,4,5),drip=FBM(72,108,2,3),mold=FBM(73,120,80,3),pap=FBM(74,384,256,2),dmg=FBM(78,4,3,4);
  return makeTex(W,H,(u,v,o)=>{
    const col=Math.floor(u*24),su=(u*24)%1,sv=(v*16)%1,ds=Math.abs(su-.5)*1.4+Math.abs(sv-.5);
    let pr=(col&1)?5:0;if(su<.025||su>.975)pr-=9;if(!(col&1)&&ds>.085&&ds<.13)pr+=6; // 밝고 어두운 줄이 번갈아, 어두운 줄에만 작은 마름모
    const k=.93+big(u,v)*.14;
    o[0]=(204+pr)*k;o[1]=(184+pr)*k;o[2]=(102+pr*.5)*k;
    const m=sstep(.55,.75,dmg(u,v)); // 물이 샌 곳
    const s=st(u,v),stain=sstep(.6,.68,s)*m,ring=gau((s-.68)/.016)*m;
    mixc(o,150,122,58,stain*.3);const rk=1-ring*.14;o[0]*=rk;o[1]*=rk;o[2]*=rk*.95;
    const d=drip(u,v),dk=1-sstep(.55,.8,d)*(1-v)*.22*m;o[0]*=dk;o[1]*=dk;o[2]*=dk*.94;
    if(v>.9)mixc(o,70,64,30,sstep(.6,.78,mold(u,v))*m*.25);
    const kk=(1-sstep(.1,0,v)*.12)*(1-sstep(.85,1,v)*.25);o[0]*=kk;o[1]*=kk;o[2]*=kk; // 천장 쪽 누렇게, 바닥 쪽 때
    const seam=(u*6)%1,sd=Math.min(seam,1-seam)*W/6;
    if(sd<1.2){o[0]*=.85;o[1]*=.85;o[2]*=.85}else if(sd<4&&m>.7)mixc(o,228,216,172,.7); // 이음새, 젖은 곳은 들떠서 뒷종이가 보임
    const n=(R()-.5)*12;o[0]+=n;o[1]+=n;o[2]+=n;
    o[3]=pap(u,v)*.18+ring*.2+(sd<2?.4:0);
  },1.2);
}
// 카펫 1536x512 (가로·세로 반복): 축축한 베이지빛 노란 카펫, 젖은 얼룩과 마른 테두리, 닳은 자국
function makeCarpet(){
  const R=mulberry(11),big=FBM(80,12,4,5),wet=FBM(81,9,3,5),fib=FBM(82,480,160,2),wear=FBM(83,6,2,4),damp=FBM(84,5,2,4);
  return makeTex(1536,512,(u,v,o)=>{
    const f=fib(u,v)*.7+R()*.5,k=(.84+big(u,v)*.26)*(1-sstep(.55,.75,wear(u,v))*.1);
    o[0]=(122+f*30)*k;o[1]=(106+f*26)*k;o[2]=(60+f*14)*k;
    mixc(o,96,82,44,sstep(.45,.6,damp(u,v))*.35);
    const w=wet(u,v),wa=sstep(.6,.7,w),rim=gau((w-.71)/.012);mixc(o,70,58,30,wa*.6);o[0]+=rim*18;o[1]+=rim*15;o[2]+=rim*7;
    o[3]=f*1.2-wa*.3;
  },1.6);
}
// 천장 1536x512: 128px 크림색 석고 텍스 타일, 핀홀, T자 철제 틀, 가끔 물 먹은 타일
function makeCeil(){
  const R=mulberry(13),fis=FBM(90,72,24,3),st=FBM(91,9,3,5),big=FBM(92,12,4,4),T=128,hr=mulberry(5),stainy=Array.from({length:48},()=>hr()<.18);
  return makeTex(1536,512,(u,v,o)=>{
    const x=u*1536,y=v*512,gx=x%T,gy=y%T,ti=Math.floor(x/T)+Math.floor(y/T)*12;
    if(gx<5||gy<5){const l=(gx<1.5||gy<1.5)?1.15:(gx>3.5&&gx<5)||(gy>3.5&&gy<5)?.65:1;o[0]=168*l;o[1]=160*l;o[2]=128*l;o[3]=2;return}
    const f=fis(u,v),k=.9+big(u,v)*.16-sstep(.62,.7,f)*.1;
    o[0]=212*k;o[1]=202*k;o[2]=162*k;
    if(R()<.012){o[0]*=.6;o[1]*=.6;o[2]*=.6}
    const ed=Math.min(gx-5,gy-5,T-gx,T-gy);if(ed<6){const e=.84+ed/36;o[0]*=e;o[1]*=e;o[2]*=e}
    if(stainy[ti]){const s=st(u,v),sa=sstep(.5,.62,s),ring=gau((s-.625)/.01);mixc(o,150,118,60,sa*.45);o[0]*=1-ring*.3;o[1]*=1-ring*.33;o[2]*=1-ring*.37}
    o[3]=f*.8+(R()-.5)*.15;
  },1.8);
}
function makeWood(){
  const R=mulberry(17),warp=FBM(100,3,6,4),fine=FBM(101,4,240,2),big=FBM(102,3,3,4);
  return makeTex(1024,1024,(u,v,o)=>{
    const vv=v*14+warp(u,v)*3.2,ring=.5+.5*Math.sin(vv*Math.PI*2),f=fine(u,v),k=.78+big(u,v)*.35;
    o[0]=(52+ring*26+f*16)*k;o[1]=(34+ring*16+f*10)*k;o[2]=(20+ring*9+f*6)*k;
    const n=(R()-.5)*6;o[0]+=n;o[1]+=n;o[2]+=n;o[3]=ring*.4+f*.6;
  },1.4);
}
// 도장된 강철: 결 방향 헤어라인, 작게 벗겨진 도장, 녹 번짐과 녹물, 긁힌 자국
function makeMetal(base,seed){
  const S=1024,R=mulberry(seed),br=FBM(seed,2,160,3),rust=FBM(seed+1,4,4,5),pit=FBM(seed+2,48,48,2),gr=FBM(seed+3,3,3,4),chip=FBM(seed+4,32,32,3);
  const c=makeTex(S,S,(u,v,o)=>{
    const k=(.86+br(u,v)*.22)*(.78+gr(u,v)*.3);o[0]=base[0]*k;o[1]=base[1]*k;o[2]=base[2]*k;
    const ch=sstep(.785,.795,chip(u,v));mixc(o,40,36,30,ch*.7);
    const ra=sstep(.64,.76,rust(u,v)),p=pit(u,v);mixc(o,96+p*40,50+p*18,24,ra*.85);
    const n=(R()-.5)*8;o[0]+=n;o[1]+=n;o[2]+=n;o[3]=br(u,v)*.25+ra*p*1.2-ch*.2;
  },1.6),g=c.getContext('2d'),r=mulberry(seed+9);
  g.lineCap='round';for(let i=0;i<160;i++){const x=r()*S,y=r()*S,l=14+r()*120,a=(r()-.5)*.5;g.strokeStyle=`rgba(${r()<.5?'230,230,220':'10,10,8'},${.05+r()*.12})`;g.lineWidth=.6+r()*1.2;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);g.stroke()}
  for(let i=0;i<16;i++){const x=r()*S,y=r()*S,len=60+r()*260,gg=g.createLinearGradient(0,y,0,y+len);gg.addColorStop(0,'rgba(100,48,18,.45)');gg.addColorStop(1,'rgba(100,48,18,0)');g.fillStyle=gg;g.fillRect(x,y,2+r()*4,len)}
  return c}
// 콘크리트 1024x1024: 기계실·복도 바닥용 거푸집 자국, 기공, 균열
function makeConcrete(){
  const R=mulberry(29),big=FBM(110,4,4,5),fine=FBM(111,96,96,3),crack=FBM(112,10,10,4),stain=FBM(113,3,3,5);
  return makeTex(1024,1024,(u,v,o)=>{
    const k=.78+big(u,v)*.35,f=fine(u,v);o[0]=(120+f*30)*k;o[1]=(116+f*28)*k;o[2]=(104+f*24)*k;
    const s=sstep(.58,.7,stain(u,v));mixc(o,58,52,40,s*.6);
    const c=gau((crack(u,v)-.5)/.006)*sstep(.4,.7,big(u,v));o[0]*=1-c*.6;o[1]*=1-c*.6;o[2]*=1-c*.6;
    if(R()<.004){o[0]*=.5;o[1]*=.5;o[2]*=.5}
    const n=(R()-.5)*10;o[0]+=n;o[1]+=n;o[2]+=n;o[3]=f*.6-c*.8;
  },1.8);
}
function buildAllTextures(){return{wall:makeWall(),carpet:makeCarpet(),ceil:makeCeil(),wood:makeWood(),metal:makeMetal([70,78,72],19),metal2:makeMetal([92,94,86],23),concrete:makeConcrete()}}
