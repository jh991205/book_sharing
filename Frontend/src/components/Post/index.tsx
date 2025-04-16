import { Card, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";

type PostProps = {
  bookId: string;
  title: string;
  summary: string;
};

export default function Post({ bookId, title, summary }: PostProps) {
  return (
    <Card
      variant="outlined"
      sx={{ mb: 2, textDecoration: "none" }}
      component={Link}
      to={`/details/${bookId}`}
    >
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2">{summary}</Typography>
      </CardContent>
    </Card>
  );
}
