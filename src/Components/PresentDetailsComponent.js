import { useEffect, useState } from "react"
import { backendURL } from "../Globals"
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Card, Col, Row, Button, Alert, Descriptions } from "antd"

let ListPresentsComponent = () => {

    let navigate = useNavigate()
    let [present, setPresent] = useState({})
    let [message, setMessage] = useState([])
    let { presentId } = useParams()

    useEffect(() => {
        getPresents()
    })

    let getPresents = async () => {
        let response = await fetch(backendURL + "/presents/" + presentId + "?apiKey=" + localStorage.getItem("apiKey"))

        let jsonData = await response.json()
        if (response.ok) {
            setPresent(jsonData)
        } else {
            if (Array.isArray(jsonData.error)) {
                setMessage(jsonData.error)
            } else {
                let finalError = []
                finalError.push(jsonData.error)
                setMessage(finalError)
            }
        }
    }

    let items = [
        {
            key: '1',
            label: 'Name',
            children: present.name
        },
        {
            key: '2',
            label: 'List name',
            children: present.listName
        },
        {
            key: '3',
            label: 'Price',
            children: present.price + '€'
        },
        {
            key: '4',
            label: 'Url',
            span: 4,
            children: <Link to={present.url}>{present.url}</Link>
        },
        {
            key: '5',
            label: 'Desciption',
            span: 4,
            children: present.description
        }
    ]

    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh" }}>
            <Col>
                <Card style={{ width: "100%" }}>
                    {message.length > 0 && <Alert type="error" message={message.map(e => { return <p className="errorMessage">{e}</p> })} />}
                    <Button type="primary" style={{ marginBottom: "10px", float: "right" }} onClick={() => { navigate("/myPresents") }}>Go back</Button>
                    <Descriptions title="Present details" layout="vertical" column={4} bordered items={items} />
                </Card>
            </Col>
        </Row>
    )
}

export default ListPresentsComponent