// Leer estado del localstorage

//LENGUAJE

const eng = document.querySelectorAll('.eng')
const esp = document.querySelectorAll('.esp')
const balllang = document.querySelector('.ball-lang')

if (localStorage.getItem('LANGUAGE')) {     
    balllang.classList.add('ball-move')         
    eng.forEach(element => {            
            element.classList.add('displayOn')          
                           })       
    esp.forEach(element => {
            element.classList.add('displayOff')                       
    }) 
} else { 
balllang.classList.remove('ball-move')    
eng.forEach(element => {        
  element.classList.add('displayOff')       
 })     
esp.forEach(element => {                   
       element.classList.add('displayOn')
    }) 
}





//cambiar  lenguage

export function cambiarLenguage(idioma) {    

console.log('click');
if (localStorage.getItem('LANGUAGE')) {    
    balllang.classList.remove('ball-move')    
    localStorage.removeItem('LANGUAGE', true)
    eng.forEach(element => {
        if (element.classList.contains('displayOn')) {
            element.classList.add('displayOff')
            element.classList.remove("displayOn")                
          }   
            
    })    
    esp.forEach(element => {
         if (element.classList.contains('displayOff') ) { 
            element.classList.add('displayOn')            
            element.classList.remove("displayOff")   
        }  
    })   
} else {
    balllang.classList.add('ball-move')
    localStorage.setItem('LANGUAGE', true)
    eng.forEach(element => {
        
      element.classList.add('displayOn')     
     element.classList.remove('displayOff')  
            
                             
    })
     
   esp.forEach(element => {
                   
           element.classList.remove('displayOn')
           element.classList.add('displayOff')
        }
         )     
}                   
   }








    