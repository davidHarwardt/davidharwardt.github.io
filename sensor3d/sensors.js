class Shader
{
    /**
     * 
     * @param {WebGLRenderingContext} gl 
     * @param {String} vertexSource 
     * @param {String} fragmentSource 
     */
    static createProgram(gl, vertexSource, fragmentSource)
    {
        const program = gl.createProgram();

        const vert = Shader.createShader(gl, gl.VERTEX_SHADER, vertexSource);
        const frag = Shader.createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

        gl.attachShader(program, vert);
        gl.attachShader(program, frag);
        gl.linkProgram(program);

        if(!gl.getProgramParameter(program, gl.LINK_STATUS))
        {
            console.error('Program: ' + gl.getProgramInfoLog(program));
            return null;
        }

        return program;
    }

    /**
     * 
     * @param {WebGLRenderingContext} gl 
     * @param {Number} type 
     * @param {String} source 
     */
    static createShader(gl, type, source)
    {
        const shader = gl.createShader(type);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        type = type === 35633 ? "Vertex" : type;
        type = type === 35632 ? "Fragment" : type;

        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        {
            console.error("Shader " + type + ": " + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    /**
     * 
     * @param {WebGLRenderingContext} gl 
     */
    static createBuffer(gl)
    {
        return gl.createBuffer();
    }

    /**
     * 
     * @param {WebGLRenderingContext} gl 
     * @param {WebGLBuffer} buffer 
     * @param {Number[]} data 
     * @param {Number} usage 
     */
    static writeBuffer(gl, buffer, data, usage = gl.STREAM_DRAW)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), usage);
    }
}

