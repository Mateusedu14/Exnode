
const operacoes = require('./operacoes.js');

console.log("--- Testando Operações ---");


const resultadoMultiplicacao = operacoes.multiplicacao(7, 3);
console.log(`7 * 3 = ${resultadoMultiplicacao}`); 


const resultadoSoma = operacoes.soma(15, 8);
console.log(`15 + 8 = ${resultadoSoma}`); 


const resultadoSubtracao = operacoes.subtracao(20, 9);
console.log(`20 - 9 = ${resultadoSubtracao}`); /


const resultadoDivisao = operacoes.divisao(100, 5);
console.log(`100 / 5 = ${resultadoDivisao}`);  

console.log(`Tentando dividir por zero:`);
const resultadoDivisaoPorZero = operacoes.divisao(10, 0);
console.log(`Resultado: ${resultadoDivisaoPorZero}`); 