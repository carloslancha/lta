import { AUTH_TOKEN } from '../constants'
import { makeStyles } from '@material-ui/core/styles'
import { Mutation } from 'react-apollo'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import gql from 'graphql-tag'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

const SIGNUP_MUTATION = gql`
	mutation SignUpMutation($name: String!, $email: String!, $password: String!) {
		signup(name: $name, email: $email, password: $password) {
			token
		}
	}
`

const useStyles = makeStyles(theme => ({
	'@global': {
		body: {
			backgroundColor: theme.palette.common.white,
		},
	},
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}))

export default function SignUp(props) {
	const classes = useStyles()

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />

			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>

				<Typography component="h1" variant="h5">
					Sign up
				</Typography>

				<form className={classes.form} noValidate>
					<TextField
						autoFocus
						fullWidth
						id="name"
						label="Name"
						margin="normal"
						name="name"
						onChange={(e) => {setName(e.target.value)}}
						required
						variant="outlined"
						/>

					<TextField
						fullWidth
						id="email"
						label="Email Address"
						margin="normal"
						name="email"
						onChange={(e) => {setEmail(e.target.value)}}
						required
						variant="outlined"
						/>

					<TextField
						fullWidth
						id="password"
						label="Password"
						margin="normal"
						name="password"
						onChange={(e) => {setPassword(e.target.value)}}
						required
						type="password"
						variant="outlined"
					/>

					<Mutation
						mutation={SIGNUP_MUTATION}
						variables={{ name, email, password }}
						onCompleted={data => {
							const { token } = data.signup 
							localStorage.setItem(AUTH_TOKEN, token)
							props.history.push(`/`)
						}}
					>
						{mutation => (
							<Button
								type="button"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
								onClick={mutation}
							>
								Sign Up
							</Button>
						)}
					</Mutation>

					<Grid container justify="flex-end">
						<Grid item>
							<Link href="/login" variant="body2">
								Already have an account? Sign in
							</Link>
						</Grid>
					</Grid>
				</form>
			</div>
		</Container>
	)
}