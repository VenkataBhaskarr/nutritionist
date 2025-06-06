import { Outlet} from "react-router-dom"
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

const ProtectedRoute = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem("token");
    if(!token){
        navigate("/")
    }
    api.get('/protectroute', { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
        //console.log(res)
        return <Outlet />
    }).catch((err) => {
        console.log(err)
        navigate("/")
    })

    return <Outlet />
}

export default ProtectedRoute