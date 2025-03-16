export default function RegisterForm() {
  const handleRegister = () => {
    console.log("Register clicked");
  };

  return (
    <div>
      <h3 className="text-center mb-4">Register</h3>
      <form>
        <div className="mb-3">
          <label htmlFor="register-name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="register-name"
            placeholder="Your Name"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="register-email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="register-email"
            placeholder="name@example.com"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="register-password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="register-password"
            placeholder="Password"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="register-confirm" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="register-confirm"
            placeholder="Confirm Password"
          />
        </div>
        <button
          type="button"
          className="btn btn-success w-100"
          onClick={handleRegister}
        >
          Register
        </button>
      </form>
    </div>
  );
}
