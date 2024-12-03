/**
 * @Instructions
 * 		@task1 : Complete the setTexture function to handle non power of 2 sized textures
 * 		@task2 : Implement the lighting by modifying the fragment shader, constructor,
 *      @task3: 
 *      @task4: 
 * 		setMesh, draw, setAmbientLight, setSpecularLight and enableLighting functions 
 */


function GetModelViewProjection(projectionMatrix, translationX, translationY, translationZ, rotationX, rotationY) {
	
	var trans1 = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		translationX, translationY, translationZ, 1
	];
	var rotatXCos = Math.cos(rotationX);
	var rotatXSin = Math.sin(rotationX);

	var rotatYCos = Math.cos(rotationY);
	var rotatYSin = Math.sin(rotationY);

	var rotatx = [
		1, 0, 0, 0,
		0, rotatXCos, -rotatXSin, 0,
		0, rotatXSin, rotatXCos, 0,
		0, 0, 0, 1
	]

	var rotaty = [
		rotatYCos, 0, -rotatYSin, 0,
		0, 1, 0, 0,
		rotatYSin, 0, rotatYCos, 0,
		0, 0, 0, 1
	]

	var test1 = MatrixMult(rotaty, rotatx);
	var test2 = MatrixMult(trans1, test1);
	var mvp = MatrixMult(projectionMatrix, test2);

	return mvp;
}


class MeshDrawer {
	// The constructor is a good place for taking care of the necessary initializations.
	constructor() {
		this.prog = InitShaderProgram(meshVS, meshFS);
		this.mvpLoc = gl.getUniformLocation(this.prog, 'mvp');
		this.showTexLoc = gl.getUniformLocation(this.prog, 'showTex');

		this.colorLoc = gl.getUniformLocation(this.prog, 'color');

		this.vertPosLoc = gl.getAttribLocation(this.prog, 'pos');
		this.texCoordLoc = gl.getAttribLocation(this.prog, 'texCoord');


		this.vertbuffer = gl.createBuffer();
		this.texbuffer = gl.createBuffer();

		this.numTriangles = 0;

		/**
		 * @Task2 : You should initialize the required variables for lighting here
		 */
		this.enableLightingLoc = gl.getUniformLocation(this.prog, 'enableLighting');//to toggle lighting on/off
   		this.ambientLoc = gl.getUniformLocation(this.prog, 'ambient');//for ambient lighting intensity
    	this.lightPosLoc = gl.getUniformLocation(this.prog, 'lightPos');// for the position of the light source

		this.normalLoc = gl.getAttribLocation(this.prog, 'normal'); // Attribute location for normals


		this.shininessLoc = gl.getUniformLocation(this.prog, 'shininess'); // Uniform for shininess factor

		console.log('enableLightingLoc:', this.enableLightingLoc);
		console.log('ambientLoc:', this.ambientLoc);
		console.log('lightPosLoc:', this.lightPosLoc);
		console.log('normalLoc:', this.normalLoc);

		//this.viewPositionLoc = gl.getUniformLocation(this.prog, 'uViewPosition'); // Add this line(maybe I am not allowed to do so)


		
		//thease are the default values(I may not need them, I can remove these later)
		gl.useProgram(this.prog);
		//gl.uniform1i(this.enableLightingLoc, false); // Enable lighting by default
		//gl.uniform1f(this.ambientLoc, 0.5); // Default ambient intensity
		//gl.uniform3f(this.lightPosLoc, 0.0, 0.0, 1.0); // Default light position
		gl.uniform1f(this.shininessLoc, 4);
		gl.uniform3f(this.colorLoc, 1.0, 1.0, 1.0); // Default material color (white)
		//gl.uniform3fv(this.viewPositionLoc, [0.0, 0.0, 3.0]); // Set default camera position(again I may not be allowed to do so)


		
	}

	setMesh(vertPos, texCoords, normalCoords) {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);

