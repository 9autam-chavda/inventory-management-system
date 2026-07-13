import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaWarehouse } from "react-icons/fa";
import authService from "../services/authService";
import { getErrorMessage } from "../utils/errorMessage";

function Login() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await authService.login(credentials);

      localStorage.setItem("token", response.token);

      navigate("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err, "Invalid email or password."));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card-body">
          <div className="text-center mb-4">
            <div className="login-brand">
              <FaWarehouse />
            </div>

            <h2 className="login-title mb-2">Inventory Management</h2>
            <p className="login-subtitle mb-0">
              Sign in to continue to your dashboard.
            </p>
          </div>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">Email</label>

              <div className="input-icon-wrap">
                <FaEnvelope className="input-icon" />

                <input
                  type="email"
                  className="form-control input-with-icon"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>

              <div className="input-icon-wrap">
                <FaLock className="input-icon" />

                <input
                  type="password"
                  className="form-control input-with-icon"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              className="btn btn-primary w-100 py-2"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <p className="auth-switch-text mt-4 mb-0 text-center">
            Don&apos;t have an account?{" "}
            <Link className="auth-switch-link" to="/register">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
