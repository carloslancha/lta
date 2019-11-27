import { makeStyles } from '@material-ui/core/styles';
import { useMutation, useQuery } from 'react-apollo-hooks'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import clsx from 'clsx';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import gql from 'graphql-tag'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import React, { useEffect, useState } from 'react'
import styles from '../../styles/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'

const QUERY = gql`
	query Tournament($id: ID!) {
		tournament(id: $id) {
			id
			name
			poules {
				id
				matches {
					id
					order
					player1 {
						id
						name
						familyName
						nickname
						clan {
							name
						}
					}
					player2 {
						id
						name
						familyName
						nickname
						clan {
							name
						}
					}
					resultPlayer1
					resultPlayer2
				}
				name
				players {
					id
					name
					familyName
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
					nickname
					clan {
						name
						school {
							academy {
								name
								country
							}
						}
					}
					rank {
						name
					}
				}
			}
			rounds {
				id
				matches {
					id
					order
					player1 {
						id
						name
						familyName
						nickname
						clan {
							name
						}
					}
					player2 {
						id
						name
						familyName
						nickname
						clan {
							name
						}
					}
					resultPlayer1
					resultPlayer2
				}
				roundType
			}
		}
	}
`

const GENERATE_TOURNAMENT_POULES_MUTATION = gql`
	mutation GenerateTournamentPoulesMutation($tournamentId: ID!) {
		generateTournamentPoules(tournamentId: $tournamentId) {
			id
			name
			poules {
				id
				matches {
					id
					order
					player1 {
						id
						name
						familyName
						nickname
						clan {
							name
						}
					}
					player2 {
						id
						name
						familyName
						nickname
						clan {
							name
						}
					}
					resultPlayer1
					resultPlayer2
				}
				name
				players {
					id
					name
					familyName
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
					nickname
					clan {
						name
						school {
							academy {
								name
								country
							}
						}
					}
					rank {
						name
					}
				}
			}
			rounds {
				id
				matches {
					id
					order
					player1 {
						id
						name
						familyName
						nickname
						clan {
							name
						}
					}
					player2 {
						id
						name
						familyName
						nickname
						clan {
							name
						}
					}
					resultPlayer1
					resultPlayer2
				}
				roundType
			}
		}
	}
`

const GENERATE_NEXT_TOURNAMENT_PHASE_MUTATION = gql`
	mutation GenerateNextTournamentPhase($tournamentId: ID!) {
		generateNextTournamentPhase(tournamentId: $tournamentId) {
			id
			name
			poules {
				id
				matches {
					id
					order
					player1 {
						id
						name
						familyName
						nickname
						clan {
							name
						}
					}
					player2 {
						id
						name
						familyName
						nickname
						clan {
							name
						}
					}
					resultPlayer1
					resultPlayer2
				}
				name
				players {
					id
					name
					familyName
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
					nickname
					clan {
						name
						school {
							academy {
								name
								country
							}
						}
					}
					rank {
						name
					}
				}
			}
			rounds {
				id
				matches {
					id
					order
					player1 {
						id
						name
						familyName
						nickname
						clan {
							name
						}
					}
					player2 {
						id
						name
						familyName
						nickname
						clan {
							name
						}
					}
					resultPlayer1
					resultPlayer2
				}
				roundType
			}
		}
	}
`

const useStyles = makeStyles(theme => ({
	expandOpen: {
		transform: 'rotate(180deg)',
	},
}));

