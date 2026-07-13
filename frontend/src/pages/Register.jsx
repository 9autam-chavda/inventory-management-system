import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUser,
  FaWarehouse,
} from "react-icons/fa";
import authService from "../services/authService";
import { getErrorMessage } from "../utils/errorMessage";

const initialFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      errors.name = "Full name is required.";
    } else if (formData.name.trim().length < 3) {
      errors.name = "Full name must be at least 3 characters.";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailPattern.test(formData.email.trim())) {
      errors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm password is required.";
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear the field error as soon as the user edits that field again.
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const getInputClassName = (fieldName) => (
    `form-control input-with-icon password-input ${
      formErrors[fieldName] ? "is-invalid" : ""
    }`
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);
    setServerError("");

    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      toast.success("Registration Successful");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setServerError(getErrorMessage(err, "Registration failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page register-page">
      <div className="login-card register-card">
        <div className="login-card-body">
          <div className="text-center mb-4">
            <div className="login-brand">
              <FaWarehouse />
            </div>

            <h2 className="login-title mb-2">Create Account</h2>
            <p className="login-subtitle mb-0">
              Start managing inventory with a secure admin profile.
            </p>
          </div>

          {serverError && (
            <div className="alert alert-danger" role="alert">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label" htmlFor="name">
                Full Name
              </label>

              <div className="input-icon-wrap">
                <FaUser className="input-icon" />

                <input
                  id="name"
                  type="text"
                  className={getInputClassName("name")}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>

              {formErrors.name && (
                <div className="invalid-feedback d-block">
                  {formErrors.name}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="email">
                Email
              </label>

              <div className="input-icon-wrap">
                <FaEnvelope className="input-icon" />

                <input
                  id="email"
                  type="email"
                  className={getInputClassName("email")}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              {formErrors.email && (
                <div className="invalid-feedback d-block">
                  {formErrors.email}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="password">
                Password
              </label>

              <div className="input-icon-wrap">
                <FaLock className="input-icon" />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={getInputClassName("password")}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((prevValue) => !prevValue)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {formErrors.password && (
                <div className="invalid-feedback d-block">
                  {formErrors.password}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label" htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="input-icon-wrap">
                <FaLock className="input-icon" />

                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className={getInputClassName("confirmPassword")}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  onClick={() =>
                    setShowConfirmPassword((prevValue) => !prevValue)
                  }
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {formErrors.confirmPassword && (
                <div className="invalid-feedback d-block">
                  {formErrors.confirmPassword}
                </div>
              )}
            </div>

            <button className="btn btn-primary w-100 py-2" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="auth-switch-text mt-4 mb-0 text-center">
            Already have an account?{" "}
            <Link className="auth-switch-link" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
