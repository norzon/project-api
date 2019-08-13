module.exports = function (app, db) {
	app.get('/ingredients', async (req, res) => {
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
				WHERE DECISION.INGREDIENT_ID = '${ingredients[i][0]}'`
			);

			for (let j = 0; j < decisions.length; j++) {
				const claims = await db.query(
					`SELECT DESCRIPTION
					FROM CLAIM
					WHERE DECISION_ID = '${decisions[j][0]}'`
				);
				const health = await db.query(
					`SELECT DESCRIPTION
					FROM HEALTH
					WHERE DECISION_ID = '${decisions[j][0]}'`
				);
				const paper = await db.query(
					`SELECT ID, DECISION_ID, TITLE, YEAR, LINK
					FROM PAPER
					WHERE DECISION_ID = '${decisions[j][0]}'`
				);

				decisions[j] = {
					id: decisions[j][0],
					description: decisions[j][1],
					status: decisions[j][2],
					article_id: decisions[j][3],
					art_number: decisions[j][4],
					art_sub_number: decisions[j][5],
					regulation_id: decisions[j][6],
					reg_date: decisions[j][7],
					reg_number: decisions[j][8],
					claims: claims.map(c => c[0]),
					health: health.map(h => h[0]),
					paper: paper.map(paper => {
						return {
							id: paper[0],
							decision_id: paper[1],
							title: paper[2],
							year: paper[3],
							link: paper[4]
						}
					})
				};
			}

			ingredients[i] = {
				id: ingredients[i][0],
				alias: ingredients[i][1],
				common_name: ingredients[i][2],
				decisions: decisions || []
			};
		}

		await db.close();

		return res.json({
			success: true,
			results: ingredients
		});
	});
}