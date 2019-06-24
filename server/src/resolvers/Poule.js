function players(parent, args, context) {
	return context.prisma.poule({ id: parent.id }).players()
}

function tournament(parent, args, context) {
    return context.prisma.poule({ id: parent.id }).tournament()
}
  
module.exports = {
    players,
    tournament,
}