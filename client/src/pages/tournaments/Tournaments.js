import { Link } from 'react-router-dom'
import { useMutation, useQuery } from 'react-apollo-hooks'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import FormControl from '@material-ui/core/FormControl'
import gql from 'graphql-tag'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import React, { useState } from 'react'
import Select from '@material-ui/core/Select'
import styles from '../../styles/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

const QUERY = gql`
	{
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
		tournaments {
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
		}
	}
`

const CREATE_TOURNAMENT_MUTATION = gql`
	mutation CreateTournamentMutation($name: String!, $playerIds: [ID!]) {
		createTournament(name: $name, playerIds: $playerIds) {
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
		}
	}
`

const DELETE_TOURNAMENT_MUTATION = gql`
	mutation DeleteTournamentMutation($id: ID!) {
		deleteTournament(id: $id) {
			id
			name
		}
	}
`

export default function Tournaments(props) {
	const classes = styles()

	const [tournamentName, setTournamentName] = useState('')
	const [tournamentPlayers, setTournamentPlayers] = useState([])

	const createTournamentMutation = useMutation(CREATE_TOURNAMENT_MUTATION, {
		update: (cache, { data: { createTournament } }) => {
			const { players, tournaments } = cache.readQuery({ query: QUERY })

			cache.writeQuery({
				data: {
					players,
					tournaments: tournaments.concat([createTournament])
				},
				query: QUERY,
			})
			
			setTournamentName('')
			setTournamentPlayers([])
		},

		variables: {
			name: tournamentName,
			playerIds: tournamentPlayers,
		},
	})
	

	const deleteTournamentMutation = useMutation(DELETE_TOURNAMENT_MUTATION, {
		update: (cache, { data: { deleteTournament } } ) => {
			const { players, tournaments } = cache.readQuery({ query: QUERY })

			cache.writeQuery({
				data: {
					players,
					tournaments: tournaments.filter((tournament) => {
						return tournament.id !== deleteTournament.id
					})
				},
				query: QUERY,
			})
		}
	})

	const { 
		data: {
			players,
			tournaments,
		},
		error,
		loading,
	} = useQuery(QUERY)

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
							Add Tournament
						</Typography>

						<form onSubmit={(e) => {
							e.preventDefault()
							createTournamentMutation()							
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

								<Grid item xs={12} align="center">
									<Button
										color="primary"
										type="submit"
										variant="contained"
									>
										Create
									</Button>						
								</Grid>
							</Grid>
						</form>
					</Paper>
				</Grid>
			</Grid>

			<div className={classes.gridSpacer} />

			<Grid container>
				<Grid item xs={12}>
					<Paper className={classes.paper}>
						<Typography component="h1" variant="h5" align="center">
							List of Tournaments
						</Typography>

						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Name</TableCell>
									<TableCell align="right">Operations</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{tournaments.map(tournament => (
									<TableRow key={tournament.id}>
										<TableCell>{tournament.name}</TableCell>
										<TableCell align="right">
											<IconButton 
												aria-label="Edit"
												component={Link}
												to={`${props.match.url}/edit/${tournament.id}`}
											>
												<EditIcon />
											</IconButton>

											<IconButton
												aria-label="Delete"
												onClick={() => {
													if (window.confirm('All data related to the tournament will be deleted. Continue?')) {
														deleteTournamentMutation({variables:{id:tournament.id}})
													}
												}}
											>
												<DeleteIcon />
											</IconButton>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Paper>
				</Grid>
			</Grid>
		</div>
	)
}