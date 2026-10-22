export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <strong>kashflow.</strong>
        <span>Hyper-Optimized Financial OS</span>
      </div>
      <small>
        © {new Date().getFullYear()} KASHFLOW LABS INC. ALL RIGHTS RESERVED.
      </small>
    </footer>
  );
}
