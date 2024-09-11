import {shading} from "./shading";
export const fs_header = `
    precision mediump float;
    const float PI = 3.14159265;
`
const softShadow = `
    const int shadow_step = 1500;
    const float step_limiter = 0.2;
    float softshadow(vec3 ro, vec3 rd, float k, float lightDist) {
        float res = 1.0;
        float t = 0.0; 
        for (int i = 0; i < shadow_step; i++) {
            float h = DE(ro + rd * t)[0];
            res = min(res, k * h / t); 
            
            t += clamp(h, eps, step_limiter); 
            if(res < 0.02 || lightDist - t < eps) break;
        }
        return clamp(res, 0.02, 1.0);
    }
`
export const fs = `
    uniform vec2 iResolution;
    uniform vec3 camera;
    uniform vec3 front;

    uniform vec3 palette_seed;
    uniform float decayCoeff;
    uniform float fogDensity;
    uniform bool neon;
    uniform bool shadow;
    uniform float eps;
    uniform float ray_multiplier;
    
    const int ray_step = 2000;
    const float FOV = 1.0;
    const float far_plane = 10.0;
    const float gloss = 16.0;
    const vec3 lightColor = vec3(0.0, 0.9, 1.0);
    ${shading}
    ${softShadow}
    

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
        //vec3 lightPos = vec3(2.0, -1.4, 4.0);
        const int numOfLight = 4;
        vec3 lightPos[numOfLight];
        lightPos[0] = vec3(-3.0554, 3.45, -0.80699);
        lightPos[1] = vec3(-2.93843, 3.76649, -0.86421);
        lightPos[2] = vec3(-2.93843, 3.76275, -0.46785);
        lightPos[3] = vec3(-3.0554, 3.45, -0.52228);
        vec3 final_color = vec3(0.0);
        if(dist < far_plane){
            vec3 v = camera + dist * ray_dir;
            vec3 N = normalize(vec3(
                DE(v + vec3(eps, 0.0, 0.0))[0] - DE(v - vec3(eps, 0.0, 0.0))[0],
                DE(v + vec3(0.0, eps, 0.0))[0] - DE(v - vec3(0.0, eps, 0.0))[0],
                DE(v + vec3(0.0, 0.0, eps))[0] - DE(v - vec3(0.0, 0.0, eps))[0]
            ));

            
            for(int i=0; i<numOfLight; i++){
                vec3 L = normalize(lightPos[i] - v);
                vec3 H = normalize(L - ray_dir);

                vec3 ambient = vec3(0.1);
                float lightDist = length(v-lightPos[i]);
                float sdw = shadow ? softshadow(v + eps * N, L, 64.0, lightDist) : 1.0; 
                vec3 diffuse = lightColor * clamp(dot(L, N), 0.0, 1.0) * sdw;
                vec3 specular = diffuse * pow(clamp(dot(H, N), 0.0, 1.0), gloss);
                
                vec3 color = palette(orbit, palette_seed);
                color = neon ? (0.003 / color) : color;

                color *= (ambient + diffuse + specular);
                color = lightIntensityDecay(color, lightDist);
                final_color += color;
            }

        }
        final_color = gammaCorrection(final_color);
        gl_FragColor = vec4(final_color, 1.0);
    }
`


 