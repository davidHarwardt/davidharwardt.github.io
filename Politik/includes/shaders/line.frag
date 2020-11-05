precision highp float;

varying vec3 vColor;
varying vec4 vPos;

void main()
{
    if(!(abs(vPos.x - vPos.y) < 0.1))
    {
        discard;
    }
       
    gl_FragColor = vec4(vColor, 1.0);
}