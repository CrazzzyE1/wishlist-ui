import Image from 'react-bootstrap/Image';
import SearchLine from "./SearchLine";
import AccountSettingToggle from "./AccountSettingToggle";
import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Item from "./StyledItem";
import {Logo} from "./Logo";

function TopMenu({avatarUrl}) {
    return (
        <Box sx={{flexGrow: 1, pl: 0}}>
            <Grid container spacing={1}>
                <Grid size={2}>
                    <Item noshadow>
                        <Logo />
                    </Item>
                </Grid>
                <Grid size={1}></Grid>
                <Grid size={6}>
                    <Item noshadow><SearchLine/></Item>
                </Grid>
                <Grid size={1}></Grid>
                <Grid size={2}>
                    <Item noshadow><AccountSettingToggle avatarUrl={avatarUrl}/></Item>
                </Grid>
            </Grid>
        </Box>
    );
}

export default TopMenu;