function Poule(props) {
	const classes = useStyles();

	const poule = props.poule

	const [expanded, setExpanded] = React.useState(false);

	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<Typography component="h2" variant="h6" align="center">
					{poule.name}
				</Typography>

				<Table>
					<TableHead>
						<TableRow>
							<TableCell align="left">#</TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Combat name</TableCell>
							<TableCell>Clan</TableCell>
							<TableCell>Academy</TableCell>
							<TableCell>Country</TableCell>
							<TableCell>Rank</TableCell>
							<TableCell align="center">PWIN</TableCell>
							<TableCell align="center">PLOST</TableCell>
							<TableCell align="center">WIN</TableCell>
							<TableCell align="center">LOST</TableCell>
							<TableCell align="center">TIE</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{poule.players.map((player, index) => (
							<TableRow key={player.id}>
								<TableCell align="left">{index+1}</TableCell>
								<TableCell>{`${player.name} ${player.familyName}`}</TableCell>
								<TableCell>{player.nickname}</TableCell>
								<TableCell>{player.clan.name}</TableCell>
								<TableCell>{player.clan.school.academy.name}</TableCell>
								<TableCell>{player.clan.school.academy.country}</TableCell>
								<TableCell>{player.rank.name}</TableCell>
								<TableCell align="center">{player.pointsWin}</TableCell>
								<TableCell align="center">{player.pointsAgainst}</TableCell>
								<TableCell align="center">{player.winCount}</TableCell>
								<TableCell align="center">{player.lostCount}</TableCell>
								<TableCell align="center">{player.tieCount}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Grid>

			<Grid item xs={12}>
				<Button
					aria-expanded={expanded}
					aria-label="Show more"
					
					onClick={() => {
						setExpanded(!expanded)
					}}
				>
					Show matches 
					<ExpandMoreIcon className={clsx(classes.expand, {
						[classes.expandOpen]: expanded,
					})} />
				</Button>

				<Collapse in={expanded} timeout="auto" unmountOnExit>
					<Table>
						<TableBody>
							{poule.matches.map(match => (
								<TableRow key={match.id}>
									<TableCell>#{match.order}</TableCell>
									<TableCell>{`${match.player1.name} ${match.player1.familyName} - ${match.player1.nickname}`}</TableCell>
									<TableCell>vs</TableCell>
									<TableCell>{`${match.player2.name} ${match.player2.familyName} - ${match.player2.nickname}`}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Collapse>
			</Grid>
		</Grid>
	)
}

export default function TournamentManage(props) {
	const classes = styles()
	
	const id = props.match.params.id

	const [generating, setGenerating] = useState()
	const [poules, setPoules] = useState([])
	
	const generateTournamentPoules = useMutation(GENERATE_TOURNAMENT_POULES_MUTATION, {
		update: () => {
			setGenerating(false)
		},

		variables: {
			tournamentId: id,
		},
	})

	const generateNextTournamentPhase = useMutation(GENERATE_NEXT_TOURNAMENT_PHASE_MUTATION, {
		update: () => {
			setGenerating(false)
		},

		variables: {
			tournamentId: id,
		},
	})

	const {
		data: {
			tournament,
		},
		error,
		loading,
	} = useQuery(QUERY, {
		variables: {
			id
		},
	})

	useEffect(() => {
		if (tournament) {
			setPoules(
				tournament.poules.map(poule => {
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
							return (match.player1.id === a.id && match.player2.id === b.id) ||
								(match.player1.id === b.id && match.player2.id === a.id)
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
			)
		}
	}, [tournament])

	if (loading || generating) {
		return (
			<div align="center"><CircularProgress /></div>
		)
	}

	if (error) return `Error! ${error.message}`

	return (
		<div>
			<Typography component="h1" variant="h5" align="center">
				Manage Tournament: {tournament.name}
			</Typography>

			<div className={classes.gridSpacer} />

			<Grid container>
				<Grid item xs={12}>
					<Paper className={classes.paper}>
						<Grid container spacing={3}>
							{poules.length === 0 ?
								<Grid item xs={12} align="center">
									<Button
										color="primary"
										onClick={() => {
											setGenerating(true)
											generateTournamentPoules()
										}}
										type="button"
										variant="contained"
									>
										Generate Poules
									</Button>
								</Grid>
								:
								<Grid item xs={12}>
									<Grid container spacing={3}>
										<Grid item xs={12} align="right">
											<Button
												color="primary"
												onClick={() => {
													setGenerating(true)
													generateNextTournamentPhase()
												}}
												type="button"
												variant="contained"
											>
												Next Phase
											</Button>
										</Grid>
									</Grid>

									{tournament.rounds && tournament.rounds.map(round => (
										<Grid container spacing={3} key={round.id}>
											<Grid item xs={12}>
												<Typography component="h1" variant="h5" align="center">
													{round.roundType}
												</Typography>
											</Grid>

											{(round.matches.length > 1) &&
												<>
													<Grid item xs={6}>
														{round.matches.slice(0, round.matches.length/2).map(match => (
															<Grid container spacing={3} key={match.id}>
																<Grid item xs={12}>
																	{(match.player1 && `${match.player1.name} ${match.player1.familyName} (${match.resultPlayer1})`) || `BYE`} VS {(match.player2 && `${match.player2.name} ${match.player2.familyName} (${match.resultPlayer2})`) || `BYE`}
																</Grid>
															</Grid>
														))}
													</Grid>

													<Grid item xs={6}>
														{round.matches.slice(round.matches.length/2, round.matches.length).map(match => (
															<Grid container spacing={3} key={match.id}>
																<Grid item xs={12} align="right">
																	{(match.player1 && `${match.player1.name} ${match.player1.familyName} (${match.resultPlayer1})`) || `BYE`} VS {(match.player2 && `${match.player2.name} ${match.player2.familyName} (${match.resultPlayer2})`) || `BYE`}
																</Grid>
															</Grid>
														))}
													</Grid>
												</>
											}

											{round.matches.length === 1 &&
												<Grid item xs={12}>
													{round.matches.map(match => (
														<Grid container spacing={3} key={match.id}>
															<Grid item xs={12} align="center">
																{(match.player1 && `${match.player1.name} ${match.player1.familyName} (${match.resultPlayer1})`) || `BYE`} VS {(match.player2 && `${match.player2.name} ${match.player2.familyName} (${match.resultPlayer2})`) || `BYE`}
															</Grid>
														</Grid>
													))}
												</Grid>
											}
										</Grid>
									))}

									<div className={classes.gridSpacer} />

									{poules.map(poule => (
										<Poule poule={poule} key={poule.id} />
									))}
								</Grid>
							}
						</Grid>
					</Paper>
				</Grid>
			</Grid>
		</div>
	)
}