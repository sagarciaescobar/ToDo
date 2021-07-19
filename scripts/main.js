let menu = document.querySelector('.menu')
let menuDinamico = document.querySelector('.menuDinamico')
let ochecked = document.querySelector('#ochecked')
let empezar = document.querySelector('#empezar')
let registro = document.querySelector('#registro')
let accesoUsuario = document.querySelector('#accesoUsuarios')
let inicio = document.querySelector('#inicio')

let btn = [empezar,registro,accesoUsuario,inicio]

menu.addEventListener('click', ()=>{
    menuDinamico.classList.toggle('menuVisible')
})

btn.forEach((ele)=>{
    if (ele == null){
    }else{
        ele.addEventListener('click', function(e){
            e.preventDefault()
            ochecked.classList.toggle('ocheckedGreen')
            ochecked.classList.toggle('cls-1')
            setTimeout(()=>{
                location.href= this.href;
            },3000)
        })
    }
})


