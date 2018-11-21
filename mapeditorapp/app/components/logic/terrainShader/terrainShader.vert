uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
attribute vec3 position;
attribute vec3 normal;
varying vec3 vNormal;
attribute vec2 uv;
varying vec2 vUv;

void main() {
    vNormal = normal;
    vUv = uv;
    gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(position,1.0);
}