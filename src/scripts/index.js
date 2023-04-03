// Se crean las variables necesarias apra modificar el Dom
const btnCarrito = document.querySelector("#btnCarrito");
const btnCerrarCarrito = document.querySelector("#btnCerrarCarrito");
const divCarrito = document.querySelector("#carrito");
const listaDelCarrito = document.querySelector("#listaDelCarrito");
const notificacionCarrito = document.querySelector("#notificacionCarrito");
const cardsProductosContainer = document.querySelector(
  "#cardsProductosContainer"
);
const cardsOnSaleContainer = document.querySelector("#cardsOnSaleContainer");
const pTotalCarrito = document.querySelector("#pTotalCarrito");
const btnFinalizarCompra = document.querySelector("#btnFinalizarCompra");

// crear carrito de compras vacio y total de la compra en 0
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let total = 0;
const ropa = [];

// se cargan los datos de los productos desde el archivo data.json
fetch("./src/data.json")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((element) => {
      // Si el producto esta en oferta, se le aplica un descuento del 10%
      element.enOferta
        ? (element.precio = parseFloat(element.precio * 0.9))
        : (element.precio = parseFloat(element.precio));
      ropa.push(element);
    });

    mostrarCarrito();
    mostrarProductos();
  })
  .catch((error) => console.log(error));

const mostrarCarrito = () => {
  let subtotal = 0;
  listaDelCarrito.innerHTML = ` `;

  if (carrito.length === 0) {
    verificarCarritoVacio();
  } else {
    //Se habilita el boton de finalizar compra
    btnFinalizarCompra.disabled = false;
    btnFinalizarCompra.classList.remove("bg-slate-700");
    btnFinalizarCompra.classList.add("bg-slate-900");

    carrito.forEach((element) => {
      notificacionCarrito.classList.remove("hidden");
      listaDelCarrito.innerHTML += `
            <div class="flex w-full justify-between p-4 items-center">
            <div class="flex w-full justify-between px-4">
                <p class="font-bold">${element[0]}</p>
                <span>$${element[1]}</span>
            </div>
                <button aria-label="eliminar del carrito" class="p-2 bg-slate-900 hover:bg-slate-700 text-white" id='eliminarProducto'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                    </svg>
                </button>
            </div>   
          `;

      subtotal += element[1];
    });

    total = subtotal.toFixed(2);
    pTotalCarrito.innerHTML = `$${total}`;
  }

  //Eliminar del carrito
  const eliminarProducto = document.querySelectorAll("#eliminarProducto");
  eliminarProducto.forEach((btn) => {
    btn.addEventListener("click", () => {
      let posicion;

      for (let i = 0; i < carrito.length; i++) {
        if (
          carrito[i][0] === btn.parentElement.querySelector("p").textContent
        ) {
          posicion = i;
        }
      }

      total -= parseFloat(
        btn.parentElement.querySelector("span").textContent.slice(1)
      );
      pTotalCarrito.innerHTML = `$${total.toFixed(2)}`;

      //Se elimina del array carrito
      carrito.splice(posicion, 1);
      //se elimina del local storage
      localStorage.setItem("carrito", JSON.stringify(carrito));
      //Se elimina el elemento del carrito
      btn.parentElement.remove();

      verificarCarritoVacio();
    });
  });
};

const mostrarProductos = () => {
  ropa.forEach((element) => {
    let { imagen, categoria, nombre, precio, enOferta } = element;

    if (!enOferta) {
      cardsProductosContainer.innerHTML += `
            <div class='w-[275px] h-[350px] relative'>
            <div>
                <img lazy src="${imagen}" alt="${nombre}" class='h-[200px] w-full object-contain m-auto'>
            </div>
            <div class='pt-4'>
                <p class='font-thin'>${categoria}</p>
                <h3 class='font-bold'>${nombre}</h3>                
                <span>$${precio}</span> 
            </div>
                <button class='btnAgregarAlCarrito p-2 bg-slate-900 hover:bg-slate-700 text-white w-full absolute bottom-0'>Agregar al carrito</button>
            </div>
          `;
    } else {
      cardsOnSaleContainer.innerHTML += `
            <div class='w-[275px] h-[350px] relative'>
            <div class="relative">
                <div class="absolute p-1 bg-red-700 text-white text-xs font-semibold rounded">Oferta</div>
                <img lazy src="${imagen}" alt="${nombre}" class='h-[200px] w-full object-contain m-auto'>
            </div>
            <div class='pt-4'>
                <p class='font-thin'>${categoria}</p>
                <h3 class='font-bold'>${nombre}</h3>                
                <span class='text-red-700 font-semibold'>$${precio}</span>
            </div>
                <button class='btnAgregarAlCarrito p-2 bg-slate-900 hover:bg-slate-700 text-white w-full absolute bottom-0'>Agregar al carrito</button>
            </div>
          `;
    }
  });

  //Agregar al carrito
  const btnAgregarAlCarrito = document.querySelectorAll(".btnAgregarAlCarrito");
  btnAgregarAlCarrito.forEach((btn) => {
    btn.addEventListener("click", () => {
      let nombreProd = btn.parentElement.querySelector("h3").textContent;
      let precioProd = parseFloat(
        btn.parentElement.querySelector("span").textContent.slice(1)
      );

      // Librería de notificaciones
      Toastify({
        text: "Se agregó al carrito.",
        duration: 1500,
        stopOnFocus: false,
        onClick: function () {
          divCarrito.classList.remove("right-[-100vw]");
          divCarrito.classList.add("right-0");
        },
      }).showToast();

      //Se agrega el array
      carrito.push([nombreProd, precioProd]);
      //Se agrega al local storage
      localStorage.setItem("carrito", JSON.stringify(carrito));
      mostrarCarrito();
    });
  });
};

// Funcion que verifica si el carrito tiene productos y agrega o elimia la la notificacion y habilita y deshabilita el boton de finalizar compra
const verificarCarritoVacio = () => {
  if (carrito.length === 0) {
    listaDelCarrito.innerHTML = `
          <div class="text-center">El carrito está vacío!</div>
        `;
    notificacionCarrito.classList.add("hidden");

    //Se deshabilita el boton de finalizar compra
    btnFinalizarCompra.disabled = true;
    btnFinalizarCompra.classList.remove("bg-slate-900");
    btnFinalizarCompra.classList.add("bg-slate-700");
  }
};

// si se hace click al boton de carrito se muestra el carrito
btnCarrito.addEventListener("click", () => {
  divCarrito.classList.remove("right-[-100vw]");
  divCarrito.classList.add("right-0");
});

// si se hace click al boton de cerrar carrito se oculta el carrito
btnCerrarCarrito.addEventListener("click", () => {
  divCarrito.classList.remove("right-0");
  divCarrito.classList.add("right-[-100vw]");
});

//Se borra el storage cuando se le da a finalizar compra.
btnFinalizarCompra.addEventListener("click", () => {
  localStorage.clear();
});
