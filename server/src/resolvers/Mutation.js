const { APP_SECRET, getUserId, shuffleArray } = require('../utils')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { POULE_NAMES, POULES_PLAYERS_PAIRING} = require('../constants/poulesPlayersPairing')

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

function createRank(parent, args, context, info) {
	const userId = getUserId(context)

	return context.prisma.createRank({
		name: args.name,
		createdBy: { connect: { id: userId } },
		value: args.value
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

async function deleteRank(parent, args, context, info) {
	const userId = getUserId(context)

	return context.prisma.deleteRank(
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
			matches: [],
			tournamentId: args.tournamentId,
			players: []
		}

		poules[pouleName] = poule
	}
	
	/** GROUP PLAYERS BY FORMULA */
	const playersGroupedByFormula = players.reduce((prev, curr) => {
		prev[curr['forms'].length] = prev[curr['forms'].length] || {}  
		prev[curr['forms'].length][curr.clan.school.academy.name] = prev[curr['forms'].length][curr.clan.school.academy.name] || {}
		prev[curr['forms'].length][curr.clan.school.academy.name][curr.clan.school.name] = prev[curr['forms'].length][curr.clan.school.academy.name][curr.clan.school.name] || {}
		prev[curr['forms'].length][curr.clan.school.academy.name][curr.clan.school.name][curr.clan.name] = prev[curr['forms'].length][curr.clan.school.academy.name][curr.clan.school.name][curr.clan.name] || []
		prev[curr['forms'].length][curr.clan.school.academy.name][curr.clan.school.name][curr.clan.name].push(curr)
		return prev
	}, {})

	/** ASSIGN PLAYERS TO POULES **/
	let currentPoule = 0
	Object.keys(playersGroupedByFormula).map(key => {
		const byForm = playersGroupedByFormula[key]
		Object.keys(byForm).map(key => {
			const byAcademy = byForm[key]
			Object.keys(byAcademy).map(key => {
				const bySchool = byAcademy[key]
				Object.keys(bySchool).map(key => {
					const byClan = bySchool[key]
					byClan.map(player => {
						poules[POULE_NAMES[currentPoule]].players.push({ id: player.id})
						currentPoule = (currentPoule === numberOfPoules - 1) ? 0 : currentPoule +1
					})
				})
			})

		})
	})

	/** CREATE MATCHES IN CORRECT ORDER*/
	Object.keys(poules).map(key => {
		let poule = poules[key]
		let players = poule.players

		let matches = []

		POULES_PLAYERS_PAIRING[players.length].map((matchConfig, index) => {
			let match = {
				order: index+1,
				player1: { id: players[matchConfig.player1Position - 1].id },
				player2: { id: players[matchConfig.player2Position - 1].id },
			}
			matches.push(match)
		})

		poule.matches = matches
	})

	/** SAVE TO DB */
	return context.prisma.updateTournament(
		{
			data: {
				currentRound: 'POULES',
				poules: {
					create: Object.keys(poules).map(key => { 
						return {
							createdBy: { connect: { id: userId } },
							matches: { create: poules[key].matches },
							matches: { 
								create: poules[key].matches.map(match => {
									return {
										createdBy: { connect: { id: userId } },
										order: match.order,
										player1: { connect: { id: match.player1.id } },
										player2: { connect: { id: match.player2.id } }
									}
								})
							},
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

async function generateNextTournamentPhase(parent, args, context, info) {
	const userId = getUserId(context)

	const fragment = `
		fragment TournamentWithPoulesAndRounds on Tournament {
			currentRound
			id
			name
			players {
				id
			}
			poulesType
			poules {
				id
				name
				matches {
					id
					player1 {
						id
					}
					player2 {
						id
					}
					resultPlayer1
					resultPlayer2
				}
				players {
					id
				}
			}
			rounds {
				id
				matches {
					id
					player1 {
						id
					}
					player2 {
						id
					}
					resultPlayer1
					resultPlayer2
				}
				players {
					id
				}
				roundType
			}
		}
	`

	const tournamentWithPoulesAndRounds = await context.prisma.tournament({id: args.tournamentId}).$fragment(fragment)

	let round

	if (tournamentWithPoulesAndRounds.currentRound === 'POULES') {
		tournamentWithPoulesAndRounds.poules.map(poule => {
			poule.players.map(player => {
				poule.matches.map(match => {
					if (match.player1.id === player.id) {
						player.pointsWin = (player.pointsWin || 0) + match.resultPlayer1 
						player.pointsAgainst = (player.pointsAgainst || 0) + match.resultPlayer2
						player.winCount = (player.winCount || 0) + ((match.resultPlayer1 > match.resultPlayer2) * 1)
						player.lostCount = (player.lostCount || 0) + ((match.resultPlayer1 < match.resultPlayer2) * 1)
						player.tieCount = (player.tieCount || 0) + ((match.resultPlayer1 === match.resultPlayer2) * 1)
					}
					else if (match.player2.id === player.id) {
						player.pointsWin = (player.pointsWin || 0) + match.resultPlayer2 
						player.pointsAgainst = (player.pointsAgainst || 0) + match.resultPlayer1
						player.winCount = (player.winCount || 0) + ((match.resultPlayer2 > match.resultPlayer1) * 1)
						player.lostCount = (player.lostCount || 0) + ((match.resultPlayer2 < match.resultPlayer1) * 1)
						player.tieCount = (player.tieCount || 0) + ((match.resultPlayer1 === match.resultPlayer2) * 1)
					}

					
					return match
				})
				return player
			})

			poule.players.sort((a, b) => {
				if (a.pointsWin > b.pointsWin)
					return -1
				if (a.pointsWin < b.pointsWin)
					return 1

				if (a.pointsAgainst < b.pointsAgainst)
					return -1
				if (a.pointsAgainst > b.pointsAgainst)
					return 1

				if (a.winCount > b.winCount)
					return -1
				if (a.winCount < b.winCount)
					return 1

				if (a.lostCount < b.lostCount)
					return -1
				if (a.lostCount > b.lostCount)
					return 1

				if (a.tieCount > b.tieCount)
					return -1
				if (a.tieCount < b.tieCount)
					return 1

				const tiedMatch = poule.matches.find(match => {
					return match.player1.id === a.id && match.player2.id === b.id ||
						match.player1.id === b.id && match.player2.id === a.id
				})

				if (tiedMatch) {
					if (tiedMatch.player1.id === a.id) {
						if (tiedMatch.resultPlayer1 > tiedMatch.resultPlayer2) {
							return -1
						}
						if (tiedMatch.resultPlayer1 < tiedMatch.resultPlayer2) {
							return 1
						}
					}

					if (tiedMatch.player1.id === b.id) {
						if (tiedMatch.resultPlayer2 > tiedMatch.resultPlayer1) {
							return -1
						}
						if (tiedMatch.resultPlayer2 < tiedMatch.resultPlayer1) {
							return 1
						}
					}
				} 

				return 0					
			})

			return poule
		})
		
		if (tournamentWithPoulesAndRounds.players.length > 32) {
			//newCurrentRound = 'ROUND_OF_64'
		}
		else if (tournamentWithPoulesAndRounds.players.length > 16) {
			//newCurrentRound = 'ROUND_OF_32'

			const matches = [
				{
					order: 1,
					player1: tournamentWithPoulesAndRounds.poules[0].players[1-1],	//A1
					player2: tournamentWithPoulesAndRounds.poules[1].players[8-1],	//B8
				},
				{
					order: 2,
					player1: tournamentWithPoulesAndRounds.poules[2].players[3-1],	//C3
					player2: tournamentWithPoulesAndRounds.poules[3].players[6-1],	//D6
				},
				{
					order: 3,
					player1: tournamentWithPoulesAndRounds.poules[3].players[2-1],	//D2
					player2: tournamentWithPoulesAndRounds.poules[2].players[7-1],	//C7
				},
				{
					order: 4,
					player1: tournamentWithPoulesAndRounds.poules[1].players[4-1],	//B4
					player2: tournamentWithPoulesAndRounds.poules[0].players[5-1],	//A5
				},
				{
					order: 5,
					player1: tournamentWithPoulesAndRounds.poules[1].players[1-1],	//B1
					player2: tournamentWithPoulesAndRounds.poules[0].players[8-1],	//A8
				},
				{
					order: 6,
					player1: tournamentWithPoulesAndRounds.poules[3].players[3-1],	//D3
					player2: tournamentWithPoulesAndRounds.poules[2].players[6-1],	//C6
				},
				{
					order: 7,
					player1: tournamentWithPoulesAndRounds.poules[2].players[2-1],	//C2
					player2: tournamentWithPoulesAndRounds.poules[3].players[7-1],	//D7
				},
				{
					order: 8,
					player1: tournamentWithPoulesAndRounds.poules[0].players[4-1],	//A4
					player2: tournamentWithPoulesAndRounds.poules[1].players[5-1],	//B5
				},
				{
					order: 9,
					player1: tournamentWithPoulesAndRounds.poules[2].players[1-1],	//C1
					player2: tournamentWithPoulesAndRounds.poules[3].players[8-1],	//D8
				},
				{
					order: 10,
					player1: tournamentWithPoulesAndRounds.poules[0].players[3-1],	//A3
					player2: tournamentWithPoulesAndRounds.poules[1].players[6-1],	//B6
				},
				{
					order: 11,
					player1: tournamentWithPoulesAndRounds.poules[1].players[2-1],	//B2
					player2: tournamentWithPoulesAndRounds.poules[0].players[7-1],	//A7
				},
				{
					order: 12,
					player1: tournamentWithPoulesAndRounds.poules[3].players[4-1],	//D4
					player2: tournamentWithPoulesAndRounds.poules[2].players[5-1],	//C5
				},
				{
					order: 13,
					player1: tournamentWithPoulesAndRounds.poules[3].players[1-1],	//D1
					player2: tournamentWithPoulesAndRounds.poules[2].players[8-1],	//C8
				},
				{
					order: 14,
					player1: tournamentWithPoulesAndRounds.poules[1].players[3-1],	//B3
					player2: tournamentWithPoulesAndRounds.poules[0].players[6-1],	//A6
				},
				{
					order: 15,
					player1: tournamentWithPoulesAndRounds.poules[0].players[2-1],	//A2
					player2: tournamentWithPoulesAndRounds.poules[1].players[7-1],	//B7
				},
				{
					order: 16,
					player1: tournamentWithPoulesAndRounds.poules[2].players[4-1],	//C4
					player2: tournamentWithPoulesAndRounds.poules[3].players[5-1],	//D5
				},
			]

			round = {
				matches,
				roundType: 'ROUND_OF_32'
			}
		}
		else if (tournamentWithPoulesAndRounds.players.length > 8) {
			//newCurrentRound = 'ROUND_OF_16'
		}
	}
	else if (tournamentWithPoulesAndRounds.currentRound === 'ROUND_OF_64') {
		const currentRound = tournamentWithPoulesAndRounds.rounds.find(round => {
			return round.roundType === 'ROUND_OF_64'
		})

		let matches = []
		
		for (let i=0; i < currentRound.matches.length; i=i+2) {
			matches.push({
				order: matches.length+1,
				player1: (!currentRound.matches[i].player2 || (currentRound.matches[i].player1 && currentRound.matches[i].resultPlayer1 > currentRound.matches[i].resultPlayer2)) ? currentRound.matches[i].player1 : currentRound.matches[i].player2,
				player2: (!currentRound.matches[i].player2 || (currentRound.matches[i].player1 && currentRound.matches[i+1].resultPlayer1 > currentRound.matches[i+1].resultPlayer2)) ? currentRound.matches[i+1].player1 : currentRound.matches[i+1].player2
			})
		}

		round = {
			matches,
			roundType: 'ROUND_OF_32'
		}
	}
	else if (tournamentWithPoulesAndRounds.currentRound === 'ROUND_OF_32') {
		const currentRound = tournamentWithPoulesAndRounds.rounds.find(round => {
			return round.roundType === 'ROUND_OF_32'
		})

		let matches = []
		
		for (let i=0; i < currentRound.matches.length; i=i+2) {
			matches.push({
				order: matches.length+1,
				player1: (!currentRound.matches[i].player2 || (currentRound.matches[i].player1 && currentRound.matches[i].resultPlayer1 > currentRound.matches[i].resultPlayer2)) ? currentRound.matches[i].player1 : currentRound.matches[i].player2,
				player2: (!currentRound.matches[i].player2 || (currentRound.matches[i].player1 && currentRound.matches[i+1].resultPlayer1 > currentRound.matches[i+1].resultPlayer2)) ? currentRound.matches[i+1].player1 : currentRound.matches[i+1].player2
			})
		}

		round = {
			matches,
			roundType: 'ROUND_OF_16'
		}
	}
	else if (tournamentWithPoulesAndRounds.currentRound === 'ROUND_OF_16') {
		const currentRound = tournamentWithPoulesAndRounds.rounds.find(round => {
			return round.roundType === 'ROUND_OF_16'
		})

		let matches = []
		
		for (let i=0; i < currentRound.matches.length; i=i+2) {
			matches.push({
				order: matches.length+1,
				player1: (!currentRound.matches[i].player2 || (currentRound.matches[i].player1 && currentRound.matches[i].resultPlayer1 > currentRound.matches[i].resultPlayer2)) ? currentRound.matches[i].player1 : currentRound.matches[i].player2,
				player2: (!currentRound.matches[i].player2 || (currentRound.matches[i].player1 && currentRound.matches[i+1].resultPlayer1 > currentRound.matches[i+1].resultPlayer2)) ? currentRound.matches[i+1].player1 : currentRound.matches[i+1].player2
			})
		}

		round = {
			matches,
			roundType: 'QUARTERFINALS'
		}
	}
	else if (tournamentWithPoulesAndRounds.currentRound === 'QUARTERFINALS') {
		const currentRound = tournamentWithPoulesAndRounds.rounds.find(round => {
			return round.roundType === 'QUARTERFINALS'
		})

		let matches = []
		
		for (let i=0; i < currentRound.matches.length; i=i+2) {
			matches.push({
				order: matches.length+1,
				player1: (!currentRound.matches[i].player2 || (currentRound.matches[i].player1 && currentRound.matches[i].resultPlayer1 > currentRound.matches[i].resultPlayer2)) ? currentRound.matches[i].player1 : currentRound.matches[i].player2,
				player2: (!currentRound.matches[i].player2 || (currentRound.matches[i].player1 && currentRound.matches[i+1].resultPlayer1 > currentRound.matches[i+1].resultPlayer2)) ? currentRound.matches[i+1].player1 : currentRound.matches[i+1].player2
			})
		}

		round = {
			matches,
			roundType: 'SEMIFINALS'
		}
	}
	else if (tournamentWithPoulesAndRounds.currentRound === 'SEMIFINALS') {
		const currentRound = tournamentWithPoulesAndRounds.rounds.find(round => {
			return round.roundType === 'SEMIFINALS'
		})

		let matches = []

		matches.push({
			order: 1,
			player1: (currentRound.matches[0].resultPlayer1 < currentRound.matches[0].resultPlayer2) ? currentRound.matches[0].player1 : currentRound.matches[0].player2,
			player2: (currentRound.matches[1].resultPlayer1 < currentRound.matches[1].resultPlayer2) ? currentRound.matches[1].player1 : currentRound.matches[1].player2,
		})

		round = {
			matches,
			roundType: 'THIRD_PLACE_PLAYOFFS'
		}
	}
	else if (tournamentWithPoulesAndRounds.currentRound === 'THIRD_PLACE_PLAYOFFS') {
		const currentRound = tournamentWithPoulesAndRounds.rounds.find(round => {
			return round.roundType === 'SEMIFINALS'
		})

		let matches = []

		matches.push({
			order: 1,
			player1: (currentRound.matches[0].resultPlayer1 > currentRound.matches[0].resultPlayer2) ? currentRound.matches[0].player1 : currentRound.matches[0].player2,
			player2: (currentRound.matches[1].resultPlayer1 > currentRound.matches[1].resultPlayer2) ? currentRound.matches[1].player1 : currentRound.matches[1].player2,
		})

		round = {
			matches,
			roundType: 'FINAL'
		}
	}

	/** SAVE TO DB */
	return context.prisma.updateTournament(
		{
			data: {
				currentRound: round.roundType,
				rounds: {
					create: {
						createdBy: { connect: { id: userId }},
						matches: {
							create: round.matches.map(match => {
								const player1 = match.player1 ? { connect: { id: match.player1.id } } : null
								const player2 = match.player2 ? { connect: { id: match.player2.id } } : null

								return {
									createdBy: { connect: { id: userId }},
									order: match.order,
									player1,
									player2,
								}
							})
						},
						roundType: round.roundType
					}
				}
			},
			where: {
				id: tournamentWithPoulesAndRounds.id
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

async function updateMatch(parent, args, context, info) {
	const userId = getUserId(context)

	return context.prisma.updateMatch(
		{
			data: {
				resultPlayer1: args.resultPlayer1,
				resultPlayer2: args.resultPlayer2,
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

async function updateRank(parent, args, context, info) {
	const userId = getUserId(context)

	return context.prisma.updateRank(
		{
			data: {
				name: args.name,
				value: args.value
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

	const playersExists = await context.prisma.$exists.player({
		id_in: args.playerIds
	})

	if(!playersExists) {
		throw new Error(`The player doesn't exists`)
	}

	return context.prisma.updateTournament(
		{
			data: {
				name: args.name,
				players: arguments.playerIds ? { connect: args.playerIds.map(playerId => { return { id: playerId } } ) } : null,
				poulesType: args.poulesType,
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
	createRank,
	createSchool,
	createTournament,
	deleteAcademy,
	deleteClan,
	deleteForm,
	deletePlayer,
	deleteRank,
	deleteSchool,
	deleteTournament,
	generateTournamentPoules,
	generateNextTournamentPhase,
	updateAcademy,
	updateClan,
	updateForm,
	updateMatch,
	updatePlayer,
	updateRank,
	updateSchool,
	updateTournament,
	login,
	signup,
}