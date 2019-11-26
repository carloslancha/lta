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
	query Rank($id: ID!) {
		rank(id: $id) {
			id
			name
			value
	}
}
`

const UPDATE_RANK_MUTATION = gql`
	mutation UpdateRankMutation($id: ID!, $name: String!, $value: Int!) {
		updateRank(id: $id, name: $name, value: $value) {
			id
			name
			value
		}
	}
`

export default function RankEdit(props) {
	const classes = styles()

	const id = props.match.params.id
	const [rankName, setRankName] = useState('')
	const [rankValue, setRankValue] = useState(0)

	const UpdateRankMutation = useMutation(UPDATE_RANK_MUTATION, {
		update: () => {
			props.history.push(`/ranks`)
		},

		variables: {
			id,
			name: rankName,
			value: rankValue,
		},
	})

	const {
		data: {
			rank
		},
		error,
		loading,
	} = useQuery(QUERY, {
		variables: {
			id
		},
	})

	useEffect(() => {
		if (rank) {
			setRankName(rank.name)
			setRankValue(rank.value)
		}
	}, [rank])

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
							Edit Rank
						</Typography>

						<form onSubmit={(e) => {
							e.preventDefault() 
							UpdateRankMutation()
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