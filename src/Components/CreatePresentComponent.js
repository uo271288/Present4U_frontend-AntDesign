import { useState, useRef } from "react"
import { backendURL } from "../Globals"
import { Button, Card, Col, Input, Row, Alert } from "antd"

let CreatePresentComponent = () => {

    let [message, setMessage] = useState([])
    let name = useRef("")
    let description = useRef("")
    let url = useRef("")
    let price = useRef(0.0)

    let clickCreate = async () => {
        let response = await fetch(backendURL + "/presents?apiKey=" + localStorage.getItem("apiKey"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name.current.input.value,
                description: description.current.input.value,
                url: url.current.input.value,
                price: price.current.input.value
            })
        })
        if (!response.ok) {
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
        description.current.input.value = ""
        url.current.input.value = ""
        price.current.input.value = ""
    }

    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh" }}>
            <Col>
                {message.length > 0 && <Alert type="error" message={message.map(e => { return <p className="errorMessage">{e}</p> })} />}
                <Card align="middle" title="Create a present" style={{ width: "500px" }}>
                    <Input ref={name} size="large" type="text" placeholder="Name" />
                    <Input ref={description} size="large" style={{ marginTop: "10px" }} type="text" placeholder="Description" />
                    <Input ref={url} size="large" style={{ marginTop: "10px" }} type="text" placeholder="https://example.com" />
                    <Input ref={price} size="large" style={{ marginTop: "10px" }} type="number" step=".01" placeholder="10.0" />
                    <Button type="primary" style={{ marginTop: "10px" }} block onClick={clickCreate}>Create present</Button>
                </Card>
            </Col>
        </Row>
    )
}

export default CreatePresentComponent