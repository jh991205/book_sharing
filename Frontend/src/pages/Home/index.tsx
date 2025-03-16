import { Link } from "react-router-dom";
import Post from "../../components/posts";

export default function Home() {
  const dummyPosts = [
    {
      title: "Top 5 Fantasy Books",
      summary: "Discover epic adventures and magic worlds...",
    },
    {
      title: "Must-Read Sci-Fi Novels",
      summary: "Explore the future with these thrilling reads...",
    },
    {
      title: "Romance Classics",
      summary: "Timeless love stories that never get old...",
    },
  ];

  const isLoggedIn = false;

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Books Website
          </Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mt-5">
        {isLoggedIn ? (
          <p>(You can render logged-in user’s personalized posts here later)</p>
        ) : (
          <>
            <h2>Popular Posts</h2>
            {dummyPosts.map((post, index) => (
              <Post key={index} title={post.title} summary={post.summary} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
