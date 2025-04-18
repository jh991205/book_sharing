import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

type PostProps = {
  bookId: string;
  title: string;
  summary: string;
  coverUrl?: string;
};

export default function Post({ title, summary, coverUrl }: PostProps) {
  return (
    <Card
      elevation={2}
      sx={{
        mb: 2,
        borderRadius: 2,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea
        component={Link}
        to={`/search/${encodeURIComponent(title)}`}
      >
        {coverUrl && (
          <CardMedia
            component="img"
            height="140"
            image={coverUrl}
            alt={title}
          />
        )}
        <CardContent>
          <Typography variant="h6" gutterBottom noWrap title={title}>
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            title={summary}
          >
            {summary}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
