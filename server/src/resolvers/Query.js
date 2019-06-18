function feed(parent, args, context, info) {
	return context.prisma.links()
}

function link(parent, args, context, info) {
	return context.prisma.links()
		.find(obj => obj.id == args.id)
}

module.exports = {
	feed,
	link,
}