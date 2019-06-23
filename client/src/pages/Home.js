import clsx from 'clsx'

import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import React from 'react'

import styles from '../styles/styles'

export default function Dashboard() {
    const classes = styles()

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

    return (
        <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
                <Paper className={fixedHeightPaper}>
                </Paper>
            </Grid>

            {/* Recent Deposits */}
            <Grid item xs={12} md={4} lg={3}>
                <Paper className={fixedHeightPaper}>
                </Paper>
            </Grid>

            {/* Recent Orders */}
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                </Paper>
            </Grid>
        </Grid>
    )
}
