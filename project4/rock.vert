#version 330 compatibility

#define M_PI 3.14159

out vec3  vMCposition;
out vec3  vECposition;
out vec3  vSurfaceNormal;

// Wave deformation equation constants
uniform float uA;
uniform float uB;
uniform float uC;
uniform float uD;
uniform float uE;
float
calculateZ( )
{
	float x = gl_Vertex.x;
	float y = gl_Vertex.y;
    float r = sqrt(x*x+y*y);
	return uA * ( cos(2.*M_PI*uB*r+uC) * exp(-uD*r) ) * ( exp(-uE*r) );
}

vec3
getSurfaceNormal( vec3 vertex ) 
{
	float x = vertex.x;
	float y = vertex.y;
    float r = sqrt(x*x+y*y);
    float drdx = x / r;
    float drdy = y / r;
	//Calculate slopes on x-z and y-z axis
	float dzdx = uA * ( -sin(2.*M_PI*uB*r+uC) * 2.*M_PI*uB * exp(-uD*r) + cos(2.*M_PI*uB*r+uC) * -uD * exp(-uD*r)*drdx);
	float dzdy = uA * ( cos(2.*M_PI*uB*r+uC) * exp(-uD*r)*drdy); 

	//Tangent Vectors
	vec3 Tx = vec3(1., 0., dzdx );
	vec3 Ty = vec3(0., 1., dzdy );

	//Generate normal vector using the cross product between the two tangent vectors
	return normalize(cross( Tx, Ty ));
}

void
main( )
{
	//Calculate new vertex position
    float x, y, z, w;
    x = gl_Vertex.x;
    y = gl_Vertex.y;
    z = calculateZ();
    w = gl_Vertex.w;

	vec4 vertex = vec4(x, y, z, w);

	vMCposition  = vertex.xyz;
	vECposition  = (gl_ModelViewMatrix * vertex).xyz;

    vSurfaceNormal = normalize(gl_NormalMatrix * getSurfaceNormal(vertex.xyz));
	gl_Position = gl_ModelViewProjectionMatrix * vertex;
}