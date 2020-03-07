//represents a 2dimensional vector
class Vector2d
{
    constructor(xPos, yPos)
    {
        this.x = xPos;
        this.y = yPos;
    }

    Add(vector)
    {
        return new Vector2d(this.x + vector.x, this.y + vector.y);
    }
}

//represents a 3dimensional vector
class Vector3d
{
    constructor(xPos, yPos, zPos)
    {
        this.x = xPos;
        this.y = yPos;
        this.z = zPos;
    }

    Add(vector)
    {
        return new Vector3d(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    }
}

//represents an angle
class Angle
{
    constructor(degrees)
    {
        this.degrees = degrees;
    }

    toRadians()
    {
        return (this.degrees * (Math.PI / 180));
    }
}

//sets the graphics object
class Graphics
{
    constructor(){}

    static createCanvas(canvasID)
    {
        var c = document.getElementById(canvasID);
        var canvas = c.getContext("2d");

        return canvas;
    }

    static clearCanvas(canvasID)
    {
        var c = document.getElementById(canvasID);

        this.createCanvas(canvasID).clearRect(0, 0, c.width, c.height);
    }

    static getDimensions(canvasID)
    {
        var canvas = document.getElementById(canvasID);

        return new Vector2d(canvas.width, canvas.height);
    }
}

class Mathf
{
    static sigmoid(input)
    {
        return 1 / (1 + Math.exp(-input));
    }
}