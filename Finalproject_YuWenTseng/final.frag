#version 330 compatibility
in vec2 vST;
in vec3 vMC;
in vec3 vNf;
in vec3 vLf;
in vec3 vEf;

uniform float uKa, uKd, uKs;
uniform float uShininess, uNoiseAmp, uNoiseFreq;
uniform vec4 uColor, uSpecularColor;
uniform sampler3D Noise3D;

vec3
RotateNormal( float angx, float angy, vec3 n )
{
        float cx = cos( angx );
        float sx = sin( angx );
        float cy = cos( angy );
        float sy = sin( angy );
        
        float yp =  n.y*cx - n.z*sx;    
        n.z      =  n.y*sx + n.z*cx;    
        n.y      =  yp;
        
        float xp =  n.x*cy + n.z*sy;    
        n.z      = -n.x*sy + n.z*cy;    
        n.x      =  xp;
        
        return normalize( n );
}

void
main ()
{
	vec4 nvx = texture3D(Noise3D, uNoiseFreq * vMC);
	vec4 nvy = texture3D(Noise3D, uNoiseFreq * vec3(vMC.xy, vMC.z+0.5));
	float angx = nvx.r + nvx.g + nvx.b + nvx.a - 2;
	float angy = nvy.r + nvy.g + nvy.b + nvy.a - 2;
	angx = angx * uNoiseAmp;
	angy = angx * uNoiseAmp;

	vec4 ambient = uKa * uColor;

	vec4 diffuse = uKd * max(dot(normalize(vNf), normalize(vLf) , 0.) * uColor;

	vec3 ref

	float s = 0.;
	if ( dot(normalize(vNf), normalize(vLf) ) > 0.) {
		ref = normalize( 2. * (normalize(vNf)) * dot( dot(normalize(vNf), normalize(vLf) ) - normalize(vLf) );
		s = pow(max(dot(normalize(vEf) ,ref), 0.), uShininess);、
	}
	vec4 specular = uKs * s * uSpecularColor;

	gl_FragColor = vec4(ambient.rgb + diffuse.rgb + specular.rgb, 1.);
}
