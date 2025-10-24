export {renderLogin}

import { login,register } from "../services/supaservice";


const  renderLogin =(method)=> ()=> {

    const formHTML = `
    <h1>${method === 'login' ? 'Login' : 'Register'}</h1>
            <form>
                <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Email address</label>
                    <input type="email" name="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div class="mb-3">
                    <label for="exampleInputPassword1" class="form-label">Password</label>
                    <input type="password" name="password" class="form-control" id="exampleInputPassword1">
                </div>

                <button id="submit-login" type="submit" class="btn btn-primary">${method === 'login' ? 'Login' : 'Register'}</button>
        </form>
    `;
    const divLogin = document.createElement("div");
    divLogin.classList.add("container", "w-25", "vh-100");
    divLogin.innerHTML = formHTML;

    const form = divLogin.querySelector("form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const dataLogin = Object.fromEntries(formData);
      if (method === "login") {
        login(dataLogin);
      } else {
        register(dataLogin);
      }
      form.reset();
    });


    return divLogin;

}