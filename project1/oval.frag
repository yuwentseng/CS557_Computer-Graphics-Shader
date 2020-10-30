#version 330 compatibility

in vec3 vMCposition;
in float vLightIntensity;
in vec2 vST;
in vec4 vColor;

uniform float uAd;
uniform float uBd;
uniform float uTol;

//const vec3 WHITE = vec3( 1., 1., 1. );
//Add Code
const vec3 color0 = vec3(0.9);
const vec3 color1 = vec3(0.2039, 0.6471, 0.1451);

void
main( )
{
	//Lecture
    float Ar = uAd / 2.;
    float Br = uBd / 2.;

	//Add Code
    float s = vST.s;
    float t = vST.t;

	//Lecture
    int numins = int(s / uAd);
    int numint = int(t / uBd);
    float sc = (numins * uAd) + Ar;
    float tc = (numint * uBd) + Br;
    //float ellipse = (((s - sc) / Ar) * ((s - sc) / Ar)) + (((t - tc) / Br) * ((t - tc) / Br));
    float ellipse = pow(((s - sc) / Ar), 2.0) + pow(((t - tc) / Br), 2.0);
    float d = smoothstep( 1. - uTol, 1. + uTol, ellipse );

	//Add Code
    //gl_FragColor = mix(vec4(vLightIntensity * vColor.rgb, 1.), vec4(vLightIntensity * WHITE, 1.), d);
	vec3 color = mix(color1, color0, d);
	gl_FragColor = vec4(color * vLightIntensity, 1.);
}