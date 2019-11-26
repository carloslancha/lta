function players(parent, args, context) {
	return context.prisma.rank({ id: parent.id }).players()
}

function createdBy(parent, args, context) {
	return context.prisma.rank({ id: parent.id }).createdBy()
}
  
module.exports = {
    createdBy,
    players,
}