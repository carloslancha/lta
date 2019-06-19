function createdBy(parent, args, context) {
	return context.prisma.academy({ id: parent.id }).createdBy()
}

module.exports = {
	createdBy,
}