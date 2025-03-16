import Navigation from "../../components/Navigation";
import Post from "../../components/Post";

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
      <Navigation />
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
