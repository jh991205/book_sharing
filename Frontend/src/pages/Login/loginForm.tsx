export default function LoginForm() {
  const handleLogin = () => {
    console.log("Login clicked");
  };

  return (
    <div>
      <h3 className="text-center mb-4">Login</h3>
      <form>
        <div className="mb-3">
          <label htmlFor="login-email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="login-email"
            placeholder="name@example.com"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="login-password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="login-password"
            placeholder="Password"
          />
        </div>
        <button
          type="button"
          className="btn btn-primary w-100"
          onClick={handleLogin}
        >
          Login
        </button>
      </form>
    </div>
  );
}
