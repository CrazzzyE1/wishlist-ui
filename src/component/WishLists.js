import Grid from "@mui/material/Grid";
import Item from "./StyledItem";
import * as React from "react";
import Typography from "@mui/material/Typography";
import WishListsItemInfo from "./WishListsItemInfo";

function WishLists({onWishlistSelect, refreshKey}) {
    return (
        <Grid container spacing={3}>
            <Grid size={12}>
                <Item noshadow>
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: '24px',
                            color: 'text.secondary',
                            textAlign: 'left',
                            pl: '10px'
                        }}>
                        Списки:
                    </Typography>
                </Item>
            </Grid>
            <Grid size={12}>
                <WishListsItemInfo noshadow
                                   onWishlistSelect={onWishlistSelect}
                                   refreshKey={refreshKey}
                />
            </Grid>
        </Grid>
    );
}

export default WishLists;