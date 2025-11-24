import { renderContent } from "./components/content";
import { renderLogin } from "./components/login";
import { renderProfile } from "./components/profile";

export {router}

/*const routes = new Map([
    ['',renderContent],
    ['#game',renderContent],
    ['#login',renderLogin('login')],
    ['#register',renderLogin('register')],
    ['#profile',renderProfile]
])


function router(route,container){
    if(routes.has(route)){
        container.replaceChildren(routes.get(route)());
    }
    else {
        container.innerHTML = `<h2>404</h2>`
    }
}*/
const routes = new Map([
    ['','game-content'],
    ['#game','game-content'],
    ['#login','game-login'],
    ['#register','game-register'],
    ['#profile','game-profile']
])


function router(route,container){
    if(routes.has(route)){
        container.replaceChildren(document.createElement(routes.get(route)));
    }
    else {
        container.innerHTML = `<h2>404</h2>`
    }
}