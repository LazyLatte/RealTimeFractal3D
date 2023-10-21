import fractalDE from "../DE";
import shadingFunctions from "../shading";
export const fs = `
    #define MAX_PARAM_NUM 10
    precision mediump float;
    uniform vec2 iResolution;
    uniform int fractal;
    uniform float params[MAX_PARAM_NUM];
    uniform vec3 camera;
    uniform vec3 front;
    uniform bool juliaEnabled;
    uniform vec3 julia;
    uniform vec3 palette_seed;
    uniform float decayCoeff;
    uniform float fogDensity;
    uniform bool neon;
    uniform float eps;
    uniform float ray_multiplier;
    
    const int ray_step = 2000;
    const float FOV = 1.0;
    const float far_plane = 10.0;
    const float PI = 3.14159265;
    const float gloss = 16.0;
    const vec3 lightColor = vec3(1.0);
    const vec3 fogColor = vec3(1.0);
    ${fractalDE}
    ${shadingFunctions}
    void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - iResolution) / iResolution.y;
        vec3 right = normalize(cross(front, vec3(0.0, 0.0, 1.0)));
        vec3 up = normalize(cross(right, front));
        vec3 ray_dir = normalize(uv.x * right + uv.y * up + FOV * front);

        float dist = 0.0;
        float orbit = 0.0;
        for(int i=0; i<ray_step; i++){
            vec2 map = fractalDE(camera + dist * ray_dir);
            float DE = map.x;
            orbit = map.y;
            if(abs(DE) < eps || dist > far_plane) break;
            dist += DE * ray_multiplier;
        }

        vec3 color = vec3(0.0);
        if(dist < far_plane){
            vec3 v = camera + dist * ray_dir;
            vec3 L = -front;
            vec3 N = normalize(vec3(
                fractalDE(v + vec3(eps, 0.0, 0.0))[0] - fractalDE(v - vec3(eps, 0.0, 0.0))[0],
                fractalDE(v + vec3(0.0, eps, 0.0))[0] - fractalDE(v - vec3(0.0, eps, 0.0))[0],
                fractalDE(v + vec3(0.0, 0.0, eps))[0] - fractalDE(v - vec3(0.0, 0.0, eps))[0]
            ));
            vec3 H = normalize(L - ray_dir);
            vec3 lin = vec3(0.0);
            vec3 ambient = vec3(0.1);
            vec3 diffuse = lightColor * clamp(dot(L, N), 0.0, 1.0);
            vec3 specular = diffuse * pow(clamp(dot(H, N), 0.0, 1.0), gloss);
            
            color = palette(orbit, palette_seed);
            color = neon ? 0.01 / color : color;

            lin += ambient;
            lin += diffuse;
            color *= lin;
            color += (0.4 * specular);
            color = lightIntensityDecay(color, dist);
        }
        color = fog(color, min(dist, far_plane));
        color = gammaCorrection(color);
        gl_FragColor = vec4(color, 1);
    }
`


 