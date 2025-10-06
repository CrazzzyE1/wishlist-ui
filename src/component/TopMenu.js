import SearchLine from "./SearchLine";
import AccountSettingToggle from "./AccountSettingToggle";
import * as React from "react";
import Grid from "@mui/material/Grid";
import Item from "./StyledItem";
import Logo from "./Logo";

function TopMenu({onProfileEdit}) {
    return (
        <Grid container spacing={0}>
            <Grid
                size={{xs: 2, sm: 2}}
            >
                <Logo/>
            </Grid>
            <Grid size={{xs: 6, sm: 7}}>
                <Item noshadow>
                    <SearchLine/>
                </Item>
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