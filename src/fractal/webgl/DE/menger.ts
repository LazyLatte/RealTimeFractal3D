import { vec3 } from "gl-matrix";
export const mengerDE = `
    float sdBox(vec3 p, vec3 b){
        vec3 d = abs(p) - b;
        return length(max(d,0.0)) + min(max(d.x,max(d.y,d.z)),0.0);
    }
    vec2 mengerDE(vec3 p){
        const int iter = 3;
        const vec3 n1 = normalize(vec3(1,0,-1));
        const vec3 n2 = normalize(vec3(0,1,-1));
        vec3 v = p;
        float s = 1.;
        float trap = dot(v,v);
        for(int i=0; i<iter; i++){
            v = abs(v);  
            v -= 2.*min(0.,dot(v,n1))*n1; 
            v -= 2.*min(0.,dot(v,n2))*n2; 
            
            v *= 3.; 
            s /= 3.;
            
            v.z -=  1.;
            v.z  = -abs(v.z);
            v.z +=  1.;
            v.x -= 2.;
            v.y -= 2.;  
            
            trap = min(trap, dot(v,v)); 
        }
        float dis = sdBox(v,vec3(1.0));
        dis *= s;
        return vec2(dis, sqrt(trap));
    }
`

