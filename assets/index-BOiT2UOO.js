const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/WebGpuRenderPipeline-BmtqFrgH.js","assets/three.core-D3xM8gHG.js","assets/three.webgpu-WlP_CV4k.js","assets/three.tsl-DHP1R6xo.js","assets/WebGpuTorchSystem-Bbk9bAuH.js","assets/caveProfile-B5c2cC3U.js","assets/WebGpuWaterSystem-D3G0voJj.js","assets/WebGpuCaveAtmosphere-BU6ls5QU.js","assets/GpuCapeSimulation-BhPSd6Uv.js","assets/WebGpuCinematicLighting-Dt6EnYru.js"])))=>i.map(i=>d[i]);
import{A as e,An as t,Ar as n,At as r,Bn as i,Bt as a,Cr as o,D as s,Dn as c,E as l,En as u,Er as d,Et as f,F as p,Ft as m,H as h,Hn as g,I as _,It as v,Jt as y,Kn as b,L as x,Lt as S,M as C,Mn as w,Mr as T,Mt as E,N as D,Nt as O,O as k,Or as ee,Ot as A,Pn as te,Pt as ne,Qn as re,Rt as ie,S as ae,Sr as oe,T as se,Tn as j,Tr as ce,Tt as le,U as ue,Ut as de,Vn as fe,Vt as M,W as pe,Y as me,Zn as he,_ as ge,_r as _e,_t as N,a as ve,ar as ye,b as be,br as xe,bt as Se,cr as Ce,ct as we,d as Te,dr as Ee,dt as De,er as Oe,f as P,fr as ke,g as Ae,gr as F,gt as je,h as Me,hr as I,ht as L,i as Ne,ir as Pe,j as Fe,jn as R,jr as z,jt as Ie,k as Le,kr as B,kt as V,l as Re,lt as H,mr as U,n as ze,nr as Be,nt as Ve,o as He,or as Ue,ot as We,p as W,pr as Ge,pt as G,qn as Ke,qt as qe,r as Je,rr as Ye,s as K,tr as Xe,tt as Ze,u as Qe,ur as $e,ut as et,v as tt,vr as nt,vt as rt,wr as q,x as it,xr as at,xt as ot,y as st,yt as ct,z as lt,zn as ut,zt as dt}from"./three.core-D3xM8gHG.js";import{_ as J,a as ft,b as pt,c as mt,d as ht,f as gt,g as _t,h as vt,i as yt,m as bt,n as xt,o as St,p as Ct,r as wt,s as Tt,u as Et,v as Dt,x as Y,y as Ot}from"./caveProfile-B5c2cC3U.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function kt(){let e=null,t=!1,n=null,r=null;function i(t,a){n(t,a),r=e.requestAnimationFrame(i)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function At(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var X={alphahash_fragment:`#ifdef USE_ALPHAHASH
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
}`},Z={common:{diffuse:{value:new P(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new L},alphaMap:{value:null},alphaMapTransform:{value:new L},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new L}},envmap:{envMap:{value:null},envMapRotation:{value:new L},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new L}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new L}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new L},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new L},normalScale:{value:new U(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new L},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new L}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new L}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new L}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new P(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new I},probesMax:{value:new I},probesResolution:{value:new I}},points:{diffuse:{value:new P(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new L},alphaTest:{value:0},uvTransform:{value:new L}},sprite:{diffuse:{value:new P(16777215)},opacity:{value:1},center:{value:new U(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new L},alphaMap:{value:null},alphaMapTransform:{value:new L},alphaTest:{value:0}}},jt={basic:{uniforms:B([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.fog]),vertexShader:X.meshbasic_vert,fragmentShader:X.meshbasic_frag},lambert:{uniforms:B([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,Z.lights,{emissive:{value:new P(0)},envMapIntensity:{value:1}}]),vertexShader:X.meshlambert_vert,fragmentShader:X.meshlambert_frag},phong:{uniforms:B([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,Z.lights,{emissive:{value:new P(0)},specular:{value:new P(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:X.meshphong_vert,fragmentShader:X.meshphong_frag},standard:{uniforms:B([Z.common,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.roughnessmap,Z.metalnessmap,Z.fog,Z.lights,{emissive:{value:new P(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:X.meshphysical_vert,fragmentShader:X.meshphysical_frag},toon:{uniforms:B([Z.common,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.gradientmap,Z.fog,Z.lights,{emissive:{value:new P(0)}}]),vertexShader:X.meshtoon_vert,fragmentShader:X.meshtoon_frag},matcap:{uniforms:B([Z.common,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,{matcap:{value:null}}]),vertexShader:X.meshmatcap_vert,fragmentShader:X.meshmatcap_frag},points:{uniforms:B([Z.points,Z.fog]),vertexShader:X.points_vert,fragmentShader:X.points_frag},dashed:{uniforms:B([Z.common,Z.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:X.linedashed_vert,fragmentShader:X.linedashed_frag},depth:{uniforms:B([Z.common,Z.displacementmap]),vertexShader:X.depth_vert,fragmentShader:X.depth_frag},normal:{uniforms:B([Z.common,Z.bumpmap,Z.normalmap,Z.displacementmap,{opacity:{value:1}}]),vertexShader:X.meshnormal_vert,fragmentShader:X.meshnormal_frag},sprite:{uniforms:B([Z.sprite,Z.fog]),vertexShader:X.sprite_vert,fragmentShader:X.sprite_frag},background:{uniforms:{uvTransform:{value:new L},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:X.background_vert,fragmentShader:X.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new L}},vertexShader:X.backgroundCube_vert,fragmentShader:X.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:X.cube_vert,fragmentShader:X.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:X.equirect_vert,fragmentShader:X.equirect_frag},distance:{uniforms:B([Z.common,Z.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:X.distance_vert,fragmentShader:X.distance_frag},shadow:{uniforms:B([Z.lights,Z.fog,{color:{value:new P(0)},opacity:{value:1}}]),vertexShader:X.shadow_vert,fragmentShader:X.shadow_frag}};jt.physical={uniforms:B([jt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new L},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new L},clearcoatNormalScale:{value:new U(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new L},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new L},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new L},sheen:{value:0},sheenColor:{value:new P(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new L},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new L},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new L},transmissionSamplerSize:{value:new U},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new L},attenuationDistance:{value:0},attenuationColor:{value:new P(0)},specularColor:{value:new P(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new L},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new L},anisotropyVector:{value:new U},anisotropyMap:{value:null},anisotropyMapTransform:{value:new L}}]),vertexShader:X.meshphysical_vert,fragmentShader:X.meshphysical_frag};var Mt={r:0,b:0,g:0},Nt=new je,Pt=new L;Pt.set(-1,0,0,0,1,0,0,0,1);function Ft(e,t,n,r,a,o){let s=new P(0),c=a===!0?0:1,l,u,f=null,p=0,m=null;function h(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function _(t){let r=!1,i=h(t);i===null?y(s,c):i&&i.isColor&&(y(i,1),r=!0);let a=e.xr.getEnvironmentBlendMode();a===`additive`?n.buffers.color.setClear(0,0,0,1,o):a===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,o),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function v(t,n){let a=h(n);a&&(a.isCubeTexture||a.mapping===306)?(u===void 0&&(u=new N(new ve(1,1,1),new g({name:`BackgroundCubeMaterial`,uniforms:at(jt.backgroundCube.uniforms),vertexShader:jt.backgroundCube.vertexShader,fragmentShader:jt.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute(`normal`),u.geometry.deleteAttribute(`uv`),u.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),u.material.uniforms.envMap.value=a,u.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Nt.makeRotationFromEuler(n.backgroundRotation)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&u.material.uniforms.backgroundRotation.value.premultiply(Pt),u.material.toneMapped=W.getTransfer(a.colorSpace)!==i,(f!==a||p!==a.version||m!==e.toneMapping)&&(u.material.needsUpdate=!0,f=a,p=a.version,m=e.toneMapping),u.layers.enableAll(),t.unshift(u,u.geometry,u.material,0,0,null)):a&&a.isTexture&&(l===void 0&&(l=new N(new S(2,2),new g({name:`BackgroundMaterial`,uniforms:at(jt.background.uniforms),vertexShader:jt.background.vertexShader,fragmentShader:jt.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=a,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.toneMapped=W.getTransfer(a.colorSpace)!==i,a.matrixAutoUpdate===!0&&a.updateMatrix(),l.material.uniforms.uvTransform.value.copy(a.matrix),(f!==a||p!==a.version||m!==e.toneMapping)&&(l.material.needsUpdate=!0,f=a,p=a.version,m=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null))}function y(t,r){t.getRGB(Mt,d(e)),n.buffers.color.setClear(Mt.r,Mt.g,Mt.b,r,o)}function b(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return s},setClearColor:function(e,t=1){s.set(e),c=t,y(s,c)},getClearAlpha:function(){return c},setClearAlpha:function(e){c=e,y(s,c)},render:_,addToRenderList:v,dispose:b}}function It(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function Lt(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function Rt(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&n!==1015&&!i)}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(z(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&z(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function zt(e){let t=this,n=null,r=0,i=!1,a=!1,o=new v,s=new L,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var Bt=4,Vt=[.125,.215,.35,.446,.526,.582],Ht=20,Ut=256,Wt=new ne,Gt=new P,Kt=null,qt=0,Jt=0,Yt=!1,Xt=new I,Zt=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=Xt}=i;Kt=this._renderer.getRenderTarget(),qt=this._renderer.getActiveCubeFace(),Jt=this._renderer.getActiveMipmapLevel(),Yt=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=an(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=rn(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Kt,qt,Jt),this._renderer.xr.enabled=Yt,e.scissorTest=!1,en(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Kt=this._renderer.getRenderTarget(),qt=this._renderer.getActiveCubeFace(),Jt=this._renderer.getActiveMipmapLevel(),Yt=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:We,minFilter:We,generateMipmaps:!1,type:ue,format:qe,colorSpace:et,depthBuffer:!1},r=$t(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=$t(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Qt(r)),this._blurMaterial=nn(r,e,t),this._ggxMaterial=tn(r,e,t)}return r}_compileMaterial(e){let t=new N(new K,e);this._renderer.compile(t,Wt)}_sceneToCubeUV(e,t,n,r,i){let a=new m(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(Gt),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new N(new ve,new rt({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,h=e.background;h?h.isColor&&(f.color.copy(h),e.background=null,p=!0):(f.color.copy(Gt),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;en(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=h}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=an()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=rn());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;en(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,Wt)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(0+c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-Bt?n-d+Bt:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,en(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,Wt),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,en(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,Wt)}_blur(e,t,n,r,i){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,`latitudinal`,i),this._halfBlur(a,e,n,n,r,`longitudinal`,i)}_halfBlur(e,t,n,r,i,a,o){let s=this._renderer,c=this._blurMaterial;a!==`latitudinal`&&a!==`longitudinal`&&q(`blur direction must be either latitudinal or longitudinal!`);let l=this._lodMeshes[r];l.material=c;let u=c.uniforms,d=this._sizeLods[n]-1,f=isFinite(i)?Math.PI/(2*d):2*Math.PI/39,p=i/f,m=isFinite(i)?1+Math.floor(3*p):Ht;m>Ht&&z(`sigmaRadians, ${i}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ht}`);let h=[],g=0;for(let e=0;e<Ht;++e){let t=e/p,n=Math.exp(-t*t/2);h.push(n),e===0?g+=n:e<m&&(g+=2*n)}for(let e=0;e<h.length;e++)h[e]=h[e]/g;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=h,u.latitudinal.value=a===`latitudinal`,o&&(u.poleAxis.value=o);let{_lodMax:_}=this;u.dTheta.value=f,u.mipInt.value=_-n;let v=this._sizeLods[r];en(t,3*v*(r>_-Bt?r-_+Bt:0),4*(this._cubeSize-v),3*v,2*v),s.setRenderTarget(t),s.render(l,Wt)}};function Qt(e){let t=[],n=[],r=[],i=e,a=e-Bt+1+Vt.length;for(let o=0;o<a;o++){let a=2**i;t.push(a);let s=1/a;o>e-Bt?s=Vt[o-e+Bt-1]:o===0&&(s=0),n.push(s);let c=1/(a-2),l=-c,u=1+c,d=[l,l,u,l,u,u,l,l,u,u,l,u],f=new Float32Array(108),p=new Float32Array(72),m=new Float32Array(36);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];f.set(r,18*e),p.set(d,12*e);let i=[e,e,e,e,e,e];m.set(i,6*e)}let h=new K;h.setAttribute(`position`,new He(f,3)),h.setAttribute(`uv`,new He(p,2)),h.setAttribute(`faceIndex`,new He(m,1)),r.push(new N(h,null)),i>Bt&&i--}return{lodMeshes:r,sizeLods:t,sigmas:n}}function $t(e,t,n){let r=new nt(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function en(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function tn(e,t,n){return new g({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:Ut,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:on(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function nn(e,t,n){let r=new Float32Array(Ht),i=new I(0,1,0);return new g({name:`SphericalGaussianBlur`,defines:{n:Ht,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:on(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function rn(){return new g({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:on(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function an(){return new g({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:on(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function on(){return`

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
	`}var sn=class extends nt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new tt(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new ve(5,5,5),i=new g({name:`CubemapFromEquirect`,uniforms:at(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new N(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=We),new Ae(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function cn(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new sn(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new Zt(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new Zt(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function ln(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&T(`WebGLRenderer: `+e+` extension not supported.`),t}}}function un(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0?t:(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++,t)}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?Pe:Ye)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function dn(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function fn(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:q(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function pn(e,t,n){let r=new WeakMap,i=new F;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new it(h,p,m,u);g.type=_,g.needsUpdate=!0;let v=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*v;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new U(p,m)},r.set(o,d);function y(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,y)}o.addEventListener(`dispose`,y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function mn(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var hn={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function gn(e,t,n,r,i,a){let o=new nt(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,depthTexture:i?new s(t,n):void 0}),l=new nt(t,n,{type:ue,depthBuffer:!1,stencilBuffer:!1}),u=new K;u.setAttribute(`position`,new p([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute(`uv`,new p([0,2,0,0,2,0],2));let d=new c({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),f=new N(u,d),m=new ne(-1,1,1,-1,0,1),h=null,g=null,_=!1,v,y=null,b=[],x=!1;this.setSize=function(e,t){o.setSize(e,t),l.setSize(e,t);for(let n=0;n<b.length;n++){let r=b[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){b=e,x=b.length>0&&b[0].isRenderPass===!0;let t=o.width,n=o.height;for(let e=0;e<b.length;e++){let r=b[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(_||e.toneMapping===0&&b.length===0)return!1;if(y=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return x===!1&&e.setRenderTarget(o),v=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return x},this.end=function(e,t){e.toneMapping=v,_=!0;let n=o,r=l;for(let i=0;i<b.length;i++){let a=b[i];if(a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1)){let e=n;n=r,r=e}}if(h!==e.outputColorSpace||g!==e.toneMapping){h=e.outputColorSpace,g=e.toneMapping,d.defines={},W.getTransfer(h)===`srgb`&&(d.defines.SRGB_TRANSFER=``);let t=hn[g];t&&(d.defines[t]=``),d.needsUpdate=!0}d.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(y),e.render(f,m),y=null,_=!1},this.isCompositing=function(){return _},this.dispose=function(){o.depthTexture&&o.depthTexture.dispose(),o.dispose(),l.dispose(),u.dispose(),d.dispose()}}var _n=new he,vn=new s(1,1),yn=new it,bn=new be,xn=new tt,Sn=[],Cn=[],wn=new Float32Array(16),Tn=new Float32Array(9),En=new Float32Array(4);function Dn(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Sn[i];if(a===void 0&&(a=new Float32Array(i),Sn[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function On(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function kn(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function An(e,t){let n=Cn[t];n===void 0&&(n=new Int32Array(t),Cn[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function jn(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Mn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(On(n,t))return;e.uniform2fv(this.addr,t),kn(n,t)}}function Nn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(On(n,t))return;e.uniform3fv(this.addr,t),kn(n,t)}}function Pn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(On(n,t))return;e.uniform4fv(this.addr,t),kn(n,t)}}function Fn(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(On(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),kn(n,t)}else{if(On(n,r))return;En.set(r),e.uniformMatrix2fv(this.addr,!1,En),kn(n,r)}}function In(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(On(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),kn(n,t)}else{if(On(n,r))return;Tn.set(r),e.uniformMatrix3fv(this.addr,!1,Tn),kn(n,r)}}function Ln(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(On(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),kn(n,t)}else{if(On(n,r))return;wn.set(r),e.uniformMatrix4fv(this.addr,!1,wn),kn(n,r)}}function Rn(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function zn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(On(n,t))return;e.uniform2iv(this.addr,t),kn(n,t)}}function Bn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(On(n,t))return;e.uniform3iv(this.addr,t),kn(n,t)}}function Vn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(On(n,t))return;e.uniform4iv(this.addr,t),kn(n,t)}}function Hn(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Un(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(On(n,t))return;e.uniform2uiv(this.addr,t),kn(n,t)}}function Wn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(On(n,t))return;e.uniform3uiv(this.addr,t),kn(n,t)}}function Gn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(On(n,t))return;e.uniform4uiv(this.addr,t),kn(n,t)}}function Kn(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(vn.compareFunction=n.isReversedDepthBuffer()?518:515,a=vn):a=_n,n.setTexture2D(t||a,i)}function qn(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||bn,i)}function Jn(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||xn,i)}function Yn(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||yn,i)}function Xn(e){switch(e){case 5126:return jn;case 35664:return Mn;case 35665:return Nn;case 35666:return Pn;case 35674:return Fn;case 35675:return In;case 35676:return Ln;case 5124:case 35670:return Rn;case 35667:case 35671:return zn;case 35668:case 35672:return Bn;case 35669:case 35673:return Vn;case 5125:return Hn;case 36294:return Un;case 36295:return Wn;case 36296:return Gn;case 35678:case 36198:case 36298:case 36306:case 35682:return Kn;case 35679:case 36299:case 36307:return qn;case 35680:case 36300:case 36308:case 36293:return Jn;case 36289:case 36303:case 36311:case 36292:return Yn}}function Zn(e,t){e.uniform1fv(this.addr,t)}function Qn(e,t){let n=Dn(t,this.size,2);e.uniform2fv(this.addr,n)}function $n(e,t){let n=Dn(t,this.size,3);e.uniform3fv(this.addr,n)}function er(e,t){let n=Dn(t,this.size,4);e.uniform4fv(this.addr,n)}function tr(e,t){let n=Dn(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function nr(e,t){let n=Dn(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function rr(e,t){let n=Dn(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function ir(e,t){e.uniform1iv(this.addr,t)}function ar(e,t){e.uniform2iv(this.addr,t)}function or(e,t){e.uniform3iv(this.addr,t)}function sr(e,t){e.uniform4iv(this.addr,t)}function cr(e,t){e.uniform1uiv(this.addr,t)}function lr(e,t){e.uniform2uiv(this.addr,t)}function ur(e,t){e.uniform3uiv(this.addr,t)}function dr(e,t){e.uniform4uiv(this.addr,t)}function fr(e,t,n){let r=this.cache,i=t.length,a=An(n,i);On(r,a)||(e.uniform1iv(this.addr,a),kn(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?vn:_n;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function pr(e,t,n){let r=this.cache,i=t.length,a=An(n,i);On(r,a)||(e.uniform1iv(this.addr,a),kn(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||bn,a[e])}function mr(e,t,n){let r=this.cache,i=t.length,a=An(n,i);On(r,a)||(e.uniform1iv(this.addr,a),kn(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||xn,a[e])}function hr(e,t,n){let r=this.cache,i=t.length,a=An(n,i);On(r,a)||(e.uniform1iv(this.addr,a),kn(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||yn,a[e])}function gr(e){switch(e){case 5126:return Zn;case 35664:return Qn;case 35665:return $n;case 35666:return er;case 35674:return tr;case 35675:return nr;case 35676:return rr;case 5124:case 35670:return ir;case 35667:case 35671:return ar;case 35668:case 35672:return or;case 35669:case 35673:return sr;case 5125:return cr;case 36294:return lr;case 36295:return ur;case 36296:return dr;case 35678:case 36198:case 36298:case 36306:case 35682:return fr;case 35679:case 36299:case 36307:return pr;case 35680:case 36300:case 36308:case 36293:return mr;case 36289:case 36303:case 36311:case 36292:return hr}}var _r=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Xn(t.type)}},vr=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=gr(t.type)}},yr=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},br=/(\w+)(\])?(\[|\.)?/g;function xr(e,t){e.seq.push(t),e.map[t.id]=t}function Sr(e,t,n){let r=e.name,i=r.length;for(br.lastIndex=0;;){let a=br.exec(r),o=br.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){xr(n,l===void 0?new _r(s,e,t):new vr(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new yr(s),xr(n,e)),n=e}}}var Cr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Sr(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function wr(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Tr=37297,Er=0;function Dr(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Or=new L;function kr(e){W._getMatrix(Or,W.workingColorSpace,e);let t=`mat3( ${Or.elements.map(e=>e.toFixed(4))} )`;switch(W.getTransfer(e)){case De:return[t,`LinearTransferOETF`];case i:return[t,`sRGBTransferOETF`];default:return z(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Ar(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Dr(e.getShaderSource(t),r)}return i}function jr(e,t){let n=kr(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var Mr={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Nr(e,t){let n=Mr[t];return n===void 0?(z(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Pr=new I;function Fr(){return W.getLuminanceCoefficients(Pr),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Pr.x.toFixed(4)}, ${Pr.y.toFixed(4)}, ${Pr.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Ir(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(zr).join(`
`)}function Lr(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Rr(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function zr(e){return e!==``}function Br(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Vr(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Hr=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ur(e){return e.replace(Hr,Gr)}var Wr=new Map;function Gr(e,t){let n=X[t];if(n===void 0){let e=Wr.get(t);if(e!==void 0)n=X[e],z(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return Ur(n)}var Kr=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function qr(e){return e.replace(Kr,Jr)}function Jr(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Yr(e){let t=`precision ${e.precision} float;
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
#define LOW_PRECISION`),t}var Xr={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function Zr(e){return Xr[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var Qr={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function $r(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:Qr[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var ei={302:`ENVMAP_MODE_REFRACTION`};function ti(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:ei[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var ni={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function ri(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:ni[e.combine]||`ENVMAP_BLENDING_NONE`}function ii(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function ai(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=Zr(n),l=$r(n),u=ti(n),d=ri(n),f=ii(n),p=Ir(n),m=Lr(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(zr).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(zr).join(`
`),_.length>0&&(_+=`
`)):(g=[Yr(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(zr).join(`
`),_=[Yr(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:X.tonemapping_pars_fragment,n.toneMapping===0?``:Nr(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,X.colorspace_pars_fragment,jr(`linearToOutputTexel`,n.outputColorSpace),Fr(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(zr).join(`
`)),o=Ur(o),o=Br(o,n),o=Vr(o,n),s=Ur(s),s=Br(s,n),s=Vr(s,n),o=qr(o),s=qr(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=wr(i,i.VERTEX_SHADER,y),S=wr(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=Ar(i,x,`vertex`),n=Ar(i,S,`fragment`);q(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):z(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new Cr(i,h),T=Rr(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,Tr)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Er++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var oi=0,si=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new ci(e),t.set(e,n)),n}},ci=class{constructor(e){this.id=oi++,this.code=e,this.usedTimes=0}};function li(e){return e===1030||e===37490||e===36285}function ui(e,t,n,r,i,a){let o=new Ze,s=new si,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&z(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,k,ee;if(C){let e=jt[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),k=e.id,ee=t.id}let A=e.getRenderTarget(),te=e.state.buffers.depth.getReversed(),ne=h.isInstancedMesh===!0,re=h.isBatchedMesh===!0,ie=!!i.map,ae=!!i.matcap,oe=!!x,se=!!i.aoMap,j=!!i.lightMap,ce=!!i.bumpMap&&i.wireframe===!1,le=!!i.normalMap,ue=!!i.displacementMap,de=!!i.emissiveMap,fe=!!i.metalnessMap,M=!!i.roughnessMap,pe=i.anisotropy>0,me=i.clearcoat>0,he=i.dispersion>0,ge=i.iridescence>0,_e=i.sheen>0,N=i.transmission>0,ve=pe&&!!i.anisotropyMap,ye=me&&!!i.clearcoatMap,be=me&&!!i.clearcoatNormalMap,xe=me&&!!i.clearcoatRoughnessMap,Se=ge&&!!i.iridescenceMap,Ce=ge&&!!i.iridescenceThicknessMap,we=_e&&!!i.sheenColorMap,Te=_e&&!!i.sheenRoughnessMap,Ee=!!i.specularMap,De=!!i.specularColorMap,Oe=!!i.specularIntensityMap,P=N&&!!i.transmissionMap,ke=N&&!!i.thicknessMap,Ae=!!i.gradientMap,F=!!i.alphaMap,je=i.alphaTest>0,Me=!!i.alphaHash,I=!!i.extensions,L=0;i.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(L=e.toneMapping);let Ne={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:k,customFragmentShaderID:ee,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:re,batchingColor:re&&h._colorsTexture!==null,instancing:ne,instancingColor:ne&&h.instanceColor!==null,instancingMorph:ne&&h.morphTexture!==null,outputColorSpace:A===null?e.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:W.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:ie,matcap:ae,envMap:oe,envMapMode:oe&&x.mapping,envMapCubeUVHeight:S,aoMap:se,lightMap:j,bumpMap:ce,normalMap:le,displacementMap:ue,emissiveMap:de,normalMapObjectSpace:le&&i.normalMapType===1,normalMapTangentSpace:le&&i.normalMapType===0,packedNormalMap:le&&i.normalMapType===0&&li(i.normalMap.format),metalnessMap:fe,roughnessMap:M,anisotropy:pe,anisotropyMap:ve,clearcoat:me,clearcoatMap:ye,clearcoatNormalMap:be,clearcoatRoughnessMap:xe,dispersion:he,iridescence:ge,iridescenceMap:Se,iridescenceThicknessMap:Ce,sheen:_e,sheenColorMap:we,sheenRoughnessMap:Te,specularMap:Ee,specularColorMap:De,specularIntensityMap:Oe,transmission:N,transmissionMap:P,thicknessMap:ke,gradientMap:Ae,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:F,alphaTest:je,alphaHash:Me,combine:i.combine,mapUv:ie&&m(i.map.channel),aoMapUv:se&&m(i.aoMap.channel),lightMapUv:j&&m(i.lightMap.channel),bumpMapUv:ce&&m(i.bumpMap.channel),normalMapUv:le&&m(i.normalMap.channel),displacementMapUv:ue&&m(i.displacementMap.channel),emissiveMapUv:de&&m(i.emissiveMap.channel),metalnessMapUv:fe&&m(i.metalnessMap.channel),roughnessMapUv:M&&m(i.roughnessMap.channel),anisotropyMapUv:ve&&m(i.anisotropyMap.channel),clearcoatMapUv:ye&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:be&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:xe&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:Se&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:Ce&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:we&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:Te&&m(i.sheenRoughnessMap.channel),specularMapUv:Ee&&m(i.specularMap.channel),specularColorMapUv:De&&m(i.specularColorMap.channel),specularIntensityMapUv:Oe&&m(i.specularIntensityMap.channel),transmissionMapUv:P&&m(i.transmissionMap.channel),thicknessMapUv:ke&&m(i.thicknessMap.channel),alphaMapUv:F&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(le||pe),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(ie||F),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&le===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:te,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:L,decodeVideoTexture:ie&&i.map.isVideoTexture===!0&&W.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:de&&i.emissiveMap.isVideoTexture===!0&&W.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:I&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(I&&i.extensions.multiDraw===!0||re)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Ne.vertexUv1s=c.has(1),Ne.vertexUv2s=c.has(2),Ne.vertexUv3s=c.has(3),c.clear(),Ne}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=jt[t];n=ye.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new ai(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function di(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function fi(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function pi(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function mi(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.push(u):a.transparent===!0?i.push(u):n.push(u)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t,a){n.length>1&&n.sort(e||fi),r.length>1&&r.sort(t||pi),i.length>1&&i.sort(t||pi),a&&(n.reverse(),r.reverse(),i.reverse())}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function hi(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new mi,e.set(t,[i])):n>=r.length?(i=new mi,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function gi(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={direction:new I,color:new P};break;case`SpotLight`:n={position:new I,direction:new I,color:new P,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new I,color:new P,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new I,skyColor:new P,groundColor:new P};break;case`RectAreaLight`:n={color:new P,position:new I,halfWidth:new I,halfHeight:new I}}return e[t.id]=n,n}}}function _i(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new U};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new U};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new U,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var vi=0;function yi(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function bi(e){let t=new gi,n=_i(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new I);let i=new I,a=new je,o=new je;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0;i.sort(yi);for(let e=0,y=i.length;e<y;e++){let y=i[e],b=y.color,x=y.intensity,S=y.distance,C=null;if(y.shadow&&y.shadow.map&&(C=y.shadow.map.texture.format===1030?y.shadow.map.texture:y.shadow.map.depthTexture||y.shadow.map.texture),y.isAmbientLight)a+=b.r*x,o+=b.g*x,s+=b.b*x;else if(y.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(y.sh.coefficients[e],x);v++}else if(y.isDirectionalLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[c]=t,r.directionalShadowMap[c]=C,r.directionalShadowMatrix[c]=y.shadow.matrix,p++}r.directional[c]=e,c++}else if(y.isSpotLight){let e=t.get(y);e.position.setFromMatrixPosition(y.matrixWorld),e.color.copy(b).multiplyScalar(x),e.distance=S,e.coneCos=Math.cos(y.angle),e.penumbraCos=Math.cos(y.angle*(1-y.penumbra)),e.decay=y.decay,r.spot[u]=e;let i=y.shadow;if(y.map&&(r.spotLightMap[g]=y.map,g++,i.updateMatrices(y),y.castShadow&&_++),r.spotLightMatrix[u]=i.matrix,y.castShadow){let e=n.get(y);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[u]=e,r.spotShadowMap[u]=C,h++}u++}else if(y.isRectAreaLight){let e=t.get(y);e.color.copy(b).multiplyScalar(x),e.halfWidth.set(y.width*.5,0,0),e.halfHeight.set(0,y.height*.5,0),r.rectArea[d]=e,d++}else if(y.isPointLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),e.distance=y.distance,e.decay=y.decay,y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[l]=t,r.pointShadowMap[l]=C,r.pointShadowMatrix[l]=y.shadow.matrix,m++}r.point[l]=e,l++}else if(y.isHemisphereLight){let e=t.get(y);e.skyColor.copy(y.color).multiplyScalar(x),e.groundColor.copy(y.groundColor).multiplyScalar(x),r.hemi[f]=e,f++}}d>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=Z.LTC_FLOAT_1,r.rectAreaLTC2=Z.LTC_FLOAT_2):(r.rectAreaLTC1=Z.LTC_HALF_1,r.rectAreaLTC2=Z.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let y=r.hash;(y.directionalLength!==c||y.pointLength!==l||y.spotLength!==u||y.rectAreaLength!==d||y.hemiLength!==f||y.numDirectionalShadows!==p||y.numPointShadows!==m||y.numSpotShadows!==h||y.numSpotMaps!==g||y.numLightProbes!==v)&&(r.directional.length=c,r.spot.length=u,r.rectArea.length=d,r.point.length=l,r.hemi.length=f,r.directionalShadow.length=p,r.directionalShadowMap.length=p,r.pointShadow.length=m,r.pointShadowMap.length=m,r.spotShadow.length=h,r.spotShadowMap.length=h,r.directionalShadowMatrix.length=p,r.pointShadowMatrix.length=m,r.spotLightMatrix.length=h+g-_,r.spotLightMap.length=g,r.numSpotLightShadowsWithMaps=_,r.numLightProbes=v,y.directionalLength=c,y.pointLength=l,y.spotLength=u,y.rectAreaLength=d,y.hemiLength=f,y.numDirectionalShadows=p,y.numPointShadows=m,y.numSpotShadows=h,y.numSpotMaps=g,y.numLightProbes=v,r.version=vi++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=t.matrixWorldInverse;for(let t=0,f=e.length;t<f;t++){let f=e[t];if(f.isDirectionalLight){let e=r.directional[n];e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),n++}else if(f.isSpotLight){let e=r.spot[c];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),c++}else if(f.isRectAreaLight){let e=r.rectArea[l];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),o.identity(),a.copy(f.matrixWorld),a.premultiply(d),o.extractRotation(a),e.halfWidth.set(f.width*.5,0,0),e.halfHeight.set(0,f.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),l++}else if(f.isPointLight){let e=r.point[s];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),s++}else if(f.isHemisphereLight){let e=r.hemi[u];e.direction.setFromMatrixPosition(f.matrixWorld),e.direction.transformDirection(d),u++}}}return{setup:s,setupView:c,state:r}}function xi(e){let t=new bi(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function Si(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new xi(e),t.set(n,[a])):r>=i.length?(a=new xi(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Ci=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,wi=`uniform sampler2D shadow_pass;
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
}`,Ti=[new I(1,0,0),new I(-1,0,0),new I(0,1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1)],Ei=[new I(0,-1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1),new I(0,-1,0),new I(0,-1,0)],Di=new je,Oi=new I,ki=new I;function Ai(e,t,n){let r=new lt,i=new U,a=new U,o=new F,c=new ct,l=new Se,u={},d=n.maxTextureSize,f={0:1,1:0,2:2},p=new g({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new U},radius:{value:4}},vertexShader:Ci,fragmentShader:wi}),m=p.clone();m.defines.HORIZONTAL_PASS=1;let h=new K;h.setAttribute(`position`,new He(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let v=new N(h,p),y=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let b=this.type;this.render=function(t,n,c){if(y.enabled===!1||y.autoUpdate===!1&&y.needsUpdate===!1||t.length===0)return;this.type===2&&(z(`WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead.`),this.type=1);let l=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.state;p.setBlending(0),p.buffers.depth.getReversed()===!0?p.buffers.color.setClear(0,0,0,0):p.buffers.color.setClear(1,1,1,1),p.buffers.depth.setTest(!0),p.setScissorTest(!1);let m=b!==this.type;m&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let l=0,u=t.length;l<u;l++){let u=t[l],f=u.shadow;if(f===void 0){z(`WebGLShadowMap:`,u,`has no shadow.`);continue}if(f.autoUpdate===!1&&f.needsUpdate===!1)continue;i.copy(f.mapSize);let h=f.getFrameExtents();i.multiply(h),a.copy(f.mapSize),(i.x>d||i.y>d)&&(i.x>d&&(a.x=Math.floor(d/h.x),i.x=a.x*h.x,f.mapSize.x=a.x),i.y>d&&(a.y=Math.floor(d/h.y),i.y=a.y*h.y,f.mapSize.y=a.y));let g=e.state.buffers.depth.getReversed();if(f.camera._reversedDepth=g,f.map===null||m===!0){if(f.map!==null&&(f.map.depthTexture!==null&&(f.map.depthTexture.dispose(),f.map.depthTexture=null),f.map.dispose()),this.type===3){if(u.isPointLight){z(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}f.map=new nt(i.x,i.y,{format:j,type:ue,minFilter:We,magFilter:We,generateMipmaps:!1}),f.map.texture.name=u.name+`.shadowMap`,f.map.depthTexture=new s(i.x,i.y,_),f.map.depthTexture.name=u.name+`.shadowMapDepth`,f.map.depthTexture.format=se,f.map.depthTexture.compareFunction=null,f.map.depthTexture.minFilter=V,f.map.depthTexture.magFilter=V}else u.isPointLight?(f.map=new sn(i.x),f.map.depthTexture=new ge(i.x,$e)):(f.map=new nt(i.x,i.y),f.map.depthTexture=new s(i.x,i.y,$e)),f.map.depthTexture.name=u.name+`.shadowMap`,f.map.depthTexture.format=se,this.type===1?(f.map.depthTexture.compareFunction=g?518:515,f.map.depthTexture.minFilter=We,f.map.depthTexture.magFilter=We):(f.map.depthTexture.compareFunction=null,f.map.depthTexture.minFilter=V,f.map.depthTexture.magFilter=V);f.camera.updateProjectionMatrix()}let v=f.map.isWebGLCubeRenderTarget?6:1;for(let t=0;t<v;t++){if(f.map.isWebGLCubeRenderTarget)e.setRenderTarget(f.map,t),e.clear();else{t===0&&(e.setRenderTarget(f.map),e.clear());let n=f.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),p.viewport(o)}if(u.isPointLight){let e=f.camera,n=f.matrix,r=u.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Oi.setFromMatrixPosition(u.matrixWorld),e.position.copy(Oi),ki.copy(e.position),ki.add(Ti[t]),e.up.copy(Ei[t]),e.lookAt(ki),e.updateMatrixWorld(),n.makeTranslation(-Oi.x,-Oi.y,-Oi.z),Di.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),f._frustum.setFromProjectionMatrix(Di,e.coordinateSystem,e.reversedDepth)}else f.updateMatrices(u);r=f.getFrustum(),C(n,c,f.camera,u,this.type)}f.isPointLightShadow!==!0&&this.type===3&&x(f,c),f.needsUpdate=!1}b=this.type,y.needsUpdate=!1,e.setRenderTarget(l,u,f)};function x(n,r){let a=t.update(v);p.defines.VSM_SAMPLES!==n.blurSamples&&(p.defines.VSM_SAMPLES=n.blurSamples,m.defines.VSM_SAMPLES=n.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),n.mapPass===null&&(n.mapPass=new nt(i.x,i.y,{format:j,type:ue})),p.uniforms.shadow_pass.value=n.map.depthTexture,p.uniforms.resolution.value=n.mapSize,p.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,p,v,null),m.uniforms.shadow_pass.value=n.mapPass.texture,m.uniforms.resolution.value=n.mapSize,m.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,m,v,null)}function S(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?l:c,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=u[e];r===void 0&&(r={},u[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,w)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?f[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function C(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||r.intersectsObject(n))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=S(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=S(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)C(c[e],i,a,o,s)}function w(e){e.target.removeEventListener(`dispose`,w);for(let t in u){let n=u[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function ji(e,t){function n(){let t=!1,n=new F,r=null,i=new F(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?M(e.DEPTH_TEST):pe(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=te[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?M(e.STENCIL_TEST):pe(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new P(0,0,0),T=0,E=!1,D=null,O=null,k=null,ee=null,A=null,ne=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),re=!1,ie=0,ae=e.getParameter(e.VERSION);ae.indexOf(`WebGL`)===-1?ae.indexOf(`OpenGL ES`)!==-1&&(ie=parseFloat(/^OpenGL ES (\d)/.exec(ae)[1]),re=ie>=2):(ie=parseFloat(/^WebGL (\d)/.exec(ae)[1]),re=ie>=1);let oe=null,se={},j=e.getParameter(e.SCISSOR_BOX),ce=e.getParameter(e.VIEWPORT),le=new F().fromArray(j),ue=new F().fromArray(ce);function de(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let fe={};fe[e.TEXTURE_2D]=de(e.TEXTURE_2D,e.TEXTURE_2D,1),fe[e.TEXTURE_CUBE_MAP]=de(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),fe[e.TEXTURE_2D_ARRAY]=de(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),fe[e.TEXTURE_3D]=de(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),M(e.DEPTH_TEST),o.setFunc(3),be(!1),xe(1),M(e.CULL_FACE),ve(0);function M(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function pe(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function me(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function he(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function ge(t){return h!==t&&(e.useProgram(t),h=t,!0)}let _e={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};_e[103]=e.MIN,_e[104]=e.MAX;let N={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function ve(t,n,r,i,a,o,s,c,l,u){if(t===0){g===!0&&(pe(e.BLEND),g=!1);return}if(g===!1&&(M(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:q(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:q(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:q(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:q(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}return}a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(_e[n],_e[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(N[r],N[i],N[o],N[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function ye(t,n){t.side===2?pe(e.CULL_FACE):M(e.CULL_FACE);let r=t.side===1;n&&(r=!r),be(r),t.blending===1&&t.transparent===!1?ve(0):ve(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),Ce(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?M(e.SAMPLE_ALPHA_TO_COVERAGE):pe(e.SAMPLE_ALPHA_TO_COVERAGE)}function be(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function xe(t){t===0?pe(e.CULL_FACE):(M(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function Se(t){t!==k&&(re&&e.lineWidth(t),k=t)}function Ce(t,n,r){t?(M(e.POLYGON_OFFSET_FILL),(ee!==n||A!==r)&&(ee=n,A=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):pe(e.POLYGON_OFFSET_FILL)}function we(t){t?M(e.SCISSOR_TEST):pe(e.SCISSOR_TEST)}function Te(t){t===void 0&&(t=e.TEXTURE0+ne-1),oe!==t&&(e.activeTexture(t),oe=t)}function Ee(t,n,r){r===void 0&&(r=oe===null?e.TEXTURE0+ne-1:oe);let i=se[r];i===void 0&&(i={type:void 0,texture:void 0},se[r]=i),(i.type!==t||i.texture!==n)&&(oe!==r&&(e.activeTexture(r),oe=r),e.bindTexture(t,n||fe[t]),i.type=t,i.texture=n)}function De(){let t=se[oe];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Oe(){try{e.compressedTexImage2D(...arguments)}catch(e){q(`WebGLState:`,e)}}function ke(){try{e.compressedTexImage3D(...arguments)}catch(e){q(`WebGLState:`,e)}}function Ae(){try{e.texSubImage2D(...arguments)}catch(e){q(`WebGLState:`,e)}}function je(){try{e.texSubImage3D(...arguments)}catch(e){q(`WebGLState:`,e)}}function Me(){try{e.compressedTexSubImage2D(...arguments)}catch(e){q(`WebGLState:`,e)}}function I(){try{e.compressedTexSubImage3D(...arguments)}catch(e){q(`WebGLState:`,e)}}function L(){try{e.texStorage2D(...arguments)}catch(e){q(`WebGLState:`,e)}}function Ne(){try{e.texStorage3D(...arguments)}catch(e){q(`WebGLState:`,e)}}function Pe(){try{e.texImage2D(...arguments)}catch(e){q(`WebGLState:`,e)}}function Fe(){try{e.texImage3D(...arguments)}catch(e){q(`WebGLState:`,e)}}function R(t){return d[t]===void 0?e.getParameter(t):d[t]}function z(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function Ie(t){le.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),le.copy(t))}function Le(t){ue.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),ue.copy(t))}function B(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function V(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Re(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},oe=null,se={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new P(0,0,0),T=0,E=!1,D=null,O=null,k=null,ee=null,A=null,le.set(0,0,e.canvas.width,e.canvas.height),ue.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:M,disable:pe,bindFramebuffer:me,drawBuffers:he,useProgram:ge,setBlending:ve,setMaterial:ye,setFlipSided:be,setCullFace:xe,setLineWidth:Se,setPolygonOffset:Ce,setScissorTest:we,activeTexture:Te,bindTexture:Ee,unbindTexture:De,compressedTexImage2D:Oe,compressedTexImage3D:ke,texImage2D:Pe,texImage3D:Fe,pixelStorei:z,getParameter:R,updateUBOMapping:B,uniformBlockBinding:V,texStorage2D:L,texStorage3D:Ne,texSubImage2D:Ae,texSubImage3D:je,compressedTexSubImage2D:Me,compressedTexSubImage3D:I,scissor:Ie,viewport:Le,reset:Re}}function Mi(e,t,n,i,a,s,c){let u=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,d=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),f=new U,p=new WeakMap,m=new Set,h,g=new WeakMap,_=!1;try{_=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function v(e,t){return _?new OffscreenCanvas(e,t):o(`canvas`)}function y(e,t,n){let r=1,i=L(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);h===void 0&&(h=v(n,a));let o=t?v(n,a):h;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),z(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&z(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function b(e){return e.generateMipmaps}function x(t){e.generateMipmap(t)}function S(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function C(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];z(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||z(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?De:W.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function T(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,z(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function E(e,t){return b(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function D(e){let t=e.target;t.removeEventListener(`dispose`,D),k(t),t.isVideoTexture&&p.delete(t),t.isHTMLTexture&&m.delete(t)}function O(e){let t=e.target;t.removeEventListener(`dispose`,O),te(t)}function k(e){let t=i.get(e);if(t.__webglInit===void 0)return;let n=e.source,r=g.get(n);if(r){let i=r[t.__cacheKey];i.usedTimes--,i.usedTimes===0&&ee(e),Object.keys(r).length===0&&g.delete(n)}i.remove(e)}function ee(t){let n=i.get(t);e.deleteTexture(n.__webglTexture);let r=t.source,a=g.get(r);delete a[n.__cacheKey],c.memory.textures--}function te(t){let n=i.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),i.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let r=t.textures;for(let t=0,n=r.length;t<n;t++){let n=i.get(r[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),c.memory.textures--),i.remove(r[t])}i.remove(t)}let ne=0;function re(){ne=0}function ie(){return ne}function ae(e){ne=e}function oe(){let e=ne;return e>=a.maxTextures&&z(`WebGLTextures: Trying to use `+e+` texture units while this GPU supports only `+a.maxTextures),ne+=1,e}function se(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function j(t,r){let a=i.get(t);if(t.isVideoTexture&&Me(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)z(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)z(`WebGLRenderer: Texture marked for update but image is incomplete`);else{N(a,t,r);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+r)}function le(t,r){let a=i.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){N(a,t,r);return}t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+r)}function ue(t,r){let a=i.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){N(a,t,r);return}n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+r)}function de(t,r){let a=i.get(t);if(t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version){ve(a,t,r);return}n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+r)}let fe={[w]:e.REPEAT,[Te]:e.CLAMP_TO_EDGE,[A]:e.MIRRORED_REPEAT},M={[V]:e.NEAREST,[Ie]:e.NEAREST_MIPMAP_NEAREST,[r]:e.NEAREST_MIPMAP_LINEAR,[We]:e.LINEAR,[H]:e.LINEAR_MIPMAP_NEAREST,[we]:e.LINEAR_MIPMAP_LINEAR},pe={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function me(n,r){if(r.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(r.magFilter===1006||r.magFilter===1007||r.magFilter===1005||r.magFilter===1008||r.minFilter===1006||r.minFilter===1007||r.minFilter===1005||r.minFilter===1008)&&z(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,fe[r.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,fe[r.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,fe[r.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,M[r.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,M[r.minFilter]),r.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,pe[r.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(r.magFilter===1003||r.minFilter!==1005&&r.minFilter!==1008||r.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(r.anisotropy>1||i.get(r).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(r.anisotropy,a.getMaxAnisotropy())),i.get(r).__currentAnisotropy=r.anisotropy}}}function he(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,D));let i=n.source,a=g.get(i);a===void 0&&(a={},g.set(i,a));let o=se(n);if(o!==t.__cacheKey){a[o]===void 0&&(a[o]={texture:e.createTexture(),usedTimes:0},c.memory.textures++,r=!0),a[o].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&ee(n)),t.__cacheKey=o,t.__webglTexture=a[o].texture}return r}function ge(e,t,n){return Math.floor(Math.floor(e/n)/t)}function _e(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=ge(n.start,r.width,4),c=ge(t.start,r.width,4);n.start<=i+1&&a===c&&ge(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function N(t,r,o){let c=e.TEXTURE_2D;(r.isDataArrayTexture||r.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),r.isData3DTexture&&(c=e.TEXTURE_3D);let u=he(t,r),d=r.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+o);let f=i.get(d);if(d.version!==f.__version||u===!0){if(n.activeTexture(e.TEXTURE0+o),!(typeof ImageBitmap<`u`&&r.image instanceof ImageBitmap)){let t=W.getPrimaries(W.workingColorSpace),i=r.colorSpace===``?null:W.getPrimaries(r.colorSpace),a=r.colorSpace===``||t===i?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,r.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,r.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,a)}n.pixelStorei(e.UNPACK_ALIGNMENT,r.unpackAlignment);let t=y(r.image,!1,a.maxTextureSize);t=I(r,t);let i=s.convert(r.format,r.colorSpace),p=s.convert(r.type),h=C(r.internalFormat,i,p,r.normalized,r.colorSpace,r.isVideoTexture);me(c,r);let g,_=r.mipmaps,v=r.isVideoTexture!==!0,S=f.__version===void 0||u===!0,w=d.dataReady,D=E(r,t);if(r.isDepthTexture)h=T(r.format===l,r.type),S&&(v?n.texStorage2D(e.TEXTURE_2D,1,h,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,h,t.width,t.height,0,i,p,null));else if(r.isDataTexture){if(_.length>0){v&&S&&n.texStorage2D(e.TEXTURE_2D,D,h,_[0].width,_[0].height);for(let t=0,r=_.length;t<r;t++)g=_[t],v?w&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,g.width,g.height,i,p,g.data):n.texImage2D(e.TEXTURE_2D,t,h,g.width,g.height,0,i,p,g.data);r.generateMipmaps=!1}else v?(S&&n.texStorage2D(e.TEXTURE_2D,D,h,t.width,t.height),w&&_e(r,t,i,p)):n.texImage2D(e.TEXTURE_2D,0,h,t.width,t.height,0,i,p,t.data)}else if(r.isCompressedTexture){if(r.isCompressedArrayTexture){v&&S&&n.texStorage3D(e.TEXTURE_2D_ARRAY,D,h,_[0].width,_[0].height,t.depth);for(let a=0,o=_.length;a<o;a++)if(g=_[a],r.format!==1023){if(i!==null){if(v){if(w){if(r.layerUpdates.size>0){let t=ce(g.width,g.height,r.format,r.type);for(let o of r.layerUpdates){let r=g.data.subarray(o*t/g.data.BYTES_PER_ELEMENT,(o+1)*t/g.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,a,0,0,o,g.width,g.height,1,i,r)}r.clearLayerUpdates()}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,a,0,0,0,g.width,g.height,t.depth,i,g.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,a,h,g.width,g.height,t.depth,0,g.data,0,0)}else z(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else v?w&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,a,0,0,0,g.width,g.height,t.depth,i,p,g.data):n.texImage3D(e.TEXTURE_2D_ARRAY,a,h,g.width,g.height,t.depth,0,i,p,g.data)}else{v&&S&&n.texStorage2D(e.TEXTURE_2D,D,h,_[0].width,_[0].height);for(let t=0,a=_.length;t<a;t++)g=_[t],r.format===1023?v?w&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,g.width,g.height,i,p,g.data):n.texImage2D(e.TEXTURE_2D,t,h,g.width,g.height,0,i,p,g.data):i===null?z(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):v?w&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,g.width,g.height,i,g.data):n.compressedTexImage2D(e.TEXTURE_2D,t,h,g.width,g.height,0,g.data)}}else if(r.isDataArrayTexture){if(v){if(S&&n.texStorage3D(e.TEXTURE_2D_ARRAY,D,h,t.width,t.height,t.depth),w){if(r.layerUpdates.size>0){let a=ce(t.width,t.height,r.format,r.type);for(let o of r.layerUpdates){let r=t.data.subarray(o*a/t.data.BYTES_PER_ELEMENT,(o+1)*a/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,o,t.width,t.height,1,i,p,r)}r.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,i,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,h,t.width,t.height,t.depth,0,i,p,t.data)}else if(r.isData3DTexture)v?(S&&n.texStorage3D(e.TEXTURE_3D,D,h,t.width,t.height,t.depth),w&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,i,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,h,t.width,t.height,t.depth,0,i,p,t.data);else if(r.isFramebufferTexture){if(S){if(v)n.texStorage2D(e.TEXTURE_2D,D,h,t.width,t.height);else{let r=t.width,a=t.height;for(let t=0;t<D;t++)n.texImage2D(e.TEXTURE_2D,t,h,r,a,0,i,p,null),r>>=1,a>>=1}}}else if(r.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),m.add(r),n.onpaint=e=>{let t=e.changedElements;for(let e of m)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(_.length>0){if(v&&S){let t=L(_[0]);n.texStorage2D(e.TEXTURE_2D,D,h,t.width,t.height)}for(let t=0,r=_.length;t<r;t++)g=_[t],v?w&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,i,p,g):n.texImage2D(e.TEXTURE_2D,t,h,i,p,g);r.generateMipmaps=!1}else if(v){if(S){let r=L(t);n.texStorage2D(e.TEXTURE_2D,D,h,r.width,r.height)}w&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,i,p,t)}else n.texImage2D(e.TEXTURE_2D,0,h,i,p,t);b(r)&&x(c),f.__version=d.version,r.onUpdate&&r.onUpdate(r)}t.__version=r.version}function ve(t,r,o){if(r.image.length!==6)return;let c=he(t,r),l=r.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+o);let u=i.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+o);let t=W.getPrimaries(W.workingColorSpace),i=r.colorSpace===``?null:W.getPrimaries(r.colorSpace),d=r.colorSpace===``||t===i?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,r.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,r.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,r.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=r.isCompressedTexture||r.image[0].isCompressedTexture,p=r.image[0]&&r.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=y(r.image[e],!0,a.maxCubemapSize):m[e]=p?r.image[e].image:r.image[e],m[e]=I(r,m[e]);let h=m[0],g=s.convert(r.format,r.colorSpace),_=s.convert(r.type),v=C(r.internalFormat,g,_,r.normalized,r.colorSpace),S=r.isVideoTexture!==!0,w=u.__version===void 0||c===!0,T=l.dataReady,D=E(r,h);me(e.TEXTURE_CUBE_MAP,r);let O;if(f){S&&w&&n.texStorage2D(e.TEXTURE_CUBE_MAP,D,v,h.width,h.height);for(let t=0;t<6;t++){O=m[t].mipmaps;for(let i=0;i<O.length;i++){let a=O[i];r.format===1023?S?T&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,i,0,0,a.width,a.height,g,_,a.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,i,v,a.width,a.height,0,g,_,a.data):g===null?z(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):S?T&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,i,0,0,a.width,a.height,g,a.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,i,v,a.width,a.height,0,a.data)}}}else{if(O=r.mipmaps,S&&w){O.length>0&&D++;let t=L(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,D,v,t.width,t.height)}for(let t=0;t<6;t++)if(p){S?T&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,g,_,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,m[t].width,m[t].height,0,g,_,m[t].data);for(let r=0;r<O.length;r++){let i=O[r].image[t].image;S?T&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,v,i.width,i.height,0,g,_,i.data)}}else{S?T&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,g,_,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,g,_,m[t]);for(let r=0;r<O.length;r++){let i=O[r];S?T&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,g,_,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,v,g,_,i.image[t])}}}b(r)&&x(e.TEXTURE_CUBE_MAP),u.__version=l.version,r.onUpdate&&r.onUpdate(r)}t.__version=r.version}function ye(t,r,a,o,c,l){let d=s.convert(a.format,a.colorSpace),f=s.convert(a.type),p=C(a.internalFormat,d,f,a.normalized,a.colorSpace),m=i.get(r),h=i.get(a);if(h.__renderTarget=r,!m.__hasExternalTextures){let t=Math.max(1,r.width>>l),i=Math.max(1,r.height>>l);c===e.TEXTURE_3D||c===e.TEXTURE_2D_ARRAY?n.texImage3D(c,l,p,t,i,r.depth,0,d,f,null):n.texImage2D(c,l,p,t,i,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),je(r)?u.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,o,c,h.__webglTexture,0,F(r)):(c===e.TEXTURE_2D||c>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&c<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,o,c,h.__webglTexture,l),n.bindFramebuffer(e.FRAMEBUFFER,null)}function be(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=T(n.stencilBuffer,a),s=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;je(n)?u.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,F(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,F(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,s,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let a=t[i],o=s.convert(a.format,a.colorSpace),c=s.convert(a.type),l=C(a.internalFormat,o,c,a.normalized,a.colorSpace);je(n)?u.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,F(n),l,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,F(n),l,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,l,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function xe(t,r,a){let o=r.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(r.depthTexture&&r.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let c=i.get(r.depthTexture);if(c.__renderTarget=r,(!c.__webglTexture||r.depthTexture.image.width!==r.width||r.depthTexture.image.height!==r.height)&&(r.depthTexture.image.width=r.width,r.depthTexture.image.height=r.height,r.depthTexture.needsUpdate=!0),o){if(c.__webglInit===void 0&&(c.__webglInit=!0,r.depthTexture.addEventListener(`dispose`,D)),c.__webglTexture===void 0){c.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),me(e.TEXTURE_CUBE_MAP,r.depthTexture);let t=s.convert(r.depthTexture.format),i=s.convert(r.depthTexture.type),a;r.depthTexture.format===1026?a=e.DEPTH_COMPONENT24:r.depthTexture.format===1027&&(a=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,a,r.width,r.height,0,t,i,null)}}else j(r.depthTexture,0);let l=c.__webglTexture,d=F(r),f=o?e.TEXTURE_CUBE_MAP_POSITIVE_X+a:e.TEXTURE_2D,p=r.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(r.depthTexture.format===1026)je(r)?u.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,l,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,l,0);else if(r.depthTexture.format===1027)je(r)?u.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,l,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,l,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function Se(t){let r=i.get(t),a=t.isWebGLCubeRenderTarget===!0;if(r.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(r.__depthDisposeCallback&&r.__depthDisposeCallback(),e){let t=()=>{delete r.__boundDepthTexture,delete r.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),r.__depthDisposeCallback=t}r.__boundDepthTexture=e}if(t.depthTexture&&!r.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)xe(r.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?xe(r.__webglFramebuffer[0],t,0):xe(r.__webglFramebuffer,t,0)}}else if(a){r.__webglDepthbuffer=[];for(let i=0;i<6;i++)if(n.bindFramebuffer(e.FRAMEBUFFER,r.__webglFramebuffer[i]),r.__webglDepthbuffer[i]===void 0)r.__webglDepthbuffer[i]=e.createRenderbuffer(),be(r.__webglDepthbuffer[i],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=r.__webglDepthbuffer[i];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let i=t.texture.mipmaps;if(i&&i.length>0?n.bindFramebuffer(e.FRAMEBUFFER,r.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,r.__webglFramebuffer),r.__webglDepthbuffer===void 0)r.__webglDepthbuffer=e.createRenderbuffer(),be(r.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,i=r.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,i),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,i)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function Ce(t,n,r){let a=i.get(t);n!==void 0&&ye(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),r!==void 0&&Se(t)}function Ee(t){let r=t.texture,a=i.get(t),o=i.get(r);t.addEventListener(`dispose`,O);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(o.__webglTexture===void 0&&(o.__webglTexture=e.createTexture()),o.__version=r.version,c.memory.textures++),u){a.__webglFramebuffer=[];for(let t=0;t<6;t++)if(r.mipmaps&&r.mipmaps.length>0){a.__webglFramebuffer[t]=[];for(let n=0;n<r.mipmaps.length;n++)a.__webglFramebuffer[t][n]=e.createFramebuffer()}else a.__webglFramebuffer[t]=e.createFramebuffer()}else{if(r.mipmaps&&r.mipmaps.length>0){a.__webglFramebuffer=[];for(let t=0;t<r.mipmaps.length;t++)a.__webglFramebuffer[t]=e.createFramebuffer()}else a.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=i.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),c.memory.textures++)}if(t.samples>0&&je(t)===!1){a.__webglMultisampledFramebuffer=e.createFramebuffer(),a.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,a.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];a.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,a.__webglColorRenderbuffer[n]);let i=s.convert(r.format,r.colorSpace),o=s.convert(r.type),c=C(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=F(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,a.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(a.__webglDepthRenderbuffer=e.createRenderbuffer(),be(a.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,o.__webglTexture),me(e.TEXTURE_CUBE_MAP,r);for(let n=0;n<6;n++)if(r.mipmaps&&r.mipmaps.length>0)for(let i=0;i<r.mipmaps.length;i++)ye(a.__webglFramebuffer[n][i],t,r,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,i);else ye(a.__webglFramebuffer[n],t,r,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);b(r)&&x(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let r=0,o=l.length;r<o;r++){let o=l[r],s=i.get(o),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,s.__webglTexture),me(c,o),ye(a.__webglFramebuffer,t,o,e.COLOR_ATTACHMENT0+r,c,0),b(o)&&x(c)}n.unbindTexture()}else{let i=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(i=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(i,o.__webglTexture),me(i,r),r.mipmaps&&r.mipmaps.length>0)for(let n=0;n<r.mipmaps.length;n++)ye(a.__webglFramebuffer[n],t,r,e.COLOR_ATTACHMENT0,i,n);else ye(a.__webglFramebuffer,t,r,e.COLOR_ATTACHMENT0,i,0);b(r)&&x(i),n.unbindTexture()}t.depthBuffer&&Se(t)}function Oe(e){let t=e.textures;for(let r=0,a=t.length;r<a;r++){let a=t[r];if(b(a)){let t=S(e),r=i.get(a).__webglTexture;n.bindTexture(t,r),x(t),n.unbindTexture()}}}let P=[],ke=[];function Ae(t){if(t.samples>0){if(je(t)===!1){let r=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,c=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,l=i.get(t),u=r.length>1;if(u)for(let t=0;t<r.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,l.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,l.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,l.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,l.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,l.__webglFramebuffer);for(let n=0;n<r.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),u){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,l.__webglColorRenderbuffer[n]);let t=i.get(r[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),d===!0&&(P.length=0,ke.length=0,P.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.resolveDepthBuffer===!1&&(P.push(c),ke.push(c),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,ke)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,P))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),u)for(let t=0;t<r.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,l.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,l.__webglColorRenderbuffer[t]);let a=i.get(r[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,l.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,l.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.resolveDepthBuffer===!1&&d){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function F(e){return Math.min(a.maxSamples,e.samples)}function je(e){let n=i.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function Me(e){let t=c.render.frame;p.get(e)!==t&&(p.set(e,t),e.update())}function I(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(W.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&z(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):q(`WebGLTextures: Unsupported texture color space:`,n)),t}function L(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(f.width=e.naturalWidth||e.width,f.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(f.width=e.displayWidth,f.height=e.displayHeight):(f.width=e.width,f.height=e.height),f}this.allocateTextureUnit=oe,this.resetTextureUnits=re,this.getTextureUnits=ie,this.setTextureUnits=ae,this.setTexture2D=j,this.setTexture2DArray=le,this.setTexture3D=ue,this.setTextureCube=de,this.rebindTextures=Ce,this.setupRenderTarget=Ee,this.updateRenderTargetMipmap=Oe,this.updateMultisampleRenderTarget=Ae,this.setupDepthRenderbuffer=Se,this.setupFrameBufferTexture=ye,this.useMultisampledRTT=je,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function Ni(e,t){function n(n,r=``){let i,a=W.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Pi=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Fi=`
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

}`,Ii=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new D(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new g({vertexShader:Pi,fragmentShader:Fi,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new N(new S(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Li=class extends C{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,c=1,u=null,d=null,f=null,p=null,h=null,g=null,_=typeof XRWebGLBinding<`u`,v=new Ii,y={},b=t.getContextAttributes(),x=null,S=null,C=[],w=[],T=new U,E=null,O=new m;O.viewport=new F;let k=new m;k.viewport=new F;let ee=[O,k],A=new Je,te=null,ne=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=C[e];return t===void 0&&(t=new xe,C[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=C[e];return t===void 0&&(t=new xe,C[e]=t),t.getGripSpace()},this.getHand=function(e){let t=C[e];return t===void 0&&(t=new xe,C[e]=t),t.getHandSpace()};function re(e){let t=w.indexOf(e.inputSource);if(t===-1)return;let n=C[t];n!==void 0&&(n.update(e.inputSource,e.frame,u||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ie(){r.removeEventListener(`select`,re),r.removeEventListener(`selectstart`,re),r.removeEventListener(`selectend`,re),r.removeEventListener(`squeeze`,re),r.removeEventListener(`squeezestart`,re),r.removeEventListener(`squeezeend`,re),r.removeEventListener(`end`,ie),r.removeEventListener(`inputsourceschange`,ae);for(let e=0;e<C.length;e++){let t=w[e];t!==null&&(w[e]=null,C[e].disconnect(t))}te=null,ne=null,v.reset();for(let e in y)delete y[e];e.setRenderTarget(x),h=null,p=null,f=null,r=null,S=null,pe.stop(),n.isPresenting=!1,e.setPixelRatio(E),e.setSize(T.width,T.height,!1),n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&z(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&z(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return u||a},this.setReferenceSpace=function(e){u=e},this.getBaseLayer=function(){return p===null?h:p},this.getBinding=function(){return f===null&&_&&(f=new XRWebGLBinding(r,t)),f},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(d){if(r=d,r!==null){if(x=e.getRenderTarget(),r.addEventListener(`select`,re),r.addEventListener(`selectstart`,re),r.addEventListener(`selectend`,re),r.addEventListener(`squeeze`,re),r.addEventListener(`squeezestart`,re),r.addEventListener(`squeezeend`,re),r.addEventListener(`end`,ie),r.addEventListener(`inputsourceschange`,ae),b.xrCompatible!==!0&&await t.makeXRCompatible(),E=e.getPixelRatio(),e.getSize(T),_&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;b.depth&&(o=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=b.stencil?l:se,a=b.stencil?Ce:$e);let c={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};f=this.getBinding(),p=f.createProjectionLayer(c),r.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),S=new nt(p.textureWidth,p.textureHeight,{format:qe,type:Ue,depthTexture:new s(p.textureWidth,p.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}else{let n={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:i};h=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:h}),e.setPixelRatio(1),e.setSize(h.framebufferWidth,h.framebufferHeight,!1),S=new nt(h.framebufferWidth,h.framebufferHeight,{format:qe,type:Ue,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(c),u=null,a=await r.requestReferenceSpace(o),pe.setContext(r),pe.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function ae(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=w.indexOf(n);r>=0&&(w[r]=null,C[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=w.indexOf(n);if(r===-1){for(let e=0;e<C.length;e++)if(e>=w.length){w.push(n),r=e;break}else if(w[e]===null){w[e]=n,r=e;break}if(r===-1)break}let i=C[r];i&&i.connect(n)}}let oe=new I,j=new I;function ce(e,t,n){oe.setFromMatrixPosition(t.matrixWorld),j.setFromMatrixPosition(n.matrixWorld);let r=oe.distanceTo(j),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function le(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;v.texture!==null&&(v.depthNear>0&&(t=v.depthNear),v.depthFar>0&&(n=v.depthFar)),A.near=k.near=O.near=t,A.far=k.far=O.far=n,(te!==A.near||ne!==A.far)&&(r.updateRenderState({depthNear:A.near,depthFar:A.far}),te=A.near,ne=A.far),A.layers.mask=e.layers.mask|6,O.layers.mask=A.layers.mask&-5,k.layers.mask=A.layers.mask&-3;let i=e.parent,a=A.cameras;le(A,i);for(let e=0;e<a.length;e++)le(a[e],i);a.length===2?ce(A,O,k):A.projectionMatrix.copy(O.projectionMatrix),ue(e,A,i)};function ue(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=de*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return A},this.getFoveation=function(){if(p!==null||h!==null)return c},this.setFoveation=function(e){c=e,p!==null&&(p.fixedFoveation=e),h!==null&&h.fixedFoveation!==void 0&&(h.fixedFoveation=e)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(A)},this.getCameraTexture=function(e){return y[e]};let fe=null;function M(t,i){if(d=i.getViewerPose(u||a),g=i,d!==null){let t=d.views;h!==null&&(e.setRenderTargetFramebuffer(S,h.framebuffer),e.setRenderTarget(S));let i=!1;t.length!==A.cameras.length&&(A.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(h!==null)a=h.getViewport(r);else{let t=f.getViewSubImage(p,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(S,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(S))}let o=ee[n];o===void 0&&(o=new m,o.layers.enable(n),o.viewport=new F,ee[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(A.matrix.copy(o.matrix),A.matrix.decompose(A.position,A.quaternion,A.scale)),i===!0&&A.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&_){f=n.getBinding();let e=f.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&v.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&_){e.state.unbindTexture(),f=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=y[n];e||(e=new D,y[n]=e);let t=f.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<C.length;e++){let t=w[e],n=C[e];t!==null&&n!==void 0&&n.update(t,i,u||a)}fe&&fe(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),g=null}let pe=new kt;pe.setAnimationLoop(M),this.setAnimationLoop=function(e){fe=e},this.dispose=function(){}}},Ri=new je,zi=new L;zi.set(-1,0,0,0,1,0,0,0,1);function Bi(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,d(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),f(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),p(e,t),t.isMeshPhysicalMaterial&&m(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),h(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),g(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Ri.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(zi),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function f(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function p(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function m(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function h(e,t){t.matcap&&(e.matcap.value=t.matcap)}function g(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Vi(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return q(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?z(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):z(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var Hi=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Ui=null;function Wi(){return Ui===null&&(Ui=new ae(Hi,16,16,j,ue),Ui.name=`DFG_LUT`,Ui.minFilter=We,Ui.magFilter=We,Ui.wrapS=Te,Ui.wrapT=Te,Ui.generateMipmaps=!1,Ui.needsUpdate=!0),Ui}var Gi=class{constructor(e={}){let{canvas:r=oe(),context:i=null,depth:a=!0,stencil:o=!1,alpha:s=!1,antialias:c=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:d=!1,powerPreference:f=`default`,failIfMajorPerformanceCaveat:p=!1,reversedDepthBuffer:m=!1,outputBufferType:h=Ue}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<`u`&&i instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);g=i.getContextAttributes().alpha}else g=s;let _=h,v=new Set([y,u,t]),b=new Set([Ue,$e,Ge,Ce,Ee,ke]),x=new Uint32Array(4),S=new Int32Array(4),C=new I,w=null,T=null,E=[],D=[],O=null;this.domElement=r,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let k=this,A=!1,te=null,ne=null,re=null,ie=null;this._outputColorSpace=ut;let ae=0,se=0,j=null,ce=-1,le=null,de=new F,fe=new F,M=null,pe=new P(0),me=0,he=r.width,ge=r.height,N=1,ve=null,ye=null,be=new F(0,0,he,ge),xe=new F(0,0,he,ge),Se=!1,Te=new lt,De=!1,Oe=!1,Ae=new je,Me=new I,L=new F,Ne={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Pe=!1;function Fe(){return j===null?N:1}let R=i;function Ie(e,t){return r.getContext(e,t)}try{let e={alpha:!0,depth:a,stencil:o,antialias:c,premultipliedAlpha:l,preserveDrawingBuffer:d,powerPreference:f,failIfMajorPerformanceCaveat:p};if(`setAttribute`in r&&r.setAttribute(`data-engine`,`three.js r185`),r.addEventListener(`webglcontextlost`,ot,!1),r.addEventListener(`webglcontextrestored`,st,!1),r.addEventListener(`webglcontextcreationerror`,ct,!1),R===null){let t=`webgl2`;if(R=Ie(t,e),R===null)throw Ie(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}}catch(e){throw q(`WebGLRenderer: `+e.message),e}let Le,B,V,Re,H,U,ze,Be,Ve,He,We,G,Ke,qe,Je,Ye,K,Xe,Ze,Qe,et,tt,rt;function it(){Le=new ln(R),Le.init(),et=new Ni(R,Le),B=new Rt(R,Le,e,et),V=new ji(R,Le),B.reversedDepthBuffer&&m&&V.buffers.depth.setReversed(!0),ne=R.createFramebuffer(),re=R.createFramebuffer(),ie=R.createFramebuffer(),Re=new fn(R),H=new di,U=new Mi(R,Le,V,H,B,et,Re),ze=new cn(k),Be=new At(R),tt=new It(R,Be),Ve=new un(R,Be,Re,tt),He=new mn(R,Ve,Be,tt,Re),Xe=new pn(R,B,U),Je=new zt(H),We=new ui(k,ze,Le,B,tt,Je),G=new Bi(k,H),Ke=new hi,qe=new Si(Le),K=new Ft(k,ze,V,He,g,l),Ye=new Ai(k,He,B),rt=new Vi(R,Re,B,V),Ze=new Lt(R,Le,Re),Qe=new dn(R,Le,Re),Re.programs=We.programs,k.capabilities=B,k.extensions=Le,k.properties=H,k.renderLists=Ke,k.shadowMap=Ye,k.state=V,k.info=Re}it(),_!==1009&&(O=new gn(_,r.width,r.height,c,a,o));let at=new Li(k,R);this.xr=at,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){let e=Le.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Le.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return N},this.setPixelRatio=function(e){e!==void 0&&(N=e,this.setSize(he,ge,!1))},this.getSize=function(e){return e.set(he,ge)},this.setSize=function(e,t,n=!0){if(at.isPresenting){z(`WebGLRenderer: Can't change size while VR device is presenting.`);return}he=e,ge=t,r.width=Math.floor(e*N),r.height=Math.floor(t*N),n===!0&&(r.style.width=e+`px`,r.style.height=t+`px`),O!==null&&O.setSize(r.width,r.height),this.setViewport(0,0,e,t)},this.getDrawingBufferSize=function(e){return e.set(he*N,ge*N).floor()},this.setDrawingBufferSize=function(e,t,n){he=e,ge=t,N=n,r.width=Math.floor(e*n),r.height=Math.floor(t*n),this.setViewport(0,0,e,t)},this.setEffects=function(e){if(_===1009){q(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);return}if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){z(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}O.setEffects(e||[])},this.getCurrentViewport=function(e){return e.copy(de)},this.getViewport=function(e){return e.copy(be)},this.setViewport=function(e,t,n,r){e.isVector4?be.set(e.x,e.y,e.z,e.w):be.set(e,t,n,r),V.viewport(de.copy(be).multiplyScalar(N).round())},this.getScissor=function(e){return e.copy(xe)},this.setScissor=function(e,t,n,r){e.isVector4?xe.set(e.x,e.y,e.z,e.w):xe.set(e,t,n,r),V.scissor(fe.copy(xe).multiplyScalar(N).round())},this.getScissorTest=function(){return Se},this.setScissorTest=function(e){V.setScissorTest(Se=e)},this.setOpaqueSort=function(e){ve=e},this.setTransparentSort=function(e){ye=e},this.getClearColor=function(e){return e.copy(K.getClearColor())},this.setClearColor=function(){K.setClearColor(...arguments)},this.getClearAlpha=function(){return K.getClearAlpha()},this.setClearAlpha=function(){K.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(j!==null){let t=j.texture.format;e=v.has(t)}if(e){let e=j.texture.type,t=b.has(e),n=K.getClearColor(),r=K.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(x[0]=i,x[1]=a,x[2]=o,x[3]=r,R.clearBufferuiv(R.COLOR,0,x)):(S[0]=i,S[1]=a,S[2]=o,S[3]=r,R.clearBufferiv(R.COLOR,0,S))}else r|=R.COLOR_BUFFER_BIT}t&&(r|=R.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&R.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),te=e},this.dispose=function(){r.removeEventListener(`webglcontextlost`,ot,!1),r.removeEventListener(`webglcontextrestored`,st,!1),r.removeEventListener(`webglcontextcreationerror`,ct,!1),K.dispose(),Ke.dispose(),qe.dispose(),H.dispose(),ze.dispose(),He.dispose(),tt.dispose(),rt.dispose(),We.dispose(),at.dispose(),at.removeEventListener(`sessionstart`,gt),at.removeEventListener(`sessionend`,_t),vt.stop()};function ot(e){e.preventDefault(),ee(`WebGLRenderer: Context Lost.`),A=!0}function st(){ee(`WebGLRenderer: Context Restored.`),A=!1;let e=Re.autoReset,t=Ye.enabled,n=Ye.autoUpdate,r=Ye.needsUpdate,i=Ye.type;it(),Re.autoReset=e,Ye.enabled=t,Ye.autoUpdate=n,Ye.needsUpdate=r,Ye.type=i}function ct(e){q(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function dt(e){let t=e.target;t.removeEventListener(`dispose`,dt),J(t)}function J(e){ft(e),H.remove(e)}function ft(e){let t=H.get(e).programs;t!==void 0&&(t.forEach(function(e){We.releaseProgram(e)}),e.isShaderMaterial&&We.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=Ne);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=Y(e,t,n,r,i);V.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Ve.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;tt.setup(i,r,s,n,c);let h,g=Ze;if(c!==null&&(h=Be.get(c),g=Qe,g.setIndex(h)),i.isMesh)r.wireframe===!0?(V.setLineWidth(r.wireframeLinewidth*Fe()),g.setMode(R.LINES)):g.setMode(R.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),V.setLineWidth(e*Fe()),i.isLineSegments?g.setMode(R.LINES):i.isLineLoop?g.setMode(R.LINE_LOOP):g.setMode(R.LINE_STRIP)}else i.isPoints?g.setMode(R.POINTS):i.isSprite&&g.setMode(R.TRIANGLES);if(i.isBatchedMesh){if(Le.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Be.get(c).bytesPerElement:1,o=H.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(R,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function pt(e,t,n){e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,wt(e,t,n),e.side=0,e.needsUpdate=!0,wt(e,t,n),e.side=2):wt(e,t,n)}this.compile=function(e,t,n=null){n===null&&(n=e),T=qe.get(n),T.init(t),D.push(T),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(T.pushLight(e),e.castShadow&&T.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(T.pushLight(e),e.castShadow&&T.pushShadow(e))}),T.setupLights();let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let t=e.material;if(t){if(Array.isArray(t))for(let i=0;i<t.length;i++){let a=t[i];pt(a,n,e),r.add(a)}else pt(t,n,e),r.add(t)}}),T=D.pop(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){if(r.forEach(function(e){H.get(e).currentProgram.isReady()&&r.delete(e)}),r.size===0){t(e);return}setTimeout(n,10)}Le.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let mt=null;function ht(e){mt&&mt(e)}function gt(){vt.stop()}function _t(){vt.start()}let vt=new kt;vt.setAnimationLoop(ht),typeof self<`u`&&vt.setContext(self),this.setAnimationLoop=function(e){mt=e,at.setAnimationLoop(e),e===null?vt.stop():vt.start()},at.addEventListener(`sessionstart`,gt),at.addEventListener(`sessionend`,_t),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){q(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(A===!0)return;te!==null&&te.renderStart(e,t);let n=at.enabled===!0&&at.isPresenting===!0,r=O!==null&&(j===null||n)&&O.begin(k,j);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),at.enabled===!0&&at.isPresenting===!0&&(O===null||O.isCompositing()===!1)&&(at.cameraAutoUpdate===!0&&at.updateCamera(t),t=at.getCamera()),e.isScene===!0&&e.onBeforeRender(k,e,t,j),T=qe.get(e,D.length),T.init(t),T.state.textureUnits=U.getTextureUnits(),D.push(T),Ae.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),Te.setFromProjectionMatrix(Ae,_e,t.reversedDepth),Oe=this.localClippingEnabled,De=Je.init(this.clippingPlanes,Oe),w=Ke.get(e,E.length),w.init(),E.push(w),at.enabled===!0&&at.isPresenting===!0){let e=k.xr.getDepthSensingMesh();e!==null&&yt(e,t,-1/0,k.sortObjects)}yt(e,t,0,k.sortObjects),w.finish(),k.sortObjects===!0&&w.sort(ve,ye,t.reversedDepth),Pe=at.enabled===!1||at.isPresenting===!1||at.hasDepthSensing()===!1,Pe&&K.addToRenderList(w,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),De===!0&&Je.beginShadows();let i=T.state.shadowsArray;if(Ye.render(i,e,t),De===!0&&Je.endShadows(),(r&&O.hasRenderPass())===!1){let n=w.opaque,r=w.transmissive;if(T.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];xt(n,r,e,a)}Pe&&K.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];bt(w,e,n,n.viewport)}}else r.length>0&&xt(n,r,e,t),Pe&&K.render(e),bt(w,e,t)}j!==null&&se===0&&(U.updateMultisampleRenderTarget(j),U.updateRenderTargetMipmap(j)),r&&O.end(k),e.isScene===!0&&e.onAfterRender(k,e,t),tt.resetDefaultState(),ce=-1,le=null,D.pop(),D.length>0?(T=D[D.length-1],U.setTextureUnits(T.state.textureUnits),De===!0&&Je.setGlobalState(k.clippingPlanes,T.state.camera)):T=null,E.pop(),w=E.length>0?E[E.length-1]:null,te!==null&&te.renderEnd()};function yt(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)T.pushLightProbeGrid(e);else if(e.isLight)T.pushLight(e),e.castShadow&&T.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||Te.intersectsSprite(e)){r&&L.setFromMatrixPosition(e.matrixWorld).applyMatrix4(Ae);let t=He.update(e),i=e.material;i.visible&&w.push(e,t,i,n,L.z,null)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||Te.intersectsObject(e))){let t=He.update(e),i=e.material;if(r&&(e.boundingSphere===void 0?(t.boundingSphere===null&&t.computeBoundingSphere(),L.copy(t.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),L.copy(e.boundingSphere.center)),L.applyMatrix4(e.matrixWorld).applyMatrix4(Ae)),Array.isArray(i)){let r=t.groups;for(let a=0,o=r.length;a<o;a++){let o=r[a],s=i[o.materialIndex];s&&s.visible&&w.push(e,t,s,n,L.z,o)}}else i.visible&&w.push(e,t,i,n,L.z,null)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)yt(i[e],t,n,r)}function bt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;T.setupLightsView(n),De===!0&&Je.setGlobalState(k.clippingPlanes,n),r&&V.viewport(de.copy(r)),i.length>0&&St(i,t,n),a.length>0&&St(a,t,n),o.length>0&&St(o,t,n),V.buffers.depth.setTest(!0),V.buffers.depth.setMask(!0),V.buffers.color.setMask(!0),V.setPolygonOffset(!1)}function xt(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[r.id]===void 0){let e=Le.has(`EXT_color_buffer_half_float`)||Le.has(`EXT_color_buffer_float`);T.state.transmissionRenderTarget[r.id]=new nt(1,1,{generateMipmaps:!0,type:e?ue:Ue,minFilter:we,samples:Math.max(4,B.samples),stencilBuffer:o,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:W.workingColorSpace})}let i=T.state.transmissionRenderTarget[r.id],a=r.viewport||de;i.setSize(a.z*k.transmissionResolutionScale,a.w*k.transmissionResolutionScale);let s=k.getRenderTarget(),c=k.getActiveCubeFace(),l=k.getActiveMipmapLevel();k.setRenderTarget(i),k.getClearColor(pe),me=k.getClearAlpha(),me<1&&k.setClearColor(16777215,.5),k.clear(),Pe&&K.render(n);let u=k.toneMapping;k.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),T.setupLightsView(r),De===!0&&Je.setGlobalState(k.clippingPlanes,r),St(e,n,r),U.updateMultisampleRenderTarget(i),U.updateRenderTargetMipmap(i),Le.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,Ct(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(U.updateMultisampleRenderTarget(i),U.updateRenderTargetMipmap(i))}k.setRenderTarget(s,c,l),k.setClearColor(pe,me),d!==void 0&&(r.viewport=d),k.toneMapping=u}function St(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&Ct(o,t,n,s,l,c)}}function Ct(e,t,n,r,i,a){e.onBeforeRender(k,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(k,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,k.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,k.renderBufferDirect(n,t,r,i,e,a),i.side=2):k.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(k,t,n,r,i,a)}function wt(e,t,n){t.isScene!==!0&&(t=Ne);let r=H.get(e),i=T.state.lights,a=T.state.shadowsArray,o=i.state.version,s=We.getParameters(e,i.state,a,t,n,T.state.lightProbeGridArray),c=We.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=ze.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,dt),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return Et(e,s),d}else s.uniforms=We.getUniforms(e),te!==null&&e.isNodeMaterial&&te.build(e,n,s),e.onBeforeCompile(s,k),d=We.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Je.uniform),Et(e,s),r.needsLights=X(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=T.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function Tt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Cr.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function Et(e,t){let n=H.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function Dt(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];C.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(C))return n}return null}function Y(e,t,n,r,i){t.isScene!==!0&&(t=Ne),U.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=j===null?k.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:W.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=ze.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(h=k.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=H.get(r),y=T.state.lights;if(De===!0&&(Oe===!0||e!==le)){let t=e===le&&r.id===ce;Je.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i.colorTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i.colorTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Je.numPlanes||v.numIntersection!==Je.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=T.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let x=v.currentProgram;b===!0&&(x=wt(r,t,i),te&&r.isNodeMaterial&&te.onUpdateProgram(r,x,v));let S=!1,C=!1,w=!1,E=x.getUniforms(),D=v.uniforms;if(V.useProgram(x.program)&&(S=!0,C=!0,w=!0),r.id!==ce&&(ce=r.id,C=!0),v.needsLights){let e=Dt(T.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,C=!0)}if(S||le!==e){V.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),E.setValue(R,`projectionMatrix`,e.projectionMatrix),E.setValue(R,`viewMatrix`,e.matrixWorldInverse);let t=E.map.cameraPosition;t!==void 0&&t.setValue(R,Me.setFromMatrixPosition(e.matrixWorld)),B.logarithmicDepthBuffer&&E.setValue(R,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&E.setValue(R,`isOrthographic`,e.isOrthographicCamera===!0),le!==e&&(le=e,C=!0,w=!0)}if(v.needsLights&&(y.state.directionalShadowMap.length>0&&E.setValue(R,`directionalShadowMap`,y.state.directionalShadowMap,U),y.state.spotShadowMap.length>0&&E.setValue(R,`spotShadowMap`,y.state.spotShadowMap,U),y.state.pointShadowMap.length>0&&E.setValue(R,`pointShadowMap`,y.state.pointShadowMap,U)),i.isSkinnedMesh){E.setOptional(R,i,`bindMatrix`),E.setOptional(R,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),E.setValue(R,`boneTexture`,e.boneTexture,U))}i.isBatchedMesh&&(E.setOptional(R,i,`batchingTexture`),E.setValue(R,`batchingTexture`,i._matricesTexture,U),E.setOptional(R,i,`batchingIdTexture`),E.setValue(R,`batchingIdTexture`,i._indirectTexture,U),E.setOptional(R,i,`batchingColorTexture`),i._colorsTexture!==null&&E.setValue(R,`batchingColorTexture`,i._colorsTexture,U));let O=n.morphAttributes;if((O.position!==void 0||O.normal!==void 0||O.color!==void 0)&&Xe.update(i,n,x),(C||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,E.setValue(R,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(D.envMapIntensity.value=t.environmentIntensity),D.dfgLUT!==void 0&&(D.dfgLUT.value=Wi()),C){if(E.setValue(R,`toneMappingExposure`,k.toneMappingExposure),v.needsLights&&Ot(D,w),a&&r.fog===!0&&G.refreshFogUniforms(D,a),G.refreshMaterialUniforms(D,r,N,ge,T.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;D.probesSH.value=e.texture,D.probesMin.value.copy(e.boundingBox.min),D.probesMax.value.copy(e.boundingBox.max),D.probesResolution.value.copy(e.resolution)}Cr.upload(R,Tt(v),D,U)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Cr.upload(R,Tt(v),D,U),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&E.setValue(R,`center`,i.center),E.setValue(R,`modelViewMatrix`,i.modelViewMatrix),E.setValue(R,`normalMatrix`,i.normalMatrix),E.setValue(R,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];rt.update(n,x),rt.bind(n,x)}}return x}function Ot(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function X(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return ae},this.getActiveMipmapLevel=function(){return se},this.getRenderTarget=function(){return j},this.setRenderTargetTextures=function(e,t,n){let r=H.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),H.get(e.texture).__webglTexture=t,H.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=H.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){j=e,ae=t,se=n;let r=null,i=!1,a=!1;if(e){let o=H.get(e);if(o.__useDefaultFramebuffer!==void 0){V.bindFramebuffer(R.FRAMEBUFFER,o.__webglFramebuffer),de.copy(e.viewport),fe.copy(e.scissor),M=e.scissorTest,V.viewport(de),V.scissor(fe),V.setScissorTest(M),ce=-1;return}if(o.__webglFramebuffer===void 0)U.setupRenderTarget(e);else if(o.__hasExternalTextures)U.rebindTextures(e,H.get(e.texture).__webglTexture,H.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&H.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);U.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=H.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&U.useMultisampledRTT(e)===!1?H.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,de.copy(e.viewport),fe.copy(e.scissor),M=e.scissorTest}else de.copy(be).multiplyScalar(N).floor(),fe.copy(xe).multiplyScalar(N).floor(),M=Se;if(n!==0&&(r=ne),V.bindFramebuffer(R.FRAMEBUFFER,r)&&V.drawBuffers(e,r),V.viewport(de),V.scissor(fe),V.setScissorTest(M),i){let r=H.get(e.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=H.get(e.textures[t]);R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=H.get(e.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,t.__webglTexture,n)}ce=-1},this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){q(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=H.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){V.bindFramebuffer(R.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;if(e.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+s),!B.textureFormatReadable(c)){q(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(!B.textureTypeReadable(l)){q(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&R.readPixels(t,n,r,i,et.convert(c),et.convert(l),a)}finally{let e=j===null?null:H.get(j).__webglFramebuffer;V.bindFramebuffer(R.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,r,i,a,o,s,c=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let l=H.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&s!==void 0&&(l=l[s]),l){if(t>=0&&t<=e.width-i&&r>=0&&r<=e.height-a){V.bindFramebuffer(R.FRAMEBUFFER,l);let s=e.textures[c],u=s.format,d=s.type;if(e.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+c),!B.textureFormatReadable(u))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(!B.textureTypeReadable(d))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,f),R.bufferData(R.PIXEL_PACK_BUFFER,o.byteLength,R.STREAM_READ),R.readPixels(t,r,i,a,et.convert(u),et.convert(d),0);let p=j===null?null:H.get(j).__webglFramebuffer;V.bindFramebuffer(R.FRAMEBUFFER,p);let m=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await n(R,m,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,f),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,o),R.deleteBuffer(f),R.deleteSync(m),o}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;U.setTexture2D(e,0),R.copyTexSubImage2D(R.TEXTURE_2D,n,0,0,o,s,i,a),V.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=et.convert(t.format),_=et.convert(t.type),v;t.isData3DTexture?(U.setTexture3D(t,0),v=R.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(U.setTexture2DArray(t,0),v=R.TEXTURE_2D_ARRAY):(U.setTexture2D(t,0),v=R.TEXTURE_2D),V.activeTexture(R.TEXTURE0),V.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,t.flipY),V.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),V.pixelStorei(R.UNPACK_ALIGNMENT,t.unpackAlignment);let y=V.getParameter(R.UNPACK_ROW_LENGTH),b=V.getParameter(R.UNPACK_IMAGE_HEIGHT),x=V.getParameter(R.UNPACK_SKIP_PIXELS),S=V.getParameter(R.UNPACK_SKIP_ROWS),C=V.getParameter(R.UNPACK_SKIP_IMAGES);V.pixelStorei(R.UNPACK_ROW_LENGTH,h.width),V.pixelStorei(R.UNPACK_IMAGE_HEIGHT,h.height),V.pixelStorei(R.UNPACK_SKIP_PIXELS,l),V.pixelStorei(R.UNPACK_SKIP_ROWS,u),V.pixelStorei(R.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=H.get(e),r=H.get(t),h=H.get(n.__renderTarget),g=H.get(r.__renderTarget);V.bindFramebuffer(R.READ_FRAMEBUFFER,h.__webglFramebuffer),V.bindFramebuffer(R.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,H.get(e).__webglTexture,i,d+n),R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,H.get(t).__webglTexture,a,m+n)),R.blitFramebuffer(l,u,o,s,f,p,o,s,R.DEPTH_BUFFER_BIT,R.NEAREST);V.bindFramebuffer(R.READ_FRAMEBUFFER,null),V.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||H.has(e)){let n=H.get(e),r=H.get(t);V.bindFramebuffer(R.READ_FRAMEBUFFER,re),V.bindFramebuffer(R.DRAW_FRAMEBUFFER,ie);for(let e=0;e<c;e++)w?R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):R.framebufferTexture2D(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,n.__webglTexture,i),T?R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):R.framebufferTexture2D(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,r.__webglTexture,a),i===0?T?R.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):R.copyTexSubImage2D(v,a,f,p,l,u,o,s):R.blitFramebuffer(l,u,o,s,f,p,o,s,R.COLOR_BUFFER_BIT,R.NEAREST);V.bindFramebuffer(R.READ_FRAMEBUFFER,null),V.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?R.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?R.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):R.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):R.texSubImage2D(R.TEXTURE_2D,a,f,p,o,s,g,_,h);V.pixelStorei(R.UNPACK_ROW_LENGTH,y),V.pixelStorei(R.UNPACK_IMAGE_HEIGHT,b),V.pixelStorei(R.UNPACK_SKIP_PIXELS,x),V.pixelStorei(R.UNPACK_SKIP_ROWS,S),V.pixelStorei(R.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&R.generateMipmap(v),V.unbindTexture()},this.initRenderTarget=function(e){H.get(e).__webglFramebuffer===void 0&&U.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?U.setTextureCube(e,0):e.isData3DTexture?U.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?U.setTexture2DArray(e,0):U.setTexture2D(e,0),V.unbindTexture()},this.resetState=function(){ae=0,se=0,j=null,V.reset(),tt.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return _e}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=W._getDrawingBufferColorSpace(e),t.unpackColorSpace=W._getUnpackColorSpace()}},Ki=1.15,qi=7.2,Ji=-1.18,Yi=1.02,Xi=.18,Zi=.2,Qi=14,$i=class{camera;input;yaw=.08;pitch=.26;distance=4.5;target=new I;desiredPosition=new I;direction=new I;probe=new I;orbitDelta=new U;caveBounds={minimum:0,maximum:0};constructor(e,t){this.camera=e,this.input=t}snapTo(e){this.calculateDesired(e),this.resolveOcclusion(),this.camera.position.copy(this.desiredPosition),this.camera.lookAt(this.target)}setOrbit(e,t,n,r){this.yaw=e,this.pitch=G.clamp(t,Ji,Yi),this.distance=G.clamp(n,Ki,qi),this.snapTo(r)}setPose(e,t){this.target.copy(t),this.camera.position.copy(e),this.camera.lookAt(t)}update(e,t){this.input.consumeOrbitDelta(this.orbitDelta),this.yaw-=this.orbitDelta.x*.0042,this.pitch=G.clamp(this.pitch+this.orbitDelta.y*.0035,Ji,Yi),this.distance=G.clamp(this.distance+this.input.consumeZoomDelta()*.42,Ki,qi),this.calculateDesired(t);let n=this.resolveOcclusion();if(n&&this.camera.position.distanceToSquared(this.target)>this.desiredPosition.distanceToSquared(this.target))this.camera.position.copy(this.desiredPosition);else{let t=n?24:11;this.camera.position.lerp(this.desiredPosition,1-Math.exp(-t*e))}this.camera.lookAt(this.target)}getActualDistance(){return this.camera.position.distanceTo(this.target)}getPitch(){return this.pitch}calculateDesired(e){this.target.copy(e),this.target.y+=1.25;let t=Math.cos(this.pitch)*this.distance;this.desiredPosition.set(this.target.x+Math.sin(this.yaw)*t,this.target.y+Math.sin(this.pitch)*this.distance,this.target.z+Math.cos(this.yaw)*t)}resolveOcclusion(){this.direction.copy(this.desiredPosition).sub(this.target);let e=this.direction.length();return e<1e-6?!1:(this.direction.multiplyScalar(1/e),this.resolveCaveIntersection())}resolveCaveIntersection(){if(this.direction.copy(this.desiredPosition).sub(this.target),this.direction.length()<1e-6)return!1;let e=0;for(let t=1;t<=Qi;t+=1){let n=t/Qi;if(this.probe.copy(this.target).addScaledVector(this.direction,n),this.isSafePosition(this.probe)){e=n;continue}let r=n;for(let t=0;t<7;t+=1){let t=(e+r)*.5;this.probe.copy(this.target).addScaledVector(this.direction,t),this.isSafePosition(this.probe)?e=t:r=t}let i=e-Math.min(.008,e*.25);return this.desiredPosition.copy(this.target).addScaledVector(this.direction,Math.max(0,i)),!0}return!1}isSafePosition(e){return e.y>=ft(e.x,e.z)+Xi&&Et(e.x,e.y,e.z,Zi,this.caveBounds)}},ea=1;function ta(e){return Number.isFinite(e)?Math.max(ea,Math.floor(e)):ea}function na(e,t){return ta(e)/ta(t)}function ra(e,t,n){let r=na(t,n);return Math.abs(e.aspect-r)<1e-6?r:(e.aspect=r,e.updateProjectionMatrix(),r)}var ia=class{apply;scale=1;lastEvaluation=0;stableSince=0;lastResize=-1/0;constructor(e){this.apply=e}observe(e,t){if(e<4||e-this.lastEvaluation<2.5||t.averageFps<=0)return;this.lastEvaluation=e;let n=Math.min(138,Math.max(55,t.refreshEstimate*.9)),r=t.averageFps<n*.82,i=t.averageFps>n*.98;if(r){if(this.stableSince=0,this.scale<=.66||e-this.lastResize<12)return;let r=t.averageFps/Math.max(1,n),i=this.scale*Math.sqrt(r/.96),a=r<.72?.2:.1;this.scale=Math.max(.66,Math.round(Math.max(this.scale-a,i)*100)/100),this.lastResize=e,this.emit();return}if(!i){this.stableSince=e;return}this.stableSince===0&&(this.stableSince=e),e-this.stableSince>18&&e-this.lastResize>=12&&this.scale<1&&(this.scale=Math.min(1,this.scale+.05),this.stableSince=e,this.lastResize=e,this.emit())}getState(){return{scale:this.scale,label:this.labelForScale()}}emit(){this.apply(this.getState())}labelForScale(){return this.scale>=.91?`ADAPTIVE ULTRA`:this.scale>=.76?`ADAPTIVE HIGH`:`ADAPTIVE PERFORMANCE`}},aa=`cameraIndependentShadowCaster`;function oa(e,t=`webgpu`){if(e.userData[aa]===!0||(e.userData[aa]=!0,e.castShadow=!0,e.layers.set(1),t===`webgpu`))return;e.layers.enable(0);let n=e.onBeforeRender,r=e.onAfterRender,i=[],a=Array.isArray(e.material)?e.material:[e.material];for(let e of a)i.some(t=>t.material===e)||i.push({material:e,colorWrite:e.colorWrite,depthWrite:e.depthWrite});let o=!1;e.onBeforeRender=(...t)=>{if(n.apply(e,t),o=!t[2].layers.isEnabled(1),o)for(let e of i)e.colorWrite=e.material.colorWrite,e.depthWrite=e.material.depthWrite,e.material.colorWrite=!1,e.material.depthWrite=!1},e.onAfterRender=(...t)=>{if(o)for(let e of i)e.material.colorWrite=e.colorWrite,e.material.depthWrite=e.depthWrite;o=!1,r.apply(e,t)}}var sa=class{lastTimestamp=null;accumulator=0;elapsed=0;advance(e,t){this.lastTimestamp===null&&(this.lastTimestamp=e);let n=Math.min(Ot,Math.max(0,(e-this.lastTimestamp)/1e3));this.lastTimestamp=e,this.accumulator+=n,this.elapsed+=n;let r=0;for(;this.accumulator>=.008333333333333333&&r<6;)t(pt),this.accumulator-=pt,r+=1;return r===6&&(this.accumulator=Math.min(this.accumulator,pt)),{delta:n,elapsed:this.elapsed,interpolation:this.accumulator/pt,physicsSteps:r}}reset(e=null){this.lastTimestamp=e,this.accumulator=0}};function Q(e,t){if(e==null)throw Error(t);return e}async function ca(e,t={clipboard:navigator.clipboard,document}){if(t.clipboard?.writeText){await t.clipboard.writeText(e);return}let n=t.document.createElement(`textarea`);n.value=e,n.readOnly=!0,n.style.position=`fixed`,n.style.opacity=`0`,n.style.pointerEvents=`none`,t.document.body.append(n),n.select(),n.setSelectionRange(0,n.value.length);let r=t.document.execCommand(`copy`);if(n.remove(),!r)throw Error(`Clipboard copy was rejected.`)}function $(e,t=2){return Number.isFinite(e)?e.toFixed(t):`unavailable`}function la(e){let{performance:t,renderer:n,canvas:r,quality:i,workload:a,capeSolver:o,capeWorkers:s,scene:c,page:l,runtime:u}=e,d=l.multipleScreens===!0?`multiple screens reported`:l.multipleScreens===!1?`single screen reported`:`screen count unavailable`,f=o?o.implementation===`webgpu-compute`?[`Cape solver: packed WebGPU compute PBD at ${Math.round(1/pt)} Hz | ${J.columns*J.rows*c.simulatedCapes} active GPU-resident particles across ${c.simulatedCapes} of 11 preallocated capes | ${J.solverIterations} graph-colored projection passes across packed lanes | 25 dispatches in 1 compute submission/step`,`Cape timing: no animation-loop particle readback or GPU fence; main-thread physics above measures command preparation/submission, not GPU completion`]:[s?.active?`Cape solver: CPU PBD Gauss-Seidel at ${Math.round(1/pt)} Hz | ${J.solverIterations} projection passes | player on main thread, bots across ${s.workers} workers | sampled 1/${o.sampleIntervalSteps} player steps (${o.sampledActiveSteps} samples)`:`Cape solver: sequential CPU PBD Gauss-Seidel at ${Math.round(1/pt)} Hz | ${J.solverIterations} projection passes | sampled 1/${o.sampleIntervalSteps} active steps (${o.sampledActiveSteps} samples)`,`Cape step sampled average: ${$(o.averageStepMilliseconds)} ms | prediction ${$(o.phases.prediction)} | constraints ${$(o.phases.constraints)} | self ${$(o.phases.selfCollision)} | fold ${$(o.phases.foldGuard)} | body ${$(o.phases.bodyCollision)} | world ${$(o.phases.worldCollision)} | cave ${$(o.phases.caveCollision)} | reconcile ${$(o.phases.reconciliation)}`,...s?.active?[`Cape workers: ${s.workers} active | ${s.busyWorkers} busy | ${s.queuedSteps} queued fixed steps | ${s.failure??`healthy`}`]:[]]:[];return[`Cape Physics performance report`,`Captured: ${e.capturedAt}`,`Window: last ${$(t.windowElapsedMilliseconds/1e3,2)} s of 15 s | ${t.sampleCount} frames`,`Rendered FPS: ${$(t.averageFps)} average | ${$(t.onePercentLow)} 1% low | ${$(t.refreshEstimate,0)} callback/s estimate`,`Frame interval: ${$(t.averageFrameTime)} ms average | p50 ${$(t.medianFrameTime)} ms | p95 ${$(t.p95FrameTime)} ms | p99 ${$(t.p99FrameTime)} ms | worst ${$(t.longestFrameTime)} ms`,`Long frames: ${t.longFrameCount} at or above 50 ms`,`Renderer: ${n.backend} | ${n.vendor} | ${n.device}`,`Renderer selection: requested ${n.preference.toUpperCase()} | active ${n.actual.toUpperCase()} | ${n.fallback?`fallback active`:`no fallback`}`,`Canvas: ${r.drawingBufferWidth}x${r.drawingBufferHeight} drawing buffer / ${r.cssWidth}x${r.cssHeight} CSS px`,`Quality: ${i.label} | ${$(i.scale,3)} resolution scale | ${i.targetResizes} render-target resizes`,`Main thread: ${$(a.averageMainThreadMilliseconds)} ms average | p95 ${$(a.p95MainThreadMilliseconds)} ms | physics ${$(a.averagePhysicsMilliseconds)} ms | scene ${$(a.averageSceneMilliseconds)} ms | render submission ${$(a.averageRenderMilliseconds)} ms | ${$(a.averagePhysicsSteps)} physics steps/callback average, ${a.maximumPhysicsSteps} maximum`,...f,`Scene: ${$(c.simulationSeconds,2)} s simulated | ${c.botCount} performance bots | ${c.simulatedCapes} simulated capes | ${n.drawCalls} draw calls | ${n.triangles} triangles | ${n.programs} programs | ${c.worldColliders} cape colliders/cape | ${c.activeRipples} active ripples | player cape ${c.capeSleeping?`sleeping`:`active`}`,`Page state: ${l.visibility} | ${l.focused?`focused`:`not focused`} | DPR ${$(l.devicePixelRatio)} | ${d}`,`Timing caveat: display FPS is refresh/vsync capped and therefore cannot compare backend headroom; main-thread render submission is not GPU completion`,`Page: ${l.url}`,`Runtime: ${u.platform}`,`User agent (raw): ${u.userAgent}`].join(`
`)}var ua=15e3,da=8192,fa=Object.freeze({averageMainThreadMilliseconds:0,p95MainThreadMilliseconds:0,averagePhysicsMilliseconds:0,averageSceneMilliseconds:0,averageRenderMilliseconds:0,averagePhysicsSteps:0,maximumPhysicsSteps:0,sampleCount:0}),pa=class{getReportDetails;panel;fpsLabel;fpsCaption;averageLabel;frameTimeLabel;frameP95Label;mainWorkLabel;mainP95Label;lowLabel;triangleLabel;averageHistoryPath;lowHistoryPath;historyGraphic;copyLabel;sampleTimestamps=new Float64Array(da);sampleDurations=new Float64Array(da);workloadTimestamps=new Float64Array(da);physicsDurations=new Float64Array(da);sceneDurations=new Float64Array(da);renderDurations=new Float64Array(da);physicsStepCounts=new Uint8Array(da);durationScratch=[];workloadScratch=[];averageFpsHistory=[];onePercentLowHistory=[];sampleStart=0;sampleCount=0;workloadStart=0;workloadCount=0;lastTimestamp=null;lastPaint=0;copyFeedbackTimer=null;snapshot={averageFps:0,onePercentLow:0,averageFrameTime:0,medianFrameTime:0,p95FrameTime:0,p99FrameTime:0,refreshEstimate:60,longFrameCount:0,longestFrameTime:0,sampleCount:0,windowElapsedMilliseconds:0};workloadSnapshot=fa;constructor(e,t=document){this.getReportDetails=e,this.panel=Q(t.querySelector(`[data-performance-panel]`),`Performance panel is missing.`),this.fpsLabel=Q(t.querySelector(`[data-fps]`),`FPS label is missing.`),this.fpsCaption=Q(t.querySelector(`[data-fps-caption]`),`FPS caption is missing.`),this.averageLabel=Q(t.querySelector(`[data-fps-average]`),`Average-FPS label is missing.`),this.frameTimeLabel=Q(t.querySelector(`[data-frame-time]`),`Frame-time label is missing.`),this.frameP95Label=Q(t.querySelector(`[data-frame-p95]`),`Frame p95 label is missing.`),this.mainWorkLabel=Q(t.querySelector(`[data-main-work]`),`Main-work label is missing.`),this.mainP95Label=Q(t.querySelector(`[data-main-p95]`),`Main-work p95 label is missing.`),this.lowLabel=Q(t.querySelector(`[data-fps-low]`),`Low-FPS label is missing.`),this.triangleLabel=Q(t.querySelector(`[data-triangles]`),`Triangle label is missing.`),this.averageHistoryPath=Q(t.querySelector(`[data-fps-average-line]`),`Average-FPS history path is missing.`),this.lowHistoryPath=Q(t.querySelector(`[data-fps-low-line]`),`Low-FPS history path is missing.`),this.historyGraphic=Q(t.querySelector(`[data-fps-history]`),`FPS history graphic is missing.`),this.copyLabel=Q(t.querySelector(`[data-performance-copy]`),`Performance copy label is missing.`),this.panel.addEventListener(`click`,this.handleCopy)}recordFrame(e){if(this.lastTimestamp===null){this.lastTimestamp=e;return}let t=e-this.lastTimestamp;if(this.lastTimestamp=e,t<=0)return;let n=(this.sampleStart+this.sampleCount)%da;this.sampleTimestamps[n]=e,this.sampleDurations[n]=t,this.sampleCount<da?this.sampleCount+=1:this.sampleStart=(this.sampleStart+1)%da;let r=e-ua;for(;this.sampleCount>0&&this.sampleTimestamps[this.sampleStart]<r;)this.sampleStart=(this.sampleStart+1)%da,--this.sampleCount;e-this.lastPaint>=250&&(this.lastPaint=e,this.recalculate(),this.paint())}getSnapshot(){return this.snapshot}recordWorkload(e,t){let n=(this.workloadStart+this.workloadCount)%da;this.workloadTimestamps[n]=e,this.physicsDurations[n]=Math.max(0,t.physicsMilliseconds),this.sceneDurations[n]=Math.max(0,t.sceneMilliseconds),this.renderDurations[n]=Math.max(0,t.renderMilliseconds),this.physicsStepCounts[n]=Math.max(0,Math.min(255,Math.floor(t.physicsSteps))),this.workloadCount<da?this.workloadCount+=1:this.workloadStart=(this.workloadStart+1)%da,this.trimWorkload(e-ua)}getWorkloadSnapshot(){return this.workloadSnapshot}resume(e){this.lastTimestamp=e}reset=()=>{this.sampleStart=0,this.sampleCount=0,this.workloadStart=0,this.workloadCount=0,this.workloadSnapshot=fa,this.averageFpsHistory.length=0,this.onePercentLowHistory.length=0,this.lastTimestamp=null,this.averageHistoryPath.setAttribute(`d`,``),this.lowHistoryPath.setAttribute(`d`,``)};dispose(){this.panel.removeEventListener(`click`,this.handleCopy),this.copyFeedbackTimer!==null&&window.clearTimeout(this.copyFeedbackTimer)}recalculate(){this.durationScratch.length=this.sampleCount;let e=0,t=0,n=0;for(let r=0;r<this.sampleCount;r+=1){let i=(this.sampleStart+r)%da,a=this.sampleDurations[i],o=Math.min(a,250);this.durationScratch[r]=o,e+=o,a>=50&&(t+=1),n=Math.max(n,a)}this.durationScratch.sort((e,t)=>e-t);let r=this.durationScratch.length>0?e/this.durationScratch.length:0,i=r>0?1e3/r:0,a=this.sortedPercentile(.5),o=this.sortedPercentile(.95),s=this.sortedPercentile(.99),c=Math.max(1,Math.ceil(this.durationScratch.length*.01)),l=0;for(let e=Math.max(0,this.durationScratch.length-c);e<this.durationScratch.length;e+=1)l+=this.durationScratch[e]??0;let u=l/c,d=u>0?1e3/u:0,f=this.sortedPercentile(.1),p=f>0?1e3/f:60,m=[30,60,75,90,100,120,144,165,240].reduce((e,t)=>Math.abs(t-p)<Math.abs(e-p)?t:e,60),h=this.sampleStart,g=(this.sampleStart+this.sampleCount-1+da)%da,_=this.sampleCount>0?Math.min(ua,this.sampleTimestamps[g]-this.sampleTimestamps[h]+this.sampleDurations[h]):0;this.snapshot={averageFps:i,onePercentLow:d,averageFrameTime:r,medianFrameTime:a,p95FrameTime:o,p99FrameTime:s,refreshEstimate:m,longFrameCount:t,longestFrameTime:n,sampleCount:this.sampleCount,windowElapsedMilliseconds:_},this.recalculateWorkload(),this.averageFpsHistory.push(i),this.onePercentLowHistory.push(d),this.averageFpsHistory.length>78&&this.averageFpsHistory.shift(),this.onePercentLowHistory.length>78&&this.onePercentLowHistory.shift()}recalculateWorkload(){this.workloadScratch.length=this.workloadCount;let e=0,t=0,n=0,r=0,i=0;for(let a=0;a<this.workloadCount;a+=1){let o=(this.workloadStart+a)%da,s=this.physicsDurations[o]??0,c=this.sceneDurations[o]??0,l=this.renderDurations[o]??0,u=this.physicsStepCounts[o]??0;e+=s,t+=c,n+=l,r+=u,i=Math.max(i,u),this.workloadScratch[a]=s+c+l}this.workloadScratch.sort((e,t)=>e-t);let a=this.workloadCount,o=e+t+n,s=Math.min(Math.max(0,a-1),Math.floor(a*.95));this.workloadSnapshot={averageMainThreadMilliseconds:a>0?o/a:0,p95MainThreadMilliseconds:a>0?this.workloadScratch[s]??0:0,averagePhysicsMilliseconds:a>0?e/a:0,averageSceneMilliseconds:a>0?t/a:0,averageRenderMilliseconds:a>0?n/a:0,averagePhysicsSteps:a>0?r/a:0,maximumPhysicsSteps:i,sampleCount:a}}trimWorkload(e){for(;this.workloadCount>0&&this.workloadTimestamps[this.workloadStart]<e;)this.workloadStart=(this.workloadStart+1)%da,--this.workloadCount}sortedPercentile(e){if(this.durationScratch.length===0)return 0;let t=Math.min(this.durationScratch.length-1,Math.max(0,Math.floor(e*this.durationScratch.length)));return this.durationScratch[t]??0}paint(){let{averageFps:e,onePercentLow:t,averageFrameTime:n,p95FrameTime:r,refreshEstimate:i}=this.snapshot,{averageMainThreadMilliseconds:a,p95MainThreadMilliseconds:o,sampleCount:s}=this.workloadSnapshot,c=this.snapshot.sampleCount>=30&&e>=i*.97;this.fpsLabel.textContent=e>0?e.toFixed(2):`--`,this.averageLabel.textContent=e>0?e.toFixed(2):`--`,this.lowLabel.textContent=t>0?t.toFixed(2):`--`,this.fpsCaption.textContent=c?`DISPLAY FPS / VSYNC-CAPPED`:`DISPLAY FPS / LAST 15S`,this.frameTimeLabel.textContent=n>0?n.toFixed(2):`--`,this.frameP95Label.textContent=r>0?r.toFixed(2):`--`,this.mainWorkLabel.textContent=s>0?a.toFixed(2):`--`,this.mainP95Label.textContent=s>0?o.toFixed(2):`--`,this.triangleLabel.textContent=this.getReportDetails().renderer.triangles.toLocaleString(`en-US`),this.historyGraphic.setAttribute(`aria-label`,`Display cadence over the last ${(this.snapshot.windowElapsedMilliseconds/1e3).toFixed(1)} seconds: ${e.toFixed(2)} average FPS, ${t.toFixed(2)} one-percent low; main-thread work ${a.toFixed(2)} milliseconds average and ${o.toFixed(2)} milliseconds p95`),this.panel.classList.toggle(`has-frame-drop`,e>0&&e<Math.min(52,i*.78));let l=i*.7,u=i*1.02,d=e=>e.map((t,n)=>{let r=e.length<=1?0:n/(e.length-1)*154,i=(1-Math.max(0,Math.min(1,(t-l)/(u-l))))*30;return`${n===0?`M`:`L`}${r.toFixed(1)} ${i.toFixed(1)}`}).join(` `);this.averageHistoryPath.setAttribute(`d`,d(this.averageFpsHistory)),this.lowHistoryPath.setAttribute(`d`,d(this.onePercentLowHistory))}handleCopy=()=>{this.copyPerformanceReport()};async copyPerformanceReport(){try{await ca(la({capturedAt:new Date().toISOString(),performance:this.snapshot,...this.getReportDetails()})),this.panel.dataset.copyState=`copied`,this.copyLabel.textContent=`COPIED 15S REPORT`}catch(e){console.warn(`Unable to copy performance report.`,e),this.panel.dataset.copyState=`failed`,this.copyLabel.textContent=`COPY FAILED`}this.copyFeedbackTimer!==null&&window.clearTimeout(this.copyFeedbackTimer),this.copyFeedbackTimer=window.setTimeout(()=>{delete this.panel.dataset.copyState,this.copyLabel.textContent=`CLICK TO COPY 15S REPORT`,this.copyFeedbackTimer=null},2e3)}},ma={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`},ha=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},ga=new ne(-1,1,1,-1,0,1),_a=new class extends K{constructor(){super(),this.setAttribute(`position`,new p([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new p([0,2,0,0,2,0],2))}},va=class{constructor(e){this._mesh=new N(_a,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,ga)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},ya=class extends ha{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof g?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=ye.clone(e.uniforms),this.material=new g({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new va(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},ba=class extends ha{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},xa=class extends ha{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},Sa=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new U);this._width=n.width,this._height=n.height,t=new nt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:ue}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new ya(ma),this.copyPass.material.blending=0,this.timer=new re}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}ba!==void 0&&(r instanceof ba?n=!0:r instanceof xa&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new U);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},Ca={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`},wa=class extends ha{constructor(){super(),this.isOutputPass=!0,this.uniforms=ye.clone(Ca.uniforms),this.material=new c({name:Ca.name,uniforms:this.uniforms,vertexShader:Ca.vertexShader,fragmentShader:Ca.fragmentShader}),this._fsQuad=new va(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},W.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},Ta=class extends ha{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new P}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},Ea={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new P(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`},Da=class e extends ha{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new U(256,256):new U(e.x,e.y),this.clearColor=new P(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new nt(i,a,{type:ue}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new nt(i,a,{type:ue});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new nt(i,a,{type:ue});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),i=Math.round(i/2),a=Math.round(a/2)}let o=Ea;this.highPassUniforms=ye.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new g({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let s=[6,10,14,18,22];i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new U(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new I(1,1,1),new I(1,1,1),new I(1,1,1),new I(1,1,1),new I(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=ye.clone(ma.uniforms),this.blendMaterial=new g({uniforms:this.copyUniforms,vertexShader:ma.vertexShader,fragmentShader:ma.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new P,this._oldClearAlpha=1,this._basic=new rt,this._fsQuad=new va(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new U(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);return new g({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new U(.5,.5)},direction:{value:new U(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`

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

				}`})}_getCompositeMaterial(e){return new g({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

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

				}`})}};Da.BlurDirectionX=new U(1,0),Da.BlurDirectionY=new U(0,1);function Oa(e){return e>=.999?`direct-opaque`:`isolated-fade`}var ka=36e5,Aa=1.5;function ja(e,t,n,r){let i=Math.max(1,Math.floor(e)),a=Math.max(1,Math.floor(t)),o=i*a,s=Math.min(Math.max(n,.25),Aa),c=Math.sqrt(ka/o),l=Math.max(.25,Math.min(s,c)*Math.min(Math.max(r,.5),1)),u=Math.max(1,Math.floor(i*l)),d=Math.max(1,Math.floor(a*l));return{width:i,height:a,pixelRatio:l,drawingBufferWidth:u,drawingBufferHeight:d,renderPixels:u*d}}var Ma=1e-6;function Na(e){let t=new s(1,1,$e);return t.name=e,t.format=se,t.minFilter=V,t.magFilter=V,t.generateMipmaps=!1,t}var Pa=Object.freeze({calls:0,triangles:0,points:0,lines:0});function Fa(e){return{calls:e.drawCalls??e.calls??0,triangles:e.triangles,points:e.points,lines:e.lines}}var Ia=`
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`,La=`
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
    float depthVisible = step(layerDepth, worldDepth + ${Ma.toExponential()});
    float layerAlpha = layer.a * uOpacity * depthVisible;
    vec3 color = world.rgb * (1.0 - layerAlpha)
      + layer.rgb * uOpacity * depthVisible;
    gl_FragColor = vec4(color, world.a);
  }
`,Ra=class extends ha{scene;camera;layer;layerTarget;material;quad;savedClearColor=new P;constructor(e,t,n){super(),this.scene=e,this.camera=t,this.layer=n,this.layerTarget=new nt(1,1,{type:ue,depthBuffer:!0,depthTexture:Na(`Character fade depth`),stencilBuffer:!1}),this.layerTarget.texture.name=`Character fade layer`,this.layerTarget.samples=2,this.material=new g({name:`Depth-resolved character composite`,uniforms:{tWorld:{value:null},tLayer:{value:this.layerTarget.texture},tWorldDepth:{value:null},tLayerDepth:{value:this.layerTarget.depthTexture},uOpacity:{value:1}},vertexShader:Ia,fragmentShader:La,depthTest:!1,depthWrite:!1}),this.quad=new va(this.material)}setOpacity(e){this.material.uniforms.uOpacity.value=G.clamp(e,0,1)}getOpacity(){return this.material.uniforms.uOpacity.value}getDepthDiagnostics(){return{layerDepthTexture:this.layerTarget.depthTexture?.isDepthTexture===!0,worldDepthConnected:this.material.uniforms.tWorldDepth.value instanceof s}}setSize(e,t){this.layerTarget.setSize(e,t)}render(e,t,n){let r=this.camera.layers.mask,i=this.scene.background,a=e.getClearAlpha(),o=e.shadowMap.autoUpdate,s=e.getRenderTarget();e.getClearColor(this.savedClearColor);try{this.camera.layers.set(this.layer),this.scene.background=null,e.shadowMap.autoUpdate=!1,e.setRenderTarget(this.layerTarget),e.setClearColor(0,0),e.clear(!0,!0,!1),e.render(this.scene,this.camera)}finally{this.camera.layers.mask=r,this.scene.background=i,e.shadowMap.autoUpdate=o,e.setClearColor(this.savedClearColor,a),e.setRenderTarget(s)}if(!n.depthTexture)throw Error(`World render target has no depth texture for character occlusion.`);this.material.uniforms.tWorld.value=n.texture,this.material.uniforms.tWorldDepth.value=n.depthTexture,e.setRenderTarget(this.renderToScreen?null:t),this.clear&&e.clear(),this.quad.render(e)}dispose(){this.layerTarget.dispose(),this.material.dispose(),this.quad.dispose()}},za=class{renderer;composer;bloom;characterComposite;camera;resolutionScale=1;sizing=null;targetResizeCount=0;lastFrameRenderStats=Pa;constructor(e,t,n){this.camera=n,this.renderer=new Gi({canvas:e,antialias:!1,alpha:!1,powerPreference:`high-performance`,stencil:!1,depth:!0}),this.renderer.outputColorSpace=ut,this.renderer.toneMapping=6,this.renderer.toneMappingExposure=1.24,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=2,this.renderer.info.autoReset=!1,n.layers.set(0);let r=new nt(1,1,{type:ue,depthBuffer:!0,depthTexture:Na(`World scene depth`),stencilBuffer:!1});r.samples=2,this.composer=new Sa(this.renderer,r),this.composer.addPass(new Ta(t,n)),this.characterComposite=new Ra(t,n,1),this.composer.addPass(this.characterComposite),this.bloom=new Da(new U(1,1),.42,.48,.88),this.composer.addPass(this.bloom),this.composer.addPass(new wa),this.resize()}async init(){}render(e){this.renderer.info.reset();let t=Oa(this.characterComposite.getOpacity());this.camera.layers.set(0),this.characterComposite.enabled=t===`isolated-fade`,t===`direct-opaque`&&this.camera.layers.enable(1),this.composer.render(e),this.lastFrameRenderStats=Fa(this.renderer.info.render)}renderManual(e=0){this.render(e)}getLastFrameRenderStats(){return this.lastFrameRenderStats}resize(){let e=ja(window.innerWidth,window.innerHeight,window.devicePixelRatio,this.resolutionScale),t=!this.sizing||e.width!==this.sizing.width||e.height!==this.sizing.height,n=!this.sizing||Math.abs(e.pixelRatio-this.sizing.pixelRatio)>1e-4;!t&&!n||(n&&(this.renderer.setPixelRatio(e.pixelRatio),this.composer.setPixelRatio(e.pixelRatio),this.targetResizeCount+=1),t&&(this.renderer.setSize(e.width,e.height,!1),this.composer.setSize(e.width,e.height),this.targetResizeCount+=1),this.sizing=e)}setResolutionScale(e){Math.abs(e-this.resolutionScale)<.001||(this.resolutionScale=e,this.resize())}setCharacterOpacity(e){this.characterComposite.setOpacity(e)}getCharacterOpacity(){return this.characterComposite.getOpacity()}getDepthCompositeDiagnostics(){return{...this.characterComposite.getDepthDiagnostics(),renderMode:Oa(this.characterComposite.getOpacity())}}readScreenCenterPixel(){let e=this.renderer.getContext(),t=this.renderer.getDrawingBufferSize(new U),n=new Uint8Array(4);return e.finish(),e.readPixels(Math.floor(t.x*.5),Math.floor(t.y*.5),1,1,e.RGBA,e.UNSIGNED_BYTE,n),[n[0],n[1],n[2],n[3]]}getSizingDiagnostics(){return{...this.sizing??ja(1,1,1,this.resolutionScale),targetResizeCount:this.targetResizeCount}}getActualBackend(){return`webgl`}onDeviceLost(e){return()=>void 0}getBackendDiagnostics(){let e=this.renderer.getContext(),t=e.getExtension(`WEBGL_debug_renderer_info`);return{preference:`webgl`,actual:`webgl`,backend:String(e.getParameter(e.VERSION)),vendor:String(e.getParameter(t?.UNMASKED_VENDOR_WEBGL??e.VENDOR)),device:String(e.getParameter(t?.UNMASKED_RENDERER_WEBGL??e.RENDERER)),fallback:!1}}getProgramCount(){return this.renderer.info.programs?.length??0}async synchronizeForLocalProfile(){this.renderer.getContext().finish()}async resolveGpuFrameTimeForLocalProfile(){return null}async compile(e,t){let n=t.layers.mask;try{t.layers.enable(1),await this.renderer.compileAsync(e,t)}finally{t.layers.mask=n}}dispose(){this.composer.dispose(),this.characterComposite.dispose(),this.renderer.dispose()}},Ba=`modulepreload`,Va=function(e){return`/cape-physics/`+e},Ha={},Ua=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?import.meta.resolve(e):new URL(e,import.meta.url).href}r=o(t.map(t=>{if(t=Va(t,n),t=s(t),t in Ha)return;Ha[t]=!0;let r=t.endsWith(`.css`);for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}let i=document.createElement(`link`);if(i.rel=r?`stylesheet`:Ba,r||(i.as=`script`),i.crossOrigin=``,i.href=t,a&&i.setAttribute(`nonce`,a),document.head.appendChild(i),r)return new Promise((e,n)=>{i.addEventListener(`load`,e),i.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},Wa=class{canvas;scene;camera;trackTimestamps;implementation;preference;constructor(e,t,n,r,i=!1){this.canvas=e,this.scene=t,this.camera=n,this.trackTimestamps=i,this.preference=r,this.implementation=r===`webgl`?new za(e,t,n):null}get active(){if(!this.implementation)throw Error(`Render pipeline was used before initialization.`);return this.implementation}get renderer(){return this.active.renderer}usesNodeRenderer(){return!(this.active instanceof za)}getMaxAnisotropy(){return this.active instanceof za?this.active.renderer.capabilities.getMaxAnisotropy():this.active.renderer.getMaxAnisotropy()}async init(){if(!this.implementation){let{WebGpuRenderPipeline:e}=await Ua(async()=>{let{WebGpuRenderPipeline:e}=await import(`./WebGpuRenderPipeline-BmtqFrgH.js`);return{WebGpuRenderPipeline:e}},__vite__mapDeps([0,1,2,3]));this.implementation=new e(this.canvas,this.scene,this.camera,this.preference,this.trackTimestamps)}await this.active.init()}render(e=0){this.active.render(e)}renderManual(e=0){this.active.renderManual(e)}getLastFrameRenderStats(){return this.active.getLastFrameRenderStats()}resize(){this.active.resize()}setResolutionScale(e){this.active.setResolutionScale(e)}setCharacterOpacity(e){this.active.setCharacterOpacity(e)}getCharacterOpacity(){return this.active.getCharacterOpacity()}getDepthCompositeDiagnostics(){return this.active.getDepthCompositeDiagnostics()}async readScreenCenterPixel(){return await this.active.readScreenCenterPixel()}getSizingDiagnostics(){return this.active.getSizingDiagnostics()}getActualBackend(){return this.active.getActualBackend()}getWebGlRenderer(){return this.active instanceof za?this.active.renderer:null}getNodeRenderer(){return this.usesNodeRenderer()?this.active.renderer:null}getWebGpuRenderer(){return this.active.getActualBackend()===`webgpu`?this.getNodeRenderer():null}onDeviceLost(e){return this.active.onDeviceLost(e)}getBackendDiagnostics(){return this.active.getBackendDiagnostics()}getProgramCount(){return this.active.getProgramCount()}async synchronizeForLocalProfile(){await this.active.synchronizeForLocalProfile()}async resolveGpuFrameTimeForLocalProfile(){return await this.active.resolveGpuFrameTimeForLocalProfile()}async compile(e,t){await this.active.compile(e,t)}dispose(){this.implementation?.dispose(),this.implementation=null}},Ga=`renderer`;function Ka(e){return e===`webgpu`||e===`webgl`?e:null}function qa(e){let t=Ka(new URLSearchParams(e.search).get(Ga));return t===null?`webgl`:t}function Ja(e){let t=new URL(e);return t.searchParams.delete(Ga),t.href}function Ya(e,t){let n=new URL(e);return n.searchParams.set(Ga,t),n.href}function Xa(e=navigator){return`gpu`in e&&e.gpu!==void 0}var Za=Object.freeze({fabric:[148,10,19],trim:[158,73,28],sheenColor:7276307,attachmentColor:9701907,materialName:`Woven crimson cape`}),Qa=Object.freeze({fabric:[12,132,148],trim:[82,218,222],sheenColor:482665,attachmentColor:820372,materialName:`Woven cyan bot cape`});function $a(e,t,n=``){let r=new ae(e,t,t,qe);return r.wrapS=w,r.wrapT=w,r.colorSpace=n,r.needsUpdate=!0,r}function eo(e,t,n,r,i){e[t]=Math.round(G.clamp(n,0,255)),e[t+1]=Math.round(G.clamp(r,0,255)),e[t+2]=Math.round(G.clamp(i,0,255)),e[t+3]=255}function to(e,t,n){let r=G.clamp((n-e)/(t-e),0,1);return r*r*(3-2*r)}function no(e=512){let t=new Uint8Array(e*e*4),n=new Uint8Array(e*e*4),r=new Uint8Array(e*e*4),i=new Uint8Array(e*e*4),a=new Float32Array(e*e);for(let t=0;t<e;t+=1)for(let n=0;n<e;n+=1){let r=n/e*8,i=t/e*8,o=vt(r,i,8,20903),s=vt(r*3,i*3,24,50238),c=Math.sin((r+o*.9)*3.1+Math.sin(i*1.8))*.5+.5;a[t*e+n]=G.clamp(o*.68+s*.2+c*.12,0,1)}for(let o=0;o<e;o+=1)for(let s=0;s<e;s+=1){let c=(o*e+s)*4,l=(t,n)=>{let r=(t+e)%e,i=(n+e)%e;return a[i*e+r]??0},u=l(s,o),d=Math.max(0,vt(s/e*24,o/e*24,24,6602)-.62),f=u**1.7;eo(t,c,25+f*29+d*48,31+f*31+d*24,31+f*27+d*12),eo(n,c,u*255,u*255,u*255);let p=l(s-1,o)-l(s+1,o),m=l(s,o-1)-l(s,o+1),h=new I(p*3.7,m*3.7,1).normalize();eo(r,c,(h.x*.5+.5)*255,(h.y*.5+.5)*255,h.z*255);let g=205+(1-u)*34+d*24;eo(i,c,g,g,g)}return{color:$a(t,e,ut),height:$a(n,e),normal:$a(r,e),roughness:$a(i,e)}}function ro(e=256,t=Za){let n=new Uint8Array(e*e*4),r=new Uint8Array(e*e*4),i=new Uint8Array(e*e*4);for(let a=0;a<e;a+=1)for(let o=0;o<e;o+=1){let s=(a*e+o)*4,c=Math.max(0,Math.sin(o/e*Math.PI*64))**8,l=Math.max(0,Math.sin(a/e*Math.PI*72))**8,u=vt(o/e*8,a/e*8,8,41244),d=c*.52+l*.48,f=.76+u*.24+d*.13,p=.92+vt(o/e*3,a/e*3,3,29172)*.08,m=(o+.5)/e,h=(a+.5)/e,g=1-to(.018,.052,Math.min(m,1-m)),_=1-to(.018,.052,h),v=Math.max(g,_)*.72,y=t.fabric[0]*f*p,b=t.fabric[1]*f,x=t.fabric[2]*f;eo(n,s,G.lerp(y,t.trim[0],v),G.lerp(b,t.trim[1],v),G.lerp(x,t.trim[2],v)),eo(r,s,128+(c-l)*18,128+(l-c)*18,249);let S=188+u*35-d*18;eo(i,s,S,S,S)}return{color:$a(n,e,ut),normal:$a(r,e),roughness:$a(i,e)}}function io(e,t){for(let n of Object.values(e))n.anisotropy=t}var ao=class{canvas;onFirstInteraction;pressed=new Set;orbitDelta=new U;movement=new U;virtualMovement=new U;touchMovement=new U;zoomDelta=0;activePointer=null;lastPointer=new U;interacted=!1;virtualMovementEnabled=!1;virtualRunning=!1;touchMovementEnabled=!1;touchRunning=!1;jumpQueued=!1;virtualJumpQueued=!1;touchJumpQueued=!1;constructor(e,t){this.canvas=e,this.onFirstInteraction=t,window.addEventListener(`keydown`,this.handleKeyDown),window.addEventListener(`keyup`,this.handleKeyUp),window.addEventListener(`blur`,this.handleBlur),e.addEventListener(`pointerdown`,this.handlePointerDown),e.addEventListener(`pointermove`,this.handlePointerMove),e.addEventListener(`pointerup`,this.handlePointerUp),e.addEventListener(`pointercancel`,this.handlePointerUp),e.addEventListener(`wheel`,this.handleWheel,{passive:!1}),e.addEventListener(`contextmenu`,this.handleContextMenu)}getMovement(){if(this.virtualMovementEnabled)return this.virtualMovement;let e=Number(this.pressed.has(`KeyD`))-Number(this.pressed.has(`KeyA`)),t=Number(this.pressed.has(`KeyW`))-Number(this.pressed.has(`KeyS`));return this.movement.set(e,t),this.touchMovementEnabled&&this.movement.add(this.touchMovement),this.movement.clampLength(0,1)}setVirtualMovement(e,t){this.virtualMovement.set(e,t).clampLength(0,1),this.virtualMovementEnabled=!0}isRunning(){return this.virtualMovementEnabled?this.virtualRunning:this.touchRunning||this.pressed.has(`ShiftLeft`)||this.pressed.has(`ShiftRight`)}setVirtualRunning(e){this.virtualRunning=e}consumeJump(){let e=this.jumpQueued||this.virtualJumpQueued||this.touchJumpQueued;return this.jumpQueued=!1,this.virtualJumpQueued=!1,this.touchJumpQueued=!1,e}queueVirtualJump(){this.virtualJumpQueued=!0}clearVirtualMovement(){this.virtualMovement.set(0,0),this.virtualMovementEnabled=!1,this.virtualRunning=!1,this.virtualJumpQueued=!1}setTouchMovement(e,t){this.touchMovement.set(e,t).clampLength(0,1),this.touchMovementEnabled=!0,this.markInteracted()}clearTouchMovement(){this.touchMovement.set(0,0),this.touchMovementEnabled=!1}setTouchRunning(e){this.touchRunning=e,e&&this.markInteracted()}queueTouchJump(){this.touchJumpQueued=!0,this.markInteracted()}addTouchOrbitDelta(e,t){this.orbitDelta.x+=G.clamp(e,-180,180),this.orbitDelta.y+=G.clamp(t,-180,180),this.markInteracted()}addTouchZoomDelta(e){this.zoomDelta+=G.clamp(e,-2,2),e!==0&&this.markInteracted()}clearTouchInput(){this.clearTouchMovement(),this.touchRunning=!1,this.touchJumpQueued=!1}consumeOrbitDelta(e){e.copy(this.orbitDelta),this.orbitDelta.set(0,0)}consumeZoomDelta(){let e=this.zoomDelta;return this.zoomDelta=0,e}dispose(){window.removeEventListener(`keydown`,this.handleKeyDown),window.removeEventListener(`keyup`,this.handleKeyUp),window.removeEventListener(`blur`,this.handleBlur),this.canvas.removeEventListener(`pointerdown`,this.handlePointerDown),this.canvas.removeEventListener(`pointermove`,this.handlePointerMove),this.canvas.removeEventListener(`pointerup`,this.handlePointerUp),this.canvas.removeEventListener(`pointercancel`,this.handlePointerUp),this.canvas.removeEventListener(`wheel`,this.handleWheel),this.canvas.removeEventListener(`contextmenu`,this.handleContextMenu)}markInteracted(){this.interacted||(this.interacted=!0,this.onFirstInteraction?.())}handleKeyDown=e=>{let t=e.target;t instanceof HTMLElement&&t.closest(`input, button, select, textarea, [contenteditable="true"]`)||(e.code===`KeyW`||e.code===`KeyA`||e.code===`KeyS`||e.code===`KeyD`||e.code===`ShiftLeft`||e.code===`ShiftRight`||e.code===`Space`)&&(e.preventDefault(),this.pressed.add(e.code),e.code===`Space`&&!e.repeat&&(this.jumpQueued=!0),this.markInteracted())};handleKeyUp=e=>{this.pressed.delete(e.code)};handleBlur=()=>{this.pressed.clear(),this.jumpQueued=!1,this.clearTouchInput(),this.activePointer=null,document.body.classList.remove(`is-orbiting`)};handlePointerDown=e=>{e.pointerType!==`touch`&&(e.button===0||e.button===2)&&(this.activePointer=e.pointerId,this.lastPointer.set(e.clientX,e.clientY),this.canvas.setPointerCapture(e.pointerId),document.body.classList.add(`is-orbiting`),this.markInteracted())};handlePointerMove=e=>{e.pointerType!==`touch`&&e.pointerId===this.activePointer&&(this.orbitDelta.x+=e.clientX-this.lastPointer.x,this.orbitDelta.y+=e.clientY-this.lastPointer.y,this.lastPointer.set(e.clientX,e.clientY))};handlePointerUp=e=>{e.pointerType!==`touch`&&e.pointerId===this.activePointer&&(this.activePointer=null,document.body.classList.remove(`is-orbiting`),this.canvas.hasPointerCapture(e.pointerId)&&this.canvas.releasePointerCapture(e.pointerId))};handleWheel=e=>{e.preventDefault(),this.zoomDelta+=Math.sign(e.deltaY)*Math.min(1.5,Math.abs(e.deltaY)/120),this.markInteracted()};handleContextMenu=e=>{e.preventDefault()}},oo=.12,so=72,co={orbitX:0,orbitY:0,zoom:0};function lo(e,t,n,r,i){let a=Math.max(1,i),o=e-n,s=t-r,c=Math.hypot(o,s);if(c<1e-6)return{horizontal:0,forward:0,visualX:0,visualY:0};let l=o/c,u=s/c,d=Math.min(1,c/a),f=d<=oo?0:(d-oo)/.88,p=Math.min(c,a);return{horizontal:f===0?0:l*f,forward:f===0?0:-u*f,visualX:l*p,visualY:u*p}}function uo(e,t){return e>0||t}var fo=class{points=new Map;start(e,t,n){return!this.points.has(e)&&this.points.size>=2?!1:(this.points.set(e,{x:t,y:n}),!0)}move(e,t,n){let r=this.points.get(e);if(!r)return co;if(this.points.size===1){let e=t-r.x,i=n-r.y;return r.x=t,r.y=n,{orbitX:e,orbitY:i,zoom:0}}let i=this.getPinchDistance();r.x=t,r.y=n;let a=this.getPinchDistance();return{orbitX:0,orbitY:0,zoom:i===null||a===null?0:(i-a)/so}}end(e){this.points.delete(e)}clear(){this.points.clear()}get pointerCount(){return this.points.size}getPinchDistance(){let e,t;for(let n of this.points.values())if(!e)e=n;else{t=n;break}return e&&t?Math.hypot(t.x-e.x,t.y-e.y):null}};function po(e){let t=document.querySelector(e);if(!t)throw Error(`Mobile control element is missing: ${e}`);return t}function mo(e){return e.pointerType===`touch`}var ho=class{canvas;input;root=po(`[data-mobile-controls]`);stick=po(`[data-touch-move]`);stickThumb=po(`[data-touch-move-thumb]`);runButton=po(`[data-touch-run]`);jumpButton=po(`[data-touch-jump]`);coarsePointer=window.matchMedia(`(any-pointer: coarse)`);gesture=new fo;movementPointer=null;runPointer=null;jumpPointer=null;active=!1;constructor(e,t){this.canvas=e,this.input=t,this.stick.addEventListener(`pointerdown`,this.handleMoveStart),this.stick.addEventListener(`pointermove`,this.handleMove),this.stick.addEventListener(`pointerup`,this.handleMoveEnd),this.stick.addEventListener(`pointercancel`,this.handleMoveEnd),this.stick.addEventListener(`lostpointercapture`,this.handleMoveEnd),this.runButton.addEventListener(`pointerdown`,this.handleRunStart),this.runButton.addEventListener(`pointerup`,this.handleRunEnd),this.runButton.addEventListener(`pointercancel`,this.handleRunEnd),this.runButton.addEventListener(`lostpointercapture`,this.handleRunEnd),this.jumpButton.addEventListener(`pointerdown`,this.handleJumpStart),this.jumpButton.addEventListener(`pointerup`,this.handleJumpEnd),this.jumpButton.addEventListener(`pointercancel`,this.handleJumpEnd),this.jumpButton.addEventListener(`lostpointercapture`,this.handleJumpEnd),this.canvas.addEventListener(`pointerdown`,this.handleGestureStart),this.canvas.addEventListener(`pointermove`,this.handleGestureMove),this.canvas.addEventListener(`pointerup`,this.handleGestureEnd),this.canvas.addEventListener(`pointercancel`,this.handleGestureEnd),this.canvas.addEventListener(`lostpointercapture`,this.handleGestureEnd),window.addEventListener(`blur`,this.handleReset),window.addEventListener(`orientationchange`,this.handleReset),document.addEventListener(`visibilitychange`,this.handleVisibilityChange),this.coarsePointer.addEventListener(`change`,this.handleCapabilityChange),uo(navigator.maxTouchPoints,this.coarsePointer.matches)&&this.activate()}dispose(){this.reset(),this.stick.removeEventListener(`pointerdown`,this.handleMoveStart),this.stick.removeEventListener(`pointermove`,this.handleMove),this.stick.removeEventListener(`pointerup`,this.handleMoveEnd),this.stick.removeEventListener(`pointercancel`,this.handleMoveEnd),this.stick.removeEventListener(`lostpointercapture`,this.handleMoveEnd),this.runButton.removeEventListener(`pointerdown`,this.handleRunStart),this.runButton.removeEventListener(`pointerup`,this.handleRunEnd),this.runButton.removeEventListener(`pointercancel`,this.handleRunEnd),this.runButton.removeEventListener(`lostpointercapture`,this.handleRunEnd),this.jumpButton.removeEventListener(`pointerdown`,this.handleJumpStart),this.jumpButton.removeEventListener(`pointerup`,this.handleJumpEnd),this.jumpButton.removeEventListener(`pointercancel`,this.handleJumpEnd),this.jumpButton.removeEventListener(`lostpointercapture`,this.handleJumpEnd),this.canvas.removeEventListener(`pointerdown`,this.handleGestureStart),this.canvas.removeEventListener(`pointermove`,this.handleGestureMove),this.canvas.removeEventListener(`pointerup`,this.handleGestureEnd),this.canvas.removeEventListener(`pointercancel`,this.handleGestureEnd),this.canvas.removeEventListener(`lostpointercapture`,this.handleGestureEnd),window.removeEventListener(`blur`,this.handleReset),window.removeEventListener(`orientationchange`,this.handleReset),document.removeEventListener(`visibilitychange`,this.handleVisibilityChange),this.coarsePointer.removeEventListener(`change`,this.handleCapabilityChange),document.body.classList.remove(`has-touch-controls`,`is-touch-orbiting`),this.root.setAttribute(`aria-hidden`,`true`)}activate(){if(this.active)return;this.active=!0,document.body.classList.add(`has-touch-controls`),this.root.setAttribute(`aria-hidden`,`false`);let e=document.querySelector(`[data-onboarding-prompt]`),t=document.querySelector(`[data-onboarding-action]`);e&&(e.textContent=`Touch and drag anywhere`),t&&(t.textContent=`SWIPE TO LOOK AROUND`)}reset(){this.movementPointer=null,this.runPointer=null,this.jumpPointer=null,this.gesture.clear(),this.input.clearTouchInput(),this.stick.classList.remove(`is-active`),this.runButton.classList.remove(`is-active`),this.jumpButton.classList.remove(`is-active`),this.runButton.setAttribute(`aria-pressed`,`false`),this.stickThumb.style.setProperty(`--touch-x`,`0px`),this.stickThumb.style.setProperty(`--touch-y`,`0px`),this.stick.setAttribute(`aria-valuetext`,`Centered`),document.body.classList.remove(`is-touch-orbiting`)}updateMovement(e){let t=this.stick.getBoundingClientRect(),n=Math.min(t.width,t.height)*.36,r=lo(e.clientX,e.clientY,t.left+t.width*.5,t.top+t.height*.5,n);this.stickThumb.style.setProperty(`--touch-x`,`${r.visualX.toFixed(2)}px`),this.stickThumb.style.setProperty(`--touch-y`,`${r.visualY.toFixed(2)}px`),this.stick.setAttribute(`aria-valuetext`,`Horizontal ${r.horizontal.toFixed(2)}, forward ${r.forward.toFixed(2)}`),this.input.setTouchMovement(r.horizontal,r.forward)}capturePointer(e,t){try{e.setPointerCapture(t)}catch{}}releasePointer(e,t){try{e.hasPointerCapture(t)&&e.releasePointerCapture(t)}catch{}}handleMoveStart=e=>{!mo(e)||this.movementPointer!==null||(e.preventDefault(),this.activate(),this.movementPointer=e.pointerId,this.capturePointer(this.stick,e.pointerId),this.stick.classList.add(`is-active`),this.updateMovement(e))};handleMove=e=>{e.pointerId===this.movementPointer&&(e.preventDefault(),this.updateMovement(e))};handleMoveEnd=e=>{e.pointerId===this.movementPointer&&(e.preventDefault(),this.releasePointer(this.stick,e.pointerId),this.movementPointer=null,this.input.clearTouchMovement(),this.stick.classList.remove(`is-active`),this.stickThumb.style.setProperty(`--touch-x`,`0px`),this.stickThumb.style.setProperty(`--touch-y`,`0px`),this.stick.setAttribute(`aria-valuetext`,`Centered`))};handleRunStart=e=>{!mo(e)||this.runPointer!==null||(e.preventDefault(),this.activate(),this.runPointer=e.pointerId,this.capturePointer(this.runButton,e.pointerId),this.runButton.classList.add(`is-active`),this.runButton.setAttribute(`aria-pressed`,`true`),this.input.setTouchRunning(!0))};handleRunEnd=e=>{e.pointerId===this.runPointer&&(e.preventDefault(),this.releasePointer(this.runButton,e.pointerId),this.runPointer=null,this.runButton.classList.remove(`is-active`),this.runButton.setAttribute(`aria-pressed`,`false`),this.input.setTouchRunning(!1))};handleJumpStart=e=>{!mo(e)||this.jumpPointer!==null||(e.preventDefault(),this.activate(),this.jumpPointer=e.pointerId,this.capturePointer(this.jumpButton,e.pointerId),this.jumpButton.classList.add(`is-active`),this.input.queueTouchJump())};handleJumpEnd=e=>{e.pointerId===this.jumpPointer&&(e.preventDefault(),this.releasePointer(this.jumpButton,e.pointerId),this.jumpPointer=null,this.jumpButton.classList.remove(`is-active`))};handleGestureStart=e=>{!mo(e)||!this.gesture.start(e.pointerId,e.clientX,e.clientY)||(e.preventDefault(),this.activate(),this.capturePointer(this.canvas,e.pointerId),document.body.classList.add(`is-touch-orbiting`))};handleGestureMove=e=>{if(!mo(e))return;let t=this.gesture.move(e.pointerId,e.clientX,e.clientY);(t.orbitX!==0||t.orbitY!==0||t.zoom!==0)&&(e.preventDefault(),this.input.addTouchOrbitDelta(t.orbitX,t.orbitY),this.input.addTouchZoomDelta(t.zoom))};handleGestureEnd=e=>{mo(e)&&(this.releasePointer(this.canvas,e.pointerId),this.gesture.end(e.pointerId),this.gesture.pointerCount===0&&document.body.classList.remove(`is-touch-orbiting`))};handleReset=()=>{this.reset()};handleVisibilityChange=()=>{document.hidden&&this.reset()};handleCapabilityChange=e=>{e.matches&&this.activate()}},go=class extends fe{constructor(){super(),this.name=`RoomEnvironment`,this.position.y=-3.5;let e=new ve;e.deleteAttribute(`uv`);let t=new f({side:1}),n=new f,r=new ie(16777215,900,28,2);r.position.set(.418,16.199,.3),this.add(r);let i=new N(e,t);i.position.set(-.757,13.219,.717),i.scale.set(31.713,28.305,28.591),this.add(i);let a=new me(e,n,6),o=new E;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);let s=new N(e,_o(50));s.position.set(-16.116,14.37,8.208),s.scale.set(.1,2.428,2.739),this.add(s);let c=new N(e,_o(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let l=new N(e,_o(17));l.position.set(14.904,12.198,-1.832),l.scale.set(.15,4.265,6.331),this.add(l);let u=new N(e,_o(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);let d=new N(e,_o(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);let p=new N(e,_o(100));p.position.set(0,20,0),p.scale.set(1,.1,1),this.add(p)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function _o(e){return new ot({color:0,emissive:16777215,emissiveIntensity:e})}var vo=class{group=new h;rimLight;capeFill;target=new E;environmentTarget;rimOffset=new I(-2.8,4.7,3.2);targetOffset=new I(0,1.05,0);fillOffset=new I(0,1.4,.85);constructor(e,t){this.group.name=`Cinematic fill lighting`;let n=new pe(7904401,1510409,.36),r=new ze(5272942,.15);this.rimLight=new Ke(7523775,13,15,.63,.9,1.5),this.rimLight.target=this.target,this.capeFill=new ie(13187883,2.8,4.5,2),this.group.add(n,r,this.rimLight,this.target,this.capeFill);let i=new Zt(t),a=new go;this.environmentTarget=i.fromScene(a,.06),e.environment=this.environmentTarget.texture,e.environmentIntensity=.24,a.dispose(),i.dispose()}update(e,t){this.rimLight.position.copy(e).add(this.rimOffset),this.target.position.copy(e).add(this.targetOffset),this.capeFill.position.copy(e).add(this.fillOffset),this.capeFill.intensity=2.6+Math.sin(t*1.7)*.18}dispose(){this.environmentTarget.dispose()}},yo=2.8;function bo(){let e=[],t=(t,n,r,i,a,o)=>{e.push({firstColumn:t,firstRow:n,secondColumn:r,secondRow:i,stiffness:a,structural:o})};for(let e=0;e<J.rows;e+=1)for(let n=0;n<J.columns;n+=1)n+1<J.columns&&t(n,e,n+1,e,.93,!0),e+1<J.rows&&t(n,e,n,e+1,.96,!0),n+1<J.columns&&e+1<J.rows&&(t(n,e,n+1,e+1,.8,!1),t(n+1,e,n,e+1,.8,!1)),n+2<J.columns&&t(n,e,n+2,e,.58,!1),e+2<J.rows&&t(n,e,n,e+2,.82,!1),n+3<J.columns&&t(n,e,n+3,e,.16,!1),e+3<J.rows&&t(n,e,n,e+3,.38,!1);return e}var xo=bo();function So({predictedVerticalDisplacement:e,projectedPositionY:t,previousPositionY:n,hasMaterialContact:r}){return r||e>=0||t<=n?n:t}function Co(e){return e.shape===`convex-rock`}function wo(e){return e.clearance??.026}function To(e){return(e.depthRadius??e.radius)+wo(e)}var Eo=class{positions;previous;inverseMass;columns;rows;triangle=new Xe;closestPoint=new I;barycentric=new I;capsuleAxis=new I;sampleCenter=new I;delta=new I;boundsMinimum=new I;boundsMaximum=new I;motion=new I;contactNormal=new I;previousClosestPoint=new I;rowMinimumY;rowMaximumY;correctionUsed;constructor(e,t,n,r,i){this.positions=e,this.previous=t,this.inverseMass=n,this.columns=r,this.rows=i,this.rowMinimumY=new Float32Array(i),this.rowMaximumY=new Float32Array(i),this.correctionUsed=new Float32Array(n.length)}beginStep(){this.correctionUsed.fill(0)}getCorrectionUsed(e){return this.correctionUsed[e]??0}solve(e,t,n){this.updateBounds(),this.forEachCapsuleSample(e,(e,r,i)=>{let a=Math.max(r,i);this.intersectsBounds(e,a)&&this.forEachTriangle(e.y,a,(a,o,s)=>{this.solveTriangle(a,o,s,e,r,i,t,n)})})}getMaximumPenetration(e,t){this.updateBounds();let n=0;return this.forEachCapsuleSample(e,(e,r,i)=>{let a=Math.max(r,i);this.intersectsBounds(e,a)&&this.forEachTriangle(e.y,a,(a,o,s)=>{n=Math.max(n,this.getTrianglePenetration(a,o,s,e,r,i,t))})}),n}solveTriangle(e,t,n,r,i,a,o,s){let c=this.positions[e],l=this.positions[t],u=this.positions[n];if(!c||!l||!u)return;let d=Math.max(i,a);if(!this.intersectsTriangleBounds(c,l,u,r,d)||(this.triangle.set(c,l,u),this.triangle.closestPointToPoint(r,this.closestPoint),this.triangle.getBarycoord(this.closestPoint,this.barycentric)===null))return;let f=this.previous[e],p=this.previous[t],m=this.previous[n];if(!f||!p||!m)return;this.previousClosestPoint.set(0,0,0).addScaledVector(f,this.barycentric.x).addScaledVector(p,this.barycentric.y).addScaledVector(m,this.barycentric.z);let h=(e%this.columns*this.barycentric.x+t%this.columns*this.barycentric.y+n%this.columns*this.barycentric.z)/(this.columns-1)-.5,g=this.oneSidedPenetration(this.closestPoint,r,i,a,o,this.previousClosestPoint,s,h);if(g<=0)return;let _=this.inverseMass[e]??0,v=this.inverseMass[t]??0,y=this.inverseMass[n]??0,b=_*this.barycentric.x*this.barycentric.x+v*this.barycentric.y*this.barycentric.y+y*this.barycentric.z*this.barycentric.z;if(b<1e-6)return;let x=g/b;this.applyCorrection(e,_*this.barycentric.x*x,this.contactNormal),this.applyCorrection(t,v*this.barycentric.y*x,this.contactNormal),this.applyCorrection(n,y*this.barycentric.z*x,this.contactNormal)}getTrianglePenetration(e,t,n,r,i,a,o){let s=this.positions[e],c=this.positions[t],l=this.positions[n];if(!s||!c||!l)return 0;let u=Math.max(i,a);return this.intersectsTriangleBounds(s,c,l,r,u)?(this.triangle.set(s,c,l),this.triangle.closestPointToPoint(r,this.closestPoint),this.oneSidedPenetration(this.closestPoint,r,i,a,o)):0}oneSidedPenetration(e,t,n,r,i,a,o,s=0){this.delta.copy(e).sub(t);let c=this.delta.dot(i),l=Math.max(0,this.delta.lengthSq()-c*c);if(l>=n*n)return 0;let u=l/(n*n),d=r*Math.sqrt(1-u),f=Math.max(0,d-c);if(this.contactNormal.copy(i),f<=0||c>=0)return f;if(c<=-r)return 0;let p=G.clamp(c/r,-1,0),m=n*Math.sqrt(Math.max(0,1-p*p)),h=a??e,g=i.z,_=-i.x,v=o?(h.x-o.x)*g+(h.z-o.z)*_:0,y=Math.abs(s)>1e-6?s:v;if(Math.abs(y)>1e-6){let e=Math.sign(y);this.contactNormal.set(g*e,0,_*e)}else{this.contactNormal.copy(h).sub(t);let e=this.contactNormal.dot(i);this.contactNormal.addScaledVector(i,-e),this.contactNormal.y=0,this.contactNormal.lengthSq()>1e-6?this.contactNormal.normalize():l>1e-6?this.contactNormal.copy(this.delta).addScaledVector(i,-c).normalize():this.contactNormal.set(g,0,_).normalize()}let b=m-this.delta.dot(this.contactNormal);return b>0?b:f}forEachCapsuleSample(e,t){for(let n of e){this.capsuleAxis.copy(n.end).sub(n.start);let e=this.capsuleAxis.length(),r=wo(n),i=n.radius+r,a=To(n),o=n.faceSampleSpacing??Math.max(.04,i*.82),s=e<1e-6?0:Math.max(1,Math.ceil(e/o)),c=s>0?e/s:0,l=Math.hypot(i,c*.5),u=a*l/i;for(let e=0;e<=s;e+=1){let r=s>0?e/s:0;this.sampleCenter.lerpVectors(n.start,n.end,r),t(this.sampleCenter,l,u)}}}forEachTriangle(e,t,n){for(let r=0;r<this.rows-1;r+=1){let i=Math.min(this.rowMinimumY[r],this.rowMinimumY[r+1]),a=Math.max(this.rowMaximumY[r],this.rowMaximumY[r+1]);if(!(e+t<i||e-t>a))for(let e=0;e<this.columns-1;e+=1){let t=this.index(e,r),i=this.index(e,r+1);n(t,i,t+1),n(i,i+1,t+1)}}}applyCorrection(e,t,n){if(t<=0)return;let r=this.positions[e],i=this.previous[e];if(!r||!i)return;r.addScaledVector(n,t),i.addScaledVector(n,t);let a=this.motion.copy(r).sub(i).dot(n);a<0&&i.addScaledVector(n,a),this.correctionUsed[e]=(this.correctionUsed[e]??0)+t}updateBounds(){this.boundsMinimum.set(1/0,1/0,1/0),this.boundsMaximum.set(-1/0,-1/0,-1/0),this.rowMinimumY.fill(1/0),this.rowMaximumY.fill(-1/0);for(let e=0;e<this.positions.length;e+=1){let t=this.positions[e];if(!t)continue;this.boundsMinimum.min(t),this.boundsMaximum.max(t);let n=Math.floor(e/this.columns);this.rowMinimumY[n]=Math.min(this.rowMinimumY[n],t.y),this.rowMaximumY[n]=Math.max(this.rowMaximumY[n],t.y)}}intersectsBounds(e,t){return e.x+t>=this.boundsMinimum.x&&e.x-t<=this.boundsMaximum.x&&e.y+t>=this.boundsMinimum.y&&e.y-t<=this.boundsMaximum.y&&e.z+t>=this.boundsMinimum.z&&e.z-t<=this.boundsMaximum.z}intersectsTriangleBounds(e,t,n,r,i){return r.x+i>=Math.min(e.x,t.x,n.x)&&r.x-i<=Math.max(e.x,t.x,n.x)&&r.y+i>=Math.min(e.y,t.y,n.y)&&r.y-i<=Math.max(e.y,t.y,n.y)&&r.z+i>=Math.min(e.z,t.z,n.z)&&r.z-i<=Math.max(e.z,t.z,n.z)}index(e,t){return t*this.columns+e}},Do=1e-5,Oo=1e-5,ko=[`x`,`y`,`z`];function Ao(e,t){return e.walkable&&t<=e.bounds.min.y+(e.bounds.max.y-e.bounds.min.y)*.72}function jo(e,t,n){let r=e.getAttribute(`position`);if(!r)throw Error(`Rock collision geometry has no positions.`);e.boundingSphere||e.computeBoundingSphere();let i=e.boundingSphere;if(!i)throw Error(`Rock collision geometry has no bounding sphere.`);let a=i.center.clone().applyMatrix4(t),o=[],s=new Map,c=e.index,l=(c?.count??r.count)/3,u=new I,d=e=>{let n=c?.getX(e)??e;return u.fromBufferAttribute(r,n).clone().applyMatrix4(t)},f=e=>`${e.x.toFixed(6)}:${e.y.toFixed(6)}:${e.z.toFixed(6)}`;for(let e=0;e<l;e+=1){let t=e*3,n=d(t),r=d(t+1),i=d(t+2),c=new Xe(n,r,i),l=c.getNormal(new I),u=c.getMidpoint(new I);if(l.dot(u.sub(a))<0&&l.negate(),!(l.lengthSq()<.5)){o.push({triangle:c,normal:l,planeConstant:l.dot(n),bounds:new Ne().setFromPoints([n,r,i])});for(let e of[n,r,i]){let t=f(e);s.has(t)||s.set(t,e.clone())}}}if(o.length===0)throw Error(`Rock collision geometry has no valid faces.`);let p=[...s.values()],m=new Ne().setFromPoints(p),h=0;for(let e of p)h=Math.max(h,e.distanceTo(a));return{center:a,radius:h,walkable:n,kind:`rock`,shape:`convex-rock`,bounds:m,faces:o}}var Mo=class{closestSurface=new I;candidate=new I;delta=new I;intersectsExpandedBounds(e,t,n,r){let i=0,a=1;for(let o of ko){let s=e.bounds.min[o]-r,c=e.bounds.max[o]+r,l=t[o],u=n[o]-l;if(Math.abs(u)<Do){if(l<s||l>c)return!1;continue}let d=(s-l)/u,f=(c-l)/u;if(d>f){let e=d;d=f,f=e}if(i=Math.max(i,d),a=Math.min(a,f),i>a)return!1}return a>=0&&i<=1}getSignedDistance(e,t,n){let r=!0,i=1/0,a;for(let n of e.faces){n.normal.dot(t)-n.planeConstant>Do&&(r=!1),n.triangle.closestPointToPoint(t,this.candidate);let e=this.candidate.distanceToSquared(t);e>=i||(i=e,a=n,this.closestSurface.copy(this.candidate))}let o=Math.sqrt(i);return o>Do?n.copy(r?this.closestSurface:t).sub(r?t:this.closestSurface).multiplyScalar(1/o):a?n.copy(a.normal):(n.copy(t).sub(e.center),n.lengthSq()<Do?n.set(0,1,0):n.normalize()),r?-o:o}getSupportHeight(e,t,n){if(t<e.bounds.min.x-Oo||t>e.bounds.max.x+Oo||n<e.bounds.min.z-Oo||n>e.bounds.max.z+Oo)return null;let r=-1/0;for(let i of e.faces){if(i.normal.y<=Oo)continue;let{a:e,b:a,c:o}=i.triangle;if(t<i.bounds.min.x-Oo||t>i.bounds.max.x+Oo||n<i.bounds.min.z-Oo||n>i.bounds.max.z+Oo)continue;let s=a.x-e.x,c=a.z-e.z,l=o.x-e.x,u=o.z-e.z,d=t-e.x,f=n-e.z,p=s*u-l*c;if(Math.abs(p)<Oo)continue;let m=(d*u-l*f)/p,h=(s*f-d*c)/p;if(m<-1e-5||h<-1e-5||m+h>1.00001)continue;let g=e.y+m*(a.y-e.y)+h*(o.y-e.y);r=Math.max(r,g)}return Number.isFinite(r)?r:null}sweep(e,t,n,r,i){if(!this.intersectsExpandedBounds(e,t,n,r))return null;let a=0,o=1,s,c=!0;for(let i of e.faces){let e=i.planeConstant+r,l=i.normal.dot(t)-e,u=i.normal.dot(n)-e;if(l>0&&(c=!1),l>0&&u>0)return null;if(l<=0&&u<=0)continue;let d=l/(l-u);if(l>u?d>a&&(a=d,s=i):o=Math.min(o,d),a>o)return null}return c||!s||a<0||a>1?null:(i.copy(s.normal),a)}getPlanarSeparation(e,t,n,r){let i=n-this.getSignedDistance(e,t,this.delta);if(i<=0)return 0;r.set(this.delta.x,this.delta.z);let a=r.length();return a<Do?(r.set(t.x-e.center.x,t.z-e.center.z),r.lengthSq()<Do&&r.set(1,0),r.normalize()):r.multiplyScalar(1/a),i}},No=1e-6,Po=1e-5,Fo=class{firstDirection=new I;secondDirection=new I;segmentOffset=new I;segmentDirection=new I;triangleFirstEdge=new I;triangleSecondEdge=new I;determinantVector=new I;vertexOffset=new I;barycentricVector=new I;candidateFirst=new I;candidateSecond=new I;intersectAtPoint(e,t,n,r,i,a){return this.intersectSegmentTriangle(e.a,e.b,t,i)||this.intersectSegmentTriangle(e.b,e.c,t,i)||this.intersectSegmentTriangle(e.c,e.a,t,i)?(a.copy(n),2):this.intersectSegmentTriangle(t.a,t.b,e,i)||this.intersectSegmentTriangle(t.b,t.c,e,i)||this.intersectSegmentTriangle(t.c,t.a,e,i)?(e.getNormal(a),a.dot(r)<0&&a.negate(),a.lengthSq()<No&&a.copy(n),1):0}closestPoints(e,t,n,r){let i=1/0,a=(e,t)=>{let a=e.distanceToSquared(t);a>=i||(i=a,n.copy(e),r.copy(t))};t.closestPointToPoint(e.a,this.candidateSecond),a(e.a,this.candidateSecond),t.closestPointToPoint(e.b,this.candidateSecond),a(e.b,this.candidateSecond),t.closestPointToPoint(e.c,this.candidateSecond),a(e.c,this.candidateSecond),e.closestPointToPoint(t.a,this.candidateFirst),a(this.candidateFirst,t.a),e.closestPointToPoint(t.b,this.candidateFirst),a(this.candidateFirst,t.b),e.closestPointToPoint(t.c,this.candidateFirst),a(this.candidateFirst,t.c);let o=(e,t,n,r)=>{this.closestSegmentPoints(e,t,n,r,this.candidateFirst,this.candidateSecond),a(this.candidateFirst,this.candidateSecond)};return o(e.a,e.b,t.a,t.b),o(e.a,e.b,t.b,t.c),o(e.a,e.b,t.c,t.a),o(e.b,e.c,t.a,t.b),o(e.b,e.c,t.b,t.c),o(e.b,e.c,t.c,t.a),o(e.c,e.a,t.a,t.b),o(e.c,e.a,t.b,t.c),o(e.c,e.a,t.c,t.a),i}intersectSegmentTriangle(e,t,n,r){this.segmentDirection.copy(t).sub(e),this.triangleFirstEdge.copy(n.b).sub(n.a),this.triangleSecondEdge.copy(n.c).sub(n.a),this.determinantVector.copy(this.segmentDirection).cross(this.triangleSecondEdge);let i=this.triangleFirstEdge.dot(this.determinantVector);if(Math.abs(i)<=Po)return!1;let a=1/i;this.vertexOffset.copy(e).sub(n.a);let o=this.vertexOffset.dot(this.determinantVector)*a;if(o<-1e-5||o>1.00001)return!1;this.barycentricVector.copy(this.vertexOffset).cross(this.triangleFirstEdge);let s=this.segmentDirection.dot(this.barycentricVector)*a;if(s<-1e-5||o+s>1.00001)return!1;let c=this.triangleSecondEdge.dot(this.barycentricVector)*a;return c<-1e-5||c>1.00001?!1:(r.copy(e).addScaledVector(this.segmentDirection,G.clamp(c,0,1)),!0)}closestSegmentPoints(e,t,n,r,i,a){this.firstDirection.copy(t).sub(e),this.secondDirection.copy(r).sub(n),this.segmentOffset.copy(e).sub(n);let o=this.firstDirection.lengthSq(),s=this.secondDirection.lengthSq(),c=this.secondDirection.dot(this.segmentOffset),l=0,u=0;if(o<=No&&s<=No){i.copy(e),a.copy(n);return}if(o<=No)u=G.clamp(c/s,0,1);else{let e=this.firstDirection.dot(this.segmentOffset);if(s<=No)l=G.clamp(-e/o,0,1);else{let t=this.firstDirection.dot(this.secondDirection),n=o*s-t*t;Math.abs(n)>No&&(l=G.clamp((t*c-e*s)/n,0,1)),u=(t*l+c)/s,u<0?(u=0,l=G.clamp(-e/o,0,1)):u>1&&(u=1,l=G.clamp((t-e)/o,0,1))}}i.copy(e).addScaledVector(this.firstDirection,l),a.copy(n).addScaledVector(this.secondDirection,u)}},Io=1e-6,Lo=1.5,Ro=4,zo=10,Bo=class{positions;previous;inverseMass;columns;rows;clearance;clothTriangle=new Xe;previousTriangle=new Xe;clothPoint=new I;candidateCloth=new I;candidateRock=new I;barycentric=new I;normal=new I;boundsMinimum=new I;boundsMaximum=new I;clothBounds=new Ne;previousBounds=new Ne;vertexNormal=new I;previousCentroid=new I;referenceDirection=new I;candidateContactNormal=new I;intersectionNormal=new I;intersectionSeparation=0;motion=new I;rockQuery=new Mo;triangleQuery=new Fo;faceCorrectionUsed;sweptFaceRecoveryPending=!0;constructor(e,t,n,r,i,a){this.positions=e,this.previous=t,this.inverseMass=n,this.columns=r,this.rows=i,this.clearance=a,this.faceCorrectionUsed=new Float32Array(n.length)}beginStep(){this.sweptFaceRecoveryPending=!0,this.beginPass()}getCorrectionUsed(e){return this.faceCorrectionUsed[e]??0}beginPass(){this.faceCorrectionUsed.fill(0)}solve(e,t){let n=this.sweptFaceRecoveryPending;this.sweptFaceRecoveryPending=!1,this.updateBounds();let r=0;for(let i of e){if(!this.intersectsColliderBounds(i))continue;let e=0;this.forEachTriangle((t,r,a)=>{e+=this.solveTriangle(t,r,a,i,n)}),r+=e,e>0&&t&&!t.includes(i)&&t.push(i)}return r}getMaximumPenetration(e){return this.getMaximumPenetrationDiagnostics(e).maximum}getMaximumPenetrationDiagnostics(e){this.updateBounds();let t=0,n=null,r=null,i=null,a=null;for(let o of e)this.intersectsColliderBounds(o)&&this.forEachTriangle((e,s,c)=>{let l=this.getTrianglePenetration(e,s,c,o);l<=t||(t=l,n=[e,s,c],r=[e,s,c].map(e=>{let t=this.positions[e]??new I;return[t.x,t.y,t.z]}),i=[e,s,c].map(e=>{let t=this.previous[e]??new I;return[t.x,t.y,t.z]}),a=[o.center.x,o.center.y,o.center.z])});return{maximum:t,triangle:n,positions:r,previous:i,rockCenter:a}}getClosestSurfaceContact(e){this.updateBounds();let t=e.map(e=>({collider:e,lowerBoundSquared:this.getBoundsDistanceSquared(this.boundsMinimum,this.boundsMaximum,e.bounds.min,e.bounds.max)})).sort((e,t)=>e.lowerBoundSquared-t.lowerBoundSquared),n=1/0,r;for(let e of t){if(e.lowerBoundSquared>n)break;let{collider:t}=e;this.forEachTriangle((e,i,a)=>{let o=this.positions[e],s=this.positions[i],c=this.positions[a];if(!(!o||!s||!c)){this.clothTriangle.set(o,s,c),this.clothBounds.makeEmpty(),this.clothBounds.expandByPoint(o),this.clothBounds.expandByPoint(s),this.clothBounds.expandByPoint(c);for(let e of t.faces){if(this.getBoundsDistanceSquared(this.clothBounds.min,this.clothBounds.max,e.bounds.min,e.bounds.max)>n)continue;let i=this.triangleQuery.closestPoints(this.clothTriangle,e.triangle,this.candidateCloth,this.candidateRock);i>=n||(n=i,r=t)}}})}return r&&Number.isFinite(n)?{distance:Math.sqrt(n),collider:r}:null}getBoundsDistanceSquared(e,t,n,r){let i=Math.max(0,n.x-t.x,e.x-r.x),a=Math.max(0,n.y-t.y,e.y-r.y),o=Math.max(0,n.z-t.z,e.z-r.z);return i*i+a*a+o*o}solveTriangle(e,t,n,r,i){let a=this.findTrianglePenetration(e,t,n,r,!0);if(a<=0)return i&&this.sweptTriangleIntersectsCollider(e,t,n,r)&&this.restorePreviousTriangle(e,t,n,r)?1:0;if(this.clothTriangle.getBarycoord(this.clothPoint,this.barycentric)===null)return 0;if(this.restorePreviousTriangle(e,t,n,r))return 1;(Ao(r,this.clothPoint.y)||this.normal.y<0&&this.clothPoint.y<=r.bounds.min.y+this.clearance*2)&&(this.normal.set(this.clothPoint.x-r.center.x,0,this.clothPoint.z-r.center.z),this.normal.lengthSq()<Io?this.normal.set(1,0,0):this.normal.normalize());for(let r of[e,t,n])(this.inverseMass[r]??0)>0&&this.applyCorrection(r,a);return 1}getTrianglePenetration(e,t,n,r){let i=this.findTrianglePenetration(e,t,n,r,!1);return Math.max(0,i)}restorePreviousTriangle(e,t,n,r){let i=this.previous[e],a=this.previous[t],o=this.previous[n];if(!i||!a||!o||this.rockQuery.getSignedDistance(r,i,this.vertexNormal)<0||this.rockQuery.getSignedDistance(r,a,this.vertexNormal)<0||this.rockQuery.getSignedDistance(r,o,this.vertexNormal)<0||(this.previousTriangle.set(i,a,o),this.triangleIntersectsCollider(this.previousTriangle,r)))return!1;let s=!1;for(let r of[e,t,n]){if((this.inverseMass[r]??0)<=0)continue;let e=this.positions[r],t=this.previous[r];!e||!t||(e.copy(t),s=!0)}return s}sweptTriangleIntersectsCollider(e,t,n,r){let i=this.positions[e],a=this.positions[t],o=this.positions[n],s=this.previous[e],c=this.previous[t],l=this.previous[n];if(!i||!a||!o||!s||!c||!l||(this.previousBounds.makeEmpty(),this.previousBounds.expandByPoint(i),this.previousBounds.expandByPoint(a),this.previousBounds.expandByPoint(o),this.previousBounds.expandByPoint(s),this.previousBounds.expandByPoint(c),this.previousBounds.expandByPoint(l),!this.previousBounds.intersectsBox(r.bounds)))return!1;for(let e=1;e<Ro;e+=1){let t=e/Ro;if(this.previousTriangle.set(this.candidateCloth.lerpVectors(s,i,t),this.candidateRock.lerpVectors(c,a,t),this.motion.lerpVectors(l,o,t)),this.triangleIntersectsCollider(this.previousTriangle,r))return!0}return!1}triangleIntersectsCollider(e,t){if(this.previousBounds.setFromPoints([e.a,e.b,e.c]),!this.previousBounds.intersectsBox(t.bounds))return!1;e.getMidpoint(this.referenceDirection).sub(t.center),this.referenceDirection.lengthSq()<Io?e.getNormal(this.referenceDirection):this.referenceDirection.normalize();for(let n of t.faces)if(this.previousBounds.intersectsBox(n.bounds)&&this.triangleQuery.intersectAtPoint(e,n.triangle,n.normal,this.referenceDirection,this.candidateCloth,this.candidateContactNormal)>0)return!0;return!1}findTrianglePenetration(e,t,n,r,i){let a=this.positions[e],o=this.positions[t],s=this.positions[n];if(!a||!o||!s||(this.clothTriangle.set(a,o,s),this.clothBounds.setFromPoints([a,o,s]).expandByScalar(this.clearance),!this.clothBounds.intersectsBox(r.bounds)))return 0;let c=this.previous[e]??a,l=this.previous[t]??o,u=this.previous[n]??s;this.previousCentroid.copy(c).add(l).add(u).multiplyScalar(1/3),this.referenceDirection.copy(this.previousCentroid).sub(r.center),this.referenceDirection.lengthSq()<Io&&this.clothTriangle.getMidpoint(this.referenceDirection).sub(r.center),this.referenceDirection.lengthSq()<Io?this.clothTriangle.getNormal(this.referenceDirection):this.referenceDirection.normalize();let d=0,f=-1/0,p=1/0;for(let e of r.faces){if(!this.clothBounds.intersectsBox(e.bounds))continue;let t=this.triangleQuery.intersectAtPoint(this.clothTriangle,e.triangle,e.normal,this.referenceDirection,this.candidateCloth,this.candidateContactNormal);if(t>0){let n=this.candidateContactNormal.dot(this.referenceDirection),r=t===2?this.clearance-Math.min(e.normal.dot(a)-e.planeConstant,e.normal.dot(o)-e.planeConstant,e.normal.dot(s)-e.planeConstant):this.clearance*Lo;(t>d||t===d&&(r<p||Math.abs(r-p)<Io&&n>f))&&(d=t,f=n,p=r,this.intersectionNormal.copy(this.candidateContactNormal),this.intersectionSeparation=r,this.clothPoint.copy(this.candidateCloth))}}return d>0?(this.normal.copy(this.intersectionNormal),i?Math.max(this.clearance*Lo,this.intersectionSeparation):this.clearance):0}applyCorrection(e,t){if(t<=0)return;let n=Math.max(0,this.clearance*zo-(this.faceCorrectionUsed[e]??0)),r=Math.min(t,n);if(r<=0)return;let i=this.positions[e],a=this.previous[e];if(!i||!a)return;i.addScaledVector(this.normal,r),a.addScaledVector(this.normal,r);let o=this.motion.copy(i).sub(a).dot(this.normal);o<0&&a.addScaledVector(this.normal,o),this.faceCorrectionUsed[e]=(this.faceCorrectionUsed[e]??0)+r}forEachTriangle(e){for(let t=0;t<this.rows-1;t+=1)for(let n=0;n<this.columns-1;n+=1){let r=t*this.columns+n,i=r+this.columns;e(r,i,r+1),e(i,i+1,r+1)}}updateBounds(){this.boundsMinimum.set(1/0,1/0,1/0),this.boundsMaximum.set(-1/0,-1/0,-1/0);for(let e=0;e<this.positions.length;e+=1){let t=this.positions[e],n=this.previous[e];t&&(this.boundsMinimum.min(t),this.boundsMaximum.max(t)),n&&(this.boundsMinimum.min(n),this.boundsMaximum.max(n))}}intersectsColliderBounds(e){return e.bounds.max.x+this.clearance>=this.boundsMinimum.x&&e.bounds.min.x-this.clearance<=this.boundsMaximum.x&&e.bounds.max.y+this.clearance>=this.boundsMinimum.y&&e.bounds.min.y-this.clearance<=this.boundsMaximum.y&&e.bounds.max.z+this.clearance>=this.boundsMinimum.z&&e.bounds.min.z-this.clearance<=this.boundsMaximum.z}},Vo=.045;function Ho(e,t,n,r,i,a){let o=ft(e.x,e.z)+r;if(i.y>=0||e.y>o+Vo)return null;let s=e.x-t.x,c=e.y-t.y,l=e.z-t.z,u=Math.hypot(s,l),d=Math.sqrt(Math.max(0,n*n-c*c));return i.set(s,0,l),u<1e-6?(i.set(a.x-t.x,0,a.z-t.z),i.lengthSq()<1e-6?i.set(1,0,0):i.normalize()):i.multiplyScalar(1/u),Math.max(0,d-u)}var Uo=.004,Wo=.003,Go=4;function Ko(e){return e.kind===`rock`?Wo:Uo}var qo=class{positions;previous;inverseMass;columns;rows;triangle=new Xe;previousTriangle=new Xe;closestPoint=new I;barycentric=new I;normal=new I;centroid=new I;boundsMinimum=new I;boundsMaximum=new I;motion=new I;sweptFaceRecoveryPending=!0;constructor(e,t,n,r,i){this.positions=e,this.previous=t,this.inverseMass=n,this.columns=r,this.rows=i}beginStep(){this.sweptFaceRecoveryPending=!0}solve(e,t){let n=this.sweptFaceRecoveryPending;this.sweptFaceRecoveryPending=!1,this.updateBounds();let r=0;for(let i of e){let e=i.radius+Ko(i);if(!this.intersectsBounds(i.center,e))continue;let a=0;for(let e=0;e<this.rows-1;e+=1)for(let t=0;t<this.columns-1;t+=1){let r=this.index(t,e),o=this.index(t,e+1);a+=this.solveTriangle(r,o,r+1,i,n),a+=this.solveTriangle(o,o+1,r+1,i,n)}r+=a,a>0&&t&&!t.includes(i)&&t.push(i)}return r}getMaximumPenetration(e){this.updateBounds();let t=0;for(let n of e){let e=n.radius+Ko(n);if(this.intersectsBounds(n.center,e))for(let r=0;r<this.rows-1;r+=1)for(let i=0;i<this.columns-1;i+=1){let a=this.index(i,r),o=this.index(i,r+1);t=Math.max(t,this.getTrianglePenetration(a,o,a+1,n.center,e),this.getTrianglePenetration(o,o+1,a+1,n.center,e))}}return t}solveTriangle(e,t,n,r,i){let a=this.positions[e],o=this.positions[t],s=this.positions[n];if(!a||!o||!s)return 0;let c=Ko(r),l=r.radius+c,u=this.previous[e],d=this.previous[t],f=this.previous[n],p=this.intersectsTriangleBounds(a,o,s,r.center,l),m=i&&u&&d&&f&&this.intersectsSweptTriangleBounds(a,o,s,u,d,f,r.center,l);if(!p&&!m)return 0;this.triangle.set(a,o,s),this.triangle.closestPointToPoint(r.center,this.closestPoint);let h=this.closestPoint.distanceToSquared(r.center);if(h>=l*l)return i&&u&&d&&f&&this.restoreSweptTriangle(e,t,n,u,d,f,r.center,l)?1:0;if(this.triangle.getBarycoord(this.closestPoint,this.barycentric)===null)return 0;let g=this.inverseMass[e]??0,_=this.inverseMass[t]??0,v=this.inverseMass[n]??0,y=g*this.barycentric.x*this.barycentric.x+_*this.barycentric.y*this.barycentric.y+v*this.barycentric.z*this.barycentric.z;if(y<1e-6)return 0;let b=Math.sqrt(h);this.normal.copy(this.closestPoint).sub(r.center),b>1e-6?this.normal.multiplyScalar(1/b):(this.triangle.getNormal(this.normal),this.triangle.getMidpoint(this.centroid),this.normal.dot(this.centroid.sub(r.center))<0&&this.normal.negate(),this.normal.lengthSq()<1e-6&&this.normal.set(0,1,0)),this.triangle.getMidpoint(this.centroid);let x=(Ho(this.closestPoint,r.center,l,c,this.normal,this.centroid)??l-b)/y;return this.applyCorrection(e,g*this.barycentric.x*x),this.applyCorrection(t,_*this.barycentric.y*x),this.applyCorrection(n,v*this.barycentric.z*x),1}getTrianglePenetration(e,t,n,r,i){let a=this.positions[e],o=this.positions[t],s=this.positions[n];return!a||!o||!s||!this.intersectsTriangleBounds(a,o,s,r,i)?0:(this.triangle.set(a,o,s),this.triangle.closestPointToPoint(r,this.closestPoint),Math.max(0,i-this.closestPoint.distanceTo(r)))}applyCorrection(e,t){if(t<=0)return;let n=this.positions[e],r=this.previous[e];if(!n||!r)return;n.addScaledVector(this.normal,t),r.addScaledVector(this.normal,t);let i=this.motion.copy(n).sub(r).dot(this.normal);i<0&&r.addScaledVector(this.normal,i)}updateBounds(){this.boundsMinimum.set(1/0,1/0,1/0),this.boundsMaximum.set(-1/0,-1/0,-1/0);for(let e=0;e<this.positions.length;e+=1){let t=this.positions[e],n=this.previous[e];t&&(this.boundsMinimum.min(t),this.boundsMaximum.max(t)),n&&(this.boundsMinimum.min(n),this.boundsMaximum.max(n))}}restoreSweptTriangle(e,t,n,r,i,a,o,s){if(this.previousTriangle.set(r,i,a),this.previousTriangle.closestPointToPoint(o,this.closestPoint),this.closestPoint.distanceToSquared(o)<s*s)return!1;let c=!1;for(let l=1;l<Go;l+=1){let u=l/Go;if(this.previousTriangle.set(this.normal.lerpVectors(r,this.positions[e],u),this.centroid.lerpVectors(i,this.positions[t],u),this.motion.lerpVectors(a,this.positions[n],u)),this.previousTriangle.closestPointToPoint(o,this.closestPoint),this.closestPoint.distanceToSquared(o)<s*s){c=!0;break}}if(!c)return!1;let l=!1;for(let r of[e,t,n]){if((this.inverseMass[r]??0)<=0)continue;let e=this.positions[r],t=this.previous[r];!e||!t||(e.copy(t),l=!0)}return l}intersectsBounds(e,t){return e.x+t>=this.boundsMinimum.x&&e.x-t<=this.boundsMaximum.x&&e.y+t>=this.boundsMinimum.y&&e.y-t<=this.boundsMaximum.y&&e.z+t>=this.boundsMinimum.z&&e.z-t<=this.boundsMaximum.z}intersectsTriangleBounds(e,t,n,r,i){return r.x+i>=Math.min(e.x,t.x,n.x)&&r.x-i<=Math.max(e.x,t.x,n.x)&&r.y+i>=Math.min(e.y,t.y,n.y)&&r.y-i<=Math.max(e.y,t.y,n.y)&&r.z+i>=Math.min(e.z,t.z,n.z)&&r.z-i<=Math.max(e.z,t.z,n.z)}intersectsSweptTriangleBounds(e,t,n,r,i,a,o,s){return o.x+s>=Math.min(e.x,t.x,n.x,r.x,i.x,a.x)&&o.x-s<=Math.max(e.x,t.x,n.x,r.x,i.x,a.x)&&o.y+s>=Math.min(e.y,t.y,n.y,r.y,i.y,a.y)&&o.y-s<=Math.max(e.y,t.y,n.y,r.y,i.y,a.y)&&o.z+s>=Math.min(e.z,t.z,n.z,r.z,i.z,a.z)&&o.z-s<=Math.max(e.z,t.z,n.z,r.z,i.z,a.z)}index(e,t){return t*this.columns+e}},Jo=1e-6,Yo=[{first:1/3,second:1/3,third:1/3},{first:1/2,second:1/2,third:0},{first:1/2,second:0,third:1/2},{first:0,second:1/2,third:1/2}],Xo=class{positions;previous;inverseMass;columns;rows;nearBoundary;sample=new I;bounds={minimum:0,maximum:0};constructor(e,t,n,r,i,a){this.positions=e,this.previous=t,this.inverseMass=n,this.columns=r,this.rows=i,this.nearBoundary=a}solve(){let e=0;for(let t=0;t<this.rows-1;t+=1)for(let n=0;n<this.columns-1;n+=1){let r=this.index(n,t),i=this.index(n,t+1);this.isNearBoundary(r,i,r+1)&&(e+=this.solveTriangle(r,i,r+1)),this.isNearBoundary(i,i+1,r+1)&&(e+=this.solveTriangle(i,i+1,r+1))}return e}getMaximumPenetration(){let e=0;for(let t=0;t<this.rows-1;t+=1)for(let n=0;n<this.columns-1;n+=1){let r=this.index(n,t),i=this.index(n,t+1);e=Math.max(e,this.getTrianglePenetration(r,i,r+1),this.getTrianglePenetration(i,i+1,r+1))}return e}solveTriangle(e,t,n){let r=this.positions[e],i=this.positions[t],a=this.positions[n];if(!r||!i||!a)return 0;let o=0;for(let s of Yo){let c=this.getSampleCorrection(r,i,a,s);if(Math.abs(c)<=Jo)continue;let l=this.inverseMass[e]??0,u=this.inverseMass[t]??0,d=this.inverseMass[n]??0,f=l*s.first*s.first+u*s.second*s.second+d*s.third*s.third;if(f<=Jo)continue;let p=c/f;this.applyCorrection(e,l*s.first*p),this.applyCorrection(t,u*s.second*p),this.applyCorrection(n,d*s.third*p),o+=1}return o}getTrianglePenetration(e,t,n){let r=this.positions[e],i=this.positions[t],a=this.positions[n];if(!r||!i||!a)return 0;let o=0;for(let e of Yo)o=Math.max(o,Math.abs(this.getSampleCorrection(r,i,a,e)));return o}getSampleCorrection(e,t,n,r){return this.sample.set(e.x*r.first+t.x*r.second+n.x*r.third,e.y*r.first+t.y*r.second+n.y*r.third,e.z*r.first+t.z*r.second+n.z*r.third),Tt(this.sample.y,this.sample.z,Uo,this.bounds),this.sample.x<this.bounds.minimum?this.bounds.minimum-this.sample.x:this.sample.x>this.bounds.maximum?this.bounds.maximum-this.sample.x:0}applyCorrection(e,t){if(Math.abs(t)<=Jo)return;let n=this.positions[e],r=this.previous[e];if(!n||!r)return;let i=Math.sign(t),a=(n.x-r.x)*i;n.x+=t,r.x+=t,a<0&&(r.x+=a*i)}index(e,t){return t*this.columns+e}isNearBoundary(e,t,n){return!this.nearBoundary||this.nearBoundary[e]===1||this.nearBoundary[t]===1||this.nearBoundary[n]===1}},Zo=J.lengthRange.max+2.2,Qo=.08,$o=.16,es=3,ts=3,ns=.015,rs=.03,is=.08,as=class{positions;previous;nearbyWorldColliders=[];activeWorldColliders=[];activeWorldSpheres=[];activeRocks=[];preparedBodyColliders=[];delta=new I;sweep=new I;sweepStart=new I;hitPoint=new I;contactNormal=new I;bodySideOrigin=new I;remainingMotion=new I;boundsMinimum=new I;boundsMaximum=new I;caveBounds={minimum:0,maximum:0};worldContactsLastStep=0;worldContactEvents=0;bodySolvePass=0;caveSolvePass=0;bodyFaceCollision;faceCollision;rockFaceCollision;caveFaceCollision;rockQuery=new Mo;rockCorrectionUsed;bodyCorrectionUsed;rockSweepResolved;caveFloor;caveCeilingHeight;caveMinimumX;caveMaximumX;caveNearBoundary;caveNearWall;constructor(e,t,n){this.positions=e,this.previous=t,this.rockCorrectionUsed=new Float32Array(n.length),this.bodyCorrectionUsed=new Float32Array(n.length),this.rockSweepResolved=new Uint8Array(n.length),this.caveFloor=new Float64Array(n.length),this.caveCeilingHeight=new Float64Array(n.length),this.caveMinimumX=new Float64Array(n.length),this.caveMaximumX=new Float64Array(n.length),this.caveNearBoundary=new Uint8Array(n.length),this.caveNearWall=new Uint8Array(n.length),this.bodyFaceCollision=new Eo(e,t,n,J.columns,J.rows),this.caveFaceCollision=new Xo(e,t,n,J.columns,J.rows,this.caveNearWall),this.faceCollision=new qo(e,t,n,J.columns,J.rows),this.rockFaceCollision=new Bo(e,t,n,J.columns,J.rows,Wo)}beginStep(e,t,n,r){this.worldContactsLastStep=0,this.bodySolvePass=0,this.caveSolvePass=0,this.prepareBodyColliders(n,r),this.bodySideOrigin.copy(e),this.bodyCorrectionUsed.fill(0),this.bodyFaceCollision.beginStep(),this.rockCorrectionUsed.fill(0),this.rockSweepResolved.fill(0),this.faceCollision.beginStep(),this.rockFaceCollision.beginStep(),this.nearbyWorldColliders.length=0;for(let n of t){let t=Zo+n.radius;n.center.distanceToSquared(e)<=t*t&&this.nearbyWorldColliders.push(n)}}solveBody(e,t){for(let e=J.columns;e<this.positions.length;e+=1){let n=this.positions[e],r=this.previous[e];if(!(!n||!r))for(let i of this.preparedBodyColliders){let a=e%J.columns/(J.columns-1)-.5,o=this.getCapsulePenetration(n,i,t,r,a);o<=0||(n.addScaledVector(this.contactNormal,o),r.addScaledVector(this.contactNormal,o),this.removeInwardMotion(n,r,this.contactNormal),this.bodyCorrectionUsed[e]=(this.bodyCorrectionUsed[e]??0)+o)}}this.bodySolvePass+=1,this.bodySolvePass>J.solverIterations-es&&this.bodyFaceCollision.solve(e,t,this.bodySideOrigin)}solveWorld(){this.updateActiveWorldColliders();for(let e=J.columns;e<this.positions.length;e+=1){let t=this.positions[e],n=this.previous[e];if(!(!t||!n))for(let r of this.activeWorldColliders)Co(r)?this.solveWorldRock(e,t,n,r):this.solveWorldSphere(t,n,r)}let e=this.faceCollision.solve(this.activeWorldSpheres)+this.rockFaceCollision.solve(this.activeRocks);this.worldContactsLastStep+=e,this.worldContactEvents+=e}solvePostCaveWorldContacts(){if(this.activeWorldSpheres.length===0&&this.activeRocks.length===0)return 0;this.rockFaceCollision.beginPass();let e=0;for(let t=J.columns;t<this.positions.length;t+=1){let n=this.positions[t],r=this.previous[t];if(!(!n||!r))for(let i of this.activeWorldColliders)(Co(i)?this.solveWorldRock(t,n,r,i,!0):this.solveWorldSphere(n,r,i))&&(e+=1)}let t=this.faceCollision.solve(this.activeWorldSpheres)+this.rockFaceCollision.solve(this.activeRocks);return this.worldContactsLastStep+=t,this.worldContactEvents+=t,e+t}solveCave(){this.caveSolvePass+=1;let e=this.caveSolvePass===1||this.caveSolvePass>=J.solverIterations;for(let t=J.columns;t<this.positions.length;t+=1){let n=this.positions[t],r=this.previous[t];if(!n||!r)continue;let i=e||this.caveNearBoundary[t]===1,a=G.clamp(n.z,Dt.endZ+.08,Dt.startZ-.08);a!==n.z&&this.applyAxisCorrection(n,r,`z`,a-n.z);let o=i?ft(n.x,n.z)+Uo:this.caveFloor[t]??0;i&&(this.caveFloor[t]=o),n.y<o&&this.applyAxisCorrection(n,r,`y`,o-n.y);let s=i?wt(n.z)+.12-Uo:this.caveCeilingHeight[t]??0;i&&(this.caveCeilingHeight[t]=s),n.y>s&&this.applyAxisCorrection(n,r,`y`,s-n.y),i&&(Tt(n.y,n.z,Uo,this.caveBounds),this.caveMinimumX[t]=this.caveBounds.minimum,this.caveMaximumX[t]=this.caveBounds.maximum);let c=G.clamp(n.x,this.caveMinimumX[t]??0,this.caveMaximumX[t]??0);c!==n.x&&this.applyAxisCorrection(n,r,`x`,c-n.x),i&&(this.caveNearWall[t]=+(n.x-this.caveMinimumX[t]<$o||this.caveMaximumX[t]-n.x<$o),this.caveNearBoundary[t]=+(n.y-o<$o||s-n.y<$o||this.caveNearWall[t]===1))}this.caveSolvePass>J.solverIterations-ts&&this.caveFaceCollision.solve()}getMaximumBodyPenetration(e,t){return this.getBodyPenetrationDiagnostics(e,t).maximum}getBodyPenetrationDiagnostics(e,t){this.prepareBodyColliders(e,t);let n=0;for(let e=0;e<this.positions.length;e+=1){let r=this.positions[e];if(r)for(let e of this.preparedBodyColliders)n=Math.max(n,this.getCapsulePenetration(r,e,t))}let r=this.bodyFaceCollision.getMaximumPenetration(e,t);return{point:n,face:r,maximum:Math.max(n,r)}}getMaximumEnvironmentPenetration(e){return this.getEnvironmentPenetrationDiagnostics(e).maximum}getEnvironmentPenetrationDiagnostics(e){let t=0,n=0,r=0,i=0,a=null,o=null,s=null,c=null,l=null,u=null,d=null;for(let f=J.columns;f<this.positions.length;f+=1){let p=this.positions[f];if(!p)continue;for(let r of e){let e=Co(r)?Wo-this.rockQuery.getSignedDistance(r,p,this.contactNormal):r.radius+Ko(r)-p.distanceTo(r.center);Co(r)?e>n&&(n=e,c=f,l=[p.x,p.y,p.z],u=[r.center.x,r.center.y,r.center.z],d=r.walkable):t=Math.max(t,e)}let m=ft(p.x,p.z)+Uo,h=m-p.y;h>r&&(r=h,a=f,o=[p.x,p.y,p.z],s=m),Tt(p.y,p.z,Uo,this.caveBounds),i=Math.max(i,this.caveBounds.minimum-p.x,p.x-this.caveBounds.maximum)}let f=this.faceCollision.getMaximumPenetration(e.filter(e=>!Co(e))),p=this.rockFaceCollision.getMaximumPenetrationDiagnostics(e.filter(Co)),m=p.maximum,h=this.caveFaceCollision.getMaximumPenetration();return{sphere:t,rock:n,floor:r,wall:i,sphereFace:f,rockFace:m,caveFace:h,maximum:Math.max(t,n,r,i,f,m,h),floorParticleIndex:a,floorPosition:o,floorHeight:s,rockParticleIndex:c,rockPosition:l,rockCenter:u,rockWalkable:d,rockFaceDetail:{triangle:p.triangle,positions:p.positions,previous:p.previous,rockCenter:p.rockCenter}}}getMaximumEnvironmentFacePenetration(e){return Math.max(this.faceCollision.getMaximumPenetration(e.filter(e=>!Co(e))),this.rockFaceCollision.getMaximumPenetration(e.filter(Co)),this.caveFaceCollision.getMaximumPenetration())}getClosestActiveRockSurfaceContact(e=this.activeRocks){let t=this.rockFaceCollision.getClosestSurfaceContact(e.filter(Co));if(!t)return null;let{center:n}=t.collider;return{distance:t.distance,center:[n.x,n.y,n.z]}}getDiagnostics(){return{lastStep:this.worldContactsLastStep,total:this.worldContactEvents}}getBodyCorrectionUsed(e){return(this.bodyCorrectionUsed[e]??0)+this.bodyFaceCollision.getCorrectionUsed(e)}getParticleRockCorrectionDiagnostics(e){return{pointCorrection:this.rockCorrectionUsed[e]??0,faceCorrection:this.rockFaceCollision.getCorrectionUsed(e),swept:this.rockSweepResolved[e]===1,bodyPointCorrection:this.bodyCorrectionUsed[e]??0,bodyFaceCorrection:this.bodyFaceCollision.getCorrectionUsed(e)}}getCapsulePenetration(e,t,n,r=e,i=0){if(e.y<t.minimumY||e.y>t.maximumY)return 0;let a=e.x-t.startX,o=e.y-t.startY,s=e.z-t.startZ,c=a*n.x+o*n.y+s*n.z,l=a-n.x*c,u=o-n.y*c,d=s-n.z*c,f=t.lateralLengthSquared>1e-6?G.clamp((l*t.lateralAxisX+u*t.lateralAxisY+d*t.lateralAxisZ)/t.lateralLengthSquared,0,1):0,p=t.startX+t.axisX*f,m=t.startY+t.axisY*f,h=t.startZ+t.axisZ*f,g=e.x-p,_=e.y-m,v=e.z-h,y=g*n.x+_*n.y+v*n.z,b=Math.max(0,g*g+_*_+v*v-y*y);if(b>=t.lateralRadius*t.lateralRadius)return 0;let x=b/(t.lateralRadius*t.lateralRadius),S=t.depthRadius*Math.sqrt(1-x),C=Math.max(0,S-y);if(this.contactNormal.copy(n),C<=0||y>=0)return C;if(y<=-t.depthRadius)return 0;let w=G.clamp(y/t.depthRadius,-1,0),T=t.lateralRadius*Math.sqrt(Math.max(0,1-w*w)),E=n.z,D=-n.x,O=(r.x-this.bodySideOrigin.x)*E+(r.z-this.bodySideOrigin.z)*D,k=Math.abs(i)>1e-6?i:O;if(Math.abs(k)>1e-6){let e=Math.sign(k);this.contactNormal.set(E*e,0,D*e)}else{let e=r.x-p,t=r.y-m,i=r.z-h,a=e*n.x+t*n.y+i*n.z;this.contactNormal.set(e-n.x*a,t-n.y*a,i-n.z*a),this.contactNormal.y=0,this.contactNormal.lengthSq()>1e-6?this.contactNormal.normalize():b>1e-6?this.contactNormal.set(g-n.x*y,_-n.y*y,v-n.z*y).normalize():this.contactNormal.set(E,0,D).normalize()}let ee=T-(g*this.contactNormal.x+_*this.contactNormal.y+v*this.contactNormal.z);return ee>0?ee:C}prepareBodyColliders(e,t){this.preparedBodyColliders.length=e.length;for(let n=0;n<e.length;n+=1){let r=e[n];if(!r)continue;let i=this.preparedBodyColliders[n]??{startX:0,startY:0,startZ:0,axisX:0,axisY:0,axisZ:0,lateralAxisX:0,lateralAxisY:0,lateralAxisZ:0,lateralLengthSquared:0,lateralRadius:0,depthRadius:0,minimumY:0,maximumY:0},a=r.end.x-r.start.x,o=r.end.y-r.start.y,s=r.end.z-r.start.z,c=a*t.x+o*t.y+s*t.z,l=a-t.x*c,u=o-t.y*c,d=s-t.z*c,f=r.radius+wo(r),p=To(r),m=Math.max(f,p);i.startX=r.start.x,i.startY=r.start.y,i.startZ=r.start.z,i.axisX=a,i.axisY=o,i.axisZ=s,i.lateralAxisX=l,i.lateralAxisY=u,i.lateralAxisZ=d,i.lateralLengthSquared=l*l+u*u+d*d,i.lateralRadius=f,i.depthRadius=p,Math.abs(t.y)<1e-4?(i.minimumY=Math.min(r.start.y,r.end.y)-m,i.maximumY=Math.max(r.start.y,r.end.y)+m):(i.minimumY=-1/0,i.maximumY=1/0),this.preparedBodyColliders[n]=i}}solveWorldSphere(e,t,n){let r=Ko(n),i=n.radius+r;this.delta.copy(e).sub(n.center);let a=this.delta.lengthSq();if(a<i*i){this.registerWorldContact();let o=Math.sqrt(a);o<1e-6?(this.contactNormal.copy(t).sub(n.center),this.contactNormal.lengthSq()<1e-6?this.contactNormal.set(0,1,0):this.contactNormal.normalize()):this.contactNormal.copy(this.delta).multiplyScalar(1/o);let s=i-o,c=Ho(e,n.center,i,r,this.contactNormal,t);return c!==null&&(s=c),e.addScaledVector(this.contactNormal,s),t.addScaledVector(this.contactNormal,s),this.removeInwardMotion(e,t,this.contactNormal),!0}this.sweep.copy(e).sub(t);let o=this.sweep.lengthSq();if(o<1e-7)return!1;this.sweepStart.copy(t).sub(n.center);let s=this.sweepStart.lengthSq()-i*i;if(s<=0)return!1;let c=this.sweepStart.dot(this.sweep);if(c>=0)return!1;let l=c*c-o*s;if(l<0)return!1;let u=(-c-Math.sqrt(l))/o;if(u<0||u>1)return!1;this.registerWorldContact(),this.hitPoint.copy(t).addScaledVector(this.sweep,u),this.contactNormal.copy(this.hitPoint).sub(n.center).normalize(),this.remainingMotion.copy(this.sweep).multiplyScalar(1-u);let d=this.remainingMotion.dot(this.contactNormal);return d<0&&this.remainingMotion.addScaledVector(this.contactNormal,-d),this.remainingMotion.multiplyScalar(.76),this.hitPoint.addScaledVector(this.contactNormal,.0015),t.copy(this.hitPoint),e.copy(this.hitPoint).add(this.remainingMotion),!0}solveWorldRock(e,t,n,r,i=!1){if(!this.rockQuery.intersectsExpandedBounds(r,n,t,.003))return!1;let a=this.rockQuery.getSignedDistance(r,n,this.delta);if(this.sweep.copy(t).sub(n),this.rockSweepResolved[e]===0&&this.sweep.lengthSq()<=is**2&&a>=.003){let i=this.rockQuery.sweep(r,n,t,Wo,this.contactNormal);if(i!==null){this.registerWorldContact(),this.rockSweepResolved[e]=1,this.hitPoint.copy(n).addScaledVector(this.sweep,i),this.redirectRockContactAlongFloor(this.hitPoint,r),this.remainingMotion.copy(this.sweep).multiplyScalar(1-i);let a=this.remainingMotion.dot(this.contactNormal);return a<0&&this.remainingMotion.addScaledVector(this.contactNormal,-a),this.remainingMotion.multiplyScalar(.76),this.hitPoint.addScaledVector(this.contactNormal,.001),n.copy(this.hitPoint),t.copy(this.hitPoint).add(this.remainingMotion),!0}}let o=this.rockQuery.getSignedDistance(r,t,this.contactNormal);if(o<.003){this.registerWorldContact();let a=Wo-o;this.redirectRockContactAlongFloor(t,r)&&(a=Math.min(a,r.radius*.5));let s=i?1/0:Math.max(0,(r.walkable?ns:rs)-(this.rockCorrectionUsed[e]??0));return a=Math.min(a,s),a<=0||(t.addScaledVector(this.contactNormal,a),n.addScaledVector(this.contactNormal,a),this.removeInwardMotion(t,n,this.contactNormal),this.rockCorrectionUsed[e]=(this.rockCorrectionUsed[e]??0)+a,!0)}return!1}redirectRockContactAlongFloor(e,t){let n=this.contactNormal.y<0&&e.y<=ft(e.x,e.z)+.006;return!Ao(t,e.y)&&!n?!1:(this.contactNormal.set(e.x-t.center.x,0,e.z-t.center.z),this.contactNormal.lengthSq()<1e-6?this.contactNormal.set(1,0,0):this.contactNormal.normalize(),!0)}applyAxisCorrection(e,t,n,r){let i=(e[n]-t[n])*Math.sign(r);e[n]+=r,t[n]+=r,i<0&&(t[n]+=i*Math.sign(r))}removeInwardMotion(e,t,n){let r=this.delta.copy(e).sub(t).dot(n);r<0&&t.addScaledVector(n,r)}registerWorldContact(){this.worldContactsLastStep+=1,this.worldContactEvents+=1}updateActiveWorldColliders(){this.boundsMinimum.set(1/0,1/0,1/0),this.boundsMaximum.set(-1/0,-1/0,-1/0);for(let e=0;e<this.positions.length;e+=1){let t=this.positions[e],n=this.previous[e];t&&(this.boundsMinimum.min(t),this.boundsMaximum.max(t)),n&&(this.boundsMinimum.min(n),this.boundsMaximum.max(n))}this.activeWorldColliders.length=0,this.activeWorldSpheres.length=0,this.activeRocks.length=0;for(let e of this.nearbyWorldColliders){if(Co(e)){let t=Wo+Qo;if(e.bounds.max.x+t<this.boundsMinimum.x||e.bounds.min.x-t>this.boundsMaximum.x||e.bounds.max.y+t<this.boundsMinimum.y||e.bounds.min.y-t>this.boundsMaximum.y||e.bounds.max.z+t<this.boundsMinimum.z||e.bounds.min.z-t>this.boundsMaximum.z)continue;this.activeWorldColliders.push(e),this.activeRocks.push(e);continue}let t=e.radius+Ko(e)+Qo;e.center.x+t<this.boundsMinimum.x||e.center.x-t>this.boundsMaximum.x||e.center.y+t<this.boundsMinimum.y||e.center.y-t>this.boundsMaximum.y||e.center.z+t<this.boundsMinimum.z||e.center.z-t>this.boundsMaximum.z||(this.activeWorldColliders.push(e),this.activeWorldSpheres.push(e))}}},os=[`prediction`,`constraints`,`selfCollision`,`foldGuard`,`bodyCollision`,`worldCollision`,`caveCollision`,`reconciliation`,`anchors`,`finalization`],ss=32;function cs(){return{prediction:0,constraints:0,selfCollision:0,foldGuard:0,bodyCollision:0,worldCollision:0,caveCollision:0,reconciliation:0,anchors:0,finalization:0}}var ls=class{sampleIntervalSteps;phaseTotals=cs();totalSteps=0;activeSteps=0;sampledActiveSteps=0;totalMilliseconds=0;sampling=!1;constructor(e=ss){if(this.sampleIntervalSteps=e,!Number.isInteger(e)||e<1)throw RangeError(`Cape profile sample interval must be a positive integer.`)}beginStep(e){return this.totalSteps+=1,e?(this.activeSteps+=1,this.sampling=(this.activeSteps-1)%this.sampleIntervalSteps==0,this.sampling):(this.sampling=!1,!1)}record(e,t){!this.sampling||!Number.isFinite(t)||(this.phaseTotals[e]+=Math.max(0,t))}endStep(e){this.sampling&&=(Number.isFinite(e)&&(this.totalMilliseconds+=Math.max(0,e)),this.sampledActiveSteps+=1,!1)}getDiagnostics(){let e=Math.max(1,this.sampledActiveSteps),t=cs();for(let n of os)t[n]=this.phaseTotals[n]/e;return{implementation:`cpu-pbd`,sampleIntervalSteps:this.sampleIntervalSteps,totalSteps:this.totalSteps,activeSteps:this.activeSteps,sampledActiveSteps:this.sampledActiveSteps,averageStepMilliseconds:this.totalMilliseconds/e,phases:t}}},us=.5,ds=.1,fs=.38,ps=.65,ms=.12,hs=.7;function gs(e,t,n=J.width){let r=G.clamp(t,0,1),i=G.smoothstep(r,0,ds),a=Math.max(e,us),o=G.lerp(e,a,i),s=r*r*(3-2*r);return G.lerp(o,n*1.16,s)}function _s(e,t){let n=G.clamp(e,0,1),r=1-Math.abs(G.clamp(t,-.5,.5))*2,i=.008+n*.1+(1-n)**2*r*.035,a=.009+n*.045+(1-n)**2*r*.035,o=1/(J.rows-1),s=3/(J.rows-1),c=G.smoothstep(n,o,s),l=Math.max(0,1-Math.abs(n-.15)/.16)*r*.028;return G.lerp(a,i,c)+l}var vs={length:J.lengthRange,width:J.widthRange,stiffness:{min:.1,max:1.5,step:.05},damping:{min:.5,max:1.8,step:.05},weight:{min:.5,max:1.5,step:.05}},ys=Object.freeze({length:J.length,width:J.width,stiffness:1,damping:1,weight:1});function bs(e,t){return typeof e==`number`&&Number.isFinite(e)?e:t}function xs(e={}){return{length:G.clamp(bs(e.length,ys.length),vs.length.min,vs.length.max),width:G.clamp(bs(e.width,ys.width),vs.width.min,vs.width.max),stiffness:G.clamp(bs(e.stiffness,ys.stiffness),vs.stiffness.min,vs.stiffness.max),damping:G.clamp(bs(e.damping,ys.damping),vs.damping.min,vs.damping.max),weight:G.clamp(bs(e.weight,ys.weight),vs.weight.min,vs.weight.max)}}var Ss=.022,Cs=.8,ws=class{columns;rows;constructor(e,t){this.columns=e,this.rows=t}solve(e,t,n){for(let r=1;r<this.rows;r+=1)for(let i=0;i<this.columns;i+=1){let a=(r-1)*this.columns+i,o=r*this.columns+i,s=e[a],c=e[o],l=t[a],u=t[o];if(!s||!c||!l||!u)continue;let d=c.y-s.y-Ss;if(d<=0)continue;let f=n[a]??0,p=n[o]??0,m=f+p;if(m<=0)continue;let h=d*Cs,g=h*f/m,_=h*p/m;s.y+=g,l.y+=g,c.y-=_,u.y-=_}}getMaximumUpwardFold(e){let t=0;for(let n=1;n<this.rows;n+=1)for(let r=0;r<this.columns;r+=1){let i=e[(n-1)*this.columns+r],a=e[n*this.columns+r];i&&a&&(t=Math.max(t,a.y-i.y))}return t}},Ts=.058,Es=.072,Ds=521,Os=class{columns;heads=new Int32Array(Ds);next;cellX;cellY;cellZ;delta=new I;correction=new I;constructor(e,t){this.columns=t,this.next=new Int16Array(e),this.cellX=new Int16Array(e),this.cellY=new Int16Array(e),this.cellZ=new Int16Array(e)}solve(e,t,n){this.rebuild(e);let r=Ts*Ts;for(let i=0;i<e.length;i+=1){let a=e[i],o=t[i];if(!a||!o)continue;let s=this.cellX[i]??0,c=this.cellY[i]??0,l=this.cellZ[i]??0;for(let u=-1;u<=1;u+=1)for(let d=-1;d<=1;d+=1)for(let f=-1;f<=1;f+=1){let p=s+u,m=c+d,h=l+f,g=this.heads[this.hash(p,m,h)]??-1;for(;g>=0;){if(g<i&&this.cellX[g]===p&&this.cellY[g]===m&&this.cellZ[g]===h&&!this.isTopologicalNeighbor(i,g)){let s=e[g],c=t[g];if(s&&c){this.delta.copy(a).sub(s);let e=this.delta.lengthSq();if(e<r){let t=Math.sqrt(e);t<1e-6?this.fallbackNormal(i,g):this.delta.multiplyScalar(1/t);let r=n[i]??0,l=n[g]??0,u=r+l;u>0&&(this.correction.copy(this.delta).multiplyScalar((Ts-t)/u),r>0&&(a.addScaledVector(this.correction,r),o.addScaledVector(this.correction,r)),l>0&&(s.addScaledVector(this.correction,-l),c.addScaledVector(this.correction,-l)))}}}g=this.next[g]??-1}}}}getMinimumSeparation(e){let t=1/0;for(let n=0;n<e.length;n+=1){let r=e[n];if(r)for(let i=0;i<n;i+=1){let a=e[i];!a||this.isTopologicalNeighbor(n,i)||(t=Math.min(t,r.distanceTo(a)))}}return t}rebuild(e){this.heads.fill(-1);for(let t=0;t<e.length;t+=1){let n=e[t];if(!n)continue;let r=Math.floor(n.x/Es),i=Math.floor(n.y/Es),a=Math.floor(n.z/Es);this.cellX[t]=r,this.cellY[t]=i,this.cellZ[t]=a;let o=this.hash(r,i,a);this.next[t]=this.heads[o]??-1,this.heads[o]=t}}isTopologicalNeighbor(e,t){let n=Math.floor(e/this.columns),r=Math.floor(t/this.columns),i=e%this.columns,a=t%this.columns;return Math.abs(n-r)<=2&&Math.abs(i-a)<=2}hash(e,t,n){return((Math.imul(e,73856093)^Math.imul(t,19349663)^Math.imul(n,83492791))>>>0)%Ds}fallbackNormal(e,t){let n=e*.754877666+t*.569840291;this.delta.set(Math.sin(n),Math.cos(n*1.37),Math.sin(n*.73+1.1)).normalize()}},ks=9.6,As=.55,js=.0025,Ms=.48,Ns=.18,Ps=.12,Fs=1.2,Is=.12,Ls=.001,Rs=5e-4,zs=.025,Bs=.08;function Vs(e){let t=ro(256,e);t.color.repeat.set(1,1),t.normal.repeat.set(1,1),t.roughness.repeat.set(1,1);let n=new le({map:t.color,normalMap:t.normal,normalScale:new U(.48,.48),roughnessMap:t.roughness,roughness:.78,metalness:.01,sheen:.92,sheenColor:new P(e.sheenColor),sheenRoughness:.72,clearcoat:.04,side:2,transparent:!1,depthWrite:!0});return n.name=e.materialName,n}var Hs=class{mesh;positions=[];previous=[];inverseMass;predictedVerticalDisplacement;constraints=[];positionAttribute;selfCollision;foldGuard;contactSolver;profiler=new ls;velocity=new I;airflow=new I;normal=new I;flutterDirection=new I;tangentAcross=new I;tangentDown=new I;correction=new I;delta=new I;anchorTarget=new I;anchorCenter=new I;rightAxis=new I;rowCenter=new I;drapeDelta=new I;horizontalOffset=new I;centerlineStart=new I;centerlineEnd=new I;centerlinePoint=new I;rowChordPoint=new I;rowCurl=new I;stepStart=[];opacity=1;settledSeconds=0;idleDrapeRecoverySeconds=0;sleeping=!1;maximumParticleMotion=0;maximumParticleVerticalMotion=0;maximumParticleMotionIndex=-1;maximumParticleMotionX=0;maximumParticleMotionY=0;maximumParticleMotionZ=0;maximumParticleVerticalMotionIndex=-1;maximumParticleVerticalDelta=0;ownsMaterial;settings;constructor(e,t={},n=Za,r={}){this.settings=xs(t);let i=J.columns*J.rows;this.inverseMass=new Float32Array(i),this.predictedVerticalDisplacement=new Float32Array(i),this.selfCollision=new Os(i,J.columns),this.foldGuard=new ws(J.columns,J.rows),this.contactSolver=new as(this.positions,this.previous,this.inverseMass),this.initializeParticles(e),this.positions.forEach(e=>this.stepStart.push(e.clone())),this.createConstraints();let a=r.renderResources!==!1,o=a?this.createGeometry():new K;this.positionAttribute=a?o.getAttribute(`position`):null;let s=r.material??(a?Vs(n):new le);this.ownsMaterial=!r.material,this.mesh=new N(o,s),this.mesh.name=`PBD cape`,this.mesh.castShadow=!0,this.mesh.receiveShadow=!0,this.mesh.frustumCulled=!1}step(e,t,n,r,i,a){let o=i.length(),s=this.profiler.beginStep(!this.sleeping||o>Bs),c=s?performance.now():0,l=c;this.captureStepStart();let u=Math.hypot(i.x,i.z);if(o>Bs?(this.settledSeconds=0,this.idleDrapeRecoverySeconds=0,this.sleeping=!1):this.idleDrapeRecoverySeconds+=e,this.pinAnchors(t),this.contactSolver.beginStep(this.anchorCenter,r,n,t.back),this.sleeping){if(this.measureStepMotion(),s){let e=performance.now();this.profiler.record(`prediction`,e-l),this.profiler.endStep(e-c)}return}let d=G.smoothstep(o,Bs,2.4),f=G.smoothstep(u,Y.walkSpeed*1.02,Y.runSpeed*.92),p=G.lerp(.28,1,f),m=G.lerp(.32,1.28,f);this.airflow.set(Math.sin(a*.47)*.38+Math.sin(a*1.91)*.16,.08+Math.sin(a*.71)*.05,.62+Math.cos(a*.31)*.24).multiplyScalar(G.lerp(.025,p,d)).addScaledVector(i,-m);let h=e*e;for(let t=1;t<J.rows;t+=1)for(let n=0;n<J.columns;n+=1){let r=this.index(n,t),i=this.positions[r],o=this.previous[r];if(!i||!o)continue;let s=yo*this.settings.damping;this.velocity.copy(i).sub(o).multiplyScalar(Math.exp(-s*e));let c=Math.hypot(this.velocity.x,this.velocity.z),l=ks*e;if(c>l){let e=l/c;this.velocity.x*=e,this.velocity.z*=e}this.velocity.y=G.clamp(this.velocity.y,-12*e,12*e),o.copy(i),this.estimateNormal(n,t);let u=this.airflow.dot(this.normal),f=Math.sin(a*4.3+t*.83+n*1.71)*.42,p=n/(J.columns-1)-.5,m=Math.sin(Math.PI*t/(J.rows-1))**2,g=.3+p*.4,_=Math.sin(a*3.4+t*.28)*g*m;i.add(this.velocity),i.y-=9.81*this.settings.weight*h,i.addScaledVector(this.normal,u*Math.abs(u)*.026*h),this.flutterDirection.copy(this.normal).setY(0),i.addScaledVector(this.flutterDirection,_*d*10*h),i.addScaledVector(this.airflow,(.048+f*.011)*h),this.predictedVerticalDisplacement[r]=i.y-o.y}if(s){let e=performance.now();this.profiler.record(`prediction`,e-l),l=e}for(let e=0;e<J.solverIterations;e+=1){for(let e of this.constraints)this.solveConstraint(e);if(s){let e=performance.now();this.profiler.record(`constraints`,e-l),l=e}if(this.selfCollision.solve(this.positions,this.previous,this.inverseMass),s){let e=performance.now();this.profiler.record(`selfCollision`,e-l),l=e}if(this.foldGuard.solve(this.positions,this.previous,this.inverseMass),this.solveRowSpanGuard(t),this.solveRowCurlGuard(t),s){let e=performance.now();this.profiler.record(`foldGuard`,e-l),l=e}if(e===0&&this.idleDrapeRecoverySeconds>Is&&this.getHemDrop()<Fs&&this.getMaximumLowerCapeHorizontalOffset()>Ps&&this.solveIdleDrapeRecovery(G.smoothstep(this.idleDrapeRecoverySeconds,Is,.47)),this.contactSolver.solveBody(n,t.back),s){let e=performance.now();this.profiler.record(`bodyCollision`,e-l),l=e}if(this.contactSolver.solveWorld(),s){let e=performance.now();this.profiler.record(`worldCollision`,e-l),l=e}if(this.contactSolver.solveCave(),s){let e=performance.now();this.profiler.record(`caveCollision`,e-l),l=e}if(e===J.solverIterations-1){this.contactSolver.solvePostCaveWorldContacts(),this.contactSolver.solveBody(n,t.back),this.contactSolver.solvePostCaveWorldContacts()>0&&(this.contactSolver.solveBody(n,t.back),this.contactSolver.solvePostCaveWorldContacts()),this.contactSolver.solveCave();for(let e=0;e<4&&(this.contactSolver.solveBody(n,t.back),this.contactSolver.solvePostCaveWorldContacts()!==0);e+=1);}if(s){let e=performance.now();this.profiler.record(`reconciliation`,e-l),l=e}if(this.pinAnchors(t),s){let e=performance.now();this.profiler.record(`anchors`,e-l),l=e}}this.reconcileBodyContactVelocity(),this.reconcileProjectionVerticalVelocity(this.contactSolver.getDiagnostics().lastStep>0||this.hasMaterialBodyContactCorrection()),this.measureStepMotion();let g=this.getMaximumLowerCapeHorizontalOffset()<Ns,_=o<=Bs&&this.getHemDrop()>.72&&this.getMinimumLowerCapeDrop()>Ms&&g&&this.contactSolver.getMaximumBodyPenetration(n,t.back)<Ls;if(_&&this.dampResidualMotion(.14),_&&this.maximumParticleMotion<js?this.settledSeconds+=e:this.settledSeconds=_?Math.max(0,this.settledSeconds-e*.2):0,this.settledSeconds>=As&&(this.sleeping=!0,this.positions.forEach((e,t)=>this.previous[t]?.copy(e))),this.guardAgainstInvalidState(t),s){let e=performance.now();this.profiler.record(`finalization`,e-l),this.profiler.endStep(e-c)}}syncGeometry(){if(!this.positionAttribute)return;let e=this.positionAttribute.array;this.positions.forEach((t,n)=>{e[n*3]=t.x,e[n*3+1]=t.y,e[n*3+2]=t.z}),this.positionAttribute.needsUpdate=!0,this.mesh.geometry.computeVertexNormals();let t=this.mesh.geometry.getAttribute(`normal`);t&&(t.needsUpdate=!0)}async refreshDiagnostics(){}overwriteStateFromGpu(e,t){let n=this.positions.length*4;if(e.length<n||t.length<n)throw RangeError(`GPU cape state is smaller than the simulation grid.`);this.positions.forEach((n,r)=>{let i=r*4;n.set(e[i]??0,e[i+1]??0,e[i+2]??0),this.previous[r]?.set(t[i]??0,t[i+1]??0,t[i+2]??0)})}copyPackedState(){let e=new Float32Array(this.positions.length*4),t=new Float32Array(this.previous.length*4);return this.positions.forEach((n,r)=>{let i=r*4;e[i]=n.x,e[i+1]=n.y,e[i+2]=n.z,e[i+3]=this.inverseMass[r]??0;let a=this.previous[r];t[i]=a?.x??n.x,t[i+1]=a?.y??n.y,t[i+2]=a?.z??n.z,t[i+3]=this.inverseMass[r]??0}),{positions:e,previous:t}}overwriteStateForHarness(e,t=e){this.overwriteStateFromGpu(e,t),this.positions.forEach((e,t)=>this.stepStart[t]?.copy(e)),this.settledSeconds=0,this.idleDrapeRecoverySeconds=0,this.sleeping=!1,this.maximumParticleMotion=0,this.maximumParticleVerticalMotion=0}synchronizeAnchorDiagnostics(e){this.anchorCenter.copy(e.left).add(e.right).multiplyScalar(.5)}reset(e){this.positions.length=0,this.previous.length=0,this.initializeParticles(e),this.pinAnchors(e),this.positions.forEach((e,t)=>{let n=this.stepStart[t];n?n.copy(e):this.stepStart.push(e.clone())}),this.settledSeconds=0,this.idleDrapeRecoverySeconds=0,this.sleeping=!1,this.maximumParticleMotion=0,this.maximumParticleVerticalMotion=0}updateSettings(e,t){let n=xs(e),r=n.length!==this.settings.length||n.width!==this.settings.width;this.settings=n,this.settledSeconds=0,this.idleDrapeRecoverySeconds=0,this.sleeping=!1,r&&(this.constraints.length=0,this.reset(t),this.createConstraints(),this.syncGeometry())}getSettings(){return{...this.settings}}setOpacity(e){let t=G.clamp(e,_t,1);Math.abs(t-this.opacity)<.002||(this.opacity=t)}dispose(){this.mesh.geometry.dispose(),this.ownsMaterial&&this.disposeMaterial()}disposeMaterial(){this.mesh.material.map?.dispose(),this.mesh.material.normalMap?.dispose(),this.mesh.material.roughnessMap?.dispose(),this.mesh.material.dispose()}getParticlePosition(e,t){let n=this.positions[this.index(e,t)];if(!n)throw RangeError(`Cape particle index is outside the simulation grid.`);return n.clone()}getMaximumStructuralError(){let e=0;for(let t of this.constraints){if(!t.structural)continue;let n=this.positions[t.first],r=this.positions[t.second];!n||!r||(e=Math.max(e,Math.abs(n.distanceTo(r)-t.restLength)))}return e}getMaximumBodyPenetration(e,t){return this.contactSolver.getMaximumBodyPenetration(e,t)}getBodyPenetrationDiagnostics(e,t){return this.contactSolver.getBodyPenetrationDiagnostics(e,t)}getMaximumEnvironmentPenetration(e){return this.contactSolver.getMaximumEnvironmentPenetration(e)}getEnvironmentPenetrationDiagnostics(e){return this.contactSolver.getEnvironmentPenetrationDiagnostics(e)}getMaximumEnvironmentFacePenetration(e){return this.contactSolver.getMaximumEnvironmentFacePenetration(e)}getMinimumSelfSeparation(){return this.selfCollision.getMinimumSeparation(this.positions)}getMaximumUpwardFold(){return this.foldGuard.getMaximumUpwardFold(this.positions)}getHemDrop(){let e=0;for(let t=0;t<J.columns;t+=1)e+=this.positions[this.index(t,J.rows-1)]?.y??this.anchorCenter.y;return this.anchorCenter.y-e/J.columns}getMinimumLowerCapeDrop(){let e=1/0,t=Math.floor(J.rows*.58);for(let n=t;n<J.rows;n+=1)for(let t=0;t<J.columns;t+=1){let r=this.positions[this.index(t,n)];r&&(e=Math.min(e,this.anchorCenter.y-r.y))}return e}getMaximumLowerCapeLateralOffset(e){this.rightAxis.copy(e.right).sub(e.left).normalize();let t=Math.floor(J.rows*.58),n=0;for(let e=t;e<J.rows;e+=1)this.getRowCenter(e,this.rowCenter),n=Math.max(n,Math.abs(this.drapeDelta.copy(this.rowCenter).sub(this.anchorCenter).dot(this.rightAxis)));return n}getMaximumLowerCapeHorizontalOffset(){let e=Math.floor(J.rows*.58),t=0;for(let n=e;n<J.rows;n+=1)this.getRowCenter(n,this.rowCenter),this.horizontalOffset.copy(this.rowCenter).sub(this.anchorCenter).setY(0),t=Math.max(t,this.horizontalOffset.length());return t}getAverageLowerCapeSpanRatio(e){this.rightAxis.copy(e.right).sub(e.left).normalize();let t=e.right.distanceTo(e.left),n=Math.floor(J.rows*.58),r=0,i=0;for(let e=n;e<J.rows;e+=1){let n=this.positions[this.index(0,e)],a=this.positions[this.index(J.columns-1,e)];if(!n||!a)continue;let o=gs(t,e/(J.rows-1),this.settings.width),s=Math.abs(this.drapeDelta.copy(a).sub(n).dot(this.rightAxis));r+=s/Math.max(1e-6,o),i+=1}return i>0?r/i:0}getCapeRowTwistRange(e){let t=e.right.distanceTo(e.left),n=1/0,r=-1/0;for(let i=1;i<J.rows;i+=1){let a=this.positions[this.index(0,i)],o=this.positions[this.index(J.columns-1,i)];if(!a||!o)continue;let s=gs(t,i/(J.rows-1),this.settings.width),c=this.drapeDelta.copy(o).sub(a).dot(e.back)/Math.max(1e-6,s);n=Math.min(n,c),r=Math.max(r,c)}return Number.isFinite(n)&&Number.isFinite(r)?r-n:0}getCapeCenterlineDeviation(){this.getRowCenter(0,this.centerlineStart),this.getRowCenter(J.rows-1,this.centerlineEnd);let e=0;for(let t=1;t<J.rows-1;t+=1){let n=t/(J.rows-1);this.getRowCenter(t,this.rowCenter),this.centerlinePoint.lerpVectors(this.centerlineStart,this.centerlineEnd,n),e=Math.max(e,this.rowCenter.distanceTo(this.centerlinePoint))}return e}getMaximumLowerCapeRowCurlRatio(e){let t=e.right.distanceTo(e.left),n=Math.floor(J.rows*.58),r=0;for(let e=n;e<J.rows;e+=1){let n=this.positions[this.index(0,e)],i=this.positions[this.index(J.columns-1,e)];if(!n||!i)continue;let a=gs(t,e/(J.rows-1),this.settings.width);for(let t=1;t<J.columns-1;t+=1){let o=this.positions[this.index(t,e)];o&&(this.rowChordPoint.lerpVectors(n,i,t/(J.columns-1)),r=Math.max(r,o.distanceTo(this.rowChordPoint)/Math.max(1e-6,a)))}}return r}getHemBackOffset(e){return this.getRowCenter(J.rows-1,this.rowCenter),this.drapeDelta.copy(this.rowCenter).sub(this.anchorCenter).dot(e.back)}getMinimumHemGroundClearance(){let e=1/0;for(let t=0;t<J.columns;t+=1){let n=this.positions[this.index(t,J.rows-1)];n&&(e=Math.min(e,n.y-ft(n.x,n.z)))}return e}getMaximumParticleMotion(){return this.maximumParticleMotion}getMaximumParticleVerticalMotion(){return this.maximumParticleVerticalMotion}getMaximumParticleMotionDiagnostics(){return{particleIndex:this.maximumParticleMotionIndex,displacement:[this.maximumParticleMotionX,this.maximumParticleMotionY,this.maximumParticleMotionZ],verticalParticleIndex:this.maximumParticleVerticalMotionIndex,verticalDelta:this.maximumParticleVerticalDelta,rockContact:this.contactSolver.getParticleRockCorrectionDiagnostics(this.maximumParticleMotionIndex)}}isSleeping(){return this.sleeping}getWorldContactDiagnostics(){return this.contactSolver.getDiagnostics()}getPerformanceDiagnostics(){return this.profiler.getDiagnostics()}getClosestActiveRockSurfaceContact(e){return this.contactSolver.getClosestActiveRockSurfaceContact(e)}initializeParticles(e){this.anchorCenter.copy(e.left).add(e.right).multiplyScalar(.5);let t=e.right.distanceTo(e.left),n=e.right.clone().sub(e.left).normalize(),r=e.left.clone().add(e.right).multiplyScalar(.5);for(let i=0;i<J.rows;i+=1){let a=i/(J.rows-1),o=gs(t,a,this.settings.width);for(let t=0;t<J.columns;t+=1){let s=t/(J.columns-1)-.5,c=r.clone().addScaledVector(n,s*o).addScaledVector(e.back,_s(a,s)).add(new I(0,-a*this.settings.length*(1-Math.abs(s)*.085),0));i===0&&this.setAnchorTarget(e,t/(J.columns-1),c),this.positions.push(c),this.previous.push(c.clone()),this.inverseMass[this.index(t,i)]=i===0?0:1}}}createConstraints(){for(let e of xo)this.addConstraint(e.firstColumn,e.firstRow,e.secondColumn,e.secondRow,e.stiffness,e.structural)}addConstraint(e,t,n,r,i,a){let o=this.index(e,t),s=this.index(n,r),c=this.positions[o],l=this.positions[s];!c||!l||this.constraints.push({first:o,second:s,restLength:c.distanceTo(l),stiffness:i,structural:a})}createGeometry(){let t=new Float32Array(this.positions.length*3),n=new Float32Array(this.positions.length*2),r=[];this.positions.forEach((e,r)=>{e.toArray(t,r*3);let i=r%J.columns,a=Math.floor(r/J.columns);n[r*2]=i/(J.columns-1),n[r*2+1]=1-a/(J.rows-1)});for(let e=0;e<J.rows-1;e+=1)for(let t=0;t<J.columns-1;t+=1){let n=this.index(t,e),i=this.index(t,e+1);r.push(n,i,n+1,i,i+1,n+1)}let i=new K,a=new He(t,3);return a.setUsage(e),i.setAttribute(`position`,a),i.setAttribute(`uv`,new He(n,2)),i.setIndex(r),i.computeVertexNormals(),i}pinAnchors(e){this.anchorCenter.copy(e.left).add(e.right).multiplyScalar(.5);for(let t=0;t<J.columns;t+=1){let n=this.index(t,0),r=this.positions[n],i=this.previous[n];!r||!i||(this.setAnchorTarget(e,t/(J.columns-1),this.anchorTarget),r.copy(this.anchorTarget),i.copy(this.anchorTarget))}}setAnchorTarget(e,t,n){let r=Math.sin(t*Math.PI);n.lerpVectors(e.left,e.right,t),n.y+=r*J.attachment.necklineRise,n.addScaledVector(e.back,r*J.attachment.necklineDepth)}reconcileBodyContactVelocity(){for(let e=J.columns;e<this.positions.length;e+=1){let t=this.contactSolver.getBodyCorrectionUsed(e);if(t<=Rs)continue;let n=this.positions[e],r=this.previous[e];if(!n||!r)continue;let i=G.smoothstep(t,Rs,zs);r.lerp(n,i)}}reconcileProjectionVerticalVelocity(e){for(let t=J.columns;t<this.positions.length;t+=1){let n=this.positions[t],r=this.previous[t];!n||!r||(r.y=So({predictedVerticalDisplacement:this.predictedVerticalDisplacement[t]??0,projectedPositionY:n.y,previousPositionY:r.y,hasMaterialContact:e}))}}hasMaterialBodyContactCorrection(){for(let e=J.columns;e<this.positions.length;e+=1)if(this.contactSolver.getBodyCorrectionUsed(e)>Rs)return!0;return!1}dampResidualMotion(e){for(let t=J.columns;t<this.positions.length;t+=1){let n=this.positions[t],r=this.previous[t];n&&r&&r.lerp(n,e)}}solveIdleDrapeRecovery(e){for(let t=1;t<J.rows;t+=1){if(this.getRowCenter(t,this.rowCenter),this.horizontalOffset.copy(this.rowCenter).sub(this.anchorCenter).setY(0),this.horizontalOffset.lengthSq()<1e-6)continue;let n=t/(J.rows-1);this.correction.copy(this.horizontalOffset).multiplyScalar(-.016*e*G.smoothstep(n,.05,1));for(let e=0;e<J.columns;e+=1){let n=this.index(e,t);this.positions[n]?.add(this.correction),this.previous[n]?.add(this.correction)}}}solveRowSpanGuard(e){this.rightAxis.copy(e.right).sub(e.left).normalize();let t=e.right.distanceTo(e.left);for(let e=1;e<J.rows;e+=1){let n=this.index(0,e),r=this.index(J.columns-1,e),i=this.positions[n],a=this.positions[r],o=this.previous[n],s=this.previous[r];if(!i||!a||!o||!s)continue;let c=gs(t,e/(J.rows-1),this.settings.width)*fs-this.delta.copy(a).sub(i).dot(this.rightAxis);c<=0||(this.correction.copy(this.rightAxis).multiplyScalar(c*ps*.5),i.sub(this.correction),a.add(this.correction),o.sub(this.correction),s.add(this.correction))}}solveRowCurlGuard(e){let t=e.right.distanceTo(e.left);for(let e=1;e<J.rows;e+=1){let n=this.positions[this.index(0,e)],r=this.positions[this.index(J.columns-1,e)];if(!n||!r)continue;let i=gs(t,e/(J.rows-1),this.settings.width)*ms;for(let t=1;t<J.columns-1;t+=1){let a=this.index(t,e),o=this.positions[a],s=this.previous[a];if(!o||!s)continue;this.rowChordPoint.lerpVectors(n,r,t/(J.columns-1)),this.rowCurl.copy(o).sub(this.rowChordPoint);let c=this.rowCurl.length();c<=i||c<1e-6||(this.rowCurl.multiplyScalar((c-i)/c*hs),o.sub(this.rowCurl),s.sub(this.rowCurl))}}}getRowCenter(e,t){t.set(0,0,0);for(let n=0;n<J.columns;n+=1){let r=this.positions[this.index(n,e)];r&&t.add(r)}return t.multiplyScalar(1/J.columns)}captureStepStart(){this.positions.forEach((e,t)=>{let n=this.stepStart[t];n?n.copy(e):this.stepStart.push(e.clone())})}measureStepMotion(){let e=0,t=0;this.maximumParticleMotionIndex=-1,this.maximumParticleVerticalMotionIndex=-1;for(let n=J.columns;n<this.positions.length;n+=1){let r=this.positions[n],i=this.stepStart[n];if(!r||!i)continue;let a=r.x-i.x,o=r.y-i.y,s=r.z-i.z,c=Math.hypot(a,o,s);c>e&&(e=c,this.maximumParticleMotionIndex=n,this.maximumParticleMotionX=a,this.maximumParticleMotionY=o,this.maximumParticleMotionZ=s),Math.abs(o)>t&&(t=Math.abs(o),this.maximumParticleVerticalMotionIndex=n,this.maximumParticleVerticalDelta=o)}this.maximumParticleMotion=e,this.maximumParticleVerticalMotion=t}solveConstraint(e){let t=this.positions[e.first],n=this.positions[e.second];if(!t||!n)return;this.delta.copy(n).sub(t);let r=this.delta.length();if(r<1e-6)return;let i=this.inverseMass[e.first]??0,a=this.inverseMass[e.second]??0,o=i+a;if(o===0)return;let s=Math.min(.999,e.stiffness*this.settings.stiffness);this.correction.copy(this.delta).multiplyScalar((r-e.restLength)/r*s),i>0&&t.addScaledVector(this.correction,i/o),a>0&&n.addScaledVector(this.correction,-a/o)}estimateNormal(e,t){let n=this.positions[this.index(Math.max(0,e-1),t)],r=this.positions[this.index(Math.min(J.columns-1,e+1),t)],i=this.positions[this.index(e,Math.max(0,t-1))],a=this.positions[this.index(e,Math.min(J.rows-1,t+1))];if(!n||!r||!i||!a){this.normal.set(0,0,1);return}this.tangentAcross.copy(r).sub(n),this.tangentDown.copy(a).sub(i),this.normal.crossVectors(this.tangentAcross,this.tangentDown).normalize()}guardAgainstInvalidState(e){this.positions.some(e=>!Number.isFinite(e.lengthSq())||e.distanceToSquared(this.anchorCenter)>25)&&this.reset(e)}index(e,t){return t*J.columns+e}};function Us(e){return[e.x,e.y,e.z]}function Ws(e){return{left:Us(e.left),right:Us(e.right),back:Us(e.back)}}function Gs(e){return e.map(e=>({start:Us(e.start),end:Us(e.end),radius:e.radius,depthRadius:e.depthRadius,name:e.name,clearance:e.clearance,faceSampleSpacing:e.faceSampleSpacing}))}function Ks(e){let t=new Float32Array(e.length*6);return e.forEach((e,n)=>{e.start.toArray(t,n*6),e.end.toArray(t,n*6+3)}),t}function qs(e){return e.map(e=>Co(e)?{shape:`convex-rock`,center:Us(e.center),radius:e.radius,walkable:e.walkable,kind:e.kind,boundsMin:Us(e.bounds.min),boundsMax:Us(e.bounds.max),faces:e.faces.map(e=>({a:Us(e.triangle.a),b:Us(e.triangle.b),c:Us(e.triangle.c),normal:Us(e.normal),planeConstant:e.planeConstant,boundsMin:Us(e.bounds.min),boundsMax:Us(e.bounds.max)}))}:{shape:`sphere`,center:Us(e.center),radius:e.radius,walkable:e.walkable,kind:e.kind})}function Js(){let e=Math.max(2,navigator.hardwareConcurrency||4);return Math.max(1,Math.min(10,e-2))}var Ys=class{serializedWorldColliders;maximumWorkers=Js();slots=[];registrations=new Map;drainWaiters=new Set;failure=null;disposed=!1;constructor(e){this.serializedWorldColliders=qs(e)}registerCape(e,t,n,r){if(this.disposed||this.failure||typeof Worker>`u`)return!1;this.unregisterCape(e);let i=this.slots.length<this.maximumWorkers?this.createSlot():this.leastLoadedSlot(),a={slot:i,revision:0,latestState:null};this.registrations.set(e,a),i.capeIds.add(e);let o=t.copyPackedState();return this.post(i.worker,{type:`add-cape`,capeId:e,revision:a.revision,anchors:Ws(n),bodyColliders:Gs(r),settings:t.getSettings(),positions:o.positions,previous:o.previous},[o.positions.buffer,o.previous.buffer]),!this.failure}updateCape(e,t,n){let r=this.registrations.get(e);if(!r||this.failure)return;r.revision+=1,r.latestState=null;let i=t.copyPackedState();this.post(r.slot.worker,{type:`update-cape`,capeId:e,revision:r.revision,anchors:Ws(n),settings:t.getSettings(),positions:i.positions,previous:i.previous},[i.positions.buffer,i.previous.buffer])}unregisterCape(e){let t=this.registrations.get(e);t&&(this.registrations.delete(e),t.slot.capeIds.delete(e),this.post(t.slot.worker,{type:`remove-cape`,capeId:e}))}enqueueStep(e,t,n){if(this.failure||this.disposed||this.registrations.size===0)return;let r=new Map(n.map(e=>[e.capeId,e]));for(let n of this.slots){let i=[...n.capeIds].flatMap(e=>{let t=r.get(e);return t?[{capeId:e,anchors:Ws(t.anchors),bodyColliderEndpoints:Ks(t.bodyColliders),characterVelocity:Us(t.characterVelocity)}]:[]});i.length>0&&n.pendingFrames.push({deltaTime:e,time:t,capes:i})}}flush(){this.failure||this.disposed||this.slots.forEach(e=>this.dispatch(e))}consumeLatestState(e){let t=this.registrations.get(e);if(!t)return null;let n=t.latestState;return t.latestState=null,n}isDrivingCape(e){return!this.failure&&this.registrations.has(e)}async synchronize(){this.flush(),!(this.failure||this.isDrained())&&await new Promise(e=>this.drainWaiters.add(e))}getDiagnostics(){return{active:!this.disposed&&!this.failure&&this.registrations.size>0,workers:this.slots.length,busyWorkers:this.slots.filter(e=>e.busy).length,queuedSteps:this.slots.reduce((e,t)=>e+t.pendingFrames.length,0),failure:this.failure}}dispose(){if(!this.disposed){this.disposed=!0;for(let e of this.slots)this.post(e.worker,{type:`dispose`}),e.worker.terminate();this.slots.length=0,this.registrations.clear(),this.resolveDrainWaiters()}}createSlot(){let e=new Worker(new URL(`/cape-physics/assets/CapePhysicsWorker-Bwnswkxd.js`,``+import.meta.url),{type:`module`,name:`cape-physics-${this.slots.length+1}`}),t={worker:e,capeIds:new Set,pendingFrames:[],busy:!1,nextRequestId:1};return e.onmessage=e=>{this.handleResponse(t,e.data)},e.onerror=e=>{e.preventDefault(),this.disable(`Cape worker failed: ${e.message||`unknown worker error`}`)},e.onmessageerror=()=>{this.disable(`Cape worker returned an unreadable message.`)},this.slots.push(t),this.post(e,{type:`initialize`,worldColliders:this.serializedWorldColliders}),t}leastLoadedSlot(){let e=[...this.slots].sort((e,t)=>e.capeIds.size-t.capeIds.size)[0];if(!e)throw Error(`Cape worker pool has no worker slots.`);return e}dispatch(e){if(e.busy||e.pendingFrames.length===0||this.failure)return;let t=e.pendingFrames.splice(0),n=t.flatMap(e=>e.capes.map(e=>e.bodyColliderEndpoints.buffer));e.busy=!0,this.post(e.worker,{type:`step-batch`,requestId:e.nextRequestId,frames:t},n),e.nextRequestId+=1}handleResponse(e,t){if(t.type===`failure`){this.disable(`Cape worker solver failed: ${t.message}`);return}e.busy=!1;for(let n of t.states){let t=this.registrations.get(n.capeId);!t||t.slot!==e||t.revision===n.revision&&(t.latestState={positions:n.positions,previous:n.previous})}this.dispatch(e),this.isDrained()&&this.resolveDrainWaiters()}post(e,t,n=[]){if(!(this.failure||this.disposed))try{e.postMessage(t,{transfer:n})}catch(e){this.disable(`Could not submit cape worker work: ${e instanceof Error?e.message:String(e)}`)}}disable(e){this.failure||(this.failure=e,console.error(e),this.slots.forEach(e=>e.worker.terminate()),this.resolveDrainWaiters())}isDrained(){return this.slots.every(e=>!e.busy&&e.pendingFrames.length===0)}resolveDrainWaiters(){this.drainWaiters.forEach(e=>e()),this.drainWaiters.clear()}},Xs=Object.freeze({min:0,max:10,step:1}),Zs=8,Qs=.61,$s=1.15,ec=Math.PI/2,tc=Math.PI*(3-Math.sqrt(5));function nc(e){return Number.isFinite(e)?G.clamp(Math.round(e),Xs.min,Xs.max):Xs.min}var rc=class{movement=new U;headingOffset;phaseOffset;constructor(e){this.headingOffset=e*tc,this.phaseOffset=e*Qs}update(e){let t=G.euclideanModulo(e+this.phaseOffset,Zs),n=Math.floor(t/2);if(t-n*2>=$s){this.movement.set(0,0);return}let r=this.headingOffset+n*ec;this.movement.set(Math.sin(r),Math.cos(r))}getMovement(){return this.movement}isRunning(){return!1}consumeJump(){return!1}},ic=class{rig;walkPhase=0;gaitBlend=0;gaitBob=0;runningBlend=0;airborneBlend=0;jumpPhase=0;constructor(e){this.rig=e}reset(){this.walkPhase=0,this.gaitBlend=0,this.gaitBob=0,this.runningBlend=0,this.airborneBlend=0,this.jumpPhase=0,this.rig.body.position.y=0,this.rig.body.rotation.set(0,0,0),this.rig.leftArm.rotation.x=-.08,this.rig.rightArm.rotation.x=-.08,this.rig.leftLeg.rotation.x=0,this.rig.rightLeg.rotation.x=0,this.rig.leftFoot.rotation.x=0,this.rig.rightFoot.rotation.x=0}update(e,t,n,r){let i=G.smoothstep(t,.04,Y.walkSpeed*.45);this.gaitBlend=gt(this.gaitBlend,i,i>this.gaitBlend?12:9,e);let a=this.gaitBlend;this.runningBlend=G.smoothstep(t,Y.walkSpeed*1.02,Y.runSpeed*.9),this.walkPhase+=e*G.lerp(6.4,10.8,this.runningBlend)*a,this.airborneBlend=gt(this.airborneBlend,+!n,n?14:22,e),n?this.airborneBlend<.02&&(this.jumpPhase=0):this.jumpPhase=G.clamp(.5-r/(Y.jumpSpeed*2),0,1);let o=Math.sin(this.walkPhase)*a,s=G.lerp(.55,.78,this.runningBlend),c=o*s,l=-o*s,u=G.lerp(.38,.58,this.runningBlend),d=-o*u-.08,f=o*u-.08,p=Math.sin(this.jumpPhase*Math.PI),m=G.smoothstep(this.jumpPhase,.62,1),h=Math.sin(this.jumpPhase*Math.PI*2)*.055,g=.16+p*.38-m*.24+h,_=.06+p*.26-m*.18-h,v=.28+p*.58-m*.16,y=-.16+p*.34+m*.18;this.rig.leftLeg.rotation.x=G.lerp(c,g,this.airborneBlend),this.rig.rightLeg.rotation.x=G.lerp(l,_,this.airborneBlend),this.rig.leftArm.rotation.x=G.lerp(d,v+h,this.airborneBlend),this.rig.rightArm.rotation.x=G.lerp(f,v-h,this.airborneBlend),this.rig.leftFoot.rotation.x=G.lerp(-o*.14,y+h,this.airborneBlend),this.rig.rightFoot.rotation.x=G.lerp(o*.14,y-h,this.airborneBlend),this.gaitBob=Math.abs(Math.sin(this.walkPhase*2))*G.lerp(.018,.046,this.runningBlend)*a*(1-this.airborneBlend),this.rig.body.position.y=this.gaitBob+Math.sin(this.jumpPhase*Math.PI)*.012*this.airborneBlend,this.rig.body.rotation.x=G.lerp(-this.runningBlend*a*.035,.025,this.airborneBlend),this.rig.body.rotation.z=-o*G.lerp(.014,.024,this.runningBlend)*(1-this.airborneBlend)}getDiagnostics(){return{bob:this.gaitBob,runningBlend:this.runningBlend,airborneBlend:this.airborneBlend,jumpPhase:this.jumpPhase,armAngles:[this.rig.leftArm.rotation.x,this.rig.rightArm.rotation.x],legAngles:[this.rig.leftLeg.rotation.x,this.rig.rightLeg.rotation.x],footAngles:[this.rig.leftFoot.rotation.x,this.rig.rightFoot.rotation.x]}}};function ac(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new K,l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let e in d.morphAttributes){if(!i.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;o[e]===void 0&&(o[e]=[]),o[e].push(d.morphAttributes[e])}if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=oc(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=oc(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}}return c}function oc(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let o=new t(a),s=new He(o,n,r),c=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=c/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);s.setComponent(t+e,i,n)}}else o.set(r.array,c);c+=r.count*n}return i!==void 0&&(s.gpuType=i),s}var sc=`Cape neckline seam`,cc=`Paired cape throat ties`,lc=[0,1.505,-.17];function uc(e,t){let n=G.clamp(e,0,1),r=Math.sin(n*Math.PI);return t.set(G.lerp(-J.attachment.halfWidth,J.attachment.halfWidth,n),J.attachment.height+r*J.attachment.necklineRise,J.attachment.depth+r*J.attachment.necklineDepth)}function dc(e,t){let n=new h;n.name=`Cape neck attachment`;let r=Array.from({length:J.columns},(e,t)=>uc(t/(J.columns-1),new I)),i=new Qe(r,!1,`centripetal`),a=new Be(i,28,.022,7,!1),o=new N(a,e);o.name=sc;let s=fc(-1),c=fc(1),l=ac([s,c]);if(s.dispose(),c.dispose(),!l)throw Error(`Unable to merge procedural cape throat ties.`);let u=new N(l,t);return u.name=cc,n.add(o,u),n}function fc(e){let[t,n,r]=lc,i=new Qe([new I(t+e*.006,n,r),new I(e*.065,1.52,-.045),new I(e*J.attachment.halfWidth,J.attachment.height,J.attachment.depth)],!1,`centripetal`);return new Be(i,10,.008,6,!1)}var pc=`Traveller face`,mc=`Fitted helmet shell and cheek guards`,hc=`Flush helmet brow and temple trim`;function gc(e,t,n){let r=new h;r.name=`Proportioned procedural head`;let i=vc([_c(new b(.155,20,14),new I(0,1.69,-.004),new I(.82,1.08,.88)),_c(new Me(.023,.055,7),new I(0,1.68,-.137),new I(1,1,1),new Fe(-Math.PI/2,0,0)),_c(new b(.024,8,6),new I(-.118,1.69,-.002),new I(.55,1,.72)),_c(new b(.024,8,6),new I(.118,1.69,-.002),new I(.55,1,.72))],`face`),a=new N(i,e);a.name=pc;let o=vc([_c(new b(.176,20,14,0,Math.PI*2,0,Math.PI*.47),new I(0,1.72,0),new I(.92,1,.96)),_c(new Re(.022,.115,4,8),new I(-.14,1.66,-.006),new I(1,1,1.2)),_c(new Re(.022,.115,4,8),new I(.14,1.66,-.006),new I(1,1,1.2)),_c(new b(.012,8,6),new I(-.045,1.705,-.143),new I(1.25,.68,.5)),_c(new b(.012,8,6),new I(.045,1.705,-.143),new I(1.25,.68,.5)),_c(new ve(.052,.007,.006),new I(0,1.635,-.137))],`helmet shell`),s=new N(o,t);s.name=mc;let c=vc([_c(new ve(.226,.018,.018),new I(0,1.744,-.166)),_c(new b(.022,8,6),new I(-.145,1.742,-.035),new I(.65,1,1)),_c(new b(.022,8,6),new I(.145,1.742,-.035),new I(.65,1,1))],`helmet trim`),l=new N(c,n);return l.name=hc,r.add(a,s,l),r}function _c(e,t,n=new I(1,1,1),r=new Fe){let i=new je().compose(t,new M().setFromEuler(r),n);return e.applyMatrix4(i),e}function vc(e,t){let n=ac(e,!1);if(e.forEach(e=>e.dispose()),!n)throw Error(`Unable to merge procedural ${t} geometry.`);return n.computeBoundingBox(),n.computeBoundingSphere(),n}var yc=16,bc=[{y:.95,halfWidth:.18,halfDepth:.13},{y:1.12,halfWidth:.19,halfDepth:.137},{y:1.34,halfWidth:.205,halfDepth:.145},{y:1.4,halfWidth:.218,halfDepth:.13},{y:1.46,halfWidth:.165,halfDepth:.105},{y:1.5,halfWidth:.085,halfDepth:.065}];function xc(){let e=[],t=[],n=[];for(let n of bc)for(let r=0;r<=yc;r+=1){let i=r/yc,a=i*Math.PI*2;e.push(Math.cos(a)*n.halfWidth,n.y,Math.sin(a)*n.halfDepth),t.push(i,(n.y-bc[0].y)/Cc())}for(let e=0;e<bc.length-1;e+=1){let t=e*17,r=(e+1)*17;for(let e=0;e<yc;e+=1){let i=t+e,a=r+e;n.push(i,a,i+1,i+1,a,a+1)}}Sc(e,t,n,0,!1),Sc(e,t,n,bc.length-1,!0);let r=new K;return r.setAttribute(`position`,new p(e,3)),r.setAttribute(`uv`,new p(t,2)),r.setIndex(n),r.computeVertexNormals(),r.computeBoundingBox(),r.computeBoundingSphere(),r}function Sc(e,t,n,r,i){let a=bc[r];if(!a)return;let o=e.length/3;e.push(0,a.y,0),t.push(.5,.5);let s=r*17;for(let e=0;e<yc;e+=1)i?n.push(o,s+e+1,s+e):n.push(o,s+e,s+e+1)}function Cc(){let e=bc[0],t=bc.at(-1);return e&&t?t.y-e.y:1}var wc=`Tapered torso armor`,Tc=`Fitted hip armor`,Ec=`Fitted leather waist strap`,Dc=`Visible skin neck`,Oc=`Fitted leather gorget`,kc=`Left fitted shoulder armor`,Ac=`Right fitted shoulder armor`;function jc(e){e.traverse(e=>{e instanceof N&&(e.castShadow=!0,e.receiveShadow=!0)})}var Mc=class{capePalette;root=new h;velocity=new I;rig=new h;leftArm=new h;rightArm=new h;leftLeg=new h;rightLeg=new h;leftFoot=new h;rightFoot=new h;leftCapeAnchor=new E;rightCapeAnchor=new E;leftAnchorWorld=new I;rightAnchorWorld=new I;backWorld=new I;capeAttachmentBounds=new Ne;capeAnchors={left:this.leftAnchorWorld,right:this.rightAnchorWorld,back:this.backWorld};capeColliderRig={shoulders:this.createCapeCollider(.095,`shoulders`,.008),upperTorso:this.createCapeCollider(.211,`upper torso`,.006,.07,.145),gorget:this.createCapeCollider(.109,`gorget`,.006,.03),hips:this.createCapeCollider(.198,`hips`,.008,.08),belt:this.createCapeCollider(.138,`belt strap`,.006,.04),leftArm:this.createCapeCollider(.095,`left arm`,.008,void 0,.075),rightArm:this.createCapeCollider(.095,`right arm`,.008,void 0,.075),leftThigh:this.createCapeCollider(.085,`left thigh`),leftKnee:this.createCapeCollider(.08,`left knee`),leftLowerLeg:this.createCapeCollider(.075,`left lower leg`),leftBoot:this.createCapeCollider(.095,`left boot`),rightThigh:this.createCapeCollider(.085,`right thigh`),rightKnee:this.createCapeCollider(.08,`right knee`),rightLowerLeg:this.createCapeCollider(.075,`right lower leg`),rightBoot:this.createCapeCollider(.095,`right boot`)};capeColliders=Object.values(this.capeColliderRig);animator=new ic({body:this.rig,leftArm:this.leftArm,rightArm:this.rightArm,leftLeg:this.leftLeg,rightLeg:this.rightLeg,leftFoot:this.leftFoot,rightFoot:this.rightFoot});materials=[];capeAttachment;opacity=1;constructor(e=Za){this.capePalette=e,this.root.name=`Procedural hero`,this.root.add(this.rig),this.buildBody(),jc(this.root)}updateAnimation(e,t,n=!0,r=0){this.animator.update(e,t,n,r)}resetAnimation(){this.animator.reset()}getCapeAnchors(){return this.root.updateMatrixWorld(!0),this.leftCapeAnchor.getWorldPosition(this.leftAnchorWorld),this.rightCapeAnchor.getWorldPosition(this.rightAnchorWorld),this.backWorld.set(0,0,1).applyQuaternion(this.root.quaternion).normalize(),this.capeAnchors}getCapeColliders(){let{shoulders:e,upperTorso:t,gorget:n,hips:r,belt:i,leftArm:a,rightArm:o,leftThigh:s,leftKnee:c,leftLowerLeg:l,leftBoot:u,rightThigh:d,rightKnee:f,rightLowerLeg:p,rightBoot:m}=this.capeColliderRig;return this.setWorldCapsule(e,this.rig,[-.195,1.45,-.0115],[.195,1.45,-.0115]),this.setWorldCapsule(t,this.rig,[0,1.33,0],[0,1.11,0]),this.setWorldCapsule(n,this.rig,[0,1.49,0],[0,1.49,0]),this.setWorldCapsule(r,this.rig,[0,1.01,-.068],[0,.77,-.068]),this.setWorldCapsule(i,this.rig,[-.054,1.01,0],[.054,1.01,0]),this.setWorldCapsule(a,this.leftArm,[0,-.02,0],[0,-.69,0]),this.setWorldCapsule(o,this.rightArm,[0,-.02,0],[0,-.69,0]),this.setWorldCapsule(s,this.leftLeg,[0,-.29,0],[0,-.29,0]),this.setWorldCapsule(c,this.leftLeg,[0,-.5,0],[0,-.5,0]),this.setWorldCapsule(l,this.leftLeg,[0,-.69,0],[0,-.69,0]),this.setWorldCapsule(u,this.leftFoot,[0,-.06,-.115],[0,-.06,-.005]),this.setWorldCapsule(d,this.rightLeg,[0,-.29,0],[0,-.29,0]),this.setWorldCapsule(f,this.rightLeg,[0,-.5,0],[0,-.5,0]),this.setWorldCapsule(p,this.rightLeg,[0,-.69,0],[0,-.69,0]),this.setWorldCapsule(m,this.rightFoot,[0,-.06,-.115],[0,-.06,-.005]),this.capeColliders}setOpacity(e){let t=G.clamp(e,_t,1);Math.abs(t-this.opacity)<.002||(this.opacity=t)}getOpacity(){return this.opacity}getAnimationDiagnostics(){return this.animator.getDiagnostics()}getCapeAttachmentDiagnostics(){let e=this.getCapeAnchors();this.capeAttachmentBounds.setFromObject(this.capeAttachment);let t=0;return this.capeAttachment.traverse(e=>{e instanceof N&&(t+=1)}),{meshes:t,maximumAnchorGap:Math.max(this.capeAttachmentBounds.distanceToPoint(e.left),this.capeAttachmentBounds.distanceToPoint(e.right))}}dispose(){let e=new Set;this.root.traverse(t=>{t instanceof N&&e.add(t.geometry)}),e.forEach(e=>e.dispose()),this.materials.forEach(e=>e.dispose())}buildBody(){let e=new le({color:2766909,roughness:.38,metalness:.62,clearcoat:.2,clearcoatRoughness:.34}),t=new f({color:1120540,roughness:.46,metalness:.78}),n=new f({color:3416089,roughness:.86,metalness:.02}),r=new f({color:11109967,roughness:.34,metalness:.72}),i=new f({color:2107434,roughness:.94,metalness:0}),a=new f({color:9395010,roughness:.84,metalness:0}),o=new le({color:this.capePalette.attachmentColor,roughness:.78,metalness:.01,sheen:.92,sheenColor:new P(this.capePalette.sheenColor),sheenRoughness:.72,side:2});this.materials.push(e,t,n,r,i,a,o);for(let e of this.materials)e.transparent=!1,e.depthWrite=!0;let s=new N(new Re(.18,.17,5,10),e);s.name=Tc,s.position.y=.87,s.scale.z=.72,this.rig.add(s);let c=new N(xc(),e);c.name=wc,this.rig.add(c);let l=new N(new st(.21,.178,.39,10,1,!1),t);l.position.set(0,1.255,-.064),l.scale.z=.69,this.rig.add(l);let u=new N(new st(.19,.19,.06,18,1,!0),n);u.name=Ec,u.position.y=1.01,u.scale.z=.72;let d=new N(new ve(.078,.064,.032),r);d.position.set(0,1.01,-.154),this.rig.add(u,d);let p=gc(a,t,r);p.position.y=.018;let m=new N(new st(.067,.077,.16,12),a);m.name=Dc,m.position.y=1.555;let h=new N(new Oe(.132,.019,6,20),n);h.name=Oc,h.rotation.x=Math.PI/2,h.position.y=1.49,h.scale.set(1,.68,.76);let g=new N(new b(.032,10,8),r);g.name=`Cape throat clasp`,g.position.fromArray(lc),g.scale.z=.45,this.rig.add(p,m,h,g),this.createArm(this.leftArm,-1,e,t,n),this.createArm(this.rightArm,1,e,t,n),this.createLeg(this.leftLeg,this.leftFoot,-1,i,t),this.createLeg(this.rightLeg,this.rightFoot,1,i,t),this.rig.add(this.leftArm,this.rightArm,this.leftLeg,this.rightLeg);let _=new b(.08,12,8,0,Math.PI*2,0,Math.PI*.62),v=new N(_,e);v.name=kc,v.position.set(-.195,1.445,0),v.scale.set(1.06,.76,1),v.rotation.z=.35;let y=v.clone();y.name=Ac,y.position.x=.195,y.rotation.z=-.35,this.rig.add(v,y),this.capeAttachment=dc(o,r),this.rig.add(this.capeAttachment),this.leftCapeAnchor.position.set(-J.attachment.halfWidth,J.attachment.height,J.attachment.depth),this.rightCapeAnchor.position.set(J.attachment.halfWidth,J.attachment.height,J.attachment.depth),this.rig.add(this.leftCapeAnchor,this.rightCapeAnchor)}createArm(e,t,n,r,i){e.position.set(t*.205,1.405,0),e.rotation.z=t*-.08;let a=new N(new st(.068,.06,.42,9),i);a.position.y=-.215;let o=new N(new st(.066,.05,.31,9),n);o.position.y=-.545;let s=new N(new b(.056,9,7),r);s.position.y=-.72,e.add(a,o,s)}createLeg(e,t,n,r,i){e.position.set(n*.095,.79,0);let a=new N(new st(.085,.074,.42,9),r);a.position.y=-.22;let o=new N(new st(.074,.056,.4,9),i);o.position.y=-.62;let s=new N(new ve(.13,.13,.25),i);t.position.y=-.8,s.position.set(0,-.06,-.06),t.add(s),e.add(a,o,t)}setWorldCapsule(e,t,n,r){t.localToWorld(e.start.set(...n)),t.localToWorld(e.end.set(...r))}createCapeCollider(e,t,n,r,i){return{start:new I,end:new I,radius:e,depthRadius:i,name:t,clearance:n,faceSampleSpacing:r}}},Nc=class{character;input;worldCollision;desiredVelocity=new I;cameraForward=new I;cameraRight=new I;running=!1;grounded=!0;verticalVelocity=0;landingImpactSpeed=0;turnRate=0;constructor(e,t,n){this.character=e,this.input=t,this.worldCollision=n}update(e,t){let n=this.input.getMovement();if(this.cameraForward.set(-Math.sin(t),0,-Math.cos(t)),this.cameraRight.set(Math.cos(t),0,-Math.sin(t)),this.desiredVelocity.set(0,0,0).addScaledVector(this.cameraRight,n.x).addScaledVector(this.cameraForward,n.y),this.running=this.desiredVelocity.lengthSq()>0&&this.input.isRunning(),this.desiredVelocity.lengthSq()>0){let e=this.running?Y.runSpeed:Y.walkSpeed;this.desiredVelocity.normalize().multiplyScalar(e)}let r=this.desiredVelocity.lengthSq()>0?Y.acceleration:Y.deceleration,i=1-Math.exp(-r*e);this.character.velocity.x=G.lerp(this.character.velocity.x,this.desiredVelocity.x,i),this.character.velocity.z=G.lerp(this.character.velocity.z,this.desiredVelocity.z,i),this.character.velocity.x*this.character.velocity.x+this.character.velocity.z*this.character.velocity.z<1e-4&&(this.character.velocity.x=0,this.character.velocity.z=0),this.input.consumeJump()&&this.grounded&&(this.verticalVelocity=Y.jumpSpeed,this.grounded=!1),this.grounded?this.verticalVelocity=0:this.verticalVelocity-=Y.gravity*e,this.character.velocity.y=this.verticalVelocity;let a=this.grounded,o=this.character.root.position.y;this.character.root.position.addScaledVector(this.character.velocity,e);let s=this.worldCollision.resolvePlayer(this.character.root.position,{previousY:o,velocityY:this.verticalVelocity,grounded:this.grounded});this.grounded=s.grounded,!a&&this.grounded&&this.verticalVelocity<0&&(this.landingImpactSpeed=-this.verticalVelocity),(s.grounded&&this.verticalVelocity<0||s.hitCeiling&&this.verticalVelocity>0)&&(this.verticalVelocity=0,this.character.velocity.y=0);let c=Math.hypot(this.character.velocity.x,this.character.velocity.z);if(c>.08){let t=Math.atan2(-this.character.velocity.x,-this.character.velocity.z),n=Math.atan2(Math.sin(t-this.character.root.rotation.y),Math.cos(t-this.character.root.rotation.y)),r=G.smoothstep(c,.08,Y.runSpeed),i=G.lerp(Y.walkTurnRate,Y.runTurnRate,r),a=G.clamp(n*Y.turnResponse,-i,i);this.turnRate=gt(this.turnRate,a,G.lerp(7,12,r),e);let o=G.clamp(this.turnRate*e,-Math.abs(n),Math.abs(n)),s=this.character.root.rotation.y+o;this.character.root.rotation.y=Math.atan2(Math.sin(s),Math.cos(s))}else this.turnRate=gt(this.turnRate,0,10,e);this.character.updateAnimation(e,c,this.grounded,this.verticalVelocity)}isRunning(){return this.running}isGrounded(){return this.grounded}consumeLandingImpact(){let e=this.landingImpactSpeed;return this.landingImpactSpeed=0,e}resetVerticalState(){this.grounded=!0,this.verticalVelocity=0,this.landingImpactSpeed=0,this.character.velocity.y=0}reset(){this.desiredVelocity.set(0,0,0),this.running=!1,this.grounded=!0,this.verticalVelocity=0,this.landingImpactSpeed=0,this.turnRate=0,this.character.velocity.set(0,0,0),this.character.resetAnimation()}},Pc=.16,Fc=.11,Ic=.13;function Lc(e,t){return Math.max(Math.abs(e[0]-t[0]),Math.abs(e[1]-t[1]),Math.abs(e[2]-t[2]),Math.abs(e[3]-t[3]))}async function Rc(e,t,n){let r=n.getCharacterOpacity(),i=t.getWorldDirection(new I),a=new S(Ic,Ic),o=new rt({color:2162544,side:2,toneMapped:!1}),s=new rt({color:13639935,side:2,toneMapped:!1}),c=zc(t,i,Pc,a,o,1,`Depth audit character-layer marker`),l=zc(t,i,Fc,a,s,0,`Depth audit world occluder`);e.add(c);try{n.setCharacterOpacity(0),n.render(0);let t=await n.readScreenCenterPixel();n.setCharacterOpacity(r),n.render(0);let i=await n.readScreenCenterPixel();e.add(l),n.setCharacterOpacity(0),n.render(0);let a=await n.readScreenCenterPixel();n.setCharacterOpacity(r),n.render(0);let o=await n.readScreenCenterPixel();return{visibleWorldPixel:t,visibleLayerPixel:i,occludedWorldPixel:a,occludedLayerPixel:o,visibleLayerDelta:Lc(t,i),occludedLayerDelta:Lc(a,o),depthComposite:n.getDepthCompositeDiagnostics()}}finally{e.remove(c,l),a.dispose(),o.dispose(),s.dispose(),n.setCharacterOpacity(r),n.render(0)}}function zc(e,t,n,r,i,a,o){let s=new N(r,i);return s.name=o,s.position.copy(e.position).addScaledVector(t,n),s.quaternion.copy(e.quaternion),s.layers.set(a),s.frustumCulled=!1,s.updateMatrixWorld(!0),s}var Bc=128,Vc=2;async function Hc(e){let t=new fe;t.background=new P(328965);let n=new ne(-2.2,2.2,2.2,-2.2,.1,20);n.position.set(4,5,6),n.lookAt(0,0,0),n.updateMatrixWorld(!0);let r=new f({color:12105912,roughness:1,metalness:0}),i=new N(new S(6,6),r);i.name=`Shadow layer probe receiver`,i.rotation.x=-Math.PI/2,i.receiveShadow=!0,i.layers.set(0);let a=new f({color:6316128,roughness:1}),o=new N(new ve(.8,1.2,.8),a);o.name=`Shadow layer probe caster`,o.position.y=.6,o.castShadow=!0,o.layers.set(1),oa(o,e instanceof Gi?`webgl`:`webgpu`);let s=new ze(16777215,.08),c=new k(16777215,3.4);c.position.set(-3,6,3),c.target.position.set(0,0,0),c.castShadow=!0,c.shadow.mapSize.set(512,512),c.shadow.camera.left=-4,c.shadow.camera.right=4,c.shadow.camera.top=4,c.shadow.camera.bottom=-4,c.shadow.camera.near=.1,c.shadow.camera.far=14,c.shadow.camera.layers.enable(1),c.shadow.bias=-2e-4,c.shadow.normalBias=.015,t.add(i,o,s,c,c.target),t.updateMatrixWorld(!0);let l=e instanceof Gi?new nt(Bc,Bc,{type:Ue,depthBuffer:!0,stencilBuffer:!1}):new R(Bc,Bc,{type:Ue,depthBuffer:!0,stencilBuffer:!1}),u=(e instanceof Gi,e.getRenderTarget()),d=e.shadowMap.enabled,p=e.getClearAlpha(),m=e.getClearColor(new P).clone(),h=new I(.5,.001,-.5),g=new I(-1.1,.001,.9);try{e.shadowMap.enabled=!0;let r=await Uc(e,t,n,l,h,g,!0),i=await Uc(e,t,n,l,h,g,!1);n.position.set(4,5,-6),n.lookAt(0,0,0),n.updateMatrixWorld(!0);let a=await Uc(e,t,n,l,h,g,!1);return{direct:r,isolated:i,secondAngle:a,contrastDelta:Math.abs(r.contrast-i.contrast),angleContrastDelta:Math.abs(i.contrast-a.contrast)}}finally{Kc(e,u),e.shadowMap.enabled=d,e.setClearColor(m,p),l.dispose(),i.geometry.dispose(),o.geometry.dispose(),r.dispose(),a.dispose(),c.dispose()}}async function Uc(e,t,n,r,i,a,o){n.layers.set(0),o&&n.layers.enable(1),Kc(e,r),e.setClearColor(328965,1),e.clear(!0,!0,!1),e.render(t,n);let s=await Wc(e,r,n,i),c=await Wc(e,r,n,a);return{shadowPixel:s,litPixel:c,contrast:qc(c)-qc(s)}}async function Wc(e,t,n,r){let i=r.clone().project(n),a=G.clamp(Math.round((i.x*.5+.5)*127),Vc,125),o=G.clamp(Gc(i.y,Bc,e.coordinateSystem),Vc,125),s=e instanceof Gi?await e.readRenderTargetPixelsAsync(t,a-Vc,o-Vc,5,5,new Uint8Array(100)):await e.readRenderTargetPixelsAsync(t,a-Vc,o-Vc,5,5),c=0,l=0,u=0,d=0;for(let e=0;e<s.length;e+=4)c+=s[e]??0,l+=s[e+1]??0,u+=s[e+2]??0,d+=s[e+3]??0;return[Math.round(c/25),Math.round(l/25),Math.round(u/25),Math.round(d/25)]}function Gc(e,t,n){let r=e*.5+.5,i=n===2001?1-r:r;return Math.round(i*(t-1))}function Kc(e,t){if(e instanceof Gi){e.setRenderTarget(t);return}e.setRenderTarget(t)}function qc(e){return e[0]*.2126+e[1]*.7152+e[2]*.0722}var Jc=class{root;bar;status;progress;estimateFrame=null;constructor(){this.root=Q(document.querySelector(`[data-loading]`),`Loading screen is missing.`),this.bar=Q(document.querySelector(`[data-loading-bar]`),`Loading bar is missing.`),this.status=Q(document.querySelector(`[data-loading-status]`),`Loading status is missing.`),this.progress=Q(document.querySelector(`[data-loading-progress]`),`Loading progress is missing.`)}async update(e,t){this.cancelEstimate();let n=Math.round(Math.max(0,Math.min(1,e))*100);this.bar.style.transitionDuration=`450ms`,this.bar.style.transitionTimingFunction=`ease`,this.bar.style.width=`${n}%`,this.status.textContent=t,this.progress.textContent=`${n}%`,performance.mark(`cape-loading-stage`,{detail:{progress:n/100,message:t}}),await new Promise(e=>requestAnimationFrame(()=>e()))}async beginLongStage(e,t,n,r=7e3){await this.update(e,n);let i=performance.now(),a=Math.max(0,Math.min(1,e)),o=Math.max(a,Math.min(1,t));this.bar.style.transitionDuration=`${r}ms`,this.bar.style.transitionTimingFunction=`cubic-bezier(0.16, 0.72, 0.25, 1)`,this.bar.style.width=`${(o*100).toFixed(1)}%`;let s=e=>{let t=Math.max(0,Math.min(1,(e-i)/Math.max(1,r))),n=1-(1-t)**3,c=a+(o-a)*n;this.progress.textContent=`${(c*100).toFixed(1)}%`,this.estimateFrame=t<1?requestAnimationFrame(s):null};this.estimateFrame=requestAnimationFrame(s),await new Promise(e=>requestAnimationFrame(()=>e()))}async reveal(){await this.update(1,`Enter the deep`),document.body.classList.add(`is-ready`)}fail(){this.cancelEstimate(),this.root.classList.add(`has-error`),this.status.textContent=`Graphics initialization failed — see console for details`}cancelEstimate(){this.estimateFrame!==null&&(cancelAnimationFrame(this.estimateFrame),this.estimateFrame=null)}},Yc=Object.freeze({...ys,lights:!0,shadows:!0,reflections:!0,bots:0}),Xc=[`length`,`width`,`stiffness`,`damping`,`weight`,`bots`],Zc=[`lights`,`shadows`,`reflections`],Qc=class{onChange;root;panel;toggle;resetButton;status;numericInputs=new Map;toggleInputs=new Map;outputElements=new Map;settings={...Yc};constructor(e){this.onChange=e,this.root=Q(document.querySelector(`[data-customization]`),`Customization panel is missing.`),this.panel=Q(this.root.querySelector(`[data-customization-panel]`),`Customization panel content is missing.`),this.toggle=Q(this.root.querySelector(`[data-customization-toggle]`),`Customization panel toggle is missing.`),this.resetButton=Q(this.root.querySelector(`[data-customization-reset]`),`Customization reset button is missing.`),this.status=Q(this.root.querySelector(`[data-customization-status]`),`Customization status is missing.`);for(let e of Xc){let t=Q(this.root.querySelector(`[data-customization-setting="${e}"]`),`Customization input ${e} is missing.`),n=Q(this.root.querySelector(`[data-customization-value="${e}"]`),`Customization output ${e} is missing.`),r=e===`bots`?Xs:vs[e];t.min=String(r.min),t.max=String(r.max),t.step=String(r.step),t.addEventListener(`input`,this.handleNumericInput),(e===`length`||e===`width`)&&t.addEventListener(`change`,this.handleDimensionCommit),this.numericInputs.set(e,t),this.outputElements.set(e,n)}for(let e of Zc){let t=Q(this.root.querySelector(`[data-customization-setting="${e}"]`),`Customization switch ${e} is missing.`);t.addEventListener(`change`,this.handleToggleInput),this.toggleInputs.set(e,t)}this.toggle.addEventListener(`click`,this.handlePanelToggle),this.resetButton.addEventListener(`click`,this.handleReset),this.syncControls();let t=window.matchMedia(`(max-width: 900px), (pointer: coarse)`).matches;this.setExpanded(!t)}getSettings(){return{...this.settings}}dispose(){this.numericInputs.forEach(e=>{e.removeEventListener(`input`,this.handleNumericInput),e.removeEventListener(`change`,this.handleDimensionCommit)}),this.toggleInputs.forEach(e=>{e.removeEventListener(`change`,this.handleToggleInput)}),this.toggle.removeEventListener(`click`,this.handlePanelToggle),this.resetButton.removeEventListener(`click`,this.handleReset)}handleNumericInput=e=>{let t=e.currentTarget,n=t.dataset.customizationSetting;if(n===`bots`){this.settings={...this.settings,bots:nc(t.valueAsNumber)},this.updateOutput(n),this.status.textContent=`Custom settings active`,this.emitChange();return}let r=xs({...this.settings,[n]:t.valueAsNumber});this.settings={...this.settings,...r},this.updateOutput(n),this.status.textContent=`Custom settings active`,this.emitChange()};handleDimensionCommit=()=>{this.emitChange(!0)};handleToggleInput=e=>{let t=e.currentTarget,n=t.dataset.customizationSetting;this.settings={...this.settings,[n]:t.checked},this.status.textContent=`Custom settings active`,this.emitChange()};handlePanelToggle=()=>{this.setExpanded(this.toggle.getAttribute(`aria-expanded`)!==`true`)};handleReset=()=>{this.settings={...Yc},this.syncControls(),this.status.textContent=`Defaults restored`,this.emitChange(!0)};emitChange(e=!1){this.onChange({...this.settings},e)}syncControls(){this.numericInputs.forEach((e,t)=>{e.value=String(this.settings[t]),this.updateOutput(t)}),this.toggleInputs.forEach((e,t)=>{e.checked=this.settings[t]})}updateOutput(e){let t=this.outputElements.get(e);if(!t)return;let n=this.settings[e];t.value=e===`bots`?n.toFixed(0):e===`length`||e===`width`?`${n.toFixed(2)} m`:`${n.toFixed(2)}×`}setExpanded(e){this.root.classList.toggle(`is-collapsed`,!e),this.toggle.setAttribute(`aria-expanded`,String(e)),this.toggle.setAttribute(`aria-label`,e?`Collapse cape customization`:`Expand cape customization`),this.panel.hidden=!e}},$c=class{environment;root;buttons;constructor(e,t,n={location:window.location}){this.environment=n,this.root=Q(document.querySelector(`[data-renderer-switch]`),`Renderer switch is missing.`),this.buttons=Array.from(this.root.querySelectorAll(`[data-renderer-option]`));let r=this.buttons.find(e=>e.dataset.rendererOption===`webgpu`);r&&!t&&(r.disabled=!0,r.title=`WebGPU is not available in this browser`),this.setActive(e,e);for(let e of this.buttons)e.addEventListener(`click`,this.handleSelection)}setActive(e,t){this.root.dataset.rendererBackend=e,this.root.dataset.rendererFallback=String(e!==t);for(let t of this.buttons){let n=t.dataset.rendererOption===e;t.classList.toggle(`is-active`,n),t.setAttribute(`aria-pressed`,String(n))}this.root.title=e===t?e===`webgpu`?`Experimental WebGPU renderer active; WebGL is recommended`:`WebGL renderer active (recommended)`:`WebGPU was requested but unavailable; WebGL is active`}dispose(){for(let e of this.buttons)e.removeEventListener(`click`,this.handleSelection)}handleSelection=e=>{let t=e.currentTarget,n=t.dataset.rendererOption;n!==`webgpu`&&n!==`webgl`||t.disabled||this.environment.location.replace(Ya(this.environment.location.href,n))}},el=`
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
`,tl=`
  varying float vAlpha;
  void main() {
    float distanceToCenter = length(gl_PointCoord - 0.5) * 2.0;
    float alpha = (1.0 - smoothstep(0.15, 1.0, distanceToCenter)) * vAlpha;
    gl_FragColor = vec4(vec3(0.52, 0.76, 0.7), alpha * 0.2);
  }
`,nl=class{points;material;constructor(){let e=new bt(53335),t=new Float32Array(1860),n=new Float32Array(620),r=new Float32Array(620);for(let i=0;i<620;i+=1){let a=e.range(Dt.endZ,Dt.startZ),o=yt(a)+e.range(-1,1)*St(a)*.83;t[i*3]=o,t[i*3+1]=e.range(.25,wt(a)*.92),t[i*3+2]=a,n[i]=e.range(0,Math.PI*2),r[i]=e.range(.45,1.15)}let i=new K;i.setAttribute(`position`,new He(t,3)),i.setAttribute(`aPhase`,new He(n,1)),i.setAttribute(`aSize`,new He(r,1)),this.material=new g({uniforms:{uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)}},vertexShader:el,fragmentShader:tl,transparent:!0,depthWrite:!1,blending:2}),this.points=new dt(i,this.material),this.points.name=`Suspended cave dust`,this.points.frustumCulled=!1}update(e){this.material.uniforms.uTime.value=e}resize(){this.material.uniforms.uPixelRatio.value=Math.min(window.devicePixelRatio,2)}};function rl(e){let t=new bt(e),n=[],r=[],i=[],a=Math.abs(e)%3,o=Array.from({length:10},()=>t.range(-.11,.11)),s=t.range(0,Math.PI*2),c=t.range(0,Math.PI*2),l=t.range(.1,.22),u=t.range(.08,.19),d=a===1?t.range(1.4,1.85):t.range(.76,1.28),f=e=>[(Math.sin(e*3.4+s)-Math.sin(s))*l*e+Math.sin(e*8.7+c)*.018*e,(Math.sin(e*2.8+c)-Math.sin(c))*u*e+Math.cos(e*7.3+s)*.016*e];for(let e=0;e<9;e+=1){let i=e/9,l=a===2?.58:.74,u=(1-i)**l,p=Math.exp(-(((i-.3)/.12)**2))*(a===0?.26:.13),m=Math.exp(-(((i-.58)/.09)**2))*(a===2?.22:.1),h=Math.exp(-(((i-.46)/.075)**2))*.1,g=1+Math.sin(i*17+s)*.105+Math.sin(i*31+c)*.045+t.range(-.055,.055),_=1+Math.exp(-i*8)*.3,v=Math.max(.025,.32*u*g*_*(1+p+m-h)),[y,b]=f(i),x=i*t.range(-.45,.45);for(let e=0;e<=10;e+=1){let t=e%10,a=e/10*Math.PI*2+x,c=1+(o[t]??0)+Math.sin(a*3+i*9+s)*.035;n.push(y+Math.cos(a)*v*d*c,-1.6*i,b+Math.sin(a)*v/d*c),r.push(e/10,i)}}for(let e=0;e<8;e+=1)for(let t=0;t<10;t+=1){let n=e*11+t,r=n+11;i.push(n,n+1,r,r,n+1,r+1)}let[m,h]=f(1),g=n.length/3;n.push(m,-1.6,h),r.push(.5,1);for(let e=0;e<10;e+=1)i.push(88+e,88+e+1,g);let _=n.length/3;n.push(0,0,0),r.push(.5,0);for(let e=0;e<10;e+=1)i.push(_,e+1,e);let v=new K;return v.setAttribute(`position`,new p(n,3)),v.setAttribute(`uv`,new p(r,2)),v.setIndex(i),v.computeVertexNormals(),v.computeBoundingSphere(),v}var il=.14,al=.012,ol=class{colliders=[];localVertex=new I;worldVertex=new I;sampleCenter=new I;addSpeleothem(e,t){let n=e.getAttribute(`position`);if(!n)throw Error(`Speleothem collision geometry has no positions.`);let r=[];for(let e=0;e<9;e+=1){let i=new I;for(let t=0;t<10;t+=1){let r=e*11+t;this.localVertex.fromBufferAttribute(n,r),i.add(this.localVertex)}i.multiplyScalar(1/10).applyMatrix4(t);let a=0;for(let r=0;r<10;r+=1){let o=e*11+r;this.worldVertex.fromBufferAttribute(n,o).applyMatrix4(t),a=Math.max(a,this.worldVertex.distanceTo(i))}r.push({center:i,radius:a})}let i=new I().fromBufferAttribute(n,99).applyMatrix4(t);r.push({center:i,radius:0}),this.addFormationSections(r)}addCollar(e,t){this.addSphere(e,.38*Math.max(t.x,t.z),!1,`formation`)}addRock(e,t,n=!0){this.colliders.push(jo(e,t,n))}addFormationSections(e){for(let t=0;t<e.length-1;t+=1){let n=e[t],r=e[t+1];if(!n||!r)continue;let i=n.center.distanceTo(r.center),a=Math.max(1,Math.ceil(i/il)),o=i/a*.5,s=Math.abs(r.radius-n.radius)/a*.5,c=Math.hypot(o,s)+al,l=t===0?0:1;for(let e=l;e<=a;e+=1){let t=e/a;this.sampleCenter.lerpVectors(n.center,r.center,t),this.addSphere(this.sampleCenter,G.lerp(n.radius,r.radius,t)+c,!1,`formation`)}}}addSphere(e,t,n,r){this.colliders.push({center:e.clone(),radius:t,walkable:n,kind:r})}},sl=.42,cl=Y.radius+.42,ll=.08;Y.radius*2+.25;var ul=[{size:`large`,z:3.1,lateralOffset:-.82,scale:[1.65,1.35,1.05],rotation:[.16,.48,-.1],embedDepth:.08},{size:`small`,z:1.2,lateralOffset:.44,scale:[.55,.48,.62],rotation:[-.08,1.12,.2],embedDepth:.035},{size:`large`,z:-.9,lateralOffset:.94,scale:[1.12,1.05,.78],rotation:[.24,2.08,-.14],embedDepth:.065},{size:`small`,z:-2.9,lateralOffset:-.4,scale:[.48,.38,.7],rotation:[.12,2.72,.08],embedDepth:.03},{size:`large`,z:-5,lateralOffset:-.98,scale:[1.38,1.08,1.48],rotation:[-.18,.86,.14],embedDepth:.075},{size:`small`,z:-6.8,lateralOffset:.5,scale:[.64,.46,.52],rotation:[.18,1.66,-.16],embedDepth:.035}];function dl(e){return yt(e.z)+e.lateralOffset}function fl(e){let t=St(e.z)-cl,n=sl*Math.max(...e.scale)+Y.radius+ll,r=t+e.lateralOffset-n,i=t-e.lateralOffset-n;return Math.max(r,i)}var pl=10,ml=-.2,hl=.07,gl=.3;function _l(){let e=[...vl(ml,1,0,0),...vl(hl,.78,.018,-.012),...vl(gl,.28,.034,-.022),new I(0,ml,0),new I(.034,gl,-.022)],t=[];for(let e=0;e<pl;e+=1){let n=(e+1)%pl,r=pl+e,i=pl+n,a=20+e,o=20+n;t.push([e,n,i],[e,i,r],[r,i,o],[r,o,a],[30,n,e],[31,a,o])}let n=e.reduce((e,t)=>e.add(t),new I).multiplyScalar(1/e.length),r=[],i=[],a=new I,o=new I,s=new I,c=new I;for(let l of t){let[t,u,d]=l,f=e[t],p=e[u],m=e[d];if(!(!f||!p||!m)){if(s.crossVectors(a.copy(p).sub(f),o.copy(m).sub(f)),c.copy(f).add(p).add(m).multiplyScalar(1/3),s.dot(c.sub(n))<0){let t=u;if(u=d,d=t,p=e[u],m=e[d],!p||!m)continue}for(let e of[f,p,m])r.push(e.x,e.y,e.z),i.push(.5+Math.atan2(e.z,e.x)/(Math.PI*2),G.inverseLerp(ml,gl,e.y))}}let l=new K;return l.setAttribute(`position`,new p(r,3)),l.setAttribute(`uv`,new p(i,2)),l.computeVertexNormals(),l.computeBoundingBox(),l.computeBoundingSphere(),l.name=`Deterministic grounded irregular rock`,l}function vl(e,t,n,r){return Array.from({length:pl},(i,a)=>{let o=a/pl*Math.PI*2,s=Math.cos(o),c=Math.sin(o);return new I((s*.44+c*.025)*t+n,e,(c*.36-s*.018)*t+r)})}var yl=class{group=new h;worldColliders;contactRocks;walls;floor;colliderBuilder=new ol;constructor(e){this.group.name=`Procedural cave`,this.walls=this.createWalls(e),this.floor=this.createFloor(e),this.group.add(this.walls,this.floor),this.createFormations(e),this.contactRocks=this.createRockScatter(e),this.worldColliders=this.colliderBuilder.colliders}createMaterial(e,t=!1){return new f({map:e.color,normalMap:e.normal,normalScale:new U(t?.72:1.05,t?.72:1.05),roughnessMap:e.roughness,roughness:t?.58:.91,metalness:t?.08:.015,color:t?6779246:8092531})}createWalls(e){let t=[],n=[],r=[],{segments:i,radialSegments:a,startZ:o,endZ:s}=Dt;for(let e=0;e<=i;e+=1){let r=e/i,c=G.lerp(o,s,r),l=yt(c),u=wt(c),d=u*.5-.25,f=u*.5+.45,p=St(c);for(let e=0;e<=a;e+=1){let i=e/a,o=i*Math.PI*2,s=vt(r*11.5,i*8,8,30767)-.5,u=Math.sin(c*.42+o*5)*.12,m=s*.72+u,h=Math.cos(o),g=Math.sin(o);t.push(l+h*(p+m),d+g*(f+m*.66),c),n.push(i*4,r*16)}}let c=a+1;for(let e=0;e<i;e+=1)for(let t=0;t<a;t+=1){let n=e*c+t,i=n+c;r.push(n,i,n+1,i,i+1,n+1)}let l=new K;l.setAttribute(`position`,new p(t,3)),l.setAttribute(`uv`,new p(n,2)),l.setIndex(r),l.computeVertexNormals(),this.stitchWallSeamNormals(l,i,a),l.computeBoundingSphere();let u=this.createMaterial(e);u.side=1,u.normalScale.set(-1.05,-1.05);let d=new N(l,u);return d.name=`Cave shell`,d.receiveShadow=!0,d}stitchWallSeamNormals(e,t,n){let r=e.getAttribute(`normal`),i=new I,a=new I,o=new I,s=n+1;for(let e=0;e<=t;e+=1){let t=e*s,c=t+n;i.fromBufferAttribute(r,t),a.fromBufferAttribute(r,c),o.copy(i).add(a).normalize(),r.setXYZ(t,o.x,o.y,o.z),r.setXYZ(c,o.x,o.y,o.z)}r.needsUpdate=!0}createFloor(e){let t=[],n=[],r=[];for(let e=0;e<=180;e+=1){let r=e/180,i=G.lerp(Dt.startZ,Dt.endZ,r),a=yt(i),o=St(i)*1.015;for(let e=0;e<=36;e+=1){let s=e/36,c=a+(s*2-1)*o;t.push(c,mt(c,i),i),n.push(s*5,r*18)}}for(let e=0;e<180;e+=1)for(let t=0;t<36;t+=1){let n=e*37+t,i=n+37;r.push(n,n+1,i,i,n+1,i+1)}let i=new K;i.setAttribute(`position`,new p(t,3)),i.setAttribute(`uv`,new p(n,2)),i.setIndex(r),i.computeVertexNormals(),i.computeBoundingSphere();let a=new N(i,this.createMaterial(e,!0));return a.name=`Wet cave floor`,a.receiveShadow=!0,a}createFormations(e){let t=new bt(379422),n=this.createMaterial(e,!0);n.color.multiplyScalar(.66),n.roughness=.86,n.metalness=.015;let r=[20897,20898,20899].map(rl),i=r.map((e,t)=>{let r=new me(e,n,18);return r.name=`Stalactites organic variant ${t+1}`,r.castShadow=!0,r.receiveShadow=!0,r}),a=new Le(.38,1),o=new me(a,n,82);o.name=`Flowstone formation collars`,o.castShadow=!0,o.receiveShadow=!0;let s=new je,c=new M,l=new I,u=new I,d=new I,f=new I;for(let e=0;e<54;e+=1){let n=t.range(Dt.endZ+2,Dt.startZ-2),a=t.range(-.92,.92),p=yt(n)+St(n)*a;u.set(p,wt(n)-Math.abs(a)*.65,n),c.setFromEuler(new Fe(t.range(-.12,.12),t.range(0,Math.PI),t.range(-.12,.12))),l.set(t.range(.55,1.6),t.range(.55,2.25),t.range(.55,1.6)),s.compose(u,c,l);let m=e%i.length;this.colliderBuilder.addSpeleothem(r[m],s),i[m]?.setMatrixAt(Math.floor(e/i.length),s),d.copy(u),d.y-=.08,f.set(l.x*t.range(.9,1.35),t.range(.2,.38),l.z*t.range(.9,1.35)),s.compose(d,c,f),o.setMatrixAt(e,s),this.colliderBuilder.addCollar(d,f)}i.forEach(e=>{e.instanceMatrix.needsUpdate=!0,this.group.add(e)});let p=[10,9,9],m=r.map(e=>{let t=e.clone();return t.rotateZ(Math.PI),t}),h=m.map((e,t)=>{let r=new me(e,n,p[t]??0);return r.name=`Stalagmites organic variant ${t+1}`,r.castShadow=!0,r.receiveShadow=!0,r}),g=[0,0,0];for(let e=0;e<28;e+=1){let n=t.range(Dt.endZ+2,Dt.startZ-2),r=t.next()>.5?1:-1,i=yt(n)+r*St(n)*t.range(.7,.94);u.set(i,mt(i,n),n),c.setFromEuler(new Fe(t.range(-.08,.08),t.range(0,Math.PI),t.range(-.08,.08))),l.set(t.range(.55,1.35),t.range(.45,1.75),t.range(.55,1.35)),s.compose(u,c,l);let a=e%h.length;this.colliderBuilder.addSpeleothem(m[a],s);let p=g[a]??0;h[a]?.setMatrixAt(p,s),g[a]=p+1,d.copy(u),d.y+=.06,f.set(l.x*t.range(.86,1.25),t.range(.18,.34),l.z*t.range(.86,1.25)),s.compose(d,c,f),o.setMatrixAt(54+e,s),this.colliderBuilder.addCollar(d,f)}h.forEach(e=>{e.instanceMatrix.needsUpdate=!0,this.group.add(e)}),o.instanceMatrix.needsUpdate=!0,this.group.add(o)}createRockScatter(e){let t=new bt(11541991),n=_l(),r=this.createMaterial(e,!0);r.color.multiplyScalar(.66),r.roughness=.84,r.metalness=.02;let i=new me(n,r,72+ul.length);i.name=`Rock scatter and cape contact course`,i.castShadow=!0,i.receiveShadow=!0;let a=new je,o=new M,s=new I,c=new I,l=new I,u=n.getAttribute(`position`),d=[];for(let e=0;e<ul.length;e+=1){let t=ul[e];if(!t)continue;let r=dl(t);o.setFromEuler(new Fe(...t.rotation)),s.fromArray(t.scale),c.set(r,0,t.z),a.compose(c,o,s);let f=1/0;for(let e=0;e<u.count;e+=1)l.fromBufferAttribute(u,e).applyMatrix4(a),f=Math.min(f,l.y);c.y=mt(r,t.z)-f-t.embedDepth,a.compose(c,o,s),i.setMatrixAt(e,a);let p=t.size===`small`;this.colliderBuilder.addRock(n,a,p),d.push({size:t.size,walkable:p,position:[c.x,c.y,c.z],lateralOffset:t.lateralOffset,scale:t.scale,openLaneWidth:fl(t)})}for(let e=0;e<72;e+=1){let r=t.range(Dt.endZ+1.5,Dt.startZ-1.5),d=t.next()>.5?1:-1,f=yt(r)+d*St(r)*t.range(.64,.94);c.set(f,0,r),o.setFromEuler(new Fe(t.range(-.2,.2),t.range(0,Math.PI*2),t.range(-.2,.2))),s.set(t.range(.25,1.25),t.range(.18,.72),t.range(.35,1.4)),a.compose(c,o,s);let p=1/0;for(let e=0;e<u.count;e+=1)l.fromBufferAttribute(u,e).applyMatrix4(a),p=Math.min(p,l.y);c.y=mt(f,r)-p-t.range(.025,.065),a.compose(c,o,s),i.setMatrixAt(ul.length+e,a),this.colliderBuilder.addRock(n,a)}return i.instanceMatrix.needsUpdate=!0,this.group.add(i),d}},bl=class{lights;selectedIndices;selectedDistances;constructor(e,t){this.lights=Array.from({length:e},(e,n)=>{let r=new ie(16777215,0,1,2);return r.name=`${t} pooled light ${n+1}`,r}),this.selectedIndices=new Int32Array(e),this.selectedDistances=new Float64Array(e)}update(e,t){this.selectedIndices.fill(-1),this.selectedDistances.fill(1/0);for(let n=0;n<t.length;n+=1){let r=t[n];if(!r)continue;let i=r.position.distanceToSquared(e);for(let e=0;e<this.lights.length;e+=1)if(!(i>=(this.selectedDistances[e]??1/0))){for(let t=this.lights.length-1;t>e;--t)this.selectedIndices[t]=this.selectedIndices[t-1]??-1,this.selectedDistances[t]=this.selectedDistances[t-1]??1/0;this.selectedIndices[e]=n,this.selectedDistances[e]=i;break}}this.lights.forEach((n,r)=>{let i=this.selectedIndices[r]??-1,a=i>=0?t[i]:void 0;if(!a){n.position.copy(e),n.intensity=0;return}let o=Math.sqrt(this.selectedDistances[r]??0),s=a.range*.68,c=Math.max(.001,a.range-s),l=G.clamp((o-s)/c,0,1),u=1-l*l*(3-2*l);n.position.copy(a.position),n.color.copy(a.color),n.distance=a.range,n.intensity=a.intensity*u})}getDiagnostics(){return{lights:this.lights.length,visibleLights:this.lights.filter(e=>e.visible).length,activeLights:this.lights.filter(e=>e.intensity>.001).length}}},xl=class{group=new h;worldColliders=[];clusters=[];lightPool=new bl(2,`Mineral`);constructor(){this.group.name=`Glowing mineral veins`,[{z:1,side:-1,color:4386769},{z:-22,side:1,color:7393279},{z:-43,side:-1,color:10586111},{z:-61,side:1,color:4843202}].forEach((e,t)=>this.createCluster(e.z,e.side,e.color,t)),this.group.add(...this.lightPool.lights)}update(e,t){for(let t of this.clusters)t.intensity=8.5+Math.sin(e*1.3+t.phase)*.65;this.lightPool.update(t,this.clusters)}getClusterPositions(){return this.clusters.map(e=>e.root.toArray())}getLightDiagnostics(){return this.lightPool.getDiagnostics()}createCluster(e,t,n,r){let i=new bt(49833+r*991),a=yt(e)+t*(St(e)-.48),o=new I(a,i.range(2.1,4.2),e),s=new P(n),c=new f({color:s,emissive:s,emissiveIntensity:5.5,roughness:.23,metalness:.34}),l=new rt({color:s,transparent:!0,opacity:.12,blending:2,depthWrite:!1,side:2}),u=[],d=[];for(let n=0;n<8;n+=1){let a=[o.clone()],s=i.range(-1,1),c=i.range(-1,1),l=i.range(1.1,3),f=i.integer(3,5);for(let i=1;i<=f;i+=1){let u=i/f,d=e+c*l*u+Math.sin(u*7+n)*.14,p=o.y+s*l*u+Math.sin(u*5+r)*.18,m=yt(d)+t*(St(d)-.46-Math.sin(u*Math.PI)*.08);a.push(new I(m,p,d))}let p=new Qe(a),m=i.range(.018,.045)*(1-n/8*.38);u.push(new Be(p,18,m,5,!1)),d.push(new Be(p,14,m*3.2,5,!1))}let p=ac(u,!1),m=ac(d,!1);if(!p||!m)throw Error(`Unable to merge procedural mineral branches.`);let h=new N(p,c);h.name=`Mineral vein core ${r}`;let g=new N(m,l);g.name=`Mineral vein glow ${r}`,this.group.add(g,h),u.forEach(e=>e.dispose()),d.forEach(e=>e.dispose());let _=new O(.11,0),v=new me(_,c,18),y=new je,b=new M,x=new I,S=new I;for(let n=0;n<v.count;n+=1)S.set(a-t*i.range(0,.14),o.y+i.range(-1.8,1.8),e+i.range(-2.1,2.1)),b.setFromEuler(new Fe(i.range(0,Math.PI),i.range(0,Math.PI),i.range(0,Math.PI))),x.set(i.range(.45,1.6),i.range(.8,2.9),i.range(.45,1.2)),y.compose(S,b,x),v.setMatrixAt(n,y),this.worldColliders.push({center:S.clone(),radius:G.clamp(.11*Math.max(x.x,x.y,x.z),.07,.34),walkable:!1,kind:`mineral`});v.instanceMatrix.needsUpdate=!0,this.group.add(v);let C=o.clone().add(new I(-t*.65,0,0));this.clusters.push({root:o,position:C,color:s,intensity:9,range:7.5,phase:i.range(0,Math.PI*2)})}},Sl=`
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
`,Cl=`
  varying float vHeight;
  void main() {
    float edge = smoothstep(0.0, 0.32, vHeight) * (1.0 - smoothstep(0.7, 1.0, vHeight));
    vec3 color = mix(vec3(5.0, 0.42, 0.035), vec3(1.4, 0.07, 0.01), vHeight);
    gl_FragColor = vec4(color, edge * 0.92);
  }
`,wl=class{group=new h;worldColliders=[];torches=[];lightPool=new bl(3,`Torch`);shadowLight;activeShadowTorch=-1;constructor(){this.group.name=`Torch lights`;let e=new bt(461508);[11,-2,-15,-29,-43,-57,-68].forEach((t,n)=>this.createTorch(t,n%2==0?-1:1,e)),this.group.add(...this.lightPool.lights),this.shadowLight=new Ke(16756826,72,12,.86,.82,1.7),this.shadowLight.name=`Nearest torch shadow proxy`,this.shadowLight.castShadow=!0,this.shadowLight.shadow.mapSize.set(1024,1024),this.shadowLight.shadow.camera.near=.25,this.shadowLight.shadow.camera.far=12,this.shadowLight.shadow.bias=-16e-5,this.shadowLight.shadow.normalBias=.035,this.group.add(this.shadowLight,this.shadowLight.target)}update(e,t){let n=0,r=1/0;this.torches.forEach((i,a)=>{let o=i.position.distanceTo(t);o<r&&(r=o,n=a);let s=1+Math.sin(e*11.3+i.phase)*.055+Math.sin(e*17.7+i.phase*2.2)*.028;i.intensity=22*s,i.flame.scale.y=s,i.flame.material.uniforms.uTime.value=e}),this.lightPool.update(t,this.torches);let i=this.torches[n];i&&(n!==this.activeShadowTorch&&(this.activeShadowTorch=n,this.shadowLight.position.copy(i.position),this.shadowLight.target.position.copy(i.position).addScaledVector(i.inward,3.1).setY(mt(i.position.x,i.position.z)+.65),this.shadowLight.shadow.needsUpdate=!0),this.shadowLight.intensity=r<13?64+Math.sin(e*12.1)*4:0)}getLightDiagnostics(){return this.lightPool.getDiagnostics()}getShadowDiagnostics(){let e=this.shadowLight.position,t=this.shadowLight.target.position;return{activeTorch:this.activeShadowTorch,enabled:this.shadowLight.castShadow&&this.shadowLight.intensity>0,intensity:this.shadowLight.intensity,position:[e.x,e.y,e.z],target:[t.x,t.y,t.z],mapSize:[this.shadowLight.shadow.mapSize.x,this.shadowLight.shadow.mapSize.y]}}createTorch(e,t,n){let r=new h,i=yt(e)+t*(St(e)-.48),a=mt(i,e)+n.range(1.62,2.15);r.position.set(i,a,e);let o=new I(-t,-.18,0).normalize();r.rotation.z=t*-.15;let s=new f({color:2104087,roughness:.48,metalness:.82}),c=new f({color:3282699,roughness:.9,metalness:.02}),l=new N(new st(.055,.08,.82,7),c);l.castShadow=!0;let u=new N(new Oe(.105,.026,6,12),s);u.rotation.x=Math.PI/2,u.position.y=.37;let d=new N(new st(.035,.035,.54,6),s);d.rotation.z=Math.PI/2,d.position.set(t*.22,-.18,0),r.add(l,u,d);let p=new g({uniforms:{uTime:{value:0},uPhase:{value:n.range(0,Math.PI*2)}},vertexShader:Sl,fragmentShader:Cl,transparent:!0,blending:2,depthWrite:!1,side:2}),m=new N(new b(.15,9,12),p);m.scale.set(.72,1.8,.72),m.position.y=.57,r.add(m),r.updateMatrixWorld(!0);let _=new I,v=new I,y=(e,t,n)=>{_.set(e,t,0),r.localToWorld(v.copy(_)),this.worldColliders.push({center:v.clone(),radius:n,walkable:!1,kind:`torch`})};for(let e of[-.41,-.205,0,.205,.41])y(0,e,.112);for(let e of[-.27,-.135,0,.135,.27])y(t*.22+e,-.18,.104);y(0,.37,.145);let x=new I(i,a+.58,e);this.group.add(r),this.torches.push({root:r,flame:m,position:x,inward:o,phase:n.range(0,Math.PI*2),color:new P(16753230),intensity:22,range:9.5})}},Tl=.12,El=.55,Dl=`
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
`,Ol=`
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
      alphaEdge * mix(${Tl.toFixed(2)}, ${El.toFixed(2)}, fresnel)
    );
  }
`,kl=class{group=new h;puddles;ripples=Array.from({length:16},()=>new F(0,0,-100,0));material;drops=[];dropMesh;splashes=[];splashPositions;splashPoints;random=new bt(53673);dropMatrix=new je;hiddenDropMatrix=new je().makeScale(0,0,0);footPosition=new I;rippleCursor=0;strideSinceStep=0;footSide=1;rippleEmissions=0;footstepRipples=0;dripRipples=0;landingRipples=0;constructor(){this.group.name=`Reactive shallow water`,this.puddles=this.createDefinitions(),this.material=new g({uniforms:{uTime:{value:0},uRipples:{value:this.ripples},uDeepColor:{value:new P(202784)},uShallowColor:{value:new P(1594962)},uFogColor:{value:new P(462866)},uReflectionStrength:{value:1}},vertexShader:Dl,fragmentShader:Ol,transparent:!0,depthWrite:!1,side:2}),this.material.name=`Procedural ripple water`;let e=new S(2,2,96,68);for(let t of this.puddles){let n=new N(e,this.material);n.position.copy(t.center),n.rotation.x=-Math.PI/2,n.scale.set(t.radiusX,t.radiusZ,1),n.renderOrder=3,n.receiveShadow=!0,this.group.add(n)}this.createDrops(),this.dropMesh=this.createDropMesh(),this.group.add(this.dropMesh);let t=new K;this.splashPositions=new p(new Float32Array(216),3),t.setAttribute(`position`,this.splashPositions),t.setDrawRange(0,0),this.splashPoints=new dt(t,new a({color:12183004,size:.034,transparent:!0,opacity:.72,depthWrite:!1,blending:2,sizeAttenuation:!0})),this.splashPoints.frustumCulled=!1,this.group.add(this.splashPoints)}update(e,t,n,r,i){this.material.uniforms.uTime.value=t,this.updateDrops(e,t),this.updateSplashes(e);let a=this.findPuddle(n.x,n.z);if(a&&i>.45){if(this.strideSinceStep+=i*e,this.strideSinceStep>.48){this.strideSinceStep=0,this.footSide*=-1;let e=this.footPosition.copy(n);e.x+=Math.cos(r)*.16*this.footSide,e.z-=Math.sin(r)*.16*this.footSide,e.y=a.center.y+.025,this.footstepRipples+=1,this.addRipple(e,t,.038),this.spawnSplash(e,7,.58)}}else this.strideSinceStep=Math.min(this.strideSinceStep,.3)}setReflectionsEnabled(e){this.material.uniforms.uReflectionStrength.value=+!!e}addRipple(e,t,n){this.ripples[this.rippleCursor]?.set(e.x,e.z,t,n),this.rippleCursor=(this.rippleCursor+1)%16,this.rippleEmissions+=1}addLandingRipple(e,t,n){let r=this.findPuddle(e.x,e.z);if(!r||n<=0)return!1;let i=this.footPosition.copy(e);i.y=r.center.y+.025;let a=G.smoothstep(n,1.5,6);return this.landingRipples+=1,this.strideSinceStep=0,this.addRipple(i,t,G.lerp(.05,.082,a)),this.spawnSplash(i,14,G.lerp(.72,1.02,a)),!0}isInWater(e){return this.findPuddle(e.x,e.z)!==void 0}getDiagnostics(){let e=this.getContainmentDiagnostics();return{puddles:this.puddles.length,drops:this.drops.length,activeRipples:this.ripples.filter(e=>e.z>-99).length,activeSplashes:this.splashes.length,rippleEmissions:this.rippleEmissions,footstepRipples:this.footstepRipples,dripRipples:this.dripRipples,landingRipples:this.landingRipples,basinCenters:this.puddles.map(e=>[e.center.x,e.center.y,e.center.z]),surfaceAlphaRange:[Tl,El],...e}}createDefinitions(){return xt.map(e=>({basin:e,center:new I(e.centerX,ht(e),e.centerZ),radiusX:e.radiusX,radiusZ:e.radiusZ}))}getContainmentDiagnostics(){let e=1/0,t=1/0;for(let n of this.puddles)for(let r=0;r<48;r+=1){let i=r/48*Math.PI*2,a=Math.cos(i),o=Math.sin(i),s=n.center.x+a*n.radiusX*.84,c=n.center.z+o*n.radiusZ*.84;e=Math.min(e,n.center.y-mt(s,c));let l=n.center.x+a*n.radiusX*1.1,u=n.center.z+o*n.radiusZ*1.1;t=Math.min(t,mt(l,u)-n.center.y)}return{minimumInteriorDepth:e,minimumRimClearance:t}}findPuddle(e,t){return this.puddles.find(n=>{let r=(e-n.center.x)/(n.radiusX*.9),i=(t-n.center.z)/(n.radiusZ*.9);return r*r+i*i<1})}createDrops(){this.puddles.forEach((e,t)=>{let n=t%2==0?3:2;for(let t=0;t<n;t+=1){let t=this.random.range(0,Math.PI*2),n=this.random.range(.1,.68),r=new I(e.center.x+Math.cos(t)*e.radiusX*n,e.center.y,e.center.z+Math.sin(t)*e.radiusZ*n),i=Math.min(wt(e.center.z)-.45,this.random.range(3.2,6.5));this.drops.push({position:new I(r.x,i,r.z),impact:r,top:i,velocity:0,delay:this.random.range(0,5.5)})}})}createDropMesh(){let t=new b(.022,5,7);t.scale(.72,2.7,.72);let n=new rt({color:12183774,transparent:!0,opacity:.74}),r=new me(t,n,this.drops.length);return r.name=`Falling water drops`,r.instanceMatrix.setUsage(e),r.frustumCulled=!1,r}updateDrops(e,t){this.drops.forEach((n,r)=>{if(n.delay>0){n.delay-=e,this.dropMesh.setMatrixAt(r,this.hiddenDropMatrix);return}n.velocity+=7.8*e,n.position.y-=n.velocity*e,n.position.y<=n.impact.y&&(this.dripRipples+=1,this.addRipple(n.impact,t,.019),this.spawnSplash(n.impact,3,.28),n.position.y=n.top,n.velocity=0,n.delay=this.random.range(1.4,5.8)),this.dropMatrix.makeTranslation(n.position.x,n.position.y,n.position.z),this.dropMesh.setMatrixAt(r,this.dropMatrix)}),this.dropMesh.instanceMatrix.needsUpdate=!0}spawnSplash(e,t,n){for(let r=0;r<t&&this.splashes.length<72;r+=1){let t=this.random.range(0,Math.PI*2),r=this.random.range(.2,n);this.splashes.push({position:e.clone().add(new I(0,.025,0)),velocity:new I(Math.cos(t)*r,this.random.range(.55,1.45)*n,Math.sin(t)*r),life:this.random.range(.24,.52)})}}updateSplashes(e){for(let t=this.splashes.length-1;t>=0;--t){let n=this.splashes[t];if(n){if(n.life-=e,n.life<=0){this.splashes.splice(t,1);continue}n.velocity.y-=4.8*e,n.position.addScaledVector(n.velocity,e)}}let t=this.splashPositions.array;this.splashes.forEach((e,n)=>{t[n*3]=e.position.x,t[n*3+1]=e.position.y,t[n*3+2]=e.position.z}),this.splashPositions.needsUpdate=!0,this.splashPoints.geometry.setDrawRange(0,this.splashes.length)}},Al=Y.radius+.42,jl=.94,Ml=.08,Nl=Y.radius*1.5,Pl=class{colliders;separation=new U;capsuleSample=new I;rockQuery=new Mo;middleBounds={minimum:0,maximum:0};upperBounds={minimum:0,maximum:0};constructor(e){this.colliders=e}resolvePlayer(e,t){this.constrainCorridorBounds(e),(!t||t.grounded)&&(e.y=this.getPlayerRootHeight(e.x,e.z)),this.constrainPlanarBounds(e);for(let t of this.colliders)t.walkable||this.resolveObstacle(e,t);this.constrainCorridorBounds(e),(!t||t.grounded)&&(e.y=this.getPlayerRootHeight(e.x,e.z)),this.constrainPlanarBounds(e);let n=this.getPlayerRootHeight(e.x,e.z),r=t?.grounded??!0,i=t!==void 0&&t.velocityY<=0&&t.previousY>=n&&e.y<=n,a=e.y<n;(!t||r||i||a)&&(e.y=n,r=!0);let o=wt(e.z)-Y.height-Ml,s=e.y>o;return s&&(e.y=Math.max(n,o),r=e.y<=n+1e-6),{grounded:r,hitCeiling:s}}getPlayerRootHeight(e,t){return this.getGroundHeight(e,t)+Y.footOffset}getGroundHeight(e,t){let n=ft(e,t);for(let r of this.colliders){if(!r.walkable)continue;if(Co(r)){let i=this.getSmoothRockSupport(r,e,t,n);i!==null&&(n=Math.max(n,i));continue}let i=e-r.center.x,a=t-r.center.z,o=r.radius*jl,s=i*i+a*a;if(s>=o*o)continue;let c=r.center.y+Math.sqrt(r.radius*r.radius-s);n=Math.max(n,c)}return n}getSmoothRockSupport(e,t,n,r){let i=(e.bounds.min.x+e.bounds.max.x)*.5,a=(e.bounds.min.z+e.bounds.max.z)*.5,o=(e.bounds.max.x-e.bounds.min.x)*.5+Nl,s=(e.bounds.max.z-e.bounds.min.z)*.5+Nl,c=Math.hypot((t-i)/Math.max(o,.001),(n-a)/Math.max(s,.001));if(c>=1)return null;let l=1-G.smoothstep(c,.12,1);return G.lerp(r,Math.max(r,e.bounds.max.y),l)}constrainPlanarBounds(e){let t=yt(e.z),n=e.y+Y.height-Y.radius,r=e.y+Y.height*.5,i=Y.radius+.12,a=St(e.z)-Al;Tt(r,e.z,i,this.middleBounds),Tt(n,e.z,i,this.upperBounds),e.x=G.clamp(e.x,Math.max(t-a,this.middleBounds.minimum,this.upperBounds.minimum),Math.min(t+a,this.middleBounds.maximum,this.upperBounds.maximum))}constrainCorridorBounds(e){e.z=G.clamp(e.z,Dt.endZ+2.2,Dt.startZ-2.1);let t=yt(e.z),n=St(e.z)-Al;e.x=G.clamp(e.x,t-n,t+n)}resolveObstacle(e,t){if(Co(t)){this.resolveRockObstacle(e,t);return}this.resolveSphereObstacle(e,t)}resolveSphereObstacle(e,t){let n=e.y+Y.radius,r=e.y+Y.height-Y.radius,i=G.clamp(t.center.y,n,r),a=t.center.y-i,o=t.radius+Y.radius,s=o*o-a*a;if(s<=0)return;this.separation.set(e.x-t.center.x,e.z-t.center.z);let c=this.separation.length(),l=Math.sqrt(s);c>=l||(c<1e-6?this.separation.set(1,0):this.separation.multiplyScalar(1/c),e.x+=this.separation.x*(l-c),e.z+=this.separation.y*(l-c))}resolveRockObstacle(e,t){let n=e.y+Y.radius,r=e.y+Y.height-Y.radius;for(let i=0;i<=4;i+=1){this.capsuleSample.set(e.x,G.lerp(n,r,i/4),e.z);let a=this.rockQuery.getPlanarSeparation(t,this.capsuleSample,Y.radius,this.separation);a<=0||(e.x+=this.separation.x*a,e.z+=this.separation.y*a)}}};function Fl(e){return e.length===0?null:e.reduce((e,t)=>e+t,0)/e.length}function Il(e,t){return e.length>0?Ct(e,t):null}function Ll(){return{camera:0,cameraFade:0,water:0,torches:0,veins:0,atmosphere:0,lighting:0}}new class{canvas;scene=new fe;initialViewportAspect=na(window.innerWidth,window.innerHeight);camera=new m(52,this.initialViewportAspect,.08,120);initialProjectionAspect=this.camera.aspect;loading=new Jc;pipeline;rendererPreference;rendererSwitch;customizationPanel;webGPUAvailable;performance;clock=new sa;quality;qualityLabel;urlParameters=new URLSearchParams(window.location.search);harnessMode=this.urlParameters.get(`harness`)===`1`;gpuTimestampProfile=this.urlParameters.get(`gpuTimestamps`)===`1`;input;mobileControls;character;characterController;thirdPersonCamera;cape;capeFactory;performanceBots=[];webGlCapeWorkers=null;botCapeMaterial=null;nextPerformanceBotId=1;cave;water;torches;veins;atmosphere;lighting;worldCollision;worldColliders=[];fixedTime=0;harnessAccumulator=0;ready=!1;webGpuRecoveryStarted=!1;webGpuStartupTimer=null;stopDeviceLossWatch=null;gpuValidationScopeStarted=!1;gpuValidationError=null;gpuValidationPending=null;customizationSettings;stabilizationVelocity=new I;savedLightIntensities=new Map;savedShadowIntensities=new Map;shadowsEnabled=!0;constructor(){this.canvas=Q(document.querySelector(`#scene-canvas`),`Scene canvas is missing.`),this.scene.background=new P(330252),this.scene.fog=new x(462866,.034),this.webGPUAvailable=Xa(),this.rendererPreference=qa({search:window.location.search});let e=Ja(window.location.href);e!==window.location.href&&window.history.replaceState(window.history.state,``,e),this.pipeline=new Wa(this.canvas,this.scene,this.camera,this.rendererPreference,this.gpuTimestampProfile),this.rendererSwitch=new $c(this.rendererPreference,this.webGPUAvailable),this.customizationPanel=new Qc(this.handleCustomizationChange),this.customizationSettings=this.customizationPanel.getSettings(),this.qualityLabel=Q(document.querySelector(`[data-quality-label]`),`Quality label is missing.`),this.quality=new ia(e=>this.applyQuality(e)),this.performance=new pa(this.getPerformanceReportDetails),document.body.classList.toggle(`is-harness`,this.harnessMode)}async start(){this.rendererPreference===`webgpu`&&!this.harnessMode&&(this.webGpuStartupTimer=window.setTimeout(()=>{this.recoverWithWebGL(`WebGPU startup stalled; restarting with WebGL`)},2e4)),this.rendererPreference===`webgpu`?await this.loading.beginLongStage(.03,.075,`Requesting the WebGPU adapter and device`,4e3):await this.loading.update(.03,`Selecting the graphics backend`);try{await this.pipeline.init()}catch(e){if(this.rendererPreference!==`webgpu`)throw e;this.recoverWithWebGL(`WebGPU unavailable; restarting with WebGL`);return}this.pipeline.getActualBackend()===`webgpu`?this.stopDeviceLossWatch=this.pipeline.onDeviceLost(e=>{let t=e.message||e.reason||`unknown device error`;console.warn(`WebGPU device lost: ${t}`),this.recoverWithWebGL(`WebGPU stopped responding; restarting with WebGL`)}):this.clearWebGpuStartupTimer(),this.rendererSwitch.setActive(this.pipeline.getActualBackend(),this.rendererPreference),await this.loading.beginLongStage(.08,.27,`Shaping ancient stone`,1600);let e=no(512);io(e,Math.min(8,this.pipeline.getMaxAnisotropy())),this.cave=new yl(e),this.scene.add(this.cave.group),await this.loading.beginLongStage(.3,.52,`Awakening mineral light`,2e3),this.veins=new xl;let t=this.pipeline.usesNodeRenderer();if(t){let[{WebGpuTorchSystem:e},{WebGpuWaterSystem:t},{WebGpuCaveAtmosphere:n}]=await Promise.all([Ua(()=>import(`./WebGpuTorchSystem-Bbk9bAuH.js`),__vite__mapDeps([4,1,5,2,3])),Ua(()=>import(`./WebGpuWaterSystem-D3G0voJj.js`),__vite__mapDeps([6,1,5,2,3])),Ua(()=>import(`./WebGpuCaveAtmosphere-BU6ls5QU.js`),__vite__mapDeps([7,1,5,2,3]))]);this.torches=new e,this.water=new t,this.atmosphere=new n}else this.torches=new wl,this.water=new kl,this.atmosphere=new nl;this.scene.add(this.veins.group,this.torches.group,this.water.group,this.atmosphere.points),this.worldColliders=[...this.cave.worldColliders,...this.torches.worldColliders,...this.veins.worldColliders],this.worldCollision=new Pl(this.worldColliders),await this.loading.update(.54,`Forging the traveller`),this.character=new Mc;let n=11.8,r=yt(n);this.character.root.position.set(r,this.worldCollision.getPlayerRootHeight(r,n),n),this.character.root.updateMatrixWorld(!0),this.scene.add(this.character.root);let i=this.pipeline.getWebGpuRenderer();if(i){await this.loading.update(.59,`Loading the WebGPU cloth solver`);let{GpuCapeSimulation:e}=await Ua(async()=>{let{GpuCapeSimulation:e}=await import(`./GpuCapeSimulation-BhPSd6Uv.js`);return{GpuCapeSimulation:e}},__vite__mapDeps([8,1,5,2,3]));await this.loading.update(.62,`Allocating WebGPU cloth buffers`),await this.loading.beginLongStage(.64,.72,`Linking WebGPU cloth compute passes`,2500),this.capeFactory=(t,n,r)=>new e(i,t,n,r)}else await this.loading.update(.64,`Weaving the cloth simulation`),this.capeFactory=(e,t,n)=>new Hs(e,t,n);if(this.cape=this.capeFactory(this.character.getCapeAnchors(),this.customizationSettings,Za),this.scene.add(this.cape.mesh),await this.loading.update(.73,`Rigging movement and camera`),this.configureCharacterRenderObjects(this.character,this.cape),this.cape instanceof Hs||(this.scene.add(this.cape.botMesh),this.cape.botMesh.layers.set(0)),this.input=new ao(this.canvas,this.dismissOnboarding),this.mobileControls=new ho(this.canvas,this.input),this.characterController=new Nc(this.character,this.input,this.worldCollision),this.thirdPersonCamera=new $i(this.camera,this.input),this.thirdPersonCamera.snapTo(this.character.root.position),await this.loading.update(.78,`Placing traveller lights`),t){let{WebGpuCinematicLighting:e}=await Ua(async()=>{let{WebGpuCinematicLighting:e}=await import(`./WebGpuCinematicLighting-Dt6EnYru.js`);return{WebGpuCinematicLighting:e}},__vite__mapDeps([9,1,2]));await this.loading.update(.8,`Creating WebGPU light pipelines`);let t=Q(this.pipeline.getNodeRenderer(),`WebGPU node renderer is missing.`);this.lighting=new e(this.scene,t),await this.loading.update(.82,`Binding WebGPU shadows and reflections`)}else{let e=Q(this.pipeline.getWebGlRenderer(),`Native WebGL renderer is missing.`);this.lighting=new vo(this.scene,e)}this.scene.add(this.lighting.group),this.enableCharacterLighting(),this.lighting.update(this.character.root.position,0),this.torches.update(0,this.character.root.position),this.veins.update(0,this.character.root.position),await this.loading.update(.84,`Settling the first cloth frame`),this.stabilizeCape(),this.cape.syncGeometry(),this.applySceneCustomization(this.customizationSettings),this.reconcilePerformanceBots(this.customizationSettings.bots),await this.loading.beginLongStage(.88,.95,t?`Compiling WebGPU cloth, water, and post-processing shaders`:`Compiling cloth, water, and post-processing shaders`,t?22e3:4e3),await this.pipeline.compile(this.scene,this.camera),await this.loading.update(.96,`Submitting the first rendered frame`),this.pipeline.renderManual(0),await this.loading.update(.98,`Validating torchlight and reflections`),this.pipeline.renderManual(0),window.addEventListener(`resize`,this.handleResize),document.addEventListener(`visibilitychange`,this.handleVisibilityChange),window.addEventListener(`beforeunload`,this.dispose,{once:!0}),window.setTimeout(this.dismissOnboarding,7500),this.installHarness(),await this.loading.reveal(),this.ready=!0,this.clearWebGpuStartupTimer(),window.__CAPE_DEMO__&&(window.__CAPE_DEMO__.ready=!0),this.harnessMode?(this.updateScene(0),this.pipeline.renderManual(0)):this.pipeline.renderer.setAnimationLoop(this.frame)}frame=e=>{this.performance.recordFrame(e);let t=performance.now(),n=this.clock.advance(e,this.simulateStep);this.webGlCapeWorkers?.flush();let r=this.applyWorkerCapeResults();(n.physicsSteps>0||r)&&this.syncCapeGeometries(n.physicsSteps>0);let i=performance.now();this.updateScene(n.delta),this.quality.observe(this.fixedTime,this.performance.getSnapshot());let a=performance.now();this.pipeline.render(n.delta);let o=performance.now();this.performance.recordWorkload(e,{physicsMilliseconds:i-t,sceneMilliseconds:a-i,renderMilliseconds:o-a,physicsSteps:n.physicsSteps})};simulateStep=e=>{this.fixedTime+=e,this.characterController.update(e,this.thirdPersonCamera.yaw);let t=this.characterController.consumeLandingImpact();t>0&&this.water.addLandingRipple(this.character.root.position,this.fixedTime,t);for(let t of this.performanceBots)t.input.update(this.fixedTime),t.controller.update(e,0);if(this.cape instanceof Hs){this.cape.step(e,this.character.getCapeAnchors(),this.character.getCapeColliders(),this.worldColliders,this.character.velocity,this.fixedTime);let t=[];for(let n of this.performanceBots){if(!n.cape||!(n.cape instanceof Hs))throw Error(`Mixed CPU and GPU cape simulations are unsupported.`);if(this.webGlCapeWorkers?.isDrivingCape(n.id)){t.push({capeId:n.id,anchors:n.character.getCapeAnchors(),bodyColliders:n.character.getCapeColliders(),characterVelocity:n.character.velocity});continue}n.cape.step(e,n.character.getCapeAnchors(),n.character.getCapeColliders(),this.worldColliders,n.character.velocity,this.fixedTime),n.geometryDirty=!0}this.webGlCapeWorkers?.enqueueStep(e,this.fixedTime,t);return}this.submitGpuCapeBatch(e,[{anchors:this.character.getCapeAnchors(),bodyColliders:this.character.getCapeColliders(),characterVelocity:this.character.velocity},...this.performanceBots.map(e=>({anchors:e.character.getCapeAnchors(),bodyColliders:e.character.getCapeColliders(),characterVelocity:e.character.velocity}))],this.worldColliders,this.fixedTime)};submitGpuCapeBatch(e,t,n,r){if(this.cape instanceof Hs)throw Error(`GPU cape submission requires the WebGPU solver.`);let i=this.cape.prepareBatchStep(e,t,n,r),a=Q(this.pipeline.getWebGpuRenderer(),`WebGPU renderer is missing for the GPU cape batch.`);if(!this.harnessMode||this.gpuValidationScopeStarted){a.compute(i);return}let o=a.backend.device;if(!o){a.compute(i);return}this.gpuValidationScopeStarted=!0,o.pushErrorScope(`validation`),a.compute(i),this.gpuValidationPending=o.popErrorScope().then(e=>{this.gpuValidationError=e?.message??null}).catch(e=>{this.gpuValidationError=e instanceof Error?e.message:String(e)})}async assertGpuComputeValid(){if(await this.gpuValidationPending,this.gpuValidationError)throw Error(`WebGPU cape compute validation failed: ${this.gpuValidationError}`)}updateScene(e){let t=this.character.root.position,n=Math.hypot(this.character.velocity.x,this.character.velocity.z);this.thirdPersonCamera.update(e,t),this.updateCameraFade(),this.water.update(e,this.fixedTime,t,this.character.root.rotation.y,this.characterController.isGrounded()?n:0),this.torches.update(this.fixedTime,t),this.veins.update(this.fixedTime,t),this.atmosphere.update(this.fixedTime),this.lighting.update(t,this.fixedTime),this.customizationSettings.lights||this.setLightsEnabled(!1)}handleResize=()=>{ra(this.camera,window.innerWidth,window.innerHeight),this.pipeline.resize(),this.atmosphere.resize()};handleVisibilityChange=()=>{if(!document.hidden){let e=performance.now();this.clock.reset(e),this.performance.resume(e)}};dismissOnboarding=()=>{document.querySelector(`[data-onboarding]`)?.classList.add(`is-dismissed`)};clearWebGpuStartupTimer(){this.webGpuStartupTimer!==null&&(window.clearTimeout(this.webGpuStartupTimer),this.webGpuStartupTimer=null)}recoverWithWebGL(e){this.webGpuRecoveryStarted||(this.webGpuRecoveryStarted=!0,this.ready=!1,window.__CAPE_DEMO__&&(window.__CAPE_DEMO__.ready=!1),this.clearWebGpuStartupTimer(),this.stopDeviceLossWatch?.(),this.stopDeviceLossWatch=null,document.body.classList.remove(`is-ready`),this.loading.update(.04,e),window.location.replace(Ya(window.location.href,`webgl`)))}applyQuality(e){this.pipeline.setResolutionScale(e.scale),this.qualityLabel.textContent=e.label}handleCustomizationChange=(e,t)=>{if(this.customizationSettings=e,!(!this.cape||!this.character)){this.cape.updateSettings(e,this.character.getCapeAnchors()),this.reconcilePerformanceBots(e.bots);for(let t of this.performanceBots)t.cape?.updateSettings(e,t.character.getCapeAnchors()),t.geometryDirty=!0;t?this.stabilizeAllCapes():this.synchronizeWorkerCapeStates(),this.applySceneCustomization(e),this.ready&&this.pipeline.renderManual(0)}};applySceneCustomization(e){this.setLightsEnabled(e.lights),this.setShadowsEnabled(e.shadows),this.scene.environmentIntensity=e.reflections?.24:0,this.water.setReflectionsEnabled(e.reflections)}stabilizeCape(){this.stabilizeCapeInstance(this.character,this.cape)}stabilizeAllCapes(){if(!(this.cape instanceof Hs)){this.syncCapeGeometries();return}this.stabilizeCape(),this.performanceBots.forEach(e=>{if(e.cape){if(this.webGlCapeWorkers?.isDrivingCape(e.id)){e.geometryDirty=!0;return}this.stabilizeCapeInstance(e.character,e.cape),e.geometryDirty=!0}}),this.synchronizeWorkerCapeStates(),this.syncCapeGeometries()}stabilizeCapeInstance(e,t){let n=e.getCapeAnchors(),r=e.getCapeColliders();this.stabilizationVelocity.set(0,0,0);for(let e=0;e<12;e+=1)t.step(pt,n,r,this.worldColliders,this.stabilizationVelocity,this.fixedTime+e*pt)}reconcilePerformanceBots(e){let t=nc(e);for(;this.performanceBots.length<t;)this.performanceBots.push(this.createPerformanceBot(this.performanceBots.length));for(;this.performanceBots.length>t;){let e=this.performanceBots.pop();e&&this.disposePerformanceBot(e)}}createPerformanceBot(e){let t=new Mc(Qa),n=Math.floor(e/2),r=e%2==0?-1:1,i=this.character.root.position.z+(n-2)*1.55,a=yt(i)+r*.82;t.root.position.set(a,this.worldCollision.getPlayerRootHeight(a,i),i),t.root.rotation.y=e*.73,t.root.updateMatrixWorld(!0);let o=this.cape instanceof Hs?new Hs(t.getCapeAnchors(),this.customizationSettings,Qa,{material:this.botCapeMaterial??=Vs(Qa)}):null,s=new rc(e);s.update(this.fixedTime);let c=this.nextPerformanceBotId;this.nextPerformanceBotId+=1;let l={id:c,character:t,cape:o,input:s,controller:new Nc(t,s,this.worldCollision),geometryDirty:!1};return this.scene.add(t.root),o&&this.scene.add(o.mesh),this.configureCharacterRenderObjects(t,o,!1),o instanceof Hs&&(this.webGlCapeWorkers??=new Ys(this.worldColliders),this.webGlCapeWorkers.registerCape(c,o,t.getCapeAnchors(),t.getCapeColliders())),o?.syncGeometry(),l}configureCharacterRenderObjects(e,t,n=!0){let r=this.pipeline.usesNodeRenderer()?`webgpu`:`webgl`,i=+!!n;e.root.traverse(e=>{e.layers.set(i),n&&e instanceof N&&e.castShadow&&oa(e,r)}),t&&(t.mesh.layers.set(i),n&&oa(t.mesh,r))}syncCapeGeometries(e=!0){e&&this.cape.syncGeometry(),this.performanceBots.forEach(e=>{!e.cape||!e.geometryDirty||(e.cape.syncGeometry(),e.geometryDirty=!1)})}applyWorkerCapeResults(){if(!this.webGlCapeWorkers)return!1;let e=!1;for(let t of this.performanceBots){if(!(t.cape instanceof Hs))continue;let n=this.webGlCapeWorkers.consumeLatestState(t.id);n&&(t.cape.overwriteStateForHarness(n.positions,n.previous),t.cape.synchronizeAnchorDiagnostics(t.character.getCapeAnchors()),t.geometryDirty=!0,e=!0)}return e}synchronizeWorkerCapeStates(){if(this.webGlCapeWorkers)for(let e of this.performanceBots)e.cape instanceof Hs&&this.webGlCapeWorkers.updateCape(e.id,e.cape,e.character.getCapeAnchors())}disposePerformanceBot(e){this.webGlCapeWorkers?.unregisterCape(e.id),this.scene.remove(e.character.root),e.cape&&(this.scene.remove(e.cape.mesh),e.cape.dispose()),e.character.dispose()}setLightsEnabled(e){this.scene.traverse(t=>{if(t instanceof Ve){if(e){let e=this.savedLightIntensities.get(t);e!==void 0&&(t.intensity=e);return}this.savedLightIntensities.has(t)||this.savedLightIntensities.set(t,t.intensity),t.intensity=0}}),e&&this.savedLightIntensities.clear()}setShadowsEnabled(e){this.shadowsEnabled!==e&&(this.shadowsEnabled=e,this.scene.traverse(t=>{if(!(!(t instanceof k)&&!(t instanceof ie)&&!(t instanceof Ke))){if(e){let e=this.savedShadowIntensities.get(t);e!==void 0&&(t.shadow.intensity=e)}else this.savedShadowIntensities.set(t,t.shadow.intensity),t.shadow.intensity=0}}),e&&this.savedShadowIntensities.clear())}installHarness(){window.__CAPE_DEMO__={ready:!1,getDiagnostics:()=>this.getDiagnosticsAfterReadback(),setView:async({yaw:e,pitch:t,distance:n})=>(this.thirdPersonCamera.setOrbit(e,t,n,this.character.root.position),this.updateScene(0),this.pipeline.renderManual(0),this.getDiagnosticsAfterReadback()),setCameraPose:async({position:e,target:t})=>(this.thirdPersonCamera.setPose(new I().fromArray(e),new I().fromArray(t)),this.updateCameraFade(),this.pipeline.renderManual(0),this.getDiagnosticsAfterReadback()),setPlayerPose:async({position:e,yaw:t=this.character.root.rotation.y})=>(this.character.root.position.fromArray(e),this.worldCollision.resolvePlayer(this.character.root.position),this.character.root.rotation.y=t,this.character.velocity.set(0,0,0),this.characterController.resetVerticalState(),this.character.root.updateMatrixWorld(!0),this.cape.reset(this.character.getCapeAnchors()),this.cape.syncGeometry(),this.thirdPersonCamera.snapTo(this.character.root.position),this.updateCameraFade(),this.pipeline.renderManual(0),this.getDiagnosticsAfterReadback()),setMovement:(e,t)=>{this.input.setVirtualMovement(e,t)},clearMovement:()=>{this.input.clearVirtualMovement()},setRunning:e=>{this.input.setVirtualRunning(e)},jump:()=>{this.input.queueVirtualJump()},setBotCount:async e=>{this.reconcilePerformanceBots(e)},advance:({duration:e,frameStep:t=1/60})=>this.advanceHarness(e,t),traceCapeScenario:e=>this.traceCapeScenario(e),tracePackedCapeBatch:e=>this.tracePackedCapeBatch(e),profile:({duration:e,frameStep:t=1/60,synchronizationInterval:n=1,includeDiagnostics:r=!0})=>this.profileHarness(e,t,n,r),profileGpuKernels:({samples:e=4}={})=>{if(!(this.cape instanceof Hs))return this.cape.profileKernelBreakdown(e);throw Error(`Per-kernel GPU profiling requires the WebGPU cape solver.`)},runDepthOcclusionProbe:()=>Rc(this.scene,this.camera,this.pipeline),runShadowLayerProbe:()=>Hc(this.pipeline.renderer)}}async advanceHarness(e,t){let n=G.clamp(t,1/144,1/30),r=G.clamp(e,0,30),i=0;for(;r>1e-6;){let e=Math.min(n,r);i=e,r-=e,this.advanceHarnessFrame(e)}return await this.synchronizeWebGlCapeWorkers(),this.pipeline.renderManual(i),this.getDiagnosticsAfterReadback()}resetHarnessPlayer(){this.input.clearVirtualMovement(),this.input.setVirtualRunning(!1),this.character.root.position.set(-2.38,0,-15),this.worldCollision.resolvePlayer(this.character.root.position),this.character.root.rotation.y=0,this.characterController.reset(),this.character.root.updateMatrixWorld(!0),this.cape.reset(this.character.getCapeAnchors()),this.harnessAccumulator=0}async raiseCapeForHarness(){await this.cape.refreshDiagnostics();let e=this.character.getCapeAnchors(),t=e.left.clone().add(e.right).multiplyScalar(.5),n=new Float32Array(J.columns*J.rows*4);for(let e=0;e<J.rows;e+=1)for(let r=0;r<J.columns;r+=1){let i=e*J.columns+r,a=this.cape.getParticlePosition(r,e),o=a.clone().sub(t);e>0&&(a.y=t.y+Math.abs(o.y)),n[i*4]=a.x,n[i*4+1]=a.y,n[i*4+2]=a.z}this.cape.overwriteStateForHarness(n,n),this.cape.syncGeometry()}captureCapeTrajectorySample(e){let t=this.character.getCapeAnchors(),n=t.left.clone().add(t.right).multiplyScalar(.5),r=t.right.clone().sub(t.left).normalize(),i=[],a=-1/0,o=Math.floor(J.rows*.58);for(let e=0;e<J.rows;e+=1)for(let s=0;s<J.columns;s+=1){let c=this.cape.getParticlePosition(s,e).clone().sub(n),l=c.dot(r),u=c.dot(t.back);i.push(l,c.y,u),e>=o&&(a=Math.max(a,c.y))}let s=this.character.getCapeColliders(),c=this.cape.getBodyPenetrationDiagnostics(s,t.back),l=Object.fromEntries(s.map(e=>[e.name,this.cape.getMaximumBodyPenetration([e],t.back)])),u=Math.max(this.cape.getParticlePosition(0,0).distanceTo(t.left),this.cape.getParticlePosition(J.columns-1,0).distanceTo(t.right));return{frame:e,time:this.fixedTime,playerPosition:this.character.root.position.toArray(),playerYaw:this.character.root.rotation.y,playerSpeed:Math.hypot(this.character.velocity.x,this.character.velocity.z),particles:i,hemDrop:this.cape.getHemDrop(),hemBackOffset:this.cape.getHemBackOffset(t),maximumParticleMotion:this.cape.getMaximumParticleMotion(),particleMotion:this.cape.getMaximumParticleMotionDiagnostics(),maximumLowerParticleHeight:a,maximumLowerHorizontalOffset:this.cape.getMaximumLowerCapeHorizontalOffset(),centerlineDeviation:this.cape.getCapeCenterlineDeviation(),rowTwistRange:this.cape.getCapeRowTwistRange(t),maximumNecklineAttachmentError:u,maximumBodyPenetration:c.maximum,bodyPenetrationByKind:c,bodyPenetrationByCollider:l,maximumStructuralError:this.cape.getMaximumStructuralError(),minimumSelfSeparation:this.cape.getMinimumSelfSeparation(),maximumUpwardFold:this.cape.getMaximumUpwardFold(),lowerCapeSpanRatio:this.cape.getAverageLowerCapeSpanRatio(t),lowerCapeRowCurlRatio:this.cape.getMaximumLowerCapeRowCurlRatio(t)}}async traceCapeScenario({scenario:e,frames:t=120,sampleEvery:n=1}){let r=G.clamp(Math.round(t),1,360),i=G.clamp(Math.round(n),1,12);this.resetHarnessPlayer(),this.fixedTime=0;let a=this.character.getCapeAnchors();this.cape.updateSettings({...ys,weight:e===`lightweight-stop`?.5:ys.weight},a),this.cape.reset(a),(e===`raised-drop`||e===`falling-forward-start`)&&await this.raiseCapeForHarness();let o=[];for(let t=0;t<=r;t+=1){if(e!==`raised-drop`){if(e===`forward-start`||e===`falling-forward-start`)this.input.setVirtualMovement(0,+(t>=30));else if(e===`forward-stop`||e===`lightweight-stop`)this.input.setVirtualMovement(0,+(t>=30&&t<90));else if(e===`reverse`)this.input.setVirtualMovement(0,t<30?0:t<90?1:-1);else if(e===`back-and-forth`){let e=t>=30&&t<210,n=Math.floor((t-30)/30)%2==0?1:-1;this.input.setVirtualMovement(0,e?n:0)}}if(t%i===0&&(await this.assertGpuComputeValid(),await this.cape.refreshDiagnostics(),o.push(this.captureCapeTrajectorySample(t))),t===r)break;this.fixedTime+=pt,this.characterController.update(pt,this.thirdPersonCamera.yaw),this.characterController.consumeLandingImpact(),this.character.root.updateMatrixWorld(!0),this.cape instanceof Hs?this.cape.step(pt,this.character.getCapeAnchors(),this.character.getCapeColliders(),[],this.character.velocity,this.fixedTime):this.submitGpuCapeBatch(pt,[{anchors:this.character.getCapeAnchors(),bodyColliders:this.character.getCapeColliders(),characterVelocity:this.character.velocity}],[],this.fixedTime),this.cape.syncGeometry(),this.pipeline.renderManual(pt)}return this.input.clearVirtualMovement(),{scenario:e,renderer:this.pipeline.getBackendDiagnostics().actual,physicsStep:pt,samples:o}}async tracePackedCapeBatch({bots:e=2,frames:t=90,sampleEvery:n=6}={}){if(this.cape instanceof Hs)throw Error(`Packed cape batch tracing requires the WebGPU solver.`);let r=G.clamp(Math.round(e),1,10),i=G.clamp(Math.round(t),2,360),a=G.clamp(Math.round(n),1,30),o=this.performanceBots.length;this.reconcilePerformanceBots(0),this.resetHarnessPlayer(),this.fixedTime=0,this.cape.updateSettings(ys,this.character.getCapeAnchors()),this.cape.reset(this.character.getCapeAnchors()),this.reconcilePerformanceBots(r);let s=[];try{for(let e=0;e<i;e+=1){let t=e>=10,n=t?Math.floor((e-10)/20)%2==0?.55:-.55:0;this.input.setVirtualMovement(n,+!!t),this.simulateStep(pt),this.syncCapeGeometries(),this.pipeline.renderManual(pt),(e%a===0||e===i-1)&&(await this.assertGpuComputeValid(),s.push({frame:e,capes:await this.cape.readBatchStateForHarness()}))}return{renderer:`webgpu`,physicsStep:pt,botCount:r,samples:s}}finally{this.input.clearVirtualMovement(),this.reconcilePerformanceBots(o)}}async profileHarness(e,t,n,r){let i=G.clamp(t,1/144,1/30),a=G.clamp(e,0,12),o=G.clamp(Math.round(n),1,120),s=[],c=[],l=[],u=[],d=[],f=[],p=[],m=this.pipeline.getProgramCount(),h=Ll(),g=performance.now(),_=g,v=0,y=0;for(;a>1e-6;){let e=Math.min(i,a);a-=e;let t=this.advanceHarnessFrame(e,h);c.push(t.physicsMilliseconds),l.push(t.sceneMilliseconds);let n=performance.now();if(this.pipeline.renderManual(e),u.push(performance.now()-n),y+=1,v+=1,v>=o||a<=1e-6){await this.synchronizeWebGlCapeWorkers();let e=await this.pipeline.resolveGpuFrameTimeForLocalProfile();e===null?await this.pipeline.synchronizeForLocalProfile():(d.push(e.renderMilliseconds),f.push(e.computeMilliseconds),p.push(e.totalMilliseconds));let t=performance.now();s.push((t-_)/v),_=t,v=0}}let b=performance.now()-g,x=c.reduce((e,t)=>e+t,0),S=l.reduce((e,t)=>e+t,0),C=u.reduce((e,t)=>e+t,0);return{frames:y,synchronizationInterval:o,averageFrameMilliseconds:y>0?b/y:0,p95FrameMilliseconds:Ct(s,.95),maximumFrameMilliseconds:Math.max(0,...s),averagePhysicsMilliseconds:y>0?x/y:0,averageSceneMilliseconds:y>0?S/y:0,averageSubmissionMilliseconds:y>0?C/y:0,p95SubmissionMilliseconds:Ct(u,.95),maximumSubmissionMilliseconds:Math.max(0,...u),averageGpuRenderMilliseconds:Fl(d),p95GpuRenderMilliseconds:Il(d,.95),averageGpuComputeMilliseconds:Fl(f),p95GpuComputeMilliseconds:Il(f,.95),averageGpuTotalMilliseconds:Fl(p),p95GpuTotalMilliseconds:Il(p,.95),gpuTimestampSamples:p.length,scenePhaseMilliseconds:Object.fromEntries(Object.entries(h).map(([e,t])=>[e,y>0?t/y:0])),programsBefore:m,programsAfter:this.pipeline.getProgramCount(),diagnostics:r?await this.getDiagnosticsAfterReadback():null}}async getDiagnosticsAfterReadback(){return await this.cape.refreshDiagnostics(),this.getDiagnostics()}advanceHarnessFrame(e,t){let n=performance.now();this.harnessAccumulator+=e;let r=!1;for(;this.harnessAccumulator+1e-7>=pt;)this.simulateStep(pt),this.harnessAccumulator-=pt,r=!0;this.webGlCapeWorkers?.flush();let i=this.applyWorkerCapeResults();(r||i)&&this.syncCapeGeometries(r);let a=performance.now();return t?this.updateSceneProfiled(e,t):this.updateScene(e),{physicsMilliseconds:a-n,sceneMilliseconds:performance.now()-a}}async synchronizeWebGlCapeWorkers(){this.webGlCapeWorkers&&(await this.webGlCapeWorkers.synchronize(),this.applyWorkerCapeResults()&&this.syncCapeGeometries(!1))}updateSceneProfiled(e,t){let n=this.character.root.position,r=Math.hypot(this.character.velocity.x,this.character.velocity.z),i=performance.now();this.thirdPersonCamera.update(e,n),t.camera+=performance.now()-i,i=performance.now(),this.updateCameraFade(),t.cameraFade+=performance.now()-i,i=performance.now(),this.water.update(e,this.fixedTime,n,this.character.root.rotation.y,this.characterController.isGrounded()?r:0),t.water+=performance.now()-i,i=performance.now(),this.torches.update(this.fixedTime,n),t.torches+=performance.now()-i,i=performance.now(),this.veins.update(this.fixedTime,n),t.veins+=performance.now()-i,i=performance.now(),this.atmosphere.update(this.fixedTime),t.atmosphere+=performance.now()-i,i=performance.now(),this.lighting.update(n,this.fixedTime),this.customizationSettings.lights||this.setLightsEnabled(!1),t.lighting+=performance.now()-i}getDiagnostics(){let e=this.character.getCapeAnchors(),t=this.character.getCapeColliders(),n=this.cape.getClosestActiveRockSurfaceContact(this.worldColliders),r=Object.fromEntries(t.map(t=>[t.name,this.cape.getMaximumBodyPenetration([t],e.back)])),i=this.pipeline.getLastFrameRenderStats();return{ready:this.ready,simulationTime:this.fixedTime,fps:this.performance.getSnapshot(),quality:this.quality.getState(),workload:this.performance.getWorkloadSnapshot(),renderer:{...this.pipeline.getBackendDiagnostics(),calls:i.calls,triangles:i.triangles,pixelRatio:this.pipeline.renderer.getPixelRatio(),programs:this.pipeline.getProgramCount(),sizing:this.pipeline.getSizingDiagnostics(),depthComposite:this.pipeline.getDepthCompositeDiagnostics()},player:{position:this.character.root.position.toArray(),yaw:this.character.root.rotation.y,speed:Math.hypot(this.character.velocity.x,this.character.velocity.z),verticalSpeed:this.character.velocity.y,grounded:this.characterController.isGrounded(),inWater:this.water.isInWater(this.character.root.position),groundClearance:this.character.root.position.y-Y.footOffset-this.worldCollision.getGroundHeight(this.character.root.position.x,this.character.root.position.z),opacity:this.character.getOpacity(),running:this.characterController.isRunning(),gait:this.character.getAnimationDiagnostics(),capeAttachment:this.character.getCapeAttachmentDiagnostics()},camera:{aspect:this.camera.aspect,viewportAspect:na(window.innerWidth,window.innerHeight),initialProjectionAspect:this.initialProjectionAspect,initialViewportAspect:this.initialViewportAspect,distance:this.thirdPersonCamera.getActualDistance(),pitch:this.thirdPersonCamera.getPitch(),position:this.camera.position.toArray(),groundClearance:this.camera.position.y-ft(this.camera.position.x,this.camera.position.z)},cave:{contactRocks:this.cave.contactRocks},cape:{settings:{...this.customizationSettings},maximumStructuralError:this.cape.getMaximumStructuralError(),maximumBodyPenetration:this.cape.getMaximumBodyPenetration(t,e.back),bodyPenetrationByKind:this.cape.getBodyPenetrationDiagnostics(t,e.back),bodyPenetrationByCollider:r,maximumEnvironmentPenetration:this.cape.getMaximumEnvironmentPenetration(this.worldColliders),environmentPenetrationByKind:this.cape.getEnvironmentPenetrationDiagnostics(this.worldColliders),maximumEnvironmentFacePenetration:this.cape.getMaximumEnvironmentFacePenetration(this.worldColliders),maximumParticleMotion:this.cape.getMaximumParticleMotion(),maximumParticleVerticalMotion:this.cape.getMaximumParticleVerticalMotion(),particleMotion:this.cape.getMaximumParticleMotionDiagnostics(),sleeping:this.cape.isSleeping(),minimumSelfSeparation:this.cape.getMinimumSelfSeparation(),maximumUpwardFold:this.cape.getMaximumUpwardFold(),hemDrop:this.cape.getHemDrop(),minimumLowerCapeDrop:this.cape.getMinimumLowerCapeDrop(),maximumLowerCapeLateralOffset:this.cape.getMaximumLowerCapeLateralOffset(e),averageLowerCapeSpanRatio:this.cape.getAverageLowerCapeSpanRatio(e),capeRowTwistRange:this.cape.getCapeRowTwistRange(e),capeCenterlineDeviation:this.cape.getCapeCenterlineDeviation(),maximumLowerCapeRowCurlRatio:this.cape.getMaximumLowerCapeRowCurlRatio(e),hemBackOffset:this.cape.getHemBackOffset(e),minimumHemGroundClearance:this.cape.getMinimumHemGroundClearance(),minimumActiveRockSurfaceDistance:n?.distance??null,closestActiveRockCenter:n?.center??null,hemCenter:this.cape.getParticlePosition(6,17).toArray(),worldColliders:this.worldColliders.length,worldContacts:this.cape.getWorldContactDiagnostics(),performance:this.cape.getPerformanceDiagnostics(),workers:this.webGlCapeWorkers?.getDiagnostics()??null},water:this.water.getDiagnostics(),minerals:{clusters:this.veins.getClusterPositions(),lights:this.veins.getLightDiagnostics()},torches:{lights:this.torches.getLightDiagnostics(),shadow:this.torches.getShadowDiagnostics()}}}updateCameraFade(){let e=this.thirdPersonCamera.getActualDistance(),t=_t+G.smoothstep(e,.78,2.15)*(1-_t);this.character.setOpacity(t),this.cape.setOpacity(t),this.pipeline.setCharacterOpacity(t)}getPerformanceReportDetails=()=>{let e=this.pipeline.getBackendDiagnostics(),t=this.pipeline.getSizingDiagnostics(),n=this.pipeline.getLastFrameRenderStats(),r=window.screen,i=typeof r.isExtended==`boolean`?r.isExtended:null;return{renderer:{backend:e.backend,vendor:e.vendor,device:e.device,preference:e.preference,actual:e.actual,fallback:e.fallback,drawCalls:n.calls,triangles:n.triangles,programs:this.pipeline.getProgramCount()},canvas:{drawingBufferWidth:t.drawingBufferWidth,drawingBufferHeight:t.drawingBufferHeight,cssWidth:window.innerWidth,cssHeight:window.innerHeight},quality:{label:this.quality.getState().label,scale:this.quality.getState().scale,targetResizes:t.targetResizeCount},workload:this.performance.getWorkloadSnapshot(),capeSolver:this.ready?this.cape.getPerformanceDiagnostics():null,capeWorkers:this.webGlCapeWorkers?.getDiagnostics()??null,scene:{simulationSeconds:this.fixedTime,capeSleeping:this.ready?this.cape.isSleeping():!1,worldColliders:this.worldColliders.length,activeRipples:this.ready?this.water.getDiagnostics().activeRipples:0,botCount:this.performanceBots.length,simulatedCapes:1+this.performanceBots.length},page:{visibility:document.visibilityState,focused:document.hasFocus(),devicePixelRatio:window.devicePixelRatio,multipleScreens:i,url:window.location.href},runtime:{platform:navigator.platform||`Unknown platform`,userAgent:navigator.userAgent||`Unavailable`}}};enableCharacterLighting(){this.scene.traverse(e=>{e instanceof Ve&&(e.layers.enable(1),(e instanceof k||e instanceof ie||e instanceof Ke)&&e.shadow.camera.layers.enable(1))})}dispose=()=>{for(this.clearWebGpuStartupTimer(),this.stopDeviceLossWatch?.(),this.stopDeviceLossWatch=null,this.pipeline.renderer.setAnimationLoop(null),this.rendererSwitch.dispose(),this.customizationPanel.dispose(),this.mobileControls?.dispose(),this.input?.dispose();this.performanceBots.length>0;){let e=this.performanceBots.pop();e&&this.disposePerformanceBot(e)}this.webGlCapeWorkers?.dispose(),this.webGlCapeWorkers=null,this.botCapeMaterial?.map?.dispose(),this.botCapeMaterial?.normalMap?.dispose(),this.botCapeMaterial?.roughnessMap?.dispose(),this.botCapeMaterial?.dispose(),this.botCapeMaterial=null,this.cape?.dispose(),this.character?.dispose(),this.lighting?.dispose(),this.performance.dispose(),this.pipeline.dispose(),window.removeEventListener(`resize`,this.handleResize),document.removeEventListener(`visibilitychange`,this.handleVisibilityChange)}}().start().catch(e=>{console.error(`Unable to start the cape physics demo.`,e),new Jc().fail()});export{Oa as A,ro as C,Fa as D,Pa as E,Ma as O,go as S,Za as T,wo as _,Ss as a,xo as b,hs as c,fs as d,_s as f,Ko as g,Uo as h,Cs as i,ja as k,ps as l,Wo as m,Hs as n,ys as o,gs as p,Ts as r,xs as s,bl as t,ms as u,To as v,Qa as w,yo as x,Co as y};
//# sourceMappingURL=index-BOiT2UOO.js.map