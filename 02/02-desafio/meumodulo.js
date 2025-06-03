module.exports = {
    multiplicacao(a, b) {
        return a * b;
    },

    soma(a, b) {
        return a + b;
    },

    subtracao(a, b) {
        return a - b;
    },

    divisao(a, b) {
        if (b === 0) {
            console.log("Erro: Divisão por zero não é permitida.");
            return NaN;
            return a / b;
        }
    }
};