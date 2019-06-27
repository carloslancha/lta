import { useMutation, useQuery } from 'react-apollo-hooks'
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import gql from 'graphql-tag'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import React, { useEffect, useState } from 'react'
import RemoveIcon from '@material-ui/icons/Remove';
import styles from '../../styles/styles'
import Typography from '@material-ui/core/Typography'

const QUERY = gql`
	query Match($id: ID!) {
		match(id: $id) {
			duration
			id
			player1 {
				id
				name
				familyName
				nickname
				clan {
					id
					name
				}
			}
			player2 {
				id
				name
				familyName
				nickname
				clan {
					id
					name
				}
			}
			resultPlayer1
			resultPlayer2
	}
}
`

const UPDATE_MATCH_MUTATION = gql`
	mutation UpdateMatchMutation($id: ID!, $resultPlayer1: Int!, $resultPlayer2: Int!) {
		updateMatch(id: $id, resultPlayer1: $resultPlayer1, resultPlayer2: $resultPlayer2) {
			duration
			id
			player1 {
				id
				name
				familyName
				nickname
				clan {
					id
					name
				}
			}
			player2 {
				id
				name
				familyName
				nickname
				clan {
					id
					name
				}
			}
			resultPlayer1
			resultPlayer2
		}
	}
`

export default function Match(props) {
	const classes = styles()

	const id = props.match.params.id

	const [resultPlayer1, setResultPlayer1] = useState()
	const [resultPlayer2, setResultPlayer2] = useState()

	const UpdateMatchMutation = useMutation(UPDATE_MATCH_MUTATION, {
		update: () => {
			props.history.goBack()
		},

		variables: { 
			id,
			resultPlayer1: resultPlayer1,
			resultPlayer2: resultPlayer2,
		},
	})

	const { 
		data: {
			match
		},
		error,
		loading,
	} = useQuery(QUERY, {
		variables: {
			id
		},
	})

	useEffect(() => {
		if (match) {
			setResultPlayer1(match.resultPlayer1)
			setResultPlayer2(match.resultPlayer2)
		}
	}, [match])

	if (loading) {
		return (
			<div align="center"><CircularProgress /></div>
		)
	}

	if (error) return `Error! ${error.message}`

	return (
		<div>
			<Grid container justify="center" alignContent="center">
				<Grid item xs={12}>
					<Paper className={classes.paper}>
						<Typography component="h1" variant="h5" align="center">
							
						</Typography>

						<form onSubmit={(e) => {
							e.preventDefault() 
							UpdateMatchMutation()
						}}>

							<Grid container spacing={3}>
								<Grid item xs={5}>
									<Typography component="h2" variant="h6" align="center">
										{`${match.player1.name} ${match.player1.familyName} (${match.player1.nickname})`}
									</Typography>
								</Grid>

								<Grid item xs={2}>
									<Typography component="h2" variant="h6" align="center">
										VS
									</Typography>
								</Grid>

								<Grid item xs={5}>
									<Typography component="h2" variant="h6" align="center">
										{`${match.player2.name} ${match.player2.familyName} (${match.player2.nickname})`}
									</Typography>
								</Grid>
							</Grid>

							<Grid container spacing={3}>
								<Grid item xs={5}>
									<Typography component="h2" variant="h3" align="center">
										<Button
											className={classes.matchResultButton}
											color="primary"
											onClick={() => {
												if (resultPlayer1 !== 0)
													setResultPlayer1(resultPlayer1-1)
											}}
											type="button"
											variant="contained"
											>
											<RemoveIcon />
										</Button>

										{resultPlayer1}

										<Button
											className={classes.matchResultButton}
											color="primary"
											onClick={() => {
												setResultPlayer1(resultPlayer1+1)
											}}
											type="button"
											variant="contained"
										>
											<AddIcon />
										</Button>
									</Typography>
								</Grid>

								<Grid item xs={2}>
								</Grid>

								<Grid item xs={5}>
									<Typography component="h2" variant="h3" align="center">
										<Button
											className={classes.matchResultButton}
											color="primary"
											onClick={() => {
												if (resultPlayer2 !== 0)
													setResultPlayer2(resultPlayer2-1)
											}}
											type="button"
											variant="contained"
											>
											<RemoveIcon />
										</Button>

										{resultPlayer2}

										<Button
											className={classes.matchResultButton}
											color="primary"
											onClick={() => {
												setResultPlayer2(resultPlayer2+1)
											}}
											type="button"
											variant="contained"
										>
											<AddIcon />
										</Button>
									</Typography>
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