import { useState, useEffect } from "react"
import { backendURL } from "../Globals"
import { Link } from 'react-router-dom'
import { Card, Col, Row, Alert, Table, Input, Button, Typography } from "antd"

let SearchFriendsPresentsComponent = (props) => {

    let { createNotification } = props
    let [error, setError] = useState({})
    let [presents, setPresents] = useState([])
    let [friendEmail, setFriendEmail] = useState("")
    let [message, setMessage] = useState([])

    useEffect(() => {
        let checkInputErrors = () => {
            let updatedErrors = {}
            if (friendEmail === null || friendEmail?.trim() === '') {
                updatedErrors.email = updatedErrors.email === undefined ? [] : [...updatedErrors.email]
                updatedErrors.email.push("Email cannot be null or empty")
            }
            if (friendEmail?.length < 3 || (friendEmail != null && !(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(friendEmail)))) {
                updatedErrors.email = updatedErrors.email === undefined ? [] : [...updatedErrors.email]
                updatedErrors.email.push("Incorrect email format")
            }
            setError(updatedErrors)
        }

        checkInputErrors()
    }, [friendEmail])

    let searchPresents = async () => {
        if (friendEmail !== "") {
            let response = await fetch(backendURL + "/presents?userEmail=" + friendEmail + "&apiKey=" + localStorage.getItem
                ("apiKey"))

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
    }

    let selectPresent = async (id) => {
        let response = await fetch(backendURL + "/presents/" + id + "?apiKey=" + localStorage.getItem("apiKey"), {
            method: "PUT"
        })
        if (response.ok) {
            createNotification("Present selected successfully")
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

        searchPresents()
    }

    let columns = [
        {
            title: "Name",
            dataIndex: "name",
            render: (name, present) => {
                return present.chosenBy !== null ? name : <Link onClick={() => selectPresent(present.id)} to="/searchFriendsPresents">{name}</Link>
            }
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
        }
    ]

    let { Text } = Typography
    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh" }}>
            <Col>
                {message.length > 0 && message.map(e => { return <Alert type="error" message={e} showIcon /> })}
                {presents.length <= 0 &&
                    <Card align="middle" title="Search your friend's presents" style={{ width: "500px" }}>
                        <Input size="large" type="text" placeholder="Email" onChange={
                            (e) => {
                                setFriendEmail(e.target.value)
                                setMessage([])
                            }} />
                        {error.email && error.email.map(e => { return <Text type="danger">{e}<br /></Text> })}
                        <Button type="primary" style={{ marginTop: "10px" }} block onClick={searchPresents}>Search presents</Button>
                    </Card>
                }
                {presents.length > 0 &&
                    <Card align="middle" title={friendEmail + "'s presents"} style={{ width: "100%" }}>
                        {presents.length <= 0 && <Alert type="error" message="No presents" showIcon />}
                        <Button type="primary" style={{ marginTop: "10px", float: "right" }} onClick={() => { setPresents([]) }}>Go back</Button>
                        <Table columns={columns} dataSource={presents}></Table>
                    </Card>
                }
            </Col>
        </Row>
    )
}

export default SearchFriendsPresentsComponent