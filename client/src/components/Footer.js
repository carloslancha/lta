import Link from '@material-ui/core/Link'
import React from 'react'
import Typography from '@material-ui/core/Typography'

export default function Footer() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{'Built by '}
			<Link color="inherit" href="https://twitter.com/carloslancha">
				@carloslancha
			</Link>
		</Typography>
	)
  }
  