#version 330 compatibility

out vec3  vMCposition;
out float vLightIntensity;
out vec4 vColor;
//Add Code
out vec2 vST;
out float Z;

vec3 LIGHTPOS   = vec3( -2., 0., 10. );

void
main( )
{	
	//Add Code
    vColor = gl_Color;

	//Lecture	
	vST = gl_MultiTexCoord0.st;
	vec3 tnorm      = normalize( gl_NormalMatrix * gl_Normal );
	vec3 ECposition = vec3( gl_ModelViewMatrix * gl_Vertex );
	vLightIntensity  = abs( dot( normalize(LIGHTPOS - ECposition), tnorm ) );
	
	//Add Code
	Z = ECposition.z;

	vMCposition  = gl_Vertex.xyz;
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}