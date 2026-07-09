import {
  FaTachometerAlt,
  FaBox,
  FaTags,
  FaShoppingCart,
  FaCashRegister,
  FaFileInvoice,
  FaWarehouse,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

function Sidebar() {
  const menus = [
    {
      path: "/dashboard",
      title: "Dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      path: "/categories",
      title: "Categories",
      icon: <FaTags />,
    },
    {
      path: "/products",
      title: "Products",
      icon: <FaBox />,
    },
    {
      path: "/purchases",
      title: "Purchases",
      icon: <FaShoppingCart />,
    },
    {
      path: "/sales",
      title: "Sales",
      icon: <FaCashRegister />,
    },
    {
      path: "/invoices",
      title: "Invoices",
      icon: <FaFileInvoice />,
    },
  ];

  return (
    <aside className="admin-sidebar d-flex flex-column">
      {/* Logo */}

      <div className="sidebar-brand">

        <div className="sidebar-brand-icon">
          <FaWarehouse size={24} />
        </div>

        <div className="sidebar-brand-copy">
          <h4 className="sidebar-title">
            IMS
          </h4>

          <span className="sidebar-subtitle">
            Inventory Management
          </span>
        </div>

      </div>

      {/* Menu */}

      <nav className="sidebar-nav nav flex-column">

        {menus.map((menu) => (

          <NavLink
            key={menu.path}
            to={menu.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >

            <span className="sidebar-icon">
              {menu.icon}
            </span>

            <span className="sidebar-label">
              {menu.title}
            </span>

          </NavLink>

        ))}

      </nav>
    </aside>
  );
}

export default Sidebar;
