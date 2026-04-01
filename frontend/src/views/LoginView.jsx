import { useState, useEffect } from "react";
import { Text, Button, Flex, Title, Loader } from "@mantine/core";
import { getUsers, createUser, requestLogin } from "../api/userService";

export function LoginView({ onLogin, currentUser, setCurrentUser, isAdmin, setIsAdmin }) {
  const [view, setView] = useState("login");
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [existing, setExisting] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((err) => setError(err.message));
  }, []);

  const onCreate = () => {
    for (let u of users) {
      if (u.username === username) {
        setExisting(true);
      }
    }

    if (password === passwordCheck && !existing && username) {
      createUser({ username, password });
      setUsername("");
      setPassword("");
      setPasswordCheck("");
      setView("login");
    }
  };

  const Login = async () => {
    setIsLoggingIn(true);
    try {
      const res = await requestLogin({ username, password });
      console.log(res); // sollte "Login erfolgreich" sein
      if (res.status === "ok") {
        // determine admin status synchronously
        const adminFlag = users.find((u) => u.username === username)?.admin || false;
        setIsAdmin(adminFlag);
        setCurrentUser(username);
        localStorage.setItem("user", username);
        localStorage.setItem("isAdmin", adminFlag);
        localStorage.setItem("userId", res.userId);
        localStorage.setItem("isAdmin", res.isAdmin);
        setUsername("");
        setPassword("");
        onLogin();
      } else {
        alert("Falscher Benutzername oder Passwort");
      }
    } catch (err) {
      setIsLoggingIn(false);
      console.error(err.message);
      alert("Falscher Benutzername oder Passwort");
    }
  };

  const checkIsAdmin = (user) => {
    for (let u of users) {
      if (u?.username === user) {
        if (u?.admin) {
          setIsAdmin(true);
        }
      }
    }
  }

  const handleKeyDown = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };
  if (isLoggingIn) {
      return (
        <>
          <Loader color = "#c9a473" size={50} />
          <div
            style={{ color: "#c9a473", textAlign: "center", marginTop: "50px" }}
          >
            Logge ein...
          </div>
        </>
      );
    }

  return (
    <div className="login-wrapper">
      <div className="login-box">
        {view == "login" ? (
          <>
            <h2 style={{ marginBottom: "30px", color: "#c9a473" }}>Anmelden</h2>
            <div className="input-group">
              <input
                type="text"
                placeholder="Benutzername"
                className="riot-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, Login)}
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Passwort"
                className="riot-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, Login)}
              />
            </div>
            <button
              className="pirate-btn"
              onClick={() => Login()}
              style={{ width: "100%", marginTop: "20px" }}
            >
              Login
            </button>
            <Flex direction="row" gap="3px" mt="1rem">
              <Text> Noch kein Account? </Text>
              <Text
                onClick={() => setView("create")}
                variant="transparent"
                td="underline"
                style={{ cursor: "pointer" }}
              >
                Account erstellen
              </Text>
            </Flex>
          </>
        ) : (
          <>
            <Title order={2} style={{ marginBottom: "30px", color: "#c9a473" }}>
              Account erstellen
            </Title>
            <div className="input-group">
              <input
                type="text"
                placeholder="Benutzername"
                className="riot-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, onCreate)}
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Passwort"
                className="riot-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, onCreate)}
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Passwort wiederholen"
                className="riot-input"
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, onCreate)}
              />
            </div>
            <button
              className="pirate-btn"
              onClick={() => onCreate()}
              style={{ width: "100%", marginTop: "20px" }}
            >
              Erstellen
            </button>
            <Flex direction="row" gap="3px" mt="1rem">
              <Text> Account vorhanden? </Text>
              <Text
                onClick={() => setView("login")}
                variant="transparent"
                td="underline"
                style={{ cursor: "pointer" }}
              >
                Login
              </Text>
            </Flex>
          </>
        )}
      </div>
    </div>
  );
}
