function assaults(parent, args, context) {
	return context.prisma.match({ id: parent.id }).assaults()
}

function createdBy(parent, args, context) {
	return context.prisma.match({ id: parent.id }).createdBy()
}

function player1(parent, args, context) {
	return context.prisma.match({ id: parent.id }).player1()
}

function player2(parent, args, context) {
	return context.prisma.match({ id: parent.id }).player2()
}

function poule(parent, args, context) {
	return context.prisma.match({ id: parent.id }).poule()
}

module.exports = {
    assaults,
    createdBy,
    player1,
    player2,
    poule,
}