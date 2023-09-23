import React from "react";
import "./Edit.css";
import { ProductsAdmin } from "./EditIndex";


export default function EditProduct(){
    return(
        <div className="editTableContainer">
            <div className="table">
                <div id="tableTitle">
                    <p>Id</p>
                    <p>Image</p>
                    <p>Nombre</p>
                    <p>Precio</p>
                    <p>Stock max</p>
                    <p>Stock min</p>
                    <p>Stock</p>
                </div>
                <ProductsAdmin></ProductsAdmin>
            </div>
        </div>
    )
}