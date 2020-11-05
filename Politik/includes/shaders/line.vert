precision highp float;

attribute vec3 aVertexPos;
attribute vec3 aVertexCol;

uniform mat4 uTransformMat;
uniform float uAspect;
uniform float uLineWidth;

varying vec3 vColor;
varying vec4 vPos;
varying float vLineWidth;

void main()
{
    vColor = aVertexCol;
    vLineWidth = uLineWidth;

    mat4 projMat = mat4(
        1.0 / uAspect, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 0.1, 0.0,
        0.0, 0.0, 1.0, 1.0
    );

    vec4 pos = (vec4(aVertexPos, 1.0) * uTransformMat);

    vPos = pos;

    gl_Position = pos * projMat;
}