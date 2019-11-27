import { createHttpLink } from 'apollo-link-http'

export const AUTH_TOKEN = 'auth-token'

export const HTTP_LINK = createHttpLink({
	//uri: 'https://tokyo-dynamo-245009.appspot.com/'
	uri: 'http://localhost:4000'
})