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
	query Clan($id: ID!) {
		clan(id: $id) {
			id
			name
			school {
				id
				name
			}
		}

		schools {
			id
			name
		}
	}
`

const UPDATE_CLAN_MUTATION = gql`
	mutation UpdateClanMutation($id: ID!, $name: String!, $schoolId: ID!) {
		updateClan(id: $id, name: $name, schoolId: $schoolId) {
			id
			name
			school {
				id
				name
			}
		}
	}
`

export default function ClanEdit(props) {
	const classes = styles()

	const id = props.match.params.id
	const [clanName, setClanName] = useState('')
	const [clanSchool, setClanSchool] = useState('')

	const UpdateClanMutation = useMutation(UPDATE_CLAN_MUTATION, {
		variables: {
			id,
			name: clanName,
			schoolId: clanSchool
		},
	})

	const {
		data: {
			clan,
			schools,
		},
		loading,
		error,
	} = useQuery(QUERY, {
		variables: {
			id
		},
	})

	useEffect(() => {
		if (clan) {
			setClanName(clan.name)
			setClanSchool(clan.school.id)
		}
	}, [clan])

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
							Edit Clan
						</Typography>

						<form onSubmit={(e) => {
							e.preventDefault() 
							UpdateClanMutation()
							props.history.push(`/clans`)
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
										required
										id="clanName"
										name="clanName"
										label="Name"
										fullWidth
										onChange={(e) => {setClanName(e.target.value)}}
										value={clanName}
									/>
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