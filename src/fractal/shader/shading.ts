export const palette = `
    vec3 palette(float t, vec3 d){
        vec3 a = vec3(0.5);
        vec3 b = vec3(0.5);
        vec3 c = vec3(1.0);
        return a + b * cos(2.0 * PI * (c * t + d));
    }
`

export const gammaCorrection = `
    vec3 gammaCorrection(vec3 color){
        float gamma = 0.4545;
        return vec3(pow(color.r, gamma), pow(color.g, gamma), pow(color.b, gamma));
    }
`