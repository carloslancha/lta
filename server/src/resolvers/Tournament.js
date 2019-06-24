function createdBy(parent, args, context) {
	return context.prisma.tournament({ id: parent.id }).createdBy()
}

function players(parent, args, context) {
    return context.prisma.tournament({ id: parent.id }).players()
}

function poules(parent, args, context) {
    return context.prisma.tournament({ id: parent.id }).poules()
}
  
module.exports = {
    createdBy,
    players,
    poules,
}