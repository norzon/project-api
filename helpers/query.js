module.exports = function Query() {

	let columns = [],
	table = '',
	joins = [],
	where = '',
	indent = 0,
	template = `SELECT\n\t{cols}\nFROM\n\t{table}\n{joins}\n{where}`

	return {
		select(cols) {
			if (typeof cols === 'string') {
				cols = [cols];
			}

			if (cols instanceof Array) {
				cols
				.filter(col => !columns.includes(col))
				.forEach(col => columns.push(col));
			}

			return this;
		},
		from(t) {
			table = t;
			return this;
		},
		join(type, table, conditions) {
			const t = typeof type === 'string' ? type.toUpperCase() : 'INNER';

			if (conditions instanceof Array) {
				conditions = conditions.reduce((a, c) => a + '\n\t\t' + c, '');
			} else {
				conditions = ' ' + conditions;
			}
			joins.push(`${t} JOIN\n\t${table} ON${conditions}`);

			return this;
		},
		innerJoin(table, conditions) {
			return this.join('INNER', table, conditions)
		},
		leftJoin(table, conditions) {
			return this.join('LEFT', table, conditions)
		},
		rightJoin(table, conditions) {
			return this.join('RIGHT', table, conditions)
		},
		where(conditions) {
			if (typeof conditions === 'string') {
				where = conditions
			} else if (conditions instanceof Array) {
				where = '\t' + conditions.join('\n\t');
			}
			return this;
		},
		indent(n) {
			indent = n;
			return this;
		},
		generate() {
			let generated = template;

			generated = generated
			.replace('{cols}', columns.join(',\n\t'))
			.replace('{table}', table)
			.replace('{joins}', joins.join('\n'))
			.replace('{where}', where ? `WHERE\n\t${where}` : '')

			generated = generated
			.trim()
			.split(/\n/g)
			.map(line => '\t'.repeat(indent) + line)
			.join('\n')

			return generated;
		},
	};
}
