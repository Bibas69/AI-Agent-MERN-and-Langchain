import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import SignupPage from '../pages/SignupPage'

const router = createBrowserRouter([
    {
        path: "/login",
        element: <p>Login</p>
    },
    {
        path: "/signup",
        element: <SignupPage />
    },
    {
        path: "/",
        element: <App />,
        children: [
            {path: "/", element: <Home />}
        ]
    }
])

export default router