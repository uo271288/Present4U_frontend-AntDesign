import { useEffect, useState, useRef } from "react"
import { backendURL } from "../Globals"
import { useParams, useNavigate } from "react-router-dom"
import { Alert, Button, Card, Col, Input, Row } from "antd"

let ModifyPresentComponent = (props) => {

    let { createNotification } = props
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

    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh" }}>
            <Col>
                {message.length > 0 && <Alert type="error" message={message.map(e => { return <p className="errorMessage">{e}</p> })} />}
                {message.length <= 0 &&
                    <Card title="Edit present" style={{ width: "500px" }}>
                        <Input ref={nameInput} size="large" type="text" placeholder="Name" value={nameValue} onChange={(e) => setNameValue(e.target.value)} />
                        <Input ref={descriptionInput} style={{ marginTop: "10px" }} size="large" type="text" placeholder="Description" value={descriptionValue} onChange={(e) => setDescriptionValue(e.target.value)} />
                        <Input ref={urlInput} style={{ marginTop: "10px" }} size="large" type="text" placeholder="https://example.com" value={urlValue} onChange={(e) => setUrlValue(e.target.value)} />
                        <Input ref={priceInput} style={{ marginTop: "10px" }} size="large" type="number" step={0.01} placeholder="10.0" value={priceValue} onChange={(e) => setPriceValue(e.target.value)} />
                        <Button type="primary" style={{ marginTop: "10px" }} block onClick={clickEdit}>Edit present</Button>
                    </Card>
                }
            </Col>
        </Row>
    )
}

export default ModifyPresentComponent
