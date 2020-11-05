class ParticleWorld
{
    /**
     * 
     * @param {Particle[]} particles 
     * @param {Mesh} particleMesh
     * @param {Vector} size
     */
    constructor(particles, particleMesh, size = new Vector(1000, 1000))
    {
        this.particles = particles;
        this.size = size;
        this.particleMesh = particleMesh;
    }

    /**
     * 
     * @param {Number} deltaTime 
     */
    update(deltaTime)
    {
        for(var i = 0; i < this.particles.length; i++)
        {
            this.particles[i].update(deltaTime);
        }
    }

    /**
     * 
     * @param {WebGLRenderingContext} gl 
     */
    draw(gl, line, offset = new Vector(0, 0))
    {
        for(var i = 0; i < this.particles.length; i++)
        {
            this.particles[i].draw(gl, this.particleMesh, this.particles, line, offset);
        }
    }
}

class Particle
{
    /**
     * 
     * @param {Vector} pos 
     * @param {Vector} target 
     * @param {Vector} origin 
     * @param {Number} speed 
     */
    constructor(pos, target, origin, speed, maxDist = 0.5, connectionMax = 10, thresh = 0.4)
    {
        this.pos = pos;
        this.target = target;
        this.origin = origin;
        this.speed = speed;
        this.maxDist = maxDist;
        this.connectionMax = connectionMax;
        this.thresh = thresh;
    }

    update(deltaTime)
    {
        var THRESH = 0.01;

        if(this.pos.sub(this.target).magnitude() < THRESH || Math.random() < 0.001)
        {
            this.target = new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).setMagnitude(this.maxDist);
        }

        if(this.pos.magnitude() > this.maxDist)
        {
            console.log(this.pos.magnitude());
        }

        this.pos = this.pos.add(this.target.sub(this.pos).setMagnitude(this.speed));
    }

    /**
     * 
     * @param {WebGLRenderingContext} gl 
     * @param {Mesh} particleMesh 
     * @param {Particle[]} particles
     * @param {Line} line
     * @param {Vector} offset
     */
    draw(gl, particleMesh, particles, line, offset = new Vector(0, 0))
    {
        particleMesh.draw(gl, this.origin.add(this.pos).add(offset));

        const CONNECTION_THRESH = 0.4;
        const MAX_CONNECTIONS = 10;

        var connections = 0;

        for(var i = 0; i < particles.length; i++)
        {
            if(particles[i] != this && connections < this.connectionMax)
            {
                if(this.origin.add(this.pos).sub(particles[i].origin.add(particles[i].pos)).magnitude() < this.thresh)
                {
                    line.points.push(new Vertex(this.pos.x + this.origin.x, this.pos.y + this.origin.y, this.pos.z + this.origin.z));
                    line.points.push(new Vertex(particles[i].pos.x + particles[i].origin.x, particles[i].pos.y + particles[i].origin.y, particles[i].pos.z + particles[i].origin.z));

                    connections++;
                }
            }
        }

        line.draw(gl, offset);

        line.points = new Array();
    }
}

class LogoParticle
{
    static genParticles()
    {
        var particles = new Array();

//      (-0.25, 0.25)
//      (-0.25, -0.25)
//      (0, 0.25)
//      (0, -0.25)
//      (-0.25, 0)
//      (0, 0)

        particles = particles.concat(LogoParticle.line(new Vector(-0.25, 0.25, 0.5), new Vector(-0.25, -0.25, 0.5), 15));
        particles = particles.concat(LogoParticle.line(new Vector(0, 0.25, 0.5), new Vector(0, -0.25, 0.5), 15));
        particles = particles.concat(LogoParticle.line(new Vector(-0.2, 0, 0.5), new Vector(-0.05, 0, 0.5), 6));

        //particles = particles.concat(LogoParticle.line(new Vector(-0.25, 0.25, 0.5), new Vector(-0.25, -0.25, 0.5), 15));
        //particles = particles.concat(LogoParticle.line(new Vector(0.1, 0.25, 0.5), new Vector(0.1, -0.25, 0.5), 15));
        //particles = particles.concat(LogoParticle.line(new Vector(-0.25, 0.25, 0.5), new Vector(-0.25 + (0.35 / 2), 0, 0.5), 7));
        //particles = particles.concat(LogoParticle.line(new Vector(0.1, 0.25, 0.5), new Vector(-0.25 + (0.35 / 2), 0, 0.5), 7));

        return particles;
    }

    /**
     * 
     * @param {Vector} start 
     * @param {Vector} end 
     * @param {Number} points 
     * @param {Number} randomRange 
     */
    static line(start, end, points, randomRange = 0.01)
    {
        //console.log(start.toString(), end.toString());

        var pointsRet = new Array(points);

        var currentPos = new Vector(start.x, start.y, start.z);

        var dir = end.sub(start).divScalar(points);

        for(var i = 0; i < points; i++)
        {
            pointsRet[i] = new Particle(new Vector(0, 0), new Vector(0, 0), currentPos.add(new Vector((Math.random() - 0.5) * randomRange, ((Math.random() - 0.5) * randomRange),  ((Math.random() - 0.5) * randomRange))), Math.random() * 0.001, 0.05, 10, 0.15);
            //console.log(currentPos.toString());
            
            currentPos = currentPos.add(dir);
        }

        //console.log(pointsRet);

        return pointsRet;
    }
}