function PageHeader({ title, subtitle, children }) {
  return (
    <div className="page-header">
      <div>
        <h2 className="page-title">{title}</h2>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>

      {children}
    </div>
  );
}

export default PageHeader;
