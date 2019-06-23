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
		academies {
			id
			name
			country
		}

		school(id: $id) {
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

const UPDATE_SCHOOL_MUTATION = gql`
	mutation UpdateSchoolMutation($id: ID!, $name: String!, $academyId: ID!) {
		updateSchool(id: $id, name: $name, academyId: $academyId) {
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

export default function SchoolEdit(props) {
	const classes = styles()

	const id = props.match.params.id
	const [schoolName, setSchoolName] = useState('')
	const [schoolAcademy, setSchoolAcademy] = useState('')

	const UpdateSchoolMutation = useMutation(UPDATE_SCHOOL_MUTATION, {
		update: () => {
			props.history.push(`/schools`)
		},

		variables: { 
			id,
			name: schoolName,
			academyId: schoolAcademy
		},
	})

	const { 
		data: {
			academies,
			school
		},
		error,
		loading,
	} = useQuery(QUERY, {
		variables: {
			id
		},
	})

	useEffect(() => {
		if(school) {
			setSchoolName(school.name)
			setSchoolAcademy(school.academy.id)
		}
	}, [school])

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
							Edit School
						</Typography>

						<form onSubmit={(e) => {
							e.preventDefault() 
							UpdateSchoolMutation()
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