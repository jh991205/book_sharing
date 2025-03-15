import { useParams } from "react-router-dom";

const Details = () => {
  const { bookId } = useParams();

  return (
    <div>
      <h1>Book Details</h1>
      <p>book ID: {bookId}</p>
    </div>
  );
};

export default Details;
