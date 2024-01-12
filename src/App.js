import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import { useEffect, useState } from "react"
import { Layout, Menu } from "antd";
import CreateUserComponent from './Components/CreateUserComponent'
import CreatePresentComponent from './Components/CreatePresentComponent'
import ListPresentsComponent from './Components/ListPresentsComponent'
import ModifyPresentComponent from './Components/ModifyPresentComponent'
import ListFriendsComponent from './Components/ListFriendsComponent'
import SearchFriendsPresentsComponent from './Components/SearchFriendsPresentsComponent'
import LoginComponent from './Components/LoginComponent'
import { backendURL } from "./Globals"

let App = () => {

  let [login, setLogin] = useState(false)
  let navigate = useNavigate()
  let location = useLocation()

  useEffect(() => {
    checkLogin()
  }, [])

  let checkLogin = async () => {
    if (localStorage.getItem("apiKey")) {
      let response = await fetch(backendURL + "/users/checkLogin?apiKey=" + localStorage.getItem("apiKey"))
      if (response.status === 401) {
        setLogin(false)
        navigate("/login")
        return
      } else {
        setLogin(true)
      }
    } else {
      setLogin(false)
      if (!["/login", "/register"].includes(location.pathname)) {
        navigate("/login")
      }
    }
  }

  let disconnect = async () => {
    let response = await fetch(backendURL + "/users/disconnect?apiKey=" + localStorage.getItem("apiKey"))
    if (response.ok) {
      localStorage.removeItem("apiKey")
      localStorage.removeItem("idUser")
      localStorage.removeItem("email")
      setLogin(false)
      navigate("/login")
    }
  }

  let { Header, Content, Footer } = Layout

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header>
        {!login &&

          <Menu theme="dark" mode="horizontal" items={[
            { key: "menuHome", label: <Link to="/">Home</Link> },
            { key: "menuRegister", label: <Link to="/createUser">Register</Link> },
            { key: "menuLogin", label: <Link to="/login">Login</Link> }
          ]} />
        }
        {login &&

          <Menu theme="dark" mode="horizontal" items={[
            { key: "menuHome", label: <Link to="/">Home</Link> },
            { key: "menuCreatePresent", label: <Link to="/createPresent">Create present</Link> },
            { key: "menuListPresents", label: <Link to="/listPresents">My presents</Link> },
            { key: "menuListFriends", label: <Link to="/listFriends">My friends</Link> },
            { key: "menuSearchFriendsPresents", label: <Link to="/searchFriendsPresents">Search friend's presents</Link> },
            { key: "menuDisconnect", label: <Link to="/disconnect" onClick={disconnect}>Disconnect</Link> }
          ]} />
        }
      </Header>

      <Content style={{ padding: "20px 50px" }}>
        <Routes>
          <Route path="/" element={
            <h1>Welcome to Present4U!</h1>
          } />
          <Route path="/createUser" element={
            <CreateUserComponent />
          } />
          <Route path="/login" element={
            <LoginComponent setLogin={setLogin} />
          } />
          <Route path="/createPresent" element={
            <CreatePresentComponent />
          } />
          <Route path="/listPresents" element={
            <ListPresentsComponent />
          } />
          <Route path="/modifyPresent/:presentId" element={
            <ModifyPresentComponent />
          } />
          <Route path="/listFriends" element={
            <ListFriendsComponent />
          } />
          <Route path="/searchFriendsPresents" element={
            <SearchFriendsPresentsComponent />
          } />
        </Routes>
      </Content>
      <Footer style={{ textAlign: "center" }}>Present4U</Footer>
    </Layout>
  )
}

export default App