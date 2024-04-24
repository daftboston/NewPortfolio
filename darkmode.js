
//DarkMode

const onOffSwitch= document.querySelector(".dmode")
const ball = document.querySelector('.ball')
const moon = document.querySelector(".bxs-moon")
const sun = document.querySelector(".bxs-sun")

if(localStorage.getItem('DARKMODE')){
    ball.classList.add('ball-move')
    moon.classList.add("moonOn")
   sun.classList.remove("sunOn")
    document.body.classList.remove('clearTheme')
} else {
    sun.classList.add("sunOn")
}



onOffSwitch.addEventListener("click", ()=>{

    if (localStorage.getItem('DARKMODE')) {
        ball.classList.remove('ball-move')
        moon.classList.remove("moonOn")
        sun.classList.add("sunOn")
        document.body.classList.add("clearTheme"),
        localStorage.removeItem('DARKMODE')  
        console.log('tema oscuro');     
         
    } else{
        ball.classList.add('ball-move')
        moon.classList.add("moonOn")
       sun.classList.remove("sunOn")
     
        document.body.classList.remove('clearTheme')
        localStorage.setItem('DARKMODE', true)
        console.log('tema claro');
        
    }    
    
})