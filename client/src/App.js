import React, { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import { Switch, Route } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Footer from './components/Footer'
import styles from './styles/styles'

import Academies from './pages/academies/Academies'
import AcademyEdit from './pages/academies/AcademyEdit'
import Clans from './pages/clans/Clans'
import ClanEdit from './pages/clans/ClanEdit'
import Forms from './pages/forms/Forms'
import FormEdit from './pages/forms/FormEdit'
import Schools from './pages/schools/Schools'
import SchoolEdit from './pages/schools/SchoolEdit'
import Players from './pages/players/Players'
import PlayerEdit from './pages/players/PlayerEdit'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Tournaments from './pages/tournaments/Tournaments'
import TournamentEdit from './pages/tournaments/TournamentEdit'
import TournamentManage from './pages/tournaments/TournamentManage'
import Home from './pages/Home'

export default function App() {
	const classes = styles()

	const [open, setOpen] = useState(true)

	const handleDrawerClose = () => {
		setOpen(false)
	}
	
	const handleDrawerOpen = () => {
		setOpen(true)
	}

	return (
		<div className={classes.root}>
			<CssBaseline />

			<Header 
				open={open}
				handleTogglerClick={handleDrawerOpen}
			/>

			<Sidebar
				open={open}
				handleTogglerClick={handleDrawerClose}
			/>

			<main className={classes.content}>
				<div className={classes.appBarSpacer} />

				<Container maxWidth="lg" className={classes.container}>
					<Switch>
						<Route exact path="/" component={Home} />
						<Route exact path="/login" component={SignIn} />
						<Route exact path="/signup" component={SignUp} />
						<Route exact path="/academies" component={Academies} />
						<Route exact path="/academies/edit/:id" component={AcademyEdit} />
						<Route exact path="/schools" component={Schools} />
						<Route exact path="/schools/edit/:id" component={SchoolEdit} />
						<Route exact path="/clans" component={Clans} />
						<Route exact path="/clans/edit/:id" component={ClanEdit} />
						<Route exact path="/forms" component={Forms} />
						<Route exact path="/forms/edit/:id" component={FormEdit} />
						<Route exact path="/players" component={Players} />
						<Route exact path="/players/edit/:id" component={PlayerEdit} />
						<Route exact path="/tournaments" component={Tournaments} />
						<Route exact path="/tournaments/edit/:id" component={TournamentEdit} />
						<Route exact path="/tournaments/manage/:id" component={TournamentManage} />
					</Switch>
				</Container>

				<Footer />
			</main>
		</div>
	)
}