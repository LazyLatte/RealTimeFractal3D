const rotate = `
    vec3 rotateX(vec3 v, float deg){
        float rad = deg * PI / 180.0;
        float c = cos(rad);
        float s = sin(rad);
        mat3 rotateMatrix = mat3(
            vec3(1, 0, 0),
            vec3(0, c, -s),
            vec3(0, s, c)
        );
        return rotateMatrix * v;
    }
    vec3 rotateY(vec3 v, float deg){
        float rad = deg * PI / 180.0;
        float c = cos(rad);
        float s = sin(rad);
        mat3 rotateMatrix = mat3(
            vec3(c, 0, s),
            vec3(0, 1, 0),
            vec3(-s, 0, c)
        );
        return rotateMatrix * v;
    }
    vec3 rotateZ(vec3 v, float deg){
        float rad = deg * PI / 180.0;
        float c = cos(rad);
        float s = sin(rad);
        mat3 rotateMatrix = mat3(
            vec3(c, -s, 0),
            vec3(s, c, 0),
            vec3(0, 0, 1)
        );
        return rotateMatrix * v;
    }
`

export default rotate;