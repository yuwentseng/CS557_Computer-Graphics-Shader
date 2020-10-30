#version 330 compatibility

out vec3  vMCposition;
out float vLightIntensity;
out vec3 tnorm; 
out vec3 viewDirection;

const vec3 LIGHTPOS = vec3( 0., 0., 5. );

void
main( )
{
	tnorm = normalize( gl_NormalMatrix * gl_Normal );
	viewDirection = -normalize( (gl_ModelViewMatrix * gl_Vertex).xyz );
	vec3 ECposition = ( gl_ModelViewMatrix * gl_Vertex ).xyz;
	vLightIntensity  = abs( dot( normalize(LIGHTPOS - ECposition), normalize( gl_NormalMatrix * gl_Normal ) ) );

	vMCposition = gl_Vertex.xyz;
	vec4 position = gl_Vertex;
	if(position.x >0){
		position.x *= 4;
		position.y = position.y*cos(3.14/2*position.x/10);
		position.z = position.z*cos(3.14/2*position.x/10);
	}

	gl_Position = gl_ModelViewProjectionMatrix * position;
}
