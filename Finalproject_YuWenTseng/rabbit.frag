#version 330 compatibility

flat in vec3 vNf;
     in vec3 vNs;
flat in vec3 vLf;
     in vec3 vLs;
flat in vec3 vEf;
     in vec3 vEs;

uniform float Ka, Kd, Ks;
uniform vec4 uColor, SpecularColor;
uniform float NoiseAmp, NoiseFreq, Shininess;
uniform sampler3D Noise3;
uniform bool Flat, uHalf;
in vec3  vMCposition;

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
main( )
{
	vec3 Normal;
	vec3 Light;
	vec3 Eye;
	
	vec4 nvx = NoiseAmp * texture3D( Noise3, NoiseFreq*vMCposition );
    vec4 nvy = NoiseAmp * texture3D( Noise3, NoiseFreq*vec3(vMCposition.xy,vMCposition.z+0.5) );
	float angx = (nvx.r + nvx.g + nvx.b + nvx.a - 2.) * NoiseAmp;	
	float angy = (nvy.r + nvy.g + nvy.b + nvy.a - 2.) * NoiseAmp;	

	if(Flat){
		Normal = RotateNormal(angx, angy, vNf);
		Light = normalize(vLf);
		Eye = normalize(vEf);
	}
	else{
		Normal = RotateNormal(angx, angy, vNs);
		Light = normalize(vLs);
		Eye = normalize(vEs);
	}

	float s = 0.;

	if( dot(Normal,Light) > 0. )	{
		vec3 ref = normalize( 2. * Normal * dot(Normal,Light) - Light );
		s = pow( max( dot(Eye,ref),0. ), Shininess );
	}
	gl_FragColor = vec4( (Ka * uColor).rgb + (Kd * max( dot(Normal,Light), 0. ) * uColor).rgb + (Ks * s * SpecularColor).rgb, 1. );
}