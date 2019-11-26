function createdBy(parent, args, context) {
	return context.prisma.player({ id: parent.id }).createdBy()
}

function clan(parent, args, context) {
	return context.prisma.player({ id: parent.id }).clan()
}

function forms(parent, args, context) {
    return context.prisma.player({ id: parent.id }).forms()
}

function rank(parent, args, context) {
    return context.prisma.player({ id: parent.id }).rank()
}

function tournaments(parent, args, context) {
    return context.prisma.player({ id: parent.id }).tournaments()
}
  
module.exports = {
    clan,
    createdBy,
    forms,
    rank,
    tournaments,
}