import { Link } from 'react-router-dom'
import { useQuery } from 'react-apollo-hooks'
import CircularProgress from '@material-ui/core/CircularProgress'
import gql from 'graphql-tag'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import React from 'react'
import styles from '../../styles/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'

const QUERY = gql`
	{
		arenas {
			id
			name
		}
	}
`

export default function Arenas(props) {
	const classes = styles()

	const { 
		data: {
			arenas
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
			<Grid container>
				<Grid item xs={12}>
					<Paper className={classes.paper}>
						<Typography component="h1" variant="h5" align="center">
							List of Arenas
						</Typography>

						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Name</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{arenas.map(arena => (
									<TableRow key={arena.id}>
										<TableCell>
											<Link
												to={`${props.match.url}/${arena.id}`}
											>{arena.name}
											</Link>
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