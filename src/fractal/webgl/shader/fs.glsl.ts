import fractalDE from "../DE";
import shadingFunctions from "../shading";
export const fs = `
    precision mediump float;
    uniform vec2 iResolution;
    uniform int fractal;
    uniform vec3 params;
    uniform vec3 camera;
    uniform vec3 front;
    uniform bool juliaEnabled;
    uniform vec3 julia;
    uniform vec3 palette_seed;
    uniform bool neon;
    uniform float eps;
    uniform float ray_multiplier;
    
    const int ray_step = 2000;
    float FOV = 1.0;
    float far_plane = 10.0;
    float PI = 3.14159265;
    ${fractalDE}
    ${shadingFunctions}
    void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - iResolution) / iResolution.y;
        vec3 pos = camera;
        vec3 right = normalize(cross(front, vec3(0.0, 0.0, 1.0)));
        vec3 up = normalize(cross(right, front));
        vec3 ray_dir = normalize(uv.x * right + uv.y * up + FOV * front);

        float dist = 0.0;
        float orbit = 0.0;
        for(int i=0; i<ray_step; i++){
            vec2 map = fractalDE(pos + dist * ray_dir);
            float DE = map.x;
            orbit = map.y;
            if(abs(DE) < eps || dist > far_plane) break;
            dist += DE * ray_multiplier;
        }
        dist = dist < far_plane ? dist : -1.0;

        float gloss = 16.0;
        vec3 lightPos = vec3(10.0, 0.0, 10.0);
        vec3 lightColor = vec3(1.0, 0.9, 0.8);
        vec3 color = vec3(0.0);
        if(dist > 0.0){
            vec3 v = pos + dist * ray_dir;
            vec3 L = -front;
            vec3 N = normalize(vec3(
                fractalDE(v + vec3(eps, 0.0, 0.0))[0] - fractalDE(v - vec3(eps, 0.0, 0.0))[0],
                fractalDE(v + vec3(0.0, eps, 0.0))[0] - fractalDE(v - vec3(0.0, eps, 0.0))[0],
                fractalDE(v + vec3(0.0, 0.0, eps))[0] - fractalDE(v - vec3(0.0, 0.0, eps))[0]
            ));
            vec3 H = normalize(L - ray_dir);

            vec3 lin = vec3(0.0);
            vec3 ambient = vec3(0.1);
            vec3 diffuse = lightColor * dot(L, N);
            vec3 specular = diffuse * pow(dot(H, N), gloss);
            
            color = palette(orbit - 0.4, palette_seed);
            color = neon ? 0.01 / color : color;

            lin += ambient;
            lin += diffuse;
            color *= lin;
            color += (0.4 * specular);
            color = gammaCorrection(color);
        }
        gl_FragColor = vec4(color, 1);
    }
`


 