import './darkmode.js'
import {cambiarLenguage} from './language.js'


const language = document.querySelector('.language')


  
//EVENTLISTER
eventListeners()

function eventListeners(params) {
    language.addEventListener('click',cambiarLenguage ) 
}

 

// rastreador para movimiento  en interseccion 

const hiddenElements = document.querySelectorAll(".hidden")

const observer = new IntersectionObserver((entries) => {entries.forEach((entry)=>{
    if(entry.isIntersecting) {        
        entry.target.classList.add("show");       
    }else{
    entry.target.classList.remove("show")
      }
      //console.log(entries);
})
},{threshold: 0.2,})

hiddenElements.forEach((element) => observer.observe(element))

// rastreador para evaluar la posicion en el nav bar 
// Rastreador de posicion.
// selecciona la clase, cada seccion.
const sectionElement = document.querySelectorAll(".seccion")
//console.log(sectionElement);

// selecciona cada link de la nav bar
const links = document.querySelectorAll(".nav-text")
console.log(links);


const observer2 = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
        if(entry.isIntersecting) {
         links.forEach((link)=>{
            // selecciona cada uno de los href de la navbar.
            const href = link.getAttribute("href").split("#")[1]
            const id =  entry.target.id

            // evalua si los href son identicos, añade la clase 
            if( href === id  ) {
               link.classList.add("link--active")
            }else{
                link.classList.remove("link--active")
            }        
           
         })
        }
    })
})

// secciona al grupo de elementos de las secciones y lo pasa a uno al observer 2
sectionElement.forEach((element)=>observer2.observe(element))


// MenuShow

//Selecciona la clase del icono menu y lo guarda en una variable
const iconShowMenu = document.querySelector(".iconShowMenu")

const navBarMenu = document.querySelector(".nav-menu")

//Escucha cuando le da click
iconShowMenu.addEventListener('click', ()=>{
    navBarMenu.classList.toggle("nav-menu-show")
})

links.forEach(link=>{link.addEventListener('click', ()=>{
    navBarMenu.classList.toggle("nav-menu-show")
})})


//Language 




