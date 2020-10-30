#version 330 compatibility

#define PI 3.14

uniform float uA;   //Amplitude
uniform float uB;   //Period
uniform float uC;   //Phase shift
uniform float uD;   //Decay rate
uniform float uNoiseAmp;
uniform float uNoiseFreq;

//Based on the professor's LightingForClass.zip
uniform float uLightX; 
uniform float uLightY;
uniform float uLightZ;
flat out vec3 vNf;
	 out vec3 vNs;
flat out vec3 vLf;
	 out vec3 vLs;
flat out vec3 vEf;
	 out vec3 vEs;
	 out vec3 vMCposition;
out vec4 dummy;
vec3 eyeLightPosition = vec3( uLightX, uLightY, uLightZ );

void main( ){ 

    
	dummy = gl_Vertex;
    float r = sqrt(dummy.x * dummy.x + dummy.y*dummy.y);
    //Z = A * cos(2πBr+C) * e^(-Dr)
	//dummy.z = (uA * (cos(2*PI*uB*r+uC) * exp(-uD*r)));   //Modify Code 
	
    //LightingForClass.zip
	//vec4 ECposition = gl_ModelViewMatrix * gl_Vertex;

    //Leture note
    //dzdx = dzdr * drdx
    //dzdy = dzdr * drdy
    //float dzdr = A * [ -sin(2.*π*B*r+C) * 2.*π*B * exp(-D*r) + cos(2.*π*B*r+C) * -D * exp(-Dr) ]
    float drdx = dummy.x / r;
    float drdy = dummy.y / r;
	float dzdx = uA * (-sin(2.*PI*uB*r+uC) * 2.*PI*uB*exp(-uD*r) + cos(2*3.12*uB*r+uC) * -uD*exp(-uD*r)) * drdx; 
	float dzdy = uA * (-sin(2.*PI*uB*r+uC) * 2.*PI*uB*exp(-uD*r) + cos(2*3.12*uB*r+uC) * -uD*exp(-uD*r)) * drdy;      

    dummy.x = dummy.x;
    dummy.y = dummy.y;
    dummy.z = (uA * (cos(2*PI*uB*r+uC) * exp(-uD*r)));

	vec3 Tx = vec3(1., 0., dzdx );
	vec3 Ty = vec3(0., 1., dzdy );
	vec3 normal = normalize(cross(Tx, Ty));
	
    //LightingForClass.zip
	vec4 ECposition = gl_ModelViewMatrix * gl_Vertex;
    //LightingForClass.zip
	vNf = normalize(gl_NormalMatrix * normal);	//surface normal vector
	vNs = vNf;
	vLf = eyeLightPosition - ECposition.xyz; //vector from the point to the light position
	vLs = vLf;
	vEf = vec3(0., 0., 0.) - ECposition.xyz; //vector from the point to the eye position 
	vEs = vEf;

    //Add Code
	vMCposition  = dummy.xyz;
    
	gl_Position = gl_ModelViewProjectionMatrix * dummy;
}