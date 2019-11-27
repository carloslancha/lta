import { makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
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
import { useAuth } from "../context/auth";
import { Redirect } from "react-router-dom";

const LOGIN_MUTATION = gql`
	mutation LoginMutation($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token,
			user {
				name
			}
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

export default function Login(props) {
	const classes = useStyles()

	const { authToken, setToken } = useAuth();

	const [email, setEmail] = useState('')
	const [isLoggedIn, setLoggedIn] = useState(!!authToken);
	const [isError, setError] = useState(false)
	const [password, setPassword] = useState('')

	if (isLoggedIn) {
		return <Redirect to="/" />;
	}
	
	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />

			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>

				<Typography component="h1" variant="h5">
					Login
				</Typography>

				<form className={classes.form} noValidate>
					<TextField
						error={isError}
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
						error={isError}
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
						mutation={LOGIN_MUTATION}
						variables={{ email, password }}
						onCompleted={data => {
							setToken({
								token:data.login.token,
								userName: data.login.user.name
							});
							setLoggedIn(true);
						}}
						onError={() => {
							setError(true)
						}}
					>
						{mutation => (
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
								onClick={(e) => {
									e.preventDefault()
									mutation()
								}}
							>
								Login
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