import { MongoClient } from 'mongodb';

export default async (
	aegis,
	{ uri = 'mongodb://localhost:27017', db: dbName }
) => {
	const client = await MongoClient.connect(
		uri,
		{ useNewUrlParser: true }
	);
	const db = await client.db(dbName);
	const users = db.collection('users');

	users.createIndex(
		{ email: 1 },
		{
			collation: { locale: 'en', strength: 1 },
			unique: true
		}
	);

	users.createIndex(
		{ username: 1 },
		{
			collation: { locale: 'en', strength: 1 },
			unique: true
		}
	);

	return {
		findByUsername(username, { fields, strict = true } = {}) {
			return users
				.find({
					$or: [
						{
							email: username
						},
						{
							username
						}
					]
				})
				.collation({ locale: 'en', strength: 1 })
				.limit(1)
				.next();
		},
		add(user) {
			return users.insertOne(user);
		}
	};
};
