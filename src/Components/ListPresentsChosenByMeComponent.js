import { useEffect, useState } from "react"
import { backendURL } from "../Globals"
import { Card, Col, Row, Alert, Table } from "antd"
import { Link } from "react-router-dom"

let ListPresentsChosenByMeComponent = () => {

    let [presents, setPresents] = useState([])
    let [message, setMessage] = useState([])

    useEffect(() => {
        getPresents()
    })

    let getPresents = async () => {
        let response = await fetch(backendURL + "/presents/chosenByMe?apiKey=" + localStorage.getItem("apiKey"))

        if (response.ok) {
            let jsonData = await response.json()
            setPresents(jsonData)
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
    }

    let columns = [
        {
            title: "Name",
            dataIndex: "name"
        },
        {
            title: "List name",
            dataIndex: "listName"
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
        }
    ]

    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh" }}>
            <Col>
                <Card title="Presents chosen" style={{ width: "500px" }}>
                    {presents.length <= 0 && <h3 className="errorMessage">No presents</h3>}
                    {message.length > 0 && <Alert type="error" message={message.map(e => { return <p className="errorMessage">{e}</p> })} />}
                    {presents.length > 0 && <Table columns={columns} dataSource={presents}></Table>}
                </Card>
            </Col>
        </Row>
    )
}

export default ListPresentsChosenByMeComponent