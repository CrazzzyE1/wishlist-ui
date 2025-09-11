import SearchLine from "./SearchLine";
import AccountSettingToggle from "./AccountSettingToggle";
import * as React from "react";
import Grid from "@mui/material/Grid";
import Item from "./StyledItem";
import Logo2 from "./Logo2";

function TopMenu({onProfileEdit}) {
    return (
        <Grid container size={{xs: 12, sm: 12}} spacing={0}>
            <Grid size={{xs: 2, sm: 2}}>
                <Item noshadow>
                    <Logo2/>
                </Item>
            </Grid>
            <Grid size={{xs: 6, sm: 7}}>
                <Item noshadow><SearchLine/></Item>
            </Grid>
            <Grid size={{xs: 4, sm: 3}}>
                <Item noshadow>
                    <AccountSettingToggle
                        onProfileEdit={onProfileEdit}
                    />
                </Item>
            </Grid>
        </Grid>
    );
}

export default TopMenu;