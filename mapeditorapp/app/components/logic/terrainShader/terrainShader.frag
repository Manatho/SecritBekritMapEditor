varying mediump vec3 vNormal;
varying mediump vec2 vUv;
varying mediump vec3 vPosition;

uniform sampler2D grassTexture;
uniform sampler2D rockTexture;

void main() {
    mediump vec3 light = normalize(vec3(0.5, 0.2, 1.0));

    mediump float lightIntensity = max(0.1, dot(vNormal, light));


    mediump vec4 ambientColor = vec4(0,0,0.3,1);
    mediump vec4 lightColor = vec4(
        lightIntensity * 1.0,
        lightIntensity * 0.9,
        lightIntensity * 0.8,
        1.0);

    lowp float slope = pow(dot(vNormal, vec3(0,0,1.0)), 2.0);

    lowp float textureScale = 100.0;

    mediump vec4 grassColor = texture2D(grassTexture, (vPosition.xy + vUv) / textureScale);
    mediump vec4 rockColor = texture2D(rockTexture, (vPosition.xy + vUv) / textureScale);
    mediump vec4 slopeTexture = slope * grassColor + (1.0 - slope) * rockColor;

    gl_FragColor = (lightColor + ambientColor) * slopeTexture;
}