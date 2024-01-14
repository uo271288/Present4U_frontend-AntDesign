import { useEffect, useState, useRef } from "react"
import { backendURL } from "../Globals"
import { useParams, useNavigate } from "react-router-dom"
import { Alert, Button, Card, Col, Input, Row, Typography } from "antd"

let ModifyPresentComponent = (props) => {

    let { createNotification } = props
    let [error, setError] = useState({})
    let nameInput = useRef("")
    let descriptionInput = useRef("")
    let urlInput = useRef("")
    let priceInput = useRef(0.0)
    let [nameValue, setNameValue] = useState("")
    let [descriptionValue, setDescriptionValue] = useState("")
    let [urlValue, setUrlValue] = useState("")
    let [priceValue, setPriceValue] = useState(0.0)
    let [message, setMessage] = useState([])
    let { presentId } = useParams()
    let navigate = useNavigate()

    useEffect(() => {
        let getPresent = async () => {
            let response = await fetch(backendURL + "/presents/" + presentId + "?apiKey=" + localStorage.getItem("apiKey"))

            let jsonData = await response.json()
            if (response.ok) {
                setNameValue(jsonData.name)
                setDescriptionValue(jsonData.description)
                setUrlValue(jsonData.url)
                setPriceValue(jsonData.price)
            }
            else {
                if (Array.isArray(jsonData.error)) {
                    setMessage(jsonData.error)
                } else {
                    let finalError = []
                    finalError.push(jsonData.error)
                    setMessage(finalError)
                }
            }
        }

        getPresent()
    }, [presentId])

    useEffect(() => {
        let checkInputErrors = () => {
            let updatedErrors = {}

            if (nameValue === null || nameValue?.trim() === '') {
                updatedErrors.name = updatedErrors.name === undefined ? [] : [...updatedErrors.name]
                updatedErrors.name.push("Name cannot be null or empty")
            }
            if (descriptionValue === null || descriptionValue?.trim() === '') {
                updatedErrors.description = updatedErrors.description === undefined ? [] : [...updatedErrors.description]
                updatedErrors.description.push("Description cannot be null or empty")
            }
            if (urlValue === null || urlValue?.trim() === '') {
                updatedErrors.url = updatedErrors.url === undefined ? [] : [...updatedErrors.url]
                updatedErrors.url.push("Url cannot be null or empty")
            }
            if (urlValue != null && !(/(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g.test(urlValue))) {
                updatedErrors.url = updatedErrors.url === undefined ? [] : [...updatedErrors.url]
                updatedErrors.url.push("Incorrect url format")
            }
            if (priceValue === null || (priceValue + '')?.trim() === '') {
                updatedErrors.price = updatedErrors.price === undefined ? [] : [...updatedErrors.price]
                updatedErrors.price.push("Price cannot be null or empty")
            }
            if (parseFloat(priceValue) <= 0) {
                updatedErrors.price = updatedErrors.price === undefined ? [] : [...updatedErrors.price]
                updatedErrors.price.push("Price cannot be negative or zero")
            }
            setError(updatedErrors)
        }

        checkInputErrors()
    }, [error, descriptionValue, nameValue, priceValue, urlValue])

    let clickEdit = async () => {
        let response = await fetch(backendURL + "/presents/" + presentId + "?apiKey=" + localStorage.getItem("apiKey"), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: nameValue,
                description: descriptionValue,
                url: urlValue,
                price: priceValue
            })
        })
        if (response.ok) {
            createNotification("Present modified successfully")
        } else {
            let jsonData = await response.json()
            if (Array.isArray(jsonData)) {
                setMessage(jsonData)
            } else {
                let finalError = []
                finalError.push(jsonData)
                setMessage(finalError)
            }
        }

        navigate("/myPresents")
    }

    let { Text } = Typography
    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh" }}>
            <Col>
                {message.length > 0 && <Alert type="error" message={message.map(e => { return <p className="errorMessage">{e}</p> })} />}
                {message.length <= 0 &&
                    <Card title="Edit present" style={{ width: "500px" }}>
                        <Input ref={nameInput} size="large" type="text" placeholder="Name" value={nameValue} onChange={(e) => setNameValue(e.target.value)} />
                        {error.name && error.name.map(e => { return <Text type="danger">{e}<br /></Text> })}
                        <Input ref={descriptionInput} style={{ marginTop: "10px" }} size="large" type="text" placeholder="Description" value={descriptionValue} onChange={(e) => setDescriptionValue(e.target.value)} />
                        {error.description && error.description.map(e => { return <Text type="danger">{e}<br /></Text> })}
                        <Input ref={urlInput} style={{ marginTop: "10px" }} size="large" type="text" placeholder="https://example.com" value={urlValue} onChange={(e) => setUrlValue(e.target.value)} />
                        {error.url && error.url.map(e => { return <Text type="danger">{e}<br /></Text> })}
                        <Input ref={priceInput} style={{ marginTop: "10px" }} size="large" type="number" step={0.01} placeholder="10.0" value={priceValue} onChange={(e) => setPriceValue(e.target.value)} />
                        {error.price && error.price.map(e => { return <Text type="danger">{e}<br /></Text> })}
                        <Button type="primary" style={{ marginTop: "10px" }} block onClick={clickEdit}>Edit present</Button>
                    </Card>
                }
            </Col>
        </Row>
    )
}

export default ModifyPresentComponent
