const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto flex flex-col items-center justify-between gap-1 px-6 py-4 text-xs text-muted-foreground sm:flex-row">
      <p>© {year} CSBoard. All rights reserved.</p>
      <p>
        Built by{" "}
        <a
          href="https://github.com/markojanja/btcalculator"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Marko Janjic
        </a>
      </p>
    </footer>
  );
};

export default Footer;
