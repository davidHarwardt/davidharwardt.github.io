const gl = document.querySelector("canvas").getContext("webgl");
const sensorButton = document.getElementById("sensorsBtn");

const program = Shader.createProgram(gl, document.getElementById("vertex").innerHTML, document.getElementById("fragment").innerHTML);

const vertexBuffer = Shader.createBuffer(gl);
const colorBuffer = Shader.createBuffer(gl);

Shader.writeBuffer(gl, colorBuffer, 
[
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
], gl.STATIC_DRAW);

gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(1);

Shader.writeBuffer(gl, vertexBuffer,
[
    0, 0, 0,
    1, 0, 0,
    1, 1, 0,

    1, 1, 0,
    0, 1, 0,
    0, 0, 0,


    0, 0, 1,
    1, 0, 1,
    1, 1, 1,

    1, 1, 1,
    0, 1, 1,
    0, 0, 1,


    0, 0, 0,
    0, 1, 0,
    0, 1, 1,

    0, 1, 1,
    0, 0, 1,
    0, 0, 0,

    1, 0, 0,
    1, 1, 0,
    1, 1, 1,

    1, 1, 1,
    1, 0, 1,
    1, 0, 0,

    0, 0, 0,
    0, 0, 1,
    1, 0, 1,

    1, 0, 1,
    1, 0, 0,
    0, 0, 0,

    0, 1, 0,
    0, 1, 1,
    1, 1, 1,

    1, 1, 1,
    1, 1, 0,
    0, 1, 0,
], gl.STATIC_DRAW);

gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(0);

gl.clearColor(0.1, 0.1, 0.1, 1.0);
gl.clearDepth(1.0);

gl.useProgram(program);

gl.enable(gl.DEPTH_TEST);

const modelViewLocation = gl.getUniformLocation(program, "modelViewMatrix");
const projectionLocation = gl.getUniformLocation(program, "projectionMatrix");
const rotationLocation = gl.getUniformLocation(program, "rotation");

sensorButton.onclick = () =>
{
    if(typeof(DeviceMotionEvent.requestPermission) != "undefined")
    {
        DeviceMotionEvent.requestPermission().then(() =>
        {
            window.addEventListener("devicemotion", onMotion);
            sensorButton.remove();
        });
    }
    else
    {
        alert("cant use device motion event");
    }

    if(typeof(DeviceOrientationEvent.requestPermission) != "undefined")
    {
        DeviceMotionEvent.requestPermission().then(() =>
        {
            window.addEventListener("deviceorientation", onOrientation);
            //sensorButton.remove();
        });
    }
    else
    {
        alert("cant use device orientation event");
    }
};

var gravity = Vector.zero();
var acc = Vector.zero();
var accG = Vector.zero();
var compass = Vector.zero();

/**
 * 
 * @param {DeviceMotionEvent} ev 
 */
function onMotion(ev)
{
    acc = new Vector(ev.acceleration.x, ev.acceleration.y, ev.acceleration.z);
    accG = new Vector(ev.accelerationIncludingGravity.x, ev.accelerationIncludingGravity.y, ev.accelerationIncludingGravity.z);
    //compass = ev.webkitCompassHeading;
    gravity = accG.sub(acc);
    //alert("test");
}

/**
 * 
 * @param {DeviceOrientationEvent} ev 
 */
function onOrientation(ev)
{
    //compass = new Vector(ev.alpha, ev.beta, ev.gamma);
    //compass = compass.multScalar(Math.PI / 180);
    if(ev.webkitCompassHeading)
    {
        compass = -ev.webkitCompassHeading * (Math.PI / 180);
    }
}

const dataDiv = document.getElementById("data");

function draw()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(modelViewLocation, false,
    [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0.5,
        0, 0, 0, 1,
    ]);

    gl.uniformMatrix4fv(projectionLocation, false,
    [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 1, 1,
    ]);

    if(true)
    {
        var gravAngles = gravity.angles();
        if(document.getElementById("compassEnabled").checked)
        {
            gl.uniform3f(rotationLocation, gravAngles.z, compass, gravAngles.x);
        }
        else
        {
            gl.uniform3f(rotationLocation, gravAngles.z, 0.0, gravAngles.x);
        }

        dataDiv.innerHTML = "GravAngles: " + gravAngles.toStringDeg() + "<br>Accelaration: " + acc.toString() + "<br>Acceleration + G: " + accG.toString() + "<br>G: " + gravity.toString()  + "<br>Compass: " + compass.toString();
    }
    else
    {
        gl.uniform3f(rotationLocation, 0, 0, 0);
    }

    //console.log(Date.now());

    gl.drawArrays(gl.TRIANGLES, 0, 32);
    requestAnimationFrame(draw);
}

draw();