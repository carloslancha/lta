import { Link } from 'react-router-dom'
import { useQuery } from 'react-apollo-hooks'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControl from '@material-ui/core/FormControl'
import gql from 'graphql-tag'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import React, { useState } from 'react'
import Select from '@material-ui/core/Select'
import styles from '../../styles/styles'
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
			}
            rounds {
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
                roundType
            }
		}
	}
`

function MatchesList(props) {
    const matches = props.matches

    return (
        <Grid item xs={12}>
            <FormControl fullWidth>
                <InputLabel htmlFor="tournamentPlayers">Match</InputLabel>

                <Select
                    onChange={props.onSelectedMatch}
                    value={props.selectedMatch}
                >
                    {matches.map(match => (
                        match.player1 && match.player2 &&
                        <MenuItem 
                            key={match.id}
                            value={match.id}
                        >
                            {
                                `
                                    #${match.order}
                                     - 
                                    ${match.player1.name} ${match.player1.familyName} (${match.player1.nickname})
                                    vs
                                    ${match.player2.name} ${match.player2.familyName} (${match.player2.nickname})
                                    `
                            }
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
    )
}

export default function TournamentPlay(props) {
	const classes = styles()
	
    const id = props.match.params.id
    
    const [selectedRound, setSelectedRound] = useState('')
    const [selectedMatch, setSelectedMatch] = useState('')

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
                            Play Tournament: {tournament.name}
						</Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="tournamentPlayers">Poule</InputLabel>

                                    <Select
                                        onChange={(e) => {
                                            setSelectedRound(e.target.value)
                                            setSelectedMatch('')
                                        }}
                                        value={selectedRound}
                                    >
                                        {tournament.poules.map(poule => (
                                            <MenuItem 
                                                key={poule.id}
                                                value={poule.id}
                                            >
                                                {poule.name}
                                            </MenuItem>
                                        ))}

                                        {tournament.rounds.map(round => (
                                            <MenuItem 
                                                key={round.id}
                                                value={round.id}
                                            >
                                                {round.roundType}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {selectedRound ?
                                <MatchesList
                                    onSelectedMatch={(e) => {
                                        setSelectedMatch(e.target.value)
                                    }}
                                    matches={(tournament.poules.find(poule => poule.id === selectedRound) || tournament.rounds.find(round => round.id === selectedRound)).matches}
                                    selectedMatch={selectedMatch}
                                />
                                :
                                ''
                            }

                            {selectedMatch ?
                                <Grid item xs={12} align="center">
                                    <Button
                                        component={Link}
                                        color="primary"
                                        type="button"
                                        to={`/matches/${selectedMatch}`}
                                        variant="contained"
                                    >
                                        Go!
                                    </Button>						
                                </Grid>
                                :
                                ''
                            }
				        </Grid>
					</Paper>
				</Grid>
			</Grid>
		</div>
	)
}