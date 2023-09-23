import { useContext } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { useState } from "react";
import { serverBackEndDireccion } from '../rutas/serverback';

const clienteId = JSON.parse(localStorage.getItem('user'))?.ID_Usuario;
const URL =`${serverBackEndDireccion()}carrito`;
const CartContext = createContext(null);

function CartProvider ({children}) {
    const [cart, setCart] = useState(null);
    const [total, setTotal] = useState(0);
    
    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        const response = await fetch(`${URL}/${clienteId}`);
        const data = await response.json();
        setCart(data);
        loadTotalProducts(data.productos);
    }

    const loadTotalProducts = (cartProducts) => {
        let total = 0;
        cartProducts?.forEach((product) => {
            total += product.producto.Cantidad;
        });
        console.log(total);
        setTotal(total);
    }


    const changeCart = (item, quantity) => {
       
        const { ID_Producto: ID_Producto, Nombre_Producto, Precio} = item;
        const isInCart = cart.productos.find((item) => {
            console.log(item);
            return item.producto.ID_Producto === ID_Producto});
        console.log(isInCart);
        let newCart = [];
        if (isInCart) {
            newCart = cart.productos.map((item) => {
                if (item.producto.ID_Producto === ID_Producto) {
                    return { ...item, producto: {...item.producto, Cantidad: item.producto.Cantidad + quantity} };
                } else return item;
            });
            newCart = newCart.filter((item) => item.producto.Cantidad > 0);
            setCart((prev) => {
                return {
                    ...prev,
                    productos: [...newCart],
                };
            })
        } else {
            if (quantity < 1) return;
            newCart = [...cart.productos, { producto : {ID_Producto, Nombre_Producto, Precio, quantity}, subTotal: Precio * quantity }];
            setCart((prev) => {
                return {
                    ...prev,
                    productos: [...newCart],
                };
            })
            // setCart((prev) => [...prev, {  ID_Producto,  Nombre_Producto, Precio, quantity }]);
        }
        loadTotalProducts(newCart);
    };

    const removeItem = (itemId) => {
        console.log(itemId);
        const newCart = cart.productos.filter((item) => item.producto.ID_Producto !== itemId);
        console.log(newCart);
        setCart((prev) => {
            return {
                ...prev,
                productos: [...newCart],
            };
        })
        loadTotalProducts(newCart);
    };

    const clear = () => {
        setCart([]);
        setTotal(0);
    }

    const value = { changeCart, removeItem, clear, cart, total};

    return(
        <CartContext.Provider value={value}>
             {children}
        </CartContext.Provider>
    )
}

function useCart() {
    const context = useContext(CartContext);
    // if (!context) {
    //     throw new Error("useCart debe estar dentro del proveedor CartContext");
    // }
    return context;
}
//ser
export { CartProvider, useCart };