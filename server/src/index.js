const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')

const Academy = require('./resolvers/Academy')
const Clan = require('./resolvers/Clan')
const Form = require('./resolvers/Form')
const Mutation = require('./resolvers/Mutation')
const Query = require('./resolvers/Query')
const Player = require('./resolvers/Player')
const School = require('./resolvers/School')
const User = require('./resolvers/User')

const Subscription = require('./resolvers/Subscription')

const resolvers = {
	Academy,
	Clan,
	Form,
	Mutation,
	Player,
	Query,
	School,
	Subscription,
	User
}

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers,
	context: request => {
		return {
			...request,
			prisma,
		}
	},
})

server.start(() => console.log(`Server is running on http://localhost:4000`))