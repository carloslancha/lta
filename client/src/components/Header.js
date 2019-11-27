import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
//import Badge from '@material-ui/core/Badge'
import clsx from 'clsx'
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
//import NotificationsIcon from '@material-ui/icons/Notifications'
import React, { useState } from 'react'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { useAuth } from "../context/auth";
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
	toolbar: {
		paddingRight: 24, // keep right padding when drawer closed
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginRight: 36,
	},
	menuButtonHidden: {
		display: 'none',
	},
	title: {
		flexGrow: 1,
	},
}))

export default function Header(props) {
	const classes = useStyles()

	const { authToken, setToken } = useAuth()

	const [anchorEl, setAnchorEl] = useState(null)

	const openMenu = Boolean(anchorEl)

	const {open} = props

	const handleClose = () => {
		setAnchorEl(null)
	};

	const handleMenu = event => {
		setAnchorEl(event.currentTarget)
	};

	const handleLogout = () => {
		setToken(null)
	}

	return (
		<AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
			<Toolbar className={classes.toolbar}>
				{authToken && (
					<IconButton
						edge="start"
						color="inherit"
						aria-label="Open drawer"
						onClick={props.handleTogglerClick}
						className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
					>
						<MenuIcon />
					</IconButton>
				)}

				<Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
					<Link  href="/" color="inherit" underline="none">LTA - LudoSport Tournament App</Link>
				</Typography>

				{!authToken &&
					<>
						<Link component={Button} href="/login" color="inherit">Login</Link>
						<Link component={Button} href="/signup" color="inherit">Sign Up</Link>
					</>
				}

				{authToken && (
					<div>
						
						<Button
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleMenu}
							color="inherit"
						>
							<span style={{marginRight: '1em'}}>{authToken.userName}</span>

							<AccountCircle/>
						</Button>
						<Menu
							id="menu-appbar"
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={openMenu}
							onClose={handleClose}
						>
							<MenuItem onClick={handleLogout}>Logout</MenuItem>
						</Menu>
					</div>
				)}
			</Toolbar>
		</AppBar>
	)
}