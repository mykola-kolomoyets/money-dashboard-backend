

export const getMongoUrl = () =>
	`mongodb+srv://${process.env.MONGO_DB_USER_NAME}:${process.env.MONGO_DB_USER_PASSWORD}@cluster0.ybvor.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`