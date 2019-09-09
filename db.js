const oracledb = require("oracledb");

class DB {
	constructor() {
		this.isOpen = false;
		this.connection = null;
	}

	async open() {
		if (this.isOpen) {
			return this.connection;
		}

		this.connection = await oracledb.getConnection({
			user: "COMPANY",
			password: "admin",
			connectString: "localhost:1521/XE"
		});

		this.isOpen = true;

		return this;
	}

	async close() {
		try {
			if (this.isOpen) {
				await this.connection.close();
				this.connection = null;
				this.isOpen = false;
			}
		} catch (error) {
			console.error('DB.close: ', error);
		} finally {
			return this;
		}
	}

	async tryStatement() {
		await this.open();

		let result = await this.connection.execute(
			`SELECT *
			FROM ingredient`
		);

		await this.close();

		return result.rows;
	}

	async query(statement, params) {
		let stmt;

		await this.open();

		if (typeof statement === 'object' && typeof statement.generate === 'function') {
			stmt = statement.generate();
		} else {
			stmt = statement;
		}

		const result = await this.connection.execute(
			stmt,
			params || [],
			{ outFormat: oracledb.OBJECT }
		);
		const keys = Object.keys(result.rows[0] instanceof Object && result.rows[0] ? result.rows[0] : {});
		if (keys.length === 1) {
			return result.rows.map(row => row[keys[0]]);
		} else {
			return result.rows;
		}
	}
}

module.exports = DB;
