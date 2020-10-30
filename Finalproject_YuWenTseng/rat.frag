#version 330 compatibility

in vec3 vMCposition;
in vec4 vColor;
in float vLightIntensity;
in vec2 vST;
in float Z; 

uniform float uAd, uBd;
uniform float uNoiseAmp, uNoiseFreq;
uniform float uAlpha, uTol;
uniform sampler3D Noise3;
uniform vec4 uOvalColor;

void
main( )
{ 
	float sp = 2. * vST.s;
	float tp = vST.t;

	float Ar = uAd/2.;
	float Br = uBd/2;

	int numins = int( sp / uAd );
	int numint = int( tp / uBd );
	float sc = float(numins)*uAd + uAd/2.;
	float tc = float(numint)*uBd + uBd/2;
	sp = sp - sc;
	tp = tp - tc;

 	vec4 nv = texture3D( Noise3, uNoiseFreq * vMCposition );
	float n = nv.r + nv.g + nv.b + nv.a - 2.;	
 	vec3 delta = vec3(sp,tp,0) -  vec3( 0., 0., 0. );	
 	delta = delta * (length(delta) +uNoiseAmp * n) / length(delta);

	delta.x = delta.x/Ar*2;
	delta.y = delta.y/Br*3;
	gl_FragColor = vColor;	
	float alpha = 1.; 
	float d = pow(delta.x ,2)+ pow(delta.y ,2);

	if( abs( d - 1. ) <= uTol ){
	gl_FragColor = mix( uOvalColor, vColor, smoothstep( 1.-uTol, 1.+uTol, d ) );
	}
	if( d <= 1.-uTol){ 
	gl_FragColor = mix( uOvalColor, vColor, smoothstep( 1.-uTol, 1.+uTol, d ) );
	}
	if(d > 1.+uTol){
	alpha = uAlpha;
	gl_FragColor = vColor;
	if (uAlpha==0.){
	discard;
	}
	}
	gl_FragColor = vec4( vLightIntensity*gl_FragColor.xyz, alpha);
}