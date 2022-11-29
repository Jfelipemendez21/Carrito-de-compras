let cards= document.getElementById("cards");
let items= document.getElementById("items");
let footer= document.getElementById("footer")
// La propiedad content se emplea para generar nuevo contenido de forma dinámica e insertarlo en la página HTML
let templateCards= document.getElementById("template-card").content;
let templateFooter= document.getElementById("template-footer").content;
let templateCarrito= document.getElementById("template-carrito").content;
// Crea un nuevo DocumentFragmentvacio, dentro del cual un nodo del DOM puede ser adicionado para construir un nuevo arbol DOM fuera de pantalla.
const fragment= document.createDocumentFragment();
let carrito={};

// DOMContentLoaded nos sirve para iniciar algo cuando el DOM ya esta cargado y se encuentra listo 
document.addEventListener("DOMContentLoaded", ()=>{
    fetchData();
    if(localStorage.getItem("carrito")){
        carrito= JSON.parse(localStorage.getItem("carrito"))
        pintarCarrito()
    }
});
cards.addEventListener("click", (e)=>{
    // el "e" sirve para capturar el elemento que queremos modificar
    addCarrito(e)
})

items.addEventListener("click", (e)=>{
    btnAccion(e);
})

const fetchData = async () => {
    try {
        const res = await fetch("api1.json");
        const data = await res.json();
        pintarCards(data);
    }catch(err){
        console.log(err);
    }
}

const pintarCards= (data) =>{
    data.forEach((producto) =>{
        templateCards.querySelector("img").setAttribute("src", producto.thumbnailUrl)
        templateCards.querySelector("h5").textContent= producto.title;
        templateCards.querySelector("p").textContent= producto.precio;
        // Dataset permite obtener y establecer los valores de los atributos data-* de un forma muy sencilla. Cada elemento del DOM tiene asociada la propiedad dataset , que es un objeto tipo DOMStringMap con todos sus atributos data-* .
        templateCards.querySelector(".btn").dataset.id= producto.id; 
        // cloneNode() devuelve un duplicado del nodo en el que este método fue llamado.
        const clone= templateCards.cloneNode(true);
        fragment.appendChild(clone);

    })
    cards.appendChild(fragment);
}

const addCarrito= e=>{
    // target nos muestra el elemento que desencadeno el evento
    // el classList.contains nos muestra si el elemento seleccionado tiene la clase "btn-dark"
    console.log(e.target);
    if(e.target.classList.contains("btn-dark")){
        // parentElement devuelve el nodo padre del DOM Element , o null , si el nodo no tiene padre o si el padre no es un Element DOM
       setCarrito(e.target.parentElement); 
    }
    // este motodo sirve para detener cualquier evento que se genere en nuestro elemento 
    e.stopPropagation();
}

const setCarrito= objeto=>{
     const producto = {
        id: objeto.querySelector(".btn-dark").dataset.id,
        title: objeto.querySelector("h5").textContent,
        precio: objeto.querySelector("p").textContent,
        cantidad: 1
     }
    //  El método hasOwnProperty() devuelve un booleano indicando si el objeto tiene la propiedad especificada
     if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad= carrito[producto.id].cantidad+1; 
     }

     carrito[producto.id] = {...producto}
     pintarCarrito();
}

const pintarCarrito= ()=>{
    items.innerHTML= "";
    // El método Object. values() devuelve un array cuyos elementos son valores de propiedades enumarables que se encuentran en el objeto.
    Object.values(carrito).forEach((producto)=>{
        templateCarrito.querySelector('th').textContent= producto.id
        templateCarrito.querySelectorAll("td")[0].textContent= producto.title
        templateCarrito.querySelectorAll("td")[1].textContent= producto.cantidad
        templateCarrito.querySelector(".btn-info").dataset.id= producto.id
        templateCarrito.querySelector(".btn-danger").dataset.id= producto.id
        templateCarrito.querySelector("span").textContent= producto.cantidad * producto.precio

        const clone= templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    })
    items.appendChild(fragment)

    pintarFooter()

    localStorage.setItem("carrito", JSON.stringify(carrito))

}

const pintarFooter= ()=>{
    footer.innerHTML= ""
    // Object. keys devuelve un array cuyos elementos son strings correspondientes a las propiedades enumerables que se encuentran directamente en el object.
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`;
        return
    }
    // cantidad se llama entre {} porque es un objeto 
    // ,0 es para que me retorne un numero
    const nCnatidad= Object.values(carrito).reduce((acc, {cantidad})=> acc+cantidad,0)
    const nPrecio= Object.values(carrito).reduce((acc, {cantidad, precio})=> acc+(cantidad*precio) ,0)
    templateFooter.querySelectorAll("td")[0].textContent= nCnatidad
    templateFooter.querySelector("span").textContent= nPrecio

    const clone= templateFooter.cloneNode(true)
    fragment.appendChild(clone);
    footer.appendChild(fragment);

    const btnVaciar= document.getElementById("vaciar-carrito")
    btnVaciar.addEventListener("click", ()=>{
        carrito= {};
        pintarCarrito();
    })
}

const btnAccion= (e)=>{
    // accion de aumentar
    if(e.target.classList.contains("btn-info")){
        const producto =  carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id]= {...producto}
        pintarCarrito();
    }

    if(e.target.classList.contains("btn-danger")){
        const producto= carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad===0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito();
    }
    e.stopPropagation();
}