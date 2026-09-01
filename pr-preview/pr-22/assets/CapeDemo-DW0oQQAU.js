const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/WebGpuRenderPipeline-CTV597na.js","assets/three.tsl-C7o02keG.js","assets/three.webgpu-BWV4PpD4.js","assets/three.core-ChQ02iEs.js","assets/WebGpuTorchSystem-NCsXtZIS.js","assets/CapeSimulation-jOrj3-u6.js","assets/WebGpuWaterSystem-De3PJANG.js","assets/WebGpuCaveAtmosphere-CMhLr3uh.js","assets/GpuCapeSimulation-DyR8jrWn.js","assets/WebGpuCinematicLighting-B94Tj0Mz.js"])))=>i.map(i=>d[i]);
import{t as e}from"./index-iPUK8Nun.js";import{$i as t,$r as n,$s as r,As as i,At as a,B as o,Bt as s,Co as c,Dr as l,Ds as u,Fo as d,Fr as f,Fs as p,Gi as m,Gn as h,Gs as g,Hs as _,Ht as v,I as y,Is as b,J as x,Jr as S,Kr as C,Li as w,Mr as T,Ms as E,Mt as D,Nn as O,Nr as k,Nt as ee,Pi as A,Pn as te,Ps as j,Pt as M,Q as ne,Qr as re,Qs as N,Qt as ie,R as ae,So as oe,Ts as se,Us as ce,V as P,Vt as le,Wt as F,Xi as I,Y as ue,Yi as de,Yr as fe,Zi as pe,Zr as L,_i as me,_r as he,ai as R,as as ge,ba as _e,bo as ve,cc as ye,cn as be,cs as xe,ct as Se,d as Ce,dc as we,do as Te,ec as Ee,ei as De,eo as Oe,et as z,ft as ke,gi as Ae,gn as je,gs as B,gt as Me,ic as Ne,jn as V,jr as Pe,js as Fe,ks as Ie,li as H,ln as Le,lo as U,ma as W,mn as Re,mo as ze,na as Be,nc as Ve,no as He,nt as Ue,oc as We,oi as Ge,pi as Ke,pn as qe,pt as Je,qt as Ye,sc as G,sn as Xe,so as Ze,ta as Qe,tc as K,ti as $e,to as et,ua as tt,uc as q,ur as nt,us as rt,vs as it,ws as at,xa as ot,xo as st,y as ct,yn as lt,ys as ut,zo as dt}from"./three.core-ChQ02iEs.js";import{$ as ft,B as pt,F as mt,G as ht,H as gt,I as _t,J as vt,L as yt,M as bt,N as xt,O as St,Q as Ct,U as wt,V as Tt,W as Et,X as Dt,Y as Ot,Z as kt,_ as At,et as J,g as jt,it as Y,k as Mt,n as Nt,nt as Pt,q as Ft,rt as It,t as Lt,tt as Rt,v as zt,z as Bt}from"./CapeSimulation-jOrj3-u6.js";import{browserRendererStartupRecovery as Vt}from"./RendererStartupRecovery-Dpit0Jv3.js";import{LoadingScreen as Ht,a as X,i as Ut,n as Wt,r as Gt,t as Kt}from"./LoadingScreen-BxSItED5.js";function qt(){let e=null,t=!1,n=null,r=null;function i(t,a){n(t,a),r=e.requestAnimationFrame(i)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Jt(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var Z={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},Q={common:{diffuse:{value:new z(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new S},alphaMap:{value:null},alphaMapTransform:{value:new S},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new S}},envmap:{envMap:{value:null},envMapRotation:{value:new S},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new S}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new S}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new S},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new S},normalScale:{value:new j(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new S},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new S}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new S}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new S}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new z(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new p},probesMax:{value:new p},probesResolution:{value:new p}},points:{diffuse:{value:new z(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new S},alphaTest:{value:0},uvTransform:{value:new S}},sprite:{diffuse:{value:new z(16777215)},opacity:{value:1},center:{value:new j(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new S},alphaMap:{value:null},alphaMapTransform:{value:new S},alphaTest:{value:0}}},Yt={basic:{uniforms:G([Q.common,Q.specularmap,Q.envmap,Q.aomap,Q.lightmap,Q.fog]),vertexShader:Z.meshbasic_vert,fragmentShader:Z.meshbasic_frag},lambert:{uniforms:G([Q.common,Q.specularmap,Q.envmap,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.fog,Q.lights,{emissive:{value:new z(0)},envMapIntensity:{value:1}}]),vertexShader:Z.meshlambert_vert,fragmentShader:Z.meshlambert_frag},phong:{uniforms:G([Q.common,Q.specularmap,Q.envmap,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.fog,Q.lights,{emissive:{value:new z(0)},specular:{value:new z(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Z.meshphong_vert,fragmentShader:Z.meshphong_frag},standard:{uniforms:G([Q.common,Q.envmap,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.roughnessmap,Q.metalnessmap,Q.fog,Q.lights,{emissive:{value:new z(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Z.meshphysical_vert,fragmentShader:Z.meshphysical_frag},toon:{uniforms:G([Q.common,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.gradientmap,Q.fog,Q.lights,{emissive:{value:new z(0)}}]),vertexShader:Z.meshtoon_vert,fragmentShader:Z.meshtoon_frag},matcap:{uniforms:G([Q.common,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.fog,{matcap:{value:null}}]),vertexShader:Z.meshmatcap_vert,fragmentShader:Z.meshmatcap_frag},points:{uniforms:G([Q.points,Q.fog]),vertexShader:Z.points_vert,fragmentShader:Z.points_frag},dashed:{uniforms:G([Q.common,Q.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Z.linedashed_vert,fragmentShader:Z.linedashed_frag},depth:{uniforms:G([Q.common,Q.displacementmap]),vertexShader:Z.depth_vert,fragmentShader:Z.depth_frag},normal:{uniforms:G([Q.common,Q.bumpmap,Q.normalmap,Q.displacementmap,{opacity:{value:1}}]),vertexShader:Z.meshnormal_vert,fragmentShader:Z.meshnormal_frag},sprite:{uniforms:G([Q.sprite,Q.fog]),vertexShader:Z.sprite_vert,fragmentShader:Z.sprite_frag},background:{uniforms:{uvTransform:{value:new S},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Z.background_vert,fragmentShader:Z.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new S}},vertexShader:Z.backgroundCube_vert,fragmentShader:Z.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Z.cube_vert,fragmentShader:Z.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Z.equirect_vert,fragmentShader:Z.equirect_frag},distance:{uniforms:G([Q.common,Q.displacementmap,{referencePosition:{value:new p},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Z.distance_vert,fragmentShader:Z.distance_frag},shadow:{uniforms:G([Q.lights,Q.fog,{color:{value:new z(0)},opacity:{value:1}}]),vertexShader:Z.shadow_vert,fragmentShader:Z.shadow_frag}};Yt.physical={uniforms:G([Yt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new S},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new S},clearcoatNormalScale:{value:new j(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new S},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new S},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new S},sheen:{value:0},sheenColor:{value:new z(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new S},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new S},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new S},transmissionSamplerSize:{value:new j},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new S},attenuationDistance:{value:0},attenuationColor:{value:new z(0)},specularColor:{value:new z(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new S},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new S},anisotropyVector:{value:new j},anisotropyMap:{value:null},anisotropyMapTransform:{value:new S}}]),vertexShader:Z.meshphysical_vert,fragmentShader:Z.meshphysical_frag};var Xt={r:0,b:0,g:0},Zt=new fe,Qt=new S;Qt.set(-1,0,0,0,1,0,0,0,1);function $t(e,t,n,r,i,a){let o=new z(0),s=i===!0?0:1,l,u,d=null,f=0,p=null;function m(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function h(t){let r=!1,i=m(t);i===null?_(o,s):i&&i.isColor&&(_(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function g(t,n){let i=m(n);i&&(i.isCubeTexture||i.mapping===306)?(u===void 0&&(u=new L(new ae(1,1,1),new c({name:`BackgroundCubeMaterial`,uniforms:N(Yt.backgroundCube.uniforms),vertexShader:Yt.backgroundCube.vertexShader,fragmentShader:Yt.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute(`normal`),u.geometry.deleteAttribute(`uv`),u.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),u.material.uniforms.envMap.value=i,u.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Zt.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&u.material.uniforms.backgroundRotation.value.premultiply(Qt),u.material.toneMapped=Ue.getTransfer(i.colorSpace)!==st,(d!==i||f!==i.version||p!==e.toneMapping)&&(u.material.needsUpdate=!0,d=i,f=i.version,p=e.toneMapping),u.layers.enableAll(),t.unshift(u,u.geometry,u.material,0,0,null)):i&&i.isTexture&&(l===void 0&&(l=new L(new pe(2,2),new c({name:`BackgroundMaterial`,uniforms:N(Yt.background.uniforms),vertexShader:Yt.background.vertexShader,fragmentShader:Yt.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=i,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.toneMapped=Ue.getTransfer(i.colorSpace)!==st,i.matrixAutoUpdate===!0&&i.updateMatrix(),l.material.uniforms.uvTransform.value.copy(i.matrix),(d!==i||f!==i.version||p!==e.toneMapping)&&(l.material.needsUpdate=!0,d=i,f=i.version,p=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null))}function _(t,r){t.getRGB(Xt,Ne(e)),n.buffers.color.setClear(Xt.r,Xt.g,Xt.b,r,a)}function v(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,_(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,_(o,s)},render:h,addToRenderList:g,dispose:v}}function en(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function tn(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function nn(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&n!==1015&&!i)}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(q(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&q(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function rn(e){let t=this,n=null,r=0,i=!1,a=!1,o=new I,s=new S,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var an=4,on=[.125,.215,.35,.446,.526,.582],sn=20,cn=256,ln=new m,un=new z,dn=null,fn=0,pn=0,mn=!1,hn=new p,gn=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=hn}=i;dn=this._renderer.getRenderTarget(),fn=this._renderer.getActiveCubeFace(),pn=this._renderer.getActiveMipmapLevel(),mn=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Cn(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Sn(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(dn,fn,pn),this._renderer.xr.enabled=mn,e.scissorTest=!1,yn(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),dn=this._renderer.getRenderTarget(),fn=this._renderer.getActiveCubeFace(),pn=this._renderer.getActiveMipmapLevel(),mn=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:l,minFilter:l,generateMipmaps:!1,type:O,format:_e,colorSpace:k,depthBuffer:!1},r=vn(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=vn(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=_n(r)),this._blurMaterial=xn(r,e,t),this._ggxMaterial=bn(r,e,t)}return r}_compileMaterial(e){let t=new L(new P,e);this._renderer.compile(t,ln)}_sceneToCubeUV(e,t,n,r,i){let a=new de(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(un),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new L(new ae,new re({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(un),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;yn(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Cn()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Sn());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;yn(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,ln)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(0+c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-an?n-d+an:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,yn(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,ln),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,yn(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,ln)}_blur(e,t,n,r,i){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,`latitudinal`,i),this._halfBlur(a,e,n,n,r,`longitudinal`,i)}_halfBlur(e,t,n,r,i,a,o){let s=this._renderer,c=this._blurMaterial;a!==`latitudinal`&&a!==`longitudinal`&&K(`blur direction must be either latitudinal or longitudinal!`);let l=this._lodMeshes[r];l.material=c;let u=c.uniforms,d=this._sizeLods[n]-1,f=isFinite(i)?Math.PI/(2*d):2*Math.PI/39,p=i/f,m=isFinite(i)?1+Math.floor(3*p):sn;m>sn&&q(`sigmaRadians, ${i}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${sn}`);let h=[],g=0;for(let e=0;e<sn;++e){let t=e/p,n=Math.exp(-t*t/2);h.push(n),e===0?g+=n:e<m&&(g+=2*n)}for(let e=0;e<h.length;e++)h[e]=h[e]/g;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=h,u.latitudinal.value=a===`latitudinal`,o&&(u.poleAxis.value=o);let{_lodMax:_}=this;u.dTheta.value=f,u.mipInt.value=_-n;let v=this._sizeLods[r];yn(t,3*v*(r>_-an?r-_+an:0),4*(this._cubeSize-v),3*v,2*v),s.setRenderTarget(t),s.render(l,ln)}};function _n(e){let t=[],n=[],r=[],i=e,a=e-an+1+on.length;for(let s=0;s<a;s++){let a=2**i;t.push(a);let c=1/a;s>e-an?c=on[s-e+an-1]:s===0&&(c=0),n.push(c);let l=1/(a-2),u=-l,d=1+l,f=[u,u,d,u,d,d,u,u,d,d,u,d],p=new Float32Array(108),m=new Float32Array(72),h=new Float32Array(36);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];p.set(r,18*e),m.set(f,12*e);let i=[e,e,e,e,e,e];h.set(i,6*e)}let g=new P;g.setAttribute(`position`,new o(p,3)),g.setAttribute(`uv`,new o(m,2)),g.setAttribute(`faceIndex`,new o(h,1)),r.push(new L(g,null)),i>an&&i--}return{lodMeshes:r,sizeLods:t,sigmas:n}}function vn(e,t,n){let r=new ce(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function yn(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function bn(e,t,n){return new c({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:cn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:wn(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function xn(e,t,n){let r=new Float32Array(sn),i=new p(0,1,0);return new c({name:`SphericalGaussianBlur`,defines:{n:sn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:wn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Sn(){return new c({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:wn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Cn(){return new c({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:wn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function wn(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}var Tn=class extends ce{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Me(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new ae(5,5,5),i=new c({name:`CubemapFromEquirect`,uniforms:N(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new L(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=l),new ke(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function En(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new Tn(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new gn(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new gn(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function Dn(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&we(`WebGLRenderer: `+e+` extension not supported.`),t}}}function On(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0?t:(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++,t)}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?ut:it)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function kn(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function An(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:K(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function jn(e,t,n){let r=new WeakMap,i=new b;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new ee(h,p,m,u);g.type=Re,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new j(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function Mn(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var Nn={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function Pn(e,t,n,r,i,a){let o=new ce(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,depthTexture:i?new v(t,n):void 0}),s=new ce(t,n,{type:O,depthBuffer:!1,stencilBuffer:!1}),c=new P;c.setAttribute(`position`,new qe([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute(`uv`,new qe([0,2,0,0,2,0],2));let l=new He({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new L(c,l),d=new m(-1,1,1,-1,0,1),f=null,p=null,h=!1,g,_=null,y=[],b=!1;this.setSize=function(e,t){o.setSize(e,t),s.setSize(e,t);for(let n=0;n<y.length;n++){let r=y[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){y=e,b=y.length>0&&y[0].isRenderPass===!0;let t=o.width,n=o.height;for(let e=0;e<y.length;e++){let r=y[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(h||e.toneMapping===0&&y.length===0)return!1;if(_=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return b===!1&&e.setRenderTarget(o),g=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return b},this.end=function(e,t){e.toneMapping=g,h=!0;let n=o,r=s;for(let i=0;i<y.length;i++){let a=y[i];if(a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1)){let e=n;n=r,r=e}}if(f!==e.outputColorSpace||p!==e.toneMapping){f=e.outputColorSpace,p=e.toneMapping,l.defines={},Ue.getTransfer(f)===`srgb`&&(l.defines.SRGB_TRANSFER=``);let t=Nn[p];t&&(l.defines[t]=``),l.needsUpdate=!0}l.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(_),e.render(u,d),_=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){o.depthTexture&&o.depthTexture.dispose(),o.dispose(),s.dispose(),c.dispose(),l.dispose()}}var Fn=new ge,In=new v(1,1),Ln=new ee,Rn=new D,zn=new Me,Bn=[],Vn=[],Hn=new Float32Array(16),Un=new Float32Array(9),Wn=new Float32Array(4);function Gn(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Bn[i];if(a===void 0&&(a=new Float32Array(i),Bn[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Kn(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function qn(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Jn(e,t){let n=Vn[t];n===void 0&&(n=new Int32Array(t),Vn[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Yn(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Xn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Kn(n,t))return;e.uniform2fv(this.addr,t),qn(n,t)}}function Zn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Kn(n,t))return;e.uniform3fv(this.addr,t),qn(n,t)}}function Qn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Kn(n,t))return;e.uniform4fv(this.addr,t),qn(n,t)}}function $n(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Kn(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),qn(n,t)}else{if(Kn(n,r))return;Wn.set(r),e.uniformMatrix2fv(this.addr,!1,Wn),qn(n,r)}}function er(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Kn(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),qn(n,t)}else{if(Kn(n,r))return;Un.set(r),e.uniformMatrix3fv(this.addr,!1,Un),qn(n,r)}}function tr(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Kn(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),qn(n,t)}else{if(Kn(n,r))return;Hn.set(r),e.uniformMatrix4fv(this.addr,!1,Hn),qn(n,r)}}function nr(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function rr(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Kn(n,t))return;e.uniform2iv(this.addr,t),qn(n,t)}}function ir(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Kn(n,t))return;e.uniform3iv(this.addr,t),qn(n,t)}}function ar(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Kn(n,t))return;e.uniform4iv(this.addr,t),qn(n,t)}}function or(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function sr(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Kn(n,t))return;e.uniform2uiv(this.addr,t),qn(n,t)}}function cr(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Kn(n,t))return;e.uniform3uiv(this.addr,t),qn(n,t)}}function lr(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Kn(n,t))return;e.uniform4uiv(this.addr,t),qn(n,t)}}function ur(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(In.compareFunction=n.isReversedDepthBuffer()?518:515,a=In):a=Fn,n.setTexture2D(t||a,i)}function dr(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Rn,i)}function fr(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||zn,i)}function pr(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||Ln,i)}function mr(e){switch(e){case 5126:return Yn;case 35664:return Xn;case 35665:return Zn;case 35666:return Qn;case 35674:return $n;case 35675:return er;case 35676:return tr;case 5124:case 35670:return nr;case 35667:case 35671:return rr;case 35668:case 35672:return ir;case 35669:case 35673:return ar;case 5125:return or;case 36294:return sr;case 36295:return cr;case 36296:return lr;case 35678:case 36198:case 36298:case 36306:case 35682:return ur;case 35679:case 36299:case 36307:return dr;case 35680:case 36300:case 36308:case 36293:return fr;case 36289:case 36303:case 36311:case 36292:return pr}}function hr(e,t){e.uniform1fv(this.addr,t)}function gr(e,t){let n=Gn(t,this.size,2);e.uniform2fv(this.addr,n)}function _r(e,t){let n=Gn(t,this.size,3);e.uniform3fv(this.addr,n)}function vr(e,t){let n=Gn(t,this.size,4);e.uniform4fv(this.addr,n)}function yr(e,t){let n=Gn(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function br(e,t){let n=Gn(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function xr(e,t){let n=Gn(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function Sr(e,t){e.uniform1iv(this.addr,t)}function Cr(e,t){e.uniform2iv(this.addr,t)}function wr(e,t){e.uniform3iv(this.addr,t)}function Tr(e,t){e.uniform4iv(this.addr,t)}function Er(e,t){e.uniform1uiv(this.addr,t)}function Dr(e,t){e.uniform2uiv(this.addr,t)}function Or(e,t){e.uniform3uiv(this.addr,t)}function kr(e,t){e.uniform4uiv(this.addr,t)}function Ar(e,t,n){let r=this.cache,i=t.length,a=Jn(n,i);Kn(r,a)||(e.uniform1iv(this.addr,a),qn(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?In:Fn;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function jr(e,t,n){let r=this.cache,i=t.length,a=Jn(n,i);Kn(r,a)||(e.uniform1iv(this.addr,a),qn(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Rn,a[e])}function Mr(e,t,n){let r=this.cache,i=t.length,a=Jn(n,i);Kn(r,a)||(e.uniform1iv(this.addr,a),qn(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||zn,a[e])}function Nr(e,t,n){let r=this.cache,i=t.length,a=Jn(n,i);Kn(r,a)||(e.uniform1iv(this.addr,a),qn(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||Ln,a[e])}function Pr(e){switch(e){case 5126:return hr;case 35664:return gr;case 35665:return _r;case 35666:return vr;case 35674:return yr;case 35675:return br;case 35676:return xr;case 5124:case 35670:return Sr;case 35667:case 35671:return Cr;case 35668:case 35672:return wr;case 35669:case 35673:return Tr;case 5125:return Er;case 36294:return Dr;case 36295:return Or;case 36296:return kr;case 35678:case 36198:case 36298:case 36306:case 35682:return Ar;case 35679:case 36299:case 36307:return jr;case 35680:case 36300:case 36308:case 36293:return Mr;case 36289:case 36303:case 36311:case 36292:return Nr}}var Fr=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=mr(t.type)}},Ir=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Pr(t.type)}},Lr=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Rr=/(\w+)(\])?(\[|\.)?/g;function zr(e,t){e.seq.push(t),e.map[t.id]=t}function Br(e,t,n){let r=e.name,i=r.length;for(Rr.lastIndex=0;;){let a=Rr.exec(r),o=Rr.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){zr(n,l===void 0?new Fr(s,e,t):new Ir(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new Lr(s),zr(n,e)),n=e}}}var Vr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Br(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Hr(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Ur=37297,Wr=0;function Gr(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Kr=new S;function qr(e){Ue._getMatrix(Kr,Ue.workingColorSpace,e);let t=`mat3( ${Kr.elements.map(e=>e.toFixed(4))} )`;switch(Ue.getTransfer(e)){case f:return[t,`LinearTransferOETF`];case st:return[t,`sRGBTransferOETF`];default:return q(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Jr(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Gr(e.getShaderSource(t),r)}return i}function Yr(e,t){let n=qr(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var Xr={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Zr(e,t){let n=Xr[t];return n===void 0?(q(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Qr=new p;function $r(){return Ue.getLuminanceCoefficients(Qr),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Qr.x.toFixed(4)}, ${Qr.y.toFixed(4)}, ${Qr.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function ei(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(ri).join(`
`)}function ti(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function ni(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function ri(e){return e!==``}function ii(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function ai(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var oi=/^[ \t]*#include +<([\w\d./]+)>/gm;function si(e){return e.replace(oi,li)}var ci=new Map;function li(e,t){let n=Z[t];if(n===void 0){let e=ci.get(t);if(e!==void 0)n=Z[e],q(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return si(n)}var ui=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function di(e){return e.replace(ui,fi)}function fi(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function pi(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var mi={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function hi(e){return mi[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var gi={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function _i(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:gi[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var vi={302:`ENVMAP_MODE_REFRACTION`};function yi(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:vi[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var bi={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function xi(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:bi[e.combine]||`ENVMAP_BLENDING_NONE`}function Si(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function Ci(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=hi(n),l=_i(n),u=yi(n),d=xi(n),f=Si(n),p=ei(n),m=ti(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(ri).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(ri).join(`
`),_.length>0&&(_+=`
`)):(g=[pi(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(ri).join(`
`),_=[pi(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:Z.tonemapping_pars_fragment,n.toneMapping===0?``:Zr(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,Z.colorspace_pars_fragment,Yr(`linearToOutputTexel`,n.outputColorSpace),$r(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(ri).join(`
`)),o=si(o),o=ii(o,n),o=ai(o,n),s=si(s),s=ii(s,n),s=ai(s,n),o=di(o),s=di(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=Hr(i,i.VERTEX_SHADER,y),S=Hr(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=Jr(i,x,`vertex`),n=Jr(i,S,`fragment`);K(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):q(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new Vr(i,h),T=ni(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,Ur)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Wr++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var wi=0,Ti=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Ei(e),t.set(e,n)),n}},Ei=class{constructor(e){this.id=wi++,this.code=e,this.usedTimes=0}};function Di(e){return e===1030||e===37490||e===36285}function Oi(e,t,n,r,i,a){let o=new nt,s=new Ti,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&q(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,k,ee;if(C){let e=Yt[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),k=e.id,ee=t.id}let A=e.getRenderTarget(),te=e.state.buffers.depth.getReversed(),j=h.isInstancedMesh===!0,M=h.isBatchedMesh===!0,ne=!!i.map,re=!!i.matcap,N=!!x,ie=!!i.aoMap,ae=!!i.lightMap,oe=!!i.bumpMap&&i.wireframe===!1,se=!!i.normalMap,ce=!!i.displacementMap,P=!!i.emissiveMap,le=!!i.metalnessMap,F=!!i.roughnessMap,I=i.anisotropy>0,ue=i.clearcoat>0,de=i.dispersion>0,fe=i.iridescence>0,pe=i.sheen>0,L=i.transmission>0,me=I&&!!i.anisotropyMap,he=ue&&!!i.clearcoatMap,R=ue&&!!i.clearcoatNormalMap,ge=ue&&!!i.clearcoatRoughnessMap,_e=fe&&!!i.iridescenceMap,ve=fe&&!!i.iridescenceThicknessMap,ye=pe&&!!i.sheenColorMap,be=pe&&!!i.sheenRoughnessMap,xe=!!i.specularMap,Se=!!i.specularColorMap,Ce=!!i.specularIntensityMap,we=L&&!!i.transmissionMap,Te=L&&!!i.thicknessMap,Ee=!!i.gradientMap,De=!!i.alphaMap,Oe=i.alphaTest>0,z=!!i.alphaHash,ke=!!i.extensions,Ae=0;i.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Ae=e.toneMapping);let je={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:k,customFragmentShaderID:ee,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:M,batchingColor:M&&h._colorsTexture!==null,instancing:j,instancingColor:j&&h.instanceColor!==null,instancingMorph:j&&h.morphTexture!==null,outputColorSpace:A===null?e.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Ue.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:ne,matcap:re,envMap:N,envMapMode:N&&x.mapping,envMapCubeUVHeight:S,aoMap:ie,lightMap:ae,bumpMap:oe,normalMap:se,displacementMap:ce,emissiveMap:P,normalMapObjectSpace:se&&i.normalMapType===1,normalMapTangentSpace:se&&i.normalMapType===0,packedNormalMap:se&&i.normalMapType===0&&Di(i.normalMap.format),metalnessMap:le,roughnessMap:F,anisotropy:I,anisotropyMap:me,clearcoat:ue,clearcoatMap:he,clearcoatNormalMap:R,clearcoatRoughnessMap:ge,dispersion:de,iridescence:fe,iridescenceMap:_e,iridescenceThicknessMap:ve,sheen:pe,sheenColorMap:ye,sheenRoughnessMap:be,specularMap:xe,specularColorMap:Se,specularIntensityMap:Ce,transmission:L,transmissionMap:we,thicknessMap:Te,gradientMap:Ee,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:De,alphaTest:Oe,alphaHash:z,combine:i.combine,mapUv:ne&&m(i.map.channel),aoMapUv:ie&&m(i.aoMap.channel),lightMapUv:ae&&m(i.lightMap.channel),bumpMapUv:oe&&m(i.bumpMap.channel),normalMapUv:se&&m(i.normalMap.channel),displacementMapUv:ce&&m(i.displacementMap.channel),emissiveMapUv:P&&m(i.emissiveMap.channel),metalnessMapUv:le&&m(i.metalnessMap.channel),roughnessMapUv:F&&m(i.roughnessMap.channel),anisotropyMapUv:me&&m(i.anisotropyMap.channel),clearcoatMapUv:he&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:R&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ge&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:_e&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:ve&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:ye&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:be&&m(i.sheenRoughnessMap.channel),specularMapUv:xe&&m(i.specularMap.channel),specularColorMapUv:Se&&m(i.specularColorMap.channel),specularIntensityMapUv:Ce&&m(i.specularIntensityMap.channel),transmissionMapUv:we&&m(i.transmissionMap.channel),thicknessMapUv:Te&&m(i.thicknessMap.channel),alphaMapUv:De&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(se||I),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(ne||De),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&se===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:te,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Ae,decodeVideoTexture:ne&&i.map.isVideoTexture===!0&&Ue.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:P&&i.emissiveMap.isVideoTexture===!0&&Ue.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:ke&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(ke&&i.extensions.multiDraw===!0||M)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return je.vertexUv1s=c.has(1),je.vertexUv2s=c.has(2),je.vertexUv3s=c.has(3),c.clear(),je}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=Yt[t];n=at.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new Ci(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function ki(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function Ai(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function ji(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Mi(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.push(u):a.transparent===!0?i.push(u):n.push(u)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t,a){n.length>1&&n.sort(e||Ai),r.length>1&&r.sort(t||ji),i.length>1&&i.sort(t||ji),a&&(n.reverse(),r.reverse(),i.reverse())}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function Ni(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new Mi,e.set(t,[i])):n>=r.length?(i=new Mi,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function Pi(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={direction:new p,color:new z};break;case`SpotLight`:n={position:new p,direction:new p,color:new z,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new p,color:new z,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new p,skyColor:new z,groundColor:new z};break;case`RectAreaLight`:n={color:new z,position:new p,halfWidth:new p,halfHeight:new p}}return e[t.id]=n,n}}}function Fi(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new j};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new j};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new j,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var Ii=0;function Li(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Ri(e){let t=new Pi,n=Fi(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new p);let i=new p,a=new fe,o=new fe;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0;i.sort(Li);for(let e=0,y=i.length;e<y;e++){let y=i[e],b=y.color,x=y.intensity,S=y.distance,C=null;if(y.shadow&&y.shadow.map&&(C=y.shadow.map.texture.format===1030?y.shadow.map.texture:y.shadow.map.depthTexture||y.shadow.map.texture),y.isAmbientLight)a+=b.r*x,o+=b.g*x,s+=b.b*x;else if(y.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(y.sh.coefficients[e],x);v++}else if(y.isDirectionalLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[c]=t,r.directionalShadowMap[c]=C,r.directionalShadowMatrix[c]=y.shadow.matrix,p++}r.directional[c]=e,c++}else if(y.isSpotLight){let e=t.get(y);e.position.setFromMatrixPosition(y.matrixWorld),e.color.copy(b).multiplyScalar(x),e.distance=S,e.coneCos=Math.cos(y.angle),e.penumbraCos=Math.cos(y.angle*(1-y.penumbra)),e.decay=y.decay,r.spot[u]=e;let i=y.shadow;if(y.map&&(r.spotLightMap[g]=y.map,g++,i.updateMatrices(y),y.castShadow&&_++),r.spotLightMatrix[u]=i.matrix,y.castShadow){let e=n.get(y);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[u]=e,r.spotShadowMap[u]=C,h++}u++}else if(y.isRectAreaLight){let e=t.get(y);e.color.copy(b).multiplyScalar(x),e.halfWidth.set(y.width*.5,0,0),e.halfHeight.set(0,y.height*.5,0),r.rectArea[d]=e,d++}else if(y.isPointLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),e.distance=y.distance,e.decay=y.decay,y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[l]=t,r.pointShadowMap[l]=C,r.pointShadowMatrix[l]=y.shadow.matrix,m++}r.point[l]=e,l++}else if(y.isHemisphereLight){let e=t.get(y);e.skyColor.copy(y.color).multiplyScalar(x),e.groundColor.copy(y.groundColor).multiplyScalar(x),r.hemi[f]=e,f++}}d>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=Q.LTC_FLOAT_1,r.rectAreaLTC2=Q.LTC_FLOAT_2):(r.rectAreaLTC1=Q.LTC_HALF_1,r.rectAreaLTC2=Q.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let y=r.hash;(y.directionalLength!==c||y.pointLength!==l||y.spotLength!==u||y.rectAreaLength!==d||y.hemiLength!==f||y.numDirectionalShadows!==p||y.numPointShadows!==m||y.numSpotShadows!==h||y.numSpotMaps!==g||y.numLightProbes!==v)&&(r.directional.length=c,r.spot.length=u,r.rectArea.length=d,r.point.length=l,r.hemi.length=f,r.directionalShadow.length=p,r.directionalShadowMap.length=p,r.pointShadow.length=m,r.pointShadowMap.length=m,r.spotShadow.length=h,r.spotShadowMap.length=h,r.directionalShadowMatrix.length=p,r.pointShadowMatrix.length=m,r.spotLightMatrix.length=h+g-_,r.spotLightMap.length=g,r.numSpotLightShadowsWithMaps=_,r.numLightProbes=v,y.directionalLength=c,y.pointLength=l,y.spotLength=u,y.rectAreaLength=d,y.hemiLength=f,y.numDirectionalShadows=p,y.numPointShadows=m,y.numSpotShadows=h,y.numSpotMaps=g,y.numLightProbes=v,r.version=Ii++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=t.matrixWorldInverse;for(let t=0,f=e.length;t<f;t++){let f=e[t];if(f.isDirectionalLight){let e=r.directional[n];e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),n++}else if(f.isSpotLight){let e=r.spot[c];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),c++}else if(f.isRectAreaLight){let e=r.rectArea[l];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),o.identity(),a.copy(f.matrixWorld),a.premultiply(d),o.extractRotation(a),e.halfWidth.set(f.width*.5,0,0),e.halfHeight.set(0,f.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),l++}else if(f.isPointLight){let e=r.point[s];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),s++}else if(f.isHemisphereLight){let e=r.hemi[u];e.direction.setFromMatrixPosition(f.matrixWorld),e.direction.transformDirection(d),u++}}}return{setup:s,setupView:c,state:r}}function zi(e){let t=new Ri(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function Bi(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new zi(e),t.set(n,[a])):r>=i.length?(a=new zi(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Vi=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Hi=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Ui=[new p(1,0,0),new p(-1,0,0),new p(0,1,0),new p(0,-1,0),new p(0,0,1),new p(0,0,-1)],Wi=[new p(0,-1,0),new p(0,-1,0),new p(0,0,1),new p(0,0,-1),new p(0,-1,0),new p(0,-1,0)],Gi=new fe,Ki=new p,qi=new p;function Ji(e,t,r){let i=new lt,a=new j,u=new j,d=new b,f=new n,p=new De,m={},h=r.maxTextureSize,g={0:1,1:0,2:2},_=new c({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new j},radius:{value:4}},vertexShader:Vi,fragmentShader:Hi}),y=_.clone();y.defines.HORIZONTAL_PASS=1;let x=new P;x.setAttribute(`position`,new o(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let S=new L(x,_),C=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let w=this.type;this.render=function(t,n,r){if(C.enabled===!1||C.autoUpdate===!1&&C.needsUpdate===!1||t.length===0)return;this.type===2&&(q(`WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead.`),this.type=1);let o=e.getRenderTarget(),c=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.state;p.setBlending(0),p.buffers.depth.getReversed()===!0?p.buffers.color.setClear(0,0,0,0):p.buffers.color.setClear(1,1,1,1),p.buffers.depth.setTest(!0),p.setScissorTest(!1);let m=w!==this.type;m&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let o=0,c=t.length;o<c;o++){let c=t[o],f=c.shadow;if(f===void 0){q(`WebGLShadowMap:`,c,`has no shadow.`);continue}if(f.autoUpdate===!1&&f.needsUpdate===!1)continue;a.copy(f.mapSize);let g=f.getFrameExtents();a.multiply(g),u.copy(f.mapSize),(a.x>h||a.y>h)&&(a.x>h&&(u.x=Math.floor(h/g.x),a.x=u.x*g.x,f.mapSize.x=u.x),a.y>h&&(u.y=Math.floor(h/g.y),a.y=u.y*g.y,f.mapSize.y=u.y));let _=e.state.buffers.depth.getReversed();if(f.camera._reversedDepth=_,f.map===null||m===!0){if(f.map!==null&&(f.map.depthTexture!==null&&(f.map.depthTexture.dispose(),f.map.depthTexture=null),f.map.dispose()),this.type===3){if(c.isPointLight){q(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}f.map=new ce(a.x,a.y,{format:Oe,type:O,minFilter:l,magFilter:l,generateMipmaps:!1}),f.map.texture.name=c.name+`.shadowMap`,f.map.depthTexture=new v(a.x,a.y,Re),f.map.depthTexture.name=c.name+`.shadowMapDepth`,f.map.depthTexture.format=s,f.map.depthTexture.compareFunction=null,f.map.depthTexture.minFilter=Ke,f.map.depthTexture.magFilter=Ke}else c.isPointLight?(f.map=new Tn(a.x),f.map.depthTexture=new Je(a.x,Ie)):(f.map=new ce(a.x,a.y),f.map.depthTexture=new v(a.x,a.y,Ie)),f.map.depthTexture.name=c.name+`.shadowMap`,f.map.depthTexture.format=s,this.type===1?(f.map.depthTexture.compareFunction=_?518:515,f.map.depthTexture.minFilter=l,f.map.depthTexture.magFilter=l):(f.map.depthTexture.compareFunction=null,f.map.depthTexture.minFilter=Ke,f.map.depthTexture.magFilter=Ke);f.camera.updateProjectionMatrix()}let y=f.map.isWebGLCubeRenderTarget?6:1;for(let t=0;t<y;t++){if(f.map.isWebGLCubeRenderTarget)e.setRenderTarget(f.map,t),e.clear();else{t===0&&(e.setRenderTarget(f.map),e.clear());let n=f.getViewport(t);d.set(u.x*n.x,u.y*n.y,u.x*n.z,u.y*n.w),p.viewport(d)}if(c.isPointLight){let e=f.camera,n=f.matrix,r=c.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Ki.setFromMatrixPosition(c.matrixWorld),e.position.copy(Ki),qi.copy(e.position),qi.add(Ui[t]),e.up.copy(Wi[t]),e.lookAt(qi),e.updateMatrixWorld(),n.makeTranslation(-Ki.x,-Ki.y,-Ki.z),Gi.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),f._frustum.setFromProjectionMatrix(Gi,e.coordinateSystem,e.reversedDepth)}else f.updateMatrices(c);i=f.getFrustum(),D(n,r,f.camera,c,this.type)}f.isPointLightShadow!==!0&&this.type===3&&T(f,r),f.needsUpdate=!1}w=this.type,C.needsUpdate=!1,e.setRenderTarget(o,c,f)};function T(n,r){let i=t.update(S);_.defines.VSM_SAMPLES!==n.blurSamples&&(_.defines.VSM_SAMPLES=n.blurSamples,y.defines.VSM_SAMPLES=n.blurSamples,_.needsUpdate=!0,y.needsUpdate=!0),n.mapPass===null&&(n.mapPass=new ce(a.x,a.y,{format:Oe,type:O})),_.uniforms.shadow_pass.value=n.map.depthTexture,_.uniforms.resolution.value=n.mapSize,_.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,i,_,S,null),y.uniforms.shadow_pass.value=n.mapPass.texture,y.uniforms.resolution.value=n.mapSize,y.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,i,y,S,null)}function E(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?p:f,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=m[e];r===void 0&&(r={},m[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,k)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?g[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function D(n,r,a,o,s){if(n.visible===!1)return;if(n.layers.test(r.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||i.intersectsObject(n))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let i=t.update(n),c=n.material;if(Array.isArray(c)){let t=i.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=E(n,d,o,s);n.onBeforeShadow(e,n,r,a,i,t,u),e.renderBufferDirect(a,null,i,t,n,u),n.onAfterShadow(e,n,r,a,i,t,u)}}}else if(c.visible){let t=E(n,c,o,s);n.onBeforeShadow(e,n,r,a,i,t,null),e.renderBufferDirect(a,null,i,t,n,null),n.onAfterShadow(e,n,r,a,i,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)D(c[e],r,a,o,s)}function k(e){e.target.removeEventListener(`dispose`,k);for(let t in m){let n=m[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Yi(e,t){function n(){let t=!1,n=new b,r=null,i=new b(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?F(e.DEPTH_TEST):I(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=ze[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?F(e.STENCIL_TEST):I(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,x=null,S=null,C=null,w=null,T=new z(0,0,0),E=0,D=!1,O=null,k=null,ee=null,A=null,te=null,j=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),M=!1,ne=0,re=e.getParameter(e.VERSION);re.indexOf(`WebGL`)===-1?re.indexOf(`OpenGL ES`)!==-1&&(ne=parseFloat(/^OpenGL ES (\d)/.exec(re)[1]),M=ne>=2):(ne=parseFloat(/^WebGL (\d)/.exec(re)[1]),M=ne>=1);let N=null,ie={},ae=e.getParameter(e.SCISSOR_BOX),oe=e.getParameter(e.VIEWPORT),se=new b().fromArray(ae),ce=new b().fromArray(oe);function P(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let le={};le[e.TEXTURE_2D]=P(e.TEXTURE_2D,e.TEXTURE_2D,1),le[e.TEXTURE_CUBE_MAP]=P(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),le[e.TEXTURE_2D_ARRAY]=P(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),le[e.TEXTURE_3D]=P(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),F(e.DEPTH_TEST),o.setFunc(3),R(!1),ge(1),F(e.CULL_FACE),me(0);function F(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function I(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function ue(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function de(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function fe(t){return h!==t&&(e.useProgram(t),h=t,!0)}let pe={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};pe[103]=e.MIN,pe[104]=e.MAX;let L={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function me(t,n,r,i,a,o,s,c,l,u){if(t===0){g===!0&&(I(e.BLEND),g=!1);return}if(g===!1&&(F(e.BLEND),g=!0),t!==5){if(t!==_||u!==D){if((v!==100||S!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,S=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:K(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:K(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:K(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:K(`WebGLState: Invalid blending: `,t)}y=null,x=null,C=null,w=null,T.set(0,0,0),E=0,_=t,D=u}return}a||=n,o||=r,s||=i,(n!==v||a!==S)&&(e.blendEquationSeparate(pe[n],pe[a]),v=n,S=a),(r!==y||i!==x||o!==C||s!==w)&&(e.blendFuncSeparate(L[r],L[i],L[o],L[s]),y=r,x=i,C=o,w=s),(c.equals(T)===!1||l!==E)&&(e.blendColor(c.r,c.g,c.b,l),T.copy(c),E=l),_=t,D=!1}function he(t,n){t.side===2?I(e.CULL_FACE):F(e.CULL_FACE);let r=t.side===1;n&&(r=!r),R(r),t.blending===1&&t.transparent===!1?me(0):me(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),ve(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?F(e.SAMPLE_ALPHA_TO_COVERAGE):I(e.SAMPLE_ALPHA_TO_COVERAGE)}function R(t){O!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),O=t)}function ge(t){t===0?I(e.CULL_FACE):(F(e.CULL_FACE),t!==k&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),k=t}function _e(t){t!==ee&&(M&&e.lineWidth(t),ee=t)}function ve(t,n,r){t?(F(e.POLYGON_OFFSET_FILL),(A!==n||te!==r)&&(A=n,te=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):I(e.POLYGON_OFFSET_FILL)}function ye(t){t?F(e.SCISSOR_TEST):I(e.SCISSOR_TEST)}function be(t){t===void 0&&(t=e.TEXTURE0+j-1),N!==t&&(e.activeTexture(t),N=t)}function xe(t,n,r){r===void 0&&(r=N===null?e.TEXTURE0+j-1:N);let i=ie[r];i===void 0&&(i={type:void 0,texture:void 0},ie[r]=i),(i.type!==t||i.texture!==n)&&(N!==r&&(e.activeTexture(r),N=r),e.bindTexture(t,n||le[t]),i.type=t,i.texture=n)}function Se(){let t=ie[N];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Ce(){try{e.compressedTexImage2D(...arguments)}catch(e){K(`WebGLState:`,e)}}function we(){try{e.compressedTexImage3D(...arguments)}catch(e){K(`WebGLState:`,e)}}function Te(){try{e.texSubImage2D(...arguments)}catch(e){K(`WebGLState:`,e)}}function Ee(){try{e.texSubImage3D(...arguments)}catch(e){K(`WebGLState:`,e)}}function De(){try{e.compressedTexSubImage2D(...arguments)}catch(e){K(`WebGLState:`,e)}}function Oe(){try{e.compressedTexSubImage3D(...arguments)}catch(e){K(`WebGLState:`,e)}}function ke(){try{e.texStorage2D(...arguments)}catch(e){K(`WebGLState:`,e)}}function Ae(){try{e.texStorage3D(...arguments)}catch(e){K(`WebGLState:`,e)}}function je(){try{e.texImage2D(...arguments)}catch(e){K(`WebGLState:`,e)}}function B(){try{e.texImage3D(...arguments)}catch(e){K(`WebGLState:`,e)}}function Me(t){return d[t]===void 0?e.getParameter(t):d[t]}function Ne(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function V(t){se.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),se.copy(t))}function Pe(t){ce.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),ce.copy(t))}function Fe(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Ie(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function H(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},N=null,ie={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,x=null,S=null,C=null,w=null,T=new z(0,0,0),E=0,D=!1,O=null,k=null,ee=null,A=null,te=null,se.set(0,0,e.canvas.width,e.canvas.height),ce.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:F,disable:I,bindFramebuffer:ue,drawBuffers:de,useProgram:fe,setBlending:me,setMaterial:he,setFlipSided:R,setCullFace:ge,setLineWidth:_e,setPolygonOffset:ve,setScissorTest:ye,activeTexture:be,bindTexture:xe,unbindTexture:Se,compressedTexImage2D:Ce,compressedTexImage3D:we,texImage2D:je,texImage3D:B,pixelStorei:Ne,getParameter:Me,updateUBOMapping:Fe,uniformBlockBinding:Ie,texStorage2D:ke,texStorage3D:Ae,texSubImage2D:Te,texSubImage3D:Ee,compressedTexSubImage2D:De,compressedTexSubImage3D:Oe,scissor:V,viewport:Pe,reset:H}}function Xi(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),u=new j,d=new WeakMap,p=new Set,m,h=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function _(e,t){return g?new OffscreenCanvas(e,t):Ee(`canvas`)}function v(e,t,n){let r=1,i=je(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);m===void 0&&(m=_(n,a));let o=t?_(n,a):m;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),q(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&q(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function y(e){return e.generateMipmaps}function b(t){e.generateMipmap(t)}function x(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function S(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];q(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||q(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?f:Ue.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function C(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,q(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function w(e,t){return y(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function E(e){let t=e.target;t.removeEventListener(`dispose`,E),O(t),t.isVideoTexture&&d.delete(t),t.isHTMLTexture&&p.delete(t)}function D(e){let t=e.target;t.removeEventListener(`dispose`,D),ee(t)}function O(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=h.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&k(e),Object.keys(i).length===0&&h.delete(n)}r.remove(e)}function k(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=h.get(i);delete a[n.__cacheKey],o.memory.textures--}function ee(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(i[t])}r.remove(t)}let A=0;function te(){A=0}function M(){return A}function re(e){A=e}function N(){let e=A;return e>=i.maxTextures&&q(`WebGLTextures: Trying to use `+e+` texture units while this GPU supports only `+i.maxTextures),A+=1,e}function ie(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function ae(t,i){let a=r.get(t);if(t.isVideoTexture&&z(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)q(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)q(`WebGLRenderer: Texture marked for update but image is incomplete`);else{L(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function oe(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){L(a,t,i);return}t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i)}function se(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){L(a,t,i);return}n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function ce(t,i){let a=r.get(t);if(t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version){he(a,t,i);return}n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let P={[Te]:e.REPEAT,[ne]:e.CLAMP_TO_EDGE,[H]:e.MIRRORED_REPEAT},F={[Ke]:e.NEAREST,[me]:e.NEAREST_MIPMAP_NEAREST,[Ae]:e.NEAREST_MIPMAP_LINEAR,[l]:e.LINEAR,[T]:e.LINEAR_MIPMAP_NEAREST,[Pe]:e.LINEAR_MIPMAP_LINEAR},I={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function ue(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&q(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,P[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,P[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,P[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,F[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,F[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,I[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function de(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,E));let i=n.source,a=h.get(i);a===void 0&&(a={},h.set(i,a));let s=ie(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&k(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function fe(e,t,n){return Math.floor(Math.floor(e/n)/t)}function pe(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=fe(n.start,r.width,4),c=fe(t.start,r.width,4);n.start<=i+1&&a===c&&fe(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function L(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=de(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let d=r.get(u);if(u.version!==d.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=Ue.getPrimaries(Ue.workingColorSpace),r=o.colorSpace===``?null:Ue.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=v(o.image,!1,i.maxTextureSize);t=ke(o,t);let r=a.convert(o.format,o.colorSpace),f=a.convert(o.type),m=S(o.internalFormat,r,f,o.normalized,o.colorSpace,o.isVideoTexture);ue(c,o);let h,g=o.mipmaps,_=o.isVideoTexture!==!0,x=d.__version===void 0||l===!0,T=u.dataReady,E=w(o,t);if(o.isDepthTexture)m=C(o.format===le,o.type),x&&(_?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,f,null));else if(o.isDataTexture){if(g.length>0){_&&x&&n.texStorage2D(e.TEXTURE_2D,E,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],_?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,f,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,f,h.data);o.generateMipmaps=!1}else _?(x&&n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height),T&&pe(o,t,r,f)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,f,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){_&&x&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,g[0].width,g[0].height,t.depth);for(let i=0,a=g.length;i<a;i++)if(h=g[i],o.format!==1023){if(r!==null){if(_){if(T){if(o.layerUpdates.size>0){let t=Ve(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}o.clearLayerUpdates()}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else q(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else _?T&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,f,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,f,h.data)}else{_&&x&&n.texStorage2D(e.TEXTURE_2D,E,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],o.format===1023?_?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,f,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,f,h.data):r===null?q(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):_?T&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(_){if(x&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,t.width,t.height,t.depth),T){if(o.layerUpdates.size>0){let i=Ve(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,f,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,f,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,f,t.data)}else if(o.isData3DTexture)_?(x&&n.texStorage3D(e.TEXTURE_3D,E,m,t.width,t.height,t.depth),T&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,f,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,f,t.data);else if(o.isFramebufferTexture){if(x){if(_)n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<E;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,f,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),p.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of p)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(g.length>0){if(_&&x){let t=je(g[0]);n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height)}for(let t=0,i=g.length;t<i;t++)h=g[t],_?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,f,h):n.texImage2D(e.TEXTURE_2D,t,m,r,f,h);o.generateMipmaps=!1}else if(_){if(x){let r=je(t);n.texStorage2D(e.TEXTURE_2D,E,m,r.width,r.height)}T&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,f,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,f,t);y(o)&&b(c),d.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function he(t,o,s){if(o.image.length!==6)return;let c=de(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=Ue.getPrimaries(Ue.workingColorSpace),r=o.colorSpace===``?null:Ue.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=v(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=ke(o,m[e]);let h=m[0],g=a.convert(o.format,o.colorSpace),_=a.convert(o.type),x=S(o.internalFormat,g,_,o.normalized,o.colorSpace),C=o.isVideoTexture!==!0,T=u.__version===void 0||c===!0,E=l.dataReady,D=w(o,h);ue(e.TEXTURE_CUBE_MAP,o);let O;if(f){C&&T&&n.texStorage2D(e.TEXTURE_CUBE_MAP,D,x,h.width,h.height);for(let t=0;t<6;t++){O=m[t].mipmaps;for(let r=0;r<O.length;r++){let i=O[r];o.format===1023?C?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,x,i.width,i.height,0,g,_,i.data):g===null?q(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):C?E&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,x,i.width,i.height,0,i.data)}}}else{if(O=o.mipmaps,C&&T){O.length>0&&D++;let t=je(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,D,x,t.width,t.height)}for(let t=0;t<6;t++)if(p){C?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,g,_,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,m[t].width,m[t].height,0,g,_,m[t].data);for(let r=0;r<O.length;r++){let i=O[r].image[t].image;C?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,x,i.width,i.height,0,g,_,i.data)}}else{C?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,g,_,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,g,_,m[t]);for(let r=0;r<O.length;r++){let i=O[r];C?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,g,_,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,x,g,_,i.image[t])}}}y(o)&&b(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function R(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=S(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),Oe(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,De(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function ge(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=C(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;Oe(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,De(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,De(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=S(o.internalFormat,c,l,o.normalized,o.colorSpace);Oe(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,De(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,De(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function _e(t,i,o){let c=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let l=r.get(i.depthTexture);if(l.__renderTarget=i,(!l.__webglTexture||i.depthTexture.image.width!==i.width||i.depthTexture.image.height!==i.height)&&(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),c){if(l.__webglInit===void 0&&(l.__webglInit=!0,i.depthTexture.addEventListener(`dispose`,E)),l.__webglTexture===void 0){l.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,l.__webglTexture),ue(e.TEXTURE_CUBE_MAP,i.depthTexture);let t=a.convert(i.depthTexture.format),r=a.convert(i.depthTexture.type),o;i.depthTexture.format===1026?o=e.DEPTH_COMPONENT24:i.depthTexture.format===1027&&(o=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,o,i.width,i.height,0,t,r,null)}}else ae(i.depthTexture,0);let u=l.__webglTexture,d=De(i),f=c?e.TEXTURE_CUBE_MAP_POSITIVE_X+o:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)Oe(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)Oe(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function ve(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)_e(i.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?_e(i.__webglFramebuffer[0],t,0):_e(i.__webglFramebuffer,t,0)}}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),ge(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),ge(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function ye(t,n,i){let a=r.get(t);n!==void 0&&R(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&ve(t)}function be(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,D);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&Oe(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=S(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=De(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),ge(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),ue(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)R(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else R(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);y(i)&&b(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),ue(c,a),R(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),y(a)&&b(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),ue(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)R(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else R(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);y(i)&&b(r),n.unbindTexture()}t.depthBuffer&&ve(t)}function xe(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(y(a)){let t=x(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),b(t),n.unbindTexture()}}}let Se=[],Ce=[];function we(t){if(t.samples>0){if(Oe(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(Se.length=0,Ce.length=0,Se.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.resolveDepthBuffer===!1&&(Se.push(l),Ce.push(l),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Ce)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Se))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.resolveDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function De(e){return Math.min(i.maxSamples,e.samples)}function Oe(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function z(e){let t=o.render.frame;d.get(e)!==t&&(d.set(e,t),e.update())}function ke(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(Ue.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&q(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):K(`WebGLTextures: Unsupported texture color space:`,n)),t}function je(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(u.width=e.naturalWidth||e.width,u.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(u.width=e.displayWidth,u.height=e.displayHeight):(u.width=e.width,u.height=e.height),u}this.allocateTextureUnit=N,this.resetTextureUnits=te,this.getTextureUnits=M,this.setTextureUnits=re,this.setTexture2D=ae,this.setTexture2DArray=oe,this.setTexture3D=se,this.setTextureCube=ce,this.rebindTextures=ye,this.setupRenderTarget=be,this.updateRenderTargetMipmap=xe,this.updateMultisampleRenderTarget=we,this.setupDepthRenderbuffer=ve,this.setupFrameBufferTexture=R,this.useMultisampledRTT=Oe,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function Zi(e,t){function n(n,r=``){let i,a=Ue.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Qi=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,$i=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,ea=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Le(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new c({vertexShader:Qi,fragmentShader:$i,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new L(new pe(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},ta=class extends be{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,c=1,l=null,d=null,f=null,m=null,h=null,_=null,y=typeof XRWebGLBinding<`u`,x=new ea,S={},C=t.getContextAttributes(),w=null,T=null,E=[],D=[],O=new j,k=null,ee=new de;ee.viewport=new b;let A=new de;A.viewport=new b;let te=[ee,A],M=new ct,ne=null,re=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=E[e];return t===void 0&&(t=new g,E[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=E[e];return t===void 0&&(t=new g,E[e]=t),t.getGripSpace()},this.getHand=function(e){let t=E[e];return t===void 0&&(t=new g,E[e]=t),t.getHandSpace()};function N(e){let t=D.indexOf(e.inputSource);if(t===-1)return;let n=E[t];n!==void 0&&(n.update(e.inputSource,e.frame,l||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ie(){r.removeEventListener(`select`,N),r.removeEventListener(`selectstart`,N),r.removeEventListener(`selectend`,N),r.removeEventListener(`squeeze`,N),r.removeEventListener(`squeezestart`,N),r.removeEventListener(`squeezeend`,N),r.removeEventListener(`end`,ie),r.removeEventListener(`inputsourceschange`,ae);for(let e=0;e<E.length;e++){let t=D[e];t!==null&&(D[e]=null,E[e].disconnect(t))}ne=null,re=null,x.reset();for(let e in S)delete S[e];e.setRenderTarget(w),h=null,m=null,f=null,r=null,T=null,L.stop(),n.isPresenting=!1,e.setPixelRatio(k),e.setSize(O.width,O.height,!1),n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&q(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&q(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(e){l=e},this.getBaseLayer=function(){return m===null?h:m},this.getBinding=function(){return f===null&&y&&(f=new XRWebGLBinding(r,t)),f},this.getFrame=function(){return _},this.getSession=function(){return r},this.setSession=async function(d){if(r=d,r!==null){if(w=e.getRenderTarget(),r.addEventListener(`select`,N),r.addEventListener(`selectstart`,N),r.addEventListener(`selectend`,N),r.addEventListener(`squeeze`,N),r.addEventListener(`squeezestart`,N),r.addEventListener(`squeezeend`,N),r.addEventListener(`end`,ie),r.addEventListener(`inputsourceschange`,ae),C.xrCompatible!==!0&&await t.makeXRCompatible(),k=e.getPixelRatio(),e.getSize(O),y&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;C.depth&&(o=C.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=C.stencil?le:s,a=C.stencil?u:Ie);let c={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};f=this.getBinding(),m=f.createProjectionLayer(c),r.updateRenderState({layers:[m]}),e.setPixelRatio(1),e.setSize(m.textureWidth,m.textureHeight,!1),T=new ce(m.textureWidth,m.textureHeight,{format:_e,type:se,depthTexture:new v(m.textureWidth,m.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:C.stencil,colorSpace:e.outputColorSpace,samples:C.antialias?4:0,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}else{let n={antialias:C.antialias,alpha:!0,depth:C.depth,stencil:C.stencil,framebufferScaleFactor:i};h=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:h}),e.setPixelRatio(1),e.setSize(h.framebufferWidth,h.framebufferHeight,!1),T=new ce(h.framebufferWidth,h.framebufferHeight,{format:_e,type:se,colorSpace:e.outputColorSpace,stencilBuffer:C.stencil,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}T.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await r.requestReferenceSpace(o),L.setContext(r),L.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function ae(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=D.indexOf(n);r>=0&&(D[r]=null,E[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=D.indexOf(n);if(r===-1){for(let e=0;e<E.length;e++)if(e>=D.length){D.push(n),r=e;break}else if(D[e]===null){D[e]=n,r=e;break}if(r===-1)break}let i=E[r];i&&i.connect(n)}}let oe=new p,P=new p;function F(e,t,n){oe.setFromMatrixPosition(t.matrixWorld),P.setFromMatrixPosition(n.matrixWorld);let r=oe.distanceTo(P),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function I(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;x.texture!==null&&(x.depthNear>0&&(t=x.depthNear),x.depthFar>0&&(n=x.depthFar)),M.near=A.near=ee.near=t,M.far=A.far=ee.far=n,(ne!==M.near||re!==M.far)&&(r.updateRenderState({depthNear:M.near,depthFar:M.far}),ne=M.near,re=M.far),M.layers.mask=e.layers.mask|6,ee.layers.mask=M.layers.mask&-5,A.layers.mask=M.layers.mask&-3;let i=e.parent,a=M.cameras;I(M,i);for(let e=0;e<a.length;e++)I(a[e],i);a.length===2?F(M,ee,A):M.projectionMatrix.copy(ee.projectionMatrix),ue(e,M,i)};function ue(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=W*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(m!==null||h!==null)return c},this.setFoveation=function(e){c=e,m!==null&&(m.fixedFoveation=e),h!==null&&h.fixedFoveation!==void 0&&(h.fixedFoveation=e)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(M)},this.getCameraTexture=function(e){return S[e]};let fe=null;function pe(t,i){if(d=i.getViewerPose(l||a),_=i,d!==null){let t=d.views;h!==null&&(e.setRenderTargetFramebuffer(T,h.framebuffer),e.setRenderTarget(T));let i=!1;t.length!==M.cameras.length&&(M.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(h!==null)a=h.getViewport(r);else{let t=f.getViewSubImage(m,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(T,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(T))}let o=te[n];o===void 0&&(o=new de,o.layers.enable(n),o.viewport=new b,te[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(M.matrix.copy(o.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),i===!0&&M.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&y){f=n.getBinding();let e=f.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&x.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&y){e.state.unbindTexture(),f=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=S[n];e||(e=new Le,S[n]=e);let t=f.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<E.length;e++){let t=D[e],n=E[e];t!==null&&n!==void 0&&n.update(t,i,l||a)}fe&&fe(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),_=null}let L=new qt;L.setAnimationLoop(pe),this.setAnimationLoop=function(e){fe=e},this.dispose=function(){}}},na=new fe,ra=new S;ra.set(-1,0,0,0,1,0,0,0,1);function ia(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,Ne(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(na.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(ra),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function aa(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return K(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?q(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):q(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var oa=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),sa=null;function ca(){return sa===null&&(sa=new M(oa,16,16,Oe,O),sa.name=`DFG_LUT`,sa.minFilter=l,sa.magFilter=l,sa.wrapS=ne,sa.wrapT=ne,sa.generateMipmaps=!1,sa.needsUpdate=!0),sa}var la=class{constructor(e={}){let{canvas:t=r(),context:n=null,depth:a=!0,stencil:o=!1,alpha:s=!1,antialias:c=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:d=!1,powerPreference:f=`default`,failIfMajorPerformanceCaveat:m=!1,reversedDepthBuffer:h=!1,outputBufferType:g=se}=e;this.isWebGLRenderer=!0;let v;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);v=n.getContextAttributes().alpha}else v=s;let y=g,x=new Set([ot,et,Ze]),S=new Set([se,Ie,E,u,i,Fe]),C=new Uint32Array(4),w=new Int32Array(4),T=new p,D=null,k=null,ee=[],A=[],te=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let j=this,M=!1,ne=null,re=null,N=null,ie=null;this._outputColorSpace=ve;let ae=0,oe=0,P=null,le=-1,F=null,I=new b,ue=new b,de=null,pe=new z(0),L=0,me=t.width,he=t.height,R=1,ge=null,_e=null,be=new b(0,0,me,he),xe=new b(0,0,me,he),Se=!1,Ce=new lt,we=!1,Te=!1,Ee=new fe,De=new p,Oe=new b,ke={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ae=!1;function je(){return P===null?R:1}let B=n;function Me(e,n){return t.getContext(e,n)}try{let e={alpha:!0,depth:a,stencil:o,antialias:c,premultipliedAlpha:l,preserveDrawingBuffer:d,powerPreference:f,failIfMajorPerformanceCaveat:m};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r185`),t.addEventListener(`webglcontextlost`,st,!1),t.addEventListener(`webglcontextrestored`,ct,!1),t.addEventListener(`webglcontextcreationerror`,ut,!1),B===null){let t=`webgl2`;if(B=Me(t,e),B===null)throw Me(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}}catch(e){throw K(`WebGLRenderer: `+e.message),e}let Ne,V,H,Le,U,W,Re,ze,Be,Ve,He,Ge,Ke,qe,Je,Ye,G,Xe,Qe,$e,tt,nt,rt;function it(){Ne=new Dn(B),Ne.init(),tt=new Zi(B,Ne),V=new nn(B,Ne,e,tt),H=new Yi(B,Ne),V.reversedDepthBuffer&&h&&H.buffers.depth.setReversed(!0),re=B.createFramebuffer(),N=B.createFramebuffer(),ie=B.createFramebuffer(),Le=new An(B),U=new ki,W=new Xi(B,Ne,H,U,V,tt,Le),Re=new En(j),ze=new Jt(B),nt=new en(B,ze),Be=new On(B,ze,Le,nt),Ve=new Mn(B,Be,ze,nt,Le),Xe=new jn(B,V,W),Je=new rn(U),He=new Oi(j,Re,Ne,V,nt,Je),Ge=new ia(j,U),Ke=new Ni,qe=new Bi(Ne),G=new $t(j,Re,H,Ve,v,l),Ye=new Ji(j,Ve,V),rt=new aa(B,Le,V,H),Qe=new tn(B,Ne,Le),$e=new kn(B,Ne,Le),Le.programs=He.programs,j.capabilities=V,j.extensions=Ne,j.properties=U,j.renderLists=Ke,j.shadowMap=Ye,j.state=H,j.info=Le}it(),y!==1009&&(te=new Pn(y,t.width,t.height,c,a,o));let at=new ta(j,B);this.xr=at,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){let e=Ne.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Ne.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return R},this.setPixelRatio=function(e){e!==void 0&&(R=e,this.setSize(me,he,!1))},this.getSize=function(e){return e.set(me,he)},this.setSize=function(e,n,r=!0){if(at.isPresenting){q(`WebGLRenderer: Can't change size while VR device is presenting.`);return}me=e,he=n,t.width=Math.floor(e*R),t.height=Math.floor(n*R),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),te!==null&&te.setSize(t.width,t.height),this.setViewport(0,0,e,n)},this.getDrawingBufferSize=function(e){return e.set(me*R,he*R).floor()},this.setDrawingBufferSize=function(e,n,r){me=e,he=n,R=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(y===1009){K(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);return}if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){q(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}te.setEffects(e||[])},this.getCurrentViewport=function(e){return e.copy(I)},this.getViewport=function(e){return e.copy(be)},this.setViewport=function(e,t,n,r){e.isVector4?be.set(e.x,e.y,e.z,e.w):be.set(e,t,n,r),H.viewport(I.copy(be).multiplyScalar(R).round())},this.getScissor=function(e){return e.copy(xe)},this.setScissor=function(e,t,n,r){e.isVector4?xe.set(e.x,e.y,e.z,e.w):xe.set(e,t,n,r),H.scissor(ue.copy(xe).multiplyScalar(R).round())},this.getScissorTest=function(){return Se},this.setScissorTest=function(e){H.setScissorTest(Se=e)},this.setOpaqueSort=function(e){ge=e},this.setTransparentSort=function(e){_e=e},this.getClearColor=function(e){return e.copy(G.getClearColor())},this.setClearColor=function(){G.setClearColor(...arguments)},this.getClearAlpha=function(){return G.getClearAlpha()},this.setClearAlpha=function(){G.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(P!==null){let t=P.texture.format;e=x.has(t)}if(e){let e=P.texture.type,t=S.has(e),n=G.getClearColor(),r=G.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(C[0]=i,C[1]=a,C[2]=o,C[3]=r,B.clearBufferuiv(B.COLOR,0,C)):(w[0]=i,w[1]=a,w[2]=o,w[3]=r,B.clearBufferiv(B.COLOR,0,w))}else r|=B.COLOR_BUFFER_BIT}t&&(r|=B.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&B.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),ne=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,st,!1),t.removeEventListener(`webglcontextrestored`,ct,!1),t.removeEventListener(`webglcontextcreationerror`,ut,!1),G.dispose(),Ke.dispose(),qe.dispose(),U.dispose(),Re.dispose(),Ve.dispose(),nt.dispose(),rt.dispose(),He.dispose(),at.dispose(),at.removeEventListener(`sessionstart`,_t),at.removeEventListener(`sessionend`,vt),yt.stop()};function st(e){e.preventDefault(),We(`WebGLRenderer: Context Lost.`),M=!0}function ct(){We(`WebGLRenderer: Context Restored.`),M=!1;let e=Le.autoReset,t=Ye.enabled,n=Ye.autoUpdate,r=Ye.needsUpdate,i=Ye.type;it(),Le.autoReset=e,Ye.enabled=t,Ye.autoUpdate=n,Ye.needsUpdate=r,Ye.type=i}function ut(e){K(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function dt(e){let t=e.target;t.removeEventListener(`dispose`,dt),ft(t)}function ft(e){pt(e),U.remove(e)}function pt(e){let t=U.get(e).programs;t!==void 0&&(t.forEach(function(e){He.releaseProgram(e)}),e.isShaderMaterial&&He.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=ke);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=kt(e,t,n,r,i);H.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Be.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;nt.setup(i,r,s,n,c);let h,g=Qe;if(c!==null&&(h=ze.get(c),g=$e,g.setIndex(h)),i.isMesh)r.wireframe===!0?(H.setLineWidth(r.wireframeLinewidth*je()),g.setMode(B.LINES)):g.setMode(B.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),H.setLineWidth(e*je()),i.isLineSegments?g.setMode(B.LINES):i.isLineLoop?g.setMode(B.LINE_LOOP):g.setMode(B.LINE_STRIP)}else i.isPoints?g.setMode(B.POINTS):i.isSprite&&g.setMode(B.TRIANGLES);if(i.isBatchedMesh){if(Ne.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?ze.get(c).bytesPerElement:1,o=U.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(B,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function mt(e,t,n){e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,Tt(e,t,n),e.side=0,e.needsUpdate=!0,Tt(e,t,n),e.side=2):Tt(e,t,n)}this.compile=function(e,t,n=null){n===null&&(n=e),k=qe.get(n),k.init(t),A.push(k),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(k.pushLight(e),e.castShadow&&k.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(k.pushLight(e),e.castShadow&&k.pushShadow(e))}),k.setupLights();let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let t=e.material;if(t){if(Array.isArray(t))for(let i=0;i<t.length;i++){let a=t[i];mt(a,n,e),r.add(a)}else mt(t,n,e),r.add(t)}}),k=A.pop(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){if(r.forEach(function(e){U.get(e).currentProgram.isReady()&&r.delete(e)}),r.size===0){t(e);return}setTimeout(n,10)}Ne.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let ht=null;function gt(e){ht&&ht(e)}function _t(){yt.stop()}function vt(){yt.start()}let yt=new qt;yt.setAnimationLoop(gt),typeof self<`u`&&yt.setContext(self),this.setAnimationLoop=function(e){ht=e,at.setAnimationLoop(e),e===null?yt.stop():yt.start()},at.addEventListener(`sessionstart`,_t),at.addEventListener(`sessionend`,vt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){K(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(M===!0)return;ne!==null&&ne.renderStart(e,t);let n=at.enabled===!0&&at.isPresenting===!0,r=te!==null&&(P===null||n)&&te.begin(j,P);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),at.enabled===!0&&at.isPresenting===!0&&(te===null||te.isCompositing()===!1)&&(at.cameraAutoUpdate===!0&&at.updateCamera(t),t=at.getCamera()),e.isScene===!0&&e.onBeforeRender(j,e,t,P),k=qe.get(e,A.length),k.init(t),k.state.textureUnits=W.getTextureUnits(),A.push(k),Ee.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),Ce.setFromProjectionMatrix(Ee,_,t.reversedDepth),Te=this.localClippingEnabled,we=Je.init(this.clippingPlanes,Te),D=Ke.get(e,ee.length),D.init(),ee.push(D),at.enabled===!0&&at.isPresenting===!0){let e=j.xr.getDepthSensingMesh();e!==null&&bt(e,t,-1/0,j.sortObjects)}bt(e,t,0,j.sortObjects),D.finish(),j.sortObjects===!0&&D.sort(ge,_e,t.reversedDepth),Ae=at.enabled===!1||at.isPresenting===!1||at.hasDepthSensing()===!1,Ae&&G.addToRenderList(D,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),we===!0&&Je.beginShadows();let i=k.state.shadowsArray;if(Ye.render(i,e,t),we===!0&&Je.endShadows(),(r&&te.hasRenderPass())===!1){let n=D.opaque,r=D.transmissive;if(k.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];St(n,r,e,a)}Ae&&G.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];xt(D,e,n,n.viewport)}}else r.length>0&&St(n,r,e,t),Ae&&G.render(e),xt(D,e,t)}P!==null&&oe===0&&(W.updateMultisampleRenderTarget(P),W.updateRenderTargetMipmap(P)),r&&te.end(j),e.isScene===!0&&e.onAfterRender(j,e,t),nt.resetDefaultState(),le=-1,F=null,A.pop(),A.length>0?(k=A[A.length-1],W.setTextureUnits(k.state.textureUnits),we===!0&&Je.setGlobalState(j.clippingPlanes,k.state.camera)):k=null,ee.pop(),D=ee.length>0?ee[ee.length-1]:null,ne!==null&&ne.renderEnd()};function bt(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)k.pushLightProbeGrid(e);else if(e.isLight)k.pushLight(e),e.castShadow&&k.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||Ce.intersectsSprite(e)){r&&Oe.setFromMatrixPosition(e.matrixWorld).applyMatrix4(Ee);let t=Ve.update(e),i=e.material;i.visible&&D.push(e,t,i,n,Oe.z,null)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||Ce.intersectsObject(e))){let t=Ve.update(e),i=e.material;if(r&&(e.boundingSphere===void 0?(t.boundingSphere===null&&t.computeBoundingSphere(),Oe.copy(t.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),Oe.copy(e.boundingSphere.center)),Oe.applyMatrix4(e.matrixWorld).applyMatrix4(Ee)),Array.isArray(i)){let r=t.groups;for(let a=0,o=r.length;a<o;a++){let o=r[a],s=i[o.materialIndex];s&&s.visible&&D.push(e,t,s,n,Oe.z,o)}}else i.visible&&D.push(e,t,i,n,Oe.z,null)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)bt(i[e],t,n,r)}function xt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;k.setupLightsView(n),we===!0&&Je.setGlobalState(j.clippingPlanes,n),r&&H.viewport(I.copy(r)),i.length>0&&Ct(i,t,n),a.length>0&&Ct(a,t,n),o.length>0&&Ct(o,t,n),H.buffers.depth.setTest(!0),H.buffers.depth.setMask(!0),H.buffers.color.setMask(!0),H.setPolygonOffset(!1)}function St(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(k.state.transmissionRenderTarget[r.id]===void 0){let e=Ne.has(`EXT_color_buffer_half_float`)||Ne.has(`EXT_color_buffer_float`);k.state.transmissionRenderTarget[r.id]=new ce(1,1,{generateMipmaps:!0,type:e?O:se,minFilter:Pe,samples:Math.max(4,V.samples),stencilBuffer:o,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ue.workingColorSpace})}let i=k.state.transmissionRenderTarget[r.id],a=r.viewport||I;i.setSize(a.z*j.transmissionResolutionScale,a.w*j.transmissionResolutionScale);let s=j.getRenderTarget(),c=j.getActiveCubeFace(),l=j.getActiveMipmapLevel();j.setRenderTarget(i),j.getClearColor(pe),L=j.getClearAlpha(),L<1&&j.setClearColor(16777215,.5),j.clear(),Ae&&G.render(n);let u=j.toneMapping;j.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),k.setupLightsView(r),we===!0&&Je.setGlobalState(j.clippingPlanes,r),Ct(e,n,r),W.updateMultisampleRenderTarget(i),W.updateRenderTargetMipmap(i),Ne.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,wt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(W.updateMultisampleRenderTarget(i),W.updateRenderTargetMipmap(i))}j.setRenderTarget(s,c,l),j.setClearColor(pe,L),d!==void 0&&(r.viewport=d),j.toneMapping=u}function Ct(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&wt(o,t,n,s,l,c)}}function wt(e,t,n,r,i,a){e.onBeforeRender(j,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(j,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,j.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,j.renderBufferDirect(n,t,r,i,e,a),i.side=2):j.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(j,t,n,r,i,a)}function Tt(e,t,n){t.isScene!==!0&&(t=ke);let r=U.get(e),i=k.state.lights,a=k.state.shadowsArray,o=i.state.version,s=He.getParameters(e,i.state,a,t,n,k.state.lightProbeGridArray),c=He.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Re.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,dt),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return Dt(e,s),d}else s.uniforms=He.getUniforms(e),ne!==null&&e.isNodeMaterial&&ne.build(e,n,s),e.onBeforeCompile(s,j),d=He.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Je.uniform),Dt(e,s),r.needsLights=J(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=k.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function Et(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Vr.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function Dt(e,t){let n=U.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function Ot(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];T.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(T))return n}return null}function kt(e,t,n,r,i){t.isScene!==!0&&(t=ke),W.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=P===null?j.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:Ue.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Re.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(h=j.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=U.get(r),y=k.state.lights;if(we===!0&&(Te===!0||e!==F)){let t=e===F&&r.id===le;Je.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i.colorTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i.colorTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Je.numPlanes||v.numIntersection!==Je.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=k.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let x=v.currentProgram;b===!0&&(x=Tt(r,t,i),ne&&r.isNodeMaterial&&ne.onUpdateProgram(r,x,v));let S=!1,C=!1,w=!1,T=x.getUniforms(),E=v.uniforms;if(H.useProgram(x.program)&&(S=!0,C=!0,w=!0),r.id!==le&&(le=r.id,C=!0),v.needsLights){let e=Ot(k.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,C=!0)}if(S||F!==e){H.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),T.setValue(B,`projectionMatrix`,e.projectionMatrix),T.setValue(B,`viewMatrix`,e.matrixWorldInverse);let t=T.map.cameraPosition;t!==void 0&&t.setValue(B,De.setFromMatrixPosition(e.matrixWorld)),V.logarithmicDepthBuffer&&T.setValue(B,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&T.setValue(B,`isOrthographic`,e.isOrthographicCamera===!0),F!==e&&(F=e,C=!0,w=!0)}if(v.needsLights&&(y.state.directionalShadowMap.length>0&&T.setValue(B,`directionalShadowMap`,y.state.directionalShadowMap,W),y.state.spotShadowMap.length>0&&T.setValue(B,`spotShadowMap`,y.state.spotShadowMap,W),y.state.pointShadowMap.length>0&&T.setValue(B,`pointShadowMap`,y.state.pointShadowMap,W)),i.isSkinnedMesh){T.setOptional(B,i,`bindMatrix`),T.setOptional(B,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),T.setValue(B,`boneTexture`,e.boneTexture,W))}i.isBatchedMesh&&(T.setOptional(B,i,`batchingTexture`),T.setValue(B,`batchingTexture`,i._matricesTexture,W),T.setOptional(B,i,`batchingIdTexture`),T.setValue(B,`batchingIdTexture`,i._indirectTexture,W),T.setOptional(B,i,`batchingColorTexture`),i._colorsTexture!==null&&T.setValue(B,`batchingColorTexture`,i._colorsTexture,W));let D=n.morphAttributes;if((D.position!==void 0||D.normal!==void 0||D.color!==void 0)&&Xe.update(i,n,x),(C||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,T.setValue(B,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(E.envMapIntensity.value=t.environmentIntensity),E.dfgLUT!==void 0&&(E.dfgLUT.value=ca()),C){if(T.setValue(B,`toneMappingExposure`,j.toneMappingExposure),v.needsLights&&At(E,w),a&&r.fog===!0&&Ge.refreshFogUniforms(E,a),Ge.refreshMaterialUniforms(E,r,R,he,k.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;E.probesSH.value=e.texture,E.probesMin.value.copy(e.boundingBox.min),E.probesMax.value.copy(e.boundingBox.max),E.probesResolution.value.copy(e.resolution)}Vr.upload(B,Et(v),E,W)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Vr.upload(B,Et(v),E,W),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&T.setValue(B,`center`,i.center),T.setValue(B,`modelViewMatrix`,i.modelViewMatrix),T.setValue(B,`normalMatrix`,i.normalMatrix),T.setValue(B,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];rt.update(n,x),rt.bind(n,x)}}return x}function At(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function J(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return ae},this.getActiveMipmapLevel=function(){return oe},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(e,t,n){let r=U.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),U.get(e.texture).__webglTexture=t,U.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=U.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){P=e,ae=t,oe=n;let r=null,i=!1,a=!1;if(e){let o=U.get(e);if(o.__useDefaultFramebuffer!==void 0){H.bindFramebuffer(B.FRAMEBUFFER,o.__webglFramebuffer),I.copy(e.viewport),ue.copy(e.scissor),de=e.scissorTest,H.viewport(I),H.scissor(ue),H.setScissorTest(de),le=-1;return}if(o.__webglFramebuffer===void 0)W.setupRenderTarget(e);else if(o.__hasExternalTextures)W.rebindTextures(e,U.get(e.texture).__webglTexture,U.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&U.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);W.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=U.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&W.useMultisampledRTT(e)===!1?U.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,I.copy(e.viewport),ue.copy(e.scissor),de=e.scissorTest}else I.copy(be).multiplyScalar(R).floor(),ue.copy(xe).multiplyScalar(R).floor(),de=Se;if(n!==0&&(r=re),H.bindFramebuffer(B.FRAMEBUFFER,r)&&H.drawBuffers(e,r),H.viewport(I),H.scissor(ue),H.setScissorTest(de),i){let r=U.get(e.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=U.get(e.textures[t]);B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=U.get(e.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,t.__webglTexture,n)}le=-1},this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){K(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=U.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){H.bindFramebuffer(B.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;if(e.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+s),!V.textureFormatReadable(c)){K(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(!V.textureTypeReadable(l)){K(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&B.readPixels(t,n,r,i,tt.convert(c),tt.convert(l),a)}finally{let e=P===null?null:U.get(P).__webglFramebuffer;H.bindFramebuffer(B.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=U.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){H.bindFramebuffer(B.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;if(e.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+s),!V.textureFormatReadable(l))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(!V.textureTypeReadable(u))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let d=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,d),B.bufferData(B.PIXEL_PACK_BUFFER,a.byteLength,B.STREAM_READ),B.readPixels(t,n,r,i,tt.convert(l),tt.convert(u),0);let f=P===null?null:U.get(P).__webglFramebuffer;H.bindFramebuffer(B.FRAMEBUFFER,f);let p=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await ye(B,p,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,d),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,a),B.deleteBuffer(d),B.deleteSync(p),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;W.setTexture2D(e,0),B.copyTexSubImage2D(B.TEXTURE_2D,n,0,0,o,s,i,a),H.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=tt.convert(t.format),_=tt.convert(t.type),v;t.isData3DTexture?(W.setTexture3D(t,0),v=B.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(W.setTexture2DArray(t,0),v=B.TEXTURE_2D_ARRAY):(W.setTexture2D(t,0),v=B.TEXTURE_2D),H.activeTexture(B.TEXTURE0),H.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,t.flipY),H.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),H.pixelStorei(B.UNPACK_ALIGNMENT,t.unpackAlignment);let y=H.getParameter(B.UNPACK_ROW_LENGTH),b=H.getParameter(B.UNPACK_IMAGE_HEIGHT),x=H.getParameter(B.UNPACK_SKIP_PIXELS),S=H.getParameter(B.UNPACK_SKIP_ROWS),C=H.getParameter(B.UNPACK_SKIP_IMAGES);H.pixelStorei(B.UNPACK_ROW_LENGTH,h.width),H.pixelStorei(B.UNPACK_IMAGE_HEIGHT,h.height),H.pixelStorei(B.UNPACK_SKIP_PIXELS,l),H.pixelStorei(B.UNPACK_SKIP_ROWS,u),H.pixelStorei(B.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=U.get(e),r=U.get(t),h=U.get(n.__renderTarget),g=U.get(r.__renderTarget);H.bindFramebuffer(B.READ_FRAMEBUFFER,h.__webglFramebuffer),H.bindFramebuffer(B.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,U.get(e).__webglTexture,i,d+n),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,U.get(t).__webglTexture,a,m+n)),B.blitFramebuffer(l,u,o,s,f,p,o,s,B.DEPTH_BUFFER_BIT,B.NEAREST);H.bindFramebuffer(B.READ_FRAMEBUFFER,null),H.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||U.has(e)){let n=U.get(e),r=U.get(t);H.bindFramebuffer(B.READ_FRAMEBUFFER,N),H.bindFramebuffer(B.DRAW_FRAMEBUFFER,ie);for(let e=0;e<c;e++)w?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,n.__webglTexture,i),T?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,r.__webglTexture,a),i===0?T?B.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):B.copyTexSubImage2D(v,a,f,p,l,u,o,s):B.blitFramebuffer(l,u,o,s,f,p,o,s,B.COLOR_BUFFER_BIT,B.NEAREST);H.bindFramebuffer(B.READ_FRAMEBUFFER,null),H.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?B.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?B.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):B.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):B.texSubImage2D(B.TEXTURE_2D,a,f,p,o,s,g,_,h);H.pixelStorei(B.UNPACK_ROW_LENGTH,y),H.pixelStorei(B.UNPACK_IMAGE_HEIGHT,b),H.pixelStorei(B.UNPACK_SKIP_PIXELS,x),H.pixelStorei(B.UNPACK_SKIP_ROWS,S),H.pixelStorei(B.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&B.generateMipmap(v),H.unbindTexture()},this.initRenderTarget=function(e){U.get(e).__webglFramebuffer===void 0&&W.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?W.setTextureCube(e,0):e.isData3DTexture?W.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?W.setTexture2DArray(e,0):W.setTexture2D(e,0),H.unbindTexture()},this.resetState=function(){ae=0,oe=0,P=null,H.reset(),nt.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return _}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Ue._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ue._getUnpackColorSpace()}},ua=1.15,da=7.2,fa=-1.18,pa=1.02,ma=.18,ha=.2,ga=14,_a=class{camera;input;yaw=.08;pitch=.26;distance=4.5;target=new p;desiredPosition=new p;direction=new p;probe=new p;orbitDelta=new j;caveBounds={minimum:0,maximum:0};constructor(e,t){this.camera=e,this.input=t}snapTo(e){this.calculateDesired(e),this.resolveOcclusion(),this.camera.position.copy(this.desiredPosition),this.camera.lookAt(this.target)}setOrbit(e,t,n,r){this.yaw=e,this.pitch=C.clamp(t,fa,pa),this.distance=C.clamp(n,ua,da),this.snapTo(r)}setPose(e,t){this.target.copy(t),this.camera.position.copy(e),this.camera.lookAt(t)}update(e,t){this.input.consumeOrbitDelta(this.orbitDelta),this.yaw-=this.orbitDelta.x*.0042,this.pitch=C.clamp(this.pitch+this.orbitDelta.y*.0035,fa,pa),this.distance=C.clamp(this.distance+this.input.consumeZoomDelta()*.42,ua,da),this.calculateDesired(t);let n=this.resolveOcclusion();if(n&&this.camera.position.distanceToSquared(this.target)>this.desiredPosition.distanceToSquared(this.target))this.camera.position.copy(this.desiredPosition);else{let t=n?24:11;this.camera.position.lerp(this.desiredPosition,1-Math.exp(-t*e))}this.camera.lookAt(this.target)}getActualDistance(){return this.camera.position.distanceTo(this.target)}getPitch(){return this.pitch}calculateDesired(e){this.target.copy(e),this.target.y+=1.25;let t=Math.cos(this.pitch)*this.distance;this.desiredPosition.set(this.target.x+Math.sin(this.yaw)*t,this.target.y+Math.sin(this.pitch)*this.distance,this.target.z+Math.cos(this.yaw)*t)}resolveOcclusion(){this.direction.copy(this.desiredPosition).sub(this.target);let e=this.direction.length();return e<1e-6?!1:(this.direction.multiplyScalar(1/e),this.resolveCaveIntersection())}resolveCaveIntersection(){if(this.direction.copy(this.desiredPosition).sub(this.target),this.direction.length()<1e-6)return!1;let e=0;for(let t=1;t<=ga;t+=1){let n=t/ga;if(this.probe.copy(this.target).addScaledVector(this.direction,n),this.isSafePosition(this.probe)){e=n;continue}let r=n;for(let t=0;t<7;t+=1){let t=(e+r)*.5;this.probe.copy(this.target).addScaledVector(this.direction,t),this.isSafePosition(this.probe)?e=t:r=t}let i=e-Math.min(.008,e*.25);return this.desiredPosition.copy(this.target).addScaledVector(this.direction,Math.max(0,i)),!0}return!1}isSafePosition(e){return e.y>=gt(e.x,e.z)+ma&&Ft(e.x,e.y,e.z,ha,this.caveBounds)}},va=1;function ya(e){return Number.isFinite(e)?Math.max(va,Math.floor(e)):va}function ba(e,t){return ya(e)/ya(t)}function xa(e,t,n){let r=ba(t,n);return Math.abs(e.aspect-r)<1e-6?r:(e.aspect=r,e.updateProjectionMatrix(),r)}var Sa=class{apply;scale=1;lastEvaluation=0;stableSince=0;lastResize=-1/0;constructor(e){this.apply=e}observe(e,t){if(e<4||e-this.lastEvaluation<2.5||t.averageFps<=0)return;this.lastEvaluation=e;let n=Math.min(138,Math.max(55,t.refreshEstimate*.9)),r=t.averageFps<n*.82,i=t.averageFps>n*.98;if(r){if(this.stableSince=0,this.scale<=.66||e-this.lastResize<12)return;let r=t.averageFps/Math.max(1,n),i=this.scale*Math.sqrt(r/.96),a=r<.72?.2:.1;this.scale=Math.max(.66,Math.round(Math.max(this.scale-a,i)*100)/100),this.lastResize=e,this.emit();return}if(!i){this.stableSince=e;return}this.stableSince===0&&(this.stableSince=e),e-this.stableSince>18&&e-this.lastResize>=12&&this.scale<1&&(this.scale=Math.min(1,this.scale+.05),this.stableSince=e,this.lastResize=e,this.emit())}getState(){return{scale:this.scale,label:this.labelForScale()}}emit(){this.apply(this.getState())}labelForScale(){return this.scale>=.91?`ADAPTIVE ULTRA`:this.scale>=.76?`ADAPTIVE HIGH`:`ADAPTIVE PERFORMANCE`}},Ca=`cameraIndependentShadowCaster`;function wa(e,t=`webgpu`){if(e.userData[Ca]===!0||(e.userData[Ca]=!0,e.castShadow=!0,e.layers.set(1),t===`webgpu`))return;e.layers.enable(0);let n=e.onBeforeRender,r=e.onAfterRender,i=[],a=Array.isArray(e.material)?e.material:[e.material];for(let e of a)i.some(t=>t.material===e)||i.push({material:e,colorWrite:e.colorWrite,depthWrite:e.depthWrite});let o=!1;e.onBeforeRender=(...t)=>{if(n.apply(e,t),o=!t[2].layers.isEnabled(1),o)for(let e of i)e.colorWrite=e.material.colorWrite,e.depthWrite=e.material.depthWrite,e.material.colorWrite=!1,e.material.depthWrite=!1},e.onAfterRender=(...t)=>{if(o)for(let e of i)e.material.colorWrite=e.colorWrite,e.material.depthWrite=e.depthWrite;o=!1,r.apply(e,t)}}var Ta=class{lastTimestamp=null;accumulator=0;elapsed=0;advance(e,t){this.lastTimestamp===null&&(this.lastTimestamp=e);let n=Math.min(Pt,Math.max(0,(e-this.lastTimestamp)/1e3));this.lastTimestamp=e,this.accumulator+=n,this.elapsed+=n;let r=0;for(;this.accumulator>=.008333333333333333&&r<6;)t(It),this.accumulator-=It,r+=1;return r===6&&(this.accumulator=Math.min(this.accumulator,It)),{delta:n,elapsed:this.elapsed,interpolation:this.accumulator/It,physicsSteps:r}}reset(e=null){this.lastTimestamp=e,this.accumulator=0}};async function Ea(e,t={clipboard:navigator.clipboard,document}){if(t.clipboard?.writeText){await t.clipboard.writeText(e);return}let n=t.document.createElement(`textarea`);n.value=e,n.readOnly=!0,n.style.position=`fixed`,n.style.opacity=`0`,n.style.pointerEvents=`none`,t.document.body.append(n),n.select(),n.setSelectionRange(0,n.value.length);let r=t.document.execCommand(`copy`);if(n.remove(),!r)throw Error(`Clipboard copy was rejected.`)}function $(e,t=2){return Number.isFinite(e)?e.toFixed(t):`unavailable`}function Da(e){let{performance:t,rendererStartup:n,renderer:r,canvas:i,quality:a,workload:o,capeSolver:s,capeWorkers:c,scene:l,page:u,runtime:d}=e,f=u.multipleScreens===!0?`multiple screens reported`:u.multipleScreens===!1?`single screen reported`:`screen count unavailable`,p=s?s.implementation===`webgpu-compute`?[`Cape solver: packed WebGPU compute PBD at ${Math.round(1/It)} Hz | ${J.columns*J.rows*l.simulatedCapes} active GPU-resident particles across ${l.simulatedCapes} of 11 preallocated capes | ${J.solverIterations} graph-colored projection passes across packed lanes | 25 dispatches in 1 compute submission/step`,`Cape timing: no animation-loop particle readback or GPU fence; main-thread physics above measures command preparation/submission, not GPU completion`]:[c?.active?`Cape solver: CPU PBD Gauss-Seidel at ${Math.round(1/It)} Hz | ${J.solverIterations} projection passes | player on main thread, bots across ${c.workers} workers | sampled 1/${s.sampleIntervalSteps} player steps (${s.sampledActiveSteps} samples)`:`Cape solver: sequential CPU PBD Gauss-Seidel at ${Math.round(1/It)} Hz | ${J.solverIterations} projection passes | sampled 1/${s.sampleIntervalSteps} active steps (${s.sampledActiveSteps} samples)`,`Cape step sampled average: ${$(s.averageStepMilliseconds)} ms | prediction ${$(s.phases.prediction)} | constraints ${$(s.phases.constraints)} | self ${$(s.phases.selfCollision)} | fold ${$(s.phases.foldGuard)} | body ${$(s.phases.bodyCollision)} | world ${$(s.phases.worldCollision)} | cave ${$(s.phases.caveCollision)} | reconcile ${$(s.phases.reconciliation)}`,...c?.active?[`Cape workers: ${c.workers} active | ${c.busyWorkers} busy | ${c.queuedSteps} queued fixed steps | ${c.failure??`healthy`}`]:[]]:[],m=n?.failures.at(-1),h=m?[`Renderer recovery: ${m.renderer.toUpperCase()} failed at ${m.stage} | ${m.name}: ${m.message} | ${m.recoveredWith?`recovered with ${m.recoveredWith.toUpperCase()}`:`not recovered`}`]:[];return[`Cape Physics performance report`,`Captured: ${e.capturedAt}`,`Window: last ${$(t.windowElapsedMilliseconds/1e3,2)} s of 15 s | ${t.sampleCount} frames`,`Rendered FPS: ${$(t.averageFps)} average | ${$(t.onePercentLow)} 1% low | ${$(t.refreshEstimate,0)} callback/s estimate`,`Frame interval: ${$(t.averageFrameTime)} ms average | p50 ${$(t.medianFrameTime)} ms | p95 ${$(t.p95FrameTime)} ms | p99 ${$(t.p99FrameTime)} ms | worst ${$(t.longestFrameTime)} ms`,`Long frames: ${t.longFrameCount} at or above 50 ms`,`Renderer: ${r.backend} | ${r.vendor} | ${r.device}`,`Renderer selection: requested ${r.preference.toUpperCase()} | active ${r.actual.toUpperCase()} | ${r.fallback?`fallback active`:`no fallback`}`,...h,`Canvas: ${i.drawingBufferWidth}x${i.drawingBufferHeight} drawing buffer / ${i.cssWidth}x${i.cssHeight} CSS px`,`Quality: ${a.label} | ${$(a.scale,3)} resolution scale | ${a.targetResizes} render-target resizes`,`Main thread: ${$(o.averageMainThreadMilliseconds)} ms average | p95 ${$(o.p95MainThreadMilliseconds)} ms | physics ${$(o.averagePhysicsMilliseconds)} ms | scene ${$(o.averageSceneMilliseconds)} ms | render submission ${$(o.averageRenderMilliseconds)} ms | ${$(o.averagePhysicsSteps)} physics steps/callback average, ${o.maximumPhysicsSteps} maximum`,...p,`Scene: ${$(l.simulationSeconds,2)} s simulated | ${l.botCount} performance bots | ${l.simulatedCapes} simulated capes | ${r.drawCalls} draw calls | ${r.triangles} triangles | ${r.programs} programs | ${l.worldColliders} cape colliders/cape | ${l.activeRipples} active ripples | player cape ${l.capeSleeping?`sleeping`:`active`}`,`Page state: ${u.visibility} | ${u.focused?`focused`:`not focused`} | DPR ${$(u.devicePixelRatio)} | ${f}`,`Timing caveat: display FPS is refresh/vsync capped and therefore cannot compare backend headroom; main-thread render submission is not GPU completion`,`Page: ${u.url}`,`Runtime: ${d.platform}`,`User agent (raw): ${d.userAgent}`].join(`
`)}var Oa=15e3,ka=8192,Aa=Object.freeze({averageMainThreadMilliseconds:0,p95MainThreadMilliseconds:0,averagePhysicsMilliseconds:0,averageSceneMilliseconds:0,averageRenderMilliseconds:0,averagePhysicsSteps:0,maximumPhysicsSteps:0,sampleCount:0}),ja=class{getReportDetails;panel;fpsLabel;fpsCaption;averageLabel;frameTimeLabel;frameP95Label;mainWorkLabel;mainP95Label;lowLabel;triangleLabel;averageHistoryPath;lowHistoryPath;historyGraphic;copyLabel;sampleTimestamps=new Float64Array(ka);sampleDurations=new Float64Array(ka);workloadTimestamps=new Float64Array(ka);physicsDurations=new Float64Array(ka);sceneDurations=new Float64Array(ka);renderDurations=new Float64Array(ka);physicsStepCounts=new Uint8Array(ka);durationScratch=[];workloadScratch=[];averageFpsHistory=[];onePercentLowHistory=[];sampleStart=0;sampleCount=0;workloadStart=0;workloadCount=0;lastTimestamp=null;lastPaint=0;copyFeedbackTimer=null;snapshot={averageFps:0,onePercentLow:0,averageFrameTime:0,medianFrameTime:0,p95FrameTime:0,p99FrameTime:0,refreshEstimate:60,longFrameCount:0,longestFrameTime:0,sampleCount:0,windowElapsedMilliseconds:0};workloadSnapshot=Aa;constructor(e,t=document){this.getReportDetails=e,this.panel=X(t.querySelector(`[data-performance-panel]`),`Performance panel is missing.`),this.fpsLabel=X(t.querySelector(`[data-fps]`),`FPS label is missing.`),this.fpsCaption=X(t.querySelector(`[data-fps-caption]`),`FPS caption is missing.`),this.averageLabel=X(t.querySelector(`[data-fps-average]`),`Average-FPS label is missing.`),this.frameTimeLabel=X(t.querySelector(`[data-frame-time]`),`Frame-time label is missing.`),this.frameP95Label=X(t.querySelector(`[data-frame-p95]`),`Frame p95 label is missing.`),this.mainWorkLabel=X(t.querySelector(`[data-main-work]`),`Main-work label is missing.`),this.mainP95Label=X(t.querySelector(`[data-main-p95]`),`Main-work p95 label is missing.`),this.lowLabel=X(t.querySelector(`[data-fps-low]`),`Low-FPS label is missing.`),this.triangleLabel=X(t.querySelector(`[data-triangles]`),`Triangle label is missing.`),this.averageHistoryPath=X(t.querySelector(`[data-fps-average-line]`),`Average-FPS history path is missing.`),this.lowHistoryPath=X(t.querySelector(`[data-fps-low-line]`),`Low-FPS history path is missing.`),this.historyGraphic=X(t.querySelector(`[data-fps-history]`),`FPS history graphic is missing.`),this.copyLabel=X(t.querySelector(`[data-performance-copy]`),`Performance copy label is missing.`),this.panel.addEventListener(`click`,this.handleCopy)}recordFrame(e){if(this.lastTimestamp===null){this.lastTimestamp=e;return}let t=e-this.lastTimestamp;if(this.lastTimestamp=e,t<=0)return;let n=(this.sampleStart+this.sampleCount)%ka;this.sampleTimestamps[n]=e,this.sampleDurations[n]=t,this.sampleCount<ka?this.sampleCount+=1:this.sampleStart=(this.sampleStart+1)%ka;let r=e-Oa;for(;this.sampleCount>0&&this.sampleTimestamps[this.sampleStart]<r;)this.sampleStart=(this.sampleStart+1)%ka,--this.sampleCount;e-this.lastPaint>=250&&(this.lastPaint=e,this.recalculate(),this.paint())}getSnapshot(){return this.snapshot}recordWorkload(e,t){let n=(this.workloadStart+this.workloadCount)%ka;this.workloadTimestamps[n]=e,this.physicsDurations[n]=Math.max(0,t.physicsMilliseconds),this.sceneDurations[n]=Math.max(0,t.sceneMilliseconds),this.renderDurations[n]=Math.max(0,t.renderMilliseconds),this.physicsStepCounts[n]=Math.max(0,Math.min(255,Math.floor(t.physicsSteps))),this.workloadCount<ka?this.workloadCount+=1:this.workloadStart=(this.workloadStart+1)%ka,this.trimWorkload(e-Oa)}getWorkloadSnapshot(){return this.workloadSnapshot}resume(e){this.lastTimestamp=e}reset=()=>{this.sampleStart=0,this.sampleCount=0,this.workloadStart=0,this.workloadCount=0,this.workloadSnapshot=Aa,this.averageFpsHistory.length=0,this.onePercentLowHistory.length=0,this.lastTimestamp=null,this.averageHistoryPath.setAttribute(`d`,``),this.lowHistoryPath.setAttribute(`d`,``)};dispose(){this.panel.removeEventListener(`click`,this.handleCopy),this.copyFeedbackTimer!==null&&window.clearTimeout(this.copyFeedbackTimer)}recalculate(){this.durationScratch.length=this.sampleCount;let e=0,t=0,n=0;for(let r=0;r<this.sampleCount;r+=1){let i=(this.sampleStart+r)%ka,a=this.sampleDurations[i],o=Math.min(a,250);this.durationScratch[r]=o,e+=o,a>=50&&(t+=1),n=Math.max(n,a)}this.durationScratch.sort((e,t)=>e-t);let r=this.durationScratch.length>0?e/this.durationScratch.length:0,i=r>0?1e3/r:0,a=this.sortedPercentile(.5),o=this.sortedPercentile(.95),s=this.sortedPercentile(.99),c=Math.max(1,Math.ceil(this.durationScratch.length*.01)),l=0;for(let e=Math.max(0,this.durationScratch.length-c);e<this.durationScratch.length;e+=1)l+=this.durationScratch[e]??0;let u=l/c,d=u>0?1e3/u:0,f=this.sortedPercentile(.1),p=f>0?1e3/f:60,m=[30,60,75,90,100,120,144,165,240].reduce((e,t)=>Math.abs(t-p)<Math.abs(e-p)?t:e,60),h=this.sampleStart,g=(this.sampleStart+this.sampleCount-1+ka)%ka,_=this.sampleCount>0?Math.min(Oa,this.sampleTimestamps[g]-this.sampleTimestamps[h]+this.sampleDurations[h]):0;this.snapshot={averageFps:i,onePercentLow:d,averageFrameTime:r,medianFrameTime:a,p95FrameTime:o,p99FrameTime:s,refreshEstimate:m,longFrameCount:t,longestFrameTime:n,sampleCount:this.sampleCount,windowElapsedMilliseconds:_},this.recalculateWorkload(),this.averageFpsHistory.push(i),this.onePercentLowHistory.push(d),this.averageFpsHistory.length>78&&this.averageFpsHistory.shift(),this.onePercentLowHistory.length>78&&this.onePercentLowHistory.shift()}recalculateWorkload(){this.workloadScratch.length=this.workloadCount;let e=0,t=0,n=0,r=0,i=0;for(let a=0;a<this.workloadCount;a+=1){let o=(this.workloadStart+a)%ka,s=this.physicsDurations[o]??0,c=this.sceneDurations[o]??0,l=this.renderDurations[o]??0,u=this.physicsStepCounts[o]??0;e+=s,t+=c,n+=l,r+=u,i=Math.max(i,u),this.workloadScratch[a]=s+c+l}this.workloadScratch.sort((e,t)=>e-t);let a=this.workloadCount,o=e+t+n,s=Math.min(Math.max(0,a-1),Math.floor(a*.95));this.workloadSnapshot={averageMainThreadMilliseconds:a>0?o/a:0,p95MainThreadMilliseconds:a>0?this.workloadScratch[s]??0:0,averagePhysicsMilliseconds:a>0?e/a:0,averageSceneMilliseconds:a>0?t/a:0,averageRenderMilliseconds:a>0?n/a:0,averagePhysicsSteps:a>0?r/a:0,maximumPhysicsSteps:i,sampleCount:a}}trimWorkload(e){for(;this.workloadCount>0&&this.workloadTimestamps[this.workloadStart]<e;)this.workloadStart=(this.workloadStart+1)%ka,--this.workloadCount}sortedPercentile(e){if(this.durationScratch.length===0)return 0;let t=Math.min(this.durationScratch.length-1,Math.max(0,Math.floor(e*this.durationScratch.length)));return this.durationScratch[t]??0}paint(){let{averageFps:e,onePercentLow:t,averageFrameTime:n,p95FrameTime:r,refreshEstimate:i}=this.snapshot,{averageMainThreadMilliseconds:a,p95MainThreadMilliseconds:o,sampleCount:s}=this.workloadSnapshot,c=this.snapshot.sampleCount>=30&&e>=i*.97;this.fpsLabel.textContent=e>0?e.toFixed(2):`--`,this.averageLabel.textContent=e>0?e.toFixed(2):`--`,this.lowLabel.textContent=t>0?t.toFixed(2):`--`,this.fpsCaption.textContent=c?`DISPLAY FPS / VSYNC-CAPPED`:`DISPLAY FPS / LAST 15S`,this.frameTimeLabel.textContent=n>0?n.toFixed(2):`--`,this.frameP95Label.textContent=r>0?r.toFixed(2):`--`,this.mainWorkLabel.textContent=s>0?a.toFixed(2):`--`,this.mainP95Label.textContent=s>0?o.toFixed(2):`--`,this.triangleLabel.textContent=this.getReportDetails().renderer.triangles.toLocaleString(`en-US`),this.historyGraphic.setAttribute(`aria-label`,`Display cadence over the last ${(this.snapshot.windowElapsedMilliseconds/1e3).toFixed(1)} seconds: ${e.toFixed(2)} average FPS, ${t.toFixed(2)} one-percent low; main-thread work ${a.toFixed(2)} milliseconds average and ${o.toFixed(2)} milliseconds p95`),this.panel.classList.toggle(`has-frame-drop`,e>0&&e<Math.min(52,i*.78));let l=i*.7,u=i*1.02,d=e=>e.map((t,n)=>{let r=e.length<=1?0:n/(e.length-1)*154,i=(1-Math.max(0,Math.min(1,(t-l)/(u-l))))*30;return`${n===0?`M`:`L`}${r.toFixed(1)} ${i.toFixed(1)}`}).join(` `);this.averageHistoryPath.setAttribute(`d`,d(this.averageFpsHistory)),this.lowHistoryPath.setAttribute(`d`,d(this.onePercentLowHistory))}handleCopy=()=>{this.copyPerformanceReport()};async copyPerformanceReport(){try{await Ea(Da({capturedAt:new Date().toISOString(),performance:this.snapshot,...this.getReportDetails()})),this.panel.dataset.copyState=`copied`,this.copyLabel.textContent=`COPIED 15S REPORT`}catch(e){console.warn(`Unable to copy performance report.`,e),this.panel.dataset.copyState=`failed`,this.copyLabel.textContent=`COPY FAILED`}this.copyFeedbackTimer!==null&&window.clearTimeout(this.copyFeedbackTimer),this.copyFeedbackTimer=window.setTimeout(()=>{delete this.panel.dataset.copyState,this.copyLabel.textContent=`CLICK TO COPY 15S REPORT`,this.copyFeedbackTimer=null},2e3)}},Ma=class extends Error{stage;code;constructor(e,t,n,r){super(n,r),this.stage=e,this.code=t,this.name=`WebGpuBootstrapError`}},Na={setTimeout:(e,t)=>window.setTimeout(e,t),clearTimeout:e=>window.clearTimeout(e)};async function Pa(e,t,n,r){let i=null,a=new Promise((e,a)=>{i=r.setTimeout(()=>{a(new Ma(t,`timeout`,`WebGPU ${t===`request-webgpu-adapter`?`adapter`:`device`} request exceeded ${n} ms.`))},n)});try{return await Promise.race([e,a])}finally{i!==null&&r.clearTimeout(i)}}async function Fa(e,t={}){let n=t.timeoutMilliseconds??12e3,r=t.timers??Na;if(!e)throw new Ma(`request-webgpu-adapter`,`unavailable`,`WebGPU is not exposed by this browser.`);t.onStage?.(`request-webgpu-adapter`);let i;try{i=await Pa(e.requestAdapter({powerPreference:`high-performance`}),`request-webgpu-adapter`,n,r)}catch(e){throw e instanceof Ma?e:new Ma(`request-webgpu-adapter`,`request-failed`,`The browser rejected the WebGPU adapter request.`,{cause:e})}if(!i)throw new Ma(`request-webgpu-adapter`,`unavailable`,`The browser could not provide a WebGPU adapter.`);t.onStage?.(`request-webgpu-device`);let a=(t.requestedFeatures??[]).filter(e=>i.features.has(e)),o;try{o=i.requestDevice({requiredFeatures:a,requiredLimits:t.requiredLimits})}catch(e){throw new Ma(`request-webgpu-device`,`request-failed`,`The browser rejected the WebGPU device request.`,{cause:e})}let s=!1;try{let e=await Pa(o,`request-webgpu-device`,n,r);return s=!0,e}catch(e){throw e instanceof Ma?e:new Ma(`request-webgpu-device`,`request-failed`,`The browser rejected the WebGPU device request.`,{cause:e})}finally{s||o.then(e=>e.destroy()).catch(()=>void 0)}}var Ia={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},La=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},Ra=new m(-1,1,1,-1,0,1),za=new class extends P{constructor(){super(),this.setAttribute(`position`,new qe([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new qe([0,2,0,0,2,0],2))}},Ba=class{constructor(e){this._mesh=new L(za,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Ra)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},Va=class extends La{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof c?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=at.clone(e.uniforms),this.material=new c({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Ba(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},Ha=class extends La{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},Ua=class extends La{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},Wa=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new j);this._width=n.width,this._height=n.height,t=new ce(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:O}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Va(Ia),this.copyPass.material.blending=0,this.timer=new xe}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}Ha!==void 0&&(r instanceof Ha?n=!0:r instanceof Ua&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new j);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},Ga={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},Ka=class extends La{constructor(){super(),this.isOutputPass=!0,this.uniforms=at.clone(Ga.uniforms),this.material=new He({name:Ga.name,uniforms:this.uniforms,vertexShader:Ga.vertexShader,fragmentShader:Ga.fragmentShader}),this._fsQuad=new Ba(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Ue.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},qa=class extends La{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new z}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},Ja={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new z(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`},Ya=class e extends La{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new j(256,256):new j(e.x,e.y),this.clearColor=new z(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new ce(i,a,{type:O}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new ce(i,a,{type:O});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new ce(i,a,{type:O});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),i=Math.round(i/2),a=Math.round(a/2)}let o=Ja;this.highPassUniforms=at.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new c({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let s=[6,10,14,18,22];i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new j(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new p(1,1,1),new p(1,1,1),new p(1,1,1),new p(1,1,1),new p(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=at.clone(Ia.uniforms),this.blendMaterial=new c({uniforms:this.copyUniforms,vertexShader:Ia.vertexShader,fragmentShader:Ia.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new z,this._oldClearAlpha=1,this._basic=new re,this._fsQuad=new Ba(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new j(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);return new c({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new j(.5,.5)},direction:{value:new j(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new c({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};Ya.BlurDirectionX=new j(1,0),Ya.BlurDirectionY=new j(0,1);function Xa(e){return e>=.999?`direct-opaque`:`isolated-fade`}var Za=36e5,Qa=1.5;function $a(e,t,n,r){let i=Math.max(1,Math.floor(e)),a=Math.max(1,Math.floor(t)),o=i*a,s=Math.min(Math.max(n,.25),Qa),c=Math.sqrt(Za/o),l=Math.max(.25,Math.min(s,c)*Math.min(Math.max(r,.5),1)),u=Math.max(1,Math.floor(i*l)),d=Math.max(1,Math.floor(a*l));return{width:i,height:a,pixelRatio:l,drawingBufferWidth:u,drawingBufferHeight:d,renderPixels:u*d}}var eo=1e-6;function to(e){let t=new v(1,1,Ie);return t.name=e,t.format=s,t.minFilter=Ke,t.magFilter=Ke,t.generateMipmaps=!1,t}var no=Object.freeze({calls:0,triangles:0,points:0,lines:0});function ro(e){return{calls:e.drawCalls??e.calls??0,triangles:e.triangles,points:e.points,lines:e.lines}}var io=`
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`,ao=`
  uniform sampler2D tWorld;
  uniform sampler2D tLayer;
  uniform sampler2D tWorldDepth;
  uniform sampler2D tLayerDepth;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec4 world = texture2D(tWorld, vUv);
    vec4 layer = texture2D(tLayer, vUv);
    float worldDepth = texture2D(tWorldDepth, vUv).r;
    float layerDepth = texture2D(tLayerDepth, vUv).r;
    float depthVisible = step(layerDepth, worldDepth + ${eo.toExponential()});
    float layerAlpha = layer.a * uOpacity * depthVisible;
    vec3 color = world.rgb * (1.0 - layerAlpha)
      + layer.rgb * uOpacity * depthVisible;
    gl_FragColor = vec4(color, world.a);
  }
`,oo=class extends La{scene;camera;layer;layerTarget;material;quad;savedClearColor=new z;constructor(e,t,n){super(),this.scene=e,this.camera=t,this.layer=n,this.layerTarget=new ce(1,1,{type:O,depthBuffer:!0,depthTexture:to(`Character fade depth`),stencilBuffer:!1}),this.layerTarget.texture.name=`Character fade layer`,this.layerTarget.samples=2,this.material=new c({name:`Depth-resolved character composite`,uniforms:{tWorld:{value:null},tLayer:{value:this.layerTarget.texture},tWorldDepth:{value:null},tLayerDepth:{value:this.layerTarget.depthTexture},uOpacity:{value:1}},vertexShader:io,fragmentShader:ao,depthTest:!1,depthWrite:!1}),this.quad=new Ba(this.material)}setOpacity(e){this.material.uniforms.uOpacity.value=C.clamp(e,0,1)}getOpacity(){return this.material.uniforms.uOpacity.value}getDepthDiagnostics(){return{layerDepthTexture:this.layerTarget.depthTexture?.isDepthTexture===!0,worldDepthConnected:this.material.uniforms.tWorldDepth.value instanceof v}}setSize(e,t){this.layerTarget.setSize(e,t)}render(e,t,n){let r=this.camera.layers.mask,i=this.scene.background,a=e.getClearAlpha(),o=e.shadowMap.autoUpdate,s=e.getRenderTarget();e.getClearColor(this.savedClearColor);try{this.camera.layers.set(this.layer),this.scene.background=null,e.shadowMap.autoUpdate=!1,e.setRenderTarget(this.layerTarget),e.setClearColor(0,0),e.clear(!0,!0,!1),e.render(this.scene,this.camera)}finally{this.camera.layers.mask=r,this.scene.background=i,e.shadowMap.autoUpdate=o,e.setClearColor(this.savedClearColor,a),e.setRenderTarget(s)}if(!n.depthTexture)throw Error(`World render target has no depth texture for character occlusion.`);this.material.uniforms.tWorld.value=n.texture,this.material.uniforms.tWorldDepth.value=n.depthTexture,e.setRenderTarget(this.renderToScreen?null:t),this.clear&&e.clear(),this.quad.render(e)}dispose(){this.layerTarget.dispose(),this.material.dispose(),this.quad.dispose()}},so=class{renderer;composer;bloom;characterComposite;camera;resolutionScale=1;sizing=null;targetResizeCount=0;lastFrameRenderStats=no;constructor(e,t,n){this.camera=n,this.renderer=new la({canvas:e,antialias:!1,alpha:!1,powerPreference:`high-performance`,stencil:!1,depth:!0}),this.renderer.outputColorSpace=ve,this.renderer.toneMapping=6,this.renderer.toneMappingExposure=1.24,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=2,this.renderer.info.autoReset=!1,n.layers.set(0);let r=new ce(1,1,{type:O,depthBuffer:!0,depthTexture:to(`World scene depth`),stencilBuffer:!1});r.samples=2,this.composer=new Wa(this.renderer,r),this.composer.addPass(new qa(t,n)),this.characterComposite=new oo(t,n,1),this.composer.addPass(this.characterComposite),this.bloom=new Ya(new j(1,1),.42,.48,.88),this.composer.addPass(this.bloom),this.composer.addPass(new Ka),this.resize()}async init(){}render(e){this.renderer.info.reset();let t=Xa(this.characterComposite.getOpacity());this.camera.layers.set(0),this.characterComposite.enabled=t===`isolated-fade`,t===`direct-opaque`&&this.camera.layers.enable(1),this.composer.render(e),this.lastFrameRenderStats=ro(this.renderer.info.render)}renderManual(e=0){this.render(e)}getLastFrameRenderStats(){return this.lastFrameRenderStats}resize(){let e=$a(window.innerWidth,window.innerHeight,window.devicePixelRatio,this.resolutionScale),t=!this.sizing||e.width!==this.sizing.width||e.height!==this.sizing.height,n=!this.sizing||Math.abs(e.pixelRatio-this.sizing.pixelRatio)>1e-4;!t&&!n||(n&&(this.renderer.setPixelRatio(e.pixelRatio),this.composer.setPixelRatio(e.pixelRatio),this.targetResizeCount+=1),t&&(this.renderer.setSize(e.width,e.height,!1),this.composer.setSize(e.width,e.height),this.targetResizeCount+=1),this.sizing=e)}setResolutionScale(e){Math.abs(e-this.resolutionScale)<.001||(this.resolutionScale=e,this.resize())}setCharacterOpacity(e){this.characterComposite.setOpacity(e)}getCharacterOpacity(){return this.characterComposite.getOpacity()}getDepthCompositeDiagnostics(){return{...this.characterComposite.getDepthDiagnostics(),renderMode:Xa(this.characterComposite.getOpacity())}}readScreenCenterPixel(){let e=this.renderer.getContext(),t=this.renderer.getDrawingBufferSize(new j),n=new Uint8Array(4);return e.finish(),e.readPixels(Math.floor(t.x*.5),Math.floor(t.y*.5),1,1,e.RGBA,e.UNSIGNED_BYTE,n),[n[0],n[1],n[2],n[3]]}getSizingDiagnostics(){return{...this.sizing??$a(1,1,1,this.resolutionScale),targetResizeCount:this.targetResizeCount}}getActualBackend(){return`webgl`}onDeviceLost(e){return()=>void 0}getBackendDiagnostics(){let e=this.renderer.getContext(),t=e.getExtension(`WEBGL_debug_renderer_info`);return{preference:`webgl`,actual:`webgl`,backend:String(e.getParameter(e.VERSION)),vendor:String(e.getParameter(t?.UNMASKED_VENDOR_WEBGL??e.VENDOR)),device:String(e.getParameter(t?.UNMASKED_RENDERER_WEBGL??e.RENDERER)),fallback:!1}}getProgramCount(){return this.renderer.info.programs?.length??0}async synchronizeForLocalProfile(){this.renderer.getContext().finish()}async resolveGpuFrameTimeForLocalProfile(){return null}async compile(e,t){let n=t.layers.mask;try{t.layers.enable(1),await this.renderer.compileAsync(e,t)}finally{t.layers.mask=n}}dispose(){this.composer.dispose(),this.characterComposite.dispose(),this.renderer.dispose()}},co={maxStorageBuffersInVertexStage:1,maxStorageBuffersPerShaderStage:8},lo=[`core-features-and-limits`],uo=class{canvas;scene;camera;trackTimestamps;webGpuBlockReason;implementation;preference;constructor(e,t,n,r,i=!1,a=null){this.canvas=e,this.scene=t,this.camera=n,this.trackTimestamps=i,this.webGpuBlockReason=a,this.preference=r,this.implementation=null}get active(){if(!this.implementation)throw Error(`Render pipeline was used before initialization.`);return this.implementation}get renderer(){return this.active.renderer}usesNodeRenderer(){return!(this.active instanceof so)}getMaxAnisotropy(){return this.active instanceof so?this.active.renderer.capabilities.getMaxAnisotropy():this.active.renderer.getMaxAnisotropy()}async init(t={}){if(this.implementation){await this.active.init();return}if(this.preference===`webgl`){t.onStage?.(`construct-webgl-renderer`),this.implementation=new so(this.canvas,this.scene,this.camera),t.onStage?.(`initialize-webgl-renderer`),await this.active.init();return}let n=`webgpu-safety-check`,r=!1,i=null;try{if(t.onStage?.(n),this.webGpuBlockReason)throw Error(this.webGpuBlockReason);i=await Fa(navigator.gpu,{requestedFeatures:this.trackTimestamps?[...lo,`timestamp-query`]:lo,requiredLimits:co,onStage:e=>{n=e,t.onStage?.(e)}}),n=`construct-webgpu-renderer`,t.onStage?.(n);let{WebGpuRenderPipeline:a}=await e(async()=>{let{WebGpuRenderPipeline:e}=await import(`./WebGpuRenderPipeline-CTV597na.js`);return{WebGpuRenderPipeline:e}},__vite__mapDeps([0,1,2,3]));this.implementation=new a(this.canvas,this.scene,this.camera,this.preference,this.trackTimestamps,i),r=!0,n=`initialize-webgpu-renderer`,t.onStage?.(n),await this.active.init()}catch(e){if(t.onWebGpuFallback?.(e,n),r||i?.destroy(),this.implementation)try{this.implementation.dispose()}catch(e){console.warn(`Unable to dispose the failed WebGPU renderer.`,e)}this.implementation=null,t.onStage?.(`recover-webgl`),await new Promise(e=>window.setTimeout(e,600)),t.onStage?.(`construct-webgl-renderer`),this.implementation=new so(this.canvas,this.scene,this.camera),t.onStage?.(`initialize-webgl-renderer`),await this.active.init()}}render(e=0){this.active.render(e)}renderManual(e=0){this.active.renderManual(e)}getLastFrameRenderStats(){return this.active.getLastFrameRenderStats()}resize(){this.active.resize()}setResolutionScale(e){this.active.setResolutionScale(e)}setCharacterOpacity(e){this.active.setCharacterOpacity(e)}getCharacterOpacity(){return this.active.getCharacterOpacity()}getDepthCompositeDiagnostics(){return this.active.getDepthCompositeDiagnostics()}async readScreenCenterPixel(){return await this.active.readScreenCenterPixel()}getSizingDiagnostics(){return this.active.getSizingDiagnostics()}getActualBackend(){return this.active.getActualBackend()}getWebGlRenderer(){return this.active instanceof so?this.active.renderer:null}getNodeRenderer(){return this.usesNodeRenderer()?this.active.renderer:null}getWebGpuRenderer(){return this.active.getActualBackend()===`webgpu`?this.getNodeRenderer():null}onDeviceLost(e){return this.active.onDeviceLost(e)}getBackendDiagnostics(){return this.active.getBackendDiagnostics()}getProgramCount(){return this.active.getProgramCount()}async synchronizeForLocalProfile(){await this.active.synchronizeForLocalProfile()}async resolveGpuFrameTimeForLocalProfile(){return await this.active.resolveGpuFrameTimeForLocalProfile()}async compile(e,t){await this.active.compile(e,t)}dispose(){let e=this.implementation;if(this.implementation=null,e)try{e.renderer.setAnimationLoop(null)}finally{e.dispose()}}};function fo(e){let t=/\b(?:Chrome|Chromium)\/(\d+)/.exec(e);return t?Number(t[1]):null}function po(e){return e.apiAvailable?e.diagnostics?.failures.some(e=>e.renderer===`webgpu`&&(e.stage.startsWith(`webgpu-device-lost`)||e.message.includes(`external Instance reference no longer exists`)))===!0?{allowed:!1,code:`session-device-loss`,reason:`WebGPU is disabled for this tab after a GPU device loss. Restart Chrome before trying WebGPU again.`}:/\bMacintosh\b|\bMac OS X\b/.test(e.userAgent)&&fo(e.userAgent)===151?{allowed:!1,code:`chromium-151-macos-runaway-process`,reason:`WebGPU is temporarily disabled on Chromium 151 for macOS after a device loss left a runaway GPU helper consuming CPU. This is a safety containment, not a fix.`}:{allowed:!0,code:`allowed`,reason:null}:{allowed:!1,code:`api-unavailable`,reason:`WebGPU is not exposed by this browser.`}}var mo=class{canvas;onFirstInteraction;pressed=new Set;orbitDelta=new j;movement=new j;virtualMovement=new j;touchMovement=new j;zoomDelta=0;activePointer=null;lastPointer=new j;interacted=!1;virtualMovementEnabled=!1;virtualRunning=!1;touchMovementEnabled=!1;touchRunning=!1;jumpQueued=!1;virtualJumpQueued=!1;touchJumpQueued=!1;constructor(e,t){this.canvas=e,this.onFirstInteraction=t,window.addEventListener(`keydown`,this.handleKeyDown),window.addEventListener(`keyup`,this.handleKeyUp),window.addEventListener(`blur`,this.handleBlur),e.addEventListener(`pointerdown`,this.handlePointerDown),e.addEventListener(`pointermove`,this.handlePointerMove),e.addEventListener(`pointerup`,this.handlePointerUp),e.addEventListener(`pointercancel`,this.handlePointerUp),e.addEventListener(`wheel`,this.handleWheel,{passive:!1}),e.addEventListener(`contextmenu`,this.handleContextMenu)}getMovement(){if(this.virtualMovementEnabled)return this.virtualMovement;let e=Number(this.pressed.has(`KeyD`))-Number(this.pressed.has(`KeyA`)),t=Number(this.pressed.has(`KeyW`))-Number(this.pressed.has(`KeyS`));return this.movement.set(e,t),this.touchMovementEnabled&&this.movement.add(this.touchMovement),this.movement.clampLength(0,1)}setVirtualMovement(e,t){this.virtualMovement.set(e,t).clampLength(0,1),this.virtualMovementEnabled=!0}isRunning(){return this.virtualMovementEnabled?this.virtualRunning:this.touchRunning||this.pressed.has(`ShiftLeft`)||this.pressed.has(`ShiftRight`)}setVirtualRunning(e){this.virtualRunning=e}consumeJump(){let e=this.jumpQueued||this.virtualJumpQueued||this.touchJumpQueued;return this.jumpQueued=!1,this.virtualJumpQueued=!1,this.touchJumpQueued=!1,e}queueVirtualJump(){this.virtualJumpQueued=!0}clearVirtualMovement(){this.virtualMovement.set(0,0),this.virtualMovementEnabled=!1,this.virtualRunning=!1,this.virtualJumpQueued=!1}setTouchMovement(e,t){this.touchMovement.set(e,t).clampLength(0,1),this.touchMovementEnabled=!0,this.markInteracted()}clearTouchMovement(){this.touchMovement.set(0,0),this.touchMovementEnabled=!1}setTouchRunning(e){this.touchRunning=e,e&&this.markInteracted()}queueTouchJump(){this.touchJumpQueued=!0,this.markInteracted()}addTouchOrbitDelta(e,t){this.orbitDelta.x+=C.clamp(e,-180,180),this.orbitDelta.y+=C.clamp(t,-180,180),this.markInteracted()}addTouchZoomDelta(e){this.zoomDelta+=C.clamp(e,-2,2),e!==0&&this.markInteracted()}clearTouchInput(){this.clearTouchMovement(),this.touchRunning=!1,this.touchJumpQueued=!1}consumeOrbitDelta(e){e.copy(this.orbitDelta),this.orbitDelta.set(0,0)}consumeZoomDelta(){let e=this.zoomDelta;return this.zoomDelta=0,e}dispose(){window.removeEventListener(`keydown`,this.handleKeyDown),window.removeEventListener(`keyup`,this.handleKeyUp),window.removeEventListener(`blur`,this.handleBlur),this.canvas.removeEventListener(`pointerdown`,this.handlePointerDown),this.canvas.removeEventListener(`pointermove`,this.handlePointerMove),this.canvas.removeEventListener(`pointerup`,this.handlePointerUp),this.canvas.removeEventListener(`pointercancel`,this.handlePointerUp),this.canvas.removeEventListener(`wheel`,this.handleWheel),this.canvas.removeEventListener(`contextmenu`,this.handleContextMenu)}markInteracted(){this.interacted||(this.interacted=!0,this.onFirstInteraction?.())}handleKeyDown=e=>{let t=e.target;t instanceof HTMLElement&&t.closest(`input, button, select, textarea, [contenteditable="true"]`)||(e.code===`KeyW`||e.code===`KeyA`||e.code===`KeyS`||e.code===`KeyD`||e.code===`ShiftLeft`||e.code===`ShiftRight`||e.code===`Space`)&&(e.preventDefault(),this.pressed.add(e.code),e.code===`Space`&&!e.repeat&&(this.jumpQueued=!0),this.markInteracted())};handleKeyUp=e=>{this.pressed.delete(e.code)};handleBlur=()=>{this.pressed.clear(),this.jumpQueued=!1,this.clearTouchInput(),this.activePointer=null,document.body.classList.remove(`is-orbiting`)};handlePointerDown=e=>{e.pointerType!==`touch`&&(e.button===0||e.button===2)&&(this.activePointer=e.pointerId,this.lastPointer.set(e.clientX,e.clientY),this.canvas.setPointerCapture(e.pointerId),document.body.classList.add(`is-orbiting`),this.markInteracted())};handlePointerMove=e=>{e.pointerType!==`touch`&&e.pointerId===this.activePointer&&(this.orbitDelta.x+=e.clientX-this.lastPointer.x,this.orbitDelta.y+=e.clientY-this.lastPointer.y,this.lastPointer.set(e.clientX,e.clientY))};handlePointerUp=e=>{e.pointerType!==`touch`&&e.pointerId===this.activePointer&&(this.activePointer=null,document.body.classList.remove(`is-orbiting`),this.canvas.hasPointerCapture(e.pointerId)&&this.canvas.releasePointerCapture(e.pointerId))};handleWheel=e=>{e.preventDefault(),this.zoomDelta+=Math.sign(e.deltaY)*Math.min(1.5,Math.abs(e.deltaY)/120),this.markInteracted()};handleContextMenu=e=>{e.preventDefault()}},ho=.12,go=72,_o={orbitX:0,orbitY:0,zoom:0};function vo(e,t,n,r,i){let a=Math.max(1,i),o=e-n,s=t-r,c=Math.hypot(o,s);if(c<1e-6)return{horizontal:0,forward:0,visualX:0,visualY:0};let l=o/c,u=s/c,d=Math.min(1,c/a),f=d<=ho?0:(d-ho)/.88,p=Math.min(c,a);return{horizontal:f===0?0:l*f,forward:f===0?0:-u*f,visualX:l*p,visualY:u*p}}function yo(e,t){return e>0||t}var bo=class{points=new Map;start(e,t,n){return!this.points.has(e)&&this.points.size>=2?!1:(this.points.set(e,{x:t,y:n}),!0)}move(e,t,n){let r=this.points.get(e);if(!r)return _o;if(this.points.size===1){let e=t-r.x,i=n-r.y;return r.x=t,r.y=n,{orbitX:e,orbitY:i,zoom:0}}let i=this.getPinchDistance();r.x=t,r.y=n;let a=this.getPinchDistance();return{orbitX:0,orbitY:0,zoom:i===null||a===null?0:(i-a)/go}}end(e){this.points.delete(e)}clear(){this.points.clear()}get pointerCount(){return this.points.size}getPinchDistance(){let e,t;for(let n of this.points.values())if(!e)e=n;else{t=n;break}return e&&t?Math.hypot(t.x-e.x,t.y-e.y):null}};function xo(e){let t=document.querySelector(e);if(!t)throw Error(`Mobile control element is missing: ${e}`);return t}function So(e){return e.pointerType===`touch`}var Co=class{canvas;input;root=xo(`[data-mobile-controls]`);stick=xo(`[data-touch-move]`);stickThumb=xo(`[data-touch-move-thumb]`);runButton=xo(`[data-touch-run]`);jumpButton=xo(`[data-touch-jump]`);coarsePointer=window.matchMedia(`(any-pointer: coarse)`);gesture=new bo;movementPointer=null;runPointer=null;jumpPointer=null;active=!1;constructor(e,t){this.canvas=e,this.input=t,this.stick.addEventListener(`pointerdown`,this.handleMoveStart),this.stick.addEventListener(`pointermove`,this.handleMove),this.stick.addEventListener(`pointerup`,this.handleMoveEnd),this.stick.addEventListener(`pointercancel`,this.handleMoveEnd),this.stick.addEventListener(`lostpointercapture`,this.handleMoveEnd),this.runButton.addEventListener(`pointerdown`,this.handleRunStart),this.runButton.addEventListener(`pointerup`,this.handleRunEnd),this.runButton.addEventListener(`pointercancel`,this.handleRunEnd),this.runButton.addEventListener(`lostpointercapture`,this.handleRunEnd),this.jumpButton.addEventListener(`pointerdown`,this.handleJumpStart),this.jumpButton.addEventListener(`pointerup`,this.handleJumpEnd),this.jumpButton.addEventListener(`pointercancel`,this.handleJumpEnd),this.jumpButton.addEventListener(`lostpointercapture`,this.handleJumpEnd),this.canvas.addEventListener(`pointerdown`,this.handleGestureStart),this.canvas.addEventListener(`pointermove`,this.handleGestureMove),this.canvas.addEventListener(`pointerup`,this.handleGestureEnd),this.canvas.addEventListener(`pointercancel`,this.handleGestureEnd),this.canvas.addEventListener(`lostpointercapture`,this.handleGestureEnd),window.addEventListener(`blur`,this.handleReset),window.addEventListener(`orientationchange`,this.handleReset),document.addEventListener(`visibilitychange`,this.handleVisibilityChange),this.coarsePointer.addEventListener(`change`,this.handleCapabilityChange),yo(navigator.maxTouchPoints,this.coarsePointer.matches)&&this.activate()}dispose(){this.reset(),this.stick.removeEventListener(`pointerdown`,this.handleMoveStart),this.stick.removeEventListener(`pointermove`,this.handleMove),this.stick.removeEventListener(`pointerup`,this.handleMoveEnd),this.stick.removeEventListener(`pointercancel`,this.handleMoveEnd),this.stick.removeEventListener(`lostpointercapture`,this.handleMoveEnd),this.runButton.removeEventListener(`pointerdown`,this.handleRunStart),this.runButton.removeEventListener(`pointerup`,this.handleRunEnd),this.runButton.removeEventListener(`pointercancel`,this.handleRunEnd),this.runButton.removeEventListener(`lostpointercapture`,this.handleRunEnd),this.jumpButton.removeEventListener(`pointerdown`,this.handleJumpStart),this.jumpButton.removeEventListener(`pointerup`,this.handleJumpEnd),this.jumpButton.removeEventListener(`pointercancel`,this.handleJumpEnd),this.jumpButton.removeEventListener(`lostpointercapture`,this.handleJumpEnd),this.canvas.removeEventListener(`pointerdown`,this.handleGestureStart),this.canvas.removeEventListener(`pointermove`,this.handleGestureMove),this.canvas.removeEventListener(`pointerup`,this.handleGestureEnd),this.canvas.removeEventListener(`pointercancel`,this.handleGestureEnd),this.canvas.removeEventListener(`lostpointercapture`,this.handleGestureEnd),window.removeEventListener(`blur`,this.handleReset),window.removeEventListener(`orientationchange`,this.handleReset),document.removeEventListener(`visibilitychange`,this.handleVisibilityChange),this.coarsePointer.removeEventListener(`change`,this.handleCapabilityChange),document.body.classList.remove(`has-touch-controls`,`is-touch-orbiting`),this.root.setAttribute(`aria-hidden`,`true`)}activate(){if(this.active)return;this.active=!0,document.body.classList.add(`has-touch-controls`),this.root.setAttribute(`aria-hidden`,`false`);let e=document.querySelector(`[data-onboarding-prompt]`),t=document.querySelector(`[data-onboarding-action]`);e&&(e.textContent=`Touch and drag anywhere`),t&&(t.textContent=`SWIPE TO LOOK AROUND`)}reset(){this.movementPointer=null,this.runPointer=null,this.jumpPointer=null,this.gesture.clear(),this.input.clearTouchInput(),this.stick.classList.remove(`is-active`),this.runButton.classList.remove(`is-active`),this.jumpButton.classList.remove(`is-active`),this.runButton.setAttribute(`aria-pressed`,`false`),this.stickThumb.style.setProperty(`--touch-x`,`0px`),this.stickThumb.style.setProperty(`--touch-y`,`0px`),this.stick.setAttribute(`aria-valuetext`,`Centered`),document.body.classList.remove(`is-touch-orbiting`)}updateMovement(e){let t=this.stick.getBoundingClientRect(),n=Math.min(t.width,t.height)*.36,r=vo(e.clientX,e.clientY,t.left+t.width*.5,t.top+t.height*.5,n);this.stickThumb.style.setProperty(`--touch-x`,`${r.visualX.toFixed(2)}px`),this.stickThumb.style.setProperty(`--touch-y`,`${r.visualY.toFixed(2)}px`),this.stick.setAttribute(`aria-valuetext`,`Horizontal ${r.horizontal.toFixed(2)}, forward ${r.forward.toFixed(2)}`),this.input.setTouchMovement(r.horizontal,r.forward)}capturePointer(e,t){try{e.setPointerCapture(t)}catch{}}releasePointer(e,t){try{e.hasPointerCapture(t)&&e.releasePointerCapture(t)}catch{}}handleMoveStart=e=>{!So(e)||this.movementPointer!==null||(e.preventDefault(),this.activate(),this.movementPointer=e.pointerId,this.capturePointer(this.stick,e.pointerId),this.stick.classList.add(`is-active`),this.updateMovement(e))};handleMove=e=>{e.pointerId===this.movementPointer&&(e.preventDefault(),this.updateMovement(e))};handleMoveEnd=e=>{e.pointerId===this.movementPointer&&(e.preventDefault(),this.releasePointer(this.stick,e.pointerId),this.movementPointer=null,this.input.clearTouchMovement(),this.stick.classList.remove(`is-active`),this.stickThumb.style.setProperty(`--touch-x`,`0px`),this.stickThumb.style.setProperty(`--touch-y`,`0px`),this.stick.setAttribute(`aria-valuetext`,`Centered`))};handleRunStart=e=>{!So(e)||this.runPointer!==null||(e.preventDefault(),this.activate(),this.runPointer=e.pointerId,this.capturePointer(this.runButton,e.pointerId),this.runButton.classList.add(`is-active`),this.runButton.setAttribute(`aria-pressed`,`true`),this.input.setTouchRunning(!0))};handleRunEnd=e=>{e.pointerId===this.runPointer&&(e.preventDefault(),this.releasePointer(this.runButton,e.pointerId),this.runPointer=null,this.runButton.classList.remove(`is-active`),this.runButton.setAttribute(`aria-pressed`,`false`),this.input.setTouchRunning(!1))};handleJumpStart=e=>{!So(e)||this.jumpPointer!==null||(e.preventDefault(),this.activate(),this.jumpPointer=e.pointerId,this.capturePointer(this.jumpButton,e.pointerId),this.jumpButton.classList.add(`is-active`),this.input.queueTouchJump())};handleJumpEnd=e=>{e.pointerId===this.jumpPointer&&(e.preventDefault(),this.releasePointer(this.jumpButton,e.pointerId),this.jumpPointer=null,this.jumpButton.classList.remove(`is-active`))};handleGestureStart=e=>{!So(e)||!this.gesture.start(e.pointerId,e.clientX,e.clientY)||(e.preventDefault(),this.activate(),this.capturePointer(this.canvas,e.pointerId),document.body.classList.add(`is-touch-orbiting`))};handleGestureMove=e=>{if(!So(e))return;let t=this.gesture.move(e.pointerId,e.clientX,e.clientY);(t.orbitX!==0||t.orbitY!==0||t.zoom!==0)&&(e.preventDefault(),this.input.addTouchOrbitDelta(t.orbitX,t.orbitY),this.input.addTouchZoomDelta(t.zoom))};handleGestureEnd=e=>{So(e)&&(this.releasePointer(this.canvas,e.pointerId),this.gesture.end(e.pointerId),this.gesture.pointerCount===0&&document.body.classList.remove(`is-touch-orbiting`))};handleReset=()=>{this.reset()};handleVisibilityChange=()=>{document.hidden&&this.reset()};handleCapabilityChange=e=>{e.matches&&this.activate()}},wo=class extends oe{constructor(){super(),this.name=`RoomEnvironment`,this.position.y=-3.5;let e=new ae;e.deleteAttribute(`uv`);let n=new Ge({side:1}),r=new Ge,i=new t(16777215,900,28,2);i.position.set(.418,16.199,.3),this.add(i);let a=new L(e,n);a.position.set(-.757,13.219,.717),a.scale.set(31.713,28.305,28.591),this.add(a);let o=new h(e,r,6),s=new A;s.position.set(-10.906,2.009,1.846),s.rotation.set(0,-.195,0),s.scale.set(2.328,7.905,4.651),s.updateMatrix(),o.setMatrixAt(0,s.matrix),s.position.set(-5.607,-.754,-.758),s.rotation.set(0,.994,0),s.scale.set(1.97,1.534,3.955),s.updateMatrix(),o.setMatrixAt(1,s.matrix),s.position.set(6.167,.857,7.803),s.rotation.set(0,.561,0),s.scale.set(3.927,6.285,3.687),s.updateMatrix(),o.setMatrixAt(2,s.matrix),s.position.set(-2.017,.018,6.124),s.rotation.set(0,.333,0),s.scale.set(2.002,4.566,2.064),s.updateMatrix(),o.setMatrixAt(3,s.matrix),s.position.set(2.291,-.756,-2.621),s.rotation.set(0,-.286,0),s.scale.set(1.546,1.552,1.496),s.updateMatrix(),o.setMatrixAt(4,s.matrix),s.position.set(-2.193,-.369,-5.547),s.rotation.set(0,.516,0),s.scale.set(3.875,3.487,2.986),s.updateMatrix(),o.setMatrixAt(5,s.matrix),this.add(o);let c=new L(e,To(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);let l=new L(e,To(50));l.position.set(-16.109,18.021,-8.207),l.scale.set(.1,2.425,2.751),this.add(l);let u=new L(e,To(17));u.position.set(14.904,12.198,-1.832),u.scale.set(.15,4.265,6.331),this.add(u);let d=new L(e,To(43));d.position.set(-.462,8.89,14.52),d.scale.set(4.38,5.441,.088),this.add(d);let f=new L(e,To(20));f.position.set(3.235,11.486,-12.541),f.scale.set(2.5,2,.1),this.add(f);let p=new L(e,To(100));p.position.set(0,20,0),p.scale.set(1,.1,1),this.add(p)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function To(e){return new $e({color:0,emissive:16777215,emissiveIntensity:e})}var Eo=class{group=new V;rimLight;capeFill;target=new A;environmentTarget;rimOffset=new p(-2.8,4.7,3.2);targetOffset=new p(0,1.05,0);fillOffset=new p(0,1.4,.85);constructor(e,n){this.group.name=`Cinematic fill lighting`;let r=new te(7904401,1510409,.36),i=new Ce(5272942,.15);this.rimLight=new dt(7523775,13,15,.63,.9,1.5),this.rimLight.target=this.target,this.capeFill=new t(13187883,2.8,4.5,2),this.group.add(r,i,this.rimLight,this.target,this.capeFill);let a=new gn(n),o=new wo;this.environmentTarget=a.fromScene(o,.06),e.environment=this.environmentTarget.texture,e.environmentIntensity=.24,o.dispose(),a.dispose()}update(e,t){this.rimLight.position.copy(e).add(this.rimOffset),this.target.position.copy(e).add(this.targetOffset),this.capeFill.position.copy(e).add(this.fillOffset),this.capeFill.intensity=2.6+Math.sin(t*1.7)*.18}dispose(){this.environmentTarget.dispose()}};function Do(e){return[e.x,e.y,e.z]}function Oo(e){return{left:Do(e.left),right:Do(e.right),back:Do(e.back)}}function ko(e){return e.map(e=>({start:Do(e.start),end:Do(e.end),radius:e.radius,depthRadius:e.depthRadius,name:e.name,clearance:e.clearance,faceSampleSpacing:e.faceSampleSpacing}))}function Ao(e){let t=new Float32Array(e.length*6);return e.forEach((e,n)=>{e.start.toArray(t,n*6),e.end.toArray(t,n*6+3)}),t}function jo(e){return e.map(e=>bt(e)?{shape:`convex-rock`,center:Do(e.center),radius:e.radius,walkable:e.walkable,kind:e.kind,boundsMin:Do(e.bounds.min),boundsMax:Do(e.bounds.max),faces:e.faces.map(e=>({a:Do(e.triangle.a),b:Do(e.triangle.b),c:Do(e.triangle.c),normal:Do(e.normal),planeConstant:e.planeConstant,boundsMin:Do(e.bounds.min),boundsMax:Do(e.bounds.max)}))}:{shape:`sphere`,center:Do(e.center),radius:e.radius,walkable:e.walkable,kind:e.kind})}function Mo(){let e=Math.max(2,navigator.hardwareConcurrency||4);return Math.max(1,Math.min(10,e-2))}var No=class{serializedWorldColliders;maximumWorkers=Mo();slots=[];registrations=new Map;drainWaiters=new Set;failure=null;disposed=!1;constructor(e){this.serializedWorldColliders=jo(e)}registerCape(e,t,n,r){if(this.disposed||this.failure||typeof Worker>`u`)return!1;this.unregisterCape(e);let i=this.slots.length<this.maximumWorkers?this.createSlot():this.leastLoadedSlot(),a={slot:i,revision:0,latestState:null};this.registrations.set(e,a),i.capeIds.add(e);let o=t.copyPackedState();return this.post(i.worker,{type:`add-cape`,capeId:e,revision:a.revision,anchors:Oo(n),bodyColliders:ko(r),settings:t.getSettings(),positions:o.positions,previous:o.previous},[o.positions.buffer,o.previous.buffer]),!this.failure}updateCape(e,t,n){let r=this.registrations.get(e);if(!r||this.failure)return;r.revision+=1,r.latestState=null;let i=t.copyPackedState();this.post(r.slot.worker,{type:`update-cape`,capeId:e,revision:r.revision,anchors:Oo(n),settings:t.getSettings(),positions:i.positions,previous:i.previous},[i.positions.buffer,i.previous.buffer])}unregisterCape(e){let t=this.registrations.get(e);t&&(this.registrations.delete(e),t.slot.capeIds.delete(e),this.post(t.slot.worker,{type:`remove-cape`,capeId:e}))}enqueueStep(e,t,n){if(this.failure||this.disposed||this.registrations.size===0)return;let r=new Map(n.map(e=>[e.capeId,e]));for(let n of this.slots){let i=[...n.capeIds].flatMap(e=>{let t=r.get(e);return t?[{capeId:e,anchors:Oo(t.anchors),bodyColliderEndpoints:Ao(t.bodyColliders),characterVelocity:Do(t.characterVelocity)}]:[]});i.length>0&&n.pendingFrames.push({deltaTime:e,time:t,capes:i})}}flush(){this.failure||this.disposed||this.slots.forEach(e=>this.dispatch(e))}consumeLatestState(e){let t=this.registrations.get(e);if(!t)return null;let n=t.latestState;return t.latestState=null,n}isDrivingCape(e){return!this.failure&&this.registrations.has(e)}async synchronize(){this.flush(),!(this.failure||this.isDrained())&&await new Promise(e=>this.drainWaiters.add(e))}getDiagnostics(){return{active:!this.disposed&&!this.failure&&this.registrations.size>0,workers:this.slots.length,busyWorkers:this.slots.filter(e=>e.busy).length,queuedSteps:this.slots.reduce((e,t)=>e+t.pendingFrames.length,0),failure:this.failure}}dispose(){if(!this.disposed){this.disposed=!0;for(let e of this.slots)this.post(e.worker,{type:`dispose`}),e.worker.terminate();this.slots.length=0,this.registrations.clear(),this.resolveDrainWaiters()}}createSlot(){let e=new Worker(new URL(`/cape-physics/pr-preview/pr-22/assets/CapePhysicsWorker-7KAsLMx4.js`,``+import.meta.url),{type:`module`,name:`cape-physics-${this.slots.length+1}`}),t={worker:e,capeIds:new Set,pendingFrames:[],busy:!1,nextRequestId:1};return e.onmessage=e=>{this.handleResponse(t,e.data)},e.onerror=e=>{e.preventDefault(),this.disable(`Cape worker failed: ${e.message||`unknown worker error`}`)},e.onmessageerror=()=>{this.disable(`Cape worker returned an unreadable message.`)},this.slots.push(t),this.post(e,{type:`initialize`,worldColliders:this.serializedWorldColliders}),t}leastLoadedSlot(){let e=[...this.slots].sort((e,t)=>e.capeIds.size-t.capeIds.size)[0];if(!e)throw Error(`Cape worker pool has no worker slots.`);return e}dispatch(e){if(e.busy||e.pendingFrames.length===0||this.failure)return;let t=e.pendingFrames.splice(0),n=t.flatMap(e=>e.capes.map(e=>e.bodyColliderEndpoints.buffer));e.busy=!0,this.post(e.worker,{type:`step-batch`,requestId:e.nextRequestId,frames:t},n),e.nextRequestId+=1}handleResponse(e,t){if(t.type===`failure`){this.disable(`Cape worker solver failed: ${t.message}`);return}e.busy=!1;for(let n of t.states){let t=this.registrations.get(n.capeId);!t||t.slot!==e||t.revision===n.revision&&(t.latestState={positions:n.positions,previous:n.previous})}this.dispatch(e),this.isDrained()&&this.resolveDrainWaiters()}post(e,t,n=[]){if(!(this.failure||this.disposed))try{e.postMessage(t,{transfer:n})}catch(e){this.disable(`Could not submit cape worker work: ${e instanceof Error?e.message:String(e)}`)}}disable(e){this.failure||(this.failure=e,console.error(e),this.slots.forEach(e=>e.worker.terminate()),this.resolveDrainWaiters())}isDrained(){return this.slots.every(e=>!e.busy&&e.pendingFrames.length===0)}resolveDrainWaiters(){this.drainWaiters.forEach(e=>e()),this.drainWaiters.clear()}},Po=Object.freeze({min:0,max:10,step:1}),Fo=8,Io=.61,Lo=1.15,Ro=Math.PI/2,zo=Math.PI*(3-Math.sqrt(5));function Bo(e){return Number.isFinite(e)?C.clamp(Math.round(e),Po.min,Po.max):Po.min}var Vo=class{movement=new j;headingOffset;phaseOffset;constructor(e){this.headingOffset=e*zo,this.phaseOffset=e*Io}update(e){let t=C.euclideanModulo(e+this.phaseOffset,Fo),n=Math.floor(t/2);if(t-n*2>=Lo){this.movement.set(0,0);return}let r=this.headingOffset+n*Ro;this.movement.set(Math.sin(r),Math.cos(r))}getMovement(){return this.movement}isRunning(){return!1}consumeJump(){return!1}},Ho=class{rig;walkPhase=0;gaitBlend=0;gaitBob=0;runningBlend=0;airborneBlend=0;jumpPhase=0;constructor(e){this.rig=e}reset(){this.walkPhase=0,this.gaitBlend=0,this.gaitBob=0,this.runningBlend=0,this.airborneBlend=0,this.jumpPhase=0,this.rig.body.position.y=0,this.rig.body.rotation.set(0,0,0),this.rig.leftArm.rotation.x=-.08,this.rig.rightArm.rotation.x=-.08,this.rig.leftLeg.rotation.x=0,this.rig.rightLeg.rotation.x=0,this.rig.leftFoot.rotation.x=0,this.rig.rightFoot.rotation.x=0}update(e,t,n,r){let i=C.smoothstep(t,.04,Y.walkSpeed*.45);this.gaitBlend=Ot(this.gaitBlend,i,i>this.gaitBlend?12:9,e);let a=this.gaitBlend;this.runningBlend=C.smoothstep(t,Y.walkSpeed*1.02,Y.runSpeed*.9),this.walkPhase+=e*C.lerp(6.4,10.8,this.runningBlend)*a,this.airborneBlend=Ot(this.airborneBlend,+!n,n?14:22,e),n?this.airborneBlend<.02&&(this.jumpPhase=0):this.jumpPhase=C.clamp(.5-r/(Y.jumpSpeed*2),0,1);let o=Math.sin(this.walkPhase)*a,s=C.lerp(.55,.78,this.runningBlend),c=o*s,l=-o*s,u=C.lerp(.38,.58,this.runningBlend),d=-o*u-.08,f=o*u-.08,p=Math.sin(this.jumpPhase*Math.PI),m=C.smoothstep(this.jumpPhase,.62,1),h=Math.sin(this.jumpPhase*Math.PI*2)*.055,g=.16+p*.38-m*.24+h,_=.06+p*.26-m*.18-h,v=.28+p*.58-m*.16,y=-.16+p*.34+m*.18;this.rig.leftLeg.rotation.x=C.lerp(c,g,this.airborneBlend),this.rig.rightLeg.rotation.x=C.lerp(l,_,this.airborneBlend),this.rig.leftArm.rotation.x=C.lerp(d,v+h,this.airborneBlend),this.rig.rightArm.rotation.x=C.lerp(f,v-h,this.airborneBlend),this.rig.leftFoot.rotation.x=C.lerp(-o*.14,y+h,this.airborneBlend),this.rig.rightFoot.rotation.x=C.lerp(o*.14,y-h,this.airborneBlend),this.gaitBob=Math.abs(Math.sin(this.walkPhase*2))*C.lerp(.018,.046,this.runningBlend)*a*(1-this.airborneBlend),this.rig.body.position.y=this.gaitBob+Math.sin(this.jumpPhase*Math.PI)*.012*this.airborneBlend,this.rig.body.rotation.x=C.lerp(-this.runningBlend*a*.035,.025,this.airborneBlend),this.rig.body.rotation.z=-o*C.lerp(.014,.024,this.runningBlend)*(1-this.airborneBlend)}getDiagnostics(){return{bob:this.gaitBob,runningBlend:this.runningBlend,airborneBlend:this.airborneBlend,jumpPhase:this.jumpPhase,armAngles:[this.rig.leftArm.rotation.x,this.rig.rightArm.rotation.x],legAngles:[this.rig.leftLeg.rotation.x,this.rig.rightLeg.rotation.x],footAngles:[this.rig.leftFoot.rotation.x,this.rig.rightFoot.rotation.x]}}};function Uo(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new P,l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let e in d.morphAttributes){if(!i.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;o[e]===void 0&&(o[e]=[]),o[e].push(d.morphAttributes[e])}if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=Wo(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=Wo(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}}return c}function Wo(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let s=new t(a),c=new o(s,n,r),l=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=l/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);c.setComponent(t+e,i,n)}}else s.set(r.array,l);l+=r.count*n}return i!==void 0&&(c.gpuType=i),c}var Go=`Cape neckline seam`,Ko=`Paired cape throat ties`,qo=[0,1.505,-.17];function Jo(e,t){let n=C.clamp(e,0,1),r=Math.sin(n*Math.PI);return t.set(C.lerp(-J.attachment.halfWidth,J.attachment.halfWidth,n),J.attachment.height+r*J.attachment.necklineRise,J.attachment.depth+r*J.attachment.necklineDepth)}function Yo(e,t){let n=new V;n.name=`Cape neck attachment`;let r=Array.from({length:J.columns},(e,t)=>Jo(t/(J.columns-1),new p)),i=new ue(r,!1,`centripetal`),a=new B(i,28,.022,7,!1),o=new L(a,e);o.name=Go;let s=Xo(-1),c=Xo(1),l=Uo([s,c]);if(s.dispose(),c.dispose(),!l)throw Error(`Unable to merge procedural cape throat ties.`);let u=new L(l,t);return u.name=Ko,n.add(o,u),n}function Xo(e){let[t,n,r]=qo,i=new ue([new p(t+e*.006,n,r),new p(e*.065,1.52,-.045),new p(e*J.attachment.halfWidth,J.attachment.height,J.attachment.depth)],!1,`centripetal`);return new B(i,10,.008,6,!1)}var Zo=`Traveller face`,Qo=`Fitted helmet shell and cheek guards`,$o=`Flush helmet brow and temple trim`;function es(e,t,n){let r=new V;r.name=`Proportioned procedural head`;let i=ns([ts(new d(.155,20,14),new p(0,1.69,-.004),new p(.82,1.08,.88)),ts(new Se(.023,.055,7),new p(0,1.68,-.137),new p(1,1,1),new Xe(-Math.PI/2,0,0)),ts(new d(.024,8,6),new p(-.118,1.69,-.002),new p(.55,1,.72)),ts(new d(.024,8,6),new p(.118,1.69,-.002),new p(.55,1,.72))],`face`),a=new L(i,e);a.name=Zo;let o=ns([ts(new d(.176,20,14,0,Math.PI*2,0,Math.PI*.47),new p(0,1.72,0),new p(.92,1,.96)),ts(new x(.022,.115,4,8),new p(-.14,1.66,-.006),new p(1,1,1.2)),ts(new x(.022,.115,4,8),new p(.14,1.66,-.006),new p(1,1,1.2)),ts(new d(.012,8,6),new p(-.045,1.705,-.143),new p(1.25,.68,.5)),ts(new d(.012,8,6),new p(.045,1.705,-.143),new p(1.25,.68,.5)),ts(new ae(.052,.007,.006),new p(0,1.635,-.137))],`helmet shell`),s=new L(o,t);s.name=Qo;let c=ns([ts(new ae(.226,.018,.018),new p(0,1.744,-.166)),ts(new d(.022,8,6),new p(-.145,1.742,-.035),new p(.65,1,1)),ts(new d(.022,8,6),new p(.145,1.742,-.035),new p(.65,1,1))],`helmet trim`),l=new L(c,n);return l.name=$o,r.add(a,s,l),r}function ts(e,t,n=new p(1,1,1),r=new Xe){let i=new fe().compose(t,new tt().setFromEuler(r),n);return e.applyMatrix4(i),e}function ns(e,t){let n=Uo(e,!1);if(e.forEach(e=>e.dispose()),!n)throw Error(`Unable to merge procedural ${t} geometry.`);return n.computeBoundingBox(),n.computeBoundingSphere(),n}var rs=16,is=[{y:.95,halfWidth:.18,halfDepth:.13},{y:1.12,halfWidth:.19,halfDepth:.137},{y:1.34,halfWidth:.205,halfDepth:.145},{y:1.4,halfWidth:.218,halfDepth:.13},{y:1.46,halfWidth:.165,halfDepth:.105},{y:1.5,halfWidth:.085,halfDepth:.065}];function as(){let e=[],t=[],n=[];for(let n of is)for(let r=0;r<=rs;r+=1){let i=r/rs,a=i*Math.PI*2;e.push(Math.cos(a)*n.halfWidth,n.y,Math.sin(a)*n.halfDepth),t.push(i,(n.y-is[0].y)/ss())}for(let e=0;e<is.length-1;e+=1){let t=e*17,r=(e+1)*17;for(let e=0;e<rs;e+=1){let i=t+e,a=r+e;n.push(i,a,i+1,i+1,a,a+1)}}os(e,t,n,0,!1),os(e,t,n,is.length-1,!0);let r=new P;return r.setAttribute(`position`,new qe(e,3)),r.setAttribute(`uv`,new qe(t,2)),r.setIndex(n),r.computeVertexNormals(),r.computeBoundingBox(),r.computeBoundingSphere(),r}function os(e,t,n,r,i){let a=is[r];if(!a)return;let o=e.length/3;e.push(0,a.y,0),t.push(.5,.5);let s=r*17;for(let e=0;e<rs;e+=1)i?n.push(o,s+e+1,s+e):n.push(o,s+e,s+e+1)}function ss(){let e=is[0],t=is.at(-1);return e&&t?t.y-e.y:1}var cs=`Tapered torso armor`,ls=`Fitted hip armor`,us=`Fitted leather waist strap`,ds=`Visible skin neck`,fs=`Fitted leather gorget`,ps=`Left fitted shoulder armor`,ms=`Right fitted shoulder armor`;function hs(e){e.traverse(e=>{e instanceof L&&(e.castShadow=!0,e.receiveShadow=!0)})}var gs=class{capePalette;root=new V;velocity=new p;rig=new V;leftArm=new V;rightArm=new V;leftLeg=new V;rightLeg=new V;leftFoot=new V;rightFoot=new V;leftCapeAnchor=new A;rightCapeAnchor=new A;leftAnchorWorld=new p;rightAnchorWorld=new p;backWorld=new p;capeAttachmentBounds=new y;capeAnchors={left:this.leftAnchorWorld,right:this.rightAnchorWorld,back:this.backWorld};capeColliderRig={shoulders:this.createCapeCollider(.095,`shoulders`,.008),upperTorso:this.createCapeCollider(.211,`upper torso`,.006,.07,.145),gorget:this.createCapeCollider(.109,`gorget`,.006,.03),hips:this.createCapeCollider(.198,`hips`,.008,.08),belt:this.createCapeCollider(.138,`belt strap`,.006,.04),leftArm:this.createCapeCollider(.095,`left arm`,.008,void 0,.075),rightArm:this.createCapeCollider(.095,`right arm`,.008,void 0,.075),leftThigh:this.createCapeCollider(.085,`left thigh`),leftKnee:this.createCapeCollider(.08,`left knee`),leftLowerLeg:this.createCapeCollider(.075,`left lower leg`),leftBoot:this.createCapeCollider(.095,`left boot`),rightThigh:this.createCapeCollider(.085,`right thigh`),rightKnee:this.createCapeCollider(.08,`right knee`),rightLowerLeg:this.createCapeCollider(.075,`right lower leg`),rightBoot:this.createCapeCollider(.095,`right boot`)};capeColliders=Object.values(this.capeColliderRig);animator=new Ho({body:this.rig,leftArm:this.leftArm,rightArm:this.rightArm,leftLeg:this.leftLeg,rightLeg:this.rightLeg,leftFoot:this.leftFoot,rightFoot:this.rightFoot});materials=[];capeAttachment;opacity=1;constructor(e=yt){this.capePalette=e,this.root.name=`Procedural hero`,this.root.add(this.rig),this.buildBody(),hs(this.root)}updateAnimation(e,t,n=!0,r=0){this.animator.update(e,t,n,r)}resetAnimation(){this.animator.reset()}getCapeAnchors(){return this.root.updateMatrixWorld(!0),this.leftCapeAnchor.getWorldPosition(this.leftAnchorWorld),this.rightCapeAnchor.getWorldPosition(this.rightAnchorWorld),this.backWorld.set(0,0,1).applyQuaternion(this.root.quaternion).normalize(),this.capeAnchors}getCapeColliders(){let{shoulders:e,upperTorso:t,gorget:n,hips:r,belt:i,leftArm:a,rightArm:o,leftThigh:s,leftKnee:c,leftLowerLeg:l,leftBoot:u,rightThigh:d,rightKnee:f,rightLowerLeg:p,rightBoot:m}=this.capeColliderRig;return this.setWorldCapsule(e,this.rig,[-.195,1.45,-.0115],[.195,1.45,-.0115]),this.setWorldCapsule(t,this.rig,[0,1.33,0],[0,1.11,0]),this.setWorldCapsule(n,this.rig,[0,1.49,0],[0,1.49,0]),this.setWorldCapsule(r,this.rig,[0,1.01,-.068],[0,.77,-.068]),this.setWorldCapsule(i,this.rig,[-.054,1.01,0],[.054,1.01,0]),this.setWorldCapsule(a,this.leftArm,[0,-.02,0],[0,-.69,0]),this.setWorldCapsule(o,this.rightArm,[0,-.02,0],[0,-.69,0]),this.setWorldCapsule(s,this.leftLeg,[0,-.29,0],[0,-.29,0]),this.setWorldCapsule(c,this.leftLeg,[0,-.5,0],[0,-.5,0]),this.setWorldCapsule(l,this.leftLeg,[0,-.69,0],[0,-.69,0]),this.setWorldCapsule(u,this.leftFoot,[0,-.06,-.115],[0,-.06,-.005]),this.setWorldCapsule(d,this.rightLeg,[0,-.29,0],[0,-.29,0]),this.setWorldCapsule(f,this.rightLeg,[0,-.5,0],[0,-.5,0]),this.setWorldCapsule(p,this.rightLeg,[0,-.69,0],[0,-.69,0]),this.setWorldCapsule(m,this.rightFoot,[0,-.06,-.115],[0,-.06,-.005]),this.capeColliders}setOpacity(e){let t=C.clamp(e,ft,1);Math.abs(t-this.opacity)<.002||(this.opacity=t)}getOpacity(){return this.opacity}getAnimationDiagnostics(){return this.animator.getDiagnostics()}getCapeAttachmentDiagnostics(){let e=this.getCapeAnchors();this.capeAttachmentBounds.setFromObject(this.capeAttachment);let t=0;return this.capeAttachment.traverse(e=>{e instanceof L&&(t+=1)}),{meshes:t,maximumAnchorGap:Math.max(this.capeAttachmentBounds.distanceToPoint(e.left),this.capeAttachmentBounds.distanceToPoint(e.right))}}dispose(){let e=new Set;this.root.traverse(t=>{t instanceof L&&e.add(t.geometry)}),e.forEach(e=>e.dispose()),this.materials.forEach(e=>e.dispose())}buildBody(){let e=new R({color:2766909,roughness:.38,metalness:.62,clearcoat:.2,clearcoatRoughness:.34}),t=new Ge({color:1120540,roughness:.46,metalness:.78}),n=new Ge({color:3416089,roughness:.86,metalness:.02}),r=new Ge({color:11109967,roughness:.34,metalness:.72}),i=new Ge({color:2107434,roughness:.94,metalness:0}),o=new Ge({color:9395010,roughness:.84,metalness:0}),s=new R({color:this.capePalette.attachmentColor,roughness:.78,metalness:.01,sheen:.92,sheenColor:new z(this.capePalette.sheenColor),sheenRoughness:.72,side:2});this.materials.push(e,t,n,r,i,o,s);for(let e of this.materials)e.transparent=!1,e.depthWrite=!0;let c=new L(new x(.18,.17,5,10),e);c.name=ls,c.position.y=.87,c.scale.z=.72,this.rig.add(c);let l=new L(as(),e);l.name=cs,this.rig.add(l);let u=new L(new a(.21,.178,.39,10,1,!1),t);u.position.set(0,1.255,-.064),u.scale.z=.69,this.rig.add(u);let f=new L(new a(.19,.19,.06,18,1,!0),n);f.name=us,f.position.y=1.01,f.scale.z=.72;let p=new L(new ae(.078,.064,.032),r);p.position.set(0,1.01,-.154),this.rig.add(f,p);let m=es(o,t,r);m.position.y=.018;let h=new L(new a(.067,.077,.16,12),o);h.name=ds,h.position.y=1.555;let g=new L(new rt(.132,.019,6,20),n);g.name=fs,g.rotation.x=Math.PI/2,g.position.y=1.49,g.scale.set(1,.68,.76);let _=new L(new d(.032,10,8),r);_.name=`Cape throat clasp`,_.position.fromArray(qo),_.scale.z=.45,this.rig.add(m,h,g,_),this.createArm(this.leftArm,-1,e,t,n),this.createArm(this.rightArm,1,e,t,n),this.createLeg(this.leftLeg,this.leftFoot,-1,i,t),this.createLeg(this.rightLeg,this.rightFoot,1,i,t),this.rig.add(this.leftArm,this.rightArm,this.leftLeg,this.rightLeg);let v=new d(.08,12,8,0,Math.PI*2,0,Math.PI*.62),y=new L(v,e);y.name=ps,y.position.set(-.195,1.445,0),y.scale.set(1.06,.76,1),y.rotation.z=.35;let b=y.clone();b.name=ms,b.position.x=.195,b.rotation.z=-.35,this.rig.add(y,b),this.capeAttachment=Yo(s,r),this.rig.add(this.capeAttachment),this.leftCapeAnchor.position.set(-J.attachment.halfWidth,J.attachment.height,J.attachment.depth),this.rightCapeAnchor.position.set(J.attachment.halfWidth,J.attachment.height,J.attachment.depth),this.rig.add(this.leftCapeAnchor,this.rightCapeAnchor)}createArm(e,t,n,r,i){e.position.set(t*.205,1.405,0),e.rotation.z=t*-.08;let o=new L(new a(.068,.06,.42,9),i);o.position.y=-.215;let s=new L(new a(.066,.05,.31,9),n);s.position.y=-.545;let c=new L(new d(.056,9,7),r);c.position.y=-.72,e.add(o,s,c)}createLeg(e,t,n,r,i){e.position.set(n*.095,.79,0);let o=new L(new a(.085,.074,.42,9),r);o.position.y=-.22;let s=new L(new a(.074,.056,.4,9),i);s.position.y=-.62;let c=new L(new ae(.13,.13,.25),i);t.position.y=-.8,c.position.set(0,-.06,-.06),t.add(c),e.add(o,s,t)}setWorldCapsule(e,t,n,r){t.localToWorld(e.start.set(...n)),t.localToWorld(e.end.set(...r))}createCapeCollider(e,t,n,r,i){return{start:new p,end:new p,radius:e,depthRadius:i,name:t,clearance:n,faceSampleSpacing:r}}},_s=class{character;input;worldCollision;desiredVelocity=new p;cameraForward=new p;cameraRight=new p;running=!1;grounded=!0;verticalVelocity=0;landingImpactSpeed=0;turnRate=0;constructor(e,t,n){this.character=e,this.input=t,this.worldCollision=n}update(e,t){let n=this.input.getMovement();if(this.cameraForward.set(-Math.sin(t),0,-Math.cos(t)),this.cameraRight.set(Math.cos(t),0,-Math.sin(t)),this.desiredVelocity.set(0,0,0).addScaledVector(this.cameraRight,n.x).addScaledVector(this.cameraForward,n.y),this.running=this.desiredVelocity.lengthSq()>0&&this.input.isRunning(),this.desiredVelocity.lengthSq()>0){let e=this.running?Y.runSpeed:Y.walkSpeed;this.desiredVelocity.normalize().multiplyScalar(e)}let r=this.desiredVelocity.lengthSq()>0?Y.acceleration:Y.deceleration,i=1-Math.exp(-r*e);this.character.velocity.x=C.lerp(this.character.velocity.x,this.desiredVelocity.x,i),this.character.velocity.z=C.lerp(this.character.velocity.z,this.desiredVelocity.z,i),this.character.velocity.x*this.character.velocity.x+this.character.velocity.z*this.character.velocity.z<1e-4&&(this.character.velocity.x=0,this.character.velocity.z=0),this.input.consumeJump()&&this.grounded&&(this.verticalVelocity=Y.jumpSpeed,this.grounded=!1),this.grounded?this.verticalVelocity=0:this.verticalVelocity-=Y.gravity*e,this.character.velocity.y=this.verticalVelocity;let a=this.grounded,o=this.character.root.position.y;this.character.root.position.addScaledVector(this.character.velocity,e);let s=this.worldCollision.resolvePlayer(this.character.root.position,{previousY:o,velocityY:this.verticalVelocity,grounded:this.grounded});this.grounded=s.grounded,!a&&this.grounded&&this.verticalVelocity<0&&(this.landingImpactSpeed=-this.verticalVelocity),(s.grounded&&this.verticalVelocity<0||s.hitCeiling&&this.verticalVelocity>0)&&(this.verticalVelocity=0,this.character.velocity.y=0);let c=Math.hypot(this.character.velocity.x,this.character.velocity.z);if(c>.08){let t=Math.atan2(-this.character.velocity.x,-this.character.velocity.z),n=Math.atan2(Math.sin(t-this.character.root.rotation.y),Math.cos(t-this.character.root.rotation.y)),r=C.smoothstep(c,.08,Y.runSpeed),i=C.lerp(Y.walkTurnRate,Y.runTurnRate,r),a=C.clamp(n*Y.turnResponse,-i,i);this.turnRate=Ot(this.turnRate,a,C.lerp(7,12,r),e);let o=C.clamp(this.turnRate*e,-Math.abs(n),Math.abs(n)),s=this.character.root.rotation.y+o;this.character.root.rotation.y=Math.atan2(Math.sin(s),Math.cos(s))}else this.turnRate=Ot(this.turnRate,0,10,e);this.character.updateAnimation(e,c,this.grounded,this.verticalVelocity)}isRunning(){return this.running}isGrounded(){return this.grounded}consumeLandingImpact(){let e=this.landingImpactSpeed;return this.landingImpactSpeed=0,e}resetVerticalState(){this.grounded=!0,this.verticalVelocity=0,this.landingImpactSpeed=0,this.character.velocity.y=0}reset(){this.desiredVelocity.set(0,0,0),this.running=!1,this.grounded=!0,this.verticalVelocity=0,this.landingImpactSpeed=0,this.turnRate=0,this.character.velocity.set(0,0,0),this.character.resetAnimation()}},vs=.16,ys=.11,bs=.13;function xs(e,t){return Math.max(Math.abs(e[0]-t[0]),Math.abs(e[1]-t[1]),Math.abs(e[2]-t[2]),Math.abs(e[3]-t[3]))}async function Ss(e,t,n){let r=n.getCharacterOpacity(),i=t.getWorldDirection(new p),a=new pe(bs,bs),o=new re({color:2162544,side:2,toneMapped:!1}),s=new re({color:13639935,side:2,toneMapped:!1}),c=Cs(t,i,vs,a,o,1,`Depth audit character-layer marker`),l=Cs(t,i,ys,a,s,0,`Depth audit world occluder`);e.add(c);try{n.setCharacterOpacity(0),n.render(0);let t=await n.readScreenCenterPixel();n.setCharacterOpacity(r),n.render(0);let i=await n.readScreenCenterPixel();e.add(l),n.setCharacterOpacity(0),n.render(0);let a=await n.readScreenCenterPixel();n.setCharacterOpacity(r),n.render(0);let o=await n.readScreenCenterPixel();return{visibleWorldPixel:t,visibleLayerPixel:i,occludedWorldPixel:a,occludedLayerPixel:o,visibleLayerDelta:xs(t,i),occludedLayerDelta:xs(a,o),depthComposite:n.getDepthCompositeDiagnostics()}}finally{e.remove(c,l),a.dispose(),o.dispose(),s.dispose(),n.setCharacterOpacity(r),n.render(0)}}function Cs(e,t,n,r,i,a,o){let s=new L(r,i);return s.name=o,s.position.copy(e.position).addScaledVector(t,n),s.quaternion.copy(e.quaternion),s.layers.set(a),s.frustumCulled=!1,s.updateMatrixWorld(!0),s}var ws=128,Ts=2;async function Es(e){let t=new oe;t.background=new z(328965);let n=new m(-2.2,2.2,2.2,-2.2,.1,20);n.position.set(4,5,6),n.lookAt(0,0,0),n.updateMatrixWorld(!0);let r=new Ge({color:12105912,roughness:1,metalness:0}),i=new L(new pe(6,6),r);i.name=`Shadow layer probe receiver`,i.rotation.x=-Math.PI/2,i.receiveShadow=!0,i.layers.set(0);let a=new Ge({color:6316128,roughness:1}),o=new L(new ae(.8,1.2,.8),a);o.name=`Shadow layer probe caster`,o.position.y=.6,o.castShadow=!0,o.layers.set(1),wa(o,e instanceof la?`webgl`:`webgpu`);let s=new Ce(16777215,.08),c=new F(16777215,3.4);c.position.set(-3,6,3),c.target.position.set(0,0,0),c.castShadow=!0,c.shadow.mapSize.set(512,512),c.shadow.camera.left=-4,c.shadow.camera.right=4,c.shadow.camera.top=4,c.shadow.camera.bottom=-4,c.shadow.camera.near=.1,c.shadow.camera.far=14,c.shadow.camera.layers.enable(1),c.shadow.bias=-2e-4,c.shadow.normalBias=.015,t.add(i,o,s,c,c.target),t.updateMatrixWorld(!0);let l=e instanceof la?new ce(ws,ws,{type:se,depthBuffer:!0,stencilBuffer:!1}):new U(ws,ws,{type:se,depthBuffer:!0,stencilBuffer:!1}),u=(e instanceof la,e.getRenderTarget()),d=e.shadowMap.enabled,f=e.getClearAlpha(),h=e.getClearColor(new z).clone(),g=new p(.5,.001,-.5),_=new p(-1.1,.001,.9);try{e.shadowMap.enabled=!0;let r=await Ds(e,t,n,l,g,_,!0),i=await Ds(e,t,n,l,g,_,!1);n.position.set(4,5,-6),n.lookAt(0,0,0),n.updateMatrixWorld(!0);let a=await Ds(e,t,n,l,g,_,!1);return{direct:r,isolated:i,secondAngle:a,contrastDelta:Math.abs(r.contrast-i.contrast),angleContrastDelta:Math.abs(i.contrast-a.contrast)}}finally{As(e,u),e.shadowMap.enabled=d,e.setClearColor(h,f),l.dispose(),i.geometry.dispose(),o.geometry.dispose(),r.dispose(),a.dispose(),c.dispose()}}async function Ds(e,t,n,r,i,a,o){n.layers.set(0),o&&n.layers.enable(1),As(e,r),e.setClearColor(328965,1),e.clear(!0,!0,!1),e.render(t,n);let s=await Os(e,r,n,i),c=await Os(e,r,n,a);return{shadowPixel:s,litPixel:c,contrast:js(c)-js(s)}}async function Os(e,t,n,r){let i=r.clone().project(n),a=C.clamp(Math.round((i.x*.5+.5)*127),Ts,125),o=C.clamp(ks(i.y,ws,e.coordinateSystem),Ts,125),s=e instanceof la?await e.readRenderTargetPixelsAsync(t,a-Ts,o-Ts,5,5,new Uint8Array(100)):await e.readRenderTargetPixelsAsync(t,a-Ts,o-Ts,5,5),c=0,l=0,u=0,d=0;for(let e=0;e<s.length;e+=4)c+=s[e]??0,l+=s[e+1]??0,u+=s[e+2]??0,d+=s[e+3]??0;return[Math.round(c/25),Math.round(l/25),Math.round(u/25),Math.round(d/25)]}function ks(e,t,n){let r=e*.5+.5,i=n===2001?1-r:r;return Math.round(i*(t-1))}function As(e,t){if(e instanceof la){e.setRenderTarget(t);return}e.setRenderTarget(t)}function js(e){return e[0]*.2126+e[1]*.7152+e[2]*.0722}var Ms=Object.freeze({...At,lights:!0,shadows:!0,reflections:!0,bots:0}),Ns=[`length`,`width`,`stiffness`,`damping`,`weight`,`bots`],Ps=[`lights`,`shadows`,`reflections`],Fs=class{onChange;root;panel;toggle;resetButton;status;numericInputs=new Map;toggleInputs=new Map;outputElements=new Map;settings={...Ms};constructor(e){this.onChange=e,this.root=X(document.querySelector(`[data-customization]`),`Customization panel is missing.`),this.panel=X(this.root.querySelector(`[data-customization-panel]`),`Customization panel content is missing.`),this.toggle=X(this.root.querySelector(`[data-customization-toggle]`),`Customization panel toggle is missing.`),this.resetButton=X(this.root.querySelector(`[data-customization-reset]`),`Customization reset button is missing.`),this.status=X(this.root.querySelector(`[data-customization-status]`),`Customization status is missing.`);for(let e of Ns){let t=X(this.root.querySelector(`[data-customization-setting="${e}"]`),`Customization input ${e} is missing.`),n=X(this.root.querySelector(`[data-customization-value="${e}"]`),`Customization output ${e} is missing.`),r=e===`bots`?Po:jt[e];t.min=String(r.min),t.max=String(r.max),t.step=String(r.step),t.addEventListener(`input`,this.handleNumericInput),(e===`length`||e===`width`)&&t.addEventListener(`change`,this.handleDimensionCommit),this.numericInputs.set(e,t),this.outputElements.set(e,n)}for(let e of Ps){let t=X(this.root.querySelector(`[data-customization-setting="${e}"]`),`Customization switch ${e} is missing.`);t.addEventListener(`change`,this.handleToggleInput),this.toggleInputs.set(e,t)}this.toggle.addEventListener(`click`,this.handlePanelToggle),this.resetButton.addEventListener(`click`,this.handleReset),this.syncControls();let t=window.matchMedia(`(max-width: 900px), (pointer: coarse)`).matches;this.setExpanded(!t)}getSettings(){return{...this.settings}}dispose(){this.numericInputs.forEach(e=>{e.removeEventListener(`input`,this.handleNumericInput),e.removeEventListener(`change`,this.handleDimensionCommit)}),this.toggleInputs.forEach(e=>{e.removeEventListener(`change`,this.handleToggleInput)}),this.toggle.removeEventListener(`click`,this.handlePanelToggle),this.resetButton.removeEventListener(`click`,this.handleReset)}handleNumericInput=e=>{let t=e.currentTarget,n=t.dataset.customizationSetting;if(n===`bots`){this.settings={...this.settings,bots:Bo(t.valueAsNumber)},this.updateOutput(n),this.status.textContent=`Custom settings active`,this.emitChange();return}let r=zt({...this.settings,[n]:t.valueAsNumber});this.settings={...this.settings,...r},this.updateOutput(n),this.status.textContent=`Custom settings active`,this.emitChange()};handleDimensionCommit=()=>{this.emitChange(!0)};handleToggleInput=e=>{let t=e.currentTarget,n=t.dataset.customizationSetting;this.settings={...this.settings,[n]:t.checked},this.status.textContent=`Custom settings active`,this.emitChange()};handlePanelToggle=()=>{this.setExpanded(this.toggle.getAttribute(`aria-expanded`)!==`true`)};handleReset=()=>{this.settings={...Ms},this.syncControls(),this.status.textContent=`Defaults restored`,this.emitChange(!0)};emitChange(e=!1){this.onChange({...this.settings},e)}syncControls(){this.numericInputs.forEach((e,t)=>{e.value=String(this.settings[t]),this.updateOutput(t)}),this.toggleInputs.forEach((e,t)=>{e.checked=this.settings[t]})}updateOutput(e){let t=this.outputElements.get(e);if(!t)return;let n=this.settings[e];t.value=e===`bots`?n.toFixed(0):e===`length`||e===`width`?`${n.toFixed(2)} m`:`${n.toFixed(2)}×`}setExpanded(e){this.root.classList.toggle(`is-collapsed`,!e),this.toggle.setAttribute(`aria-expanded`,String(e)),this.toggle.setAttribute(`aria-label`,e?`Collapse cape customization`:`Expand cape customization`),this.panel.hidden=!e}},Is=class{environment;root;buttons;constructor(e,t,n=null,r={location:window.location}){this.environment=r,this.root=X(document.querySelector(`[data-renderer-switch]`),`Renderer switch is missing.`),this.buttons=Array.from(this.root.querySelectorAll(`[data-renderer-option]`));let i=this.buttons.find(e=>e.dataset.rendererOption===`webgpu`);i&&!t&&(i.disabled=!0,i.title=n??`WebGPU is not available in this browser`),this.setActive(e,e);for(let e of this.buttons)e.addEventListener(`click`,this.handleSelection)}setActive(e,t){this.root.dataset.rendererBackend=e,this.root.dataset.rendererFallback=String(e!==t);for(let t of this.buttons){let n=t.dataset.rendererOption===e;t.classList.toggle(`is-active`,n),t.setAttribute(`aria-pressed`,String(n))}this.root.title=e===t?e===`webgpu`?`Experimental WebGPU renderer active; WebGL is recommended`:`WebGL renderer active (recommended)`:`WebGPU was requested but unavailable; WebGL is active`}dispose(){for(let e of this.buttons)e.removeEventListener(`click`,this.handleSelection)}handleSelection=e=>{let t=e.currentTarget,n=t.dataset.rendererOption;n!==`webgpu`&&n!==`webgl`||t.disabled||this.environment.location.replace(Gt(this.environment.location.href,n))}},Ls=`
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aPhase;
  attribute float aSize;
  varying float vAlpha;
  void main() {
    vec3 transformed = position;
    transformed.x += sin(uTime * 0.19 + aPhase) * 0.19;
    transformed.y += sin(uTime * 0.27 + aPhase * 1.7) * 0.11;
    vec4 view = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * view;
    gl_PointSize = aSize * uPixelRatio * (24.0 / max(1.0, -view.z));
    vAlpha = smoothstep(58.0, 3.0, -view.z);
  }
`,Rs=`
  varying float vAlpha;
  void main() {
    float distanceToCenter = length(gl_PointCoord - 0.5) * 2.0;
    float alpha = (1.0 - smoothstep(0.15, 1.0, distanceToCenter)) * vAlpha;
    gl_FragColor = vec4(vec3(0.52, 0.76, 0.7), alpha * 0.2);
  }
`,zs=class{points;material;constructor(){let e=new kt(53335),t=new Float32Array(1860),n=new Float32Array(620),r=new Float32Array(620);for(let i=0;i<620;i+=1){let a=e.range(Rt.endZ,Rt.startZ),o=Tt(a)+e.range(-1,1)*wt(a)*.83;t[i*3]=o,t[i*3+1]=e.range(.25,pt(a)*.92),t[i*3+2]=a,n[i]=e.range(0,Math.PI*2),r[i]=e.range(.45,1.15)}let i=new P;i.setAttribute(`position`,new o(t,3)),i.setAttribute(`aPhase`,new o(n,1)),i.setAttribute(`aSize`,new o(r,1)),this.material=new c({uniforms:{uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)}},vertexShader:Ls,fragmentShader:Rs,transparent:!0,depthWrite:!1,blending:2}),this.points=new Qe(i,this.material),this.points.name=`Suspended cave dust`,this.points.frustumCulled=!1}update(e){this.material.uniforms.uTime.value=e}resize(){this.material.uniforms.uPixelRatio.value=Math.min(window.devicePixelRatio,2)}};function Bs(e){let t=new kt(e),n=[],r=[],i=[],a=Math.abs(e)%3,o=Array.from({length:10},()=>t.range(-.11,.11)),s=t.range(0,Math.PI*2),c=t.range(0,Math.PI*2),l=t.range(.1,.22),u=t.range(.08,.19),d=a===1?t.range(1.4,1.85):t.range(.76,1.28),f=e=>[(Math.sin(e*3.4+s)-Math.sin(s))*l*e+Math.sin(e*8.7+c)*.018*e,(Math.sin(e*2.8+c)-Math.sin(c))*u*e+Math.cos(e*7.3+s)*.016*e];for(let e=0;e<9;e+=1){let i=e/9,l=a===2?.58:.74,u=(1-i)**l,p=Math.exp(-(((i-.3)/.12)**2))*(a===0?.26:.13),m=Math.exp(-(((i-.58)/.09)**2))*(a===2?.22:.1),h=Math.exp(-(((i-.46)/.075)**2))*.1,g=1+Math.sin(i*17+s)*.105+Math.sin(i*31+c)*.045+t.range(-.055,.055),_=1+Math.exp(-i*8)*.3,v=Math.max(.025,.32*u*g*_*(1+p+m-h)),[y,b]=f(i),x=i*t.range(-.45,.45);for(let e=0;e<=10;e+=1){let t=e%10,a=e/10*Math.PI*2+x,c=1+(o[t]??0)+Math.sin(a*3+i*9+s)*.035;n.push(y+Math.cos(a)*v*d*c,-1.6*i,b+Math.sin(a)*v/d*c),r.push(e/10,i)}}for(let e=0;e<8;e+=1)for(let t=0;t<10;t+=1){let n=e*11+t,r=n+11;i.push(n,n+1,r,r,n+1,r+1)}let[p,m]=f(1),h=n.length/3;n.push(p,-1.6,m),r.push(.5,1);for(let e=0;e<10;e+=1)i.push(88+e,88+e+1,h);let g=n.length/3;n.push(0,0,0),r.push(.5,0);for(let e=0;e<10;e+=1)i.push(g,e+1,e);let _=new P;return _.setAttribute(`position`,new qe(n,3)),_.setAttribute(`uv`,new qe(r,2)),_.setIndex(i),_.computeVertexNormals(),_.computeBoundingSphere(),_}var Vs=.14,Hs=.012,Us=class{colliders=[];localVertex=new p;worldVertex=new p;sampleCenter=new p;addSpeleothem(e,t){let n=e.getAttribute(`position`);if(!n)throw Error(`Speleothem collision geometry has no positions.`);let r=[];for(let e=0;e<9;e+=1){let i=new p;for(let t=0;t<10;t+=1){let r=e*11+t;this.localVertex.fromBufferAttribute(n,r),i.add(this.localVertex)}i.multiplyScalar(1/10).applyMatrix4(t);let a=0;for(let r=0;r<10;r+=1){let o=e*11+r;this.worldVertex.fromBufferAttribute(n,o).applyMatrix4(t),a=Math.max(a,this.worldVertex.distanceTo(i))}r.push({center:i,radius:a})}let i=new p().fromBufferAttribute(n,99).applyMatrix4(t);r.push({center:i,radius:0}),this.addFormationSections(r)}addCollar(e,t){this.addSphere(e,.38*Math.max(t.x,t.z),!1,`formation`)}addRock(e,t,n=!0){this.colliders.push(Mt(e,t,n))}addFormationSections(e){for(let t=0;t<e.length-1;t+=1){let n=e[t],r=e[t+1];if(!n||!r)continue;let i=n.center.distanceTo(r.center),a=Math.max(1,Math.ceil(i/Vs)),o=i/a*.5,s=Math.abs(r.radius-n.radius)/a*.5,c=Math.hypot(o,s)+Hs,l=t===0?0:1;for(let e=l;e<=a;e+=1){let t=e/a;this.sampleCenter.lerpVectors(n.center,r.center,t),this.addSphere(this.sampleCenter,C.lerp(n.radius,r.radius,t)+c,!1,`formation`)}}}addSphere(e,t,n,r){this.colliders.push({center:e.clone(),radius:t,walkable:n,kind:r})}},Ws=.42,Gs=Y.radius+.42,Ks=.08;Y.radius*2+.25;var qs=[{size:`large`,z:3.1,lateralOffset:-.82,scale:[1.65,1.35,1.05],rotation:[.16,.48,-.1],embedDepth:.08},{size:`small`,z:1.2,lateralOffset:.44,scale:[.55,.48,.62],rotation:[-.08,1.12,.2],embedDepth:.035},{size:`large`,z:-.9,lateralOffset:.94,scale:[1.12,1.05,.78],rotation:[.24,2.08,-.14],embedDepth:.065},{size:`small`,z:-2.9,lateralOffset:-.4,scale:[.48,.38,.7],rotation:[.12,2.72,.08],embedDepth:.03},{size:`large`,z:-5,lateralOffset:-.98,scale:[1.38,1.08,1.48],rotation:[-.18,.86,.14],embedDepth:.075},{size:`small`,z:-6.8,lateralOffset:.5,scale:[.64,.46,.52],rotation:[.18,1.66,-.16],embedDepth:.035}];function Js(e){return Tt(e.z)+e.lateralOffset}function Ys(e){let t=wt(e.z)-Gs,n=Ws*Math.max(...e.scale)+Y.radius+Ks,r=t+e.lateralOffset-n,i=t-e.lateralOffset-n;return Math.max(r,i)}var Xs=10,Zs=-.2,Qs=.07,$s=.3;function ec(){let e=[...tc(Zs,1,0,0),...tc(Qs,.78,.018,-.012),...tc($s,.28,.034,-.022),new p(0,Zs,0),new p(.034,$s,-.022)],t=[];for(let e=0;e<Xs;e+=1){let n=(e+1)%Xs,r=Xs+e,i=Xs+n,a=20+e,o=20+n;t.push([e,n,i],[e,i,r],[r,i,o],[r,o,a],[30,n,e],[31,a,o])}let n=e.reduce((e,t)=>e.add(t),new p).multiplyScalar(1/e.length),r=[],i=[],a=new p,o=new p,s=new p,c=new p;for(let l of t){let[t,u,d]=l,f=e[t],p=e[u],m=e[d];if(!(!f||!p||!m)){if(s.crossVectors(a.copy(p).sub(f),o.copy(m).sub(f)),c.copy(f).add(p).add(m).multiplyScalar(1/3),s.dot(c.sub(n))<0){let t=u;if(u=d,d=t,p=e[u],m=e[d],!p||!m)continue}for(let e of[f,p,m])r.push(e.x,e.y,e.z),i.push(.5+Math.atan2(e.z,e.x)/(Math.PI*2),C.inverseLerp(Zs,$s,e.y))}}let l=new P;return l.setAttribute(`position`,new qe(r,3)),l.setAttribute(`uv`,new qe(i,2)),l.computeVertexNormals(),l.computeBoundingBox(),l.computeBoundingSphere(),l.name=`Deterministic grounded irregular rock`,l}function tc(e,t,n,r){return Array.from({length:Xs},(i,a)=>{let o=a/Xs*Math.PI*2,s=Math.cos(o),c=Math.sin(o);return new p((s*.44+c*.025)*t+n,e,(c*.36-s*.018)*t+r)})}var nc=class{group=new V;worldColliders;contactRocks;walls;floor;colliderBuilder=new Us;constructor(e){this.group.name=`Procedural cave`,this.walls=this.createWalls(e),this.floor=this.createFloor(e),this.group.add(this.walls,this.floor),this.createFormations(e),this.contactRocks=this.createRockScatter(e),this.worldColliders=this.colliderBuilder.colliders}createMaterial(e,t=!1){return new Ge({map:e.color,normalMap:e.normal,normalScale:new j(t?.72:1.05,t?.72:1.05),roughnessMap:e.roughness,roughness:t?.58:.91,metalness:t?.08:.015,color:t?6779246:8092531})}createWalls(e){let t=[],n=[],r=[],{segments:i,radialSegments:a,startZ:o,endZ:s}=Rt;for(let e=0;e<=i;e+=1){let r=e/i,c=C.lerp(o,s,r),l=Tt(c),u=pt(c),d=u*.5-.25,f=u*.5+.45,p=wt(c);for(let e=0;e<=a;e+=1){let i=e/a,o=i*Math.PI*2,s=Ct(r*11.5,i*8,8,30767)-.5,u=Math.sin(c*.42+o*5)*.12,m=s*.72+u,h=Math.cos(o),g=Math.sin(o);t.push(l+h*(p+m),d+g*(f+m*.66),c),n.push(i*4,r*16)}}let c=a+1;for(let e=0;e<i;e+=1)for(let t=0;t<a;t+=1){let n=e*c+t,i=n+c;r.push(n,i,n+1,i,i+1,n+1)}let l=new P;l.setAttribute(`position`,new qe(t,3)),l.setAttribute(`uv`,new qe(n,2)),l.setIndex(r),l.computeVertexNormals(),this.stitchWallSeamNormals(l,i,a),l.computeBoundingSphere();let u=this.createMaterial(e);u.side=1,u.normalScale.set(-1.05,-1.05);let d=new L(l,u);return d.name=`Cave shell`,d.receiveShadow=!0,d}stitchWallSeamNormals(e,t,n){let r=e.getAttribute(`normal`),i=new p,a=new p,o=new p,s=n+1;for(let e=0;e<=t;e+=1){let t=e*s,c=t+n;i.fromBufferAttribute(r,t),a.fromBufferAttribute(r,c),o.copy(i).add(a).normalize(),r.setXYZ(t,o.x,o.y,o.z),r.setXYZ(c,o.x,o.y,o.z)}r.needsUpdate=!0}createFloor(e){let t=[],n=[],r=[];for(let e=0;e<=180;e+=1){let r=e/180,i=C.lerp(Rt.startZ,Rt.endZ,r),a=Tt(i),o=wt(i)*1.015;for(let e=0;e<=36;e+=1){let s=e/36,c=a+(s*2-1)*o;t.push(c,ht(c,i),i),n.push(s*5,r*18)}}for(let e=0;e<180;e+=1)for(let t=0;t<36;t+=1){let n=e*37+t,i=n+37;r.push(n,n+1,i,i,n+1,i+1)}let i=new P;i.setAttribute(`position`,new qe(t,3)),i.setAttribute(`uv`,new qe(n,2)),i.setIndex(r),i.computeVertexNormals(),i.computeBoundingSphere();let a=new L(i,this.createMaterial(e,!0));return a.name=`Wet cave floor`,a.receiveShadow=!0,a}createFormations(e){let t=new kt(379422),n=this.createMaterial(e,!0);n.color.multiplyScalar(.66),n.roughness=.86,n.metalness=.015;let r=[20897,20898,20899].map(Bs),i=r.map((e,t)=>{let r=new h(e,n,18);return r.name=`Stalactites organic variant ${t+1}`,r.castShadow=!0,r.receiveShadow=!0,r}),a=new Ye(.38,1),o=new h(a,n,82);o.name=`Flowstone formation collars`,o.castShadow=!0,o.receiveShadow=!0;let s=new fe,c=new tt,l=new p,u=new p,d=new p,f=new p;for(let e=0;e<54;e+=1){let n=t.range(Rt.endZ+2,Rt.startZ-2),a=t.range(-.92,.92),p=Tt(n)+wt(n)*a;u.set(p,pt(n)-Math.abs(a)*.65,n),c.setFromEuler(new Xe(t.range(-.12,.12),t.range(0,Math.PI),t.range(-.12,.12))),l.set(t.range(.55,1.6),t.range(.55,2.25),t.range(.55,1.6)),s.compose(u,c,l);let m=e%i.length;this.colliderBuilder.addSpeleothem(r[m],s),i[m]?.setMatrixAt(Math.floor(e/i.length),s),d.copy(u),d.y-=.08,f.set(l.x*t.range(.9,1.35),t.range(.2,.38),l.z*t.range(.9,1.35)),s.compose(d,c,f),o.setMatrixAt(e,s),this.colliderBuilder.addCollar(d,f)}i.forEach(e=>{e.instanceMatrix.needsUpdate=!0,this.group.add(e)});let m=[10,9,9],g=r.map(e=>{let t=e.clone();return t.rotateZ(Math.PI),t}),_=g.map((e,t)=>{let r=new h(e,n,m[t]??0);return r.name=`Stalagmites organic variant ${t+1}`,r.castShadow=!0,r.receiveShadow=!0,r}),v=[0,0,0];for(let e=0;e<28;e+=1){let n=t.range(Rt.endZ+2,Rt.startZ-2),r=t.next()>.5?1:-1,i=Tt(n)+r*wt(n)*t.range(.7,.94);u.set(i,ht(i,n),n),c.setFromEuler(new Xe(t.range(-.08,.08),t.range(0,Math.PI),t.range(-.08,.08))),l.set(t.range(.55,1.35),t.range(.45,1.75),t.range(.55,1.35)),s.compose(u,c,l);let a=e%_.length;this.colliderBuilder.addSpeleothem(g[a],s);let p=v[a]??0;_[a]?.setMatrixAt(p,s),v[a]=p+1,d.copy(u),d.y+=.06,f.set(l.x*t.range(.86,1.25),t.range(.18,.34),l.z*t.range(.86,1.25)),s.compose(d,c,f),o.setMatrixAt(54+e,s),this.colliderBuilder.addCollar(d,f)}_.forEach(e=>{e.instanceMatrix.needsUpdate=!0,this.group.add(e)}),o.instanceMatrix.needsUpdate=!0,this.group.add(o)}createRockScatter(e){let t=new kt(11541991),n=ec(),r=this.createMaterial(e,!0);r.color.multiplyScalar(.66),r.roughness=.84,r.metalness=.02;let i=new h(n,r,72+qs.length);i.name=`Rock scatter and cape contact course`,i.castShadow=!0,i.receiveShadow=!0;let a=new fe,o=new tt,s=new p,c=new p,l=new p,u=n.getAttribute(`position`),d=[];for(let e=0;e<qs.length;e+=1){let t=qs[e];if(!t)continue;let r=Js(t);o.setFromEuler(new Xe(...t.rotation)),s.fromArray(t.scale),c.set(r,0,t.z),a.compose(c,o,s);let f=1/0;for(let e=0;e<u.count;e+=1)l.fromBufferAttribute(u,e).applyMatrix4(a),f=Math.min(f,l.y);c.y=ht(r,t.z)-f-t.embedDepth,a.compose(c,o,s),i.setMatrixAt(e,a);let p=t.size===`small`;this.colliderBuilder.addRock(n,a,p),d.push({size:t.size,walkable:p,position:[c.x,c.y,c.z],lateralOffset:t.lateralOffset,scale:t.scale,openLaneWidth:Ys(t)})}for(let e=0;e<72;e+=1){let r=t.range(Rt.endZ+1.5,Rt.startZ-1.5),d=t.next()>.5?1:-1,f=Tt(r)+d*wt(r)*t.range(.64,.94);c.set(f,0,r),o.setFromEuler(new Xe(t.range(-.2,.2),t.range(0,Math.PI*2),t.range(-.2,.2))),s.set(t.range(.25,1.25),t.range(.18,.72),t.range(.35,1.4)),a.compose(c,o,s);let p=1/0;for(let e=0;e<u.count;e+=1)l.fromBufferAttribute(u,e).applyMatrix4(a),p=Math.min(p,l.y);c.y=ht(f,r)-p-t.range(.025,.065),a.compose(c,o,s),i.setMatrixAt(qs.length+e,a),this.colliderBuilder.addRock(n,a)}return i.instanceMatrix.needsUpdate=!0,this.group.add(i),d}},rc=class{lights;selectedIndices;selectedDistances;constructor(e,n){this.lights=Array.from({length:e},(e,r)=>{let i=new t(16777215,0,1,2);return i.name=`${n} pooled light ${r+1}`,i}),this.selectedIndices=new Int32Array(e),this.selectedDistances=new Float64Array(e)}update(e,t){this.selectedIndices.fill(-1),this.selectedDistances.fill(1/0);for(let n=0;n<t.length;n+=1){let r=t[n];if(!r)continue;let i=r.position.distanceToSquared(e);for(let e=0;e<this.lights.length;e+=1)if(!(i>=(this.selectedDistances[e]??1/0))){for(let t=this.lights.length-1;t>e;--t)this.selectedIndices[t]=this.selectedIndices[t-1]??-1,this.selectedDistances[t]=this.selectedDistances[t-1]??1/0;this.selectedIndices[e]=n,this.selectedDistances[e]=i;break}}this.lights.forEach((n,r)=>{let i=this.selectedIndices[r]??-1,a=i>=0?t[i]:void 0;if(!a){n.position.copy(e),n.intensity=0;return}let o=Math.sqrt(this.selectedDistances[r]??0),s=a.range*.68,c=Math.max(.001,a.range-s),l=C.clamp((o-s)/c,0,1),u=1-l*l*(3-2*l);n.position.copy(a.position),n.color.copy(a.color),n.distance=a.range,n.intensity=a.intensity*u})}getDiagnostics(){return{lights:this.lights.length,visibleLights:this.lights.filter(e=>e.visible).length,activeLights:this.lights.filter(e=>e.intensity>.001).length}}},ic=class{group=new V;worldColliders=[];clusters=[];lightPool=new rc(2,`Mineral`);constructor(){this.group.name=`Glowing mineral veins`,[{z:1,side:-1,color:4386769},{z:-22,side:1,color:7393279},{z:-43,side:-1,color:10586111},{z:-61,side:1,color:4843202}].forEach((e,t)=>this.createCluster(e.z,e.side,e.color,t)),this.group.add(...this.lightPool.lights)}update(e,t){for(let t of this.clusters)t.intensity=8.5+Math.sin(e*1.3+t.phase)*.65;this.lightPool.update(t,this.clusters)}getClusterPositions(){return this.clusters.map(e=>e.root.toArray())}getLightDiagnostics(){return this.lightPool.getDiagnostics()}createCluster(e,t,n,r){let i=new kt(49833+r*991),a=Tt(e)+t*(wt(e)-.48),o=new p(a,i.range(2.1,4.2),e),s=new z(n),c=new Ge({color:s,emissive:s,emissiveIntensity:5.5,roughness:.23,metalness:.34}),l=new re({color:s,transparent:!0,opacity:.12,blending:2,depthWrite:!1,side:2}),u=[],d=[];for(let n=0;n<8;n+=1){let a=[o.clone()],s=i.range(-1,1),c=i.range(-1,1),l=i.range(1.1,3),f=i.integer(3,5);for(let i=1;i<=f;i+=1){let u=i/f,d=e+c*l*u+Math.sin(u*7+n)*.14,m=o.y+s*l*u+Math.sin(u*5+r)*.18,h=Tt(d)+t*(wt(d)-.46-Math.sin(u*Math.PI)*.08);a.push(new p(h,m,d))}let m=new ue(a),h=i.range(.018,.045)*(1-n/8*.38);u.push(new B(m,18,h,5,!1)),d.push(new B(m,14,h*3.2,5,!1))}let f=Uo(u,!1),m=Uo(d,!1);if(!f||!m)throw Error(`Unable to merge procedural mineral branches.`);let g=new L(f,c);g.name=`Mineral vein core ${r}`;let _=new L(m,l);_.name=`Mineral vein glow ${r}`,this.group.add(_,g),u.forEach(e=>e.dispose()),d.forEach(e=>e.dispose());let v=new w(.11,0),y=new h(v,c,18),b=new fe,x=new tt,S=new p,T=new p;for(let n=0;n<y.count;n+=1)T.set(a-t*i.range(0,.14),o.y+i.range(-1.8,1.8),e+i.range(-2.1,2.1)),x.setFromEuler(new Xe(i.range(0,Math.PI),i.range(0,Math.PI),i.range(0,Math.PI))),S.set(i.range(.45,1.6),i.range(.8,2.9),i.range(.45,1.2)),b.compose(T,x,S),y.setMatrixAt(n,b),this.worldColliders.push({center:T.clone(),radius:C.clamp(.11*Math.max(S.x,S.y,S.z),.07,.34),walkable:!1,kind:`mineral`});y.instanceMatrix.needsUpdate=!0,this.group.add(y);let E=o.clone().add(new p(-t*.65,0,0));this.clusters.push({root:o,position:E,color:s,intensity:9,range:7.5,phase:i.range(0,Math.PI*2)})}},ac=`
  uniform float uTime;
  uniform float uPhase;
  varying float vHeight;
  void main() {
    vec3 transformed = position;
    float height = uv.y;
    transformed.x += sin(uTime * 7.0 + uPhase + position.y * 8.0) * 0.045 * height;
    transformed.z += cos(uTime * 5.3 + uPhase + position.y * 6.0) * 0.03 * height;
    transformed.xz *= 0.78 + height * 0.25;
    vHeight = height;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`,oc=`
  varying float vHeight;
  void main() {
    float edge = smoothstep(0.0, 0.32, vHeight) * (1.0 - smoothstep(0.7, 1.0, vHeight));
    vec3 color = mix(vec3(5.0, 0.42, 0.035), vec3(1.4, 0.07, 0.01), vHeight);
    gl_FragColor = vec4(color, edge * 0.92);
  }
`,sc=class{group=new V;worldColliders=[];torches=[];lightPool=new rc(3,`Torch`);shadowLight;activeShadowTorch=-1;constructor(){this.group.name=`Torch lights`;let e=new kt(461508);[11,-2,-15,-29,-43,-57,-68].forEach((t,n)=>this.createTorch(t,n%2==0?-1:1,e)),this.group.add(...this.lightPool.lights),this.shadowLight=new dt(16756826,72,12,.86,.82,1.7),this.shadowLight.name=`Nearest torch shadow proxy`,this.shadowLight.castShadow=!0,this.shadowLight.shadow.mapSize.set(1024,1024),this.shadowLight.shadow.camera.near=.25,this.shadowLight.shadow.camera.far=12,this.shadowLight.shadow.bias=-16e-5,this.shadowLight.shadow.normalBias=.035,this.group.add(this.shadowLight,this.shadowLight.target)}update(e,t){let n=0,r=1/0;this.torches.forEach((i,a)=>{let o=i.position.distanceTo(t);o<r&&(r=o,n=a);let s=1+Math.sin(e*11.3+i.phase)*.055+Math.sin(e*17.7+i.phase*2.2)*.028;i.intensity=22*s,i.flame.scale.y=s,i.flame.material.uniforms.uTime.value=e}),this.lightPool.update(t,this.torches);let i=this.torches[n];i&&(n!==this.activeShadowTorch&&(this.activeShadowTorch=n,this.shadowLight.position.copy(i.position),this.shadowLight.target.position.copy(i.position).addScaledVector(i.inward,3.1).setY(ht(i.position.x,i.position.z)+.65),this.shadowLight.shadow.needsUpdate=!0),this.shadowLight.intensity=r<13?64+Math.sin(e*12.1)*4:0)}getLightDiagnostics(){return this.lightPool.getDiagnostics()}getShadowDiagnostics(){let e=this.shadowLight.position,t=this.shadowLight.target.position;return{activeTorch:this.activeShadowTorch,enabled:this.shadowLight.castShadow&&this.shadowLight.intensity>0,intensity:this.shadowLight.intensity,position:[e.x,e.y,e.z],target:[t.x,t.y,t.z],mapSize:[this.shadowLight.shadow.mapSize.x,this.shadowLight.shadow.mapSize.y]}}createTorch(e,t,n){let r=new V,i=Tt(e)+t*(wt(e)-.48),o=ht(i,e)+n.range(1.62,2.15);r.position.set(i,o,e);let s=new p(-t,-.18,0).normalize();r.rotation.z=t*-.15;let l=new Ge({color:2104087,roughness:.48,metalness:.82}),u=new Ge({color:3282699,roughness:.9,metalness:.02}),f=new L(new a(.055,.08,.82,7),u);f.castShadow=!0;let m=new L(new rt(.105,.026,6,12),l);m.rotation.x=Math.PI/2,m.position.y=.37;let h=new L(new a(.035,.035,.54,6),l);h.rotation.z=Math.PI/2,h.position.set(t*.22,-.18,0),r.add(f,m,h);let g=new c({uniforms:{uTime:{value:0},uPhase:{value:n.range(0,Math.PI*2)}},vertexShader:ac,fragmentShader:oc,transparent:!0,blending:2,depthWrite:!1,side:2}),_=new L(new d(.15,9,12),g);_.scale.set(.72,1.8,.72),_.position.y=.57,r.add(_),r.updateMatrixWorld(!0);let v=new p,y=new p,b=(e,t,n)=>{v.set(e,t,0),r.localToWorld(y.copy(v)),this.worldColliders.push({center:y.clone(),radius:n,walkable:!1,kind:`torch`})};for(let e of[-.41,-.205,0,.205,.41])b(0,e,.112);for(let e of[-.27,-.135,0,.135,.27])b(t*.22+e,-.18,.104);b(0,.37,.145);let x=new p(i,o+.58,e);this.group.add(r),this.torches.push({root:r,flame:_,position:x,inward:s,phase:n.range(0,Math.PI*2),color:new z(16753230),intensity:22,range:9.5})}},cc=.12,lc=.55,uc=`
  #define RIPPLE_COUNT 16
  uniform float uTime;
  uniform vec4 uRipples[RIPPLE_COUNT];
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  varying float vWave;
  varying vec2 vSlope;

  float rippleHeight(vec2 worldPosition) {
    float height = 0.0;
    for (int index = 0; index < RIPPLE_COUNT; index++) {
      vec4 ripple = uRipples[index];
      float age = uTime - ripple.z;
      if (age > 0.0 && age < 4.0) {
        float distanceToImpact = length(worldPosition - ripple.xy);
        float front = 1.0 - smoothstep(age * 2.1 - 0.1, age * 2.1 + 0.2, distanceToImpact);
        float wake = sin(distanceToImpact * 13.0 - age * 13.5);
        float fade = exp(-age * 0.86) * exp(-distanceToImpact * 0.48);
        height += wake * fade * front * ripple.w;
      }
    }
    return height;
  }

  float surfaceHeight(vec2 worldPosition) {
    float ambientWave = sin(worldPosition.x * 2.4 + uTime * 0.7)
      * cos(worldPosition.y * 2.1 - uTime * 0.55) * 0.0025;
    return rippleHeight(worldPosition) + ambientWave;
  }

  void main() {
    vec4 flatWorld = modelMatrix * vec4(position, 1.0);
    float wave = surfaceHeight(flatWorld.xz);
    float slopeEpsilon = 0.035;
    vSlope = vec2(
      (surfaceHeight(flatWorld.xz + vec2(slopeEpsilon, 0.0)) - wave) / slopeEpsilon,
      (surfaceHeight(flatWorld.xz + vec2(0.0, slopeEpsilon)) - wave) / slopeEpsilon
    );
    vec3 transformed = position;
    transformed.z += wave;
    vec4 world = modelMatrix * vec4(transformed, 1.0);
    vWorldPosition = world.xyz;
    vUv = uv;
    vWave = wave;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`,dc=`
  uniform float uTime;
  uniform vec3 uDeepColor;
  uniform vec3 uShallowColor;
  uniform vec3 uFogColor;
  uniform float uReflectionStrength;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  varying float vWave;
  varying vec2 vSlope;

  float hash(vec2 point) {
    return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float valueNoise(vec2 point) {
    vec2 cell = floor(point);
    vec2 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);
    float a = hash(cell);
    float b = hash(cell + vec2(1.0, 0.0));
    float c = hash(cell + vec2(0.0, 1.0));
    float d = hash(cell + vec2(1.0, 1.0));
    return mix(mix(a, b, local.x), mix(c, d, local.x), local.y);
  }

  vec2 microGradient(vec2 point) {
    vec2 firstDirection = normalize(vec2(0.83, 0.56));
    vec2 secondDirection = normalize(vec2(-0.42, 0.91));
    vec2 thirdDirection = normalize(vec2(0.97, -0.24));
    float first = cos(dot(point, firstDirection) * 4.1 + uTime * 1.18) * 0.019;
    float second = cos(dot(point, secondDirection) * 7.7 - uTime * 1.62) * 0.011;
    float third = cos(dot(point, thirdDirection) * 13.4 + uTime * 2.05) * 0.005;
    float breakup = mix(0.72, 1.18, valueNoise(point * 1.8 + vec2(uTime * 0.08, -uTime * 0.05)));
    return (firstDirection * first + secondDirection * second + thirdDirection * third) * breakup;
  }

  float distributionGGX(float alpha, float normalDotHalf) {
    float alphaSquared = alpha * alpha;
    float denominator = normalDotHalf * normalDotHalf * (alphaSquared - 1.0) + 1.0;
    return alphaSquared / max(3.14159265 * denominator * denominator, 0.0001);
  }

  void main() {
    vec2 centered = vUv * 2.0 - 1.0;
    float angle = atan(centered.y, centered.x);
    float irregularEdge = 0.91 + sin(angle * 5.0) * 0.035 + sin(angle * 9.0) * 0.025;
    float edgeDistance = length(centered);
    float edgeAntialias = max(fwidth(edgeDistance - irregularEdge) * 1.5, 0.002);
    float alphaEdge = 1.0 - smoothstep(irregularEdge - 0.09 - edgeAntialias, irregularEdge + edgeAntialias, edgeDistance);
    if (alphaEdge < 0.015) discard;

    vec2 detailGradient = microGradient(vWorldPosition.xz);
    vec3 normal = normalize(vec3(
      -vSlope.x - detailGradient.x,
      1.0,
      -vSlope.y - detailGradient.y
    ));
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float viewFacing = clamp(dot(normal, viewDirection), 0.0, 1.0);
    float fresnel = 0.025 + 0.975 * pow(1.0 - viewFacing, 5.0);
    vec3 torchDirection = normalize(vec3(-0.35, 0.72, 0.48));
    vec3 halfDirection = normalize(viewDirection + torchDirection);
    float normalVariance = max(dot(dFdx(normal), dFdx(normal)), dot(dFdy(normal), dFdy(normal)));
    float roughness = clamp(0.11 + normalVariance * 0.38, 0.11, 0.28);
    float specular = distributionGGX(roughness, max(dot(normal, halfDirection), 0.0));
    specular = specular / (1.0 + specular);
    float mineralGlint = pow(max(0.0, sin(vWorldPosition.x * 1.7 + vWorldPosition.z * 0.8)), 16.0);
    float depthTint = smoothstep(0.2, 0.92, edgeDistance);
    vec3 waterBody = mix(uDeepColor, uShallowColor, depthTint * 0.24);
    vec3 caveReflection = mix(vec3(0.012, 0.048, 0.072), vec3(0.075, 0.22, 0.26), normal.y * 0.5 + 0.5);
    vec3 color = mix(
      waterBody,
      caveReflection,
      clamp(0.025 + fresnel * 0.58, 0.0, 0.68) * uReflectionStrength
    );
    color += vec3(1.0, 0.38, 0.075) * specular * max(dot(normal, torchDirection), 0.0) * 1.45 * uReflectionStrength;
    color += vec3(0.15, 0.9, 0.76) * mineralGlint * fresnel * 0.16 * uReflectionStrength;
    color += abs(vWave) * vec3(0.58, 0.92, 0.9) * 0.9;
    float wetRim = smoothstep(0.73, 0.93, edgeDistance) * (1.0 - smoothstep(0.93, 1.0, edgeDistance));
    color += vec3(0.08, 0.2, 0.2) * wetRim * 0.16;
    float distanceToCamera = length(cameraPosition - vWorldPosition);
    float fogFactor = 1.0 - exp(-0.0032 * distanceToCamera * distanceToCamera);
    color = mix(color, uFogColor, fogFactor);
    gl_FragColor = vec4(
      color,
      alphaEdge * mix(${cc.toFixed(2)}, ${lc.toFixed(2)}, fresnel)
    );
  }
`,fc=class{group=new V;puddles;ripples=Array.from({length:16},()=>new b(0,0,-100,0));material;drops=[];dropMesh;splashes=[];splashPositions;splashPoints;random=new kt(53673);dropMatrix=new fe;hiddenDropMatrix=new fe().makeScale(0,0,0);footPosition=new p;rippleCursor=0;strideSinceStep=0;footSide=1;rippleEmissions=0;footstepRipples=0;dripRipples=0;landingRipples=0;constructor(){this.group.name=`Reactive shallow water`,this.puddles=this.createDefinitions(),this.material=new c({uniforms:{uTime:{value:0},uRipples:{value:this.ripples},uDeepColor:{value:new z(202784)},uShallowColor:{value:new z(1594962)},uFogColor:{value:new z(462866)},uReflectionStrength:{value:1}},vertexShader:uc,fragmentShader:dc,transparent:!0,depthWrite:!1,side:2}),this.material.name=`Procedural ripple water`;let e=new pe(2,2,96,68);for(let t of this.puddles){let n=new L(e,this.material);n.position.copy(t.center),n.rotation.x=-Math.PI/2,n.scale.set(t.radiusX,t.radiusZ,1),n.renderOrder=3,n.receiveShadow=!0,this.group.add(n)}this.createDrops(),this.dropMesh=this.createDropMesh(),this.group.add(this.dropMesh);let t=new P;this.splashPositions=new qe(new Float32Array(216),3),t.setAttribute(`position`,this.splashPositions),t.setDrawRange(0,0),this.splashPoints=new Qe(t,new Be({color:12183004,size:.034,transparent:!0,opacity:.72,depthWrite:!1,blending:2,sizeAttenuation:!0})),this.splashPoints.frustumCulled=!1,this.group.add(this.splashPoints)}update(e,t,n,r,i){this.material.uniforms.uTime.value=t,this.updateDrops(e,t),this.updateSplashes(e);let a=this.findPuddle(n.x,n.z);if(a&&i>.45){if(this.strideSinceStep+=i*e,this.strideSinceStep>.48){this.strideSinceStep=0,this.footSide*=-1;let e=this.footPosition.copy(n);e.x+=Math.cos(r)*.16*this.footSide,e.z-=Math.sin(r)*.16*this.footSide,e.y=a.center.y+.025,this.footstepRipples+=1,this.addRipple(e,t,.038),this.spawnSplash(e,7,.58)}}else this.strideSinceStep=Math.min(this.strideSinceStep,.3)}setReflectionsEnabled(e){this.material.uniforms.uReflectionStrength.value=+!!e}addRipple(e,t,n){this.ripples[this.rippleCursor]?.set(e.x,e.z,t,n),this.rippleCursor=(this.rippleCursor+1)%16,this.rippleEmissions+=1}addLandingRipple(e,t,n){let r=this.findPuddle(e.x,e.z);if(!r||n<=0)return!1;let i=this.footPosition.copy(e);i.y=r.center.y+.025;let a=C.smoothstep(n,1.5,6);return this.landingRipples+=1,this.strideSinceStep=0,this.addRipple(i,t,C.lerp(.05,.082,a)),this.spawnSplash(i,14,C.lerp(.72,1.02,a)),!0}isInWater(e){return this.findPuddle(e.x,e.z)!==void 0}getDiagnostics(){let e=this.getContainmentDiagnostics();return{puddles:this.puddles.length,drops:this.drops.length,activeRipples:this.ripples.filter(e=>e.z>-99).length,activeSplashes:this.splashes.length,rippleEmissions:this.rippleEmissions,footstepRipples:this.footstepRipples,dripRipples:this.dripRipples,landingRipples:this.landingRipples,basinCenters:this.puddles.map(e=>[e.center.x,e.center.y,e.center.z]),surfaceAlphaRange:[cc,lc],...e}}createDefinitions(){return Bt.map(e=>({basin:e,center:new p(e.centerX,vt(e),e.centerZ),radiusX:e.radiusX,radiusZ:e.radiusZ}))}getContainmentDiagnostics(){let e=1/0,t=1/0;for(let n of this.puddles)for(let r=0;r<48;r+=1){let i=r/48*Math.PI*2,a=Math.cos(i),o=Math.sin(i),s=n.center.x+a*n.radiusX*.84,c=n.center.z+o*n.radiusZ*.84;e=Math.min(e,n.center.y-ht(s,c));let l=n.center.x+a*n.radiusX*1.1,u=n.center.z+o*n.radiusZ*1.1;t=Math.min(t,ht(l,u)-n.center.y)}return{minimumInteriorDepth:e,minimumRimClearance:t}}findPuddle(e,t){return this.puddles.find(n=>{let r=(e-n.center.x)/(n.radiusX*.9),i=(t-n.center.z)/(n.radiusZ*.9);return r*r+i*i<1})}createDrops(){this.puddles.forEach((e,t)=>{let n=t%2==0?3:2;for(let t=0;t<n;t+=1){let t=this.random.range(0,Math.PI*2),n=this.random.range(.1,.68),r=new p(e.center.x+Math.cos(t)*e.radiusX*n,e.center.y,e.center.z+Math.sin(t)*e.radiusZ*n),i=Math.min(pt(e.center.z)-.45,this.random.range(3.2,6.5));this.drops.push({position:new p(r.x,i,r.z),impact:r,top:i,velocity:0,delay:this.random.range(0,5.5)})}})}createDropMesh(){let e=new d(.022,5,7);e.scale(.72,2.7,.72);let t=new re({color:12183774,transparent:!0,opacity:.74}),n=new h(e,t,this.drops.length);return n.name=`Falling water drops`,n.instanceMatrix.setUsage(ie),n.frustumCulled=!1,n}updateDrops(e,t){this.drops.forEach((n,r)=>{if(n.delay>0){n.delay-=e,this.dropMesh.setMatrixAt(r,this.hiddenDropMatrix);return}n.velocity+=7.8*e,n.position.y-=n.velocity*e,n.position.y<=n.impact.y&&(this.dripRipples+=1,this.addRipple(n.impact,t,.019),this.spawnSplash(n.impact,3,.28),n.position.y=n.top,n.velocity=0,n.delay=this.random.range(1.4,5.8)),this.dropMatrix.makeTranslation(n.position.x,n.position.y,n.position.z),this.dropMesh.setMatrixAt(r,this.dropMatrix)}),this.dropMesh.instanceMatrix.needsUpdate=!0}spawnSplash(e,t,n){for(let r=0;r<t&&this.splashes.length<72;r+=1){let t=this.random.range(0,Math.PI*2),r=this.random.range(.2,n);this.splashes.push({position:e.clone().add(new p(0,.025,0)),velocity:new p(Math.cos(t)*r,this.random.range(.55,1.45)*n,Math.sin(t)*r),life:this.random.range(.24,.52)})}}updateSplashes(e){for(let t=this.splashes.length-1;t>=0;--t){let n=this.splashes[t];if(n){if(n.life-=e,n.life<=0){this.splashes.splice(t,1);continue}n.velocity.y-=4.8*e,n.position.addScaledVector(n.velocity,e)}}let t=this.splashPositions.array;this.splashes.forEach((e,n)=>{t[n*3]=e.position.x,t[n*3+1]=e.position.y,t[n*3+2]=e.position.z}),this.splashPositions.needsUpdate=!0,this.splashPoints.geometry.setDrawRange(0,this.splashes.length)}},pc=Y.radius+.42,mc=.94,hc=.08,gc=Y.radius*1.5,_c=class{colliders;separation=new j;capsuleSample=new p;rockQuery=new St;middleBounds={minimum:0,maximum:0};upperBounds={minimum:0,maximum:0};constructor(e){this.colliders=e}resolvePlayer(e,t){this.constrainCorridorBounds(e),(!t||t.grounded)&&(e.y=this.getPlayerRootHeight(e.x,e.z)),this.constrainPlanarBounds(e);for(let t of this.colliders)t.walkable||this.resolveObstacle(e,t);this.constrainCorridorBounds(e),(!t||t.grounded)&&(e.y=this.getPlayerRootHeight(e.x,e.z)),this.constrainPlanarBounds(e);let n=this.getPlayerRootHeight(e.x,e.z),r=t?.grounded??!0,i=t!==void 0&&t.velocityY<=0&&t.previousY>=n&&e.y<=n,a=e.y<n;(!t||r||i||a)&&(e.y=n,r=!0);let o=pt(e.z)-Y.height-hc,s=e.y>o;return s&&(e.y=Math.max(n,o),r=e.y<=n+1e-6),{grounded:r,hitCeiling:s}}getPlayerRootHeight(e,t){return this.getGroundHeight(e,t)+Y.footOffset}getGroundHeight(e,t){let n=gt(e,t);for(let r of this.colliders){if(!r.walkable)continue;if(bt(r)){let i=this.getSmoothRockSupport(r,e,t,n);i!==null&&(n=Math.max(n,i));continue}let i=e-r.center.x,a=t-r.center.z,o=r.radius*mc,s=i*i+a*a;if(s>=o*o)continue;let c=r.center.y+Math.sqrt(r.radius*r.radius-s);n=Math.max(n,c)}return n}getSmoothRockSupport(e,t,n,r){let i=(e.bounds.min.x+e.bounds.max.x)*.5,a=(e.bounds.min.z+e.bounds.max.z)*.5,o=(e.bounds.max.x-e.bounds.min.x)*.5+gc,s=(e.bounds.max.z-e.bounds.min.z)*.5+gc,c=Math.hypot((t-i)/Math.max(o,.001),(n-a)/Math.max(s,.001));if(c>=1)return null;let l=1-C.smoothstep(c,.12,1);return C.lerp(r,Math.max(r,e.bounds.max.y),l)}constrainPlanarBounds(e){let t=Tt(e.z),n=e.y+Y.height-Y.radius,r=e.y+Y.height*.5,i=Y.radius+.12,a=wt(e.z)-pc;Et(r,e.z,i,this.middleBounds),Et(n,e.z,i,this.upperBounds),e.x=C.clamp(e.x,Math.max(t-a,this.middleBounds.minimum,this.upperBounds.minimum),Math.min(t+a,this.middleBounds.maximum,this.upperBounds.maximum))}constrainCorridorBounds(e){e.z=C.clamp(e.z,Rt.endZ+2.2,Rt.startZ-2.1);let t=Tt(e.z),n=wt(e.z)-pc;e.x=C.clamp(e.x,t-n,t+n)}resolveObstacle(e,t){if(bt(t)){this.resolveRockObstacle(e,t);return}this.resolveSphereObstacle(e,t)}resolveSphereObstacle(e,t){let n=e.y+Y.radius,r=e.y+Y.height-Y.radius,i=C.clamp(t.center.y,n,r),a=t.center.y-i,o=t.radius+Y.radius,s=o*o-a*a;if(s<=0)return;this.separation.set(e.x-t.center.x,e.z-t.center.z);let c=this.separation.length(),l=Math.sqrt(s);c>=l||(c<1e-6?this.separation.set(1,0):this.separation.multiplyScalar(1/c),e.x+=this.separation.x*(l-c),e.z+=this.separation.y*(l-c))}resolveRockObstacle(e,t){let n=e.y+Y.radius,r=e.y+Y.height-Y.radius;for(let i=0;i<=4;i+=1){this.capsuleSample.set(e.x,C.lerp(n,r,i/4),e.z);let a=this.rockQuery.getPlanarSeparation(t,this.capsuleSample,Y.radius,this.separation);a<=0||(e.x+=this.separation.x*a,e.z+=this.separation.y*a)}}};function vc(e){return e.length===0?null:e.reduce((e,t)=>e+t,0)/e.length}function yc(e,t){return e.length>0?Dt(e,t):null}function bc(){return{camera:0,cameraFade:0,water:0,torches:0,veins:0,atmosphere:0,lighting:0}}var xc=class{canvas;scene=new oe;initialViewportAspect=ba(window.innerWidth,window.innerHeight);camera=new de(52,this.initialViewportAspect,.08,120);initialProjectionAspect=this.camera.aspect;loading=new Ht;pipeline;startupRecovery;rendererPreference;rendererSwitch;customizationPanel;webGPUAvailable;performance;clock=new Ta;quality;qualityLabel;urlParameters=new URLSearchParams(window.location.search);harnessMode=this.urlParameters.get(`harness`)===`1`;gpuTimestampProfile=this.urlParameters.get(`gpuTimestamps`)===`1`;input;mobileControls;character;characterController;thirdPersonCamera;cape;capeFactory;performanceBots=[];webGlCapeWorkers=null;botCapeMaterial=null;nextPerformanceBotId=1;cave;water;torches;veins;atmosphere;lighting;worldCollision;worldColliders=[];fixedTime=0;harnessAccumulator=0;ready=!1;webGpuRecoveryStarted=!1;stopDeviceLossWatch=null;gpuValidationScopeStarted=!1;gpuValidationError=null;gpuValidationPending=null;customizationSettings;stabilizationVelocity=new p;savedLightIntensities=new Map;savedShadowIntensities=new Map;shadowsEnabled=!0;constructor(){this.canvas=X(document.querySelector(`#scene-canvas`),`Scene canvas is missing.`),this.scene.background=new z(330252),this.scene.fog=new je(462866,.034),this.rendererPreference=Ut({search:window.location.search}),this.startupRecovery=Vt();let e=po({apiAvailable:Kt(),userAgent:navigator.userAgent||``,diagnostics:this.startupRecovery.getDiagnostics()});this.webGPUAvailable=e.allowed,this.startupRecovery.begin(this.rendererPreference,this.urlParameters.has(`renderer`));let t=Wt(window.location.href);t!==window.location.href&&window.history.replaceState(window.history.state,``,t),this.pipeline=new uo(this.canvas,this.scene,this.camera,this.rendererPreference,this.gpuTimestampProfile,e.reason),this.rendererSwitch=new Is(this.rendererPreference,this.webGPUAvailable,e.reason),this.customizationPanel=new Fs(this.handleCustomizationChange),this.customizationSettings=this.customizationPanel.getSettings(),this.qualityLabel=X(document.querySelector(`[data-quality-label]`),`Quality label is missing.`),this.quality=new Sa(e=>this.applyQuality(e)),this.performance=new ja(this.getPerformanceReportDetails),document.body.classList.toggle(`is-harness`,this.harnessMode)}async start(){try{await this.initializeSelectedRenderer(),this.startupRecovery.complete(this.pipeline.getActualBackend())}catch(e){let t=this.startupRecovery.fail(e);if(t.action===`reload-webgl`){this.beginWebGlReload(`WebGPU startup failed; restarting once with WebGL`,t);return}throw e}}async initializeSelectedRenderer(){if(this.rendererPreference===`webgpu`&&this.webGPUAvailable?await this.loading.beginLongStage(.03,.075,`Requesting the WebGPU adapter and device`,4e3):this.rendererPreference===`webgpu`?await this.loading.update(.03,`WebGPU disabled for this browser; protecting the WebGL fallback`):await this.loading.update(.03,`Selecting the graphics backend`),await this.pipeline.init({onStage:e=>{this.startupRecovery.stage(e),this.loading.debug(`Renderer stage · ${e}`)},onWebGpuFallback:(e,t)=>{console.warn(`WebGPU failed during ${t}; recovering with WebGL.`,e),this.loading.debug(`WebGPU fallback · ${t}: ${e instanceof Error?e.message:String(e)}`),this.startupRecovery.fallbackToWebGl(e,t)}}),this.pipeline.getActualBackend()===`webgpu`)this.stopDeviceLossWatch=this.pipeline.onDeviceLost(e=>{let t=e.message||e.reason||`unknown device error`,n=this.startupRecovery.getLastStage()??`unknown-stage`;console.warn(`WebGPU device lost: ${t}`),this.recoverWithWebGL(`WebGPU lost its device. Fully quit Chrome before trying graphics again.`,Error(t),`webgpu-device-lost-after-${n}`,!1)});else if(this.rendererPreference===`webgpu`){let e=this.startupRecovery.getDiagnostics().failures.at(-1);await this.loading.update(.08,e?`WebGPU failed at ${e.stage}; continuing with WebGL`:`WebGPU unavailable; continuing with WebGL`)}this.rendererSwitch.setActive(this.pipeline.getActualBackend(),this.rendererPreference),await this.loading.beginLongStage(.08,.27,`Shaping ancient stone`,1600),this.startupRecovery.stage(`build-scene`);let t=mt(512);xt(t,Math.min(8,this.pipeline.getMaxAnisotropy())),this.cave=new nc(t),this.scene.add(this.cave.group),await this.loading.beginLongStage(.3,.52,`Awakening mineral light`,2e3),this.veins=new ic;let n=this.pipeline.usesNodeRenderer();if(n){let[{WebGpuTorchSystem:t},{WebGpuWaterSystem:n},{WebGpuCaveAtmosphere:r}]=await Promise.all([e(()=>import(`./WebGpuTorchSystem-NCsXtZIS.js`),__vite__mapDeps([4,1,2,3,5])),e(()=>import(`./WebGpuWaterSystem-De3PJANG.js`),__vite__mapDeps([6,1,2,3,5])),e(()=>import(`./WebGpuCaveAtmosphere-CMhLr3uh.js`),__vite__mapDeps([7,1,2,3,5]))]);this.torches=new t,this.water=new n,this.atmosphere=new r}else this.torches=new sc,this.water=new fc,this.atmosphere=new zs;this.scene.add(this.veins.group,this.torches.group,this.water.group,this.atmosphere.points),this.worldColliders=[...this.cave.worldColliders,...this.torches.worldColliders,...this.veins.worldColliders],this.worldCollision=new _c(this.worldColliders),await this.loading.update(.54,`Forging the traveller`),this.character=new gs;let r=11.8,i=Tt(r);this.character.root.position.set(i,this.worldCollision.getPlayerRootHeight(i,r),r),this.character.root.updateMatrixWorld(!0),this.scene.add(this.character.root);let a=this.pipeline.getWebGpuRenderer();if(a){this.startupRecovery.stage(`initialize-webgpu-cloth`),await this.loading.update(.59,`Loading the WebGPU cloth solver`);let{GpuCapeSimulation:t}=await e(async()=>{let{GpuCapeSimulation:e}=await import(`./GpuCapeSimulation-DyR8jrWn.js`);return{GpuCapeSimulation:e}},__vite__mapDeps([8,1,2,3,5]));await this.loading.update(.62,`Allocating WebGPU cloth buffers`),this.capeFactory=(e,n,r)=>new t(a,e,n,r)}else await this.loading.update(.64,`Weaving the cloth simulation`),this.capeFactory=(e,t,n)=>new Lt(e,t,n);if(this.cape=this.capeFactory(this.character.getCapeAnchors(),this.customizationSettings,yt),!(this.cape instanceof Lt)){this.startupRecovery.stage(`compile-webgpu-cloth-compute-pipelines`),await this.loading.update(.64,`Preparing WebGPU cloth kernels`);let{compileWebGpuComputePipelines:t}=await e(async()=>{let{compileWebGpuComputePipelines:e}=await import(`./WebGpuComputeWarmup-BS2ZkCSw.js`);return{compileWebGpuComputePipelines:e}},[]);await t(a,this.cape.getComputePipelineNodes(),{onPipelineStart:async({loaded:e,total:t,name:n})=>{let r=.64+e/t*.08,i=.64+(e+1)/t*.08;await this.loading.beginLongStage(r,i,`Compiling WebGPU cloth kernel ${e+1}/${t}: ${n}`,4e3)},onProgress:async({loaded:e,total:t,name:n})=>{await this.loading.update(.64+e/t*.08,`Compiled WebGPU cloth kernel ${e}/${t}: ${n}`)}})}if(this.scene.add(this.cape.mesh),await this.loading.update(.73,`Rigging movement and camera`),this.configureCharacterRenderObjects(this.character,this.cape),this.cape instanceof Lt||(this.scene.add(this.cape.botMesh),this.cape.botMesh.layers.set(0)),this.input=new mo(this.canvas,this.dismissOnboarding),this.mobileControls=new Co(this.canvas,this.input),this.characterController=new _s(this.character,this.input,this.worldCollision),this.thirdPersonCamera=new _a(this.camera,this.input),this.thirdPersonCamera.snapTo(this.character.root.position),await this.loading.update(.78,`Placing traveller lights`),n){this.startupRecovery.stage(`create-webgpu-lighting`);let{WebGpuCinematicLighting:t}=await e(async()=>{let{WebGpuCinematicLighting:e}=await import(`./WebGpuCinematicLighting-B94Tj0Mz.js`);return{WebGpuCinematicLighting:e}},__vite__mapDeps([9,3,2]));await this.loading.update(.8,`Creating WebGPU light pipelines`);let n=X(this.pipeline.getNodeRenderer(),`WebGPU node renderer is missing.`);this.lighting=new t(this.scene,n),await this.loading.update(.82,`Binding WebGPU shadows and reflections`)}else{let e=X(this.pipeline.getWebGlRenderer(),`Native WebGL renderer is missing.`);this.lighting=new Eo(this.scene,e)}this.scene.add(this.lighting.group),this.enableCharacterLighting(),this.lighting.update(this.character.root.position,0),this.torches.update(0,this.character.root.position),this.veins.update(0,this.character.root.position),await this.loading.update(.84,`Settling the first cloth frame`),this.stabilizeCape(),this.cape.syncGeometry(),this.applySceneCustomization(this.customizationSettings),this.reconcilePerformanceBots(this.customizationSettings.bots),await this.loading.beginLongStage(.88,.95,n?`Compiling WebGPU cloth, water, and post-processing shaders`:`Compiling cloth, water, and post-processing shaders`,n?22e3:4e3),this.startupRecovery.stage(`compile-render-pipelines`),await this.pipeline.compile(this.scene,this.camera),await this.loading.update(.96,`Submitting the first rendered frame`),this.startupRecovery.stage(`submit-first-frame`),this.pipeline.renderManual(0),await this.loading.update(.98,`Validating torchlight and reflections`),this.pipeline.renderManual(0),window.addEventListener(`resize`,this.handleResize),document.addEventListener(`visibilitychange`,this.handleVisibilityChange),window.addEventListener(`beforeunload`,this.dispose,{once:!0}),window.setTimeout(this.dismissOnboarding,7500),this.installHarness(),await this.loading.reveal(),this.ready=!0,window.__CAPE_DEMO__&&(window.__CAPE_DEMO__.ready=!0),this.harnessMode?(this.updateScene(0),this.pipeline.renderManual(0)):this.pipeline.renderer.setAnimationLoop(this.frame)}frame=e=>{this.performance.recordFrame(e);let t=performance.now(),n=this.clock.advance(e,this.simulateStep);this.webGlCapeWorkers?.flush();let r=this.applyWorkerCapeResults();(n.physicsSteps>0||r)&&this.syncCapeGeometries(n.physicsSteps>0);let i=performance.now();this.updateScene(n.delta),this.quality.observe(this.fixedTime,this.performance.getSnapshot());let a=performance.now();this.pipeline.render(n.delta);let o=performance.now();this.performance.recordWorkload(e,{physicsMilliseconds:i-t,sceneMilliseconds:a-i,renderMilliseconds:o-a,physicsSteps:n.physicsSteps})};simulateStep=e=>{this.fixedTime+=e,this.characterController.update(e,this.thirdPersonCamera.yaw);let t=this.characterController.consumeLandingImpact();t>0&&this.water.addLandingRipple(this.character.root.position,this.fixedTime,t);for(let t of this.performanceBots)t.input.update(this.fixedTime),t.controller.update(e,0);if(this.cape instanceof Lt){this.cape.step(e,this.character.getCapeAnchors(),this.character.getCapeColliders(),this.worldColliders,this.character.velocity,this.fixedTime);let t=[];for(let n of this.performanceBots){if(!n.cape||!(n.cape instanceof Lt))throw Error(`Mixed CPU and GPU cape simulations are unsupported.`);if(this.webGlCapeWorkers?.isDrivingCape(n.id)){t.push({capeId:n.id,anchors:n.character.getCapeAnchors(),bodyColliders:n.character.getCapeColliders(),characterVelocity:n.character.velocity});continue}n.cape.step(e,n.character.getCapeAnchors(),n.character.getCapeColliders(),this.worldColliders,n.character.velocity,this.fixedTime),n.geometryDirty=!0}this.webGlCapeWorkers?.enqueueStep(e,this.fixedTime,t);return}this.submitGpuCapeBatch(e,[{anchors:this.character.getCapeAnchors(),bodyColliders:this.character.getCapeColliders(),characterVelocity:this.character.velocity},...this.performanceBots.map(e=>({anchors:e.character.getCapeAnchors(),bodyColliders:e.character.getCapeColliders(),characterVelocity:e.character.velocity}))],this.worldColliders,this.fixedTime)};submitGpuCapeBatch(e,t,n,r){if(this.cape instanceof Lt)throw Error(`GPU cape submission requires the WebGPU solver.`);let i=this.cape.prepareBatchStep(e,t,n,r),a=X(this.pipeline.getWebGpuRenderer(),`WebGPU renderer is missing for the GPU cape batch.`);if(!this.harnessMode||this.gpuValidationScopeStarted){a.compute(i);return}let o=a.backend.device;if(!o){a.compute(i);return}this.gpuValidationScopeStarted=!0,o.pushErrorScope(`validation`),a.compute(i),this.gpuValidationPending=o.popErrorScope().then(e=>{this.gpuValidationError=e?.message??null}).catch(e=>{this.gpuValidationError=e instanceof Error?e.message:String(e)})}async assertGpuComputeValid(){if(await this.gpuValidationPending,this.gpuValidationError)throw Error(`WebGPU cape compute validation failed: ${this.gpuValidationError}`)}updateScene(e){let t=this.character.root.position,n=Math.hypot(this.character.velocity.x,this.character.velocity.z);this.thirdPersonCamera.update(e,t),this.updateCameraFade(),this.water.update(e,this.fixedTime,t,this.character.root.rotation.y,this.characterController.isGrounded()?n:0),this.torches.update(this.fixedTime,t),this.veins.update(this.fixedTime,t),this.atmosphere.update(this.fixedTime),this.lighting.update(t,this.fixedTime),this.customizationSettings.lights||this.setLightsEnabled(!1)}handleResize=()=>{xa(this.camera,window.innerWidth,window.innerHeight),this.pipeline.resize(),this.atmosphere.resize()};handleVisibilityChange=()=>{if(!document.hidden){let e=performance.now();this.clock.reset(e),this.performance.resume(e)}};dismissOnboarding=()=>{document.querySelector(`[data-onboarding]`)?.classList.add(`is-dismissed`)};recoverWithWebGL(e,t,n,r=!0){if(this.webGpuRecoveryStarted)return;let i=this.startupRecovery.failActiveRenderer(`webgpu`,n,t,r);this.beginWebGlReload(e,i)}beginWebGlReload(e,t){if(!this.webGpuRecoveryStarted){this.webGpuRecoveryStarted=!0,this.ready=!1,window.__CAPE_DEMO__&&(window.__CAPE_DEMO__.ready=!1),this.stopDeviceLossWatch?.(),this.stopDeviceLossWatch=null,document.body.classList.remove(`is-ready`);try{this.pipeline.dispose()}catch(e){console.warn(`Unable to fully dispose the failed renderer before recovery.`,e)}if(t.action===`show-error`){this.loading.fail(Error(e),this.startupRecovery.getDiagnostics());return}this.loading.update(.04,e).then(()=>{window.setTimeout(()=>{window.location.replace(Gt(window.location.href,`webgl`))},t.delayMilliseconds)})}}applyQuality(e){this.pipeline.setResolutionScale(e.scale),this.qualityLabel.textContent=e.label}handleCustomizationChange=(e,t)=>{if(this.customizationSettings=e,!(!this.cape||!this.character)){this.cape.updateSettings(e,this.character.getCapeAnchors()),this.reconcilePerformanceBots(e.bots);for(let t of this.performanceBots)t.cape?.updateSettings(e,t.character.getCapeAnchors()),t.geometryDirty=!0;t?this.stabilizeAllCapes():this.synchronizeWorkerCapeStates(),this.applySceneCustomization(e),this.ready&&this.pipeline.renderManual(0)}};applySceneCustomization(e){this.setLightsEnabled(e.lights),this.setShadowsEnabled(e.shadows),this.scene.environmentIntensity=e.reflections?.24:0,this.water.setReflectionsEnabled(e.reflections)}stabilizeCape(){this.stabilizeCapeInstance(this.character,this.cape)}stabilizeAllCapes(){if(!(this.cape instanceof Lt)){this.syncCapeGeometries();return}this.stabilizeCape(),this.performanceBots.forEach(e=>{if(e.cape){if(this.webGlCapeWorkers?.isDrivingCape(e.id)){e.geometryDirty=!0;return}this.stabilizeCapeInstance(e.character,e.cape),e.geometryDirty=!0}}),this.synchronizeWorkerCapeStates(),this.syncCapeGeometries()}stabilizeCapeInstance(e,t){let n=e.getCapeAnchors(),r=e.getCapeColliders();this.stabilizationVelocity.set(0,0,0);for(let e=0;e<12;e+=1)t.step(It,n,r,this.worldColliders,this.stabilizationVelocity,this.fixedTime+e*It)}reconcilePerformanceBots(e){let t=Bo(e);for(;this.performanceBots.length<t;)this.performanceBots.push(this.createPerformanceBot(this.performanceBots.length));for(;this.performanceBots.length>t;){let e=this.performanceBots.pop();e&&this.disposePerformanceBot(e)}}createPerformanceBot(e){let t=new gs(_t),n=Math.floor(e/2),r=e%2==0?-1:1,i=this.character.root.position.z+(n-2)*1.55,a=Tt(i)+r*.82;t.root.position.set(a,this.worldCollision.getPlayerRootHeight(a,i),i),t.root.rotation.y=e*.73,t.root.updateMatrixWorld(!0);let o=this.cape instanceof Lt?new Lt(t.getCapeAnchors(),this.customizationSettings,_t,{material:this.botCapeMaterial??=Nt(_t)}):null,s=new Vo(e);s.update(this.fixedTime);let c=this.nextPerformanceBotId;this.nextPerformanceBotId+=1;let l={id:c,character:t,cape:o,input:s,controller:new _s(t,s,this.worldCollision),geometryDirty:!1};return this.scene.add(t.root),o&&this.scene.add(o.mesh),this.configureCharacterRenderObjects(t,o,!1),o instanceof Lt&&(this.webGlCapeWorkers??=new No(this.worldColliders),this.webGlCapeWorkers.registerCape(c,o,t.getCapeAnchors(),t.getCapeColliders())),o?.syncGeometry(),l}configureCharacterRenderObjects(e,t,n=!0){let r=this.pipeline.usesNodeRenderer()?`webgpu`:`webgl`,i=+!!n;e.root.traverse(e=>{e.layers.set(i),n&&e instanceof L&&e.castShadow&&wa(e,r)}),t&&(t.mesh.layers.set(i),n&&wa(t.mesh,r))}syncCapeGeometries(e=!0){e&&this.cape.syncGeometry(),this.performanceBots.forEach(e=>{!e.cape||!e.geometryDirty||(e.cape.syncGeometry(),e.geometryDirty=!1)})}applyWorkerCapeResults(){if(!this.webGlCapeWorkers)return!1;let e=!1;for(let t of this.performanceBots){if(!(t.cape instanceof Lt))continue;let n=this.webGlCapeWorkers.consumeLatestState(t.id);n&&(t.cape.overwriteStateForHarness(n.positions,n.previous),t.cape.synchronizeAnchorDiagnostics(t.character.getCapeAnchors()),t.geometryDirty=!0,e=!0)}return e}synchronizeWorkerCapeStates(){if(this.webGlCapeWorkers)for(let e of this.performanceBots)e.cape instanceof Lt&&this.webGlCapeWorkers.updateCape(e.id,e.cape,e.character.getCapeAnchors())}disposePerformanceBot(e){this.webGlCapeWorkers?.unregisterCape(e.id),this.scene.remove(e.character.root),e.cape&&(this.scene.remove(e.cape.mesh),e.cape.dispose()),e.character.dispose()}setLightsEnabled(e){this.scene.traverse(t=>{if(t instanceof he){if(e){let e=this.savedLightIntensities.get(t);e!==void 0&&(t.intensity=e);return}this.savedLightIntensities.has(t)||this.savedLightIntensities.set(t,t.intensity),t.intensity=0}}),e&&this.savedLightIntensities.clear()}setShadowsEnabled(e){this.shadowsEnabled!==e&&(this.shadowsEnabled=e,this.scene.traverse(n=>{if(!(!(n instanceof F)&&!(n instanceof t)&&!(n instanceof dt))){if(e){let e=this.savedShadowIntensities.get(n);e!==void 0&&(n.shadow.intensity=e)}else this.savedShadowIntensities.set(n,n.shadow.intensity),n.shadow.intensity=0}}),e&&this.savedShadowIntensities.clear())}installHarness(){window.__CAPE_DEMO__={ready:!1,getDiagnostics:()=>this.getDiagnosticsAfterReadback(),setView:async({yaw:e,pitch:t,distance:n})=>(this.thirdPersonCamera.setOrbit(e,t,n,this.character.root.position),this.updateScene(0),this.pipeline.renderManual(0),this.getDiagnosticsAfterReadback()),setCameraPose:async({position:e,target:t})=>(this.thirdPersonCamera.setPose(new p().fromArray(e),new p().fromArray(t)),this.updateCameraFade(),this.pipeline.renderManual(0),this.getDiagnosticsAfterReadback()),setPlayerPose:async({position:e,yaw:t=this.character.root.rotation.y})=>(this.character.root.position.fromArray(e),this.worldCollision.resolvePlayer(this.character.root.position),this.character.root.rotation.y=t,this.character.velocity.set(0,0,0),this.characterController.resetVerticalState(),this.character.root.updateMatrixWorld(!0),this.cape.reset(this.character.getCapeAnchors()),this.cape.syncGeometry(),this.thirdPersonCamera.snapTo(this.character.root.position),this.updateCameraFade(),this.pipeline.renderManual(0),this.getDiagnosticsAfterReadback()),setMovement:(e,t)=>{this.input.setVirtualMovement(e,t)},clearMovement:()=>{this.input.clearVirtualMovement()},setRunning:e=>{this.input.setVirtualRunning(e)},jump:()=>{this.input.queueVirtualJump()},setBotCount:async e=>{this.reconcilePerformanceBots(e)},advance:({duration:e,frameStep:t=1/60})=>this.advanceHarness(e,t),traceCapeScenario:e=>this.traceCapeScenario(e),tracePackedCapeBatch:e=>this.tracePackedCapeBatch(e),profile:({duration:e,frameStep:t=1/60,synchronizationInterval:n=1,includeDiagnostics:r=!0})=>this.profileHarness(e,t,n,r),profileGpuKernels:({samples:e=4}={})=>{if(!(this.cape instanceof Lt))return this.cape.profileKernelBreakdown(e);throw Error(`Per-kernel GPU profiling requires the WebGPU cape solver.`)},runDepthOcclusionProbe:()=>Ss(this.scene,this.camera,this.pipeline),runShadowLayerProbe:()=>Es(this.pipeline.renderer)}}async advanceHarness(e,t){let n=C.clamp(t,1/144,1/30),r=C.clamp(e,0,30),i=0;for(;r>1e-6;){let e=Math.min(n,r);i=e,r-=e,this.advanceHarnessFrame(e)}return await this.synchronizeWebGlCapeWorkers(),this.pipeline.renderManual(i),this.getDiagnosticsAfterReadback()}resetHarnessPlayer(){this.input.clearVirtualMovement(),this.input.setVirtualRunning(!1),this.character.root.position.set(-2.38,0,-15),this.worldCollision.resolvePlayer(this.character.root.position),this.character.root.rotation.y=0,this.characterController.reset(),this.character.root.updateMatrixWorld(!0),this.cape.reset(this.character.getCapeAnchors()),this.harnessAccumulator=0}async raiseCapeForHarness(){await this.cape.refreshDiagnostics();let e=this.character.getCapeAnchors(),t=e.left.clone().add(e.right).multiplyScalar(.5),n=new Float32Array(J.columns*J.rows*4);for(let e=0;e<J.rows;e+=1)for(let r=0;r<J.columns;r+=1){let i=e*J.columns+r,a=this.cape.getParticlePosition(r,e),o=a.clone().sub(t);e>0&&(a.y=t.y+Math.abs(o.y)),n[i*4]=a.x,n[i*4+1]=a.y,n[i*4+2]=a.z}this.cape.overwriteStateForHarness(n,n),this.cape.syncGeometry()}captureCapeTrajectorySample(e){let t=this.character.getCapeAnchors(),n=t.left.clone().add(t.right).multiplyScalar(.5),r=t.right.clone().sub(t.left).normalize(),i=[],a=-1/0,o=Math.floor(J.rows*.58);for(let e=0;e<J.rows;e+=1)for(let s=0;s<J.columns;s+=1){let c=this.cape.getParticlePosition(s,e).clone().sub(n),l=c.dot(r),u=c.dot(t.back);i.push(l,c.y,u),e>=o&&(a=Math.max(a,c.y))}let s=this.character.getCapeColliders(),c=this.cape.getBodyPenetrationDiagnostics(s,t.back),l=Object.fromEntries(s.map(e=>[e.name,this.cape.getMaximumBodyPenetration([e],t.back)])),u=Math.max(this.cape.getParticlePosition(0,0).distanceTo(t.left),this.cape.getParticlePosition(J.columns-1,0).distanceTo(t.right));return{frame:e,time:this.fixedTime,playerPosition:this.character.root.position.toArray(),playerYaw:this.character.root.rotation.y,playerSpeed:Math.hypot(this.character.velocity.x,this.character.velocity.z),particles:i,hemDrop:this.cape.getHemDrop(),hemBackOffset:this.cape.getHemBackOffset(t),maximumParticleMotion:this.cape.getMaximumParticleMotion(),particleMotion:this.cape.getMaximumParticleMotionDiagnostics(),maximumLowerParticleHeight:a,maximumLowerHorizontalOffset:this.cape.getMaximumLowerCapeHorizontalOffset(),centerlineDeviation:this.cape.getCapeCenterlineDeviation(),rowTwistRange:this.cape.getCapeRowTwistRange(t),maximumNecklineAttachmentError:u,maximumBodyPenetration:c.maximum,bodyPenetrationByKind:c,bodyPenetrationByCollider:l,maximumStructuralError:this.cape.getMaximumStructuralError(),minimumSelfSeparation:this.cape.getMinimumSelfSeparation(),maximumUpwardFold:this.cape.getMaximumUpwardFold(),lowerCapeSpanRatio:this.cape.getAverageLowerCapeSpanRatio(t),lowerCapeRowCurlRatio:this.cape.getMaximumLowerCapeRowCurlRatio(t)}}async traceCapeScenario({scenario:e,frames:t=120,sampleEvery:n=1}){let r=C.clamp(Math.round(t),1,360),i=C.clamp(Math.round(n),1,12);this.resetHarnessPlayer(),this.fixedTime=0;let a=this.character.getCapeAnchors();this.cape.updateSettings({...At,weight:e===`lightweight-stop`?.5:At.weight},a),this.cape.reset(a),(e===`raised-drop`||e===`falling-forward-start`)&&await this.raiseCapeForHarness();let o=[];for(let t=0;t<=r;t+=1){if(e!==`raised-drop`){if(e===`forward-start`||e===`falling-forward-start`)this.input.setVirtualMovement(0,+(t>=30));else if(e===`forward-stop`||e===`lightweight-stop`)this.input.setVirtualMovement(0,+(t>=30&&t<90));else if(e===`reverse`)this.input.setVirtualMovement(0,t<30?0:t<90?1:-1);else if(e===`back-and-forth`){let e=t>=30&&t<210,n=Math.floor((t-30)/30)%2==0?1:-1;this.input.setVirtualMovement(0,e?n:0)}}if(t%i===0&&(await this.assertGpuComputeValid(),await this.cape.refreshDiagnostics(),o.push(this.captureCapeTrajectorySample(t))),t===r)break;this.fixedTime+=It,this.characterController.update(It,this.thirdPersonCamera.yaw),this.characterController.consumeLandingImpact(),this.character.root.updateMatrixWorld(!0),this.cape instanceof Lt?this.cape.step(It,this.character.getCapeAnchors(),this.character.getCapeColliders(),[],this.character.velocity,this.fixedTime):this.submitGpuCapeBatch(It,[{anchors:this.character.getCapeAnchors(),bodyColliders:this.character.getCapeColliders(),characterVelocity:this.character.velocity}],[],this.fixedTime),this.cape.syncGeometry(),this.pipeline.renderManual(It)}return this.input.clearVirtualMovement(),{scenario:e,renderer:this.pipeline.getBackendDiagnostics().actual,physicsStep:It,samples:o}}async tracePackedCapeBatch({bots:e=2,frames:t=90,sampleEvery:n=6}={}){if(this.cape instanceof Lt)throw Error(`Packed cape batch tracing requires the WebGPU solver.`);let r=C.clamp(Math.round(e),1,10),i=C.clamp(Math.round(t),2,360),a=C.clamp(Math.round(n),1,30),o=this.performanceBots.length;this.reconcilePerformanceBots(0),this.resetHarnessPlayer(),this.fixedTime=0,this.cape.updateSettings(At,this.character.getCapeAnchors()),this.cape.reset(this.character.getCapeAnchors()),this.reconcilePerformanceBots(r);let s=[];try{for(let e=0;e<i;e+=1){let t=e>=10,n=t?Math.floor((e-10)/20)%2==0?.55:-.55:0;this.input.setVirtualMovement(n,+!!t),this.simulateStep(It),this.syncCapeGeometries(),this.pipeline.renderManual(It),(e%a===0||e===i-1)&&(await this.assertGpuComputeValid(),s.push({frame:e,capes:await this.cape.readBatchStateForHarness()}))}return{renderer:`webgpu`,physicsStep:It,botCount:r,samples:s}}finally{this.input.clearVirtualMovement(),this.reconcilePerformanceBots(o)}}async profileHarness(e,t,n,r){let i=C.clamp(t,1/144,1/30),a=C.clamp(e,0,12),o=C.clamp(Math.round(n),1,120),s=[],c=[],l=[],u=[],d=[],f=[],p=[],m=this.pipeline.getProgramCount(),h=bc(),g=performance.now(),_=g,v=0,y=0;for(;a>1e-6;){let e=Math.min(i,a);a-=e;let t=this.advanceHarnessFrame(e,h);c.push(t.physicsMilliseconds),l.push(t.sceneMilliseconds);let n=performance.now();if(this.pipeline.renderManual(e),u.push(performance.now()-n),y+=1,v+=1,v>=o||a<=1e-6){await this.synchronizeWebGlCapeWorkers();let e=await this.pipeline.resolveGpuFrameTimeForLocalProfile();e===null?await this.pipeline.synchronizeForLocalProfile():(d.push(e.renderMilliseconds),f.push(e.computeMilliseconds),p.push(e.totalMilliseconds));let t=performance.now();s.push((t-_)/v),_=t,v=0}}let b=performance.now()-g,x=c.reduce((e,t)=>e+t,0),S=l.reduce((e,t)=>e+t,0),w=u.reduce((e,t)=>e+t,0);return{frames:y,synchronizationInterval:o,averageFrameMilliseconds:y>0?b/y:0,p95FrameMilliseconds:Dt(s,.95),maximumFrameMilliseconds:Math.max(0,...s),averagePhysicsMilliseconds:y>0?x/y:0,averageSceneMilliseconds:y>0?S/y:0,averageSubmissionMilliseconds:y>0?w/y:0,p95SubmissionMilliseconds:Dt(u,.95),maximumSubmissionMilliseconds:Math.max(0,...u),averageGpuRenderMilliseconds:vc(d),p95GpuRenderMilliseconds:yc(d,.95),averageGpuComputeMilliseconds:vc(f),p95GpuComputeMilliseconds:yc(f,.95),averageGpuTotalMilliseconds:vc(p),p95GpuTotalMilliseconds:yc(p,.95),gpuTimestampSamples:p.length,scenePhaseMilliseconds:Object.fromEntries(Object.entries(h).map(([e,t])=>[e,y>0?t/y:0])),programsBefore:m,programsAfter:this.pipeline.getProgramCount(),diagnostics:r?await this.getDiagnosticsAfterReadback():null}}async getDiagnosticsAfterReadback(){return await this.cape.refreshDiagnostics(),this.getDiagnostics()}advanceHarnessFrame(e,t){let n=performance.now();this.harnessAccumulator+=e;let r=!1;for(;this.harnessAccumulator+1e-7>=It;)this.simulateStep(It),this.harnessAccumulator-=It,r=!0;this.webGlCapeWorkers?.flush();let i=this.applyWorkerCapeResults();(r||i)&&this.syncCapeGeometries(r);let a=performance.now();return t?this.updateSceneProfiled(e,t):this.updateScene(e),{physicsMilliseconds:a-n,sceneMilliseconds:performance.now()-a}}async synchronizeWebGlCapeWorkers(){this.webGlCapeWorkers&&(await this.webGlCapeWorkers.synchronize(),this.applyWorkerCapeResults()&&this.syncCapeGeometries(!1))}updateSceneProfiled(e,t){let n=this.character.root.position,r=Math.hypot(this.character.velocity.x,this.character.velocity.z),i=performance.now();this.thirdPersonCamera.update(e,n),t.camera+=performance.now()-i,i=performance.now(),this.updateCameraFade(),t.cameraFade+=performance.now()-i,i=performance.now(),this.water.update(e,this.fixedTime,n,this.character.root.rotation.y,this.characterController.isGrounded()?r:0),t.water+=performance.now()-i,i=performance.now(),this.torches.update(this.fixedTime,n),t.torches+=performance.now()-i,i=performance.now(),this.veins.update(this.fixedTime,n),t.veins+=performance.now()-i,i=performance.now(),this.atmosphere.update(this.fixedTime),t.atmosphere+=performance.now()-i,i=performance.now(),this.lighting.update(n,this.fixedTime),this.customizationSettings.lights||this.setLightsEnabled(!1),t.lighting+=performance.now()-i}getDiagnostics(){let e=this.character.getCapeAnchors(),t=this.character.getCapeColliders(),n=this.cape.getClosestActiveRockSurfaceContact(this.worldColliders),r=Object.fromEntries(t.map(t=>[t.name,this.cape.getMaximumBodyPenetration([t],e.back)])),i=this.pipeline.getLastFrameRenderStats();return{ready:this.ready,simulationTime:this.fixedTime,fps:this.performance.getSnapshot(),quality:this.quality.getState(),workload:this.performance.getWorkloadSnapshot(),renderer:{...this.pipeline.getBackendDiagnostics(),calls:i.calls,triangles:i.triangles,pixelRatio:this.pipeline.renderer.getPixelRatio(),programs:this.pipeline.getProgramCount(),sizing:this.pipeline.getSizingDiagnostics(),depthComposite:this.pipeline.getDepthCompositeDiagnostics()},player:{position:this.character.root.position.toArray(),yaw:this.character.root.rotation.y,speed:Math.hypot(this.character.velocity.x,this.character.velocity.z),verticalSpeed:this.character.velocity.y,grounded:this.characterController.isGrounded(),inWater:this.water.isInWater(this.character.root.position),groundClearance:this.character.root.position.y-Y.footOffset-this.worldCollision.getGroundHeight(this.character.root.position.x,this.character.root.position.z),opacity:this.character.getOpacity(),running:this.characterController.isRunning(),gait:this.character.getAnimationDiagnostics(),capeAttachment:this.character.getCapeAttachmentDiagnostics()},camera:{aspect:this.camera.aspect,viewportAspect:ba(window.innerWidth,window.innerHeight),initialProjectionAspect:this.initialProjectionAspect,initialViewportAspect:this.initialViewportAspect,distance:this.thirdPersonCamera.getActualDistance(),pitch:this.thirdPersonCamera.getPitch(),position:this.camera.position.toArray(),groundClearance:this.camera.position.y-gt(this.camera.position.x,this.camera.position.z)},cave:{contactRocks:this.cave.contactRocks},cape:{settings:{...this.customizationSettings},maximumStructuralError:this.cape.getMaximumStructuralError(),maximumBodyPenetration:this.cape.getMaximumBodyPenetration(t,e.back),bodyPenetrationByKind:this.cape.getBodyPenetrationDiagnostics(t,e.back),bodyPenetrationByCollider:r,maximumEnvironmentPenetration:this.cape.getMaximumEnvironmentPenetration(this.worldColliders),environmentPenetrationByKind:this.cape.getEnvironmentPenetrationDiagnostics(this.worldColliders),maximumEnvironmentFacePenetration:this.cape.getMaximumEnvironmentFacePenetration(this.worldColliders),maximumParticleMotion:this.cape.getMaximumParticleMotion(),maximumParticleVerticalMotion:this.cape.getMaximumParticleVerticalMotion(),particleMotion:this.cape.getMaximumParticleMotionDiagnostics(),sleeping:this.cape.isSleeping(),minimumSelfSeparation:this.cape.getMinimumSelfSeparation(),maximumUpwardFold:this.cape.getMaximumUpwardFold(),hemDrop:this.cape.getHemDrop(),minimumLowerCapeDrop:this.cape.getMinimumLowerCapeDrop(),maximumLowerCapeLateralOffset:this.cape.getMaximumLowerCapeLateralOffset(e),averageLowerCapeSpanRatio:this.cape.getAverageLowerCapeSpanRatio(e),capeRowTwistRange:this.cape.getCapeRowTwistRange(e),capeCenterlineDeviation:this.cape.getCapeCenterlineDeviation(),maximumLowerCapeRowCurlRatio:this.cape.getMaximumLowerCapeRowCurlRatio(e),hemBackOffset:this.cape.getHemBackOffset(e),minimumHemGroundClearance:this.cape.getMinimumHemGroundClearance(),minimumActiveRockSurfaceDistance:n?.distance??null,closestActiveRockCenter:n?.center??null,hemCenter:this.cape.getParticlePosition(6,17).toArray(),worldColliders:this.worldColliders.length,worldContacts:this.cape.getWorldContactDiagnostics(),performance:this.cape.getPerformanceDiagnostics(),workers:this.webGlCapeWorkers?.getDiagnostics()??null},water:this.water.getDiagnostics(),minerals:{clusters:this.veins.getClusterPositions(),lights:this.veins.getLightDiagnostics()},torches:{lights:this.torches.getLightDiagnostics(),shadow:this.torches.getShadowDiagnostics()}}}updateCameraFade(){let e=this.thirdPersonCamera.getActualDistance(),t=ft+C.smoothstep(e,.78,2.15)*(1-ft);this.character.setOpacity(t),this.cape.setOpacity(t),this.pipeline.setCharacterOpacity(t)}getPerformanceReportDetails=()=>{let e=this.pipeline.getBackendDiagnostics(),t=this.pipeline.getSizingDiagnostics(),n=this.pipeline.getLastFrameRenderStats(),r=window.screen,i=typeof r.isExtended==`boolean`?r.isExtended:null;return{rendererStartup:this.startupRecovery.getDiagnostics(),renderer:{backend:e.backend,vendor:e.vendor,device:e.device,preference:e.preference,actual:e.actual,fallback:e.fallback,drawCalls:n.calls,triangles:n.triangles,programs:this.pipeline.getProgramCount()},canvas:{drawingBufferWidth:t.drawingBufferWidth,drawingBufferHeight:t.drawingBufferHeight,cssWidth:window.innerWidth,cssHeight:window.innerHeight},quality:{label:this.quality.getState().label,scale:this.quality.getState().scale,targetResizes:t.targetResizeCount},workload:this.performance.getWorkloadSnapshot(),capeSolver:this.ready?this.cape.getPerformanceDiagnostics():null,capeWorkers:this.webGlCapeWorkers?.getDiagnostics()??null,scene:{simulationSeconds:this.fixedTime,capeSleeping:this.ready?this.cape.isSleeping():!1,worldColliders:this.worldColliders.length,activeRipples:this.ready?this.water.getDiagnostics().activeRipples:0,botCount:this.performanceBots.length,simulatedCapes:1+this.performanceBots.length},page:{visibility:document.visibilityState,focused:document.hasFocus(),devicePixelRatio:window.devicePixelRatio,multipleScreens:i,url:window.location.href},runtime:{platform:navigator.platform||`Unknown platform`,userAgent:navigator.userAgent||`Unavailable`}}};enableCharacterLighting(){this.scene.traverse(e=>{e instanceof he&&(e.layers.enable(1),(e instanceof F||e instanceof t||e instanceof dt)&&e.shadow.camera.layers.enable(1))})}dispose=()=>{for(this.stopDeviceLossWatch?.(),this.stopDeviceLossWatch=null,this.rendererSwitch.dispose(),this.customizationPanel.dispose(),this.mobileControls?.dispose(),this.input?.dispose();this.performanceBots.length>0;){let e=this.performanceBots.pop();e&&this.disposePerformanceBot(e)}this.webGlCapeWorkers?.dispose(),this.webGlCapeWorkers=null,this.botCapeMaterial?.map?.dispose(),this.botCapeMaterial?.normalMap?.dispose(),this.botCapeMaterial?.roughnessMap?.dispose(),this.botCapeMaterial?.dispose(),this.botCapeMaterial=null,this.cape?.dispose(),this.character?.dispose(),this.lighting?.dispose(),this.performance.dispose(),this.pipeline.dispose(),window.removeEventListener(`resize`,this.handleResize),document.removeEventListener(`visibilitychange`,this.handleVisibilityChange)}};export{xc as CapeDemo,eo as a,ro as i,wo as n,$a as o,no as r,Xa as s,rc as t};
//# sourceMappingURL=CapeDemo-DW0oQQAU.js.map