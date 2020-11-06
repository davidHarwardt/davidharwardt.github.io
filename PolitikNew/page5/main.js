const gl = GlHelper.getContext("canvas");

gl.clearColor(0.1, 0.1, 0.1, 1.0);
gl.clearDepth(1.0);

var mousePos = new Vector(0, 0);

gl.canvas.width = window.innerWidth;
gl.canvas.height = window.innerHeight;

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LEQUAL);

var world = new ParticleWorld([new Particle(new Vector(0, 0), new Vector(0, 0), new Vector(0.2, 0.2, 0.5), 0.001), new Particle(new Vector(0, 0), new Vector(0, 0), new Vector(-0.2, -0.2), 0.001)], undefined);

document.onmousemove = (ev) =>
{
    mousePos.x = (ev.clientX / window.innerWidth) * 2 - 1;
    mousePos.y = (ev.clientY / window.innerHeight) * 2 - 1;
}

Shader.fromFile(gl, "../includes/shaders/basic.vert", "../includes/shaders/fog.frag", (ex, program) =>
{
    if(ex)
    {
        console.error("Shader: " + ex);
        return;
    }

    var sphereVertecies = new Array();

    const SPHERE_VERTS = 25;
    const SPHERE_SIZE = 0.0125;

    for(var i = 0; i < SPHERE_VERTS; i++)
    {
        sphereVertecies.push(new Vertex(0, 0));
        sphereVertecies.push(new Vertex(Math.sin((i / SPHERE_VERTS) * Math.PI * 2) * SPHERE_SIZE, Math.cos((i / SPHERE_VERTS) * Math.PI * 2) * SPHERE_SIZE));
        sphereVertecies.push(new Vertex(Math.sin(((i + 1) / SPHERE_VERTS) * Math.PI * 2) * SPHERE_SIZE, Math.cos(((i + 1) / SPHERE_VERTS) * Math.PI * 2) * SPHERE_SIZE));
    }

    var particles = new Array();

    const NUM_PARTICLES = 400;

    for(var i = 0; i < NUM_PARTICLES; i++)
    {
        particles.push(new Particle(new Vector(0, 0), new Vector(0, 0), new Vector(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 3 + 1.0), 0.002 * Math.random()));
    }

    //particles = particles.concat(LogoParticle.genParticles());

    //console.log(particles, LogoParticle.genParticles());

    world.particles = particles;

    sphereModel = new Mesh(gl, sphereVertecies, program);

    line = new Line(gl, program, [new Vertex(0, 0), new Vertex(1, 1)], 0.1);

    console.log("loaded...");

    world.particleMesh = sphereModel;

    requestAnimationFrame(draw);
});

var sphereModel;


var line;

function draw(ev)
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const SENS = 0.1;

    world.update(ev);
    world.draw(gl, line, mousePos.multScalar(SENS).mult(new Vector(1, -1)));

    requestAnimationFrame(draw);
}

window.onresize = () =>
{
    gl.canvas.width = window.innerWidth;
    gl.canvas.height = window.innerHeight;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}