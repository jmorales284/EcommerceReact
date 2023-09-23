import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import 'boxicons';
import Logo from "../../acces/logo.png";
import { useCart } from "../../context/cart";

export const Header = () => {
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const cart = useCart();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserRole(user.ID_Rol);
    } else {
      setUserRole(null);
    }
  }, [location]);

  const logout = () => {
    // Aquí va la lógica para realizar el logout
    // Al final, no olvides remover el usuario del local storage
    localStorage.removeItem('user');
    setUserRole(null);
  }

  return (
    <header className="header__primario">
      <Link to="/">
        <div className="logo">
          <img src={Logo} alt="" width="200" />
        </div>
      </Link>
      <div className="header_icons">
        <div className="cart">
          <Link to={"/cart"}>
            <box-icon name="cart" size="smallest"></box-icon>
          </Link>
          <span className="item__total">{cart.total}</span>
        </div>

        {userRole === 1 ? (
          <>
            <div className="profile">
              <Link to="/profile">
                <box-icon name="user"></box-icon>
              </Link>
            </div>

            <div className="logout">
              <button className="logoutBt" onClick={logout}>
                <div className="logout">
                  <box-icon name="log-out"></box-icon>
                </div>
              </button>
            </div>
          </>
        ) : userRole === 2 ? (
          <>
            <button onClick={logout}>
              <div className="logout">
                <box-icon name="log-out"></box-icon>
              </div>
            </button>
          </>
        ) : (
          location.pathname !== "/login" && (
            <Link to="/login">
              <div className="login">
                <box-icon name="user"></box-icon>
              </div>
            </Link>
          )
        )}
      </div>
    </header>
  );
};