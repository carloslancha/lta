const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')

const Academy = require('./resolvers/Academy')
const Clan = require('./resolvers/Clan')
const Form = require('./resolvers/Form')
const Match = require('./resolvers/Match')
const Mutation = require('./resolvers/Mutation')
const Query = require('./resolvers/Query')
const Player = require('./resolvers/Player')
const Poule = require('./resolvers/Poule')
const Rank = require('./resolvers/Rank')
const Round = require('./resolvers/Round')
const School = require('./resolvers/School')
const Tournament = require('./resolvers/Tournament')
const User = require('./resolvers/User')

const Subscription = require('./resolvers/Subscription')

const resolvers = {
	Academy,
	Clan,
	Form,
	Match,
	Mutation,
	Player,
	Poule,
	Rank,
	Round,
	Query,
	School,
	Subscription,
	Tournament,
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