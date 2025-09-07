import "./DashCard.css";

const DashCard = ({ title, value, linkText, linkHref, Icon, bg, clr }) => {
  return (
    <div className="dash-card">
      <div className="d-info">
        <p>{title}</p>
        <h3>{value}</h3>
        <a href={linkHref}>{linkText}</a>
      </div>
      <div className="d-icon ">
        <div className={bg}>
          <Icon size={32} className={clr} />
        </div>
      </div>
    </div>
  );
};

export default DashCard;
