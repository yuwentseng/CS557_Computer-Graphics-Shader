#version 330 compatibility
in vec3  vMCposition;
in float vLightIntensity; 
in vec3 tnorm; 
in vec3 viewDirection;

uniform float uNoiseMag, uNoiseFreq;
uniform float uA, uTol, uP;
uniform sampler3D Noise3;
uniform float uCover;

const vec4 PINK	= vec4(0.7843, 0.0275, 0.9725, 1.0);

float
Pulse( float value, float left, float right, float tol )
{
	float a = left - tol;
	float b = left + tol;
	float c = right - tol;
	float d = right + tol;
	float t = ( smoothstep( a, b, value )  -  smoothstep( c, d, value ) );
	return t;
}

void
main( void )
{
	vec4  nv  = texture3D( Noise3, uNoiseFreq * vMCposition ); 
	float n = nv.r + nv.g + nv.b + nv.a - 2.;				

	float f = fract(  uA*((vMCposition.x)+(uNoiseMag * n)));

	vec4 crackColor = vec4(0., Pulse(f,  0.5-uP/1.5,  0.5+uP/1.5, uTol), 1., 1.);
	gl_FragColor = mix( PINK, crackColor, Pulse(f,  0.5-uP,  0.5+uP, uTol));
	gl_FragColor.rgb *= vLightIntensity;
	float v = dot(normalize(viewDirection), normalize(tnorm));
	if (v < uCover)
	{
		gl_FragColor = crackColor;
	}
}
