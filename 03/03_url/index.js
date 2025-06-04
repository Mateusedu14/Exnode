const url = require('url');

const address = 'https://www.meusite.com.br/catalogo?produto=camiseta';
const parsedUrl = new url.URL(address);

console.log(parsedUrl.host)
console.log(parsedUrl.hostname)
console.log(parsedUrl.search)
console.log(parsedUrl.searchParams)
console.log(parsedUrl.searchParams.get('produto'))