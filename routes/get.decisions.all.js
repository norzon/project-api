const express = require('express');
const router = express.Router();
const Query = require('../helpers/query');

router.get('/decisions', require('../helpers/routeWrapper')(async (req) => {
	const db = req.app.get('db');

	let decisions = await db.query(
		Query()
		.select([
			'decision.id',
			'decision.description',
			'decision.status',
			'decision.article_id',
			'article.art_number',
			'article.art_sub_number',
			'decision.regulation_id',
			'regulation.reg_date',
			'regulation.reg_number',
			'decision.ingredient_id',
			'ingredient.alias',
			'ingredient.common_name',
		])
		.from('decision')
		.innerJoin('article', 'article.id = decision.article_id')
		.innerJoin('regulation', 'regulation.id = decision.regulation_id')
		.innerJoin('ingredient', 'ingredient.id = decision.ingredient_id')
	);

	for (let i = 0; i < decisions.length; i++) {
		decisions[i].claims = await db.query(
			`SELECT *
			FROM CLAIM
			WHERE DECISION_ID = '?'`,
			decisions[i].id
		);
		decisions[i].health = await db.query(
			`SELECT *
			FROM HEALTH
			WHERE DECISION_ID = '?'`,
			decisions[i].id
		);
		decisions[i].paper = await db.query(
			`SELECT *
			FROM PAPER
			WHERE DECISION_ID = '?'`,
			decisions[i].id
		);
	}

	return decisions;
}))

module.exports = router;