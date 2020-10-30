#version 330 compatibility

uniform bool		uCircle;
uniform float 		uScenter, uTcenter, uDs, uDt;
uniform float 		uMagFactor, uRotAngle, uSharpFactor;
uniform sampler2D   uImageUnit;

in vec2  vST;
float	 ResS;
float	 ResT;

void
main( )
{
	float s = vST.s;
	float t = vST.t;
	float top;
	float bottom;
	float right;
	float left;

	vec3 color  = texture2D( uImageUnit, vST ).rgb;
	
	ivec2 ires = textureSize( uImageUnit, 0 );
	ResS = float( ires.s );
	ResT = float( ires.t );

	vec2 st = vST;

	top = uScenter + uDs;
	bottom = uScenter - uDs;
	right = uTcenter + uDt;
	left = uTcenter - uDt;

	if (!uCircle){
		if((s - uScenter)*(s - uScenter) + (t - uTcenter)*(t - uTcenter) < (uDs) * (uDs) ){
			s = (s - uScenter) * 1.0 / uMagFactor;
			t = (t - uTcenter) * 1.0 / uMagFactor;

			//reference form the Lecture
			float X = s*cos(uRotAngle) - t*sin(uRotAngle) + uScenter;
			float Y = s*sin(uRotAngle) + t*cos(uRotAngle) + uTcenter;
			///
			
			vec2 m = vec2(X,Y);
			vec3 n = texture2D(uImageUnit, m).rgb;
			
			//Sharpening
			//Reference from Lecture
			vec2 stp0 = vec2(1./ResS,  0. );
			vec2 st0p = vec2(0.     ,  1./ResT);
			vec2 stpp = vec2(1./ResS,  1./ResT);
			vec2 stpm = vec2(1./ResS, -1./ResT);
			vec3 i00 =   texture2D( uImageUnit, m ).rgb;
			vec3 im1m1 = texture2D( uImageUnit, m-stpp ).rgb;
			vec3 ip1p1 = texture2D( uImageUnit, m+stpp ).rgb;
			vec3 im1p1 = texture2D( uImageUnit, m-stpm ).rgb;
			vec3 ip1m1 = texture2D( uImageUnit, m+stpm ).rgb;
			vec3 im10 =  texture2D( uImageUnit, m-stp0 ).rgb;
			vec3 ip10 =  texture2D( uImageUnit, m+stp0 ).rgb;
			vec3 i0m1 =  texture2D( uImageUnit, m-st0p ).rgb;
			vec3 i0p1 =  texture2D( uImageUnit, m+st0p ).rgb;
			vec3 target = vec3(0.,0.,0.);
			target += 1.*(im1m1+ip1m1+ip1p1+im1p1);
			target += 2.*(im10+ip10+i0m1+i0p1);
			target += 4.*(i00);
			target /= 16.;
			gl_FragColor = vec4( mix( target, n, uSharpFactor ), 1. );
			////
		}
		else{
			gl_FragColor = vec4( color, 1. );
		}
	}else{
		float top;
		float bottom;
		float right;
		float left;

		top = uScenter + uDs;
		bottom = uScenter - uDs;
		right = uTcenter + uDt;
		left = uTcenter - uDt;

		if( s < top && s > bottom && t > left && t < right )
		{
			s = (s - uScenter) * 1.0 / uMagFactor;
			t = (t - uTcenter) * 1.0 / uMagFactor;

			float X = s*cos(uRotAngle) - t*sin(uRotAngle) + uScenter;
			float Y = s*sin(uRotAngle) + t*cos(uRotAngle) + uTcenter;

			vec2 m = vec2(X,Y);
			vec3 n = texture2D(uImageUnit, m).rgb;
			
			vec2 stp0 = vec2(1./ResS,  0. );
			vec2 st0p = vec2(0.     ,  1./ResT);
			vec2 stpp = vec2(1./ResS,  1./ResT);
			vec2 stpm = vec2(1./ResS, -1./ResT);
			vec3 i00 =   texture2D( uImageUnit, m ).rgb;
			vec3 im1m1 = texture2D( uImageUnit, m-stpp ).rgb;
			vec3 ip1p1 = texture2D( uImageUnit, m+stpp ).rgb;
			vec3 im1p1 = texture2D( uImageUnit, m-stpm ).rgb;
			vec3 ip1m1 = texture2D( uImageUnit, m+stpm ).rgb;
			vec3 im10 =  texture2D( uImageUnit, m-stp0 ).rgb;
			vec3 ip10 =  texture2D( uImageUnit, m+stp0 ).rgb;
			vec3 i0m1 =  texture2D( uImageUnit, m-st0p ).rgb;
			vec3 i0p1 =  texture2D( uImageUnit, m+st0p ).rgb;
			vec3 target = vec3(0.,0.,0.);
			target = target + 1.*(im1m1+ip1m1+ip1p1+im1p1);
			target = target + 2.*(im10+ip10+i0m1+i0p1);
			target = target + 4.*(i00);
			target /= 16.;
			gl_FragColor = vec4( mix( target, n, uSharpFactor ), 1. );
		}
		else
		{
			gl_FragColor = vec4( color, 1. );
		}
	}
}