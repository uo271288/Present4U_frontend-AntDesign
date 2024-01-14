import { useState, useRef, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { backendURL } from "../Globals"
import { Button, Card, Col, Input, Row, Alert, Typography } from "antd"

let LoginComponent = (props) => {

    let { setLogin } = props
    let [message, setMessage] = useState([])
    let [error, setError] = useState({})
    let email = useRef("")
    let password = useRef("")
    let navigate = useNavigate()

    useEffect(() => {
        checkInputErrors()
    }, [error])

    let checkInputErrors = () => {
        let updatedErrors = {}

        if (email.current.input.value === null || email.current.input.value?.trim() === '') {
            updatedErrors.email = updatedErrors.email === undefined ? [] : [...updatedErrors.email]
            updatedErrors.email.push("Email cannot be null or empty")
        }
        if (email.current.input.value?.length < 3 || (email.current.input.value != null && !(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.current.input.value)))) {
            updatedErrors.email = updatedErrors.email === undefined ? [] : [...updatedErrors.email]
            updatedErrors.email.push("Incorrect email format")
        }
        if (password.current.input.value === null || password.current.input.value?.trim() === '') {
            updatedErrors.password = updatedErrors.password === undefined ? [] : [...updatedErrors.password]
            updatedErrors.password.push("Password cannot be null or empty")
        }
        if (password.current.input.value?.length < 5) {
            updatedErrors.password = updatedErrors.password === undefined ? [] : [...updatedErrors.password]
            updatedErrors.password.push("Incorrect password format")
        }
        setError(updatedErrors)
    }

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
                navigate("/home")
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

    let {Text} = Typography
    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh" }}>
            <Col>
                {message.length > 0 && message.map(e => { return <Alert type="error" message={e} showIcon /> })}
                <Card title="Login" style={{ width: "500px" }}>
                    <Input ref={email} size="large" type="text" placeholder="Your email" />
                    {error.email && error.email.map(e => { return <Text type="danger">{e}<br /></Text> })}
                    <Input ref={password} size="large" style={{ marginTop: "10px" }} type="password" placeholder="Your password" />
                    {error.password && error.password.map(e => { return <Text type="danger">{e}<br /></Text> })}
                    <Button type="primary" style={{ marginTop: "10px" }} block onClick={clickLogin}>Login</Button>
                </Card>
            </Col>
        </Row>
    )
}

export default LoginComponent