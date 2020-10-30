#version 330 compatibility

in vec3 vMCposition;
in float vLightIntensity;
in vec2 vST;
in vec4 vColor;
//Add Code
in float Z;

uniform float uAd;   //Ellipse diameter for s
uniform float uBd;   //Ellipse diameter for t
uniform float uTol;  //Width of the blend between ellipse and non-ellipse areas

//Add Code
uniform float uNoiseAmp;        //Noise Amplitude
uniform float uNoiseFreq;       //Noise Frequency
uniform sampler3D Noise3;       //3D noise texture
uniform float uAlpha;           //Opacity of non-ellipse areas
uniform bool uUseChromaDepth;
uniform float uChromaBlue;
uniform float uChromaRed;

const vec3 WHITE = vec3( 1., 1., 1. );

vec3 ChromaDepth(float);


//Lecture
vec3
ChromaDepth( float t )
{
	t = clamp( t, 0., 1. );

	float r = 1.;
	float g = 0.0;
	float b = 1.  -  6. * ( t - (5./6.) );

        if( t <= (5./6.) )
        {
                r = 6. * ( t - (4./6.) );
                g = 0.;
                b = 1.;
        }

        if( t <= (4./6.) )
        {
                r = 0.;
                g = 1.  -  6. * ( t - (3./6.) );
                b = 1.;
        }

        if( t <= (3./6.) )
        {
                r = 0.;
                g = 1.;
                b = 6. * ( t - (2./6.) );
        }

        if( t <= (2./6.) )
        {
                r = 1.  -  6. * ( t - (1./6.) );
                g = 1.;
                b = 0.;
        }

        if( t <= (1./6.) )
        {
                r = 1.;
                g = 6. * t;
        }

	return vec3( r, g, b );
}


void
main( )
{
    //Add Code
    vec3 color = vColor.rgb;
    //Lecture
    if(uUseChromaDepth)
    {
        float t = (2./3.) * ( Z - uChromaRed ) / ( uChromaBlue - uChromaRed );
		t = clamp( t, 0., 2./3. );
		color = ChromaDepth(t);
    }

    //Lecture
    //vec3 stp = uNoiseFreq * vMCposition; //get index to sample from based on position
    vec4 nv = texture3D(Noise3, uNoiseFreq*vMCposition);
    float n = (nv.r + nv.g + nv.b + nv.a);
    n = n - 2.;
    n *= uNoiseAmp;     //incorporate noise amplitude

    //Lecture
    float Ar = uAd / 2.;
    float Br = uBd / 2.;
    int numins = int(vST.s / uAd);
    int numint = int(vST.t / uBd);
    // determine the color based on the noise-modified (s,t):
    float sc = (float(numins) * uAd) + Ar;
    float ds = vST.s - sc;                  // wrt ellipse center
    float tc = (float(numint) * uBd) + Br;
    float dt = vST.t - tc;                  // wrt ellipse center
    float oldDist = sqrt((ds*ds) + (dt*dt));
    float newDist = n + oldDist;
    float scale = newDist / oldDist;
    ds *= scale;                            // scale by noise factor
    ds /= Ar;                               // ellipse equation
    dt *= scale;                            // scale by noise factor
    dt /= Br; 
    float d = ds*ds + dt*dt;   
    float d1 = smoothstep( 1. - uTol, 1. + uTol, d);

    //Add Code
    //When uAlpha == 0., do a discard; instead of setting apha.
    gl_FragColor = mix(vec4(vLightIntensity * color, 1.), vec4(vLightIntensity * WHITE, uAlpha), d1);
    if(gl_FragColor.a == 0){
        discard;
    }
}

