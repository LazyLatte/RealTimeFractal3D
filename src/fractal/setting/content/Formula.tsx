import {FC, useEffect} from 'react'
import katex from 'katex';

interface FormulaProps {powers: number[]}
const getPolynomial = (powers: number[]) => {
    const sortedPowers = powers.filter(e => e >= 0).sort((a, b) => a-b);
    if(sortedPowers.length === 0) return [[0, 0]] as const;
    if(sortedPowers.length === 1) return [[1, sortedPowers[0]]] as const;
    if(sortedPowers.length === 2){
        if(sortedPowers[0] === sortedPowers[1]) return [[2, sortedPowers[0]]] as const;
        return [[1, sortedPowers[0]], [1, sortedPowers[1]]] as const;
    }
    if(sortedPowers[0] === sortedPowers[2]) return [[3, sortedPowers[0]]] as const;
    if(sortedPowers[0] === sortedPowers[1]) return [[2, sortedPowers[0]], [1, sortedPowers[2]]] as const;
    if(sortedPowers[1] === sortedPowers[2]) return [[1, sortedPowers[0]], [2, sortedPowers[2]]] as const;
    return [[1, sortedPowers[0]], [1, sortedPowers[1]], [1, sortedPowers[2]]] as const;
}

const Formula: FC<FormulaProps> = ({powers}) => {
    const polynomial = getPolynomial(powers);
    const katexFormula = polynomial.reduce((acc, pair) => {
        let append = '';
        const coef = pair[0];
        const power = pair[1];
        const coefStr = coef > 1 ? coef : '';
        if(power === 0){append = `+${coef}`}
        else if(power === 1) {append = `+${coefStr}Z`}
        else {append = `+${coefStr}Z^{${power}}`}
        return append + acc;
    }, "+C");
    
    useEffect(()=>{
        const el = document.getElementById('formula');
        if(el){
            katex.render(katexFormula.substring(1), el, {
                output: 'mathml',
                throwOnError: false,
            })
        }
    }, [katexFormula])
    return (
        <div id='formula' style={{fontSize: '24px', margin: '12px 0'}}/>
    )
}

export default Formula;

/* Generalization */
// const polynomial: any = {};
// powers.forEach(power => polynomial[power] ? polynomial[power]++ : polynomial[power] = 1)
// Object.keys(polynomial).map(e => Number(e)).sort((a, b) => a-b).forEach((power, idx) => {
//     let append = '';
//     const coef = polynomial[power];
//     const c = coef > 1 ? coef : '';
//     if(power === 0){append = `+${coef}`}
//     else if(power === 1) {append = `+${c}Z`}
//     else {append = `+${c}Z^{${power}}`}
//     katexFormula = append + katexFormula;
// })