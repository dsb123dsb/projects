function initProgram(gl, vshader, fshader) {
	var program = createProgram(gl, vshader, fshader);
	if (!program) {
	    console.log('Failed to create program');
	    return false;
	}
	return program;
}
function createProgram(gl, vshader, fshader) {
	var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
	var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
	if (!vertexShader || !fragmentShader) {
		return null;
	}
	var program = gl.createProgram();
	if (!program) {
		return null;
	}
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);

	gl.linkProgram(program);
	var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (!linked) {
		var error = gl.getProgramInfoLog(program);
		console.log('Failed to link program: ' + error);
		gl.deleteProgram(program);
		gl.deleteShader(fragmentShader);
		gl.deleteShader(vertexShader);
		return null;
	}
		return program;
}
function loadShader(gl, type, source) {
	var shader = gl.createShader(type);
	if (shader == null) {
		console.log('unable to create shader');
		return null;
	}
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (!compiled) {
		var error = gl.getShaderInfoLog(shader);
		console.log('Failed to compile shader: ' + error);
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}
function getWebGLContext(canvas, opt_debug) {
	var gl = create3DContext(canvas);
	if (!gl) return null;
	return gl;
}
var create3DContext = function(canvas, opt_attribs) {
	var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
	var context = null;
	for (var ii = 0; ii < names.length; ++ii) {
		try {
			context = canvas.getContext(names[ii], opt_attribs);
		} catch(e) {}
		if (context) {
			break;
		}
	}
	return context;
}