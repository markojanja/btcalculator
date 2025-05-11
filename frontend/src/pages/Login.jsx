const Login = () => {
  return (
    <div
      className=""
      style={{ flex: "1", flexDirection: "column", width: "70%", margin: "0 auto" }}
    >
      <form action="" className="login" style={{ alignItems: "center", justifyContent: "center" }}>
        <div className="logo">
          <h3>
            <span className="is-active">BT</span>Calculator
          </h3>
        </div>
        <div className="input-group flex-col">
          <label>username</label>
          <input type="text" name="" id="" placeholder="username" />
        </div>

        <div className="input-group flex-col">
          <label htmlFor="">password</label>
          <input type="password" name="" id="" placeholder="password" />
        </div>
        <button>Login</button>
      </form>
    </div>
  );
};

export default Login;
