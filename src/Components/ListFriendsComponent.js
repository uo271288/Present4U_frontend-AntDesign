import { useEffect, useState, useRef } from "react"
import { backendURL } from "../Globals"
import { Link } from 'react-router-dom'

let ListFriendsComponent = () => {

    let [friends, setFriends] = useState([])
    let email = useRef("")
    let [message, setMessage] = useState([])

    useEffect(() => {
        getFriends()
    }, [])

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
                email: email.current.value
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

        email.current.value = ""
        getFriends()
    }

    return (
        <div className="main-container" >
            <h2>My friends</h2>
            {message != null && message.map(e => { return <p className="errorMessage">{e}</p> })}
            {friends.length <= 0 && <h3 className="errorMessage">No friends</h3>}
            {friends.length > 0 && <table>
                <tr>
                    <th>Email</th>
                    <th></th>
                </tr>
                {friends.map(friend => (
                    <tr>
                        <td>{friend.emailFriend}</td>
                        <td><Link to="/listFriends"><img alt="delete" onClick={() => deleteFriend(friend.emailFriend)} src="redCross.png" /></Link></td>
                    </tr>
                ))
                }
            </table>
            }
            <div className='friend-form-group'>
                <input ref={email} className="add-friend-input" type='text' placeholder='Email'/>
                <button className="add-friend-button" onClick={addFriend}>Add friend</button>
            </div>
        </div>
    )
}

export default ListFriendsComponent