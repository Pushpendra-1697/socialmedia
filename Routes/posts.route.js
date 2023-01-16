const { Router } = require('express');

const postRouter = Router();

const { PostModel } = require("../Models/post.model");


postRouter.get('/', async (req, res) => {
    let query = req.query;
    try {
        const posts = await PostModel.find(query);
        res.send(posts);
    } catch (err) {
        console.log(err);
        res.send({ "msg": "something went wrong" });
    }

});
postRouter.post('/create', async (req, res) => {
    const data = req.body;
    try {
        const post = new PostModel(data);
        await post.save();
        res.send({ "msg": "post created successfully" })
    } catch (err) {
        console.log(err);
        res.send({ "msg": "something went wrong" });
    }

})
postRouter.patch('/update:id', async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const post = await PostModel.findOne({ _id: id });
    const userID_in_post = post.userID;
    const userID_making_req = req.body.userID
    try {
        if (userID_in_post !== userID_making_req) {
            res.send({ "msg": "you are not athonticated to update" });
        } else {
            await PostModel.findByIdAndUpdate({ _id: id, payload });
            res.send({ "msg": `updated successfully whose id is ${id}` });
        }
    } catch (err) {
        res.send({ "msg": "you are not athonticated to update" });
    }
})
postRouter.delete('/delete:id', async (req, res) => {
    const { id } = req.params;
    const post = await PostModel.findOne({ _id: id });
    const userID_in_post = post.userID;
    const userID_making_req = req.body.userID

    try {
        if (userID_in_post !== userID_making_req) {
            res.send({ "msg": "you are not athonticated to delete" });
        } else {
            await PostModel.findByIdAndDelete({ _id: id });
            res.send({ "msg": `Deleted successfully whose id is ${id}` });
        }
    } catch (err) {
        res.send({ "msg": "you are not athonticated to delete" });
    }
});

module.exports = { postRouter }