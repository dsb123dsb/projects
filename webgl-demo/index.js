/**
 * A very simple webGL demo,that it includes most of techniques of using WebGl--GLSL ES,basic animation,
 * texture,light and shadow--delivers a introduction on allmost everything you need to get going.
 */

// Vertex shader program for generating a shadow map
var SHADOW_VSHADER_SOURCE =
	'attribute vec4 a_Position;\n' +
	'uniform mat4 u_MvpMatrix;\n' +
	'void main() {\n' +
	'  gl_Position = u_MvpMatrix * a_Position;\n' +
	'}\n';

// Fragment shader program for generating a shadow map
var SHADOW_FSHADER_SOURCE =
	'#ifdef GL_ES\n' +
	'precision mediump float;\n' +
	'#endif\n' +
	'void main() {\n' +
	'  gl_FragColor = vec4(gl_FragCoord.z, 0.0, 0.0, 1.0);\n' + // Write the z-value in R
	'}\n';

//shaders program for main view
var VSHADER_SOURCE=
	'attribute vec4 a_Position;\n'+
	'attribute vec4 a_Color;\n'+
	'attribute vec2 a_TexCoord;\n'+
	'attribute vec4 a_Normal;\n'+
	'uniform mat4 u_MvpMatrixFromLight;\n' +
	'varying vec4 v_PositionFromLight;\n' +
	'varying vec2 v_TexCoord;\n'+
	'uniform mat4 u_MvpMatrix;\n' +
	'varying vec4 v_Color;\n'+
	'varying vec4 v_Normal;\n'+
	'varying vec4 v_Position;\n'+
	'void main(){\n'+
		'gl_Position=u_MvpMatrix*a_Position;\n'+
		'v_TexCoord=a_TexCoord;\n'+
		'v_Color=a_Color;\n'+
		'v_Normal=a_Normal;\n'+
		'v_Position=a_Position;\n'+
		'v_PositionFromLight = u_MvpMatrixFromLight * a_Position;\n' +
	'}\n';
var FSHADER_SOURCE=
	'#ifdef GL_ES\n' +
	'precision highp float;\n' +
	'#endif\n' +
	'uniform vec4 u_lightPosition;\n'+
	'uniform sampler2D u_Sampler;\n'+
	'uniform mat4 u_NormalMatrix;\n'+
	'uniform sampler2D u_ShadowMap;\n' +
	'uniform int u_Ifcolor;\n' +
	'varying vec2 v_TexCoord;\n'+
	'varying vec4 v_Color;\n'+
	'varying vec4 v_Normal;\n'+
	'varying vec4 v_Position;\n'+
	'varying vec4 v_PositionFromLight;\n' +
	'void main(){\n'+
		'vec3 shadowCoord = (v_PositionFromLight.xyz/v_PositionFromLight.w)/2.0 + 0.5;\n' +
		'vec4 rgbaDepth = texture2D(u_ShadowMap, shadowCoord.xy);\n' +
		'float depth = rgbaDepth.r;\n' + // Retrieve the z-value from R
		'float visibility = (shadowCoord.z > depth+0.005) ? 0.4 : 1.0;\n' +
		'vec3 environment=vec3(0.5,0.5,0.5);\n'+
		'vec3 LightColor=vec3(1.0,1.0,1.0);\n'+
		'vec3 normal=normalize(vec3(u_NormalMatrix*v_Normal));\n'+
		'vec3 LightDirection=normalize(vec3(u_lightPosition)-vec3(v_Position));\n'+
		'float nDotL=max(dot(LightDirection,normal),0.0);\n'+
		'vec3 diffuse;\n'+
		'vec3 environmentColor;\n'+
		'if(u_Ifcolor!=0){\n'+
			'diffuse=LightColor*vec3(texture2D(u_Sampler,v_TexCoord))*nDotL*visibility;\n'+
			'environmentColor=environment*vec3(texture2D(u_Sampler,v_TexCoord));\n'+
		'}else{\n'+
			'diffuse=LightColor*vec3(v_Color)*nDotL*visibility;\n'+
			'environmentColor=environment*vec3(v_Color);\n'+
		'}\n'+
		'gl_FragColor =vec4(diffuse+environmentColor,1.0);\n'+
    '}\n';
