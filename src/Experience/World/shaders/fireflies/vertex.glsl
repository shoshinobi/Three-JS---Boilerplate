uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;

attribute float aScale;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += sin(uTime + modelPosition.x * 100.0) * aScale * 0.1;


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    // Set the vertex position
    gl_Position = projectionPosition;
    // Adjust the point size based on device pixel ratio
    gl_PointSize = uSize * aScale * uPixelRatio;
    // Adjust the point size based on distance from camera
    gl_PointSize *= (1.0 / -viewPosition.z);
}