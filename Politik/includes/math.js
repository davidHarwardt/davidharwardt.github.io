class Vector
{
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     * @param {Number} w 
     */
    constructor(x = 0, y = 0, z = 0, w = 0)
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    toStringDeg()
    {
        return "(" + (this.x / (Math.PI / 180)).toFixed(2) + ", " + (this.y / (Math.PI / 180)).toFixed(2) + ", " + (this.z / (Math.PI / 180)).toFixed(2) + ", " + this.w.toFixed(2) + ")";
    }

    toString()
    {
        return "(" + (this.x).toFixed(2) + ", " + (this.y).toFixed(2) + ", " + (this.z).toFixed(2) + ", " + this.w.toFixed(2) + ")";
    }

    /**
     * 
     * @param {String} axes the axis to return eg. "zyx"
     */
    vals(axes = "xyzw")
    {
        axes = axes.toUpperCase().split("");

        var returnArr = [];

        for(var i = 0; i < Math.min(axes.length, 4); i++)
        {
            switch(axes[i])
            {
                case "X":
                    returnArr.push(this.x);
                    break;
                case "Y":
                    returnArr.push(this.y);
                    break;
                case "Z":
                    returnArr.push(this.z);
                    break;
                case "W":
                    returnArr.push(this.w);
                    break;
                default:
                    console.warn("invalid axis: " + axes[i]);
                    return new Vector(0, 0, 0, 0);
            }
        }

        return new Vector(returnArr[0], returnArr[1], returnArr[2], returnArr[3]);
    }

//#region math

//#region operators

    /**
     * 
     * @param {Vector} vec 
     */
    add(vec)
    {
        return new Vector(this.x + vec.x, this.y + vec.y, this.z + vec.z, this.w + vec.w);
    }

    /**
     * 
     * @param {Number} scalar 
     */
    addScalar(scalar)
    {
        return new Vector(this.x + scalar, this.y + scalar, this.z + scalar, this.w + scalar);
    }

    /**
     * 
     * @param {Vector} vec 
     */
    sub(vec)
    {
        return new Vector(this.x - vec.x, this.y - vec.y, this.z - vec.z, this.w - vec.w);
    }

    /**
     * 
     * @param {Number} scalar 
     */
    subScalar(scalar)
    {
        return new Vector(this.x - scalar, this.y - scalar, this.z - scalar, this.w - scalar);
    }

    /**
     * 
     * @param {Vector} vec 
     */
    mult(vec)
    {
        return new Vector(this.x * vec.x, this.y * vec.y, this.z * vec.z, this.w * vec.w);
    }

    /**
     * 
     * @param {Number} scalar 
     */
    multScalar(scalar)
    {
        return new Vector(this.x * scalar, this.y * scalar, this.z * scalar, this.w * scalar);
    }

    /**
     * 
     * @param {Vector} vec 
     */
    div(vec)
    {
        return new Vector(this.x / vec.x, this.y / vec.y, this.z / vec.z, this.w / vec.w);
    }

    /**
     * 
     * @param {Number} scalar 
     */
    divScalar(scalar)
    {
        return new Vector(this.x / scalar, this.y / scalar, this.z / scalar, this.w / scalar);
    }

//#endregion operators

    magnitude()
    {
        return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z) + (this.w * this.w));
    }

    angles()
    {
        var vec = this.normalize();
        return new Vector(Math.asin(vec.x / 1), Math.asin(vec.y / 1), Math.asin(vec.z / 1), Math.asin(vec.w / 1));
    }

    /**
     * 
     * @param {Number} scalar 
     */
    setMagnitude(scalar)
    {
        return this.normalize().multScalar(scalar);
    }

    normalize()
    {
        if(this.magnitude() != 0)
        {
            return this.multScalar(1 / this.magnitude());
        }
        return new Vector(0, 0, 0, 0);
    }

    addInv()
    {
        return this.multScalar(-1);
    }

    multInv()
    {
        return new Vector(1 / this.x, 1 / this.y, 1 / this.z, 1 / this.w);
    }

    abs()
    {
        return new Vector(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z), Math.abs(this.w));
    }

//#region consts

    static zero()
    {
        return new Vector(0, 0, 0, 0);
    }

    static one()
    {
        return new Vector(1, 1, 1, 1);
    }

