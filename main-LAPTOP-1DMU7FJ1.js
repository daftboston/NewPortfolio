const hiddenElements = document.querySelectorAll(".hidden")

const observer = new IntersectionObserver((entries) => {entries.forEach((entry)=>{
    if(entry.isIntersecting) {
        
        entry.target.classList.add("show");        
      
    }else{
    entry.target.classList.remove("show")
      }
})
},{threshold: 0.9,})

hiddenElements.forEach((element) => observer.observe(element))


// Rastreador de posicion
// selecciona la clase, cada seccion.
const sectionElement = document.querySelectorAll(".seccion")
//console.log(sectionElement);

// selecciona cada link de la nav bar
const links = document.querySelectorAll(".nav-text")
//console.log(links);

// 
const observer2 = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
        if(entry.isIntersecting) {
         links.forEach((link)=>{
            // selecciona cada uno de los href de la navbar.
            const href = link.getAttribute("href").split("#")[1]
            const id =  entry.target.id

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







