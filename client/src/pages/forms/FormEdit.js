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
	query Form($id: ID!) {
		form(id: $id) {
			id
			name
	}
}
`

const UPDATE_FORM_MUTATION = gql`
	mutation UpdateFormyMutation($id: ID!, $name: String!) {
		updateForm(id: $id, name: $name) {
			id
			name
		}
	}
`

export default function FormEdit(props) {
	const classes = styles()

	const id = props.match.params.id
	const [formName, setFormName] = useState('')

	const UpdateFormyMutation = useMutation(UPDATE_FORM_MUTATION, {
		update: () => {
			props.history.push(`/forms`)
		},

		variables: {
			id,
			name: formName
		},
	})

	const {
		data: {
			form
		},
		error,
		loading,
	} = useQuery(QUERY, {
		variables: {
			id
		},
	})

	useEffect(() => {
		if (form) {
			setFormName(form.name)
		}
	}, [form])

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
							Edit Form
						</Typography>

						<form onSubmit={(e) => {
							e.preventDefault() 
							UpdateFormyMutation()
						}}>

							<Grid container spacing={3}>
								<Grid item xs={12}>
									<TextField
										fullWidth
										id="formName"
										label="Name"
										name="formName"
										onChange={(e) => {setFormName(e.target.value)}}
										required
										value={formName}
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