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

		schools {
			id
			name
			academy {
				id
				name
				country
			}
		}
	}
`

const CREATE_CLAN_MUTATION = gql`
	mutation CreateClanMutation($schoolId: ID!, $name: String!) {
		createClan(schoolId: $schoolId, name: $name) {
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
`

const DELETE_CLAN_MUTATION = gql`
	mutation DeleteClanMutation($id: ID!) {
		deleteClan(id: $id) {
			id
		}
	}
`

export default function Clans(props) {
	const classes = styles()

	const [clanSchool, setClanSchool] = useState('')
	const [clanName, setClanName] = useState('')

	const createClanMutation = useMutation(CREATE_CLAN_MUTATION, {
		update: (cache, { data: { createClan } }) => {
			const { clans, schools } = cache.readQuery({ query: QUERY })

			cache.writeQuery({
				data: {
					clans: clans.concat([createClan]),
					schools,
				},
				query: QUERY,
			})

			setClanSchool('')
			setClanName('')
		},

		variables: { 
			name: clanName,
			schoolId: clanSchool,
		},
	})

	const deleteClanMutation = useMutation(DELETE_CLAN_MUTATION, {
		update: (cache, { data: { deleteClan } } ) => {
			const { clans, schools } = cache.readQuery({ query: QUERY })

			cache.writeQuery({
				data: {
					clans: clans.filter((clan) => {
						return clan.id !== deleteClan.id
					}),
					schools,
				},
				query: QUERY,
			})
		}
	})

	const {
		data: {
			clans,
			schools,
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
							Add Clan
						</Typography>

						<form onSubmit={(e) => {
							e.preventDefault() 
							createClanMutation()
						}}>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<FormControl fullWidth>
										<InputLabel htmlFor="clanSchool">School</InputLabel>

										<Select
											inputProps={{
												name: 'clanSchool',
												id: 'clanSchool',
											}}
											onChange={(e) => {setClanSchool(e.target.value)}}
											value={clanSchool}
										>
											{schools.map(school => (
												<MenuItem 
													key={school.id}
													value={school.id}
												>
													{school.name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>

								<Grid item xs={12}>
									<TextField
										fullWidth
										id="clanName"
										label="Name"
										name="clanName"
										onChange={(e) => {setClanName(e.target.value)}}
										required
										value={clanName}
									/>
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
							List of Clans
						</Typography>

						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Name</TableCell>
									<TableCell align="center">School</TableCell>
									<TableCell align="right">Operations</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{clans.map(clan => (
									<TableRow key={clan.id}>
										<TableCell>{clan.name}</TableCell>
										<TableCell align="center">{clan.school.name}</TableCell>
										<TableCell align="right">
											<IconButton 
												aria-label="Edit"
												component={Link}
												to={`${props.match.url}/edit/${clan.id}`}
											>
												<EditIcon />
											</IconButton>

											<IconButton
												aria-label="Delete"
												onClick={() => {
													if (window.confirm('All data related to the clan (players...) will be deleted. Continue?')) {
														deleteClanMutation({variables:{id:clan.id}})
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