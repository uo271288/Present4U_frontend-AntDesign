import { useState, useRef } from "react"
import { useNavigate } from 'react-router-dom'
import { backendURL } from "../Globals"
import { Button, Card, Col, Input, Row, Alert } from "antd"

let LoginComponent = (props) => {

    let { setLogin } = props
    let [message, setMessage] = useState([])
    let email = useRef("")
    let password = useRef("")
    let navigate = useNavigate()

    let clickLogin = async () => {
        let response = await fetch(backendURL + "/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email.current.input.value,
                password: password.current.input.value
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
        email.current.input.value = ""
        password.current.input.value = ""
    }

    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh" }}>
            <Col>
                {message.length > 0 && <Alert type="error" message={message.map(e => { return <p className="errorMessage">{e}</p> })} />}
                <Card title="Login" style={{ width: "500px" }}>
                    <Input ref={email} size="large" type="text" placeholder="Your email" />
                    <Input ref={password} size="large" style={{ marginTop: "10px" }} type="password" placeholder="Your password" />
                    <Button type="primary" style={{ marginTop: "10px" }} block onClick={clickLogin}>Login</Button>
                </Card>
            </Col>
        </Row>
    )
}

export default LoginComponent