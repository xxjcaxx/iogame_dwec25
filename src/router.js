import { renderContent } from "./components/content";
import { renderLogin } from "./components/login";

export {router}

const routes = new Map([
    ['#',renderContent],
    ['#game',renderContent],
    ['#login',renderLogin]
])


function router(route,container){
    if(routes.has(route)){
        container.innerHTML = routes.get(route)();
    }
    else {
        container.innerHTML = `<h2>404</h2>`
    }
}