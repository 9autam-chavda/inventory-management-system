import { useEffect, useState } from "react";
import {
  FaBox,
  FaTags,
  FaShoppingCart,
  FaCashRegister,
  FaFileInvoice,
  FaWarehouse,
  FaExclamationTriangle,
} from "react-icons/fa";

import { getDashboard } from "../services/dashboardService";
import DashboardCard from "../components/DashboardCard";

function Dashboard() {

  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboard();
        setDashboard(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadDashboard();
  }, []);

  if (!dashboard) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "300px" }}
      >
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div>

      <div className="dashboard-heading">
        <h2 className="page-title">Dashboard</h2>
        <p className="page-subtitle">
          Welcome to your Inventory Management System.
        </p>
      </div>

      <div className="row g-4">

        <DashboardCard
          title="Products"
          value={dashboard.totalProducts}
          icon={<FaBox />}
          color="#2563eb"
        />

        <DashboardCard
          title="Categories"
          value={dashboard.totalCategories}
          icon={<FaTags />}
          color="#16a34a"
        />

        <DashboardCard
          title="Purchases"
          value={dashboard.totalPurchases}
          icon={<FaShoppingCart />}
          color="#f59e0b"
        />

        <DashboardCard
          title="Sales"
          value={dashboard.totalSales}
          icon={<FaCashRegister />}
          color="#dc2626"
        />

        <DashboardCard
          title="Invoices"
          value={dashboard.totalInvoices}
          icon={<FaFileInvoice />}
          color="#7c3aed"
        />

        <DashboardCard
          title="Total Stock"
          value={dashboard.totalStock}
          icon={<FaWarehouse />}
          color="#0891b2"
        />

        <DashboardCard
          title="Low Stock"
          value={dashboard.lowStockProducts}
          icon={<FaExclamationTriangle />}
          color="#f59e0b"
        />

      </div>

    </div>
  );
}

export default Dashboard;
