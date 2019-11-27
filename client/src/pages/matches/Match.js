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
import TextField from '@material-ui/core/TextField'

const QUERY = gql`
	query Match($id: ID!) {
		match(id: $id) {
			duration
			id
			order
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
			styleResultPlayer1
			styleResultPlayer2
			nextMatch {
				id
			}
	}
}
`

const UPDATE_MATCH_MUTATION = gql`
	mutation UpdateMatchMutation($id: ID!, $resultPlayer1: Int!, $resultPlayer2: Int!, $styleResultPlayer1: Float!, $styleResultPlayer2: Float!) {
		updateMatch(id: $id, resultPlayer1: $resultPlayer1, resultPlayer2: $resultPlayer2, styleResultPlayer1: $styleResultPlayer1, styleResultPlayer2: $styleResultPlayer2) {
			duration
			id
			order
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
			styleResultPlayer1
			styleResultPlayer2
			nextMatch {
				id
			}
		}
	}
`

export default function Match(props) {
	const classes = styles()

	const id = props.match.params.id

	const [matchNumber, setMatchNumber] = useState('')
	const [nextMatch, setNextMatch] = useState('')
	const [resultPlayer1, setResultPlayer1] = useState()
	const [resultPlayer2, setResultPlayer2] = useState()
	const [styleResultPlayer1, setStyleResultPlayer1] = useState('')
	const [styleResultPlayer2, setStyleResultPlayer2] = useState('')

	const UpdateMatchMutation = useMutation(UPDATE_MATCH_MUTATION, {
		update: () => {
			if (nextMatch){
				props.history.push(`/matches/${nextMatch.id}`)
			}
			else {
				props.history.push(`/tournaments/play/${nextMatch.id}`)
			}
		},

		variables: { 
			id,
			resultPlayer1: resultPlayer1,
			resultPlayer2: resultPlayer2,
			styleResultPlayer1: parseFloat(styleResultPlayer1),
			styleResultPlayer2: parseFloat(styleResultPlayer2)
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
			setMatchNumber(match.order)
			setNextMatch(match.nextMatch)
			setResultPlayer1(match.resultPlayer1)
			setResultPlayer2(match.resultPlayer2)
			setStyleResultPlayer1(match.styleResultPlayer1)
			setStyleResultPlayer2(match.styleResultPlayer2)
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
							Match #{matchNumber}
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

								<Grid item xs={5}>
									<Typography component="h2" variant="h5" align="center">
										Style
									</Typography>

									<TextField
										fullWidth
										id="styleResultPlayer1"
										name="styleResultPlayer1"
										onChange={event => { setStyleResultPlayer1(event.target.value.replace(',','.'))}}
										required
										type="number"
										value={styleResultPlayer1}
									/>
								</Grid>

								<Grid item xs={2}>
								</Grid>

								<Grid item xs={5}>
									<Typography component="h2" variant="h5" align="center">
										Style
									</Typography>

									<TextField
										fullWidth
										id="styleResultPlayer2"
										name="styleResultPlayer2"
										onChange={event => { setStyleResultPlayer2(event.target.value.replace(',','.'))}}
										required
										type="number"
										value={styleResultPlayer2}
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