		// update texture coordinates
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

		this.numTriangles = vertPos.length / 3;

		/**
		 * @Task2 : You should update the rest of this function to handle the lighting
		 */
		this.normalBuffer = gl.createBuffer();//a new buffer for the normals
    	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalCoords), gl.STATIC_DRAW);

	}

	// This method is called to draw the triangular mesh.
	// The argument is the transformation matrix, the same matrix returned
	// by the GetModelViewProjection function above.
	draw(trans) {
		gl.useProgram(this.prog);

		gl.uniformMatrix4fv(this.mvpLoc, false, trans);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
		gl.enableVertexAttribArray(this.vertPosLoc);
		gl.vertexAttribPointer(this.vertPosLoc, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.texbuffer);
		gl.enableVertexAttribArray(this.texCoordLoc);
		gl.vertexAttribPointer(this.texCoordLoc, 2, gl.FLOAT, false, 0, 0);

		/**
		 * @Task2 : You should update this function to handle the lighting
		 */
		

		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
		gl.enableVertexAttribArray(this.normalLoc); // this works because of the modification in project2.html line 51
		gl.vertexAttribPointer(this.normalLoc, 3, gl.FLOAT, false, 0, 0);

		// Set lighting uniforms
		//gl.uniform1i(this.enableLightingLoc, true); // Enable lighting
		/*
		// Dynamically fetch ambient light intensity from the slider
		const ambientValue = document.getElementById('ambient-light-setter').value / 100; // Normalize to [0, 1]
		gl.uniform1f(this.ambientLoc, ambientValue); // Set ambient light intensity dynamically
		*/

		// Set light position
		gl.uniform3f(this.lightPosLoc, lightX, lightY, 0.0); // Set light position
		//gl.uniform1f(this.shininessLoc, 4);
		///////////////////////////////
		

		updateLightPos();
		gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles);


	}

	// This method is called to set the texture of the mesh.
	// The argument is an HTML IMG element containing the texture data.
	setTexture(img) {
		const texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);

		// You can set the texture image data using the following command.
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGB,
			gl.RGB,
			gl.UNSIGNED_BYTE,
			img);

		// Set texture parameters 
		if (isPowerOf2(img.width) && isPowerOf2(img.height)) {
			gl.generateMipmap(gl.TEXTURE_2D);
		} else {
			//console.error("Task 1: Non power of 2, you should implement this part to accept non power of 2 sized textures");
			/**
			 * @Task1 : You should implement this part to accept non power of 2 sized textures
			 */
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);//Ensures that texture coordinates outside the range [0,1] are clamped to the edges of the texture.
    		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);//Ensures that texture coordinates outside the range [0,1] are clamped to the edges of the texture. 
    		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);//Sets the texture filtering for when the texture is smaller than the rendered area. 
    		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);//Sets the texture filtering for when the texture is larger than the rendered area.
		}

		gl.useProgram(this.prog);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		const sampler = gl.getUniformLocation(this.prog, 'tex');
		gl.uniform1i(sampler, 0);
	}

	showTexture(show) {
		gl.useProgram(this.prog);
		gl.uniform1i(this.showTexLoc, show);
	}

	enableLighting(show) {
		//console.error("Task 2: You should implement the lighting and implement this function ");
		/**
		 * @Task2 : You should implement the lighting and implement this function
		 */
		console.log('Setting enableLighting to:', show);//remove this later on
		gl.useProgram(this.prog);
    	gl.uniform1i(this.enableLightingLoc, show);

	}
	
	setAmbientLight(ambient) {
		//console.error("Task 2: You should implement the lighting and implement this function ");
		/**
		 * @Task2 : You should implement the lighting and implement this function
		 */
		console.log('Ambient light updated to:', ambient);//remove this later on
		gl.useProgram(this.prog);
    	gl.uniform1f(this.ambientLoc, ambient);
		
	}
	//added this new function
	setSpecularLight(intensity) {
		console.log('Specular light intensity updated to:', intensity); // Debug log
		gl.useProgram(this.prog);
		gl.uniform1f(this.shininessLoc, intensity); // Update the shader uniform for specular intensity
	}
	
}


