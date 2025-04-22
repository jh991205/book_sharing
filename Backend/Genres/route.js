import * as dao from "./dao.js";

export default function GenreRoutes(app) {
  const findAllGenres = async (req, res) => {
    const Genres = await dao.findAllGenres();
    res.json(Genres.map((genre) => genre.name));
  };

  app.get("/api/genres", findAllGenres);
}
