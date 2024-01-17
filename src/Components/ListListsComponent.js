import { useEffect, useState } from "react"
import { backendURL } from "../Globals"
import { Card, Col, Row, Alert, List } from "antd"

let ListListsComponent = () => {

    let [lists, setLists] = useState([])
    let [message, setMessage] = useState([])

    useEffect(() => {
        getLists()
    })

    let getLists = async () => {
        let response = await fetch(backendURL + "/lists?apiKey=" + localStorage.getItem("apiKey"))

        if (response.ok) {
            let jsonData = await response.json()
            setLists(jsonData)
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

    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh" }}>
            <Col>
                <Card title="My lists" style={{ width: "500px" }}>
                    {message.length > 0 && message.map(e => { return <Alert type="error" message={e} showIcon /> })}
                    {lists.length <= 0 && <h3 className="errorMessage">No lists</h3>}
                    {lists.length > 0 && <List
                        bordered
                        dataSource={lists}
                        renderItem={(list) => (
                            <List.Item>
                                {list.name}
                            </List.Item>
                        )}
                    />}
                </Card>
            </Col>
        </Row>
    )
}

export default ListListsComponent