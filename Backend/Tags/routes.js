import * as dao from "./dao.js";

export default function TagRoutes(app) {
  // Create or toggle a tag (like/dislike)
  app.post("/api/tags", async (req, res) => {
    const { review, user, type } = req.body;

    try {
      const existingTag = await dao.findUserTagOnReview(user, review);

      if (!existingTag) {
        const newTag = await dao.createTag({ review, user, type });
        return res.json(newTag);
      }

      if (existingTag.type === type) {
        // Toggle off
        await dao.deleteTag(existingTag._id);
        return res.json({ message: "Tag removed" });
      }

      // Change from like → dislike or vice versa
      const updated = await dao.updateTag(existingTag._id, { type });
      return res.json({ message: "Tag updated", status: updated });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to process tag" });
    }
  });

  // Get all tags
  app.get("/api/tags", async (req, res) => {
    const tags = await dao.findAllTags();
    res.json(tags);
  });

  // Get tags by user
  app.get("/api/tags/user/:userId", async (req, res) => {
    const tags = await dao.findTagsByUser(req.params.userId);
    res.json(tags);
  });

  // Get tags by review
  app.get("/api/tags/review/:reviewId", async (req, res) => {
    const tags = await dao.findTagsForReview(req.params.reviewId);
    res.json(tags);
  });

  // Optional: delete a specific tag
  app.delete("/api/tags/:tagId", async (req, res) => {
    const result = await dao.deleteTag(req.params.tagId);
    res.json(result);
  });
}
