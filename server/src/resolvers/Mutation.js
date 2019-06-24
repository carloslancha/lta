const { APP_SECRET, getUserId, shuffleArray } = require('../utils')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function signup(parent, args, context, info) {
	const password = await bcrypt.hash(args.password, 10)
	const user = await context.prisma.createUser({ ...args, password })

	const token = jwt.sign({ userId: user.id }, APP_SECRET)

	return {
		token,
		user,
	}
}

async function login(parent, args, context, info) {
	const user = await context.prisma.user({ email: args.email })
	if (!user) {
		throw new Error('No such user found')
	}

	const valid = await bcrypt.compare(args.password, user.password)
	if (!valid) {
		throw new Error('Invalid password')
	}

	const token = jwt.sign({ userId: user.id }, APP_SECRET)

	return {
		token,
		user,
	}
}

async function createAcademy(parent, args, context, info) {
	const userId = getUserId(context)

	return context.prisma.createAcademy({
		name: args.name,
		country: args.country,
		createdBy: { connect: { id: userId } },
	})
}

async function createClan(parent, args, context, info) {
	const userId = getUserId(context)

	const schoolExists = await context.prisma.$exists.school({
		id: args.schoolId
	})

	if (!schoolExists) {
		throw new Error(`The school doesn't exists`)
	}
	
	return context.prisma.createClan({
		createdBy: { connect: { id: userId } },
		name: args.name,
		school: { connect: { id: args.schoolId } },
	})
}

function createForm(parent, args, context, info) {
	const userId = getUserId(context)

	return context.prisma.createForm({
		name: args.name,
		createdBy: { connect: { id: userId } },
	})
}

async function createPlayer(parent, args, context, info) {
	const userId = getUserId(context)

	const clanExists = await context.prisma.$exists.clan({
		id: args.clanId
	})

	if(!clanExists) {
		throw new Error(`The clan doesn't exists`)
	}

	const formsExists = await context.prisma.$exists.form({
		id_in: args.formIds
	})

	if(!formsExists) {
		throw new Error(`The clan doesn't exists`)
	}

	return context.prisma.createPlayer({
		clan: { connect: { id: args.clanId } },
		createdBy: { connect: { id: userId } },
		familyName: args.familyName,
		forms: args.formIds ? { connect: args.formIds.map(formId => { return { id: formId } } ) } : null,
		name: args.name,
		nickname: args.nickname,
	})
}

async function createSchool(parent, args, context, info) {
	const userId = getUserId(context)

	const academyExists = await context.prisma.$exists.academy({
		id: args.academyId
	})

	if (!academyExists) {
		throw new Error(`The academy doesn't exists`)
	}
	
	return context.prisma.createSchool({
		academy: { connect: { id: args.academyId } },
		createdBy: { connect: { id: userId } },
		name: args.name,
	})
}

async function createTournament(parent, args, context, info) {
	const userId = getUserId(context)

	const playersExists = await context.prisma.$exists.player({
		id_in: args.playerIds
	})

	if(!playersExists) {
		throw new Error(`The player doesn't exists`)
	}

	return context.prisma.createTournament({
		createdBy: { connect: { id: userId } },
		name: args.name,
		players: args.playerIds ? { connect: args.playerIds.map(playerId => { return { id: playerId } } ) } : null,
		poulesType: args.poulesType,
	})
}

async function deleteAcademy(parent, args, context, info) {
	const userId = getUserId(context)

	return context.prisma.deleteAcademy(
		{
			id: args.id
		},
		info
	)
}

async function deleteClan(parent, args, context, info) {
	const userId = getUserId(context)

	return context.prisma.deleteClan(
		{
			id: args.id
		},
		info
	)
}

async function deleteForm(parent, args, context, info) {
	const userId = getUserId(context)

	return context.prisma.deleteForm(
		{
			id: args.id
		},
		info
	)
}

async function deletePlayer(parent, args, context, info) {
	const userId = getUserId(context)

	return context.prisma.deletePlayer(
		{
			id: args.id
		},
		info
	)
}

async function deleteSchool(parent, args, context, info) {
	const userId = getUserId(context)

	return context.prisma.deleteSchool(
		{
			id: args.id
		},
		info
	)
}

async function deleteTournament(parent, args, context, info) {
	const userId = getUserId(context)

	return context.prisma.deleteTournament(
		{
			id: args.id
		},
		info
	)
}

