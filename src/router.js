import { renderContent } from "./components/content";
import { renderLogin } from "./components/login";
import { renderProfile } from "./components/profile";

export {router}

const routes = new Map([
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
}