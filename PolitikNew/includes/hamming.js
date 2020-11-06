class RecBuffer
{
    /**
     * 
     * @param {Boolean[]} data 
     */
    constructor(data)
    {
        this.data = data;
    }

    /**
     * 
     * @param {Boolean} bit 
     */
    add(bit)
    {
        this.data.push(bit);
    }

    getBlock(offset = Math.floor(this.data.length / 16) * 16)
    {
        //console.log(offset);
        return this.data.slice(offset, offset + 16);
    }
}

class Signal
{
    constructor()
    {
        /** @type {Vector[]} */
        this.points = new Array();
        this.startTime = Date.now();
    }

    rise()
    {
        this.points.push(new Vector((Date.now() - this.startTime) / 10, 0));
        this.points.push(new Vector((Date.now() - this.startTime) / 10, -1));
    }

    fall()
    {
        this.points.push(new Vector((Date.now() - this.startTime) / 10, -1));
        this.points.push(new Vector((Date.now() - this.startTime) / 10, 0));
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} canvas 
     * @param {Vector} size 
     * @param {Number} timeMult 
     */
    draw(canvas, size, heightMult = 1, timeMult = 1, color = "#ffffff", lineWidth = 2)
    {
        for(var i = 1; i < this.points.length; i++)
        {
            Graphics.drawLine(canvas, this.points[i - 1].mult(new Vector(1, heightMult)).add(new Vector((Date.now() - startTime - 10 * size.x) / -10, size.y)), this.points[i].mult(new Vector(1, heightMult)).add(new Vector((Date.now() - startTime - 10 * size.x) / -10, size.y)), color, lineWidth, "round");
        }

        if(this.points.length > 0)
        {
            Graphics.drawLine(canvas, this.points[this.points.length - 1].mult(new Vector(1, heightMult)).add(new Vector((Date.now() - startTime - 10 * size.x) / -10, size.y)), new Vector(size.x, this.points[this.points.length - 1].mult(new Vector(1, heightMult)).add(new Vector((Date.now() - startTime - 10 * size.x) / -10, size.y)).y), color, lineWidth, "round");
        }
    }
}

class HammingBlock
{
    /**
     * 
     * @param {Boolean[]} bits 
     */
    constructor(bits)
    {
        this.bits = bits;
    }

    decode()
    {
        var positions = new Array();

        for(var i = 0; i < 16; i++)
        {
            if(this.bits[i])
            {
                positions.push(BitwiseHelper.toBitArray(i, 4));
            }
        }

        var result = new Array(4).fill(false);

        for(var i = 0; i < positions.length; i++)
        {
            result = BitwiseHelper.xor(result, positions[i]);
        }

        var errorPos = BitwiseHelper.toNumber(result);

        var decoded = this.bits.slice();

        if(errorPos != 0)
        {
            var parity = 0;

            for(var i = 0; i < 16; i++)
            {
                parity += (this.bits[i] ? 1 : 0);
            }

            if((parity % 2) == 0)
            {
                console.log("2+ errors");
            }
            else
            {
                console.log("error at: " + errorPos);
                
                decoded[errorPos] = !decoded[errorPos];
            }
        }

        var correctedBits = new Array();

        for(var i = 0; i < 16; i++)
        {
            var logNum = Math.log2(i);
            if(logNum != Math.floor(logNum) && i != 0)
            {
                correctedBits.push(decoded[i]);
            }
        }

        return correctedBits;
    }

    getBits()
    {
        var bits = new Array();

        for(var i = 0; i < 16; i++)
        {
            var logNum = Math.log2(i);
            if(logNum != Math.floor(logNum) && i != 0)
            {
                bits.push(this.bits[i]);
            }
        }

        return bits;
    }
}

class BitwiseHelper
{
    /**
     * 
     * @param {Boolean[]} bitsA 
     * @param {Boolean[]} bitsB 
     */
    static xor(bitsA, bitsB)
    {
        var result = new Array(Math.min(bitsA.length, bitsB.length));

        for(var i = 0; i < result.length; i++)
        {
            result[i] = (bitsA[i] != bitsB[i]);
        }

        return result;
    }

    /**
     * 
     * @param {Number} number 
     * @returns {Boolean[]}
     */
    static toBitArray(number, length = (number != 0) ? Math.ceil(Math.log2(number)) : 1)
    {
        var outputArr = new Array(length);

        var currentBit = 0;

        while(number != 0)
        {
            outputArr[currentBit] = (number % 2) == 1;

            number = Math.floor(number / 2);

            currentBit++;
        }

        while(currentBit < length)
        {
            outputArr[currentBit] = false;

            currentBit++;
        }

        return outputArr.reverse();
    }

    /**
     * 
     * @param {Boolean[]} bits 
     */
    static toNumber(bits)
    {
        var outputNum = 0;

        for(var i = 0; i < bits.length; i++)
        {
            outputNum += (bits[i] ? 1 : 0) * (Math.pow(2, bits.length - 1 - i));
        }

        return outputNum;
    }
}