import AssignmentIcon from '@material-ui/icons/Assignment'
import PersonIcon from '@material-ui/icons/Person'
import SchoolIcon from '@material-ui/icons/School'
import BarChartIcon from '@material-ui/icons/BarChart'
import Filter9Icon from '@material-ui/icons/Filter9'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import clsx from 'clsx'
import DashboardIcon from '@material-ui/icons/Dashboard'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import LayersIcon from '@material-ui/icons/Layers'
import { Link } from 'react-router-dom'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import PeopleIcon from '@material-ui/icons/People'
import FlagIcon from '@material-ui/icons/Flag'
import React from 'react'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import styles from '../styles/styles'

export const mainListItems = (
	<div>
		<ListItem button component={Link} to="/">
			<ListItemIcon>
				<DashboardIcon />
			</ListItemIcon>
			<ListItemText primary="Dashboard" />
		</ListItem>

		<ListItem button component={Link} to="/">
			<ListItemIcon>
				<ShoppingCartIcon />
			</ListItemIcon>
			<ListItemText primary="Orders" />
		</ListItem>

		<ListItem button component={Link} to="/">
			<ListItemIcon>
				<PeopleIcon />
			</ListItemIcon>
			<ListItemText primary="Customers" />
		</ListItem>

		<ListItem button component={Link} to="/">
			<ListItemIcon>
				<BarChartIcon />
			</ListItemIcon>
			<ListItemText primary="Reports" />
		</ListItem>

		<ListItem button component={Link} to="/">
			<ListItemIcon>
				<LayersIcon />
			</ListItemIcon>
			<ListItemText primary="Integrations" />
		</ListItem>
	</div>
)

export const adminListItems = (
	<div>
		<ListSubheader inset>Admin</ListSubheader>

		<ListItem button component={Link} to="/academies">
			<ListItemIcon>
				<FlagIcon />
			</ListItemIcon>
			<ListItemText primary="Academies" />
		</ListItem>

		<ListItem button component={Link} to="/schools">
			<ListItemIcon>
				<SchoolIcon />
			</ListItemIcon>
			<ListItemText primary="Schools" />
		</ListItem>

		<ListItem button component={Link} to="/clans">
			<ListItemIcon>
				<AssignmentIcon />
			</ListItemIcon>
			<ListItemText primary="Clans" />
		</ListItem>

		<ListItem button component={Link} to="/forms">
			<ListItemIcon>
				<Filter9Icon />
			</ListItemIcon>
			<ListItemText primary="Forms" />
		</ListItem>

		<ListItem button component={Link} to="/players">
			<ListItemIcon>
				<PersonIcon />
			</ListItemIcon>
			<ListItemText primary="Players" />
		</ListItem>
	</div>
)

export default function Sidebar(props) {
	const classes = styles()

	const {open} = props

	return (
		<Drawer
			variant="permanent"
			classes={{
				paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
			}}
			open={open}
		>
			<div className={classes.closeSidebarIcon}>
				<IconButton onClick={props.handleTogglerClick}>
					<ChevronLeftIcon />
				</IconButton>
			</div>

			<Divider />

			<List>{mainListItems}</List>

			<Divider />
		
			<List>{adminListItems}</List>
		</Drawer>
	)
}