import GiftCard from "./GiftCard";

function WishList({data, isOwner, onGiftDeleted, onGiftEdit, lists}) {

    if (!data) return <div>В этом списке нет желаний</div>;
    if (!Array.isArray(data)) return <div>Данные не являются массивом</div>;
    if (data.length === 0) return <div>Список пуст</div>;

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'flex-start'
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
        </div>
    );
}

export default WishList;