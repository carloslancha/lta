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
		ranks {
			id
			name
			value
		}
	}
`

const CREATE_RANK_MUTATION = gql`
	mutation CreateRankMutation($name: String!, $value: Int!) {
		createRank(name: $name, value: $value) {
			id
			name
			value
		}
	}
`

const DELETE_RANK_MUTATION = gql`
	mutation DeleteRankMutation($id: ID!) {
		deleteRank(id: $id) {
			id
			name
			value
		}
	}
`

export default function Ranks(props) {
	const classes = styles()

	const [rankName, setRankName] = useState('')
	const [rankValue, setRankValue] = useState(0)

	const createRankMutation = useMutation(CREATE_RANK_MUTATION, {
		update: (cache, { data: { createRank } }) => {
			const { ranks } = cache.readQuery({ query: QUERY })
			
			cache.writeQuery({
				data: {
					ranks: ranks.concat([createRank]) 
				},
				query: QUERY,
			})

			setRankName('')
		},

		variables: {
			name: rankName,
			value: rankValue,
		},
	})

	const deleteRankMutation = useMutation(DELETE_RANK_MUTATION, {
		update: (cache, { data: { deleteRank } } ) => {
			const { ranks } = cache.readQuery({ query: QUERY })

			cache.writeQuery({
				data: {
					ranks: ranks.filter((rank) => {
						return rank.id !== deleteRank.id
					})
				},
				query: QUERY,
			})
		}
	})

	const {
		data: {
			ranks
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
							Add Rank
						</Typography>

						<form onSubmit={(e) => {
							e.preventDefault() 
							createRankMutation()
						}}>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<TextField
										fullWidth
										id="rankName"
										label="Name"
										name="rankName"
										onChange={(e) => {setRankName(e.target.value)}}
										required
										value={rankName}
									/>
								</Grid>

								<Grid item xs={12}>
									<TextField
										fullWidth
										id="rankValue"
										label="Value"
										name="rankValue"
										onChange={(e) => {setRankValue(parseInt(e.target.value))}}
										required
										type="number"
										value={rankValue}
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
							List of Ranks
						</Typography>

						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Name</TableCell>
									<TableCell align="right">Value</TableCell>
									<TableCell align="right">Operations</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{ranks.map(rank => (
									<TableRow key={rank.id}>
										<TableCell>{rank.name}</TableCell>
										<TableCell align="right">{rank.value}</TableCell>
										<TableCell align="right">
											<IconButton 
												aria-label="Edit"
												component={Link}
												to={`${props.match.url}/edit/${rank.id}`}
											>
												<EditIcon />
											</IconButton>

											<IconButton
												aria-label="Delete"
												onClick={() => {
													if (window.confirm('Continue?')) {
														deleteRankMutation({variables:{id:rank.id}})
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