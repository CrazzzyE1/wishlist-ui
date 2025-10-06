import Grid from "@mui/material/Grid";
import * as React from "react";
import WishListsItemInfo from "./WishListsItemInfo";
import ListCreator from "./ListCreator";

function WishLists({onWishlistSelect, refreshKey, selectedWishlistId, onListGetting, userId, isOwner, onListCreated}) {
    return (
        <Grid container
              sx={{flexGrow: 1}}
              spacing={{xs: 2, sm: 2}}
        >
            {isOwner && (
                    <Grid size={{xs: 12, sm: 12}}
                          sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              mb: {sm: 1}
                          }}>
                        <ListCreator onListCreated={onListCreated}/>
                    </Grid>
            )}
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