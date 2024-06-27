const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const PostModel = mongoose.model("PostModel");
const protectedRoute = require("../middleware/protectedRoute");

//all user posts
router.get("/myallposts", protectedRoute, (req, res) => {
    const userId = req.user._id; // Assuming req.user contains the user object with _id field
    PostModel.find({ author: userId })
        .populate("author", "_id fullName profileImg")
        .then((dbPosts) => {
            res.status(200).json({ posts: dbPosts })
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ error: "An error occurred while fetching user's posts" });
        });
});


//all user posts
router.get("/allposts", (req, res) => {

    PostModel.find()
        .populate("author", "_id fullName profileImg")
        .then((dbPosts) => {
            res.status(200).json({ posts: dbPosts })
        })
        .catch((error) => {
            console.log(error)
        })

});


router.delete("/deletepost/:postId", protectedRoute, async (req, res) => {
    try {
        const postFound = await PostModel.findOne({ _id: req.params.postId })
            .populate("author", "_id")
            .exec();

        console.log("postFound:", postFound);

        if (!postFound) {
            return res.status(400).json({ error: "Post does not exist" });
        }
        if (postFound.author._id.toString() === req.user._id.toString()) {
            await PostModel.deleteOne({ _id: req.params.postId });
            res.status(200).json({ result: "Post deleted successfully" });
        } else {
            res.status(403).json({ error: "You are not authorized to delete this post" });
        }


    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: "An error occurred while deleting the post" });
    }
});





router.post("/createpost", protectedRoute, (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    const { description, location, image } = req.body;  // Use "Image" instead of "image"
    if (!description || !location || !image) {  // Use "Image" instead of "image"
        return res.status(400).json({ error: "Please provide description, location, and Image" });
    }

    const postobj = new PostModel({ description, location, image, author: req.user._id });
    postobj.save()
        .then((newPost) => {
            res.status(201).json({ post: newPost });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error: "An error occurred while creating the post" });
        });
});


router.post('/like/:postId', async (req, res) => {
    try {
      const postId = req.params.postId;
      // Perform operations to like the post with postId
      res.status(200).json({ message: 'Post liked successfully' });
    } catch (error) {
      console.error('Error liking post:', error);
      res.status(500).json({ error: 'An error occurred while liking the post' });
    }
  });

// Dislike a post
router.post("/dislike/:postId", protectedRoute, async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Check if the user has already liked the post
        const likedIndex = post.likes.findIndex(like => like.user.toString() === req.user._id.toString());
        if (likedIndex === -1) {
            return res.status(400).json({ error: "You have not liked this post" });
        }

        post.likes.splice(likedIndex, 1);
        await post.save();

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error disliking post:", error);
        res.status(500).json({ error: "An error occurred while disliking the post" });
    }
});

module.exports = router;








