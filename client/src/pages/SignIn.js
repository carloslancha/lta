import { AUTH_TOKEN } from '../constants'
import { makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const SIGNIN_MUTATION = gql`
	mutation SignInMutation($email: String!, $password: String!) {
		login(email: $email, password: $password) {
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

export default function SignIn(props) {
	const classes = useStyles()

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
					Sign in
				</Typography>

				<form className={classes.form} noValidate>
					<TextField
						autoComplete="email"
						autoFocus
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

					<FormControlLabel
						control={<Checkbox value="remember" color="primary" />}
						label="Remember me"
					/>

					<Mutation
						mutation={SIGNIN_MUTATION}
						variables={{ email, password }}
						onCompleted={data => {
							const { token } = data.login 
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
								Sign In
							</Button>
						)}
					</Mutation>

					<Grid container>
						<Grid item xs>
							<Link href="#" variant="body2">
								Forgot password?
							</Link>
						</Grid>

						<Grid item>
							<Link href="/signup" variant="body2">
							{"Don't have an account? Sign Up"}
							</Link>
						</Grid>
					</Grid>
				</form>
			</div>
		</Container>
	)
}