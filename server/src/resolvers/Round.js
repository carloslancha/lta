function createdBy(parent, args, context) {
	return context.prisma.round({ id: parent.id }).createdBy()
}

function matches(parent, args, context) {
	return context.prisma.round({ id: parent.id }).matches()
}

function players(parent, args, context) {
	return context.prisma.round({ id: parent.id }).players()
}

function tournament(parent, args, context) {
    return context.prisma.round({ id: parent.id }).tournament()
}
  
module.exports = {
    createdBy,
    matches,
    players,
    tournament,
}