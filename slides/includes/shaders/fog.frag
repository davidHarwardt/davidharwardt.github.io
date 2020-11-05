precision highp float;

varying vec3 vColor;
varying vec4 vPos;

void main()
{
    gl_FragColor = clamp(vec4(vColor, 1.0) * (1.0 / (vPos.z * 2.0)), vec4(0.1, 0.1, 0.1, 0.1), vec4(1.0, 1.0, 1.0, 1.0));
    //gl_FragColor = vec4(0.5, 0.0, 0.0, 1.0);
}