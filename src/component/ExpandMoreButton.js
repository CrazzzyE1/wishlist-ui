import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {styled} from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import * as React from "react";


const ExpandMore = styled((props) => {
    const {expand, ...other} = props;
    return <IconButton
        sx={{
            width: {xs: 24, sm: 40},
            height: {xs: 24, sm: 40}
        }}
        {...other} />;
})(({theme}) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
    variants: [
        {
            props: ({expand}) => !expand,
            style: {
                transform: 'rotate(0deg)',
            },
        },
        {
            props: ({expand}) => !!expand,
            style: {
                transform: 'rotate(180deg)',
            },
        },
    ],
}));

export function ExpandMoreButton({description, expanded, onExpandClick}) {
    if (!description) return null;

    return (
        <ExpandMore
            expand={expanded}
            onClick={onExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
        >
            <ExpandMoreIcon
                sx={{
                    width: {xs: 20, sm: 24},
                    height: {xs: 20, sm: 24},
                }}
            />
        </ExpandMore>
    );
}