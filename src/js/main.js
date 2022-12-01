import * as bootstrap from "bootstrap";
import { Header, Home } from "./components";
import "./navselect";

//Adds the navigation bar
customElements.define("main-header", Header);

//Adds the home content
customElements.define("home-content", Home);

//populate course dropdown
