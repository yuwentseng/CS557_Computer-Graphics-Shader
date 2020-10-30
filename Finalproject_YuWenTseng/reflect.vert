#version 330 compatibility

out float vLightIntensity; 
out vec3 vReflectVector;

void
main( )
{
	vReflectVector = reflect( vec3( gl_ModelViewMatrix * gl_Vertex ), normalize( gl_NormalMatrix * gl_Normal ) );

	vec3 LightPos = vec3( 5., 10., 10. );
    	vLightIntensity  = 1.5 * abs( dot( normalize(LightPos - vec3( gl_ModelViewMatrix * gl_Vertex )), normalize( gl_NormalMatrix * gl_Normal ) ) );
	if( vLightIntensity < 0.2 ){
		vLightIntensity = 0.2;
	}
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
