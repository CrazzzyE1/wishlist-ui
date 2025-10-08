import SearchLine from "./SearchLine";
import AccountSettingToggle from "./AccountSettingToggle";
import * as React from "react";
import Grid from "@mui/material/Grid";
import Logo from "./Logo";

function TopMenu({onProfileEdit}) {
    return (
        <Grid container spacing={0}>
            <Grid
                size={{xs: 2, sm: 2}}
            >
                <Logo/>
            </Grid>
            <Grid size={{xs: 5, sm: 7}}>
                    <SearchLine/>
            </Grid>
            <Grid size={{xs: 5, sm: 3}}>
                    <AccountSettingToggle
                        onProfileEdit={onProfileEdit}
                    />
            </Grid>
        </Grid>
    );
}

export default TopMenu;