import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import { useMutation, useQuery } from 'react-apollo-hooks'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import clsx from 'clsx';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import gql from 'graphql-tag'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper'
import React, { useEffect, useState } from 'react'
import styles from '../../styles/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'

const QUERY = gql`
	query Tournament($id: ID!) {
		tournament(id: $id) {
			id
			name
			poules {
				id
				matches {
					id
					order
					player1 {
						name
						familyName
						nickname
						clan {
							name
						}
					}
					player2 {
						name
						familyName
						nickname
						clan {
							name
						}
					}
				}
				name
				players {
					id
					name
					familyName
					nickname
					clan {
						name
						school {
							academy {
								name
							}
						}
					}
				}
			}
		}
	}
`

const GENERATE_TOURNAMENT_POULES_MUTATION = gql`
	mutation GenerateTournamentPoulesMutation($tournamentId: ID!) {
		generateTournamentPoules(tournamentId: $tournamentId) {
			id
			name
			poules {
				id
				matches {
					id
					order
					player1 {
						name
						familyName
						nickname
						clan {
							name
						}
					}
					player2 {
						name
						familyName
						nickname
						clan {
							name
						}
					}
				}
				name
				players {
					id
					name
					familyName
					nickname
					clan {
						name
						school {
							academy {
								name
							}
						}
					}
				}
			}
		}
	}
`

const useStyles = makeStyles(theme => ({
	expandOpen: {
		transform: 'rotate(180deg)',
	},
}));

function Poule(props) {
	const classes = useStyles();

	const poule = props.poule

	const [expanded, setExpanded] = React.useState(false);

	return (
		<Grid item xs={12}>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Typography component="h2" variant="h6" align="center">
						{poule.name}
					</Typography>

					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Combat name</TableCell>
								<TableCell>Clan</TableCell>
								<TableCell>Academy</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{poule.players.map(player => (
								<TableRow key={player.id}>
									<TableCell>{`${player.name} ${player.familyName}`}</TableCell>
									<TableCell>{player.nickname}</TableCell>
									<TableCell>{player.clan.name}</TableCell>
									<TableCell>{player.clan.school.academy.name}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Grid>

				<Grid item xs={12}>
					<Button
						aria-expanded={expanded}
						aria-label="Show more"
						
						onClick={() => {
							setExpanded(!expanded)
						}}
					>
						Show matches 
						<ExpandMoreIcon className={clsx(classes.expand, {
							[classes.expandOpen]: expanded,
						})} />
					</Button>

					<Collapse in={expanded} timeout="auto" unmountOnExit>
						<Table>
							<TableBody>
								{poule.matches.map(match => (
									<TableRow key={match.id}>
										<TableCell>#{match.order}</TableCell>
										<TableCell>{`${match.player1.name} ${match.player1.familyName} - ${match.player1.nickname}`}</TableCell>
										<TableCell>vs</TableCell>
										<TableCell>{`${match.player2.name} ${match.player2.familyName} - ${match.player2.nickname}`}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Collapse>
				</Grid>
			</Grid>
		</Grid>
	)
}

export default function TournamentManage(props) {
	const classes = styles()
	
	const id = props.match.params.id

	const [generating, setGenerating] = useState()
	
	const generateTournamentPoules = useMutation(GENERATE_TOURNAMENT_POULES_MUTATION, {
		update: () => {
			setGenerating(false)
		},

		variables: {
			tournamentId: id,
		},
	})

	const {
		data: {
			tournament,
		},
		error,
		loading,
	} = useQuery(QUERY, {
		variables: {
			id
		},
	})

	if (loading || generating) {
		return (
			<div align="center"><CircularProgress /></div>
		)
	}

	if (error) return `Error! ${error.message}`

	return (
		<div>
			<Typography component="h1" variant="h5" align="center">
				Manage Tournament: {tournament.name}
			</Typography>

			<div className={classes.gridSpacer} />

			<Grid container>
				<Grid item xs={12}>
					<Paper className={classes.paper}>
						<Typography component="h1" variant="h5" align="center">
							Poules
						</Typography>

						<div className={classes.gridSpacer} />

						<Grid container spacing={3}>
							{tournament.poules.length === 0 ?
								<Grid item xs={12} align="center">
									<Button
										color="primary"
										onClick={() => {
											setGenerating(true)
											generateTournamentPoules()
										}}
										type="button"
										variant="contained"
									>
										Generate Poules
									</Button>
								</Grid>
								:
								tournament.poules.map(poule => (
									<Poule poule={poule} key={poule.id} />
								))
							}
						</Grid>
					</Paper>
				</Grid>
			</Grid>
		</div>
	)
}