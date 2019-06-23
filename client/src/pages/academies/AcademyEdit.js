import { useMutation, useQuery } from 'react-apollo-hooks'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import gql from 'graphql-tag'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import React, { useEffect, useState } from 'react'
import styles from '../../styles/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

const QUERY = gql`
	query Academy($id: ID!) {
		academy(id: $id) {
			id
			name
			country
	}
}
`

const UPDATE_ACADEMY_MUTATION = gql`
	mutation UpdateAcademyMutation($id: ID!, $name: String!, $country: String!) {
		updateAcademy(id: $id, name: $name, country: $country) {
			id
			country
			name
		}
	}
`

export default function AcademyEdit(props) {
	const classes = styles()

	const id = props.match.params.id
	const [academyCountry, setAcademyCountry] = useState('')
	const [academyName, setAcademyName] = useState('')

	const UpdateAcademyMutation = useMutation(UPDATE_ACADEMY_MUTATION, {
		update: () => {
			props.history.push(`/academies`)
		},

		variables: { 
			id,
			name: academyName,
			country: academyCountry,
		},
	})

	const { 
		data: {
			academy
		},
		error,
		loading,
	} = useQuery(QUERY, {
		variables: {
			id
		},
	})

	useEffect(() => {
		if (academy) {
			setAcademyName(academy.name)
			setAcademyCountry(academy.country)
		}
	}, [academy])

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
							Edit Academy
						</Typography>

						<form onSubmit={(e) => {
							e.preventDefault() 
							UpdateAcademyMutation()
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