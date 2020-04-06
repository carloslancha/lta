import { useQuery, useSubscription } from 'react-apollo-hooks'
import CircularProgress from '@material-ui/core/CircularProgress'
import gql from 'graphql-tag'
import Grid from '@material-ui/core/Grid'
import React, { useEffect, useState } from 'react'
import styles from '../../styles/styles'


const QUERY = gql`
	query Arena($id: ID!) {
        arena(id: $id) {
            name
            player1 {
                name
                familyName
                nickname
                clan {
                    school {
                        academy {
                            name
                        }
                    }
                }
            }
            player2 {
                name
                familyName
                nickname
                clan {
                    school {
                        academy {
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

const ARENAS_SUBSCRIPTION = gql`
    subscription arenaUpdated {
        arenaUpdated{
            name
            player1 {
                name
                familyName
                nickname
                clan {
                    school {
                        academy {
                            name
                        }
                    }
                }
            }
            player2 {
                name
                familyName
                nickname
                clan {
                    school {
                        academy {
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

export default function Streaming(props) {
	//const classes = styles()

    const id = props.match.params.id
    
    const [player1Name, setPlayer1Name] = useState()
    const [player1FamilyName, setPlayer1FamilyName] = useState()
    const [resultPlayer1, setResultPlayer1] = useState()

    const [player2Name, setPlayer2Name] = useState()
    const [player2FamilyName, setPlayer2FamilyName] = useState()
    const [resultPlayer2, setResultPlayer2] = useState()

	const {
		data: {
			arena,
		},
		loading,
		error,
	} = useQuery(QUERY, {
		variables: {
			id
		},
    })

    const { 
        data,
    } = useSubscription(
        ARENAS_SUBSCRIPTION,
//      { variables: { repoFullName } }
    );

    useEffect(() => {
		if (arena) {
            setPlayer1Name(arena.player1.name)
            setPlayer1FamilyName(arena.player1.familyName)
            setResultPlayer1(arena.resultPlayer1)

            setPlayer2Name(arena.player2.name)
            setPlayer2FamilyName(arena.player2.familyName)
            setResultPlayer2(arena.resultPlayer2)
		}
    }, [arena])

    useEffect(() => {
		if (data && data.arenaUpdated) {
            setPlayer1Name(data.arenaUpdated.player1.name)
            setPlayer1FamilyName(data.arenaUpdated.player1.familyName)
            setResultPlayer1(data.arenaUpdated.resultPlayer1)

            setPlayer2Name(data.arenaUpdated.player2.name)
            setPlayer2FamilyName(data.arenaUpdated.player2.familyName)
            setResultPlayer2(data.arenaUpdated.resultPlayer2)
		}
    }, [data])

    console.log(data)

	if (loading) {
		return (
			<div align="center"><CircularProgress /></div>
		)
	}

	if (error) return `Error! ${error.message}`

	return (
        <div>
             {`${player1Name} ${player1FamilyName} - ${resultPlayer1}`}
             {`${player2Name} ${player2FamilyName} - ${resultPlayer2}`}
		</div>
	)
}