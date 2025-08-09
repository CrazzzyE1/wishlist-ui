import GiftCard from "./GiftCard";

function WishList({data}) {
    console.log('Received data in WishList:', data);

    if (!data) return <div>В этом списке нет подарков</div>;
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
                    key={item.id || index}
                    data={item}
                />
            ))}
        </div>
    );
}

export default WishList;