//! ---> Variables

let productosJSON;
let contenedorProductos;
let botonesAgregar = document.querySelectorAll(".producto-agregar");

let productosEnCarrito;
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

const contador = document.querySelector("#contador")

//! --> Creación, obtención y muestra de productos de archivo "productos.json".

async function cargarProductos() {
    try {
        productosJSON = fetch("../productos.json");
        contenedorProductos = document.querySelector(".contenedor-productos");

        let resultado = await productosJSON;
        let data = await resultado.json();

        let productos = data.productos;

        productos.forEach((producto) => {
            const article = document.createElement("article");
            article.classList.add("producto");

            article.innerHTML = `
                <img class="producto-imagen" src="${producto.detalles.img}" alt="${producto.detalles.descripcion}">
                <div class="producto-detalles">
                    <h3 class="producto-nombre">${producto.detalles.producto}</h3>
                    <p class="producto-precio">$ ${producto.detalles.precio}</p>
                    <button class="producto-agregar" id="${producto.id}">Agregar</button>
                </div> 
            `;
            contenedorProductos.append(article);
        });

        botonesAgregar = document.querySelectorAll(".producto-agregar");

        botonesAgregar.forEach(boton => {
            boton.addEventListener("click", () => agregarAlCarrito(productos, boton.id))
        });
    } catch (error) {
        console.log(error);
    }
}

//! ---> Contador vinculado a ls

if (productosEnCarritoLS) {
    try {
        productosEnCarrito = JSON.parse(productosEnCarritoLS);
    } catch (error) {
        console.log(error)
    }
    actualizarContador();
} else {
    productosEnCarrito = [];
}


//! ---> Agregar productos al carrito

function agregarAlCarrito(productos, idBoton) {

    Toastify({
        text: "Producto agregado a carrito",
        duration: 1800,
        destination: "./carrito.html",
        newWindow: true,
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

    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if(productosEnCarrito.some(producto => producto.id === idBoton)){

        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
        
    } else {

        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);

    };

    actualizarContador();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito))

}

function actualizarContador () {
    let contadorActualizado = productosEnCarrito.reduce((acc, producto) => {
        return acc + producto.cantidad
    }, 0);

    contador.innerText = contadorActualizado;
}

cargarProductos();