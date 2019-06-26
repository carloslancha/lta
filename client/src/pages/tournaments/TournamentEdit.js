import { useMutation, useQuery } from 'react-apollo-hooks'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControl from '@material-ui/core/FormControl'
import gql from 'graphql-tag'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import React, { useEffect, useState } from 'react'
import Select from '@material-ui/core/Select'
import styles from '../../styles/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

const QUERY = gql`
	query Tournament($id: ID!) {
		players {
			id
			name
			familyName
			nickname
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

		tournament(id: $id) {
			id
			name
			players {
				id
				name
				familyName
				nickname
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
			poulesType
		}

		poulesTypes: __type(name: "PoulesType") {
			name
			enumValues {
				name
			}
		}
	}
`

const UPDATE_TOURNAMENT_MUTATION = gql`
	mutation UpdateTournamentMutation($id: ID!, $name: String!, $playerIds: [ID!], $poulesType: PoulesType!) {
		updateTournament(id: $id, name: $name, playerIds: $playerIds, poulesType: $poulesType) {
			id
			name
			players {
				id
				name
				familyName
				nickname
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
			poulesType
		}
	}
`

export default function TournamentEdit(props) {
	const classes = styles()

	const id = props.match.params.id

	const [tournamentName, setTournamentName] = useState('')
	const [tournamentPlayers, setTournamentPlayers] = useState([])
	const [tournamentPoulesType, setTournamentPoulesType] = useState('')

	const UpdateTournamentMutation = useMutation(UPDATE_TOURNAMENT_MUTATION, {
		variables: {
			id,
			name: tournamentName,
			playerIds: tournamentPlayers,
			poulesType: tournamentPoulesType,
		},
	})

	const {
		data: {
			players,
			tournament,
			poulesTypes,
		},
		loading,
		error,
	} = useQuery(QUERY, {
		variables: {
			id
		},
	})

	useEffect(() => {
		if (tournament) {
			setTournamentName(tournament.name)
			setTournamentPlayers(tournament.players.map((player) => { return player.id }))
			setTournamentPoulesType(tournament.poulesType)
		}
	}, [tournament])

	if (loading) {
		return (
			<div align="center"><CircularProgress /></div>
		)
	}

	if (error) return `Error! ${error.message}`

	return (
		<div>
			<Grid container justify="center" alignContent="center">
				<Grid item xs={12} md={6} lg={6}>
					<Paper className={classes.paper}>
						<Typography component="h1" variant="h5" align="center">
							Edit Tournament
						</Typography>

						<form onSubmit={(e) => {
							e.preventDefault() 
							UpdateTournamentMutation()
							props.history.push(`/tournaments`)
						}}>

							<Grid container spacing={3}>
								<Grid item xs={12}>
									<TextField
										fullWidth
										id="tournamentName"
										label="Name"
										name="tournamentName"
										onChange={(e) => {setTournamentName(e.target.value)}}
										required
										value={tournamentName}
									/>
								</Grid>

								<Grid item xs={12}>
									<FormControl fullWidth>
										<InputLabel htmlFor="tournamentPlayers">Players</InputLabel>

										<Select
											inputProps={{
												name: 'tournamentPlayers',
												id: 'tournamentPlayers',
											}}
											multiple
											onChange={(e) => {setTournamentPlayers(e.target.value)}}
											value={tournamentPlayers}
										>
											{players.map(player => (
												<MenuItem 
													key={player.id}
													value={player.id}
												>
													{`${player.name} ${player.familyName} (${player.nickname}) - ${player.clan.name}`}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>

								<Grid item xs={12}>
									<FormControl fullWidth>
										<InputLabel htmlFor="tournamentPoulesType">Poules Type</InputLabel>

										<Select
											inputProps={{
												name: 'tournamentPoulesType',
												id: 'tournamentPoulesType',
											}}
											onChange={(e) => {setTournamentPoulesType(e.target.value)}}
											value={tournamentPoulesType}
										>
											{poulesTypes.enumValues.map(pouleType => (
												<MenuItem 
													key={pouleType.name}
													value={pouleType.name}
												>
													{pouleType.name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>

								<Grid item xs={12} align="center">
									<Button
										variant="contained"
										color="primary"
										type="submit"
									>
										Save
									</Button>						
								</Grid>
							</Grid>
						</form>
					</Paper>
				</Grid>
			</Grid>
		</div>
	)
}