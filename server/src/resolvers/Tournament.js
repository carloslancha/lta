function createdBy(parent, args, context) {
	return context.prisma.tournament({ id: parent.id }).createdBy()
}

function players(parent, args, context) {
    return context.prisma.tournament({ id: parent.id }).players()
}
  
module.exports = {
    createdBy,
    players,
}