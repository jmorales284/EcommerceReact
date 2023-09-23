import React, {useState}from "react";
import { BrowserRouter } from "react-router-dom";
import { Header } from "./componentes/Header";
import { Paginas } from "./rutas/paginas";
import { Footer } from "./componentes/Footer/Footer";
import { CartProvider } from "./context/cart";


function App() {

	const [allProducts, setAllProducts] = useState([]);
	const [total, setTotal] = useState(0);
	const [countProducts, setCountProducts] = useState(0);
	return (
		<div className="App">
			<BrowserRouter>
				<CartProvider>
					<Header />
					<Paginas />
					<Footer/>
				</CartProvider>
			</BrowserRouter>
		</div>
	);
}

export default App;