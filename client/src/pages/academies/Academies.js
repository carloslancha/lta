import { Link } from 'react-router-dom'
import { useMutation, useQuery } from 'react-apollo-hooks'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import gql from 'graphql-tag'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import React, { useState } from 'react'
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
		academies {
			id
			name
			country
		}
	}
`

const CREATE_ACADEMY_MUTATION = gql`
	mutation CreateAcademyMutation($name: String!, $country: String!) {
		createAcademy(name: $name, country: $country) {
			id
			country
			name
		}
	}
`

const DELETE_ACADEMY_MUTATION = gql`
	mutation DeleteAcademyMutation($id: ID!) {
		deleteAcademy(id: $id) {
			id
			name
			country
		}
	}
`

export default function Academies(props) {
	const classes = styles()

	const [academyName, setAcademyName] = useState('')
	const [academyCountry, setAcademyCountry] = useState('')

	const createAcademyMutation = useMutation(CREATE_ACADEMY_MUTATION, {
		update: (cache, { data: { createAcademy } }) => {
			const { academies } = cache.readQuery({ query: QUERY })

			cache.writeQuery({
				data: { 
					academies: academies.concat([createAcademy])
				},
				query: QUERY,
			})
			
			setAcademyCountry('')
			setAcademyName('')
		},

		variables: { 
			country: academyCountry,
			name: academyName,
		},
	})
	

	const deleteAcademyMutation = useMutation(DELETE_ACADEMY_MUTATION, {
		update: (cache, { data: { deleteAcademy } } ) => {
			const { academies } = cache.readQuery({ query: QUERY })

			cache.writeQuery({
				data: { 
					academies: academies.filter((academy) => {
						return academy.id !== deleteAcademy.id
					})
				},
				query: QUERY,
			})
		}
	})

	const { 
		data: {
			academies
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
							Add Academy
						</Typography>

						<form onSubmit={(e) => {
							e.preventDefault()
							createAcademyMutation()

							
						}}>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<TextField
										fullWidth
										id="academyName"
										label="Name"
										name="academyName"
										onChange={(e) => {setAcademyName(e.target.value)}}
										required
										value={academyName}
									/>
								</Grid>

								<Grid item xs={12}>
									<TextField
										fullWidth
										id="academyCountry"
										label="Country"
										name="academyCountry"
										onChange={(e) => {setAcademyCountry(e.target.value)}}
										required
										value={academyCountry}
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
							List of Academies
						</Typography>

						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Name</TableCell>
									<TableCell align="center">Country</TableCell>
									<TableCell align="right">Operations</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{academies.map(academy => (
									<TableRow key={academy.id}>
										<TableCell>{academy.name}</TableCell>
										<TableCell align="center">{academy.country}</TableCell>
										<TableCell align="right">
											<IconButton 
												aria-label="Edit"
												component={Link}
												to={`${props.match.url}/edit/${academy.id}`}
											>
												<EditIcon />
											</IconButton>

											<IconButton
												aria-label="Delete"
												onClick={() => {
													if (window.confirm('All data related to the academy (schools, clans, players...) will be deleted. Continue?')) {
														deleteAcademyMutation({variables:{id:academy.id}})
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