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
		academies {
			id
			name
			country
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

const CREATE_SCHOOL_MUTATION = gql`
	mutation CreateSchoolMutation($academyId: ID!, $name: String!) {
		createSchool(academyId: $academyId, name: $name) {
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

const DELETE_SCHOOL_MUTATION = gql`
	mutation DeleteSchoolMutation($id: ID!) {
		deleteSchool(id: $id) {
			id
		}
	}
`

export default function Schools(props) {
	const classes = styles()

	const [schoolAcademy, setSchoolAcademy] = useState('')
	const [schoolName, setSchoolName] = useState('')

	const createSchoolMutation = useMutation(CREATE_SCHOOL_MUTATION, {
		update: (cache, { data: { createSchool } }) => {
			const { academies, schools } = cache.readQuery({ query: QUERY })
			
			cache.writeQuery({
				data: { 
					academies: academies,
					schools: schools.concat([createSchool])
				},
				query: QUERY,
			})

			setSchoolAcademy('')
			setSchoolName('')
		},

		variables: { 
			academyId: schoolAcademy,
			name: schoolName
		},
	})

	const deleteSchoolMutation = useMutation(DELETE_SCHOOL_MUTATION, {
		update: (cache, { data: { deleteSchool } } ) => {
			const { academies, schools } = cache.readQuery({ query: QUERY })

			cache.writeQuery({
				data: {
					academies,
					schools: schools.filter((school) => {
						return school.id !== deleteSchool.id
					})
				},
				query: QUERY,
			})
		}
	})

	const { 
		data: {
			academies,
			schools
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
							Add School
						</Typography>

						<form onSubmit={(e) => {
							e.preventDefault() 
							createSchoolMutation()
						}}>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<FormControl fullWidth>
										<InputLabel htmlFor="schoolAcademy">Academy</InputLabel>

										<Select
											inputProps={{
												name: 'schoolAcademy',
												id: 'schoolAcademy',
											}}
											onChange={(e) => {setSchoolAcademy(e.target.value)}}
											value={schoolAcademy}
										>
											{academies.map(academy => (
												<MenuItem 
													key={academy.id}
													value={academy.id}
												>
													{academy.name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>

								<Grid item xs={12}>
									<TextField
										fullWidth
										id="schoolName"
										label="Name"
										name="schoolName"
										onChange={(e) => {setSchoolName(e.target.value)}}
										required
										value={schoolName}
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
							List of Schools
						</Typography>

						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Name</TableCell>
									<TableCell align="center">Academy</TableCell>
									<TableCell align="right">Operations</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{schools.map(school => (
									<TableRow key={school.id}>
										<TableCell>{school.name}</TableCell>
										<TableCell align="center">{school.academy.name}</TableCell>
										<TableCell align="right">
											<IconButton 
												aria-label="Edit"
												component={Link}
												to={`${props.match.url}/edit/${school.id}`}
											>
												<EditIcon />
											</IconButton>

											<IconButton
												aria-label="Delete"
												onClick={() => {
													if (window.confirm('All data related to the school (clans, players...) will be deleted. Continue?')) {
														deleteSchoolMutation({variables:{id:school.id}})
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