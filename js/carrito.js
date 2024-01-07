//* Variables
let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector(".carrito-acciones-vaciar");
const botonComprar = document.querySelector(".carrito-acciones-comprar");
const contenedorTotal = document.querySelector("#total");

function cargarProductosCarrito () {

    if (productosEnCarrito && productosEnCarrito.length > 0){

        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    
        contenedorCarritoProductos.innerHTML = "";
    
        productosEnCarrito.forEach(producto => {
    
            const contenedor = document.createElement("section");
            contenedor.classList.add("carrito-producto");
    
            contenedor.innerHTML = `
            <img class="carrito-producto-imagen" src="${producto.detalles.img}" alt="${producto.detalles.descripcion}>
    
                <div class="carrito-producto-nombre">
                    <small>Título</small>
                    <h3>${producto.detalles.producto}</h3>
                </div>
    
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
    
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$ ${producto.detalles.precio}</p>
                </div>
    
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$ ${producto.detalles.precio * producto.cantidad}</p>
                </div>
    
                <button class="carrito-producto-eliminar" id="${producto.id}">
                    <i class="bi bi-trash"></i> 
                </button>
            `;
    
            contenedorCarritoProductos.append(contenedor);

            });
        } else {
    
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
        }

    actualizarBotonesEliminar();
    actualizarTotal();
}

cargarProductosCarrito();

function actualizarBotonesEliminar () {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
            boton.addEventListener("click", eliminarDelCarrito)
    });
}

function eliminarDelCarrito(e) {

    Toastify({
        text: "Producto eliminado de carrito",
        duration: 1800,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #040404, #042127)",
          borderRadius: "2rem",
          fontSize: ".75rem"
        },
        offset: {
            x: "1.5rem",
            y: "1.5rem"
        },
      }).showToast();

    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);

    productosEnCarrito.splice(index, 1);
   cargarProductosCarrito()

   localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito))
}

//! ---> boton vaciar
botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito () {

    Swal.fire({
        title: '¿Estas seguro?',
        icon: 'question',
        html: `Perderás ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos seleccionados`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "Si",
        cancelButtonText: "No"
      }) .then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();        
        } else if (result.isDenied) {
        }
      })
}

//! ---> precio final
function actualizarTotal () {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.detalles.precio * producto.cantidad), 0);
    total.innerText = `$ ${totalCalculado}`;
}


//! ---> boton comprar
botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito () {

    Swal.fire({
        icon: 'success',
        title: 'Muchas gracias por tu compra',
        showConfirmButton: false,
        timer: 1500
      })

    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");
}
