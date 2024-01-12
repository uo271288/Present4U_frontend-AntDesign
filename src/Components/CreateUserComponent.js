import { useRef, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { backendURL } from "../Globals"
import { Button, Card, Col, Input, Row, Alert } from "antd"

let CreateUserComponent = () => {

    let [message, setMessage] = useState([])
    let name = useRef("")
    let email = useRef("")
    let password = useRef("")
    let navigate = useNavigate()

    let clickCreate = async () => {
        let response = await fetch(backendURL + "/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name.current.input.value,
                email: email.current.input.value,
                password: password.current.input.value
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
        name.current.input.value = ""
        email.current.input.value = ""
        password.current.input.value = ""
    }

    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh" }}>
            <Col>
                {message.length > 0 && <Alert type="error" message={message.map(e => { return <p className="errorMessage">{e}</p> })} />}
                <Card title="Register" style={{ width: "500px" }}>
                    <Input ref={name} size="large" type="text" placeholder="Name" />
                    <Input ref={email} size="large" style={{ marginTop: "10px" }} type="text" placeholder="Your email" />
                    <Input ref={password} size="large" style={{ marginTop: "10px" }} type="password" placeholder="Your password" />
                    <Button type="primary" style={{ marginTop: "10px" }} block onClick={clickCreate}>Create account</Button>
                </Card>
            </Col>
        </Row>
    )
}

export default CreateUserComponent