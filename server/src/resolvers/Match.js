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

async function nextMatch(parent, args, context) {
    const matches = await context.prisma.match({ id: parent.id }).poule().matches()
    return matches.find(match => match.order === (parent.order +1))
}

module.exports = {
    assaults,
    createdBy,
    nextMatch,
    player1,
    player2,
    poule,
}