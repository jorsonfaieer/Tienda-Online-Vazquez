const codigoTransaccion = document.querySelector('span');

let codigo = '';
const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
for (let i = 0; i < 10; i++) {
  codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
}

codigoTransaccion.innerHTML = codigo;