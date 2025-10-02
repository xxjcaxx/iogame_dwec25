import "./style.scss"
import { router } from "./router";

// eslint-disable-next-line
import * as bootstrap from 'bootstrap'

import { renderHeader } from "./components/header"
import { renderContent } from "./components/content";
import { renderFooter } from "./components/footer";

document.addEventListener("DOMContentLoaded",()=>{
  const appDiv = document.querySelector('#app');
  const headerDiv = document.querySelector('#header');
  const footerDiv = document.querySelector('#footer');

  headerDiv.innerHTML = renderHeader();
  footerDiv.innerHTML = renderFooter();
  //window.location.hash = "#";
  router(window.location.hash, appDiv);
  window.addEventListener("hashchange", () => {
    router(window.location.hash, appDiv);
  });
  //appDiv.innerHTML = renderContent(Array(120).fill(0).map((_,i)=>i));
});