const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    const posts = postData.map((post) => {
        const plainPost = post.get({ plain: true });
        return { ...plainPost };
      });

    res.render("home-page", {
      posts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/post', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ["name"],
                },
            ],
        });

        const posts = postData.map((post) => {
            const plainPost = post.get({ plain: true });
            return { ...plainPost };
        });

        res.render('posts', {
            posts,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/posts/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ["name"],
                },
                {
                    model: Comment,
                    attributes: ["description"],
                },
            ],
        });
        const post = postData.get({ plain: true });

    const commentsData = await Comment.findAll({
      where: {
        post_id: req.params.id,
      },
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    const comments = commentsData.map((comment) =>
      comment.get({ plain: true })
    );

    res.render("post", {
      ...post,
      comments,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/profile", withAuth, async (req, res) => {
    try {
      const userData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ["password"] },
        include: [{ model: Post }],
      });
  
      const user = userData.get({ plain: true });
  
      res.render("profile", {
        ...user,
        logged_in: true,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  router.get("/login", (req, res) => {
    if (req.session.logged_in) {
      res.redirect("/profile");
      return;
    }
  
    res.render("login");
  });

module.exports = router;
