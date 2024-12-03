# CS 405 - Project 2

This project demonstrates a WebGL-based 3D rendering tool for visualizing and interacting with 3D models. It includes functionalities for lighting, texturing, and camera manipulation.

---

## **Modifications Made**

### **1. Changes in `project2.js`**
Due to differences in the camera setup, the arrow key implementation logic was modified. The new logic inverts the direction of the arrow keys as follows:

```javascript
// Inverted arrow key logic due to the camera setup
if (keys['ArrowUp']) lightY += translationSpeed; // Instead of decrementing, it now increments
if (keys['ArrowDown']) lightY -= translationSpeed; // Instead of incrementing, it now decrements
if (keys['ArrowRight']) lightX += translationSpeed; // Instead of decrementing, it now increments
if (keys['ArrowLeft']) lightX -= translationSpeed; // Instead of incrementing, it now decrements
```

This change ensures that the arrow keys work as intended with the updated camera setup.

---

### **2. Changes in `project2.html`**
Two modifications were made:

1. **Disable Ambient Lighting on the Box**  
   - Added the following line at **line 51**:
     ```javascript
     gl.disableVertexAttribArray(meshDrawer.normalLoc); // Disable normals for the box
     ```
   - **Reason:** There was an issue where ambient lighting caused the box to disappear. This line ensures that ambient lighting does not affect the box.

2. **Added a Function for Specular Lighting**  
   - Added the following function to dynamically update the specular light intensity from a slider:
     ```javascript
     function SetSpecularLight(param) {
         // Dynamically fetch the specular light intensity from the slider
         meshDrawer.setSpecularLight(param.value); // Call the corresponding MeshDrawer method
         DrawScene(); // Redraw the scene with updated lighting
     }
     ```
   - **Reason:** This enables interactive adjustments of the specular light intensity.

---

## **Purpose of the Modifications**
These changes were made to resolve issues with the arrow key logic and lighting interactions, ensuring the tool functions as intended.

---

### **Additional Notes**
- The box now behaves correctly when ambient lighting is enabled.
- Specular lighting is fully adjustable through the UI slider.

