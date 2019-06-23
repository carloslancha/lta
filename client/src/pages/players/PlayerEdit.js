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
	query School($id: ID!) {
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

		player(id: $id) {
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

const UPDATE_PLAYER_MUTATION = gql`
	mutation UpdatePlayerMutation($id: ID!, $name: String!, $familyName: String!, $nickname: String!, $clanId: ID!, $formIds: [ID!]) {
		updatePlayer(id: $id, name: $name, familyName: $familyName, nickname: $nickname, clanId: $clanId , formIds: $formIds ) {
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

export default function PlayerEdit(props) {
	const classes = styles()

	const id = props.match.params.id
	const [playerClan, setPlayerClan] = useState('')
	const [playerFamilyName, setPlayerFamilyName] = useState('')
	const [playerForms, setPlayerForms] = useState([])
	const [playerName, setPlayerName] = useState('')
	const [playerNickname, setPlayerNickname] = useState('')

	const UpdatePlayerMutation = useMutation(UPDATE_PLAYER_MUTATION, {
		variables: {
			id,
			clanId: playerClan,
			familyName: playerFamilyName,
			formIds: playerForms,
			name: playerName,
			nickname: playerNickname,
		},
	})

	const { 
		data: {
			clans,
			forms,
			player,
		},
		error,
		loading,
	} = useQuery(QUERY, { variables: { id } })

	useEffect(() => {
		if(player) {
			setPlayerName(player.name)
			setPlayerFamilyName(player.familyName)
			setPlayerNickname(player.nickname)
			setPlayerForms(player.forms.map((form) => { return form.id }))
			setPlayerClan(player.clan.id)
		}
	}, [player])

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
							Edit Player
						</Typography>

						<form onSubmit={(e) => {
							e.preventDefault() 
							UpdatePlayerMutation()
							props.history.push(`/players`)
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