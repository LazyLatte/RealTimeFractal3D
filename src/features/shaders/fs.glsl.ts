import {shading} from "./shading";
export const fs_header = `
    precision mediump float;
    const float PI = 3.14159265;
`
export const fs = `
    
    uniform vec2 iResolution;
    uniform vec3 camera;
    uniform vec3 front;

    uniform vec3 palette_seed;
    uniform float decayCoeff;
    uniform float fogDensity;
    uniform bool neon;
    uniform float eps;
    uniform float ray_multiplier;
    
    const int ray_step = 10000;
    const float FOV = 1.0;
    const float far_plane = 10.0;
    const float gloss = 16.0;
    const vec3 lightColor = vec3(1.0);
    const vec3 fogColor = vec3(1.0);
    ${shading}
    void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - iResolution) / iResolution.y;
        vec3 right = normalize(cross(front, vec3(0.0, 0.0, 1.0)));
        vec3 up = normalize(cross(right, front));
        vec3 ray_dir = normalize(uv.x * right + uv.y * up + FOV * front);

        float dist = 0.0;
        float orbit = 0.0;
        for(int i=0; i<ray_step; i++){
            vec2 map = DE(camera + dist * ray_dir);
            float est = map.x;
            orbit = map.y;
            if(abs(est) < eps || dist > far_plane) break;
            dist += est * ray_multiplier;
        }

        vec3 color = vec3(0.0);
        if(dist < far_plane){
            vec3 v = camera + dist * ray_dir;
            vec3 L = -front;
            vec3 N = normalize(vec3(
                DE(v + vec3(eps, 0.0, 0.0))[0] - DE(v - vec3(eps, 0.0, 0.0))[0],
                DE(v + vec3(0.0, eps, 0.0))[0] - DE(v - vec3(0.0, eps, 0.0))[0],
                DE(v + vec3(0.0, 0.0, eps))[0] - DE(v - vec3(0.0, 0.0, eps))[0]
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


 