//#endregion consts

    normal2d()
    {
        return new Vector(-this.y, this.x, this.z, this.w).normalize();
    }

    /**
     * 
     * @param {Vector} rotation the angles to rotate around
     */
    rotate(rotation)
    {
        var result = new Vector(this.x, this.y, this.z, this.w);

        var rotMatX =
        [
            [1.0, 0.0, 0.0, 0.0],
            [0.0, Math.cos(rotation.x), -Math.sin(rotation.x), 0.0],
            [0.0, Math.sin(rotation.x), Math.cos(rotation.x), 0.0],
            [0.0, 0.0, 0.0, 1.0]
        ];
    
        var rotMatY =
        [
            [Math.cos(rotation.y), 0.0, Math.sin(rotation.y), 0.0],
            [0.0, 1.0, 0.0, 0.0],
            [-Math.sin(rotation.y), 0.0, Math.cos(rotation.y), 0.0],
            [0.0, 0.0, 0.0, 1.0]
        ];
    
        var rotMatZ =
        [
            [Math.cos(rotation.z), -Math.sin(rotation.z), 0.0, 0.0],
            [Math.sin(rotation.z), Math.cos(rotation.z), 0.0, 0.0],
            [0.0, 0.0, 1.0, 0.0],
            [0.0, 0.0, 0.0, 1.0]
        ];

        return result.multMat(rotMatX).multMat(rotMatY).multMat(rotMatZ);
    }

    /**
     * only works correct for rotation vectors
     */
    forward()
    {
        var forward = new Vector(0, 0, 1);

        return forward.rotate(new Vector(-this.x, -this.y, this.z)).normalize();
    }

    /**
     * only works correct for rotation vectors
     */
    left()
    {
        var forward = new Vector(1, 0, 0);

        return forward.rotate(new Vector(-this.x, -this.y, this.z)).normalize();
    }

//#endregion

//#region graphics
    /**
     * 
     * @param {Number[][]} mat 
     */
    multMat(mat)
    {
        var vec = [this.x, this.y, this.z, this.w];

        var res = new Array(4).fill(0);

        // x  y  z  w
        //00 00 00 00
        //00 00 00 00
        //00 00 00 00
        //00 00 00 00

        for(var i = 0; i < Math.min(mat.length, vec.length); i++)
        {
            for(var j = 0; j < Math.min(mat[i].length, vec.length); j++)
            {
                res[i] += vec[j] * mat[i][j];
            }
        }

        //console.log(res);

        return new Vector(res[0], res[1], res[2], res[3]);
    }

    reverse()
    {
        return new Vector(this.w, this.z, this.y, this.x);
    }
//#endregion
}

//sets the graphics object
class Graphics
{
    /**
     * 
     * @param {String} canvasID 
     * @returns {CanvasRenderingContext2D}
     */
    static createCanvas(canvasID)
    {
        var c = document.getElementById(canvasID);
        var canvas = c.getContext("2d");

        return canvas;
    }

    /**
     * 
     * @param {String} canvasID 
     */
    static clearCanvas(canvasID)
    {
        var c = document.getElementById(canvasID);

        this.createCanvas(canvasID).clearRect(0, 0, c.width, c.height);
    }

