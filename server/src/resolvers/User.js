function academies(parent, args, context) {
	return context.prisma.user({ id: parent.id }).academies()
}

function schools(parent, args, context) {
	return context.prisma.user({ id: parent.id }).schools()
}
  
module.exports = {
	academies,
	schools,
}