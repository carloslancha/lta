function players(parent, args, context) {
	return context.prisma.clan({ id: parent.id }).players()
}

function createdBy(parent, args, context) {
	return context.prisma.clan({ id: parent.id }).createdBy()
}

function school(parent, args, context) {
	return context.prisma.clan({ id: parent.id }).school()
}

  
module.exports = {
    createdBy,
    players,
    school,
}