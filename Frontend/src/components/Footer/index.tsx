import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-light border-top mt-4 py-3">
      <div className="container text-center">
        <Link className="text-decoration-none me-3" to="/privacy">
          Privacy Policy
        </Link>
        <Link className="text-decoration-none" to="/contact">
          Contact
        </Link>
      </div>
    </footer>
  );
}
