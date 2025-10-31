import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import SignupPage from '../pages/SignupPage'
import Login from '../pages/Login'
import CompleteDetail from '../pages/CompleteDetail'

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/signup",
        element: <SignupPage />
    },
    {
        path:"/complete-detail",
        element: <CompleteDetail/>
    },
    {
        path: "/",
        element: <App />,
        children: [
            {path: "/", element: <Home />},
        ]
    }
])

export default router