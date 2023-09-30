import { Vector3D, arctan } from "./vector3d";
function fractalDE(p: Vector3D, powers: Vector3D){
    const power_1 = powers[0]; const power_2 = powers[1]; const power_3 = powers[2];
    const px = p[0]; const py = p[1]; const pz = p[2];
    var vx = px; var vy = py; var vz = pz;
    var dr = 1.0;             
    var r = Math.sqrt(vx * vx + vy * vy + vz * vz);  
    var trap = r;
    
    for (let i = 0; i < 9; i++) {
        const rn1 = power_1 < 0 ? 0 : Math.pow(r, power_1 - 1);
        const rn2 = power_2 < 0 ? 0 : Math.pow(r, power_2 - 1);
        const rn3 = power_3 < 0 ? 0 : Math.pow(r, power_3 - 1);
        const theta = arctan(vy, vx);
        const phi = Math.asin(vz / r);
        dr = power_1 * rn1 * dr + power_2 * rn2 * dr + power_3 * rn3 * dr + 1.0;
        vx = px + rn1 * r * Math.cos(theta * power_1) * Math.cos(phi * power_1) + rn2 * r * Math.cos(theta * power_2) * Math.cos(phi * power_2) + rn3 * r * Math.cos(theta * power_3) * Math.cos(phi * power_3);
        vy = py + rn1 * r * Math.cos(phi * power_1) * Math.sin(theta * power_1) + rn2 * r * Math.cos(phi * power_2) * Math.sin(theta * power_2) + rn3 * r * Math.cos(phi * power_3) * Math.sin(theta * power_3);
        vz = pz + rn1 * r * -Math.sin(phi * power_1) + rn2 * r * -Math.sin(phi * power_2) + rn3 * r * -Math.sin(phi * power_3);

        trap = Math.min(trap, r);
        r = Math.sqrt(vx * vx + vy * vy + vz * vz);      
        if (r > 2.0) break;  
    }

    return [0.5 * Math.log(r) * r / dr, trap]; 
}

export default fractalDE;