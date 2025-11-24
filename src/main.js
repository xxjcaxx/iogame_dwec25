import "./style.scss"
import { router } from "./router";
import "./components/gamesList/gamesList";

// eslint-disable-next-line
import * as bootstrap from 'bootstrap'

import  "./components/headerComponent/header";
import { renderContent } from "./components/content";
import { renderFooter } from "./components/footer";

document.addEventListener("DOMContentLoaded",()=>{
  const appDiv = document.querySelector('#app');
  const headerDiv = document.querySelector('#header');
  const footerDiv = document.querySelector('#footer');

  //headerDiv.innerHTML = renderHeader();
 // headerDiv.innerHTML = `<game-header></game-header>`
  footerDiv.innerHTML = renderFooter();



  router(window.location.hash, appDiv);
  window.addEventListener("hashchange", () => {
    router(window.location.hash, appDiv);
  });
  
});