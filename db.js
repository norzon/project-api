const oracledb = require("oracledb")

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
		try {
			await this.open();
			let result;
			if (params) {
				result = await this.connection.execute(statement, params);
			} else {
				result = await this.connection.execute(statement);
			}

			return result.rows;
		} catch (error) {
			console.error('DB.Query: ', error);
			return null;
		}
	}
}

module.exports = DB;
