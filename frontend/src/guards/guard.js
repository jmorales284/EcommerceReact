import { Navigate } from 'react-router-dom';


/*autenticacionGuard
Objetivo: Proteger el acceso a un componente mediante autenticación.

Parámetros:

Componente: El componente que se desea proteger con autenticación.
Valor de retorno:

React.Component o React.Element: El componente protegido o la redirección al componente de inicio de sesión.
Uso previsto: Esta función se utiliza para envolver un componente y verificar si el usuario está autenticado antes de permitir el acceso al componente. 
Si el usuario no está autenticado, se redirige al componente de inicio de sesión. */
export function autenticacionGuard(Componente) {
    const accessToken = localStorage.getItem('accessToken');
  
    if (accessToken) {
      // El usuario está autenticado, permite el acceso al componente
      return Componente;
    } else {
      // El usuario no está autenticado, redirige o muestra un componente de inicio de sesión
      return <Navigate to="/login" />;
    }
  }

/*adminGuard
Objetivo: Proteger el acceso a un componente para los administradores.

Parámetros:

Componente: El componente que se desea proteger para los administradores.
Valor de retorno:

React.Component o React.Element: El componente protegido o la redirección a la página de inicio.
Uso previsto: Esta función se utiliza para envolver un componente y verificar si el usuario está autenticado y es un administrador 
antes de permitir el acceso al componente. Si el usuario no cumple con estas condiciones, se redirige a la página de inicio. */

  export function adminGuard(Componente) {
    const accessToken = localStorage.getItem('accessToken');
    const admin = JSON.parse(localStorage.getItem('user'));
    
    if (admin && admin.ID_Rol === 1 && accessToken) {
      // El usuario está autenticado y es un administrador, permite el acceso al componente
      return Componente;
    } else {
      // Redirige a la página de inicio
      return <Navigate to="/" replace />;
    }
  }
  