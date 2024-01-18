import { useState, useRef, useEffect } from "react"
import { backendURL } from "../Globals"
import { Card, Col, Row, Alert, Input, Button, Typography } from "antd"

let SearchFriendsPresentsComponent = (props) => {

    let { createNotification } = props
    let [message, setMessage] = useState([])
    let [error, setError] = useState({})
    let nameInput = useRef("")
    let [nameValue, setNameValue] = useState("")

    useEffect(() => {
        let checkInputErrors = () => {
            let updatedErrors = {}

            if (nameValue === null || nameValue?.trim() === '') {
                updatedErrors.name = updatedErrors.name === undefined ? [] : [...updatedErrors.name]
                updatedErrors.name.push("Name cannot be null or empty")
            }
            setError(updatedErrors)
        }
        checkInputErrors()
    }, [nameValue])

    let clickCreate = async () => {

        let response = await fetch(backendURL + "/lists?apiKey=" + localStorage.getItem("apiKey"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: nameValue
            })
        })
        if (response.ok) {
            createNotification("List created successfully")
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
    }

    let { Text } = Typography
    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh" }}>
            <Col>
                {message.length > 0 && message.map(e => { return <Alert type="error" message={e} showIcon /> })}
                <Card title="Create list" style={{ width: "500px" }}>
                    <Input ref={nameInput} size="large" type="text" placeholder="Name" onChange={(e) => {
                        setNameValue(e.target.value)
                        setMessage([])
                        }} value={nameValue} />
                    {error.name && error.name.map(e => { return <Text type="danger">{e}<br /></Text> })}
                    <Button type="primary" style={{ marginTop: "10px" }} block onClick={clickCreate}>Create list</Button>
                </Card>
            </Col>
        </Row>
    )
}

export default SearchFriendsPresentsComponent