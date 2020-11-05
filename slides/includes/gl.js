class Shader
{
    /**
     * 
     * @param {WebGLRenderingContext} gl
     * @param {String} vertexSrc 
     * @param {String} fragmentSrc 
     */
    constructor(gl, vertexSrc, fragmentSrc)
    {
        this.vertexSrc = vertexSrc;
        this.fragmentSrc = fragmentSrc;

        this.program = Shader.createProgram(gl, [Shader.createShader(gl, vertexSrc, gl.VERTEX_SHADER), Shader.createShader(gl, fragmentSrc, gl.FRAGMENT_SHADER)]);
    }

    //#region staticCreate

    /**
     * 
     * @param {WebGLRenderingContext} gl 
     * @param {String} src 
     * @param {Number} type 
     */
    static createShader(gl, src, type)
    {
        var shader = gl.createShader(type);

        gl.shaderSource(shader, src);

        gl.compileShader(shader);

        type = (type == gl.VERTEX_SHADER) ? "Vertex" : type;
        type = (type == gl.FRAGMENT_SHADER) ? "Fragment" : type;

        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        {
            console.error("Shader of type " + type + " failed to compile: " + gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    /**
     * 
     * @param {WebGLRenderingContext} gl 
     * @param {WebGLShader[]} shaders 
     */
    static createProgram(gl, shaders)
    {
        var program = gl.createProgram();

        for(var i = 0; i < shaders.length; i++)
        {
            gl.attachShader(program, shaders[i]);
        }

        gl.linkProgram(program);

        if(!gl.getProgramParameter(program, gl.LINK_STATUS))
        {
            console.error("Program failed to get linked: " + gl.getProgramInfoLog(program));
        }

        return program;
    }

    //#endregion staticCreate

    //#region file

    /**
     * 
     * @param {WebGLRenderingContext} gl 
     * @param {String} vertexUrl 
     * @param {String} fragmentUrl 
     * @param {(ex : string, shader : Shader)} callback
     */
    static fromFile(gl, vertexUrl, fragmentUrl, callback)
    {
        Loader.loadText(vertexUrl, (exVert, statusVert, resVert) =>
        {
            if(exVert)
            {
                callback(exVert);
                return;
            }

            if(statusVert >= 200 && statusVert < 300)
            {
                Loader.loadText(fragmentUrl, (exFrag, statusFrag, resFrag) =>
                {
                    if(exFrag)
                    {
                        callback(exFrag);
                        return;
                    }

                    if(statusFrag >= 200 && statusFrag < 300)
                    {
                        var shader = new Shader(gl, resVert, resFrag);

                        callback(null, shader);
                    }
                    else
                    {
                        callback("couldnt load file: " + fragmentUrl + " response: " + statusFrag);
                    }
                });
            }
            else
            {
                callback("couldnt load file: " + vertexUrl + " response: " + statusVert);
            }
        });
    }

    //#endregion file

    /**
     * 
     * @param {WebGLRenderingContext} gl 
     */
    use(gl)
    {
        gl.useProgram(this.program);
    }
}

class VertexPointer
{
    /**
     * 
     * @param {Number} index 
     * @param {Number} size 
     * @param {Number} type 
     * @param {Boolean} normalized 
     * @param {Number} stride 
     * @param {Number} offset 
     */
    constructor(index, size, type, normalized, stride, offset)
    {
        this.index = index;
        this.size = size;
        this.type = type;
        this.normalized = normalized;
        this.stride = stride;
        this.offset = offset;
    }
}

class VBO
{
    /**
     * 
     * @param {WebGLRenderingContext} gl 
     * @param {Number[]} data 
     * @param {VertexPointer[]} pointers
     * @param {Number} vertexCount
     */
    constructor(gl, data, pointers, vertexCount)
    {
        this.handle = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.handle);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

        this.pointers = pointers;
        this.length = vertexCount;
    }

    /**
     * 
     * @param {WebGLRenderingContext} gl 
     * @param {Number[]} data 
     * @param {Number} type 
     */
    write(gl, data, vertexCount, usage = gl.DYNAMIC_DRAW)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.handle);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), usage);
        this.length = vertexCount;
    }

    /**
     * 
     * @param {WebGLRenderingContext} gl 
     */
    bind(gl)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.handle);

        for(var i = 0; i < this.pointers.length; i++)
        {
            gl.vertexAttribPointer(this.pointers[i].index, this.pointers[i].size, this.pointers[i].type, this.pointers[i].normalized, this.pointers[i].stride, this.pointers[i].offset);
            gl.enableVertexAttribArray(this.pointers[i].index);
        }
    }

    /**
     * 
     * @param {WebGLRenderingContext} gl 
     */
    unbind(gl)
    {
        console.warn("not implemented yet");
    }
}

