const palette = `
    uniform vec3 orbit_freq;
    vec3 palette(float t, vec3 d){
        vec3 a = vec3(0.5);
        vec3 b = vec3(0.5);
        vec3 c = orbit_freq;
        return a + b * cos(2.0 * PI * (c * t + d));
    }
`

const decay = `
    vec3 lightIntensityDecay(vec3 color, float dist){
        float decay = 1.0 / (1.0 + decayCoeff*dist*dist);
        return color * decay;
    }
`

//fog(final_color, min(dist, far_plane))
const fog = `
    vec3 fog(vec3 color, float dist){
        float fogRatio = clamp(1.0 / exp(dist * fogDensity), 0.0, 1.0);
        return mix(fogColor, color, fogRatio);
    }
`

// const fakeSSS = `
//     vec3 fakeSSS(vec3 color){
//         vec3 s = vec3(0.7, 0.9, 1.0);
//         return vec3(pow(color.r, s.r), pow(color.g, s.g), pow(color.b, s.b));
//     }
// `

const gammaCorrection = `
    vec3 gammaCorrection(vec3 color){
        float gamma = 0.4545;
        return vec3(pow(color.r, gamma), pow(color.g, gamma), pow(color.b, gamma));
    }
`

export const shading = palette + decay + gammaCorrection;