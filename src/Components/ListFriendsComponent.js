import { useEffect, useState, useRef } from "react"
import { backendURL } from "../Globals"
import { Link } from 'react-router-dom'
import { Card, Col, Row, Alert, List, Input, Button, Divider } from "antd"

let ListFriendsComponent = () => {

    let [friends, setFriends] = useState([])
    let [emailValue, setEmailValue] = useState("")
    let emailInput = useRef("")
    let [message, setMessage] = useState([])

    useEffect(() => {
        getFriends()
    })

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

        getFriends()
    }

    let addFriend = async () => {
        let response = await fetch(backendURL + "/friends?apiKey=" + localStorage.getItem("apiKey"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: emailValue
            })
        })
        if (!response.ok) {
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

    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh" }}>
            <Col>
                <Card title="My friends" style={{ width: "500px" }}>
                    {message.length > 0 && <Alert type="error" message={message.map(e => { return <p className="errorMessage">{e}</p> })} />}
                    {friends.length <= 0 && <h3 className="errorMessage">No friends</h3>}
                    {friends.length > 0 && <List
                        bordered
                        dataSource={friends}
                        renderItem={(friend) => (
                            <List.Item>
                                {friend.emailFriend} <Link to="/listFriends"><img style={{ float: "right" }} alt="delete" onClick={() => deleteFriend(friend.emailFriend)} src="redCross.png" /></Link>
                            </List.Item>
                        )}
                    />}
                    <Divider orientation="left">Add a new friend</Divider>
                    <Input ref={emailInput} size="large" type="text" style={{ marginTop: "10px" }} placeholder="Your frind's email" value={emailValue} onChange={(e) => setEmailValue(e.target.value)} />
                    <Button type="primary" style={{ marginTop: "10px" }} block onClick={addFriend}>Add friend</Button>
                </Card>
            </Col>
        </Row>
    )
}

export default ListFriendsComponent