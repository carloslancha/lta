import Link from '@material-ui/core/Link'
import React from 'react'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box';

export default function Footer() {
	return (
		<Box p={4} align="center">
			<Typography variant="body2" color="textSecondary" align="center">
				{'Built by '}
				<Link color="inherit" href="https://twitter.com/carloslancha">
					@carloslancha
				</Link>
			</Typography>
	    </Box>
	)
  }
  