import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react"
import { Layout, Menu, Typography, notification } from "antd";
import CreateUserComponent from './Components/CreateUserComponent'
import CreatePresentComponent from './Components/CreatePresentComponent'
import ListPresentsComponent from './Components/ListPresentsComponent'
import ModifyPresentComponent from './Components/ModifyPresentComponent'
import ListFriendsComponent from './Components/ListFriendsComponent'
import SearchFriendsPresentsComponent from './Components/SearchFriendsPresentsComponent'
import LoginComponent from './Components/LoginComponent'
import { backendURL } from "./Globals"

let App = () => {

  let [api, contextHolder] = notification.useNotification()
  let [login, setLogin] = useState(false)
  let navigate = useNavigate()
  let location = useLocation()

  useEffect(() => {
    checkLogin()
  })

  let createNotification = (msg, type = "info", placement = "top") => {
    api[type]({
      message: msg,
      description: msg,
      placement
    })
  }

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
      if (!["/login", "/register", "/home"].includes(location.pathname)) {
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
  let { Title } = Typography

  return (
    <>
      {contextHolder}
      <Layout style={{ minHeight: "100vh" }}>
        <Header>
          {!login &&

            <Menu theme="dark" mode="horizontal" items={[
              { key: "menuHome", label: <Link to="/home">Home</Link> },
              { key: "menuRegister", label: <Link to="/register">Register</Link> },
              { key: "menuLogin", label: <Link to="/login">Login</Link> }
            ]} />
          }
          {login &&
            <Menu theme="dark" mode="horizontal" items={[
              { key: "menuHome", label: <Link to="/home">Home</Link> },
              { key: "menuCreatePresent", label: <Link to="/createPresent">Create present</Link> },
              { key: "menuListPresents", label: <Link to="/myPresents">My presents</Link> },
              { key: "menuListFriends", label: <Link to="/myFriends">My friends</Link> },
              { key: "menuSearchFriendsPresents", label: <Link to="/searchFriendsPresents">Search friend's presents</Link> },
              { key: "menuDisconnect", label: <Link to="/disconnect" onClick={disconnect}>Disconnect</Link> }
            ]} />
          }
        </Header>

        <Content style={{ padding: "20px 50px" }}>
          <Routes>
            <Route path="/home" element={
              <Title style={{ textAlign: "center", padding: "100px" }}>Welcome to Present4U!</Title>
            } />
            <Route path="/register" element={
              <CreateUserComponent createNotification={createNotification} />
            } />
            <Route path="/login" element={
              <LoginComponent setLogin={setLogin} />
            } />
            <Route path="/createPresent" element={
              <CreatePresentComponent createNotification={createNotification} />
            } />
            <Route path="/myPresents" element={
              <ListPresentsComponent createNotification={createNotification} />
            } />
            <Route path="/modifyPresent/:presentId" element={
              <ModifyPresentComponent createNotification={createNotification} />
            } />
            <Route path="/myFriends" element={
              <ListFriendsComponent createNotification={createNotification} />
            } />
            <Route path="/searchFriendsPresents" element={
              <SearchFriendsPresentsComponent createNotification={createNotification} />
            } />
          </Routes>
        </Content>
        <Footer style={{ textAlign: "center" }}>Present4U @ 2024<br />Made with ❤️ by Álex Álvarez Varela</Footer>
      </Layout>
    </>
  )
}

export default App