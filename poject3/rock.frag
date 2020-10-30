#version 330 compatibility

//Based on the professor's LightingForClass.zip
flat in vec3 vNf;
     in vec3 vNs;
flat in vec3 vLf;
     in vec3 vLs;
flat in vec3 vEf;
     in vec3 vEs;
//Add Code
in vec3 vMCposition;
in vec4 dummy;
//Lecture
uniform float uKa;
uniform float uKd;
uniform float uKs;
uniform vec4  uColor; 
uniform vec4  uSpecularColor;
uniform float uShininess;

//Add Code
uniform float uNoiseFreq;
uniform float uNoiseAmp;
uniform sampler3D Noise3;
uniform bool uFlat;

//Lecture
vec3 RotateNormal(float angx, float angy, vec3 n) {	
	float cx = cos(angx);
	float sx = sin(angx);
	float cy = cos(angy);
	float sy = sin(angy);
	
	// rotate about x:
	float yp = n.y*cx - n.z*sx;  //y'
	n.z = n.y*sx + n.z*cx; //z'
	n.y = yp;
    // n.x      =  n.x;

	// rotate about y:
	float xp = n.x*cy + n.z*sy;   //x'
	n.z = -n.x*sy + n.z*cy; //z'
	n.x = xp;
    // n.y      =  n.y;
	
	return normalize(n);
}

////Based on the professor's LightingForClass.zip
void main( ) {
    
    //Lecture
    //These will be treated as an angle to rotate the normal about x and an angle to rotate the normal about y.
	vec4 nvx = texture(Noise3, uNoiseFreq*vMCposition);
	float angx = nvx.r + nvx.g + nvx.b + nvx.a - 2.;
	angx *= uNoiseAmp;
    vec4 nvy = texture( Noise3, uNoiseFreq*vec3(vMCposition.xy,vMCposition.z+0.5) );
	float angy = nvy.r + nvy.g + nvy.b + nvy.a - 2.;
	angy *= uNoiseAmp;
	
    //Add Code
	//vec3 Normal = RotateNormal(angx, angy, Normal);
    //Modify Code: Normal
	vec3 Normal = RotateNormal(angx, angy, vNs);
	vec3 Light = normalize(vLs);
	vec3 Eye = normalize(vEs);

    //Lecture
	vec4 ambient = uKa * uColor;
	float d = max(dot(Normal,Light), 0.);
	vec4 diffuse = uKd * d * uColor;
	float s = 0.;
	if(dot(Normal,Light) > 0.) {                                         // only do specular if the light can see the point
		vec3 ref = normalize(2. * Normal * dot(Normal,Light) - Light);   //use the reflection-vector
		s = pow(max(dot(Eye,ref),0.), uShininess);
	}
	vec4 specular = uKs * s * uSpecularColor;
	
	gl_FragColor = vec4(ambient.rgb + diffuse.rgb + specular.rgb, 1.);
}