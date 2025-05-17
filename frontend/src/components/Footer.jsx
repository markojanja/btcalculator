import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>
        &copy; {year}{" "}
        <a href="https://github.com/markojanja/btcalculator" target="_blank">
          Marko Janjic
        </a>{" "}
        All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
