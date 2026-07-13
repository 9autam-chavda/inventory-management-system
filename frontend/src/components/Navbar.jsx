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
      <h4 className="navbar-title">Inventory Management System</h4>

      <div className="navbar-actions">
        <div className="user-avatar">
          <FaUserCircle size={22} />
        </div>

        <span className="navbar-user">Admin</span>

        <button
          className="btn btn-outline-danger btn-app d-inline-flex align-items-center gap-2"
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
