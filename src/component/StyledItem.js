import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const StyledItem = styled(Paper)(({ theme, noshadow }) => ({
    backgroundColor: '#fff',
    boxShadow: noshadow ? 'none' : theme.shadows[1],
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    border: 'none',
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

export default function Item({ children, noshadow = false }) {
    return <StyledItem noshadow={noshadow}>{children}</StyledItem>;
}