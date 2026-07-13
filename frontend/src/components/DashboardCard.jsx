function DashboardCard({ title, value, icon, color }) {
  return (
    <div className="col-xl-3 col-lg-4 col-md-6">
      <div
        className="dashboard-card"
        style={{ "--card-color": color }}
      >
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="card-title-muted">{title}</h6>

              <h2 className="card-number">{value}</h2>
            </div>

            <div className="card-icon-circle">
              {icon}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;
