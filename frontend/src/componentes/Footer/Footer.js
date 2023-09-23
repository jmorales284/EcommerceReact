import React from "react";
import "./Footer.css";

export const Footer = () => {
    return(
        <footer id="footer">
            <div className="contact"><h3>Contactanos</h3><h5>+57 3148735894</h5><h5>flexstride@gmail.com</h5></div>
            <div className="adress"><h3>Dirección</h3><h5>Av. Circunvalar #7-139 a 7-81</h5><h5>Pereira, Risaralda</h5></div>
            <div className="socialMedia"><h3>Nuestras Redes Sociales</h3><h5>Twitter @_FlexStride</h5><h5>Facebook FlexStride</h5><h5>Instagram FlexStride</h5></div>
        </footer>
    )
}

export default Footer;