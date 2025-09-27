import Grid from "@mui/material/Grid";
import Item from "./StyledItem";
import * as React from "react";
import Typography from "@mui/material/Typography";
import WishListsItemInfo from "./WishListsItemInfo";

function WishLists({onWishlistSelect, refreshKey, selectedWishlistId, onListGetting, userId}) {
    return (
        <Grid container
              sx={{flexGrow: 1}}
              spacing={{xs: 1, sm: 2}}
        >
            <Grid size={{xs: 12, sm: 12}}>
                <Item noshadow>
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: {xs: '0.65rem', sm: '1rem'},
                            color: 'text.secondary',
                            textAlign: 'left',
                            pl: '10px'
                        }}>
                        Списки:
                    </Typography>
                </Item>
            </Grid>
            <Grid size={{xs: 12, sm: 12}}>
                <WishListsItemInfo noshadow
                                   userId={userId}
                                   onListGetting={onListGetting}
                                   onWishlistSelect={onWishlistSelect}
                                   refreshKey={refreshKey}
                                   selectedWishlistId={selectedWishlistId}
                />
            </Grid>
        </Grid>
    );
}

export default WishLists;