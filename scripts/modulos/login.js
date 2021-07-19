/* Estilisado*/
let btnLogin = document.getElementById("login");
let btnRegister = document.getElementById("register");
let linkApoyo = document.getElementById("apoyo");
let form = document.forms[0];
//pop de errores
let divErrores = document.querySelector(".error");

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  btnRegister.classList.add("disable");
  btnLogin.classList.remove("disable");
  divErrores.classList.add("nodisplay");
  form.id = "formLogin";
  form.style.paddingTop = "90px";
  form.innerHTML = `<label>
    Email:
    <input type="text">
  </label>
  <label>
    Contraseña:
    <input type="password">
  </label>
  <button class="btn submitbtn" type="submit">Iniciar Sesión</button>`;
  linkApoyo.innerText = "Olvidaste tu contraseña?";
});

btnRegister.addEventListener("click", (e) => {
  e.preventDefault();
  btnRegister.classList.remove("disable");
  btnLogin.classList.add("disable");
  divErrores.classList.add("nodisplay");
  form.id = "formRegistro";
  form.style.paddingTop = "40px";
  form.innerHTML = `<label>
  Nombre:
  <input type="text">
</label>
<label>
  Apellido:
  <input type="text">
</label>
<label>
  Contraseña:
  <input type="password">
</label>
<label>
  Repetir contraseña:
  <input type="password">
</label>
<label>
  Email:
  <input type="text">
</label>
<button class="btn submitbtn" type="submit">Crear Cuenta</button>`;
  linkApoyo.innerText = "Do you have an account?";
});

linkApoyo.addEventListener("click", (eve) => {
  eve.preventDefault();
  if (linkApoyo.innerText == "Olvidaste tu contraseña?") {
    alert("error 404");
  } else {
    let e = document.createEvent("HTMLEvents");
    e.initEvent("click", true, false);
    btnLogin.dispatchEvent(e);
  }
});

//errores
let errores = [];
/*Validacion*/
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (form.id == "formRegistro") {
    divErrores.classList.add("nodisplay");
    if (!testInput([this[0], this[1], this[2], this[3], this[4]])) {
      divErrores.querySelector("div").innerHTML =
        "<p>todos los campos deben completarse</p>";
      divErrores.classList.remove("nodisplay");
    } else {
      testPass(this[2].value, this[3].value);
      testEmail(this[4].value);
      if (errores.length > 0) {
        divErrores.querySelector("div").innerHTML = "";
        errores.forEach((ele) => {
          divErrores.querySelector("div").innerHTML += `<p>${ele}</p>`;
        });
        divErrores.classList.remove("nodisplay");
        console.log(errores);
      } else {
        let datos = {
          firstName: this[0].value,
          lastName: this[1].value,
          email: this[4].value,
          password: this[2].value,
        };

        fetch("https://ctd-todo-api.herokuapp.com/V1/users", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(datos),
        })
          .then(function (response) {
            console.log(response);
            if (!response.ok) {
              let err = new Error(response.status);
              err.response = response;
              err.status = response.status;
              throw err;
            }
            return response.json();
          })
          .then(function (respuesta) {
            let event = new Event("click");
            btnLogin.dispatchEvent(event);
            let i = divErrores.querySelector("i");
            i.classList.remove("fa-times");
            i.classList.add("fa-check");
            divErrores.style = "background-color: #23CE6B;";
            divErrores.querySelector("div").innerHTML =
              "<p>Usuario creado con exito</p>";
            divErrores.classList.remove("nodisplay");
          })
          .catch(function (error) {
            if (error.status == 400) {
              divErrores.querySelector("div").innerHTML =
                "<p>El usuario ya existe</p>";
              divErrores.classList.remove("nodisplay");
            }
            if (error.status == 500) {
              divErrores.querySelector("div").innerHTML =
                "<p>Error en el servidor, intentalo mas tarde</p>";
              divErrores.classList.remove("nodisplay");
            }
          });
      }
      errores = [];
    }
  }
  if (form.id == "formLogin") {
    divErrores.classList.add("nodisplay");
    if (!testInput([this[0], this[1]])) {
      divErrores.querySelector("div").innerHTML =
        "<p>todos los campos deben completarse</p>";
      divErrores.classList.remove("nodisplay");
    } else {
      let usuario = {
        email: this[0].value,
        password: this[1].value,
      };
      fetch("https://ctd-todo-api.herokuapp.com/V1/users/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(usuario),
      })
        .then(function (response) {
          console.log(response);
          if (!response.ok) {
            let err = new Error(response.status);
            err.response = response;
            err.status = response.status;
            throw err;
          }
          return response.json();
        })
        .then(function (token) {
          sessionStorage.setItem("jwt", token.jwt);
          sessionStorage.setItem("userEmail", usuario.email);
          ochecked.classList.toggle("ocheckedGreen");
          ochecked.classList.toggle("cls-1");
          setTimeout(() => {
            location.href = './lista-tareas.html';
          }, 3000);
        })
        .catch(function (error) {
          if (error.status == 400) {
            divErrores.querySelector("div").innerHTML =
              "<p>Contraseña o Email incorrecto</p>";
            divErrores.classList.remove("nodisplay");
          }
          if (error.status == 404) {
            divErrores.querySelector("div").innerHTML =
              "<p>El usuario no existe</p>";
            divErrores.classList.remove("nodisplay");
          }
          if (error.status == 500) {
            divErrores.querySelector("div").innerHTML =
              "<p>Error en el servidor, intentalo mas tarde</p>";
            divErrores.classList.remove("nodisplay");
          }
        });
    }
  }
});

//Validador de nombre
function testPass(pass1, pass2) {
  if (pass1 == pass2) {
    test = pass1.match(/(?=^.{8,}$)(?=.*[A-Z])/g);
    if (!test) {
      errores.push(
        "La contraseña debe ser de 8 caracteres y debe contener al menos una mayuscula"
      );
      return test;
    }
  } else {
    errores.push("Las contraseñas deben coincidir");
    return false;
  }
}
//Validador de Email
function testEmail(email) {
  if (email.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g)) {
    if (email.match(/(?:@yahoo)/gi)) {
      errores.push("No aceptamos correos de yahoo");
      return false;
    } else {
      return true;
    }
  } else {
    errores.push("Email invalido");
    return false;
  }
}

//Validando que los campos esten llenos
function testInput(arr) {
  return arr.every((ele) => ele.value.length > 0);
}