async function generateTournamentPoules(parent, args, context, info) {
	const userId = getUserId(context)

	const POULE_NAMES = [
		'A',
		'B',
		'C',
		'D',
		'E',
		'F',
		'G',
		'H',
		'I',
		'J',
		'K',
		'L',
		'M',
		'N',
		'O',
		'P'
	];

	const fragment = `
		fragment TournamentWithPlayers on Tournament {
			id
			name
			poulesType
			players {
				id
				name
				familyName
				forms {
					id
					name
				}
				clan {
					id
					name
					school {
						id
						name 
						academy {
							id
							name
							country
						}
					}
				}
			}
	}
	`

	const tournamentWithPlayers = await context.prisma.tournament({id: args.tournamentId}).$fragment(fragment)

	let players = tournamentWithPlayers.players

	players = shuffleArray(players)

	/** CREATE POULES */
	const numberOfPoules = Math.ceil(players.length / 8)

	let poules = {}

	for (let i = 0; i < numberOfPoules; i++) {
		const pouleName = POULE_NAMES[i]

		let poule = {
			name: `POULE ${pouleName}`,
			tournamentId: args.tournamentId,
			type: 'POULE',
			players: []
		}

		poules[pouleName] = poule
	}

	const playersGroupedByNumberOfForms = players.reduce((prev, curr) => {
		(prev[curr['forms'].length] = prev[curr['forms'].length] || []).push(curr)
		return prev
	}, {})


	/** ASSIGN PLAYERS TO POULES */
	let currentPoule = 0
	Object.keys(playersGroupedByNumberOfForms).map(key => {
		playersGroupedByNumberOfForms[key].map(player => {
			poules[POULE_NAMES[currentPoule]].players.push({ id: player.id })
			currentPoule = (currentPoule === numberOfPoules - 1) ? 0 : currentPoule +1
		})
	})

	/** SAVE TO DB */
	return context.prisma.updateTournament(
		{
			data: {
				poules: {
					create: Object.keys(poules).map(key => { 
						return {
							name: poules[key].name,
							players: { connect: poules[key].players }
						}
					}),
				}
			},
			where: {
				id: tournamentWithPlayers.id
			}
		},
		info
	)
}

async function updateAcademy(parent, args, context, info) {
	const userId = getUserId(context)

	return context.prisma.updateAcademy(
		{
			data: {
				country: args.country,
				name: args.name
			},
			where: {
				id: args.id
			}
		},
		info
	)
}

async function updateClan(parent, args, context, info) {
	const userId = getUserId(context)

	return context.prisma.updateClan(
		{
			data: {
				name: args.name,
				school: args.schoolId ? { connect: { id: args.schoolId } } : null
			},
			where: {
				id: args.id
			}
		},
		info
	)
}

async function updateForm(parent, args, context, info) {
	const userId = getUserId(context)

	return context.prisma.updateForm(
		{
			data: {
				name: args.name
			},
			where: {
				id: args.id
			}
		},
		info
	)
}

async function updateSchool(parent, args, context, info) {
	const userId = getUserId(context)

	const academyExists = await context.prisma.$exists.academy({
		id: args.academyId
	})

	if (args.academyId && !academyExists) {
		throw new Error(`The academy doesn't exists`)
	}

	return context.prisma.updateSchool(
		{
			data: {
				academy: args.academyId ? { connect: { id: args.academyId } } : null,
				name: args.name
			},
			where: {
				id: args.id
			}
		},
		info
	)
}

async function updatePlayer(parent, args, context, info) {
	const userId = getUserId(context)

	const clanExists = await context.prisma.$exists.clan({
		id: args.clanId
	})

	if(args.clanId && !clanExists) {
		throw new Error(`The clan doesn't exists`)
	}

	const formsExists = await context.prisma.$exists.form({
		id_in: args.formIds
	})

	if(args.formIds && !formsExists) {
		throw new Error(`The clan doesn't exists`)
	}

	return context.prisma.updatePlayer(
		{
			data: {
				clan: args.clanId ? { connect: { id: args.clanId } } : null,
				familyName: args.familyName,
				forms: args.formIds ? { connect: args.formIds.map(formId => { return { id: formId } } ) } : null,
				name: args.name,
				nickname: args.nickname
			},
			where: {
				id: args.id
			}
		},
		info
	)
}

async function updateTournament(parent, args, context, info) {
	const userId = getUserId(context)

	return context.prisma.updateTournament(
		{
			data: {
				name: args.name
			},
			where: {
				id: args.id
			}
		},
		info
	)
}

module.exports = {
	createAcademy,
	createForm,
	createClan,
	createPlayer,
	createSchool,
	createTournament,
	deleteAcademy,
	deleteClan,
	deleteForm,
	deletePlayer,
	deleteSchool,
	deleteTournament,
	generateTournamentPoules,
	updateAcademy,
	updateClan,
	updateForm,
	updatePlayer,
	updateSchool,
	updateTournament,
	login,
	signup,
}