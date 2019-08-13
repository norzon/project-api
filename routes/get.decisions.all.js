module.exports = function (app, db) {
	app.get('/decisions', async (req, res) => {
		let decisions = await db.query(
			`SELECT
				decision.id,
				decision.description,
				decision.status,
				decision.article_id,
				article.art_number,
				article.art_sub_number,
				decision.regulation_id,
				regulation.reg_date,
				regulation.reg_number,
				decision.ingredient_id,
				ingredient.alias,
				ingredient.common_name
			FROM
				decision
			INNER JOIN
				article ON article.id = decision.article_id
			INNER JOIN
				regulation ON regulation.id = decision.regulation_id
			INNER JOIN
				ingredient ON ingredient.id = decision.ingredient_id`
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

		return res.json({
			success: true,
			results: decisions
		})
	});
}