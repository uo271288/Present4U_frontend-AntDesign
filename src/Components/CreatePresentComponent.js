import { useState, useRef, useEffect } from "react"
import { backendURL } from "../Globals"
import { Button, Card, Col, Input, Row, Alert, Typography } from "antd"

let CreatePresentComponent = (props) => {

    let { createNotification } = props
    let [message, setMessage] = useState([])
    let [error, setError] = useState({})
    let name = useRef("")
    let description = useRef("")
    let url = useRef("")
    let price = useRef(0.0)

    useEffect(() => {
        checkInputErrors()
    }, [error])

    let checkInputErrors = () => {
        let updatedErrors = {}

        if (name.current.input.value === null || name.current.input.value?.trim() === '') {
            updatedErrors.name = updatedErrors.name === undefined ? [] : [...updatedErrors.name]
            updatedErrors.name.push("Name cannot be null or empty")
        }
        if (description.current.input.value === null || description.current.input.value?.trim() === '') {
            updatedErrors.description = updatedErrors.description === undefined ? [] : [...updatedErrors.description]
            updatedErrors.description.push("Description cannot be null or empty")
        }
        if (url.current.input.value === null || url.current.input.value?.trim() === '') {
            updatedErrors.url = updatedErrors.url === undefined ? [] : [...updatedErrors.url]
            updatedErrors.url.push("Url cannot be null or empty")
        }
        if (url.current.input.value != null && !(/(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g.test(url.current.input.value))) {
            updatedErrors.url = updatedErrors.url === undefined ? [] : [...updatedErrors.url]
            updatedErrors.url.push("Incorrect url format")
        }
        if (price.current.input.value === null || price.current.input.value?.trim() === '') {
            updatedErrors.price = updatedErrors.price === undefined ? [] : [...updatedErrors.price]
            updatedErrors.price.push("Price cannot be null or empty")
        }
        if (parseFloat(price.current.input.value) < 0) {
            updatedErrors.price = updatedErrors.price === undefined ? [] : [...updatedErrors.price]
            updatedErrors.price.push("Price cannot be negative")
        }
        setError(updatedErrors)
    }

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
        if (response.ok) {
            createNotification("Present created successfully")
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
        description.current.input.value = ""
        url.current.input.value = ""
        price.current.input.value = ""
    }

    let { Text } = Typography
    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh" }}>
            <Col>
                {message.length > 0 && message.map(e => { return <Alert type="error" message={e} showIcon /> })}
                <Card title="Create a present" style={{ width: "500px" }}>
                    <Input ref={name} size="large" type="text" placeholder="Name" />
                    {error.name && error.name.map(e => { return <Text type="danger">{e}<br /></Text> })}
                    <Input ref={description} size="large" style={{ marginTop: "10px" }} type="text" placeholder="Description" />
                    {error.description && error.description.map(e => { return <Text type="danger">{e}<br /></Text> })}
                    <Input ref={url} size="large" style={{ marginTop: "10px" }} type="text" placeholder="https://example.com" />
                    {error.url && error.url.map(e => { return <Text type="danger">{e}<br /></Text> })}
                    <Input ref={price} size="large" style={{ marginTop: "10px" }} type="number" step=".01" placeholder="10.0" />
                    {error.price && error.price.map(e => { return <Text type="danger">{e}<br /></Text> })}
                    <Button type="primary" style={{ marginTop: "10px" }} block onClick={clickCreate}>Create present</Button>
                </Card>
            </Col>
        </Row>
    )
}

export default CreatePresentComponent