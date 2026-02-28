export function LoginView({ onLogin }) {
  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2 style={{ marginBottom: "30px", color: "#c9a473" }}>Anmelden</h2>
        
        <div className="input-group">
          <input type="text" placeholder="Benutzername" className="riot-input" />
        </div>
        <div className="input-group">
          <input type="password" placeholder="Passwort" className="riot-input" />
        </div>

        <button className="pirate-btn" onClick={onLogin} style={{ width: "100%", marginTop: "20px" }}>
          Login
        </button>
      </div>
    </div>
  );
}
