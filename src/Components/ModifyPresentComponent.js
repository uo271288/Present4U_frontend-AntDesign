import { useEffect, useState } from "react"
import { backendURL } from "../Globals"
import { useParams } from "react-router-dom"

let ModifyPresentComponent = () => {

    let [present, setPresent] = useState({})
    let [message, setMessage] = useState([])
    let { presentId } = useParams()

    useEffect(() => {
        getPresent()
    }, [])

    let getPresent = async () => {
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

    let changeProperty = (name, value) => {
        let newPresentValues = { ...present, [name]: value }
        setPresent(newPresentValues)
    }

    let clickEdit = async () => {
        let response = await fetch(backendURL + "/presents/" + presentId + "?apiKey=" + localStorage.getItem("apiKey"), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...present })
        })
        if (response.ok) {

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
    }

    return (
        <div className="main-container">
            <h2>Edit a present</h2>
            {message.length > 0 && message.map(e => { return <p className="errorMessage">{e}</p> })}
            {message.length <= 0 &&
                <div className="center-box">
                    <div className='form-group'>
                        <input type='text' placeholder='Name' onChange={(e) => changeProperty("name", e.currentTarget.value)} value={present.name} />
                    </div>
                    <div className='form-group'>
                        <input type='text' placeholder='Description' onChange={(e) => changeProperty("description", e.currentTarget.value)} value={present.description} />
                    </div>
                    <div className='form-group'>
                        <input type='text' placeholder='https://example.com' onChange={(e) => changeProperty("url", e.currentTarget.value)} value={present.url} />
                    </div>
                    <div className='form-group'>
                        <input type='number' step=".01" placeholder='10.0' onChange={(e) => changeProperty("price", e.currentTarget.value)} value={present.price} />
                    </div>
                    <button onClick={clickEdit}>Edit present</button>
                </div>
            }
        </div>
    )
}

export default ModifyPresentComponent