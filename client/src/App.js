import React, { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import { Route } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Footer from './components/Footer'
import styles from './styles/styles'

import Academies from './pages/academies/Academies'
import AcademyEdit from './pages/academies/AcademyEdit'
import StreamingArenas from './pages/streaming/Arenas'
import Streaming from './pages/streaming/Streaming'
import ArenaEdit from './pages/arenas/ArenaEdit'
import Arenas from './pages/arenas/Arenas'
import Clans from './pages/clans/Clans'
import ClanEdit from './pages/clans/ClanEdit'
import Forms from './pages/forms/Forms'
import Match from './pages/matches/Match'
import FormEdit from './pages/forms/FormEdit'
import Schools from './pages/schools/Schools'
import SchoolEdit from './pages/schools/SchoolEdit'
import Players from './pages/players/Players'
import PlayerEdit from './pages/players/PlayerEdit'
import Ranks from './pages/ranks/Ranks'
import RankEdit from './pages/ranks/RankEdit'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Tournaments from './pages/tournaments/Tournaments'
import TournamentEdit from './pages/tournaments/TournamentEdit'
import TournamentManage from './pages/tournaments/TournamentManage'
import TournamentPlay from './pages/tournaments/TournamentPlay'
import Home from './pages/Home'
import PrivateRoute from './PrivateRoute';
import { AuthContext } from "./context/auth";
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
import { BrowserRouter as Router } from 'react-router-dom'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { AUTH_TOKEN, HTTP_LINK } from './constants'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

export default function App() {
	const classes = styles()

	const [authToken, setAuthToken] = useState(JSON.parse(localStorage.getItem(AUTH_TOKEN)));
	const [open, setOpen] = useState(false)

	const handleDrawerClose = () => {
		setOpen(false)
	}
	
	const handleDrawerOpen = () => {
		setOpen(true)
	}

	const setToken = (data) => {
		localStorage.setItem(AUTH_TOKEN, JSON.stringify(data));
		setAuthToken(data);
	}

	const wsLink = new WebSocketLink({
		uri: `ws://localhost:4000`,
		options: {
			reconnect: true,
			connectionParams: {
				authToken: authToken ? authToken.token : '',
			}
		}
	})

	const authLink = setContext((_, { headers }) => {
		return {
			headers: {
				...headers,
				authorization: authToken ? `Bearer ${authToken.token}` : ''
			}
		}
	})

	const link = split(
		({ query }) => {
			const { kind, operation } = getMainDefinition(query)
			return kind === 'OperationDefinition' && operation === 'subscription'
		},
		wsLink,
		authLink.concat(HTTP_LINK)
	)

	const client = new ApolloClient({
		link,
		cache: new InMemoryCache()
	})

	return (
		<AuthContext.Provider value={{ authToken, setToken }}>
			<Router>
				<ApolloProvider client={client}>
					<ApolloHooksProvider client={client}>
						<div className={classes.root}>
							<CssBaseline />

							<Header 
								open={open}
								handleTogglerClick={handleDrawerOpen}
							/>

							<Sidebar
								open={open}
								handleTogglerClick={handleDrawerClose}
								onLinkClick={handleDrawerClose}
							/>

							<main className={classes.content}>
								<div className={classes.appBarSpacer} />

								<Container maxWidth="lg" className={classes.container}>
									<Route exact path="/" component={Home} />
									<Route exact path="/login" component={Login} />
									<Route exact path="/signup" component={SignUp} />
									<Route exact path="/streaming" component={StreamingArenas} />
									<Route exact path="/streaming/:id" component={Streaming} />
									<PrivateRoute exact path="/academies" component={Academies} />
									<PrivateRoute exact path="/academies/edit/:id" component={AcademyEdit} />
									<PrivateRoute exact path="/arenas" component={Arenas} />
									<PrivateRoute exact path="/arenas/edit/:id" component={ArenaEdit} />
									<PrivateRoute exact path="/schools" component={Schools} />
									<PrivateRoute exact path="/schools/edit/:id" component={SchoolEdit} />
									<PrivateRoute exact path="/clans" component={Clans} />
									<PrivateRoute exact path="/clans/edit/:id" component={ClanEdit} />
									<PrivateRoute exact path="/forms" component={Forms} />
									<PrivateRoute exact path="/forms/edit/:id" component={FormEdit} />
									<PrivateRoute exact path="/players" component={Players} />
									<PrivateRoute exact path="/players/edit/:id" component={PlayerEdit} />
									<PrivateRoute exact path="/ranks" component={Ranks} />
									<PrivateRoute exact path="/ranks/edit/:id" component={RankEdit} />
									<PrivateRoute exact path="/tournaments" component={Tournaments} />
									<PrivateRoute exact path="/tournaments/edit/:id" component={TournamentEdit} />
									<PrivateRoute exact path="/tournaments/manage/:id" component={TournamentManage} />
									<PrivateRoute exact path="/tournaments/play/:id" component={TournamentPlay} />
									<PrivateRoute exact path="/matches/:id" component={Match} />
								</Container>

								<Footer />
							</main>
						</div>
					</ApolloHooksProvider>
			</ApolloProvider>
		</Router>
	</AuthContext.Provider>
	)
}