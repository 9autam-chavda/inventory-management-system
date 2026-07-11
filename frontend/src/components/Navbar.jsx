import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

function Navbar() {

  const navigate = useNavigate();

  const logout = () => {
    authService.logout();
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar top-navbar px-4 py-3">

      <div>

        <h4 className="navbar-title">
          Inventory Management System
        </h4>

      </div>

      <div className="d-flex align-items-center gap-3">

        <div className="text-end welcome-text">
          <div className="fw-bold">Welcome back</div>
          <small className="text-muted">Admin</small>
        </div>

        <div className="user-avatar">
          <FaUserCircle size={22} />
        </div>

        <button
          className="btn btn-outline-danger d-inline-flex align-items-center gap-2"
          onClick={logout}
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;
