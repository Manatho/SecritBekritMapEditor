varying mediump vec3 vNormal;
varying mediump vec2 vUv;
varying mediump vec3 vPosition;
varying mediump vec3 wPosition;

uniform sampler2D grassTexture;
uniform sampler2D rockTexture;
uniform bool drawContour;

lowp float textureScale = 50.0;

lowp float lineWidth1 = 4.0;
lowp float lineWidth2 = 2.0;
lowp float lineWidth3 = 1.0;

void main() {
    mediump vec3 light = normalize(vec3(0.5, 0.2, 1.0));
    mediump float lightIntensity = max(0.1, dot(vNormal, light));

    mediump vec4 ambientColor = vec4(0.3,0.3,0.3,1);
    mediump vec4 lightColor = vec4(
        lightIntensity * 0.7,
        lightIntensity * 0.7,
        lightIntensity * 0.7,
        1.0);

    mediump vec4 grassColor = texture2D(grassTexture, (vPosition.xy + vUv) / textureScale);
    mediump vec4 rockColor = texture2D(rockTexture, (vPosition.xy + vUv) / textureScale);

    lowp float slope = pow(dot(vNormal, vec3(0,0,1.0)), 2.0);
    mediump vec4 slopeTexture = slope * grassColor + (1.0 - slope) * rockColor;
    
    
    lowp vec4 contour = vec4(1.0,1.0,1.0,1.0);
    if(drawContour){
        lowp float df = fwidth(wPosition.y);
        lowp float f1  = mod(wPosition.y + 0.001, 100.);
        lowp float f2  = mod(wPosition.y + 0.001, 50.);
        lowp float f3  = mod(wPosition.y + 0.001, 10.);

         lowp float g1 = step(df * lineWidth1, f1);
         lowp float g2 = step(df * lineWidth2, f2);
         lowp float g3 = 1.0 - step(df * lineWidth3, f3);
        
        contour *= g1 * g2 * (step(-0.5, g3) - step(0.5, g3)/4.0);

    }

    gl_FragColor = (lightColor + ambientColor) * slopeTexture * contour;
}