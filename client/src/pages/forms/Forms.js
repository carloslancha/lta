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
		forms {
			id
			name
		}
	}
`

const CREATE_FORM_MUTATION = gql`
	mutation CreateFormMutation($name: String!) {
		createForm(name: $name) {
			id
			name
		}
	}
`

const DELETE_FORM_MUTATION = gql`
	mutation DeleteFormMutation($id: ID!) {
		deleteForm(id: $id) {
			id
			name
		}
	}
`

export default function Forms(props) {
	const classes = styles()

	const [formName, setFormName] = useState('')

	const createFormMutation = useMutation(CREATE_FORM_MUTATION, {
		update: (cache, { data: { createForm } }) => {
			const { forms } = cache.readQuery({ query: QUERY })
			
			cache.writeQuery({
				data: {
					forms: forms.concat([createForm]) 
				},
				query: QUERY,
			})

			setFormName('')
		},

		variables: {
			name: formName,
		},
	})

	const deleteFormMutation = useMutation(DELETE_FORM_MUTATION, {
		update: (cache, { data: { deleteForm } } ) => {
			const { forms } = cache.readQuery({ query: QUERY })

			cache.writeQuery({
				data: {
					forms: forms.filter((form) => {
						return form.id !== deleteForm.id
					})
				},
				query: QUERY,
			})
		}
	})

	const {
		data: {
			forms
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
							Add Form
						</Typography>

						<form onSubmit={(e) => {
							e.preventDefault() 
							createFormMutation()
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
							List of Forms
						</Typography>

						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Name</TableCell>
									<TableCell align="right">Operations</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{forms.map(form => (
									<TableRow key={form.id}>
										<TableCell>{form.name}</TableCell>
										<TableCell align="right">
											<IconButton 
												aria-label="Edit"
												component={Link}
												to={`${props.match.url}/edit/${form.id}`}
											>
												<EditIcon />
											</IconButton>

											<IconButton
												aria-label="Delete"
												onClick={() => {
													if (window.confirm('Continue?')) {
														deleteFormMutation({variables:{id:form.id}})
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