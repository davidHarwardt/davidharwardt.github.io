var gl = document.querySelector("canvas").getContext("webgl");

var vertexSrc = document.getElementById("vertex").innerHTML;
var fragmentSrc = document.getElementById("fragment").innerHTML;

var vert = gl.createShader(gl.VERTEX_SHADER);
var frag = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vert, vertexSrc);
gl.shaderSource(frag, fragmentSrc);

gl.compileShader(vert);

if(!gl.getShaderParameter(vert, gl.COMPILE_STATUS))
{
    console.error("Vertex Shader: " + gl.getShaderInfoLog(vert));
}

gl.compileShader(frag);

if(!gl.getShaderParameter(frag, gl.COMPILE_STATUS))
{
    console.error("Fragment Shader: " + gl.getShaderInfoLog(frag));
}

var vertBuffer = gl.createBuffer();

var program = gl.createProgram();

gl.attachShader(program, vert);
gl.attachShader(program, frag);

gl.linkProgram(program);

if(!gl.getProgramParameter(program, gl.LINK_STATUS))
{
    console.error("Program: " + gl.getProgramInfoLog(program));
}

gl.useProgram(program);

var iterLocation = gl.getUniformLocation(program, "iterations");
var iter = 100;

var mouseLocation = gl.getUniformLocation(program, "mousePos");

var threshLocation = gl.getUniformLocation(program, "threshhold");
var threshhold = 5;

document.getElementById("thresh").oninput = () =>
{
    threshhold = document.getElementById("thresh").value;
};

var scaleLocation = gl.getUniformLocation(program, "scale");
var offsetLocation = gl.getUniformLocation(program, "offset");

var juliaLocation = gl.getUniformLocation(program, "julia");

gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array
    ([
        -1, -1, 1,
        1, -1, 1,
        1, 1, 1,

        1, 1, 1,
        -1, 1, 1,
        -1, -1, 1,
    ]), gl.STATIC_DRAW);

gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(0);

var mousePos = {x: 0, y: 0};
var offset = {x: 0, y: 0};
var scale = {x: 2, y: 2};

var size = document.getElementById("canvas").getBoundingClientRect();

document.getElementById("canvas").onmousemove = (ev) =>
{
    mousePos.x = ev.clientX;
    mousePos.y = ev.clientY;

    mousePos.x -= size.left;
    mousePos.y -= size.top;

    mousePos.x /= size.width;
    mousePos.y /= size.height;

    mousePos.x *= 2;
    mousePos.y *= 2;
    mousePos.x -= 1;
    mousePos.y -= 1;

    mousePos.y *= -1;

    //console.log(mousePos);
};

document.getElementById("canvas").ontouchmove = (ev) =>
{
    mousePos.x = ev.targetTouches[0].clientX;
    mousePos.y = ev.targetTouches[0].clientY;

    mousePos.x -= size.left;
    mousePos.y -= size.top;

    mousePos.x /= size.width;
    mousePos.y /= size.height;

    mousePos.x *= 2;
    mousePos.y *= 2;
    mousePos.x -= 1;
    mousePos.y -= 1;

    mousePos.y *= -1;

    //console.log(mousePos);
};

document.getElementById("iterations").oninput = () =>
{
    iter = document.getElementById("iterations").value;
};

var sens = 0.001;

document.getElementById("canvas").onwheel = (ev) =>
{
    ev.preventDefault();
    scale.x += ev.deltaY * sens * (scale.x);
    scale.y += ev.deltaY * sens * (scale.y);
};

var buttonsDown = {left: false, middle: false, right: false};
var mouseDownPos = {x: 0, y: 0};

document.getElementById("canvas").onmousedown = (ev) =>
{
    ev.preventDefault();
    mouseDownPos.x = mousePos.x;
    mouseDownPos.y = mousePos.y;
    switch(ev.button)
    {
        case 1:
            buttonsDown.middle = true;
            break;
        case 2:
            buttonsDown.right = true;
            break;
        default:
            buttonsDown.left = true;
            break;
    }
};

document.getElementById("canvas").ontouchstart = (ev) =>
{
    ev.preventDefault();
    mouseDownPos.x = mousePos.x;
    mouseDownPos.y = mousePos.y;
    buttonsDown.left = true;
};

document.getElementById("canvas").ontouchend = (ev) =>
{
    ev.preventDefault();
    buttonsDown.left = false;
};

var showJulia = false;

document.getElementById("canvas").onmouseup = (ev) =>
{
    ev.preventDefault();
    switch(ev.button)
    {
        case 1:
            buttonsDown.middle = false;
            break;
        case 2:
            showJulia = !showJulia;
            buttonsDown.right = false;
            break;
        default:
            buttonsDown.left = false;
            break;
    }
};

document.getElementById("canvas").oncontextmenu = (ev) =>
{
    ev.preventDefault();
};

window.onresize = () =>
{
    size = document.getElementById("canvas").getBoundingClientRect();
}

function draw()
{
    gl.clear(gl.COLOR_BUFFER_BIT);

    if(buttonsDown.left)
    {
        offset.x -= (mousePos.x - mouseDownPos.x) * (scale.x);
        offset.y -= (mousePos.y - mouseDownPos.y) * (scale.y);
    }

    if(buttonsDown.middle)
    {
        offset.x = 0;
        offset.y = 0;
        scale.x = 2;
        scale.y = 2;
    }

    mouseDownPos.x = mousePos.x;
    mouseDownPos.y = mousePos.y;

    gl.uniform1i(iterLocation, iter);
    gl.uniform2f(mouseLocation, mousePos.x, mousePos.y);
    gl.uniform2f(scaleLocation, scale.x, scale.y);
    gl.uniform2f(offsetLocation, offset.x, offset.y);
    gl.uniform1f(threshLocation, threshhold);

    gl.uniform1i(juliaLocation, (buttonsDown.right) ? 1 : 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(draw);
}

draw();