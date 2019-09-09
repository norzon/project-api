const express = require('express');
const router = express.Router();

router.get('/ingredients', require('../helpers/routeWrapper')(async (req) => {
	const db = req.app.get('db');

	let ingredients = await db.query(
		`SELECT id, alias, common_name
		FROM INGREDIENT`
	);

	for (let i = 0; i < ingredients.length; i++) {
		let decisions = await db.query(
			`SELECT
				DECISION.ID,
				DECISION.DESCRIPTION,
				DECISION.STATUS,
				DECISION.ARTICLE_ID,
				ARTICLE.ART_NUMBER,
				ARTICLE.ART_SUB_NUMBER,
				DECISION.REGULATION_ID,
				REGULATION.REG_DATE,
				REGULATION.REG_NUMBER
			FROM DECISION
			INNER JOIN ARTICLE ON ARTICLE.ID = DECISION.ARTICLE_ID
			INNER JOIN REGULATION ON REGULATION.ID = DECISION.REGULATION_ID
			WHERE DECISION.INGREDIENT_ID = '${ingredients[i].ID}'`
		);

		for (let j = 0; j < decisions.length; j++) {
			decisions[j].CLAIMS = await db.query(
				`SELECT DESCRIPTION
				FROM CLAIM
				WHERE DECISION_ID = '${decisions[j].ID}'`
			);
			decisions[j].HEALTH = await db.query(
				`SELECT DESCRIPTION
				FROM HEALTH
				WHERE DECISION_ID = '${decisions[j].ID}'`
			);
			decisions[j].PAPER = await db.query(
				`SELECT ID, DECISION_ID, TITLE, YEAR, LINK
				FROM PAPER
				WHERE DECISION_ID = '${decisions[j].ID}'`
			);
		}

		ingredients[i].DECISIONS = decisions || [];
	}

	await db.close();

	return ingredients;
}));

module.exports = router;
