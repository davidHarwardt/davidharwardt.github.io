class Firework
{
    constructor(pos, velocity, spreadParticles, flightDuration, size, col)
    {
        this.pos = pos;
        this.velocity = velocity;
        this.spreadParticles = spreadParticles;
        this.flightDuration = flightDuration;
        this.size = size;
        this.particles = [new Particle(pos, size, velocity, col, flightDuration, 50, 0.9)];
        this.hasSpread = false;
        this.col = col;
    }

    update()
    {
        if(!this.hasSpread)
        {
            if(this.particles[0].lifeDuration < 0)
            {
                var oldPos = this.particles[0].pos;
                this.particles = new Array();
                for(var j = 0; j < this.spreadParticles; j++)
                {
                    this.particles.push(new Particle(oldPos.Add(new Vector2d(Math.random(), Math.random())), this.size/2, new Vector2d(Math.random()*2 - 1, Math.random()*2 - 1), this.col, this.flightDuration * Math.random(), 50, 0.9));
                }
                console.log();
                this.hasSpread = true;
            }
        }

        if(!this.hasSpread)
        {
            this.particles[0].update();
        }
        else
        {
            if(this.particles.length > 0)
            {
                for(var i = 0; i < this.particles.length; i++)
                {
                    this.particles[i].applyGravity();
                    this.particles[i].update();
                    if(this.particles[i].lifeDuration < 0)
                    {
                        this.particles.splice(i, 1);
                    }
                }
            }
        }
    }

    draw()
    {
        for(var i = 0; i < this.particles.length; i++)
        {
            this.particles[i].draw();
        }
    }
}

class Particle
{
    constructor(pos, size, velocity, col, lifeDuration, trailLength, trailMult)
    {
        this.pos = pos;
        this.size = size;
        this.col = col;
        this.velocity = velocity;
        this.lifeDuration = lifeDuration;
        this.maxLife = lifeDuration;
        this.trailLength = trailLength;
        this.trail = new Array(1);
        this.trailMult = trailMult;
    }

    draw()
    {
        var canvas = Graphics.createCanvas("canvas");

        for(var i = 1; i < this.trail.length; i++)
        {
            canvas.beginPath();
            canvas.strokeStyle = this.col;
            canvas.fillStyle = this.col;
            canvas.arc(this.trail[i].x, this.trail[i].y, this.trail[i].z, 0, 2 * Math.PI);
            canvas.fill();
        }

        canvas.beginPath();
        canvas.strokeStyle = this.col;
        canvas.fillStyle = this.col;
        canvas.arc(this.pos.x, this.pos.y, this.size, 0, 2 * Math.PI);
        canvas.fill();
    }

    applyGravity()
    {
        this.velocity = this.velocity.Add(new Vector2d(0, -0.001));
    }

    update()
    {
        this.trail.push(new Vector3d(this.pos.x, this.pos.y, this.size));

        for(var i = 1; i < this.trail.length; i++)
        {
            this.trail[i].z *= this.trailMult;
        }

        this.pos.x -= this.velocity.x;
        this.pos.y -= this.velocity.y;

        this.lifeDuration--;

        if(this.trail.length > this.trailLength)
        {
            this.trail.splice(0, 1);
        }
    }
}