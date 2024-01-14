import { useEffect, useState, useRef } from "react"
import { backendURL } from "../Globals"
import { Link } from 'react-router-dom'
import { Card, Col, Row, Alert, List, Input, Button, Divider, Typography } from "antd"

let ListFriendsComponent = (props) => {

    let { createNotification } = props
    let [error, setError] = useState({})
    let [friends, setFriends] = useState([])
    let [emailValue, setEmailValue] = useState("")
    let emailInput = useRef("")
    let [message, setMessage] = useState([])

    useEffect(() => {
        getFriends()
    })

    useEffect(() => {
        let checkInputErrors = () => {
            let updatedErrors = {}
            if (emailValue === null || emailValue?.trim() === '') {
                updatedErrors.email = updatedErrors.email === undefined ? [] : [...updatedErrors.email]
                updatedErrors.email.push("Email cannot be null or empty")
            }
            if (emailValue?.length < 3 || (emailValue != null && !(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(emailValue)))) {
                updatedErrors.email = updatedErrors.email === undefined ? [] : [...updatedErrors.email]
                updatedErrors.email.push("Incorrect email format")
            }
            setError(updatedErrors)
        }

        checkInputErrors()
    }, [emailValue])

    let getFriends = async () => {
        let response = await fetch(backendURL + "/friends?apiKey=" + localStorage.getItem("apiKey"))

        if (response.ok) {
            let jsonData = await response.json()
            setFriends(jsonData)
        }
    }

    let deleteFriend = async (id) => {
        await fetch(backendURL + "/friends/" + id + "?apiKey=" + localStorage.getItem("apiKey"), {
            method: "DELETE"
        })
        createNotification("Friend deleted successfully")
    }

    let addFriend = async () => {
        let response = await fetch(backendURL + "/friends?apiKey=" + localStorage.getItem("apiKey"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: emailValue
            })
        })
        if (response.ok) {
            createNotification("Friend added successfully")
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

        getFriends()
        setEmailValue("")
    }

    let { Text } = Typography
    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh" }}>
            <Col>
                <Card title="My friends" style={{ width: "500px" }}>
                    {message.length > 0 && message.map(e => { return <Alert type="error" message={e} showIcon /> })}
                    {friends.length <= 0 && <h3 className="errorMessage">No friends</h3>}
                    {friends.length > 0 && <List
                        bordered
                        dataSource={friends}
                        renderItem={(friend) => (
                            <List.Item>
                                {friend.emailFriend} <Link to="/myFriends"><img style={{ float: "right" }} alt="delete" onClick={() => deleteFriend(friend.emailFriend)} src="redCross.png" /></Link>
                            </List.Item>
                        )}
                    />}
                    <Divider orientation="left">Add a new friend</Divider>
                    <Input ref={emailInput} size="large" type="text" style={{ marginTop: "10px" }} placeholder="Your frind's email" value={emailValue} onChange={(e) => {
                        setEmailValue(e.target.value)
                        setMessage([])
                    }} />
                    {error.email && error.email.map(e => { return <Text type="danger">{e}<br /></Text> })}
                    <Button type="primary" style={{ marginTop: "10px" }} block onClick={addFriend}>Add friend</Button>
                </Card>
            </Col>
        </Row>
    )
}

export default ListFriendsComponent