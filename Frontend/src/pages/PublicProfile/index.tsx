import { useParams } from "react-router-dom";

const PublicProfile = () => {
  const { profileId } = useParams();

  return (
    <div>
      <h1>Public Profile</h1>
      <p>user ID: {profileId}</p>
    </div>
  );
};

export default PublicProfile;
