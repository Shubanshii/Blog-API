const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

//we're going to add some blog posts to it
//so there's some data to look at

BlogPosts.create(
	"Whaaaaa?",
	"She punched me the other day.  I was like whaaaaa???",
	"Wanayna McCoy",
	"10/24/2017"
	);

BlogPosts.create(
	"Duuuuuuuuuuude",
	"He punched me the other day.  I was like duuuuuuude for realz???",
	"Duder CuckDudenhoffer",
	"10/23/2017"
	);

BlogPosts.create(
	"Maaaaaaan?",
	"That dude went streakign the other day.  I was like maaaaan dat shit is whack yo???",
	"ManKind Foley",
	"10/24/2017"
	);

// when the root of this router is called with GET, return
// all current BlogPost items
router.get('/', (req, res) => {
	res.json(BlogPosts.get());
});

//when a new blog post is posted, make sure it's
// got required fields (title, content, and author name). if not,
// log an error and return a 400 status code. if okay,
// add new blog post to BlogPost and return it with a 201.

router.post('/', jsonParser, (req, res) => {
	//ensure 'title', 'content', and 'author' are in request body
	const requiredFields = ['title', 'content', 'author'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
	res.status(201).json(item);
});

//When DELETE request comes in with an id in path,
/// try to delete that item from BlogPost
router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted blog post \`${req.params.ID}\``);
	res.status(204).end();
});

// when PUT request comes in with updated item, ensure has required fields
// also ensure that item id in url path, and item id inupdated
// item object match. if problems with any of that, log error
// and send back status code 400. other wise
// call `BlogPost.update` with updated item.
router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	if (req.params.id !== req.body.id) {
		const message = (
			`Request path id (${req.params.id}) and request body id `
			`(${req.body.id}) must match`);
		console.error(message);
		return res.status(400).send(message);
	}
	console.log(`Updating blog post \`${req.params.id}\``);
	const updatedItem = BlogPosts.update({
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate
	});
	res.status(204).end();
});

module.exports = router;