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
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';


const QUERY = gql`
	query Arena($id: ID!) {
        arena(id: $id) {
            name
            player1 {
                id
                name
                familyName
                nickname
                clan {
                    id
                    school {
                        id
                        academy {
                            id
                            name
                        }
                    }
                }
            }
            player2 {
                id
                name
                familyName
                nickname
                clan {
                    id
                    school {
                        id
                        academy {
                            id
                            name
                        }
                    }
                }
            }
            resultPlayer1
            resultPlayer2
        }

		players {
			id
			name
			familyName
			nickname
			clan {
				id
				name
				school {
					id
					name
					academy {
						id
						name
						country
					}
				}
			}
		}
	}
`

const UPDATE_ARENA_MUTATION = gql`
	mutation UpdateArenaMutation($id: ID!, $name: String!, $player1Id: ID!, $player2Id: ID!, $resultPlayer1: Int!, $resultPlayer2: Int!) {
		updateArena(id: $id, name: $name, player1Id: $player1Id, player2Id: $player2Id, resultPlayer1: $resultPlayer1, resultPlayer2: $resultPlayer2) {
			id
			name
            player1 {
                id
                name
                familyName
                nickname
                clan {
                    id
                    school {
                        id
                        academy {
                            id
                            name
                        }
                    }
                }
            }
            player2 {
                id
                name
                familyName
                nickname
                clan {
                    id
                    school {
                        id
                        academy {
                            id
                            name
                        }
                    }
                }
            }
            resultPlayer1
            resultPlayer2
		}
	}
`

export default function ArenaEdit(props) {
	const classes = styles()

	const id = props.match.params.id

	const [arenaName, setArenaName] = useState('')
	const [player1Id, setPlayer1Id] = useState('')
	const [player2Id, setPlayer2Id] = useState('')
	const [resultPlayer1, setResultPlayer1] = useState('')
	const [resultPlayer2, setResultPlayer2] = useState('')

	const UpdateArenaMutation = useMutation(UPDATE_ARENA_MUTATION, {
		variables: {
			id,
            name: arenaName,
            player1Id,
            player2Id,
            resultPlayer1,
            resultPlayer2
		},
	})

	const {
		data: {
			arena,
			players,
		},
		loading,
		error,
	} = useQuery(QUERY, {
		variables: {
			id
		},
	})

	useEffect(() => {
		if (arena) {
            setArenaName(arena.name)
            if (arena.player1)
                setPlayer1Id(arena.player1.id || '')
            if (arena.player2)            
                setPlayer2Id(arena.player2.id || '')
            setResultPlayer1(parseInt(arena.resultPlayer1))
            setResultPlayer2(parseInt(arena.resultPlayer2))
		}
    }, [arena])
    
    useEffect(() => {
        if (Number.isInteger(resultPlayer1) && Number.isInteger(resultPlayer2))
            UpdateArenaMutation()
    }, [resultPlayer1, resultPlayer2, UpdateArenaMutation])

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
							{arena.name}
						</Typography>

						<form onSubmit={(e) => {
							e.preventDefault() 
							UpdateArenaMutation()
						}}>
                            <Grid container spacing={3}>
                                <Grid item xs={5}>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="player1">Player 1</InputLabel>

                                        <Select
                                            onChange={(e) => {
                                                setPlayer1Id(e.target.value)
                                            }}
                                            value={player1Id}
                                        >
                                            {players.sort((a,b) => {
                                                if (a.name > b.name) 
                                                    return 1
                                                if (a.name < b.name)
                                                    return -1
                                                
                                                if (a.familyName > b.familyName) 
                                                    return 1
                                                if (a.familyName < b.familyName)
                                                    return -1
                                                return 0                                 
                                            }).map(player => (
                                                <MenuItem 
                                                    key={player.id}
                                                    value={player.id}
                                                >
                                                    {
                                                        `${player.name} ${player.familyName}`
                                                    }
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={2}></Grid>
                                
                                <Grid item xs={5}>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="player2">Player 2</InputLabel>

                                        <Select
                                            onChange={(e) => {
                                                setPlayer2Id(e.target.value)
                                            }}
                                            value={player2Id}
                                        >
                                            {players.sort((a,b) => {
                                                if (a.name > b.name) 
                                                    return 1
                                                if (a.name < b.name)
                                                    return -1
                                                
                                                if (a.familyName > b.familyName) 
                                                    return 1
                                                if (a.familyName < b.familyName)
                                                    return -1
                                                return 0                                         
                                            }).map(player => (
                                                <MenuItem 
                                                    key={player.id}
                                                    value={player.id}
                                                >
                                                    {
                                                        `${player.name} ${player.familyName}`
                                                    }
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
							</Grid>                           

                            <Grid container spacing={3}>
                                <Grid item xs={5}>
                                    <Typography component="h2" variant="h3" align="center">
                                        <Button
                                            className={classes.matchResultButton}
                                            color="primary"
                                            onClick={() => {
                                                if (resultPlayer1 !== 0) {
                                                    setResultPlayer1(resultPlayer1-1)
                                                }
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

                                <Grid item xs={2}></Grid>
 
                                <Grid item xs={5}>
                                    <Typography component="h2" variant="h3" align="center">
                                        <Button
                                            className={classes.matchResultButton}
                                            color="primary"
                                            onClick={() => {
                                                if (resultPlayer2 !== 0) {
                                                    setResultPlayer2(resultPlayer2-1)
                                                }
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
                            </Grid>
                        </form>
					</Paper>
				</Grid>
			</Grid>
		</div>
	)
}