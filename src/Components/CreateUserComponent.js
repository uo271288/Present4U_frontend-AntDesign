import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { backendURL } from "../Globals"

let CreateUserComponent = () => {

    let [message, setMessage] = useState([])
    let [name, setName] = useState("")
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let navigate = useNavigate()

    let changeName = (e) => {
        setName(e.currentTarget.value)
    }
    let changeEmail = (e) => {
        setEmail(e.currentTarget.value)
    }
    let changePassword = (e) => {
        setPassword(e.currentTarget.value)
    }

    let clickCreate = async () => {
        let response = await fetch(backendURL + "/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        })
        if (response.ok) {
            navigate("/login")
        } else {
            let jsonData = await response.json()
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
            <h2>Register</h2>
            {message != null && message.map(e => { return <p className="errorMessage">{e}</p> })}
            <div className="center-box">
                <div className='form-group'>
                    <input type='text' placeholder='Name' onChange={changeName} />
                </div>
                <div className='form-group'>
                    <input type='text' placeholder='Email' onChange={changeEmail} />
                </div>
                <div className='form-group'>
                    <input type='password' placeholder='Password' onChange={changePassword} />
                </div>
                <button onClick={clickCreate}>Register</button>
            </div>
        </div>
    )
}

export default CreateUserComponent