import { useEffect, useState } from "react"
import { backendURL } from "../Globals"
import { Link } from 'react-router-dom'
import { Card, Col, Row, Alert, Table } from "antd"

let ListPresentsComponent = (props) => {

    let { createNotification } = props
    let [presents, setPresents] = useState([])
    let [message, setMessage] = useState([])

    useEffect(() => {
        getPresents()
    })

    let getPresents = async () => {
        let response = await fetch(backendURL + "/presents?apiKey=" + localStorage.getItem("apiKey"))

        let jsonData = await response.json()
        if (response.ok) {
            setPresents(jsonData)
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

    let deletePresent = async (id) => {
        await fetch(backendURL + "/presents/" + id + "?apiKey=" + localStorage.getItem("apiKey"), {
            method: "DELETE"
        })
        createNotification("Present deleted successfully")
    }

    let columns = [
        {
            title: "Name",
            dataIndex: "name",
            render: (name, present) => { return <Link to={"/presentDetails/" + present.id}>{name}</Link> }
        },
        {
            title: "Description",
            dataIndex: "description"
        },
        {
            title: "Url",
            dataIndex: "url",
            render: (url) => { return <Link to={url}>{url}</Link> }
        },
        {
            title: "Price",
            dataIndex: "price",
            render: (price) => { return price + "€" }
        },
        {
            title: "Chosen by",
            dataIndex: "chosenBy",
            render: (chosenBy) => {
                return chosenBy === null ? "-" : chosenBy
            }
        },
        {
            title: "",
            dataIndex: "id",
            render: (id) => {
                return <Link to="/myPresents"><img alt="delete" onClick={() => deletePresent(id)} src="redCross.png" /></Link>
            }
        },
        {
            title: "",
            dataIndex: "id",
            render: (id) => {
                return <Link to={"/modifyPresent/" + id}><img alt="modify" src="greenPencil.png" /></Link>
            }
        }

    ]

    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh" }}>
            <Col>
                <Card title="My presents" style={{ width: "100%" }}>
                    {presents.length <= 0 && <h3 className="errorMessage">No presents</h3>}
                    {message.length > 0 && <Alert type="error" message={message.map(e => { return <p className="errorMessage">{e}</p> })} />}
                    {presents.length > 0 && <Table columns={columns} dataSource={presents}></Table>}
                </Card>
            </Col>
        </Row>
    )
}

export default ListPresentsComponent