varying mediump vec3 vNormal;
varying mediump vec2 vUv;
varying mediump vec3 vPosition;

uniform sampler2D grassTexture;
uniform sampler2D rockTexture;
uniform sampler2D roughRocksTexture;

void main() {
    mediump vec3 light = normalize(vec3(0.5, 0.2, 1.0));

    mediump float lightIntensity = max(0.1, dot(vNormal, light));


    mediump vec4 ambientColor = vec4(0.3,0.3,0.3,1);
    mediump vec4 lightColor = vec4(
        lightIntensity * 0.7,
        lightIntensity * 0.7,
        lightIntensity * 0.7,
        1.0);


    lowp float textureScale = 25.0;
    mediump vec4 grassColor = texture2D(grassTexture, (vPosition.xy + vUv) / textureScale);
    mediump vec4 rockColor = texture2D(rockTexture, (vPosition.xy + vUv) / textureScale);
    mediump vec4 roughRocksColor = texture2D(roughRocksTexture, (vPosition.xy + vUv) / textureScale);

    lowp float slope = pow(dot(vNormal, vec3(0,0,1.0)), 2.0);
    mediump vec4 slopeTexture = slope * grassColor + (1.0 - slope) * rockColor;
    
    lowp float grassFalloff = (vPosition.z - 200.0)/800.0;
    if(vPosition.z > 200.0 ){
        slopeTexture = grassFalloff * roughRocksColor + (1.0 - grassFalloff) * slopeTexture;
    }
    // if(vPosition.z > 2.0 && mod(vPosition.z+50.0, 100.0) < 2.0){
    //     slopeTexture *= vec4(0.3,0.3,0.3,0.5);
    // }


    gl_FragColor = (lightColor + ambientColor) * slopeTexture;
}