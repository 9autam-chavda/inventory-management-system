function DashboardCard({ title, value, icon, color }) {
  return (
    <div className="col-xl-3 col-lg-4 col-md-6">
      <div
        className="card border-0 shadow-sm h-100"
        style={{
          borderLeft: `5px solid ${color}`,
          borderRadius: "12px",
        }}
      >
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">

            <div>
              <h6 className="text-muted mb-2">
                {title}
              </h6>

              <h2 className="fw-bold mb-0">
                {value}
              </h2>
             </div>

            <div
              className="rounded-circle d-flex justify-content-center align-items-center"
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: `${color}15`,
                color: color,
                fontSize: "28px",
              }}
            >
              {icon}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;