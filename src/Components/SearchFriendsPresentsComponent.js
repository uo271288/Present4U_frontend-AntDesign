import { useEffect, useState } from "react"
import { backendURL } from "../Globals"
import { Link } from 'react-router-dom'

let SearchFriendsPresentsComponent = () => {

    let [presents, setPresents] = useState([])
    let [friendEmail, setFriendEmail] = useState("")
    let [message, setMessage] = useState([])

    useEffect(() => {
        searchPresents()
    }, [])

    let changeFriendEmail = (e) => {
        setFriendEmail(e.currentTarget.value)
        console.log(friendEmail)
    }

    let searchPresents = async () => {
        if (friendEmail !== "") {
            let response = await fetch(backendURL + "/presents?userEmail=" + friendEmail + "&apiKey=" + localStorage.getItem
                ("apiKey"))
            console.log(friendEmail)

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
        if (!response.ok) {
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

    return (
        <div className="main-container" style={{ "max-width": "90%" }}>
            {presents.length <= 0 &&
                <div className='friend-form-group'>
                    <input className="add-friend-input" type='text' placeholder='Email' onChange={changeFriendEmail} />
                    <button className="add-friend-button" onClick={() => searchPresents()}>Search presents</button>
                </div>
            }
            {message != null && message.map(e => { return <p className="errorMessage">{e}</p> })}
            {presents.length > 0 && <>
                <h2>{friendEmail}'s presents</h2>
                {presents.length <= 0 && <h3 className="errorMessage">No presents</h3>}
                {presents.length > 0 && <table>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Url</th>
                        <th>Price</th>
                        <th>Chosen by</th>
                    </tr>
                    {presents.map(present => (
                        <tr>
                            {present.chosenBy !== null && <td>{present.name}</td>}
                            {present.chosenBy === null && <td onClick={() => selectPresent(present.id)}><Link to="/searchFriendsPresents">{present.name}</Link></td>}
                            <td>{present.description}</td>
                            <td><a href={present.url}>{present.url}</a></td>
                            <td>{present.price}€</td>
                            {present.chosenBy === null && <td>-</td>}
                            {present.chosenBy !== null && <td>{present.chosenBy}</td>}
                        </tr>
                    ))
                    }
                </table>
                }
            </>}
        </div>
    )
}

export default SearchFriendsPresentsComponent