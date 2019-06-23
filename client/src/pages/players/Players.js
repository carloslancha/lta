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
		clans {
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

		forms {
			id
			name
		}

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
			forms {
				id
				name
			}
		}
	}
`

const CREATE_PLAYER_MUTATION = gql`
	mutation CreatePlayerMutation($name: String!, $familyName: String!, $nickname: String!, $clanId: ID!, $formIds: [ID!]) {
		createPlayer(name: $name, familyName: $familyName, nickname: $nickname, clanId: $clanId , formIds: $formIds ) {
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
				}
			}
			forms {
				id
				name
			}
		}
	}
`

const DELETE_PLAYER_MUTATION = gql`
	mutation DeletePlayerMutation($id: ID!) {
		deletePlayer(id: $id) {
			id
		}
	}
`

export default function Players(props) {
	const classes = styles()

	const [playerClan, setPlayerClan] = useState('')
	const [playerFamilyName, setPlayerFamilyName] = useState('')
	const [playerForms, setPlayerForms] = useState([])
	const [playerName, setPlayerName] = useState('')
	const [playerNickname, setPlayerNickname] = useState('')

	const createPlayerMutation = useMutation(CREATE_PLAYER_MUTATION, {
		update: (cache, { data: { createPlayer } }) => {
			const { clans, forms, players } = cache.readQuery({ query: QUERY })

			cache.writeQuery({
				data: { 
					clans,
					forms,
					players: players.concat([createPlayer])
				},
				query: QUERY,
			})

			setPlayerName('')
			setPlayerFamilyName('')
			setPlayerNickname('')
			setPlayerForms([])
			setPlayerClan('')
		},

		variables: { 
			clanId: playerClan,
			familyName: playerFamilyName,
			formIds: playerForms,
			name: playerName,
			nickname: playerNickname,
		},
	})

	const deletePlayerMutation = useMutation(DELETE_PLAYER_MUTATION, {
		update: (cache, { data: { deletePlayer } } ) => {
			const { clans, forms, players } = cache.readQuery({ query: QUERY })

			cache.writeQuery({
				data: {
					clans,
					forms,
					players: players.filter((player) => {
						return player.id !== deletePlayer.id
					})
				},
				query: QUERY,
			})
		}
	})

	const { 
		data: {
			clans,
			forms,
			players,
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
							Add Player
						</Typography>

						<form onSubmit={(e) => {
							e.preventDefault() 
							createPlayerMutation()
						}}>
							<Grid container spacing={3}>
								<Grid item xs={6}>
									<TextField
										fullWidth
										id="playerName"
										label="Name"
										name="playerName"
										onChange={(e) => {setPlayerName(e.target.value)}}
										required
										value={playerName}
									/>
								</Grid>

								<Grid item xs={6}>
									<TextField
										fullWidth
										id="playerFamilyName"
										label="Family Name"
										name="playerFamilyName"
										onChange={(e) => {setPlayerFamilyName(e.target.value)}}
										required
										value={playerFamilyName}
									/>
								</Grid>

								<Grid item xs={6}>
									<TextField
										fullWidth
										id="playerNickname"
										label="Nickname"
										name="playerNickname"
										onChange={(e) => {setPlayerNickname(e.target.value)}}
										required
										value={playerNickname}
									/>
								</Grid>

								<Grid item xs={6}>
									<FormControl fullWidth>
										<InputLabel htmlFor="playerForms">Forms</InputLabel>

										<Select
											inputProps={{
												name: 'playerForms',
												id: 'playerForms',
											}}
											multiple
											onChange={(e) => {setPlayerForms(e.target.value)}}
											value={playerForms}
										>
											{forms.map(form => (
												<MenuItem 
													key={form.id}
													value={form.id}
												>
													{form.name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>

								<Grid item xs={12}>
									<FormControl fullWidth>
										<InputLabel htmlFor="playerClan">Clan</InputLabel>

										<Select
											inputProps={{
												name: 'playerClan',
												id: 'playerClan',
											}}
											onChange={(e) => {setPlayerClan(e.target.value)}}
											value={playerClan}
										>
											{clans.map(clan => (
												<MenuItem 
													key={clan.id}
													value={clan.id}
												>
													{clan.name}
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
							List of Players
						</Typography>

						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Name</TableCell>
									<TableCell align="center">Family Name</TableCell>
									<TableCell align="center">Nickname</TableCell>
									<TableCell align="center">Clan</TableCell>
									<TableCell align="center">Forms</TableCell>
									<TableCell align="right">Operations</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{players.map(player => (
									<TableRow key={player.id}>
										<TableCell>{player.name}</TableCell>
										<TableCell align="center">{player.familyName}</TableCell>
										<TableCell align="center">{player.nickname}</TableCell>
										<TableCell align="center">{player.clan.name}</TableCell>
										<TableCell align="center">
											{player.forms.map((form, i) => (
												`${form.name}${i + 1 < player.forms.length ? ', ' : ''}`
											))}
										</TableCell>

										<TableCell align="right">
											<IconButton 
												aria-label="Edit"
												component={Link}
												to={`${props.match.url}/edit/${player.id}`}
											>
												<EditIcon />
											</IconButton>

											<IconButton
												aria-label="Delete"
												onClick={() => {
													if (window.confirm('All data related to the clan (players...) will be deleted. Continue?')) {
														deletePlayerMutation({variables:{id:player.id}})
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