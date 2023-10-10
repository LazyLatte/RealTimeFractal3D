const gammaCorrection = `
    vec3 gammaCorrection(vec3 color){
        float gamma = 0.4545;
        return vec3(pow(color.r, gamma), pow(color.g, gamma), pow(color.b, gamma));
    }
`
export default gammaCorrection;