    /**
     * 
     * @param {String} canvasID 
     * @returns {Vector}
     */
    static getDimensions(canvasID)
    {
        var canvas = document.getElementById(canvasID);

        return new Vector(canvas.width, canvas.height);
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} canvas 
     * @param {Vector} startPos 
     * @param {Vector} endPos 
     * @param {String} strokeStyle 
     * @param {Number} lineWidth 
     * @param {String} lineCap butt, round, square
     */
    static drawLine(canvas, startPos, endPos, strokeStyle = "#ffffff", lineWidth = 5, lineCap = "butt")
    {
        canvas.beginPath();
        canvas.lineCap = lineCap;
        canvas.moveTo(startPos.x, startPos.y);
        canvas.lineWidth = lineWidth;
        canvas.strokeStyle = strokeStyle;
        canvas.lineTo(endPos.x, endPos.y);
        canvas.stroke();
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} canvas 
     * @param {Vector} startPos 
     * @param {Vector} dimensions 
     * @param {String} strokeStyle 
     * @param {Number} lineWidth 
     * @param {Boolean} fill 
     */
    static drawRect(canvas, startPos, dimensions, strokeStyle = "#ffffff", lineWidth = 0, fill = true)
    {
        canvas.beginPath();
        canvas.lineWidth = lineWidth;
        canvas.rect(startPos.x, startPos.y, dimensions.x, dimensions.y);

        if(fill)
        {
            canvas.fillStyle = strokeStyle;
            canvas.fill();
        }
        else
        {
            canvas.strokeStyle = strokeStyle;
            canvas.stroke();
        }
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} canvas 
     * @param {Vector[]} vertecies 
     * @param {String} strokeStyle 
     * @param {Number} lineWidth 
     * @param {Boolean} fill 
     */
    static drawPoly(canvas, vertecies, strokeStyle, lineWidth = 0, fill = true)
    {
        canvas.beginPath();
        canvas.lineWidth = lineWidth;
        canvas.moveTo(vertecies[0].x, vertecies[0].y);
        for(var i = 1; i < vertecies.length; i++)
        {
            canvas.lineTo(vertecies[i].x, vertecies[i].y);
        }

        canvas.closePath();
        if(fill)
        {
            canvas.fillStyle = strokeStyle;
            canvas.fill();
        }
        else
        {
            canvas.strokeStyle = strokeStyle;
            canvas.stroke();
        }
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} canvas 
     * @param {Vector} pos 
     * @param {String} text 
     * @param {String} font 
     * @param {Number} fontSize 
     * @param {String} fillStyle 
     * @param {String} textAlign 
     */
    static drawText(canvas, pos, text, font = "Arial", fontSize = 50, fillStyle = "#ffffff", textAlign = "left", rotation = 0)
    {
        canvas.save();

        canvas.translate(pos.x, pos.y);
        canvas.rotate(rotation);

        canvas.fillStyle = fillStyle;
        canvas.font = fontSize + "px " + font;

        canvas.textAlign = textAlign;

        canvas.fillText(text, 0, 0);

        canvas.restore();
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} canvas 
     * @param {Vector} center 
     * @param {Number} radius 
     * @param {String} strokeStyle 
     * @param {Number} lineWidth 
     * @param {Boolean} fill 
     */
    static drawCircle(canvas, center, radius, strokeStyle = "#ffffff", lineWidth = 0, fill = true)
    {
        canvas.beginPath();
        canvas.lineWidth = lineWidth;
        canvas.arc(center.x, center.y, radius, 0, Math.PI*2);

        if(fill)
        {
            canvas.fillStyle = strokeStyle;
            canvas.fill();
        }
        else
        {
            canvas.strokeStyle = strokeStyle;
            canvas.stroke();
        }
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} canvas 
     * @param {Vector} pos the position of the image on the canvas
     * @param {Number} size the size of the image on the canvas
     * @param {Vector} imagePos the offset of the original images cutout from the top
     * @param {Vector} imageSize the size of the cutout
     * @param {CanvasImageSource} image 
     */
    static drawImage(canvas, image, pos, size, imagePos = undefined, imageSize = undefined)
    {
        if(imagePos && imageSize)
        {
            canvas.drawImage(image, imagePos.x, imagePos.y, imageSize.x, imageSize.y, pos.x, pos.y, size.x, size.y);
        }
        else
        {
            canvas.drawImage(image, pos.x, pos.y, size.x, size.y);
        }
    }

    /**
     * translates coordinates to fit canvas
     * @param {String} canvasID 
     * @param {Vector} coords 
     */
    static translateCoords(canvasID, coords)
    {
        var canvas = document.getElementById(canvasID);

        var bounding = canvas.getBoundingClientRect();
    
        return new Vector((coords.x - bounding.left)*(canvas.width / bounding.width), (coords.y - bounding.top)*(canvas.height / bounding.height));
    }
}

class Mathf
{
    static sigmoid(input)
    {
        return 1 / (1 + Math.exp(-input));
    }

    static toDegrees(radians)
    {
        return radians / (Math.PI / 180);
    }

    static toRadians(degrees)
    {
        return degrees * (Math.PI / 180);
    }

    /**
     * clamps a value between min and max
     * @param {Number} val 
     * @param {Number} min 
     * @param {Number} max 
     */
    static clamp(val, min = 0, max = 1)
    {
        if(min > max)
        {
            console.error("min (" + min + ") cant be larger than max (" + max + ")");
            return 0;
        }

        val = (val < min) ? min : val;
        val = (val > max) ? max : val;

        return val;
    }
}

class Loader
{
    /**
     * 
     * @param {String} url 
     * @param {(ex : string, status : number, response : string)} callback 
     */
    static loadText(url, callback)
    {
        var req = new XMLHttpRequest();

        req.open("GET", url);

        req.onload = () =>
        {
            callback(null, req.status, req.responseText);
        }

        req.onerror = () =>
        {
            callback("error");
        }

        req.send();
    }

    /**
     * 
     * @param {String} url 
     */
    static loadTextSync(url)
    {
        var req = new XMLHttpRequest();

        req.open("GET", url, false);

        req.send();

        return req.responseText;
    }

    /**
     * 
     * @param {String[]} urls 
     * @param {(ex : string, statuses : number[], responses : string[])} callback 
     */
    // static loadTexts(urls, callback)
    // {
    //     Loader.loadText(urls[0], () =>
    //     {
    //         Loader.loadTexts();
    //     });
    // }

    static loadImg(url, callback)
    {
        var img = new Image();

        img.onload = () =>
        {
            callback(null, img);
        }

        img.onerror = (ex) =>
        {
            callback(ex);
        }

        img.src = url;
    }
}