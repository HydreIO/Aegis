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

	/*users.createIndex(
		{ type: 1 },
		{
			email: { locale: 'en', strength: 1 },
			pseudo: { locale: 'en', strength: 1 }
		}
	);*/

	return {
		findByUsername(username, { fields, strict = true } = {}) {
			return users
				.find({
					$or: [
						{
							email: username
						},
						{
							pseudo: username
						}
					]
				})
				.collation({ locale: 'en', strength: 1 })
				.limit(1)
				.next();
		}
	};
};