var OFFSCREEN_WIDTH = 1024;
var OFFSCREEN_HEIGHT = 1024;
function startDraw(){
	// Retrieve <canvas> element
	var canvas1=document.getElementById('canvas1');
	// Get the rendering context for WebGL
	var gl=getWebGLContext(canvas1);
	if(!gl){
		console.log("failed to get context");
		return;
	}
	// Set the clear color and enable the depth test
	gl.clearColor(0.0,0.0,0.0,1.0);
	gl.enable(gl.DEPTH_TEST);
	//Set viewport
	gl.viewport(0, 0, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT); 

	// Initialize shaders for regular drawing
	var realProgram=initProgram(gl,VSHADER_SOURCE,FSHADER_SOURCE);
  	var realMatrix = new Matrix4();
	realMatrix.setPerspective(45, 1, 1, 100);
	realMatrix.lookAt(3.0, 3.0, 6.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
	realProgram.a_Position=gl.getAttribLocation(realProgram,'a_Position');
	realProgram.a_Color=gl.getAttribLocation(realProgram,'a_Color');
	realProgram.a_TexCoord=gl.getAttribLocation(realProgram,'a_TexCoord');
	realProgram.a_Normal=gl.getAttribLocation(realProgram,'a_Normal');
	realProgram.u_Sampler=gl.getUniformLocation(realProgram,'u_Sampler');
	realProgram.u_lightPosition=gl.getUniformLocation(realProgram,'u_lightPosition');
	realProgram.u_NormalMatrix=gl.getUniformLocation(realProgram,'u_NormalMatrix');
	realProgram.u_MvpMatrix=gl.getUniformLocation(realProgram,'u_MvpMatrix');
	realProgram.u_ShadowMap=gl.getUniformLocation(realProgram,'u_ShadowMap');
	realProgram.u_Ifcolor=gl.getUniformLocation(realProgram,'u_Ifcolor');
	realProgram.u_MvpMatrixFromLight=gl.getUniformLocation(realProgram,'u_MvpMatrixFromLight');

	// Initialize shaders for generating a shadow map
	var shadowProgram=initProgram(gl,SHADOW_VSHADER_SOURCE,SHADOW_FSHADER_SOURCE);
	var shadowMatrix=new Matrix4();
	shadowMatrix.setPerspective(70, 1, 1, 100);
	shadowMatrix.lookAt(5.0, 5.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
	shadowProgram.a_Position=gl.getAttribLocation(shadowProgram,'a_Position');
	shadowProgram.u_MvpMatrix=gl.getUniformLocation(shadowProgram,'u_MvpMatrix');

	// Initialize framebuffer object (FBO)  
	var fbo = initFramebufferObject(gl);
	// Initialize objects 
	var square=initSquare(gl);
	var cube=initCube(gl);
	// Calculate the matrix
	square.matrix.rotate(-90,1.0,0.0,1.0).scale(2.0,2.0,2.0).translate(-1.0,0.0,0.0);
	cube.matrix.scale(0.3,0.3,0.3).translate(0.0,6.0,2.0);

	//Animation function
	var tick=function(){
		cube.matrix.rotate(2,0.0,1.0,1.0);
		//Move the eye point to the position of the light source and draw objects from there.
		gl.useProgram(shadowProgram);
		gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
		gl.viewport(0, 0,OFFSCREEN_WIDTH, OFFSCREEN_WIDTH); 
	    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		draw(gl,shadowProgram,square,shadowMatrix);
		draw(gl,shadowProgram,cube,shadowMatrix);
		
		//Move the eye point back to the position from which you want to view the objects and draw them from there.
		gl.useProgram(realProgram);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D,fbo.texture);
		gl.uniform1i(realProgram.u_ShadowMap, 1);
		gl.uniform4f(realProgram.u_lightPosition,5.0,9.0,5.0,1.0);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null); 
		gl.viewport(0, 0, 400, 400); 
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		//draw square
		var squareM=new Matrix4();
		squareM.set(shadowMatrix);
		squareM.multiply(square.matrix);
		gl.uniformMatrix4fv(realProgram.u_MvpMatrixFromLight, false, squareM.elements);
		draw(gl,realProgram,square,realMatrix);
		//draw cube
		var cubeM=new Matrix4();
		cubeM.set(shadowMatrix);
		cubeM.multiply(cube.matrix);
		gl.uniformMatrix4fv(realProgram.u_MvpMatrixFromLight, false, cubeM.elements);
		draw(gl,realProgram,cube,realMatrix);
	 	window.requestAnimationFrame(tick, canvas1);
	 }
	 //go
	 tick();
}
//initSquare
function initSquare(gl){
	// Vertex coordinates
	var squareVertex=new Float32Array([
			0.0,1.0,0.0,
			0.0,-1.0,0.0,
			1.5,-1.0,0.0,
			1.5,1.0,0.0
		]);
	var squareColors=new Float32Array([
			0.5,0.5,0.5,
			0.5,0.5,0.5,
			0.5,0.5,0.5,
			0.5,0.5,0.5
		]);
	var squareIndice=new Uint8Array([
			0,1,2,
			0,2,3
		]);
	var squareCoord=new Float32Array([
			0.0,1.0,
			0.0,0.0,
			1.0,0.0,
			1.0,1.0
		]);
	var squareNormal=new Float32Array([
			0.0,0.0,1.0,
			0.0,0.0,1.0,
			0.0,0.0,1.0,
			0.0,0.0,1.0,
			0.0,0.0,1.0,
			0.0,0.0,1.0
		]);
	var mMatrix=new Matrix4();
	mMatrix.setTranslate(0.0,0.0,0.0);
	var nMatrix=new Matrix4();
	nMatrix.setInverseOf(mMatrix);
	 nMatrix.transpose();
	var square={
		'vertex':initBuffer(gl,squareVertex),
		'colors':initBuffer(gl,squareColors),
		'indice':initElementBuffer(gl,squareIndice),
		'normal':initBuffer(gl,squareNormal),
		'coord':initBuffer(gl,squareCoord),
		'vertexNumber':squareIndice.length,
		'matrix':mMatrix,
		'normalMatrix':nMatrix,
		'ifcolor':0,
	}
	return square;
}
//initCube
function initCube(gl){
	var cubeVertex=new Float32Array([
		 1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
	     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
	     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
	     -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
	     -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
	     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0     // v4-v7-v6-v5 back
		]);
	var cubeColors=new Float32Array([
		0.2, 0.58, 0.82,   0.2, 0.58, 0.82,   0.2,  0.58, 0.82,  0.2,  0.58, 0.82, // v0-v1-v2-v3 front
	    0.5,  0.41, 0.69,  0.5, 0.41, 0.69,   0.5, 0.41, 0.69,   0.5, 0.41, 0.69,  // v0-v3-v4-v5 right
	    0.0,  0.32, 0.61,  0.0, 0.32, 0.61,   0.0, 0.32, 0.61,   0.0, 0.32, 0.61,  // v0-v5-v6-v1 up
	    0.78, 0.69, 0.84,  0.78, 0.69, 0.84,  0.78, 0.69, 0.84,  0.78, 0.69, 0.84, // v1-v6-v7-v2 left
	    0.32, 0.18, 0.56,  0.32, 0.18, 0.56,  0.32, 0.18, 0.56,  0.32, 0.18, 0.56, // v7-v4-v3-v2 down
	    0.73, 0.82, 0.93,  0.73, 0.82, 0.93,  0.73, 0.82, 0.93,  0.73, 0.82, 0.93, // v4-v7-v6-v5 back
		]);
	var cubeIndice=new Uint8Array([
		0, 1, 2,   0, 2, 3,    // front
	    4, 5, 6,   4, 6, 7,    // right
	    8, 9,10,   8,10,11,    // up
	    12,13,14,  12,14,15,    // left
	    16,17,18,  16,18,19,    // down
	    20,21,22,  20,22,23     // back
		]);
	var cubeNormal=new Float32Array([
		0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
	    1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
	    0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
	   -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
	    0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
	    0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
		]);
	var cubeCoord=new Float32Array([
		1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v0-v1-v2-v3 front
	    0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // v0-v3-v4-v5 right
	    1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // v0-v5-v6-v1 up
		1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v1-v6-v7-v2 left
		0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // v7-v4-v3-v2 down
		0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     // v4-v7-v6-v5 back
		]);
	var image=document.getElementById('image');
	var mMatrix=new Matrix4();
	mMatrix.setTranslate(0.0,0.0,0.0);
	var nMatrix=new Matrix4();
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();
	var cube={
		'vertex':initBuffer(gl,cubeVertex),
		'colors':initBuffer(gl,cubeColors),
		'indice':initElementBuffer(gl,cubeIndice),
		'normal':initBuffer(gl,cubeNormal),
		'coord':initBuffer(gl,cubeCoord),
		'texture':initTexture(gl,image),
		'vertexNumber':cubeIndice.length,
		'matrix':mMatrix,
		'normalMatrix':nMatrix,
		'ifcolor':1,
	}
	return cube;
}
//draw
function draw(gl,realProgram,element,mMatrix){
	var tempMatrix=new Matrix4();
	tempMatrix.set(mMatrix);
	tempMatrix.multiply(element.matrix);
	gl.uniformMatrix4fv(realProgram.u_MvpMatrix, false, tempMatrix.elements);
	if (realProgram.u_NormalMatrix != undefined){
		gl.uniformMatrix4fv(realProgram.u_NormalMatrix, false, element.normalMatrix.elements);
	}
	gl.bindBuffer(gl.ARRAY_BUFFER,element.vertex);
	gl.vertexAttribPointer(realProgram.a_Position,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(realProgram.a_Position);
	if(realProgram.a_TexCoord!=undefined){
		gl.bindBuffer(gl.ARRAY_BUFFER,element.coord);
		gl.vertexAttribPointer(realProgram.a_TexCoord,2,gl.FLOAT,false,0,0);
		gl.enableVertexAttribArray(realProgram.a_TexCoord);
	}
	if(realProgram.a_Normal!=undefined){
		gl.bindBuffer(gl.ARRAY_BUFFER,element.normal);
		gl.vertexAttribPointer(realProgram.a_Normal,3,gl.FLOAT,false,0,0);
		gl.enableVertexAttribArray(realProgram.a_Normal);
	}
	if(realProgram.a_Color!=undefined){
		gl.bindBuffer(gl.ARRAY_BUFFER,element.colors);
		gl.vertexAttribPointer(realProgram.a_Color,3,gl.FLOAT,false,0,0);
		gl.enableVertexAttribArray(realProgram.a_Color);
	}
	if(realProgram.u_Sampler!=undefined && element.ifcolor!=0){
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D,element.texture);
		gl.uniform1i(realProgram.u_Sampler, 0);
	}
	gl.uniform1i(realProgram.u_Ifcolor, element.ifcolor);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,element.indice);
	gl.drawElements(gl.TRIANGLES,element.vertexNumber,gl.UNSIGNED_BYTE,0);
}
function initBuffer(gl,array){
	var buffer=gl.createBuffer();
	if (!buffer) {
	    console.log('Failed to create the buffer object');
	    return null;
    }
	gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
	gl.bufferData(gl.ARRAY_BUFFER,array,gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);
	return buffer;
}
function initElementBuffer(gl,array){
	var buffer=gl.createBuffer();
	if (!buffer) {
	    console.log('Failed to create the buffer object');
	    return null;
    }
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,array,gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
	return buffer;
}
function initTexture(gl,image){
    var texture=gl.createTexture();
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D,texture);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);
	gl.bindTexture(gl.TEXTURE_2D,null);
	return texture;
}

function initFramebufferObject(gl) {
	var framebuffer, texture, depthBuffer;
	framebuffer = gl.createFramebuffer();
	texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	framebuffer.texture = texture;
	depthBuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);
	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
	var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
	if (gl.FRAMEBUFFER_COMPLETE !== e) {
	    console.log('Frame buffer object is incomplete: ' + e.toString());
	    return error();
	}
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	return framebuffer;
}