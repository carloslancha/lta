function createdBy(parent, args, context) {
	return context.prisma.academy({ id: parent.id }).createdBy()
}

function player1(parent, args, context) {
	return context.prisma.arena({ id: parent.id }).player1()
}

function player2(parent, args, context) {
	return context.prisma.arena({ id: parent.id }).player2()
}
  
module.exports = {
	createdBy,
    player1,
    player2
}