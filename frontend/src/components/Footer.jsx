const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="flex items-center justify-center w-full p-4">
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
