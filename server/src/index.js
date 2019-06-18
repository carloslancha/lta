const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')

const Subscription = require('./resolvers/Subscription')

const resolvers = {
	Query,
	Mutation,
	Subscription,
	User,
	Link
}

/*
const resolvers = {
	Query: {
		info: () => `This is the API of a Hackernews Clone`,

		feed: (root, args, context, info) => {
			return context.prisma.links()
		},

		link: (root, args, context, info) => {
			return context.prisma.links()
				.find(obj => obj.id == args.id)
			//return links.find(obj => obj.id == args.id)
		}
	},

	Mutation: {
		post: (root, args, context) => {
			return context.prisma.createLink({
				url: args.url,
				description: args.description,
			})
		},

		updateLink: (root, args, context) => {
			let link = context.prisma.links()
				.find(obj => obj.id == args.id)

			link.url = args.url
			link.description = args.description

			return link;
		},

		deleteLink: (root, args, context) => {
			const index =  context.prisma.links()
				.findIndex((obj) => {
					return obj.id == args.id
				})

			if (index != -1)
				return links.splice(index, 1)[0]
		}
	},
}

/*
const resolvers = {
	Query: {
		info: () => `This is the API of a Hackernews Clone`,
		feed: () => links,
		link: (parent, args) => {
			return links.find(obj => obj.id == args.id)
		}
	},

	Mutation: {
		post: (parent, args) => {
			const link = {
				id: `link-${idCount++}`,
				description: args.description,
				url: args.url,
			}
			links.push(link)
			return link
		},

		updateLink: (parent, args) => {
			let link = links.find(obj => obj.id == args.id)

			link.url = args.url
			link.description = args.description

			return link;
		},

		deleteLink: (parent, args) => {
			const index = links.findIndex((obj) => {
				return obj.id == args.id
			})

			if (index != -1)
				return links.splice(index, 1)[0]
		}
	},
}
*/

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