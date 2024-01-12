import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { backendURL } from "../Globals"

let LoginComponent = (props) => {

    let { setLogin } = props
    let [message, setMessage] = useState([])
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let navigate = useNavigate()

    let changeEmail = (e) => {
        setEmail(e.currentTarget.value)
    }
    let changePassword = (e) => {
        setPassword(e.currentTarget.value)
    }

    let clickLogin = async () => {
        let response = await fetch(backendURL + "/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        let jsonData = await response.json()
        if (response.ok) {
            if (jsonData.apiKey != null) {
                localStorage.setItem("apiKey", jsonData.apiKey)
                localStorage.setItem("idUser", jsonData.id)
                localStorage.setItem("email", jsonData.email)
                setLogin(true)
                navigate("/")
            }
        } else {
            if (Array.isArray(jsonData.error)) {
                setMessage(jsonData.error)
            } else {
                let finalError = []
                finalError.push(jsonData.error)
                setMessage(finalError)
            }
        }
    }

    return (
        <div className="main-container">
            <h2>Login</h2>
            {message != null && message.map(e => { return <p className="errorMessage">{e}</p> })}
            <div className="center-box">
                <div className='form-group'>
                    <input type='text' placeholder='Email' onChange={changeEmail} />
                </div>
                <div className='form-group'>
                    <input type='password' placeholder='Password' onChange={changePassword} />
                </div>
                <button onClick={clickLogin}>Login</button>
            </div>
        </div>
    )
}

export default LoginComponent