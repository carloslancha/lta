function createdBy(parent, args, context) {
	return context.prisma.school({ id: parent.id }).createdBy()
}

function academy(parent, args, context) {
	return context.prisma.school({ id: parent.id }).academy()
}

function clans(parent, args, context) {
	return context.prisma.school({ id: parent.id }).clans()
}
  
module.exports = {
	academy,
	clans,
	createdBy,
}