class Vertex
{
    constructor(x, y, z = 0, r = 1, g = 1, b = 1)
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
        this.g = g;
        this.b = b;
    }

    /**
     * 
     * @param {WebGLRenderingContext} gl
     * @param {Vertex[]} vertecies 
     * @returns {VBO}
     */
    static toVbo(gl, vertecies)
    {
        var arr = new Array();

        for(var i = 0; i < vertecies.length; i++)
        {
            arr.push(vertecies[i].x);
            arr.push(vertecies[i].y);
            arr.push(vertecies[i].z);
            arr.push(vertecies[i].r);
            arr.push(vertecies[i].g);
            arr.push(vertecies[i].b);
        }

        const FLOAT_SIZE = 4;

        return new VBO(gl, arr, [new VertexPointer(0, 3, gl.FLOAT, false, 6 * FLOAT_SIZE, 0), new VertexPointer(1, 3, gl.FLOAT, false, 6 * FLOAT_SIZE, 3 * FLOAT_SIZE)], vertecies.length);
    }

    /**
     * 
     * @param {WebGLRenderingContext} gl 
     * @param {VBO} vbo 
     * @param {Vertex[]} vertecies 
     */
    static writeToVbo(gl, vbo, vertecies, usage = gl.DYNAMIC_DRAW)
    {
        var arr = new Array();

        for(var i = 0; i < vertecies.length; i++)
        {
            arr.push(vertecies[i].x);
            arr.push(vertecies[i].y);
            arr.push(vertecies[i].z);
            arr.push(vertecies[i].r);
            arr.push(vertecies[i].g);
            arr.push(vertecies[i].b);
        }

        vbo.write(gl, arr, vertecies.length, usage);
    }
}

class Mesh
{
    /**
     * 
     * @param {WebGLRenderingContext} gl 
     * @param {Vertex[]} vertecies 
     * @param {Shader} shader 
     */
    constructor(gl, vertecies, shader)
    {
        this.vbo = Vertex.toVbo(gl, vertecies);
        this.shader = shader;
        this.transformationLocation = gl.getUniformLocation(this.shader.program, "uTransformMat");
        this.aspectLocation = gl.getUniformLocation(this.shader.program, "uAspect");
        this.transformationMatrix =
        [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    }

    /**
     * 
     * @param {WebGLRenderingContext} gl 
     */
    draw(gl, offset = new Vector(0, 0), aspect = undefined, mode = gl.TRIANGLES)
    {
        if(!aspect)
        {
            aspect = (gl.canvas.width / gl.canvas.height);
        }

        this.shader.use(gl);
        this.vbo.bind(gl);


        this.transformationMatrix[3] = offset.x;
        this.transformationMatrix[7] = offset.y;
        this.transformationMatrix[11] = offset.z;
        
        gl.uniformMatrix4fv(this.transformationLocation, false, this.transformationMatrix);
        gl.uniform1f(this.aspectLocation, aspect);

        gl.drawArrays(mode, 0, this.vbo.length);
    }

    /**
     * 
     * @param {WebGLRenderingContext} gl 
     * @param {String} obj 
     * @param {Shader} shader 
     * @param {Number} scale
     */
    static fromObj(gl, obj, shader, scale = 1)
    {
        var vertecies = new Array();

        var indecies = new Array();

        var lines = obj.split("\n");

        //console.log(lines);

        for(var i = 0; i < lines.length; i++)
        {
            var words = lines[i].split(" ");
            //console.log(words);

            switch(words[0])
            {
                case "v":
                    vertecies.push(new Vertex(parseFloat(words[1]) * scale, parseFloat(words[2]) * scale, parseFloat(words[3]) * scale));
                    break;
                case "f":
                    //console.log("a");
                    indecies.push(parseInt(words[1].split("/")[0]));
                    indecies.push(parseInt(words[2].split("/")[0]));
                    indecies.push(parseInt(words[3].split("/")[0]));
                    break;
                // case "f":
                //     for(var i = 0; i < 3; i++)
                //     {
                //         //indecies.push(words[i + 1].split("/")[0]);
                //     }
                //     break;
                default:
                    break;
            }
        }

        var verts = new Array();

        for(var i = 0; i < indecies.length; i++)
        {
            verts.push(vertecies[indecies[i] - 1]);
        }

        //console.log(vertecies, indecies);
        var mesh = new Mesh(gl, verts, shader);

        return mesh;
    }
}

class Line extends Mesh
{
    /**
     * 
     * @param {WebGLRenderingContext} gl 
     * @param {Vertex[]} points
     * @param {Shader} shader 
     * @param {Number} width
     */
    constructor(gl, shader, points, width)
    {
        super(gl, points, shader);

        this.width = width;

        this.points = points;
    }

    /**
     * 
     * @param {WebGLRenderingContext} gl 
     * @param {Vector} from 
     * @param {Vector} to 
     * @param {Number} width 
     */
    draw(gl, offset = new Vector(0, 0), aspect = undefined)
    {
        //console.log(super.vbo);

        Vertex.writeToVbo(gl, this.vbo, this.points);

        super.draw(gl, offset, aspect, gl.LINES);
    }
}

class GlHelper
{
    /**
     * 
     * @param {String} id 
     * @returns {WebGLRenderingContext}
     */
    static getContext(id)
    {
        return document.getElementById(id).getContext("webgl");
    }
}