import { useState, useRef, useEffect } from "react"
import { backendURL } from "../Globals"
import { Button, Card, Col, Input, Row, Alert, Typography } from "antd"

let CreatePresentComponent = (props) => {

    let { createNotification } = props
    let [message, setMessage] = useState([])
    let [error, setError] = useState({})
    let nameInput = useRef("")
    let descriptionInput = useRef("")
    let urlInput = useRef("")
    let priceInput = useRef(0.0)
    let listNameInput = useRef("")
    let [nameValue, setNameValue] = useState("")
    let [descriptionValue, setDescriptionValue] = useState("")
    let [urlValue, setUrlValue] = useState("")
    let [priceValue, setPriceValue] = useState("")
    let [listNameValue, setListNameValue] = useState("")

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
            if (listNameValue === null || (listNameValue + '')?.trim() === '') {
                updatedErrors.listName = updatedErrors.listName === undefined ? [] : [...updatedErrors.listName]
                updatedErrors.listName.push("List name cannot be null or empty")
            }
            setError(updatedErrors)
        }

        checkInputErrors()
    }, [error, descriptionValue, nameValue, priceValue, urlValue, listNameValue])


    let clickCreate = async () => {

        let listResponse = await fetch(backendURL + "/lists/name/" + listNameValue + "?apiKey=" + localStorage.getItem("apiKey"))
        let listId
        if (listResponse.ok) {
            let jsonData = await listResponse.json()
            listId = jsonData.id
        } else {
            let jsonData = await listResponse.json()
            if (Array.isArray(jsonData.error)) {
                setMessage(jsonData.error)
            } else {
                let finalError = []
                finalError.push(jsonData.error)
                setMessage(finalError)
            }
        }

        let response = await fetch(backendURL + "/presents?apiKey=" + localStorage.getItem("apiKey"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: nameValue,
                description: descriptionValue,
                url: urlValue,
                price: priceValue,
                listId: listId
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

        setNameValue("")
        setDescriptionValue("")
        setUrlValue("")
        setPriceValue("")
        setListNameValue("")
    }

    let { Text } = Typography
    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh" }}>
            <Col>
                {message.length > 0 && message.map(e => { return <Alert type="error" message={e} showIcon /> })}
                <Card title="Create a present" style={{ width: "500px" }}>
                    <Input ref={nameInput} size="large" type="text" placeholder="Name" onChange={(e) => setNameValue(e.target.value)} value={nameValue} />
                    {error.name && error.name.map(e => { return <Text type="danger">{e}<br /></Text> })}
                    <Input ref={descriptionInput} size="large" style={{ marginTop: "10px" }} type="text" placeholder="Description" onChange={(e) => setDescriptionValue(e.target.value)} value={descriptionValue} />
                    {error.description && error.description.map(e => { return <Text type="danger">{e}<br /></Text> })}
                    <Input ref={urlInput} size="large" style={{ marginTop: "10px" }} type="text" placeholder="https://example.com" onChange={(e) => setUrlValue(e.target.value)} value={urlValue} />
                    {error.url && error.url.map(e => { return <Text type="danger">{e}<br /></Text> })}
                    <Input ref={priceInput} size="large" style={{ marginTop: "10px" }} type="number" step=".01" placeholder="10.0" onChange={(e) => setPriceValue(e.target.value)} value={priceValue} />
                    {error.price && error.price.map(e => { return <Text type="danger">{e}<br /></Text> })}
                    <Input ref={listNameInput} size="large" style={{ marginTop: "10px" }} type="text" placeholder="Wishlist" onChange={(e) => setListNameValue(e.target.value)} value={listNameValue} />
                    {error.listName && error.listName.map(e => { return <Text type="danger">{e}<br /></Text> })}
                    <Button type="primary" style={{ marginTop: "10px" }} block onClick={clickCreate}>Create present</Button>
                </Card>
            </Col>
        </Row>
    )
}

export default CreatePresentComponent