function createdBy(parent, args, context) {
	return context.prisma.academy({ id: parent.id }).createdBy()
}

function schools(parent, args, context) {
	return context.prisma.academy({ id: parent.id }).schools()
}
  
module.exports = {
	createdBy,
	schools,
}