function isPowerOf2(value) {
	return (value & (value - 1)) == 0;
}

function normalize(v, dst) {
	dst = dst || new Float32Array(3);
	var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
	// make sure we don't divide by 0.
	if (length > 0.00001) {
		dst[0] = v[0] / length;
		dst[1] = v[1] / length;
		dst[2] = v[2] / length;
	}
	return dst;
}

// Vertex shader source code
const meshVS = `
			attribute vec3 pos; 
			attribute vec2 texCoord; 
			attribute vec3 normal;

			uniform mat4 mvp; 

			varying vec2 v_texCoord; 
			varying vec3 v_normal; 

			void main()
			{
				v_texCoord = texCoord;
				v_normal = normal;

				gl_Position = mvp * vec4(pos,1);
			}`;

// Fragment shader source code
/**
 * @Task2 : You should update the fragment shader to handle the lighting
 */
const meshFS = `
			precision mediump float;

			uniform bool showTex;
			uniform bool enableLighting;
			uniform sampler2D tex;
			uniform vec3 color; 
			uniform vec3 lightPos;
			uniform float ambient;
			uniform float shininess;// New uniform for material shininess

			varying vec2 v_texCoord;
			varying vec3 v_normal;

			void main()
			{
				if(showTex && enableLighting){
					// UPDATE THIS PART TO HANDLE LIGHTING

					// Fetch the texture color
					vec4 texColor = texture2D(tex, v_texCoord);

					// Normalize the normal vector
					vec3 norm = normalize(v_normal);

					// Compute light direction
					vec3 lightDir = normalize(lightPos);

					// Compute the ambient light
					vec3 ambientLight = ambient * color;

					// Compute the diffuse light (Lambertian reflection)
					float diff = max(dot(norm, lightDir), 0.0);
					vec3 diffuseLight = diff * color;

					// Compute the view direction (assuming the camera is at (0,0,-1))
					vec3 viewDir = normalize(vec3(0.0, 0.0, -1.0)); // Adjust if camera changes

					// Compute the reflection vector
					vec3 reflectDir = reflect(-lightDir, norm);

					// Compute the specular highlight using Phong model
					float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
					vec3 specularLight = spec * color;

					// Combine all lighting components
					vec3 finalLight = ambientLight + diffuseLight+ specularLight;

					// Combine lighting with texture color
					gl_FragColor = vec4(texColor.rgb * finalLight, texColor.a);
				}
				else if(showTex){
					gl_FragColor = texture2D(tex, v_texCoord);
				}
				else{
					gl_FragColor =  vec4(1.0, 0, 0, 1.0);
				}
			}`;

// Light direction parameters for Task 2
var lightX = 1;
var lightY = 1;

const keys = {};
function updateLightPos() {
	const translationSpeed = 1;
	/*
	if (keys['ArrowUp']) lightY -= translationSpeed;
	if (keys['ArrowDown']) lightY += translationSpeed;
	if (keys['ArrowRight']) lightX -= translationSpeed;
	if (keys['ArrowLeft']) lightX += translationSpeed;
	*/
	//since my camera setup was different I inverted the arrow update logic
	if (keys['ArrowUp']) lightY += translationSpeed; // Inverted logic(instead of decrement we now increment)
	if (keys['ArrowDown']) lightY -= translationSpeed; // Inverted logic(instead of increment we now decrement)
	if (keys['ArrowRight']) lightX += translationSpeed; // Inverted logic(instead of decrement we now increment)
	if (keys['ArrowLeft']) lightX -= translationSpeed; // Inverted logic(instead of increment we now decrement)

}

///////////////////////////////////////////////////////////////////////////////////