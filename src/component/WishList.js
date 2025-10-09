import GiftCard from "./GiftCard";
import {Box} from "@mui/material";

function WishList({data, isOwner, onGiftDeleted, onGiftEdit, lists}) {

    if (!data) return <div>В этом списке нет желаний</div>;
    if (!Array.isArray(data)) return <div>Данные не являются массивом</div>;
    if (data.length === 0) return <div>Список пуст</div>;

    return (

        <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
                xs: 'repeat(auto-fill, minmax(140px, 1fr))',
                sm: 'repeat(auto-fill, minmax(170px, 1fr))',
                md: 'repeat(auto-fill, minmax(200px, 1fr))'
            },
            gap: 1,
            padding: 0,
            width: '100%'
        }}>
            {data.map((item, index) => (
                <GiftCard
                    onGiftDeleted={onGiftDeleted}
                    onGiftEdit={onGiftEdit}
                    isOwner={isOwner}
                    key={item.id || index}
                    data={item}
                    lists={lists}
                />
            ))}
        </Box>
    );
}

export default WishList;